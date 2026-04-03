import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { emailService } from '@/lib/email';

// POST - Reenviar email de invitación
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token es requerido' },
        { status: 400 }
      );
    }

    // Find the evaluation
    const evaluation = await prisma.externalTechnicalEvaluation.findUnique({
      where: { token },
      include: {
        senderUser: {
          select: { id: true, name: true },
        },
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    if (evaluation.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Solo se puede reenviar a evaluaciones pendientes' },
        { status: 400 }
      );
    }

    if (new Date() > evaluation.tokenExpiry) {
      return NextResponse.json(
        { error: 'El enlace de la evaluación ha expirado' },
        { status: 410 }
      );
    }

    // Send email
    await emailService.sendTechnicalInvitationEmail(
      evaluation.recipientEmail,
      evaluation.recipientName,
      evaluation.token,
      evaluation.jobPositionTitle,
      evaluation.senderUser.name || 'Reclu'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resending technical evaluation email:', error);
    return NextResponse.json(
      { error: 'Error al reenviar email' },
      { status: 500 }
    );
  }
}
