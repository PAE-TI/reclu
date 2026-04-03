
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';
import { emailService } from '@/lib/email';
import { deductCreditsForEvaluation, getCreditSettings, hasEnoughCredits, getCreditOwnerInfo } from '@/lib/credits';
import { getTeamUserIds } from '@/lib/team';
import { getAppBaseUrl } from '@/lib/site-url';

// GET - Obtener evaluaciones externas de Driving Forces del equipo
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get team user IDs (for FULL_ACCESS facilitators, includes owner + all facilitators)
    const teamUserIds = await getTeamUserIds(session.user.id);

    const evaluations = await prisma.externalDrivingForcesEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds } },
      include: {
        result: true,
        senderUser: {
          select: { firstName: true, lastName: true, email: true }
        },
        _count: {
          select: { responses: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Add sender info and ownership flag
    const evaluationsWithInfo = evaluations.map(ev => ({
      ...ev,
      senderName: ev.senderUser 
        ? `${ev.senderUser.firstName || ''} ${ev.senderUser.lastName || ''}`.trim() || ev.senderUser.email
        : 'Desconocido',
      isOwnEvaluation: ev.senderUserId === session.user.id
    }));

    return NextResponse.json({ evaluations: evaluationsWithInfo }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener evaluaciones externas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva evaluación externa de Driving Forces
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await req.json();

    // Verificar créditos (usa créditos del owner si es facilitador)
    const settings = await getCreditSettings();
    const hasCredits = await hasEnoughCredits(session.user.id, settings.creditsPerEvaluation);
    
    if (!hasCredits) {
      const creditInfo = await getCreditOwnerInfo(session.user.id);
      return NextResponse.json(
        { error: `Créditos insuficientes. Necesitas ${settings.creditsPerEvaluation} créditos. ${creditInfo.isFacilitator ? 'La empresa tiene' : 'Tienes'} ${creditInfo.credits}.` },
        { status: 400 }
      );
    }

    // Generar token único
    const token = randomBytes(32).toString('hex');
    
    // Token expira en 30 días
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 30);

    const evaluation = await prisma.externalDrivingForcesEvaluation.create({
      data: {
        title: data.title || `Evaluación Driving Forces para ${data.recipientName}`,
        description: data.description,
        recipientName: data.recipientName,
        recipientEmail: data.recipientEmail,
        senderUserId: session.user.id,
        token,
        tokenExpiry,
        status: 'PENDING',
      },
    });

    // Descontar créditos
    await deductCreditsForEvaluation(
      session.user.id,
      'DRIVING_FORCES',
      evaluation.id,
      data.recipientName
    );

    // Enviar email de invitación
    try {
      const senderName = session.user.firstName ? 
        `${session.user.firstName} ${session.user.lastName || ''}`.trim() :
        session.user.name || 'Evaluador';
      
      const evaluationLink = `${getAppBaseUrl()}/external-driving-forces-evaluation/${token}`;
      
      const { subject, html } = emailService.generateDrivingForcesInvitationEmail(
        data.recipientName,
        senderName,
        evaluation.title,
        evaluationLink,
        30 // 30 días para expirar
      );

      await emailService.sendEmail({
        to: data.recipientEmail,
        subject,
        html,
      });

      console.log(`Email de evaluación Driving Forces enviado a: ${data.recipientEmail}`);
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
      // No fallar la creación de la evaluación si no se puede enviar el email
      // El enlace seguirá siendo válido y se puede copiar manualmente
    }

    return NextResponse.json({ evaluation }, { status: 201 });
  } catch (error) {
    console.error('Error al crear evaluación externa:', error);
    return NextResponse.json(
      { error: 'Error al crear evaluación externa' },
      { status: 500 }
    );
  }
}
