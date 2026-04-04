import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Validate evaluation
    const evaluation = await prisma.externalStressEvaluation.findUnique({
      where: { token },
      include: {
        senderUser: {
          select: { name: true, company: true },
        },
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    // Check if already completed
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
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > evaluation.tokenExpiry) {
      return NextResponse.json(
        { error: 'Este enlace de evaluación ha expirado' },
        { status: 410 }
      );
    }

    // Get questions
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
      },
    });

    return NextResponse.json({
      evaluation: {
        id: evaluation.id,
        title: evaluation.title,
        recipientName: evaluation.recipientName,
        recipientEmail: evaluation.recipientEmail,
        status: evaluation.status,
        tokenExpiry: evaluation.tokenExpiry,
        senderName: evaluation.senderUser.name,
        company: evaluation.senderUser.company,
      },
      questions,
    });
  } catch (error) {
    console.error('Error fetching stress questions:', error);
    return NextResponse.json(
      { error: 'Error al obtener las preguntas' },
      { status: 500 }
    );
  }
}
