import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';
import { emailService } from '@/lib/email';
import { deductCreditsForEvaluation, getCreditSettings, hasEnoughCredits, getCreditOwnerInfo } from '@/lib/credits';
import { getTeamUserIds } from '@/lib/team';

// GET - List all external EQ evaluations for the team
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // Get team user IDs (for FULL_ACCESS facilitators, includes owner + all facilitators)
    const teamUserIds = await getTeamUserIds(session.user.id);
    
    const evaluations = await prisma.externalEQEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds } },
      include: {
        result: true,
        senderUser: {
          select: { firstName: true, lastName: true, email: true }
        },
        _count: {
          select: { responses: true },
        },
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
    console.error('Error fetching external EQ evaluations:', error);
    return NextResponse.json(
      { error: 'Error al obtener las evaluaciones' },
      { status: 500 }
    );
  }
}

// POST - Create a new external EQ evaluation
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
        { error: 'Nombre y email del destinatario son requeridos' },
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
    tokenExpiry.setDate(tokenExpiry.getDate() + 30); // Token valid for 30 days
    
    // Create the evaluation
    const evaluation = await prisma.externalEQEvaluation.create({
      data: {
        title: title || `Evaluación EQ para ${recipientName}`,
        description: description || 'Evaluación de Inteligencia Emocional',
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
      'EQ',
      evaluation.id,
      recipientName
    );
    
    // Send invitation email
    try {
      await emailService.sendEQEvaluationInvitation({
        recipientEmail,
        recipientName,
        senderName: `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim() || session.user.email || 'Reclu',
        companyName: session.user.company || 'Reclu',
        evaluationToken: token,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({
      success: true,
      evaluation,
      message: 'Evaluación creada y enviada exitosamente',
    });
  } catch (error) {
    console.error('Error creating external EQ evaluation:', error);
    return NextResponse.json(
      { error: 'Error al crear la evaluación' },
      { status: 500 }
    );
  }
}
