import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateTechnicalResult } from '@/lib/technical-calculator';
import { createEvaluationCompletedNotification } from '@/lib/notifications';

// GET - Obtener evaluación por token
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const evaluation = await prisma.externalTechnicalEvaluation.findUnique({
      where: { token },
      include: {
        senderUser: {
          select: { 
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

    // Check if token has expired
    if (new Date() > evaluation.tokenExpiry && evaluation.status === 'PENDING') {
      // Update status to expired
      await prisma.externalTechnicalEvaluation.update({
        where: { id: evaluation.id },
        data: { status: 'EXPIRED' },
      });
      evaluation.status = 'EXPIRED';
    }

    // Return flat structure like other evaluations
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
    console.error('Error fetching technical evaluation:', error);
    return NextResponse.json(
      { error: 'Error al obtener evaluación' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar evaluación
export async function DELETE(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const evaluation = await prisma.externalTechnicalEvaluation.findUnique({
      where: { token },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    // Delete related records first
    await prisma.externalTechnicalResponse.deleteMany({
      where: { externalEvaluationId: evaluation.id },
    });

    if (evaluation.status === 'COMPLETED') {
      await prisma.externalTechnicalResult.deleteMany({
        where: { externalEvaluationId: evaluation.id },
      });
    }

    // Delete the evaluation
    await prisma.externalTechnicalEvaluation.delete({
      where: { id: evaluation.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting technical evaluation:', error);
    return NextResponse.json(
      { error: 'Error al eliminar evaluación' },
      { status: 500 }
    );
  }
}
