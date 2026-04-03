import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Verify evaluation exists and is valid
    const evaluation = await prisma.externalAcumenEvaluation.findUnique({
      where: { token },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    if (new Date() > new Date(evaluation.tokenExpiry)) {
      return NextResponse.json(
        { error: 'Esta evaluación ha expirado' },
        { status: 410 }
      );
    }

    if (evaluation.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Esta evaluación ya fue completada' },
        { status: 400 }
      );
    }

    // Get active questions
    const questions = await prisma.acumenQuestion.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching Acumen questions:', error);
    return NextResponse.json(
      { error: 'Error al obtener las preguntas' },
      { status: 500 }
    );
  }
}
