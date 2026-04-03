import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Get all DNA questions
export async function GET() {
  try {
    const questions = await prisma.dNAQuestion.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
    });
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching DNA questions:', error);
    return NextResponse.json(
      { error: 'Error al obtener las preguntas' },
      { status: 500 }
    );
  }
}
