import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    
    // Validate the token
    const evaluation = await prisma.externalEQEvaluation.findUnique({
      where: { token },
    });
    
    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    if (new Date() > evaluation.tokenExpiry) {
      return NextResponse.json(
        { error: 'El enlace de evaluación ha expirado' },
        { status: 410 }
      );
    }

    if (evaluation.status === 'COMPLETED') {
      return NextResponse.json(
        {
          error: 'Esta evaluación ya fue completada',
          alreadyCompleted: true,
          evaluation: {
            id: evaluation.id,
            status: evaluation.status,
            completedAt: evaluation.completedAt,
          },
        },
        { status: 400 }
      );
    }
    
    // Get all active questions
    const questions = await prisma.eQQuestion.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
    });
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching EQ questions:', error);
    return NextResponse.json(
      { error: 'Error al obtener las preguntas' },
      { status: 500 }
    );
  }
}
