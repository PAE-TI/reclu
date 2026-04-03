import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';
import { emailService } from '@/lib/email';
import { getTeamUserIds } from '@/lib/team';
import { JOB_POSITIONS } from '@/lib/job-positions';

// GET - Obtener evaluaciones técnicas enviadas
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get team user IDs for facilitators
    const teamUserIds = await getTeamUserIds(session.user.id);

    const evaluations = await prisma.externalTechnicalEvaluation.findMany({
      where: {
        senderUserId: { in: teamUserIds },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        result: true,
        senderUser: {
          select: { name: true, company: true },
        },
      },
    });

    return NextResponse.json({ evaluations });
  } catch (error) {
    console.error('Error fetching technical evaluations:', error);
    return NextResponse.json({ error: 'Error al obtener evaluaciones' }, { status: 500 });
  }
}

// POST - Crear nueva evaluación técnica externa
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { recipientName, recipientEmail, jobPositionId, title, description, sendEmail = true } = body;

    if (!recipientName || !recipientEmail || !jobPositionId) {
      return NextResponse.json(
        { error: 'Nombre, email y cargo son requeridos' },
        { status: 400 }
      );
    }

    // Check if user has credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user || user.credits < 2) {
      return NextResponse.json(
        { error: 'Créditos insuficientes. Se requieren 2 créditos por evaluación técnica.' },
        { status: 402 }
      );
    }

    // Deduct credits
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 2 } },
    });

    // Get job position title
    const position = JOB_POSITIONS.find(p => p.id === jobPositionId);
    const jobPositionTitle = position?.title || jobPositionId;

    // Generate secure token
    const token = randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 30); // 30 days expiry

    // Create evaluation
    const evaluation = await prisma.externalTechnicalEvaluation.create({
      data: {
        title: title || `Evaluación Técnica - ${jobPositionTitle}`,
        description: description || `Evaluación técnica para el cargo de ${jobPositionTitle}`,
        recipientName,
        recipientEmail: recipientEmail.toLowerCase(),
        senderUserId: session.user.id,
        jobPositionId,
        jobPositionTitle,
        token,
        tokenExpiry,
        status: 'PENDING',
      },
    });

    // Send email invitation if requested
    if (sendEmail) {
      try {
        await emailService.sendTechnicalInvitationEmail(
          recipientEmail,
          recipientName,
          token,
          jobPositionTitle,
          session.user.name || 'Reclu'
        );
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ evaluation, token }, { status: 201 });
  } catch (error) {
    console.error('Error creating technical evaluation:', error);
    return NextResponse.json({ error: 'Error al crear evaluación' }, { status: 500 });
  }
}
