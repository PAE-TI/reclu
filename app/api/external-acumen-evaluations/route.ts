import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';
import { emailService } from '@/lib/email';
import { deductCreditsForEvaluation, getCreditSettings, hasEnoughCredits, getCreditOwnerInfo } from '@/lib/credits';
import { getTeamUserIds } from '@/lib/team';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get team user IDs (for FULL_ACCESS facilitators, includes owner + all facilitators)
    const teamUserIds = await getTeamUserIds(session.user.id);

    const evaluations = await prisma.externalAcumenEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds } },
      include: { 
        result: true,
        senderUser: {
          select: { firstName: true, lastName: true, email: true }
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

    return NextResponse.json(evaluationsWithInfo);
  } catch (error) {
    console.error('Error fetching Acumen evaluations:', error);
    return NextResponse.json(
      { error: 'Error al obtener evaluaciones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { recipientName, recipientEmail } = body;

    if (!recipientName || !recipientEmail) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

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

    // Generate unique token
    const token = randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 30); // 30 days

    // Create evaluation
    const evaluation = await prisma.externalAcumenEvaluation.create({
      data: {
        title: `Evaluación Acumen - ${recipientName}`,
        recipientName,
        recipientEmail,
        senderUserId: session.user.id,
        token,
        tokenExpiry,
        status: 'PENDING',
      },
    });

    // Descontar créditos
    await deductCreditsForEvaluation(
      session.user.id,
      'ACUMEN',
      evaluation.id,
      recipientName
    );

    // Send email
    try {
      await emailService.sendAcumenInvitation({
        to: recipientEmail,
        recipientName,
        senderName: session.user.name || 'El equipo',
        evaluationLink: `${process.env.NEXTAUTH_URL}/external-acumen-evaluation/${token}`,
        expiryDate: tokenExpiry,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Error creating Acumen evaluation:', error);
    return NextResponse.json(
      { error: 'Error al crear la evaluación' },
      { status: 500 }
    );
  }
}
