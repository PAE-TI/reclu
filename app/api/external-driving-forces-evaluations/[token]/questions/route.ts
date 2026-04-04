
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Context {
  params: { token: string };
}

// GET - Obtener preguntas para evaluación externa
export async function GET(req: NextRequest, { params }: Context) {
  try {
    // Verificar que la evaluación existe y está válida
    const evaluation = await prisma.externalDrivingForcesEvaluation.findUnique({
      where: { token: params.token },
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
            title: evaluation.title,
            recipientName: evaluation.recipientName,
            status: evaluation.status,
            completedAt: evaluation.completedAt,
          },
        },
        { status: 400 }
      );
    }

    // Obtener las preguntas
    const questions = await prisma.drivingForcesQuestion.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
    });

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
