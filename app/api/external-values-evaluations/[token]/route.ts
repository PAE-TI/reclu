import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { calculateValuesResults } from '@/lib/values-calculator';
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
    const wantsResults = searchParams.get('results') === 'true';

    const evaluation = await prisma.externalValuesEvaluation.findUnique({
      where: { token },
      include: {
        senderUser: {
          select: { firstName: true, lastName: true, company: true },
        },
        responses: true,
        result: true,
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    // Check expiry for non-results requests
    // For results, require authentication
    if (wantsResults) {
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
    }

    if (evaluation.status === 'COMPLETED') {
      return NextResponse.json({
        evaluation: {
          id: evaluation.id,
          title: evaluation.title,
          recipientName: evaluation.recipientName,
          recipientEmail: evaluation.recipientEmail,
          tokenExpiry: evaluation.tokenExpiry,
          status: evaluation.status,
          completedAt: evaluation.completedAt,
        },
        alreadyCompleted: true,
      });
    }

    if (!wantsResults && new Date() > evaluation.tokenExpiry) {
      return NextResponse.json(
        { error: 'El enlace ha expirado' },
        { status: 410 }
      );
    }

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
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

    // Find evaluation
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

    // Get questions for validation
    const questions = await prisma.valuesQuestion.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
    });

    // Save responses
    for (const response of responses) {
      const question = questions.find(q => q.questionNumber === response.questionNumber);
      if (question) {
        await prisma.externalValuesResponse.upsert({
          where: {
            externalEvaluationId_questionId: {
              externalEvaluationId: evaluation.id,
              questionId: question.id,
            },
          },
          update: {
            selectedValue: response.selectedValue,
          },
          create: {
            externalEvaluationId: evaluation.id,
            questionId: question.id,
            questionNumber: response.questionNumber,
            selectedValue: response.selectedValue,
          },
        });
      }
    }

    // Calculate results
    const savedResponses = await prisma.externalValuesResponse.findMany({
      where: { externalEvaluationId: evaluation.id },
      include: { question: true },
    });

    const formattedResponses = savedResponses.map(r => ({
      questionNumber: r.questionNumber,
      selectedValue: r.selectedValue,
      dimension: r.question.dimension,
      category: r.question.category,
    }));

    const results = calculateValuesResults(formattedResponses);

    // Save results
    await prisma.externalValuesResult.upsert({
      where: { externalEvaluationId: evaluation.id },
      update: {
        ...results,
      },
      create: {
        externalEvaluationId: evaluation.id,
        ...results,
      },
    });

    // Update evaluation status
    await prisma.externalValuesEvaluation.update({
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
        'VALUES',
        evaluation.recipientName,
        evaluation.recipientEmail,
        token
      );
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    // Update campaign candidate if this evaluation belongs to a campaign
    try {
      await updateCampaignCandidateOnCompletion(token, 'VALUES');
    } catch (campaignError) {
      console.error('Error updating campaign candidate:', campaignError);
    }

    return NextResponse.json({
      success: true,
      message: 'Evaluación completada exitosamente',
    });
  } catch (error) {
    console.error('Error saving responses:', error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
