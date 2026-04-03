
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { TokenUtils } from '@/lib/token-utils';
import { emailService } from '@/lib/email';
import { deductCreditsForEvaluation, getCreditSettings, hasEnoughCredits, getCreditOwnerInfo } from '@/lib/credits';
import { getTeamUserIds } from '@/lib/team';
import { getAppBaseUrl } from '@/lib/site-url';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, recipientName, recipientEmail } = body;

    // Validaciones
    if (!title || !recipientName || !recipientEmail) {
      return NextResponse.json(
        { error: 'Título, nombre y correo del destinatario son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: 'Formato de correo electrónico inválido' },
        { status: 400 }
      );
    }

    // Verificar créditos antes de crear (usa créditos del owner si es facilitador)
    const settings = await getCreditSettings();
    const hasCredits = await hasEnoughCredits(session.user.id, settings.creditsPerEvaluation);
    
    if (!hasCredits) {
      const creditInfo = await getCreditOwnerInfo(session.user.id);
      return NextResponse.json(
        { error: `Créditos insuficientes. Necesitas ${settings.creditsPerEvaluation} créditos. ${creditInfo.isFacilitator ? 'La empresa tiene' : 'Tienes'} ${creditInfo.credits}.` },
        { status: 400 }
      );
    }

    // Generar token seguro y fecha de expiración
    const token = TokenUtils.generateSecureToken();
    const tokenExpiry = TokenUtils.getTokenExpiry(7 * 24); // 7 días

    // Crear evaluación externa
    const externalEvaluation = await prisma.externalEvaluation.create({
      data: {
        title,
        description: description || '',
        recipientName,
        recipientEmail,
        senderUserId: session.user.id,
        token,
        tokenExpiry,
        status: 'PENDING'
      },
      include: {
        senderUser: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Descontar créditos
    const creditResult = await deductCreditsForEvaluation(
      session.user.id,
      'DISC',
      externalEvaluation.id,
      recipientName
    );

    if (!creditResult.success) {
      // Eliminar la evaluación si falló el descuento (no debería pasar pero por seguridad)
      await prisma.externalEvaluation.delete({ where: { id: externalEvaluation.id } });
      return NextResponse.json({ error: creditResult.error }, { status: 400 });
    }

    // Generar enlace de evaluación
    const baseUrl = getAppBaseUrl();
    const evaluationLink = `${baseUrl}/external-evaluation/${token}`;

    // Generar contenido del email
    const senderName = `${externalEvaluation.senderUser.firstName} ${externalEvaluation.senderUser.lastName}`;
    const emailContent = emailService.generateEvaluationInvitationEmail(
      recipientName,
      senderName,
      title,
      evaluationLink
    );

    // Enviar email
    const emailSent = await emailService.sendEmail({
      to: recipientEmail,
      subject: emailContent.subject,
      html: emailContent.html
    });

    if (!emailSent) {
      console.warn('Failed to send email, but evaluation was created');
    }

    return NextResponse.json({
      success: true,
      evaluation: {
        id: externalEvaluation.id,
        title: externalEvaluation.title,
        recipientName: externalEvaluation.recipientName,
        recipientEmail: externalEvaluation.recipientEmail,
        token: externalEvaluation.token,
        status: externalEvaluation.status,
        createdAt: externalEvaluation.createdAt,
        tokenExpiry: externalEvaluation.tokenExpiry
      },
      emailSent,
      evaluationLink
    });

  } catch (error) {
    console.error('Error creating external evaluation:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get team user IDs (for FULL_ACCESS facilitators, includes owner + all facilitators)
    const teamUserIds = await getTeamUserIds(session.user.id);

    // Obtener evaluaciones externas del equipo
    const externalEvaluations = await prisma.externalEvaluation.findMany({
      where: {
        senderUserId: { in: teamUserIds }
      },
      include: {
        result: true,
        senderUser: {
          select: { firstName: true, lastName: true, email: true }
        },
        _count: {
          select: {
            responses: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calcular información adicional para cada evaluación
    const evaluationsWithStatus = externalEvaluations.map(evaluation => {
      const timeUntilExpiry = TokenUtils.getTimeUntilExpiry(evaluation.tokenExpiry);
      const isExpired = timeUntilExpiry.expired;
      
      let status = evaluation.status;
      if (status === 'PENDING' && isExpired) {
        status = 'EXPIRED';
      }

      const senderName = evaluation.senderUser 
        ? `${evaluation.senderUser.firstName || ''} ${evaluation.senderUser.lastName || ''}`.trim() || evaluation.senderUser.email
        : 'Desconocido';

      return {
        ...evaluation,
        isExpired,
        timeUntilExpiry,
        effectiveStatus: status,
        hasResponses: evaluation._count.responses > 0,
        isCompleted: evaluation.status === 'COMPLETED',
        senderName,
        isOwnEvaluation: evaluation.senderUserId === session.user.id
      };
    });

    return NextResponse.json({
      evaluations: evaluationsWithStatus
    });

  } catch (error) {
    console.error('Error fetching external evaluations:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
