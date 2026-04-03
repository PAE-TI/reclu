import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { emailService } from '@/lib/email';
import { deductCreditsForEvaluation, getCreditSettings, hasEnoughCredits, getCreditOwnerInfo } from '@/lib/credits';
import { getTeamUserIds } from '@/lib/team';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get team user IDs (for FULL_ACCESS facilitators, includes owner + all facilitators)
    const teamUserIds = await getTeamUserIds(session.user.id);

    const evaluations = await prisma.externalStressEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds } },
      include: {
        responses: true,
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
    console.error('Error fetching stress evaluations:', error);
    return NextResponse.json({ error: 'Error al obtener evaluaciones' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { recipientName, recipientEmail, title, description } = body;

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
    tokenExpiry.setDate(tokenExpiry.getDate() + 30); // 30 days expiry

    const evaluation = await prisma.externalStressEvaluation.create({
      data: {
        title: title || 'Evaluación de Estrés y Resiliencia',
        description,
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
      'STRESS',
      evaluation.id,
      recipientName
    );

    // Send email invitation
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      await emailService.sendStressInvitation({
        to: recipientEmail,
        recipientName,
        senderName: session.user.name || 'Un evaluador',
        evaluationLink: `${baseUrl}/external-stress-evaluation/${token}`,
        expiryDate: tokenExpiry,
      });
    } catch (emailError) {
      console.error('Error sending stress invitation email:', emailError);
    }

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Error creating stress evaluation:', error);
    return NextResponse.json({ error: 'Error al crear evaluación' }, { status: 500 });
  }
}
