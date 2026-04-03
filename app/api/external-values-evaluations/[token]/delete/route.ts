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

    const evaluation = await prisma.externalValuesEvaluation.findUnique({
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
        { error: 'No autorizado para eliminar esta evaluación' },
        { status: 403 }
      );
    }

    // Delete related result first if exists
    await prisma.externalValuesResult.deleteMany({
      where: { externalEvaluationId: evaluation.id },
    });

    // Delete responses
    await prisma.externalValuesResponse.deleteMany({
      where: { externalEvaluationId: evaluation.id },
    });

    // Delete evaluation
    await prisma.externalValuesEvaluation.delete({
      where: { id: evaluation.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
