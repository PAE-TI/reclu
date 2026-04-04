import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Validate token
    const evaluation = await prisma.externalValuesEvaluation.findUnique({
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
        {
          error: 'Esta evaluación ya fue completada',
          alreadyCompleted: true,
          evaluation: {
            id: evaluation.id,
            title: evaluation.title,
            recipientName: evaluation.recipientName,
            recipientEmail: evaluation.recipientEmail,
            tokenExpiry: evaluation.tokenExpiry,
            status: evaluation.status,
            completedAt: evaluation.completedAt,
          },
        },
        { status: 400 }
      );
    }

    if (new Date() > evaluation.tokenExpiry) {
      return NextResponse.json(
        { error: 'El enlace ha expirado' },
        { status: 410 }
      );
    }

    // Get all active questions
    const questions = await prisma.valuesQuestion.findMany({
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
        tokenExpiry: evaluation.tokenExpiry,
        status: evaluation.status,
      },
      questions,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
