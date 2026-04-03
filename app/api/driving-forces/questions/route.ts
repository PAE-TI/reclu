
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Obtener todas las preguntas de Driving Forces
export async function GET() {
  try {
    const questions = await prisma.drivingForcesQuestion.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
    });

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener preguntas de Driving Forces:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear pregunta de Driving Forces (admin only)
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const question = await prisma.drivingForcesQuestion.create({
      data: {
        questionNumber: data.questionNumber,
        questionText: data.questionText,
        questionType: data.questionType || 'RANKING',
        statementA: data.statementA,
        statementB: data.statementB,
        statementC: data.statementC,
        statementD: data.statementD,
        forceA: data.forceA,
        forceB: data.forceB,
        forceC: data.forceC,
        forceD: data.forceD,
        category: data.category,
      },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error('Error al crear pregunta de Driving Forces:', error);
    return NextResponse.json(
      { error: 'Error al crear pregunta' },
      { status: 500 }
    );
  }
}
