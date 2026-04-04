import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { TokenUtils } from '@/lib/token-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Buscar y validar evaluación por token
    const evaluation = await prisma.externalEvaluation.findUnique({
      where: { token }
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    // Verificar si ya fue completada
    if (evaluation.status === 'COMPLETED') {
      return NextResponse.json(
        {
          error: 'Esta evaluación ya fue completada',
          alreadyCompleted: true,
          evaluation: {
            id: evaluation.id,
            title: evaluation.title,
            recipientName: evaluation.recipientName,
            recipientEmail: evaluation.recipientEmail,
            status: evaluation.status,
            completedAt: evaluation.completedAt,
          },
        },
        { status: 410 }
      );
    }

    // Verificar si el token ha expirado
    if (TokenUtils.isTokenExpired(evaluation.tokenExpiry)) {
      return NextResponse.json(
        { 
          error: 'El enlace ha expirado',
          expired: true
        },
        { status: 410 }
      );
    }

    // Obtener preguntas activas
    const questions = await prisma.discQuestion.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
      select: {
        id: true,
        questionNumber: true,
        questionText: true,
        questionType: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        context: true,
      },
    });

    return NextResponse.json({
      questions,
      total: questions.length,
    });

  } catch (error) {
    console.error('Error fetching external evaluation questions:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
