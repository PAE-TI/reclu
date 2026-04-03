import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';
import { EvaluationType } from '@prisma/client';
import { getCreditSettings } from '@/lib/credits';
import { emailService } from '@/lib/email';
import { getAppBaseUrl } from '@/lib/site-url';

type EvalType = 'DISC' | 'DRIVING_FORCES' | 'EQ' | 'DNA' | 'ACUMEN' | 'VALUES' | 'STRESS';

interface ExistingEvaluation {
  type: EvalType;
  token: string;
}

interface PersonToAdd {
  email: string;
  name: string;
  evaluations: ExistingEvaluation[];
}

// POST - Add candidates from existing evaluations
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { people }: { people: PersonToAdd[] } = body;

    if (!people || !Array.isArray(people) || people.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos una persona para agregar' },
        { status: 400 }
      );
    }

    // Get owner ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, ownerId: true, role: true },
    });

    const ownerId = user?.role === 'FACILITATOR' && user?.ownerId ? user.ownerId : session.user.id;

    // Verify campaign belongs to user
    const campaign = await prisma.selectionCampaign.findFirst({
      where: { id, userId: ownerId },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    const campaignEvalTypes = campaign.evaluationTypes as EvalType[];
    
    // Get credit settings
    const creditSettings = await getCreditSettings();
    const creditsPerEvaluation = creditSettings.creditsPerEvaluation;

    // Get owner's credits
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { credits: true, name: true, company: true },
    });

    // Calculate total credits needed for missing evaluations
    let totalCreditsNeeded = 0;
    for (const person of people) {
      const existingTypes = new Set(person.evaluations.map(e => e.type));
      const missingTypes = campaignEvalTypes.filter(t => !existingTypes.has(t));
      totalCreditsNeeded += missingTypes.length * creditsPerEvaluation;
    }

    if ((owner?.credits || 0) < totalCreditsNeeded) {
      return NextResponse.json(
        { error: `Créditos insuficientes. Necesitas ${totalCreditsNeeded} créditos para las evaluaciones faltantes.` },
        { status: 400 }
      );
    }

    const results = {
      success: 0,
      duplicates: 0,
      errors: 0,
      details: [] as Array<{ email: string; status: string; message?: string }>,
    };

    const baseUrl = getAppBaseUrl();
    const senderName = owner?.company || owner?.name || 'Reclu';

    // Evaluation config for emails
    const EVALUATION_CONFIG: Record<string, { name: string; description: string; icon: string; color: string; questions: number; time: string; pathPrefix: string }> = {
      DISC: { name: 'DISC', description: 'Perfil de comportamiento y estilo de comunicación', icon: '🧠', color: '#3b82f6', questions: 24, time: '10-15 min', pathPrefix: '/external-evaluation/' },
      DRIVING_FORCES: { name: 'Fuerzas Motivadoras', description: 'Motivaciones internas y valores personales', icon: '🎯', color: '#8b5cf6', questions: 12, time: '8-10 min', pathPrefix: '/external-driving-forces-evaluation/' },
      EQ: { name: 'Inteligencia Emocional', description: 'Competencias emocionales y sociales', icon: '❤️', color: '#ec4899', questions: 25, time: '10-12 min', pathPrefix: '/external-eq-evaluation/' },
      DNA: { name: 'DNA-25 Competencias', description: 'Habilidades y competencias profesionales', icon: '🧬', color: '#14b8a6', questions: 25, time: '10-12 min', pathPrefix: '/external-dna-evaluation/' },
      ACUMEN: { name: 'Acumen (ACI)', description: 'Capacidad de juicio y toma de decisiones', icon: '✨', color: '#f59e0b', questions: 30, time: '12-15 min', pathPrefix: '/external-acumen-evaluation/' },
      VALUES: { name: 'Valores e Integridad', description: 'Principios y ética profesional', icon: '⚖️', color: '#7c3aed', questions: 25, time: '10-12 min', pathPrefix: '/external-values-evaluation/' },
      STRESS: { name: 'Estrés y Resiliencia', description: 'Manejo del estrés y capacidad de recuperación', icon: '🧘', color: '#f97316', questions: 25, time: '10-12 min', pathPrefix: '/external-stress-evaluation/' },
    };

    for (const person of people) {
      try {
        // Check if already in campaign
        const existing = await prisma.campaignCandidate.findFirst({
          where: { campaignId: id, email: person.email.toLowerCase() },
        });

        if (existing) {
          results.duplicates++;
          results.details.push({ email: person.email, status: 'duplicate', message: 'Ya existe en la campaña' });
          continue;
        }

        const existingTypesMap = new Map(person.evaluations.map(e => [e.type, e.token]));
        const missingTypes = campaignEvalTypes.filter(t => !existingTypesMap.has(t));

        const tokenExpiry = new Date();
        tokenExpiry.setDate(tokenExpiry.getDate() + 30);

        const evaluationTokens: Record<string, string> = {};
        const pendingEvaluationsForEmail: Array<{
          type: string;
          name: string;
          description: string;
          link: string;
          questions: number;
          time: string;
          icon: string;
          color: string;
        }> = [];

        // Set existing tokens
        for (const [type, token] of existingTypesMap) {
          evaluationTokens[type] = token;
        }

        // Create new evaluations for missing types
        for (const evalType of missingTypes) {
          const token = randomBytes(32).toString('hex');
          evaluationTokens[evalType] = token;

          const evalData = {
            title: `Evaluación para ${campaign.name}`,
            description: `Evaluación de candidato para el cargo: ${campaign.jobTitle}`,
            recipientName: person.name,
            recipientEmail: person.email.toLowerCase(),
            senderUserId: ownerId,
            token,
            tokenExpiry,
            status: 'PENDING',
          };

          switch (evalType) {
            case 'DISC':
              await prisma.externalEvaluation.create({ data: evalData });
              break;
            case 'DRIVING_FORCES':
              await prisma.externalDrivingForcesEvaluation.create({ data: evalData });
              break;
            case 'EQ':
              await prisma.externalEQEvaluation.create({ data: evalData });
              break;
            case 'DNA':
              await prisma.externalDNAEvaluation.create({ data: evalData });
              break;
            case 'ACUMEN':
              await prisma.externalAcumenEvaluation.create({ data: evalData });
              break;
            case 'VALUES':
              await prisma.externalValuesEvaluation.create({ data: evalData });
              break;
            case 'STRESS':
              await prisma.externalStressEvaluation.create({ data: evalData });
              break;
          }

          // Deduct credits
          await prisma.user.update({
            where: { id: ownerId },
            data: { credits: { decrement: creditsPerEvaluation } },
          });

          const ownerData = await prisma.user.findUnique({ where: { id: ownerId }, select: { credits: true } });
          await prisma.creditTransaction.create({
            data: {
              userId: ownerId,
              amount: -creditsPerEvaluation,
              type: 'EVALUATION_SENT',
              description: `Evaluación ${evalType} - Campaña: ${campaign.name}`,
              evaluationType: evalType as EvaluationType,
              evaluationId: token,
              balanceAfter: ownerData?.credits || 0,
              createdBy: session.user.id,
            },
          });

          // Add to email list
          const config = EVALUATION_CONFIG[evalType];
          pendingEvaluationsForEmail.push({
            type: evalType,
            name: config.name,
            description: config.description,
            link: `${baseUrl}${config.pathPrefix}${token}`,
            questions: config.questions,
            time: config.time,
            icon: config.icon,
            color: config.color,
          });
        }

        // Determine candidate status based on completed evaluations
        const completedCount = person.evaluations.length;
        const totalCount = campaignEvalTypes.length;
        let candidateStatus: 'INVITED' | 'EVALUATING' | 'COMPLETED' = 'INVITED';
        
        if (completedCount > 0 && completedCount < totalCount) {
          candidateStatus = 'EVALUATING';
        } else if (completedCount >= totalCount) {
          candidateStatus = 'COMPLETED';
        }

        // Create the campaign candidate
        await prisma.campaignCandidate.create({
          data: {
            campaignId: id,
            name: person.name,
            email: person.email.toLowerCase(),
            status: candidateStatus,
            discToken: evaluationTokens['DISC'] || null,
            drivingForcesToken: evaluationTokens['DRIVING_FORCES'] || null,
            eqToken: evaluationTokens['EQ'] || null,
            dnaToken: evaluationTokens['DNA'] || null,
            acumenToken: evaluationTokens['ACUMEN'] || null,
            valuesToken: evaluationTokens['VALUES'] || null,
            stressToken: evaluationTokens['STRESS'] || null,
          },
        });

        // Send email only for missing evaluations
        if (pendingEvaluationsForEmail.length > 0) {
          try {
            const { subject, html } = emailService.generateCombinedEvaluationsEmail({
              recipientName: person.name,
              senderName,
              evaluations: pendingEvaluationsForEmail,
              expiryDays: 30,
            });
            await emailService.sendEmail({ to: person.email.toLowerCase(), subject, html });
          } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Continue anyway - candidate was created
          }
        }

        results.success++;
        results.details.push({
          email: person.email,
          status: 'success',
          message: missingTypes.length > 0
            ? `Agregado con ${person.evaluations.length} evaluaciones existentes. Se enviaron ${missingTypes.length} evaluaciones pendientes.`
            : `Agregado con todas las evaluaciones completadas.`,
        });

      } catch (error) {
        console.error(`Error adding person ${person.email}:`, error);
        results.errors++;
        results.details.push({
          email: person.email,
          status: 'error',
          message: 'Error al agregar',
        });
      }
    }

    // Get final credits to calculate used
    const finalOwnerData = await prisma.user.findUnique({ where: { id: ownerId }, select: { credits: true } });
    const initialCredits = owner?.credits || 0;
    const finalCredits = finalOwnerData?.credits || 0;
    const creditsActuallyUsed = initialCredits - finalCredits;

    return NextResponse.json({
      message: 'Proceso completado',
      summary: results,
      creditsUsed: creditsActuallyUsed,
    });

  } catch (error) {
    console.error('Error adding candidates from evaluations:', error);
    return NextResponse.json(
      { error: 'Error al agregar candidatos' },
      { status: 500 }
    );
  }
}
