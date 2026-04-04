import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateStressResults } from '@/lib/stress-calculator';
import { createEvaluationCompletedNotification } from '@/lib/notifications';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canAccessTeamEvaluation } from '@/lib/team';
import { updateCampaignCandidateOnCompletion } from '@/lib/campaign-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const url = new URL(request.url);
    const includeResults = url.searchParams.get('results') === 'true';

    const evaluation = await prisma.externalStressEvaluation.findUnique({
      where: { token },
      include: {
        result: true,
        senderUser: {
          select: { id: true, name: true, company: true },
        },
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    if (evaluation.status === 'COMPLETED') {
      if (includeResults && evaluation.result) {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
          return NextResponse.json(
            { error: 'Debes iniciar sesión para ver los resultados', requireAuth: true },
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

      return NextResponse.json({
        evaluation: {
          id: evaluation.id,
          title: evaluation.title,
          recipientName: evaluation.recipientName,
          recipientEmail: evaluation.recipientEmail,
          status: evaluation.status,
          tokenExpiry: evaluation.tokenExpiry,
          completedAt: evaluation.completedAt,
          senderName: evaluation.senderUser.name,
          company: evaluation.senderUser.company,
        },
        result: evaluation.result,
      });
    }

    // For pending evaluations with results, verify authentication
    if (includeResults && evaluation.result) {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Debes iniciar sesión para ver los resultados', requireAuth: true },
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
    } else if (new Date() > evaluation.tokenExpiry) {
      // Check if expired (only for questionnaire access)
      return NextResponse.json(
        { error: 'Este enlace de evaluación ha expirado' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      evaluation: {
        id: evaluation.id,
        title: evaluation.title,
        recipientName: evaluation.recipientName,
        recipientEmail: evaluation.recipientEmail,
        status: evaluation.status,
        tokenExpiry: evaluation.tokenExpiry,
        completedAt: evaluation.completedAt,
        senderName: evaluation.senderUser.name,
        company: evaluation.senderUser.company,
      },
      result: evaluation.result,
    });
  } catch (error) {
    console.error('Error fetching stress evaluation:', error);
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

    // Validate evaluation
    const evaluation = await prisma.externalStressEvaluation.findUnique({
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
        { error: 'Este enlace de evaluación ha expirado' },
        { status: 410 }
      );
    }

    // Get questions for mapping
    const questions = await prisma.stressQuestion.findMany({
      where: { isActive: true },
    });

    const questionMap = new Map(questions.map(q => [q.questionNumber, q]));

    // Save responses
    for (const response of responses) {
      const question = questionMap.get(response.questionNumber);
      if (!question) continue;

      await prisma.externalStressResponse.upsert({
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
    const results = calculateStressResults(responses);

    // Save results
    await prisma.externalStressResult.upsert({
      where: { externalEvaluationId: evaluation.id },
      update: {
        estresLaboralScore: results.estresLaboralScore,
        capacidadRecuperacionScore: results.capacidadRecuperacionScore,
        manejoEmocionalScore: results.manejoEmocionalScore,
        equilibrioVidaScore: results.equilibrioVidaScore,
        resilienciaScore: results.resilienciaScore,
        nivelEstresGeneral: results.nivelEstresGeneral,
        indiceResiliencia: results.indiceResiliencia,
        capacidadAdaptacion: results.capacidadAdaptacion,
        totalStressScore: results.totalStressScore,
        stressLevel: results.stressLevel,
        resilienceLevel: results.resilienceLevel,
        stressProfile: results.stressProfile,
        riskFactors: results.riskFactors,
        protectiveFactors: results.protectiveFactors,
        primaryStrengths: results.primaryStrengths,
        developmentAreas: results.developmentAreas,
      },
      create: {
        externalEvaluationId: evaluation.id,
        estresLaboralScore: results.estresLaboralScore,
        capacidadRecuperacionScore: results.capacidadRecuperacionScore,
        manejoEmocionalScore: results.manejoEmocionalScore,
        equilibrioVidaScore: results.equilibrioVidaScore,
        resilienciaScore: results.resilienciaScore,
        nivelEstresGeneral: results.nivelEstresGeneral,
        indiceResiliencia: results.indiceResiliencia,
        capacidadAdaptacion: results.capacidadAdaptacion,
        totalStressScore: results.totalStressScore,
        stressLevel: results.stressLevel,
        resilienceLevel: results.resilienceLevel,
        stressProfile: results.stressProfile,
        riskFactors: results.riskFactors,
        protectiveFactors: results.protectiveFactors,
        primaryStrengths: results.primaryStrengths,
        developmentAreas: results.developmentAreas,
      },
    });

    // Update evaluation status
    await prisma.externalStressEvaluation.update({
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
        'STRESS',
        evaluation.recipientName,
        evaluation.recipientEmail,
        token
      );
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    // Update campaign candidate if this evaluation belongs to a campaign
    try {
      await updateCampaignCandidateOnCompletion(token, 'STRESS');
    } catch (campaignError) {
      console.error('Error updating campaign candidate:', campaignError);
    }

    return NextResponse.json({
      success: true,
      message: 'Evaluación completada exitosamente',
    });
  } catch (error) {
    console.error('Error saving stress responses:', error);
    return NextResponse.json(
      { error: 'Error al guardar las respuestas' },
      { status: 500 }
    );
  }
}
