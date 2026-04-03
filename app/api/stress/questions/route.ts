import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const questions = await prisma.stressQuestion.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
      select: {
        id: true,
        questionNumber: true,
        questionText: true,
        dimension: true,
        category: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        optionE: true,
        isReversed: true,
      },
    });
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching stress questions:', error);
    return NextResponse.json(
      { error: 'Error al obtener las preguntas' },
      { status: 500 }
    );
  }
}
