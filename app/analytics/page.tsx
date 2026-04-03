import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getTeamUserIds } from '@/lib/team';
import AnalyticsClient from '@/components/analytics/analytics-client';

export const dynamic = 'force-dynamic';

export default async function Analytics() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Get team user IDs (for FULL_ACCESS facilitators, this includes owner + all facilitators)
  const teamUserIds = await getTeamUserIds(session.user.id);

  // Fetch all completed evaluations from team members
  const [
    discEvaluations,
    drivingForcesEvaluations,
    eqEvaluations,
    dnaEvaluations,
    acumenEvaluations,
    valuesEvaluations,
    stressEvaluations,
    technicalEvaluations,
  ] = await Promise.all([
    prisma.externalEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds }, status: 'COMPLETED' },
      include: { result: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalDrivingForcesEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds }, status: 'COMPLETED' },
      include: { result: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalEQEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds }, status: 'COMPLETED' },
      include: { result: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalDNAEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds }, status: 'COMPLETED' },
      include: { result: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalAcumenEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds }, status: 'COMPLETED' },
      include: { result: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalValuesEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds }, status: 'COMPLETED' },
      include: { result: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalStressEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds }, status: 'COMPLETED' },
      include: { result: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalTechnicalEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds }, status: 'COMPLETED' },
      include: { result: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // Crear mapa de personas evaluadas (por email)
  const peopleMap = new Map<string, {
    email: string;
    name: string;
    disc: any | null;
    drivingForces: any | null;
    eq: any | null;
    dna: any | null;
    acumen: any | null;
    values: any | null;
    stress: any | null;
    technical: any | null;
    discDate: string | null;
    dfDate: string | null;
    eqDate: string | null;
    dnaDate: string | null;
    acumenDate: string | null;
    valuesDate: string | null;
    stressDate: string | null;
    technicalDate: string | null;
  }>();

  // Procesar evaluaciones DISC externas
  for (const evaluation of discEvaluations) {
    if (evaluation.result) {
      const key = evaluation.recipientEmail.toLowerCase();
      const existing = peopleMap.get(key) || {
        email: evaluation.recipientEmail,
        name: evaluation.recipientName,
        disc: null,
        drivingForces: null,
        eq: null,
        dna: null,
        acumen: null,
        values: null,
        stress: null,
        technical: null,
        discDate: null,
        dfDate: null,
        eqDate: null,
        dnaDate: null,
        acumenDate: null,
        valuesDate: null,
        stressDate: null,
        technicalDate: null,
      };
      
      // Solo guardar la más reciente
      if (!existing.discDate || new Date(evaluation.completedAt || evaluation.createdAt) > new Date(existing.discDate)) {
        existing.disc = {
          id: evaluation.id,
          percentileD: evaluation.result.percentileD,
          percentileI: evaluation.result.percentileI,
          percentileS: evaluation.result.percentileS,
          percentileC: evaluation.result.percentileC,
          personalityType: evaluation.result.personalityType,
          primaryStyle: evaluation.result.primaryStyle,
          secondaryStyle: evaluation.result.secondaryStyle,
          isOvershift: evaluation.result.isOvershift,
          isUndershift: evaluation.result.isUndershift,
          isTightPattern: evaluation.result.isTightPattern,
          styleIntensity: evaluation.result.styleIntensity,
        };
        existing.discDate = (evaluation.completedAt || evaluation.createdAt).toISOString();
      }
      
      peopleMap.set(key, existing);
    }
  }

  // Procesar evaluaciones de Fuerzas Motivadoras externas
  for (const evaluation of drivingForcesEvaluations) {
      if (evaluation.result) {
        const key = evaluation.recipientEmail.toLowerCase();
        const existing = peopleMap.get(key) || {
          email: evaluation.recipientEmail,
          name: evaluation.recipientName,
          disc: null,
          drivingForces: null,
          eq: null,
          dna: null,
          acumen: null,
          values: null,
          stress: null,
        technical: null,
          discDate: null,
          dfDate: null,
          eqDate: null,
          dnaDate: null,
          acumenDate: null,
          valuesDate: null,
          stressDate: null,
        technicalDate: null,
        };
        
        // Solo guardar la más reciente
        if (!existing.dfDate || new Date(evaluation.completedAt || evaluation.createdAt) > new Date(existing.dfDate)) {
          existing.drivingForces = {
            id: evaluation.id,
            intelectualPercentile: evaluation.result.intelectualPercentile,
            instintivoPercentile: evaluation.result.instintivoPercentile,
            practicoPercentile: evaluation.result.practicoPercentile,
            altruistaPercentile: evaluation.result.altruistaPercentile,
            armoniosoPercentile: evaluation.result.armoniosoPercentile,
            objetivoPercentile: evaluation.result.objetivoPercentile,
            benevoloPercentile: evaluation.result.benevoloPercentile,
            intencionalPercentile: evaluation.result.intencionalPercentile,
            dominantePercentile: evaluation.result.dominantePercentile,
            colaborativoPercentile: evaluation.result.colaborativoPercentile,
            estructuradoPercentile: evaluation.result.estructuradoPercentile,
            receptivoPercentile: evaluation.result.receptivoPercentile,
            primaryMotivators: evaluation.result.primaryMotivators,
            situationalMotivators: evaluation.result.situationalMotivators,
            indifferentMotivators: evaluation.result.indifferentMotivators,
            topMotivator: evaluation.result.topMotivator,
          };
          existing.dfDate = (evaluation.completedAt || evaluation.createdAt).toISOString();
        }
        
        // Actualizar nombre si es más reciente
        if (evaluation.recipientName && evaluation.recipientName.length > existing.name.length) {
          existing.name = evaluation.recipientName;
        }
        
        peopleMap.set(key, existing);
      }
    }

  // Procesar evaluaciones EQ externas
  for (const evaluation of eqEvaluations) {
    if (evaluation.result) {
      const key = evaluation.recipientEmail.toLowerCase();
      const existing = peopleMap.get(key) || {
        email: evaluation.recipientEmail,
        name: evaluation.recipientName,
        disc: null,
        drivingForces: null,
        eq: null,
        dna: null,
        acumen: null,
        values: null,
        stress: null,
        technical: null,
        discDate: null,
        dfDate: null,
        eqDate: null,
        dnaDate: null,
        acumenDate: null,
        valuesDate: null,
        stressDate: null,
        technicalDate: null,
      };
      
      // Solo guardar la más reciente
      if (!existing.eqDate || new Date(evaluation.completedAt || evaluation.createdAt) > new Date(existing.eqDate)) {
        existing.eq = {
          id: evaluation.id,
          totalScore: evaluation.result.totalEQPercentile,
          eqLevel: evaluation.result.eqLevel,
          autoconcienciaPercentile: evaluation.result.selfAwarenessPercentile,
          autorregulacionPercentile: evaluation.result.selfRegulationPercentile,
          motivacionPercentile: evaluation.result.motivationPercentile,
          empatiaPercentile: evaluation.result.empathyPercentile,
          habilidadesSocialesPercentile: evaluation.result.socialSkillsPercentile,
          strengths: evaluation.result.primaryStrengths,
          developmentAreas: evaluation.result.developmentAreas,
          profile: evaluation.result.eqProfile,
        };
        existing.eqDate = (evaluation.completedAt || evaluation.createdAt).toISOString();
      }
      
      // Actualizar nombre si es más reciente
      if (evaluation.recipientName && evaluation.recipientName.length > existing.name.length) {
        existing.name = evaluation.recipientName;
      }
      
      peopleMap.set(key, existing);
    }
  }

  // Procesar evaluaciones DNA externas
  
  for (const evaluation of dnaEvaluations) {
      if (evaluation.result) {
        const key = evaluation.recipientEmail.toLowerCase();
        const existing = peopleMap.get(key) || {
          email: evaluation.recipientEmail,
          name: evaluation.recipientName,
          disc: null,
          drivingForces: null,
          eq: null,
          dna: null,
          acumen: null,
          values: null,
          stress: null,
        technical: null,
          discDate: null,
          dfDate: null,
          eqDate: null,
          dnaDate: null,
          acumenDate: null,
          valuesDate: null,
          stressDate: null,
        technicalDate: null,
        };
        
        // Solo guardar la más reciente
        if (!existing.dnaDate || new Date(evaluation.completedAt || evaluation.createdAt) > new Date(existing.dnaDate)) {
          existing.dna = {
            id: evaluation.id,
            totalDNAPercentile: evaluation.result.totalDNAPercentile,
            dnaLevel: evaluation.result.dnaLevel,
            dnaProfile: evaluation.result.dnaProfile,
            thinkingCategoryScore: evaluation.result.thinkingCategoryScore,
            communicationCategoryScore: evaluation.result.communicationCategoryScore,
            leadershipCategoryScore: evaluation.result.leadershipCategoryScore,
            resultsCategoryScore: evaluation.result.resultsCategoryScore,
            relationshipCategoryScore: evaluation.result.relationshipCategoryScore,
            primaryStrengths: evaluation.result.primaryStrengths,
            developmentAreas: evaluation.result.developmentAreas,
            // Competency percentiles
            analyticalThinkingPercentile: evaluation.result.analyticalThinkingPercentile,
            problemSolvingPercentile: evaluation.result.problemSolvingPercentile,
            creativityPercentile: evaluation.result.creativityPercentile,
            adaptabilityPercentile: evaluation.result.adaptabilityPercentile,
            achievementOrientationPercentile: evaluation.result.achievementOrientationPercentile,
            timeManagementPercentile: evaluation.result.timeManagementPercentile,
            planningOrganizationPercentile: evaluation.result.planningOrganizationPercentile,
            attentionToDetailPercentile: evaluation.result.attentionToDetailPercentile,
            customerServicePercentile: evaluation.result.customerServicePercentile,
            writtenCommunicationPercentile: evaluation.result.writtenCommunicationPercentile,
            verbalCommunicationPercentile: evaluation.result.verbalCommunicationPercentile,
            influencePercentile: evaluation.result.influencePercentile,
            negotiationPercentile: evaluation.result.negotiationPercentile,
            presentationSkillsPercentile: evaluation.result.presentationSkillsPercentile,
            teamworkPercentile: evaluation.result.teamworkPercentile,
            leadershipPercentile: evaluation.result.leadershipPercentile,
            developingOthersPercentile: evaluation.result.developingOthersPercentile,
            conflictManagementPercentile: evaluation.result.conflictManagementPercentile,
            decisionMakingPercentile: evaluation.result.decisionMakingPercentile,
            strategicThinkingPercentile: evaluation.result.strategicThinkingPercentile,
            relationshipBuildingPercentile: evaluation.result.relationshipBuildingPercentile,
            businessAcumenPercentile: evaluation.result.businessAcumenPercentile,
            resultsOrientationPercentile: evaluation.result.resultsOrientationPercentile,
            resiliencePercentile: evaluation.result.resiliencePercentile,
            accountabilityPercentile: evaluation.result.accountabilityPercentile,
          };
          existing.dnaDate = (evaluation.completedAt || evaluation.createdAt).toISOString();
        }
        
        // Actualizar nombre si es más reciente
        if (evaluation.recipientName && evaluation.recipientName.length > existing.name.length) {
          existing.name = evaluation.recipientName;
        }
        
        peopleMap.set(key, existing);
      }
    }

  // Procesar evaluaciones Acumen externas
  for (const evaluation of acumenEvaluations) {
      if (evaluation.result) {
        const key = evaluation.recipientEmail.toLowerCase();
        const existing = peopleMap.get(key) || {
          email: evaluation.recipientEmail,
          name: evaluation.recipientName,
          disc: null,
          drivingForces: null,
          eq: null,
          dna: null,
          acumen: null,
          values: null,
          stress: null,
        technical: null,
          discDate: null,
          dfDate: null,
          eqDate: null,
          dnaDate: null,
          acumenDate: null,
          valuesDate: null,
          stressDate: null,
        technicalDate: null,
        };
        
        // Solo guardar la más reciente
        if (!existing.acumenDate || new Date(evaluation.completedAt || evaluation.createdAt) > new Date(existing.acumenDate)) {
          existing.acumen = {
            id: evaluation.id,
            totalAcumenScore: evaluation.result.totalAcumenScore,
            acumenLevel: evaluation.result.acumenLevel,
            acumenProfile: evaluation.result.acumenProfile,
            externalClarityScore: evaluation.result.externalClarityScore,
            internalClarityScore: evaluation.result.internalClarityScore,
            understandingOthersClarity: evaluation.result.understandingOthersClarity,
            practicalThinkingClarity: evaluation.result.practicalThinkingClarity,
            systemsJudgmentClarity: evaluation.result.systemsJudgmentClarity,
            senseOfSelfClarity: evaluation.result.senseOfSelfClarity,
            roleAwarenessClarity: evaluation.result.roleAwarenessClarity,
            selfDirectionClarity: evaluation.result.selfDirectionClarity,
            understandingOthersBias: evaluation.result.understandingOthersBias,
            practicalThinkingBias: evaluation.result.practicalThinkingBias,
            systemsJudgmentBias: evaluation.result.systemsJudgmentBias,
            senseOfSelfBias: evaluation.result.senseOfSelfBias,
            roleAwarenessBias: evaluation.result.roleAwarenessBias,
            selfDirectionBias: evaluation.result.selfDirectionBias,
            primaryStrengths: evaluation.result.primaryStrengths,
            developmentAreas: evaluation.result.developmentAreas,
          };
          existing.acumenDate = (evaluation.completedAt || evaluation.createdAt).toISOString();
        }
        
        // Actualizar nombre si es más reciente
        if (evaluation.recipientName && evaluation.recipientName.length > existing.name.length) {
          existing.name = evaluation.recipientName;
        }
        
        peopleMap.set(key, existing);
      }
    }

  // Procesar evaluaciones Values externas
  
  for (const evaluation of valuesEvaluations) {
      if (evaluation.result) {
        const key = evaluation.recipientEmail.toLowerCase();
        const existing = peopleMap.get(key) || {
          email: evaluation.recipientEmail,
          name: evaluation.recipientName,
          disc: null,
          drivingForces: null,
          eq: null,
          dna: null,
          acumen: null,
          values: null,
          stress: null,
        technical: null,
          discDate: null,
          dfDate: null,
          eqDate: null,
          dnaDate: null,
          acumenDate: null,
          valuesDate: null,
          stressDate: null,
        technicalDate: null,
        };
        
        // Solo guardar la más reciente
        if (!existing.valuesDate || new Date(evaluation.completedAt || evaluation.createdAt) > new Date(existing.valuesDate)) {
          existing.values = {
            id: evaluation.id,
            integrityScore: evaluation.result.integrityScore,
            consistencyScore: evaluation.result.consistencyScore,
            authenticityScore: evaluation.result.authenticityScore,
            teoricoPercentile: evaluation.result.teoricoScore,
            utilitarioPercentile: evaluation.result.utilitarioScore,
            esteticoPercentile: evaluation.result.esteticoScore,
            socialPercentile: evaluation.result.socialScore,
            individualistaPercentile: evaluation.result.individualistaScore,
            tradicionalPercentile: evaluation.result.tradicionalScore,
            primaryValues: evaluation.result.primaryValues,
            situationalValues: evaluation.result.situationalValues,
            indifferentValues: evaluation.result.indifferentValues,
            valuesProfile: evaluation.result.valuesProfile,
            primaryStrengths: evaluation.result.primaryStrengths,
            developmentAreas: evaluation.result.developmentAreas,
          };
          existing.valuesDate = (evaluation.completedAt || evaluation.createdAt).toISOString();
        }
        
        // Actualizar nombre si es más reciente
        if (evaluation.recipientName && evaluation.recipientName.length > existing.name.length) {
          existing.name = evaluation.recipientName;
        }
        
        peopleMap.set(key, existing);
      }
    }

  // Procesar evaluaciones Stress externas
  
  for (const evaluation of stressEvaluations) {
      if (evaluation.result) {
        const key = evaluation.recipientEmail.toLowerCase();
        const existing = peopleMap.get(key) || {
          email: evaluation.recipientEmail,
          name: evaluation.recipientName,
          disc: null,
          drivingForces: null,
          eq: null,
          dna: null,
          acumen: null,
          values: null,
          stress: null,
        technical: null,
          discDate: null,
          dfDate: null,
          eqDate: null,
          dnaDate: null,
          acumenDate: null,
          valuesDate: null,
          stressDate: null,
        technicalDate: null,
        };
        
        // Solo guardar la más reciente
        if (!existing.stressDate || new Date(evaluation.completedAt || evaluation.createdAt) > new Date(existing.stressDate)) {
          existing.stress = {
            id: evaluation.id,
            estresLaboralScore: evaluation.result.estresLaboralScore,
            capacidadRecuperacionScore: evaluation.result.capacidadRecuperacionScore,
            manejoEmocionalScore: evaluation.result.manejoEmocionalScore,
            equilibrioVidaScore: evaluation.result.equilibrioVidaScore,
            resilienciaScore: evaluation.result.resilienciaScore,
            nivelEstresGeneral: evaluation.result.nivelEstresGeneral,
            indiceResiliencia: evaluation.result.indiceResiliencia,
            capacidadAdaptacion: evaluation.result.capacidadAdaptacion,
            stressLevel: evaluation.result.stressLevel,
            resilienceLevel: evaluation.result.resilienceLevel,
            stressProfile: evaluation.result.stressProfile,
            riskFactors: evaluation.result.riskFactors,
            protectiveFactors: evaluation.result.protectiveFactors,
            primaryStrengths: evaluation.result.primaryStrengths,
            developmentAreas: evaluation.result.developmentAreas,
          };
          existing.stressDate = (evaluation.completedAt || evaluation.createdAt).toISOString();
        }
        
        // Actualizar nombre si es más reciente
        if (evaluation.recipientName && evaluation.recipientName.length > existing.name.length) {
          existing.name = evaluation.recipientName;
        }
        
        peopleMap.set(key, existing);
      }
    }

  // Procesar evaluaciones Técnicas externas
  for (const evaluation of technicalEvaluations) {
      if (evaluation.result) {
        const key = evaluation.recipientEmail.toLowerCase();
        const existing = peopleMap.get(key) || {
          email: evaluation.recipientEmail,
          name: evaluation.recipientName,
          disc: null,
          drivingForces: null,
          eq: null,
          dna: null,
          acumen: null,
          values: null,
          stress: null,
          technical: null,
          discDate: null,
          dfDate: null,
          eqDate: null,
          dnaDate: null,
          acumenDate: null,
          valuesDate: null,
          stressDate: null,
          technicalDate: null,
        };
        
        // Solo guardar la más reciente
        if (!existing.technicalDate || new Date(evaluation.completedAt || evaluation.createdAt) > new Date(existing.technicalDate)) {
          const easyT = evaluation.result.easyTotal || 0;
          const easyC = evaluation.result.easyCorrect || 0;
          const medT = evaluation.result.mediumTotal || 0;
          const medC = evaluation.result.mediumCorrect || 0;
          const hardT = evaluation.result.hardTotal || 0;
          const hardC = evaluation.result.hardCorrect || 0;
          existing.technical = {
            id: evaluation.id,
            jobPositionId: evaluation.jobPositionId,
            totalScore: evaluation.result.totalScore,
            correctAnswers: evaluation.result.correctAnswers,
            totalQuestions: evaluation.result.totalQuestions,
            performanceLevel: evaluation.result.performanceLevel,
            easyScore: easyT > 0 ? (easyC / easyT) * 100 : 0,
            easyCorrect: easyC,
            easyTotal: easyT,
            mediumScore: medT > 0 ? (medC / medT) * 100 : 0,
            mediumCorrect: medC,
            mediumTotal: medT,
            hardScore: hardT > 0 ? (hardC / hardT) * 100 : 0,
            hardCorrect: hardC,
            hardTotal: hardT,
            categoryScores: evaluation.result.categoryScores as Record<string, number> | undefined,
            strengths: evaluation.result.strengths,
            weaknesses: evaluation.result.weaknesses,
            averageResponseTime: evaluation.result.averageTimePerQuestion || undefined,
            totalTime: undefined,
          };
          existing.technicalDate = (evaluation.completedAt || evaluation.createdAt).toISOString();
        }
        
        // Actualizar nombre si es más reciente
        if (evaluation.recipientName && evaluation.recipientName.length > existing.name.length) {
          existing.name = evaluation.recipientName;
        }
        
        peopleMap.set(key, existing);
      }
    }

  // Convertir mapa a array
  const people = Array.from(peopleMap.values()).map((person, index) => ({
    id: `person-${index}`,
    ...person,
    hasComplete: person.disc !== null && person.drivingForces !== null,
    hasFullProfile: person.disc !== null && person.drivingForces !== null && person.eq !== null && person.dna !== null,
    hasRecluComplete: person.disc !== null && person.drivingForces !== null && person.eq !== null && person.dna !== null && person.acumen !== null && person.values !== null,
    hasFullReclu: person.disc !== null && person.drivingForces !== null && person.eq !== null && person.dna !== null && person.acumen !== null && person.values !== null && person.stress !== null,
    hasTechnical: person.technical !== null,
  }));

  // Ordenar por nombre
  people.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 min-h-screen">
      <AnalyticsClient people={people} />
    </div>
  );
}
