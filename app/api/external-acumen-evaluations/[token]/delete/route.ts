import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

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

    const evaluation = await prisma.externalAcumenEvaluation.findUnique({
      where: { token },
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

    // Delete result first if exists
    await prisma.externalAcumenResult.deleteMany({
      where: { externalEvaluationId: evaluation.id },
    });

    // Delete responses
    await prisma.externalAcumenResponse.deleteMany({
      where: { externalEvaluationId: evaluation.id },
    });

    // Delete evaluation
    await prisma.externalAcumenEvaluation.delete({
      where: { id: evaluation.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Acumen evaluation:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la evaluación' },
      { status: 500 }
    );
  }
}
