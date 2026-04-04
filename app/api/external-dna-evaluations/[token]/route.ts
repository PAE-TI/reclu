import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateDNAScores } from '@/lib/dna-calculator';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createEvaluationCompletedNotification } from '@/lib/notifications';
import { canAccessTeamEvaluation } from '@/lib/team';
import { updateCampaignCandidateOnCompletion } from '@/lib/campaign-utils';

// GET - Get evaluation by token
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const url = new URL(request.url);
    const includeResults = url.searchParams.get('results') === 'true';
    
    const evaluation = await prisma.externalDNAEvaluation.findUnique({
      where: { token },
      include: {
        result: true,
        responses: true,
        senderUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
          },
        },
      },
    });
    
    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }
    
    // Check if token is expired (only for pending evaluations)
    if (evaluation.status === 'PENDING' && new Date() > evaluation.tokenExpiry) {
      return NextResponse.json(
        { error: 'El enlace de evaluación ha expirado' },
        { status: 410 }
      );
    }
    
    // If requesting results for a completed evaluation, verify authentication
    if (includeResults && evaluation.status === 'COMPLETED' && evaluation.result) {
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
    
    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    return NextResponse.json(
      { error: 'Error al obtener la evaluación' },
      { status: 500 }
    );
  }
}

// POST - Submit responses and calculate results
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const body = await request.json();
    const { responses } = body;
    
    // Get the evaluation
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
        {
          error: 'Esta evaluación ya fue completada',
          alreadyCompleted: true,
          evaluation: {
            id: evaluation.id,
            recipientName: evaluation.recipientName,
            recipientEmail: evaluation.recipientEmail,
            title: evaluation.title,
            status: evaluation.status,
            completedAt: evaluation.completedAt,
          },
        },
        { status: 400 }
      );
    }
    
    if (new Date() > evaluation.tokenExpiry) {
      return NextResponse.json(
        { error: 'El enlace de evaluación ha expirado' },
        { status: 410 }
      );
    }
    
    // Get all questions to map responses correctly
    const questions = await prisma.dNAQuestion.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
    });
    
    // Save all responses
    const responsePromises = responses.map(async (response: { questionId: string; selectedValue: number }) => {
      return prisma.externalDNAResponse.upsert({
        where: {
          externalEvaluationId_questionId: {
            externalEvaluationId: evaluation.id,
            questionId: response.questionId,
          },
        },
        update: {
          selectedValue: response.selectedValue,
        },
        create: {
          externalEvaluationId: evaluation.id,
          questionId: response.questionId,
          selectedValue: response.selectedValue,
        },
      });
    });
    
    await Promise.all(responsePromises);
    
    // Calculate DNA scores
    const scoringResponses = responses.map((r: { questionId: string; selectedValue: number }) => {
      const question = questions.find((q) => q.id === r.questionId);
      return {
        questionId: r.questionId,
        selectedValue: r.selectedValue,
        competency: question?.competency || 'ANALYTICAL_THINKING',
        category: question?.category || 'THINKING',
        isReversed: question?.isReversed || false,
        weight: question?.weight || 1.0,
      };
    });
    
    const scores = calculateDNAScores(scoringResponses);
    
    // Save result
    const result = await prisma.externalDNAResult.upsert({
      where: { externalEvaluationId: evaluation.id },
      update: {
        dnaProfile: scores.dnaProfile,
        dnaLevel: scores.dnaLevel,
        totalDNAPercentile: scores.totalDNAPercentile,
        analyticalThinkingPercentile: scores.analyticalThinkingPercentile,
        problemSolvingPercentile: scores.problemSolvingPercentile,
        creativityPercentile: scores.creativityPercentile,
        adaptabilityPercentile: scores.adaptabilityPercentile,
        achievementOrientationPercentile: scores.achievementOrientationPercentile,
        timeManagementPercentile: scores.timeManagementPercentile,
        planningOrganizationPercentile: scores.planningOrganizationPercentile,
        attentionToDetailPercentile: scores.attentionToDetailPercentile,
        customerServicePercentile: scores.customerServicePercentile,
        writtenCommunicationPercentile: scores.writtenCommunicationPercentile,
        verbalCommunicationPercentile: scores.verbalCommunicationPercentile,
        influencePercentile: scores.influencePercentile,
        negotiationPercentile: scores.negotiationPercentile,
        presentationSkillsPercentile: scores.presentationSkillsPercentile,
        teamworkPercentile: scores.teamworkPercentile,
        leadershipPercentile: scores.leadershipPercentile,
        developingOthersPercentile: scores.developingOthersPercentile,
        conflictManagementPercentile: scores.conflictManagementPercentile,
        decisionMakingPercentile: scores.decisionMakingPercentile,
        strategicThinkingPercentile: scores.strategicThinkingPercentile,
        relationshipBuildingPercentile: scores.relationshipBuildingPercentile,
        businessAcumenPercentile: scores.businessAcumenPercentile,
        resultsOrientationPercentile: scores.resultsOrientationPercentile,
        resiliencePercentile: scores.resiliencePercentile,
        accountabilityPercentile: scores.accountabilityPercentile,
        thinkingCategoryScore: scores.thinkingCategoryScore,
        communicationCategoryScore: scores.communicationCategoryScore,
        leadershipCategoryScore: scores.leadershipCategoryScore,
        resultsCategoryScore: scores.resultsCategoryScore,
        relationshipCategoryScore: scores.relationshipCategoryScore,
        primaryStrengths: scores.primaryStrengths,
        developmentAreas: scores.developmentAreas,
      },
      create: {
        externalEvaluationId: evaluation.id,
        dnaProfile: scores.dnaProfile,
        dnaLevel: scores.dnaLevel,
        totalDNAPercentile: scores.totalDNAPercentile,
        analyticalThinkingPercentile: scores.analyticalThinkingPercentile,
        problemSolvingPercentile: scores.problemSolvingPercentile,
        creativityPercentile: scores.creativityPercentile,
        adaptabilityPercentile: scores.adaptabilityPercentile,
        achievementOrientationPercentile: scores.achievementOrientationPercentile,
        timeManagementPercentile: scores.timeManagementPercentile,
        planningOrganizationPercentile: scores.planningOrganizationPercentile,
        attentionToDetailPercentile: scores.attentionToDetailPercentile,
        customerServicePercentile: scores.customerServicePercentile,
        writtenCommunicationPercentile: scores.writtenCommunicationPercentile,
        verbalCommunicationPercentile: scores.verbalCommunicationPercentile,
        influencePercentile: scores.influencePercentile,
        negotiationPercentile: scores.negotiationPercentile,
        presentationSkillsPercentile: scores.presentationSkillsPercentile,
        teamworkPercentile: scores.teamworkPercentile,
        leadershipPercentile: scores.leadershipPercentile,
        developingOthersPercentile: scores.developingOthersPercentile,
        conflictManagementPercentile: scores.conflictManagementPercentile,
        decisionMakingPercentile: scores.decisionMakingPercentile,
        strategicThinkingPercentile: scores.strategicThinkingPercentile,
        relationshipBuildingPercentile: scores.relationshipBuildingPercentile,
        businessAcumenPercentile: scores.businessAcumenPercentile,
        resultsOrientationPercentile: scores.resultsOrientationPercentile,
        resiliencePercentile: scores.resiliencePercentile,
        accountabilityPercentile: scores.accountabilityPercentile,
        thinkingCategoryScore: scores.thinkingCategoryScore,
        communicationCategoryScore: scores.communicationCategoryScore,
        leadershipCategoryScore: scores.leadershipCategoryScore,
        resultsCategoryScore: scores.resultsCategoryScore,
        relationshipCategoryScore: scores.relationshipCategoryScore,
        primaryStrengths: scores.primaryStrengths,
        developmentAreas: scores.developmentAreas,
      },
    });
    
    // Update evaluation status
    await prisma.externalDNAEvaluation.update({
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
        'DNA',
        evaluation.recipientName,
        evaluation.recipientEmail,
        token
      );
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    // Update campaign candidate if this evaluation belongs to a campaign
    try {
      await updateCampaignCandidateOnCompletion(token, 'DNA');
    } catch (campaignError) {
      console.error('Error updating campaign candidate:', campaignError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Evaluación completada exitosamente',
      result,
    });
  } catch (error) {
    console.error('Error submitting DNA evaluation:', error);
    return NextResponse.json(
      { error: 'Error al enviar la evaluación' },
      { status: 500 }
    );
  }
}
