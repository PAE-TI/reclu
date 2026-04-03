import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Get questions for DNA evaluation
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    
    // Verify evaluation exists and is valid
    const evaluation = await prisma.externalDNAEvaluation.findUnique({
      where: { token },
    });
    
    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }
    
    if (evaluation.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Esta evaluación ya fue completada' },
        { status: 400 }
      );
    }
    
    if (new Date() > evaluation.tokenExpiry) {
      return NextResponse.json(
        { error: 'El enlace de evaluación ha expirado' },
        { status: 410 }
      );
    }
    
    // Get all active questions
    const questions = await prisma.dNAQuestion.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
      select: {
        id: true,
        questionNumber: true,
        questionText: true,
        questionType: true,
        competency: true,
        category: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        optionE: true,
        isReversed: true,
        weight: true,
      },
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
