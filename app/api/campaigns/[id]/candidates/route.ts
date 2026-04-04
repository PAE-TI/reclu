import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';
import { EvaluationType } from '@prisma/client';
import { getCreditSettings } from '@/lib/credits';
import { emailService } from '@/lib/email';
import { getAppBaseUrl } from '@/lib/site-url';

// Helper to get evaluation status by token
async function getEvaluationStatusByToken(
  token: string | null,
  evaluationType: string
): Promise<{ status: string; completedAt: Date | null } | null> {
  if (!token) return null;

  try {
    switch (evaluationType) {
      case 'DISC': {
        const eval_ = await prisma.externalEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      case 'DRIVING_FORCES': {
        const eval_ = await prisma.externalDrivingForcesEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      case 'EQ': {
        const eval_ = await prisma.externalEQEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      case 'DNA': {
        const eval_ = await prisma.externalDNAEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      case 'ACUMEN': {
        const eval_ = await prisma.externalAcumenEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      case 'VALUES': {
        const eval_ = await prisma.externalValuesEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      case 'STRESS': {
        const eval_ = await prisma.externalStressEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      case 'TECHNICAL': {
        const eval_ = await prisma.externalTechnicalEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}

// GET - Obtener candidatos de una campaña
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;

    // Obtener el dueño real si es facilitador
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, ownerId: true, role: true },
    });

    const ownerId = user?.role === 'FACILITATOR' && user?.ownerId ? user.ownerId : session.user.id;

    // Verificar que la campaña pertenece al usuario
    const campaign = await prisma.selectionCampaign.findFirst({
      where: { id, userId: ownerId },
      select: { id: true, evaluationTypes: true },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    const candidates = await prisma.campaignCandidate.findMany({
      where: { campaignId: id },
      orderBy: [
        { rankPosition: 'asc' },
        { overallScore: 'desc' },
        { createdAt: 'asc' },
      ],
    });

    // Enrich candidates with evaluation status
    const evaluationTypes = campaign.evaluationTypes as string[];
    const enrichedCandidates = await Promise.all(
      candidates.map(async (candidate) => {
        const evaluationProgress: Record<string, { status: string; completedAt: string | null }> = {};
        
        const tokenMap: Record<string, string | null> = {
          'DISC': candidate.discToken,
          'DRIVING_FORCES': candidate.drivingForcesToken,
          'EQ': candidate.eqToken,
          'DNA': candidate.dnaToken,
          'ACUMEN': candidate.acumenToken,
          'VALUES': candidate.valuesToken,
          'STRESS': candidate.stressToken,
          'TECHNICAL': candidate.technicalToken,
        };

        for (const evalType of evaluationTypes) {
          const token = tokenMap[evalType];
          const evalStatus = await getEvaluationStatusByToken(token, evalType);
          evaluationProgress[evalType] = {
            status: evalStatus?.status || 'PENDING',
            completedAt: evalStatus?.completedAt?.toISOString() || null,
          };
        }

        const completedCount = Object.values(evaluationProgress).filter(e => e.status === 'COMPLETED').length;
        const totalCount = evaluationTypes.length;

        return {
          ...candidate,
          evaluationProgress,
          completedEvaluations: completedCount,
          totalEvaluations: totalCount,
        };
      })
    );

    return NextResponse.json({ candidates: enrichedCandidates });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Error al obtener candidatos' }, { status: 500 });
  }
}

// POST - Agregar candidato a la campaña y enviar evaluaciones
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
    const { name, email, phone, notes } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'El nombre y email son obligatorios' },
        { status: 400 }
      );
    }

    // Obtener el dueño real si es facilitador
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, ownerId: true, role: true, credits: true },
    });

    const ownerId = user?.role === 'FACILITATOR' && user?.ownerId ? user.ownerId : session.user.id;

    // Verificar que la campaña pertenece al usuario
    const campaign = await prisma.selectionCampaign.findFirst({
      where: { id, userId: ownerId },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    if (campaign.status === 'COMPLETED' || campaign.status === 'ARCHIVED') {
      return NextResponse.json({ error: 'No se pueden agregar candidatos a una campaña completada o archivada' }, { status: 403 });
    }

    // Verificar si el candidato ya existe en la campaña
    const existingCandidate = await prisma.campaignCandidate.findFirst({
      where: { campaignId: id, email: email.toLowerCase() },
    });

    if (existingCandidate) {
      return NextResponse.json(
        { error: 'Este candidato ya está en la campaña' },
        { status: 400 }
      );
    }

    // Obtener configuración de créditos por evaluación
    const creditSettings = await getCreditSettings();
    const creditsPerEvaluation = creditSettings.creditsPerEvaluation;

    // Obtener créditos del dueño
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { credits: true },
    });

    // Verificar créditos suficientes (creditsPerEvaluation por cada evaluación)
    const evaluationTypes = campaign.evaluationTypes as string[];
    const requiredCredits = evaluationTypes.length * creditsPerEvaluation;

    if ((owner?.credits || 0) < requiredCredits) {
      return NextResponse.json(
        { error: `Créditos insuficientes. Necesitas ${requiredCredits} créditos para enviar las ${evaluationTypes.length} evaluaciones (${creditsPerEvaluation} créditos c/u).` },
        { status: 400 }
      );
    }

    // Crear tokens para cada evaluación
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 30);

    const evaluationTokens: Record<string, string> = {};
    const createdEvaluations: Array<{ type: string; token: string }> = [];

    // Crear evaluaciones externas según los tipos configurados
    for (const evalType of evaluationTypes) {
      const token = randomBytes(32).toString('hex');
      evaluationTokens[evalType] = token;

      const evalData = {
        title: `Evaluación para ${campaign.name}`,
        description: `Evaluación de candidato para el cargo: ${campaign.jobTitle}`,
        recipientName: name,
        recipientEmail: email.toLowerCase(),
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
          // Para evaluaciones técnicas necesitamos el jobCategory de la campaña
          await prisma.externalTechnicalEvaluation.create({ 
            data: {
              ...evalData,
              jobPositionId: campaign.jobCategory || 'general',
              jobPositionTitle: campaign.jobTitle,
            }
          });
          break;
      }

      createdEvaluations.push({ type: evalType, token });

      // Descontar créditos según configuración
      await prisma.user.update({
        where: { id: ownerId },
        data: { credits: { decrement: creditsPerEvaluation } },
      });

      // Crear transacción de crédito
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
    }

    // Crear el candidato en la campaña
    const candidate = await prisma.campaignCandidate.create({
      data: {
        campaignId: id,
        name,
        email: email.toLowerCase(),
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

    // Obtener nombre del remitente
    const sender = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { name: true, company: true },
    });
    const senderName = sender?.company || sender?.name || 'Reclu';
    const baseUrl = getAppBaseUrl();

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
        const sent = await emailService.sendEmail({ to: email.toLowerCase(), subject, html });
        if (sent) emailsSent = 1;
      } catch (emailError) {
        console.error('Error sending combined email:', emailError);
      }
    }

    return NextResponse.json({ 
      candidate,
      evaluationsSent: createdEvaluations.length,
      emailsSent,
      creditsUsed: createdEvaluations.length * creditsPerEvaluation,
      creditsPerEvaluation,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding candidate:', error);
    return NextResponse.json({ error: 'Error al agregar candidato' }, { status: 500 });
  }
}
