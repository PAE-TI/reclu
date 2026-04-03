import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { token } = params;

    // Find evaluation
    const evaluation = await prisma.externalStressEvaluation.findUnique({
      where: { token },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (evaluation.senderUserId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado para eliminar esta evaluación' },
        { status: 403 }
      );
    }

    // Delete result first (if exists)
    await prisma.externalStressResult.deleteMany({
      where: { externalEvaluationId: evaluation.id },
    });

    // Delete responses
    await prisma.externalStressResponse.deleteMany({
      where: { externalEvaluationId: evaluation.id },
    });

    // Delete evaluation
    await prisma.externalStressEvaluation.delete({
      where: { id: evaluation.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Evaluación eliminada exitosamente',
    });
  } catch (error) {
    console.error('Error deleting stress evaluation:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la evaluación' },
      { status: 500 }
    );
  }
}
