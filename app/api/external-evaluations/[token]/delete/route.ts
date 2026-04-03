import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// DELETE - Eliminar evaluación DISC externa
export async function DELETE(
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

    // Verificar que la evaluación existe y pertenece al usuario
    const evaluation = await prisma.externalEvaluation.findUnique({
      where: { token },
      include: {
        responses: true,
        result: true,
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    if (evaluation.senderUserId !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar esta evaluación' },
        { status: 403 }
      );
    }

    // Eliminar en orden: resultado -> respuestas -> evaluación
    if (evaluation.result) {
      await prisma.externalEvaluationResult.delete({
        where: { id: evaluation.result.id },
      });
    }

    if (evaluation.responses.length > 0) {
      await prisma.externalEvaluationResponse.deleteMany({
        where: { externalEvaluationId: evaluation.id },
      });
    }

    await prisma.externalEvaluation.delete({
      where: { id: evaluation.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Evaluación eliminada correctamente',
    });
  } catch (error) {
    console.error('Error eliminando evaluación DISC externa:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la evaluación' },
      { status: 500 }
    );
  }
}
