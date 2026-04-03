import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getTeamUserIds } from '@/lib/team';

// GET - Obtener resultados de evaluación técnica (solo para admin/sender)
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { token } = params;

    const evaluation = await prisma.externalTechnicalEvaluation.findUnique({
      where: { token },
      include: {
        senderUser: {
          select: { 
            id: true,
            firstName: true, 
            lastName: true, 
            name: true, 
            company: true, 
            email: true 
          },
        },
        result: true,
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    // Verify user has access (is sender or part of the same team)
    const teamUserIds = await getTeamUserIds(session.user.id);
    const hasAccess = teamUserIds.includes(evaluation.senderUserId);

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'No tienes permiso para ver estos resultados' },
        { status: 403 }
      );
    }

    // Check if token has expired
    if (new Date() > evaluation.tokenExpiry && evaluation.status === 'PENDING') {
      await prisma.externalTechnicalEvaluation.update({
        where: { id: evaluation.id },
        data: { status: 'EXPIRED' },
      });
      evaluation.status = 'EXPIRED';
    }

    // Return flat structure
    return NextResponse.json({
      id: evaluation.id,
      recipientName: evaluation.recipientName,
      recipientEmail: evaluation.recipientEmail,
      jobPositionId: evaluation.jobPositionId,
      jobPositionTitle: evaluation.jobPositionTitle,
      status: evaluation.status,
      completedAt: evaluation.completedAt,
      senderUser: {
        firstName: evaluation.senderUser?.firstName || evaluation.senderUser?.name?.split(' ')[0] || null,
        lastName: evaluation.senderUser?.lastName || evaluation.senderUser?.name?.split(' ').slice(1).join(' ') || null,
        company: evaluation.senderUser?.company || null,
      },
      result: evaluation.result,
    });
  } catch (error) {
    console.error('Error fetching technical evaluation results:', error);
    return NextResponse.json(
      { error: 'Error al obtener resultados' },
      { status: 500 }
    );
  }
}
