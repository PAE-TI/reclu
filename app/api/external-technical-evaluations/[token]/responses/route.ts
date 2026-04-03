import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateTechnicalResult } from '@/lib/technical-calculator';
import { createEvaluationCompletedNotification } from '@/lib/notifications';

interface ResponseData {
  questionId: string;
  selectedAnswer: string;
  responseTime?: number;
}

// POST - Enviar respuestas de la evaluación técnica
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const body = await request.json();
    const { responses } = body as { responses: ResponseData[] };

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { error: 'No se recibieron respuestas' },
        { status: 400 }
      );
    }

    // Find the evaluation
    const evaluation = await prisma.externalTechnicalEvaluation.findUnique({
      where: { token },
      include: {
        senderUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    if (evaluation.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Esta evaluación ya fue completada o ha expirado' },
        { status: 400 }
      );
    }

    if (new Date() > evaluation.tokenExpiry) {
      return NextResponse.json(
        { error: 'El enlace de la evaluación ha expirado' },
        { status: 410 }
      );
    }

    // Get all questions with correct answers
    const questionIds = responses.map(r => r.questionId);
    const questions = await prisma.technicalQuestion.findMany({
      where: { id: { in: questionIds } },
      select: {
        id: true,
        correctAnswer: true,
        difficulty: true,
        category: true,
      },
    });

    const questionMap = new Map(questions.map(q => [q.id, q]));

    // Process and save responses
    const processedResponses = responses.map(response => {
      const question = questionMap.get(response.questionId);
      const isCorrect = question ? response.selectedAnswer === question.correctAnswer : false;
      return {
        externalEvaluationId: evaluation.id,
        questionId: response.questionId,
        selectedAnswer: response.selectedAnswer,
        isCorrect,
        responseTime: response.responseTime || null,
      };
    });

    // Save responses in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete any existing responses (in case of retry)
      await tx.externalTechnicalResponse.deleteMany({
        where: { externalEvaluationId: evaluation.id },
      });

      // Create new responses
      await tx.externalTechnicalResponse.createMany({
        data: processedResponses,
      });
    });

    // Calculate results
    const technicalResponses = processedResponses.map((r, i) => {
      const question = questionMap.get(r.questionId);
      return {
        questionId: r.questionId,
        selectedAnswer: r.selectedAnswer,
        isCorrect: r.isCorrect,
        responseTime: r.responseTime || undefined,
        difficulty: question?.difficulty,
        category: question?.category || undefined,
      };
    });

    const questionsForCalc = questions.map(q => ({
      id: q.id,
      difficulty: q.difficulty,
      category: q.category,
    }));

    const result = calculateTechnicalResult(technicalResponses, questionsForCalc);

    // Save result
    await prisma.externalTechnicalResult.create({
      data: {
        externalEvaluationId: evaluation.id,
        totalScore: result.totalScore,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        performanceLevel: result.performanceLevel,
        categoryScores: result.categoryScores,
        easyCorrect: result.easyCorrect,
        easyTotal: result.easyTotal,
        mediumCorrect: result.mediumCorrect,
        mediumTotal: result.mediumTotal,
        hardCorrect: result.hardCorrect,
        hardTotal: result.hardTotal,
        totalTimeTaken: result.totalTimeTaken,
        averageTimePerQuestion: result.averageTimePerQuestion,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
      },
    });

    // Update evaluation status
    await prisma.externalTechnicalEvaluation.update({
      where: { id: evaluation.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Create notification for sender
    try {
      await createEvaluationCompletedNotification(
        evaluation.senderUser.id,
        'TECHNICAL',
        evaluation.recipientName,
        evaluation.recipientEmail,
        evaluation.token
      );
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    return NextResponse.json({
      success: true,
      result: {
        totalScore: result.totalScore,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        performanceLevel: result.performanceLevel,
      },
    });
  } catch (error) {
    console.error('Error submitting technical responses:', error);
    return NextResponse.json(
      { error: 'Error al enviar respuestas' },
      { status: 500 }
    );
  }
}
