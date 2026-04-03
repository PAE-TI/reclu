import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
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
