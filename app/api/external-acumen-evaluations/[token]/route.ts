import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { calculateAcumenResults } from '@/lib/acumen-calculator';
import { createEvaluationCompletedNotification } from '@/lib/notifications';
import { canAccessTeamEvaluation } from '@/lib/team';
import { updateCampaignCandidateOnCompletion } from '@/lib/campaign-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const { searchParams } = new URL(request.url);
    const isResults = searchParams.get('results') === 'true';

    const evaluation = await prisma.externalAcumenEvaluation.findUnique({
      where: { token },
      include: {
        result: true,
        responses: {
          include: { question: true },
        },
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    // Check if viewing results
    if (isResults) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'No autorizado', requireAuth: true },
          { status: 401 }
        );
      }
      const hasAccess = await canAccessTeamEvaluation(session.user.id, evaluation.senderUserId);
      if (!hasAccess) {
        return NextResponse.json(
          { error: 'No tienes permiso para ver estos resultados' },
          { status: 403 }
        );
      }
    } else {
      // Check expiry for questionnaire access
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

      if (new Date() > new Date(evaluation.tokenExpiry)) {
        return NextResponse.json(
          { error: 'Esta evaluación ha expirado' },
          { status: 410 }
        );
      }
    }

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Error fetching Acumen evaluation:', error);
    return NextResponse.json(
      { error: 'Error al obtener la evaluación' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const body = await request.json();
    const { responses } = body;

    const evaluation = await prisma.externalAcumenEvaluation.findUnique({
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
            status: evaluation.status,
            completedAt: evaluation.completedAt,
          },
        },
        { status: 400 }
      );
    }

    if (new Date() > new Date(evaluation.tokenExpiry)) {
      return NextResponse.json(
        { error: 'Esta evaluación ha expirado' },
        { status: 410 }
      );
    }

    // Get questions to map responses
    const questions = await prisma.acumenQuestion.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
    });

    // Save responses
    for (const response of responses) {
      const question = questions.find(q => q.questionNumber === response.questionNumber);
      if (!question) continue;

      await prisma.externalAcumenResponse.upsert({
        where: {
          externalEvaluationId_questionId: {
            externalEvaluationId: evaluation.id,
            questionId: question.id,
          },
        },
        update: {
          selectedValue: response.selectedValue,
          questionNumber: response.questionNumber,
        },
        create: {
          externalEvaluationId: evaluation.id,
          questionId: question.id,
          questionNumber: response.questionNumber,
          selectedValue: response.selectedValue,
        },
      });
    }

    // Calculate results
    const responsesWithDimension = responses.map((r: any) => {
      const question = questions.find(q => q.questionNumber === r.questionNumber);
      return {
        questionNumber: r.questionNumber,
        selectedValue: r.selectedValue,
        dimension: question?.dimension || '',
        factor: question?.factor || '',
      };
    });

    const results = calculateAcumenResults(responsesWithDimension);

    // Save results
    await prisma.externalAcumenResult.create({
      data: {
        externalEvaluationId: evaluation.id,
        ...results,
      },
    });

    // Update evaluation status
    await prisma.externalAcumenEvaluation.update({
      where: { id: evaluation.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Create notification for the sender
    try {
      await createEvaluationCompletedNotification(
        evaluation.senderUserId,
        'ACUMEN',
        evaluation.recipientName,
        evaluation.recipientEmail,
        token
      );
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    // Update campaign candidate if this evaluation belongs to a campaign
    try {
      await updateCampaignCandidateOnCompletion(token, 'ACUMEN');
    } catch (campaignError) {
      console.error('Error updating campaign candidate:', campaignError);
    }

    return NextResponse.json({
      success: true,
      message: 'Evaluación completada exitosamente',
    });
  } catch (error) {
    console.error('Error submitting Acumen responses:', error);
    return NextResponse.json(
      { error: 'Error al guardar las respuestas' },
      { status: 500 }
    );
  }
}
