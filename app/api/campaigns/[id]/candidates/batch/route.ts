import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';
import { EvaluationType } from '@prisma/client';
import { getCreditSettings } from '@/lib/credits';
import { emailService } from '@/lib/email';

interface CandidateInput {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

interface ProcessedCandidate {
  name: string;
  email: string;
  status: 'success' | 'error' | 'duplicate';
  message?: string;
  emailsSent?: number;
}

// POST - Agregar múltiples candidatos en bloque
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
    const { candidates } = body as { candidates: CandidateInput[] };

    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de candidatos' },
        { status: 400 }
      );
    }

    // Límite de candidatos por lote
    if (candidates.length > 50) {
      return NextResponse.json(
        { error: 'Máximo 50 candidatos por lote' },
        { status: 400 }
      );
    }

    // Obtener info del usuario y permisos
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true, 
        ownerId: true, 
        role: true,
        memberOf: {
          select: { accessLevel: true }
        }
      },
    });

    const isOwner = user?.role !== 'FACILITATOR';
    const isFullAccess = user?.memberOf?.accessLevel === 'FULL_ACCESS';
    const ownerId = user?.role === 'FACILITATOR' && user?.ownerId ? user.ownerId : session.user.id;

    // Verificar que la campaña existe
    const campaign = await prisma.selectionCampaign.findFirst({
      where: { id, userId: ownerId },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    // Verificar permisos para agregar candidatos
    const canAddCandidates = isOwner || isFullAccess || campaign.allowTeamAddCandidates;
    if (!canAddCandidates) {
      return NextResponse.json(
        { error: 'No tienes permiso para agregar candidatos a esta campaña' },
        { status: 403 }
      );
    }

    // Obtener configuración de créditos
    const creditSettings = await getCreditSettings();
    const creditsPerEvaluation = creditSettings.creditsPerEvaluation;
    const evaluationTypes = campaign.evaluationTypes as string[];
    const creditsPerCandidate = evaluationTypes.length * creditsPerEvaluation;

    // Verificar créditos suficientes para todos los candidatos
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { credits: true, name: true, company: true },
    });

    const totalCreditsRequired = candidates.length * creditsPerCandidate;
    if ((owner?.credits || 0) < totalCreditsRequired) {
      return NextResponse.json(
        { 
          error: `Créditos insuficientes. Necesitas ${totalCreditsRequired} créditos para ${candidates.length} candidatos (${creditsPerCandidate} créditos c/u).`,
          creditsAvailable: owner?.credits || 0,
          creditsRequired: totalCreditsRequired,
        },
        { status: 400 }
      );
    }

    // Obtener candidatos existentes en la campaña
    const existingCandidates = await prisma.campaignCandidate.findMany({
      where: { campaignId: id },
      select: { email: true },
    });
    const existingEmails = new Set(existingCandidates.map(c => c.email.toLowerCase()));

    const senderName = owner?.company || owner?.name || 'Reclu';
    const baseUrl = process.env.NEXTAUTH_URL || 'https://reclu.abacusai.app';
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 30);

    const processedCandidates: ProcessedCandidate[] = [];
    let totalEmailsSent = 0;
    let totalCreditsUsed = 0;
    let successCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    // Procesar cada candidato
    for (const candidateInput of candidates) {
      const { name, email, phone, notes } = candidateInput;

      // Validar datos básicos
      if (!name || !email) {
        processedCandidates.push({
          name: name || 'Sin nombre',
          email: email || 'Sin email',
          status: 'error',
          message: 'Nombre y email son obligatorios',
        });
        errorCount++;
        continue;
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Verificar duplicado
      if (existingEmails.has(normalizedEmail)) {
        processedCandidates.push({
          name,
          email: normalizedEmail,
          status: 'duplicate',
          message: 'Ya existe en la campaña',
        });
        duplicateCount++;
        continue;
      }

      try {
        // Crear tokens para cada evaluación
        const evaluationTokens: Record<string, string> = {};

        for (const evalType of evaluationTypes) {
          const token = randomBytes(32).toString('hex');
          evaluationTokens[evalType] = token;

          const evalData = {
            title: `Evaluación para ${campaign.name}`,
            description: `Evaluación de candidato para el cargo: ${campaign.jobTitle}`,
            recipientName: name,
            recipientEmail: normalizedEmail,
            senderUserId: ownerId,
            token,
            tokenExpiry,
            status: 'PENDING',
          };

          // Crear la evaluación según el tipo
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
            case 'TECHNICAL':
              await prisma.externalTechnicalEvaluation.create({ 
                data: {
                  ...evalData,
                  jobPositionId: campaign.jobCategory || 'general',
                  jobPositionTitle: campaign.jobTitle,
                }
              });
              break;
          }

          // Descontar créditos
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
              description: `Evaluación ${evalType} - Campaña: ${campaign.name} (Lote)`,
              evaluationType: evalType as EvaluationType,
              evaluationId: token,
              balanceAfter: ownerData?.credits || 0,
              createdBy: session.user.id,
            },
          });
        }

        // Crear el candidato
        await prisma.campaignCandidate.create({
          data: {
            campaignId: id,
            name,
            email: normalizedEmail,
            phone: phone || null,
            notes: notes || null,
            status: 'INVITED',
            discToken: evaluationTokens['DISC'] || null,
            drivingForcesToken: evaluationTokens['DRIVING_FORCES'] || null,
            eqToken: evaluationTokens['EQ'] || null,
            dnaToken: evaluationTokens['DNA'] || null,
            acumenToken: evaluationTokens['ACUMEN'] || null,
            valuesToken: evaluationTokens['VALUES'] || null,
            stressToken: evaluationTokens['STRESS'] || null,
            technicalToken: evaluationTokens['TECHNICAL'] || null,
          },
        });

        // Agregar a la lista de existentes para evitar duplicados en el mismo lote
        existingEmails.add(normalizedEmail);

        // Configuración de evaluaciones para el email combinado
        const EVALUATION_CONFIG: Record<string, { name: string; description: string; icon: string; color: string; questions: number; time: string; pathPrefix: string }> = {
          DISC: { name: 'DISC', description: 'Perfil de comportamiento y estilo de comunicación', icon: '🧠', color: '#3b82f6', questions: 24, time: '10-15 min', pathPrefix: '/external-evaluation/' },
          DRIVING_FORCES: { name: 'Fuerzas Motivadoras', description: 'Motivaciones internas y valores personales', icon: '🎯', color: '#8b5cf6', questions: 12, time: '8-10 min', pathPrefix: '/external-driving-forces-evaluation/' },
          EQ: { name: 'Inteligencia Emocional', description: 'Competencias emocionales y sociales', icon: '❤️', color: '#ec4899', questions: 25, time: '10-12 min', pathPrefix: '/external-eq-evaluation/' },
          DNA: { name: 'DNA-25 Competencias', description: 'Habilidades y competencias profesionales', icon: '🧬', color: '#14b8a6', questions: 25, time: '10-12 min', pathPrefix: '/external-dna-evaluation/' },
          ACUMEN: { name: 'Acumen (ACI)', description: 'Capacidad de juicio y toma de decisiones', icon: '✨', color: '#f59e0b', questions: 30, time: '12-15 min', pathPrefix: '/external-acumen-evaluation/' },
          VALUES: { name: 'Valores e Integridad', description: 'Principios y ética profesional', icon: '⚖️', color: '#7c3aed', questions: 25, time: '10-12 min', pathPrefix: '/external-values-evaluation/' },
          STRESS: { name: 'Estrés y Resiliencia', description: 'Manejo del estrés y capacidad de recuperación', icon: '🧘', color: '#f97316', questions: 25, time: '10-12 min', pathPrefix: '/external-stress-evaluation/' },
          TECHNICAL: { name: 'Prueba Técnica', description: `Conocimientos técnicos específicos para ${campaign.jobTitle}`, icon: '💼', color: '#0ea5e9', questions: 20, time: '25-35 min', pathPrefix: '/external-technical-evaluation/' },
        };

        // Preparar datos para email combinado
        const combinedEmailData: Array<{
          type: string;
          name: string;
          description: string;
          link: string;
          questions: number;
          time: string;
          icon: string;
          color: string;
        }> = [];

        for (const evalType of evaluationTypes) {
          const token = evaluationTokens[evalType];
          if (!token) continue;

          const config = EVALUATION_CONFIG[evalType];
          if (config) {
            const evaluationLink = `${baseUrl}${config.pathPrefix}${token}`;
            combinedEmailData.push({
              type: evalType,
              name: config.name,
              description: config.description,
              link: evaluationLink,
              questions: config.questions,
              time: config.time,
              icon: config.icon,
              color: config.color,
            });
          }
        }

        // Enviar un solo email consolidado con todas las evaluaciones
        let emailsSent = 0;
        if (combinedEmailData.length > 0) {
          try {
            const { subject, html } = emailService.generateCombinedEvaluationsEmail({
              recipientName: name,
              senderName,
              evaluations: combinedEmailData,
              expiryDays: 30,
            });
            const sent = await emailService.sendEmail({ to: normalizedEmail, subject, html });
            if (sent) emailsSent = 1;
          } catch (emailError) {
            console.error('Error sending combined email:', emailError);
          }
        }

        processedCandidates.push({
          name,
          email: normalizedEmail,
          status: 'success',
          emailsSent,
        });

        totalEmailsSent += emailsSent;
        totalCreditsUsed += creditsPerCandidate;
        successCount++;

      } catch (err) {
        console.error(`Error processing candidate ${email}:`, err);
        processedCandidates.push({
          name,
          email: normalizedEmail,
          status: 'error',
          message: 'Error al procesar',
        });
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: candidates.length,
        success: successCount,
        duplicates: duplicateCount,
        errors: errorCount,
        totalEmailsSent,
        totalCreditsUsed,
      },
      candidates: processedCandidates,
    }, { status: 201 });

  } catch (error) {
    console.error('Error in batch candidate creation:', error);
    return NextResponse.json({ error: 'Error al procesar candidatos' }, { status: 500 });
  }
}
