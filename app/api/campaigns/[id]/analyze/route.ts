import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { rankCandidates, generateCampaignSummary, CandidateEvaluationData, Language } from '@/lib/candidate-analyzer';
import { getJobPositionById } from '@/lib/job-positions';

// POST - Analizar y rankear todos los candidatos de la campaña
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    
    // Get language from request body
    let lang: Language = 'es';
    try {
      const body = await request.json();
      if (body.language === 'en' || body.language === 'es') {
        lang = body.language;
      }
    } catch {
      // No body or invalid JSON, use default language
    }

    // Obtener el dueño real si es facilitador
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, ownerId: true, role: true },
    });

    const ownerId = user?.role === 'FACILITATOR' && user?.ownerId ? user.ownerId : session.user.id;

    // Obtener la campaña con candidatos
    const campaign = await prisma.selectionCampaign.findFirst({
      where: { id, userId: ownerId },
      include: { candidates: true },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    // Buscar el jobPositionId basado en el título del cargo
    const jobPosition = getJobPositionById(campaign.jobCategory || '') || null;
    const jobPositionId = jobPosition?.id || 'generic';

    // Recopilar datos de evaluaciones para cada candidato
    const candidatesData: { id: string; name: string; data: CandidateEvaluationData }[] = [];

    for (const candidate of campaign.candidates) {
      const data: CandidateEvaluationData = {};

      // Obtener resultados de DISC
      if (candidate.discToken) {
        const discEval = await prisma.externalEvaluation.findUnique({
          where: { token: candidate.discToken },
          include: { result: true },
        });
        if (discEval?.result) {
          data.disc = {
            primaryStyle: discEval.result.primaryStyle,
            percentileD: discEval.result.percentileD,
            percentileI: discEval.result.percentileI,
            percentileS: discEval.result.percentileS,
            percentileC: discEval.result.percentileC,
          };
        }
      }

      // Obtener resultados de Driving Forces
      if (candidate.drivingForcesToken) {
        const dfEval = await prisma.externalDrivingForcesEvaluation.findUnique({
          where: { token: candidate.drivingForcesToken },
          include: { result: true },
        });
        if (dfEval?.result) {
          data.drivingForces = {
            intelectualPercentile: dfEval.result.intelectualPercentile,
            instintivoPercentile: dfEval.result.instintivoPercentile,
            practicoPercentile: dfEval.result.practicoPercentile,
            altruistaPercentile: dfEval.result.altruistaPercentile,
            armoniosoPercentile: dfEval.result.armoniosoPercentile,
            objetivoPercentile: dfEval.result.objetivoPercentile,
            benevoloPercentile: dfEval.result.benevoloPercentile,
            intencionalPercentile: dfEval.result.intencionalPercentile,
            dominantePercentile: dfEval.result.dominantePercentile,
            colaborativoPercentile: dfEval.result.colaborativoPercentile,
            estructuradoPercentile: dfEval.result.estructuradoPercentile,
            receptivoPercentile: dfEval.result.receptivoPercentile,
            topMotivator: dfEval.result.topMotivator,
          };
        }
      }

      // Obtener resultados de EQ
      if (candidate.eqToken) {
        const eqEval = await prisma.externalEQEvaluation.findUnique({
          where: { token: candidate.eqToken },
          include: { result: true },
        });
        if (eqEval?.result) {
          data.eq = {
            selfAwarenessPercentile: eqEval.result.selfAwarenessPercentile,
            selfRegulationPercentile: eqEval.result.selfRegulationPercentile,
            motivationPercentile: eqEval.result.motivationPercentile,
            empathyPercentile: eqEval.result.empathyPercentile,
            socialSkillsPercentile: eqEval.result.socialSkillsPercentile,
            totalEQPercentile: eqEval.result.totalEQPercentile,
            eqLevel: eqEval.result.eqLevel,
          };
        }
      }

      // Obtener resultados de DNA
      if (candidate.dnaToken) {
        const dnaEval = await prisma.externalDNAEvaluation.findUnique({
          where: { token: candidate.dnaToken },
          include: { result: true },
        });
        if (dnaEval?.result) {
          data.dna = {
            thinkingCategoryScore: dnaEval.result.thinkingCategoryScore,
            communicationCategoryScore: dnaEval.result.communicationCategoryScore,
            leadershipCategoryScore: dnaEval.result.leadershipCategoryScore,
            resultsCategoryScore: dnaEval.result.resultsCategoryScore,
            relationshipCategoryScore: dnaEval.result.relationshipCategoryScore,
            totalDNAPercentile: dnaEval.result.totalDNAPercentile,
            dnaLevel: dnaEval.result.dnaLevel,
            primaryStrengths: dnaEval.result.primaryStrengths,
          };
        }
      }

      // Obtener resultados de Acumen
      if (candidate.acumenToken) {
        const acumenEval = await prisma.externalAcumenEvaluation.findUnique({
          where: { token: candidate.acumenToken },
          include: { result: true },
        });
        if (acumenEval?.result) {
          data.acumen = {
            externalClarityScore: acumenEval.result.externalClarityScore,
            internalClarityScore: acumenEval.result.internalClarityScore,
            totalAcumenScore: acumenEval.result.totalAcumenScore,
            acumenLevel: acumenEval.result.acumenLevel,
          };
        }
      }

      // Obtener resultados de Values
      if (candidate.valuesToken) {
        const valuesEval = await prisma.externalValuesEvaluation.findUnique({
          where: { token: candidate.valuesToken },
          include: { result: true },
        });
        if (valuesEval?.result) {
          data.values = {
            teoricoScore: valuesEval.result.teoricoScore,
            utilitarioScore: valuesEval.result.utilitarioScore,
            esteticoScore: valuesEval.result.esteticoScore,
            socialScore: valuesEval.result.socialScore,
            individualistaScore: valuesEval.result.individualistaScore,
            tradicionalScore: valuesEval.result.tradicionalScore,
            primaryValues: valuesEval.result.primaryValues,
          };
        }
      }

      // Obtener resultados de Stress
      if (candidate.stressToken) {
        const stressEval = await prisma.externalStressEvaluation.findUnique({
          where: { token: candidate.stressToken },
          include: { result: true },
        });
        if (stressEval?.result) {
          data.stress = {
            nivelEstresGeneral: stressEval.result.nivelEstresGeneral,
            indiceResiliencia: stressEval.result.indiceResiliencia,
            stressLevel: stressEval.result.stressLevel,
            resilienceLevel: stressEval.result.resilienceLevel,
          };
        }
      }

      candidatesData.push({
        id: candidate.id,
        name: candidate.name,
        data,
      });
    }

    // Analizar y rankear candidatos
    const rankedCandidates = rankCandidates(candidatesData, jobPositionId, undefined, lang);
    
    // Generar resumen de la campaña
    const summary = generateCampaignSummary(rankedCandidates, campaign.jobTitle, lang);

    // Actualizar los candidatos con sus scores y rankings
    for (const rankedCandidate of rankedCandidates) {
      // Determinar el estado del candidato
      const candidateHasData = Object.keys(
        candidatesData.find(c => c.id === rankedCandidate.candidateId)?.data || {}
      ).length > 0;
      
      const newStatus = rankedCandidate.overallScore > 0 ? 'COMPLETED' : 
                        candidateHasData ? 'EVALUATING' : 'INVITED';

      await prisma.campaignCandidate.update({
        where: { id: rankedCandidate.candidateId },
        data: {
          overallScore: rankedCandidate.overallScore || null,
          rankPosition: rankedCandidate.rankPosition,
          analysisData: JSON.parse(JSON.stringify(rankedCandidate)),
          status: newStatus,
          lastCompletedAt: rankedCandidate.overallScore > 0 ? new Date() : undefined,
        },
      });
    }

    // Actualizar estado de la campaña si es necesario
    if (summary.completedEvaluations > 0 && campaign.status === 'ACTIVE') {
      await prisma.selectionCampaign.update({
        where: { id },
        data: { status: 'ANALYZING' },
      });
    }

    return NextResponse.json({
      rankedCandidates,
      summary,
      jobPosition: jobPosition ? {
        id: jobPosition.id,
        title: jobPosition.title,
        category: jobPosition.category,
      } : null,
      analysisLanguage: lang,
    });
  } catch (error) {
    console.error('Error analyzing campaign:', error);
    return NextResponse.json({ error: 'Error al analizar la campaña' }, { status: 500 });
  }
}
