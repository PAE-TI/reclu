
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface Context {
  params: { id: string };
}

// GET - Obtener respuestas de una evaluación
export async function GET(req: NextRequest, { params }: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const responses = await prisma.drivingForcesResponse.findMany({
      where: {
        evaluationId: params.id,
        userId: session.user.id,
      },
      include: {
        question: true,
      },
      orderBy: { questionNumber: 'asc' },
    });

    return NextResponse.json({ responses }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener respuestas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Guardar respuesta a una pregunta
export async function POST(req: NextRequest, { params }: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await req.json();

    // Validar que las rankings sumen 10 (1+2+3+4)
    const rankingSum = data.rankingA + data.rankingB + data.rankingC + data.rankingD;
    if (rankingSum !== 10) {
      return NextResponse.json(
        { error: 'Los rankings deben ser únicos del 1 al 4' },
        { status: 400 }
      );
    }

    // Verificar que todos los rankings sean únicos y estén entre 1-4
    const rankings = [data.rankingA, data.rankingB, data.rankingC, data.rankingD];
    const uniqueRankings = new Set(rankings);
    if (uniqueRankings.size !== 4 || Math.min(...rankings) < 1 || Math.max(...rankings) > 4) {
      return NextResponse.json(
        { error: 'Los rankings deben ser únicos del 1 al 4' },
        { status: 400 }
      );
    }

    const response = await prisma.drivingForcesResponse.upsert({
      where: {
        userId_evaluationId_questionId: {
          userId: session.user.id,
          evaluationId: params.id,
          questionId: data.questionId,
        },
      },
      update: {
        rankingA: data.rankingA,
        rankingB: data.rankingB,
        rankingC: data.rankingC,
        rankingD: data.rankingD,
        responseTime: data.responseTime,
      },
      create: {
        userId: session.user.id,
        evaluationId: params.id,
        questionId: data.questionId,
        questionNumber: data.questionNumber,
        rankingA: data.rankingA,
        rankingB: data.rankingB,
        rankingC: data.rankingC,
        rankingD: data.rankingD,
        responseTime: data.responseTime,
      },
    });

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error('Error al guardar respuesta:', error);
    return NextResponse.json(
      { error: 'Error al guardar respuesta' },
      { status: 500 }
    );
  }
}
