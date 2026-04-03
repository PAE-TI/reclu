import { prisma } from '@/lib/db';

// Type for evaluation types in campaigns
export type CampaignEvaluationType = 'DISC' | 'DRIVING_FORCES' | 'EQ' | 'DNA' | 'ACUMEN' | 'VALUES' | 'STRESS' | 'TECHNICAL';

/**
 * Updates the campaign candidate status when an evaluation is completed.
 * This function should be called from all external evaluation response routes.
 */
export async function updateCampaignCandidateOnCompletion(
  token: string,
  evaluationType: CampaignEvaluationType
): Promise<{ updated: boolean; candidateId?: string; campaignId?: string }> {
  try {
    // Map evaluation type to the corresponding token field
    const tokenFieldMap: Record<CampaignEvaluationType, string> = {
      'DISC': 'discToken',
      'DRIVING_FORCES': 'drivingForcesToken',
      'EQ': 'eqToken',
      'DNA': 'dnaToken',
      'ACUMEN': 'acumenToken',
      'VALUES': 'valuesToken',
      'STRESS': 'stressToken',
      'TECHNICAL': 'technicalToken',
    };

    const tokenField = tokenFieldMap[evaluationType];
    if (!tokenField) {
      return { updated: false };
    }

    // Find campaign candidate by token
    const candidate = await prisma.campaignCandidate.findFirst({
      where: { [tokenField]: token },
      include: {
        campaign: {
          select: {
            evaluationTypes: true,
          },
        },
      },
    });

    if (!candidate) {
      // Token doesn't belong to a campaign candidate
      return { updated: false };
    }

    // Get all campaign evaluation types
    const campaignEvalTypes = candidate.campaign.evaluationTypes as string[];

    // Check which evaluations are completed
    const completedEvaluations: string[] = [];

    for (const evalType of campaignEvalTypes) {
      const evalTokenField = tokenFieldMap[evalType as CampaignEvaluationType];
      if (!evalTokenField) continue;

      const evalToken = candidate[evalTokenField as keyof typeof candidate] as string | null;
      if (!evalToken) continue;

      // Check if this evaluation is completed
      let isCompleted = false;

      switch (evalType) {
        case 'DISC': {
          const eval_ = await prisma.externalEvaluation.findUnique({
            where: { token: evalToken },
            select: { status: true },
          });
          isCompleted = eval_?.status === 'COMPLETED';
          break;
        }
        case 'DRIVING_FORCES': {
          const eval_ = await prisma.externalDrivingForcesEvaluation.findUnique({
            where: { token: evalToken },
            select: { status: true },
          });
          isCompleted = eval_?.status === 'COMPLETED';
          break;
        }
        case 'EQ': {
          const eval_ = await prisma.externalEQEvaluation.findUnique({
            where: { token: evalToken },
            select: { status: true },
          });
          isCompleted = eval_?.status === 'COMPLETED';
          break;
        }
        case 'DNA': {
          const eval_ = await prisma.externalDNAEvaluation.findUnique({
            where: { token: evalToken },
            select: { status: true },
          });
          isCompleted = eval_?.status === 'COMPLETED';
          break;
        }
        case 'ACUMEN': {
          const eval_ = await prisma.externalAcumenEvaluation.findUnique({
            where: { token: evalToken },
            select: { status: true },
          });
          isCompleted = eval_?.status === 'COMPLETED';
          break;
        }
        case 'VALUES': {
          const eval_ = await prisma.externalValuesEvaluation.findUnique({
            where: { token: evalToken },
            select: { status: true },
          });
          isCompleted = eval_?.status === 'COMPLETED';
          break;
        }
        case 'STRESS': {
          const eval_ = await prisma.externalStressEvaluation.findUnique({
            where: { token: evalToken },
            select: { status: true },
          });
          isCompleted = eval_?.status === 'COMPLETED';
          break;
        }
      }

      if (isCompleted) {
        completedEvaluations.push(evalType);
      }
    }

    // Determine new status
    let newStatus: 'INVITED' | 'EVALUATING' | 'COMPLETED' = 'INVITED';

    if (completedEvaluations.length === campaignEvalTypes.length) {
      // All evaluations completed
      newStatus = 'COMPLETED';
    } else if (completedEvaluations.length > 0) {
      // Some evaluations completed
      newStatus = 'EVALUATING';
    }

    // Update candidate
    await prisma.campaignCandidate.update({
      where: { id: candidate.id },
      data: {
        status: newStatus,
        lastCompletedAt: new Date(),
      },
    });

    console.log(`Campaign candidate ${candidate.id} updated: ${newStatus} (${completedEvaluations.length}/${campaignEvalTypes.length} evaluations)`);

    return {
      updated: true,
      candidateId: candidate.id,
      campaignId: candidate.campaignId,
    };
  } catch (error) {
    console.error('Error updating campaign candidate:', error);
    return { updated: false };
  }
}
