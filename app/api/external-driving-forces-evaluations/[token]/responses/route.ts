
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createEvaluationCompletedNotification } from '@/lib/notifications';
import { updateCampaignCandidateOnCompletion } from '@/lib/campaign-utils';

interface Context {
  params: { token: string };
}

interface DrivingForceScores {
  [key: string]: number;
}

// POST - Guardar respuesta a pregunta de evaluación externa
export async function POST(req: NextRequest, { params }: Context) {
  try {
    const data = await req.json();

    // Verificar que la evaluación existe y está válida
    const evaluation = await prisma.externalDrivingForcesEvaluation.findUnique({
      where: { token: params.token },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    if (new Date() > evaluation.tokenExpiry) {
      return NextResponse.json(
        { error: 'El enlace de evaluación ha expirado' },
        { status: 410 }
      );
    }

    if (evaluation.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Esta evaluación ya ha sido completada' },
        { status: 400 }
      );
    }

    // Validar que las rankings sumen 10 (1+2+3+4)
    const rankingSum = data.rankingA + data.rankingB + data.rankingC + data.rankingD;
    if (rankingSum !== 10) {
      return NextResponse.json(
        { error: 'Los rankings deben ser únicos del 1 al 4' },
        { status: 400 }
      );
    }

    // Verificar que todos los rankings sean únicos y estén entre 1-4
    const rankings = [data.rankingA, data.rankingB, data.rankingC, data.rankingD];
    const uniqueRankings = new Set(rankings);
    if (uniqueRankings.size !== 4 || Math.min(...rankings) < 1 || Math.max(...rankings) > 4) {
      return NextResponse.json(
        { error: 'Los rankings deben ser únicos del 1 al 4' },
        { status: 400 }
      );
    }

    const response = await prisma.externalDrivingForcesResponse.upsert({
      where: {
        externalEvaluationId_questionId: {
          externalEvaluationId: evaluation.id,
          questionId: data.questionId,
        },
      },
      update: {
        rankingA: data.rankingA,
        rankingB: data.rankingB,
        rankingC: data.rankingC,
        rankingD: data.rankingD,
      },
      create: {
        externalEvaluationId: evaluation.id,
        questionId: data.questionId,
        rankingA: data.rankingA,
        rankingB: data.rankingB,
        rankingC: data.rankingC,
        rankingD: data.rankingD,
      },
    });

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error('Error al guardar respuesta:', error);
    return NextResponse.json(
      { error: 'Error al guardar respuesta' },
      { status: 500 }
    );
  }
}

// PUT - Completar evaluación externa
export async function PUT(req: NextRequest, { params }: Context) {
  try {
    // Verificar que la evaluación existe
    const evaluation = await prisma.externalDrivingForcesEvaluation.findUnique({
      where: { token: params.token },
      include: {
        responses: {
          include: {
            question: true,
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

    const responses = evaluation.responses;

    if (responses.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron respuestas para calcular' },
        { status: 400 }
      );
    }

    // Inicializar scores y contadores para cada driving force
    const scores: DrivingForceScores = {
      INTELECTUAL: 0,
      INSTINTIVO: 0,
      PRACTICO: 0,
      ALTRUISTA: 0,
      ARMONIOSO: 0,
      OBJETIVO: 0,
      BENEVOLO: 0,
      INTENCIONAL: 0,
      DOMINANTE: 0,
      COLABORATIVO: 0,
      ESTRUCTURADO: 0,
      RECEPTIVO: 0,
    };

    // Contador de apariciones de cada fuerza
    const forceCounts: DrivingForceScores = {
      INTELECTUAL: 0,
      INSTINTIVO: 0,
      PRACTICO: 0,
      ALTRUISTA: 0,
      ARMONIOSO: 0,
      OBJETIVO: 0,
      BENEVOLO: 0,
      INTENCIONAL: 0,
      DOMINANTE: 0,
      COLABORATIVO: 0,
      ESTRUCTURADO: 0,
      RECEPTIVO: 0,
    };

    // Procesar cada respuesta - sumar rankings y contar apariciones
    responses.forEach(response => {
      const question = response.question;
      
      // Sumar los rankings (1=más como tú, 4=menos como tú)
      scores[question.forceA] += response.rankingA;
      scores[question.forceB] += response.rankingB;
      scores[question.forceC] += response.rankingC;
      scores[question.forceD] += response.rankingD;
      
      // Contar apariciones
      forceCounts[question.forceA]++;
      forceCounts[question.forceB]++;
      forceCounts[question.forceC]++;
      forceCounts[question.forceD]++;
    });

    // Calcular percentiles normalizados por fuerza
    // Sistema: ranking 1=más como tú (alta preferencia), 4=menos como tú (baja preferencia)
    // Por lo tanto: puntaje bajo = percentil alto
    const percentiles: DrivingForceScores = {};
    
    Object.entries(scores).forEach(([force, totalScore]) => {
      const count = forceCounts[force];
      
      if (count === 0) {
        // Si la fuerza no apareció en ninguna pregunta, usar 50%
        percentiles[force] = 50;
        return;
      }
      
      // Para cada fuerza:
      // - Puntaje mínimo posible = count * 1 (todos los 1s)
      // - Puntaje máximo posible = count * 4 (todos los 4s)
      const minPossible = count * 1;
      const maxPossible = count * 4;
      
      // Normalizar: puntaje bajo = percentil alto
      // Fórmula: ((maxPossible - score) / (maxPossible - minPossible)) * 100
      const rawPercentile = ((maxPossible - totalScore) / (maxPossible - minPossible)) * 100;
      
      // Clamp entre 0 y 100, redondear a 1 decimal
      percentiles[force] = Math.round(Math.max(0, Math.min(100, rawPercentile)) * 10) / 10;
    });

    // Ordenar por percentil (mayor = más importante para la persona)
    const sortedForces = Object.entries(percentiles)
      .sort(([, a], [, b]) => b - a)
      .map(([force]) => force);

    // Clasificar según TTI methodology
    const primaryMotivators = sortedForces.slice(0, 4);    // Top 4 - Motivadores principales
    const situationalMotivators = sortedForces.slice(4, 8); // Middle 4 - Situacionales
    const indifferentMotivators = sortedForces.slice(8, 12); // Bottom 4 - Indiferentes

    // Crear o actualizar resultado (upsert para evitar duplicados)
    const existingResult = await prisma.externalDrivingForcesResult.findUnique({
      where: { externalEvaluationId: evaluation.id },
    });

    let result;
    const resultData = {
      motivationalProfile: primaryMotivators.slice(0, 2).join('-'),
      primaryMotivators,
      situationalMotivators,
      indifferentMotivators,
      
      topMotivator: sortedForces[0],
      secondMotivator: sortedForces[1],
      thirdMotivator: sortedForces[2],
      fourthMotivator: sortedForces[3],
      
      // Percentiles
      intelectualPercentile: percentiles.INTELECTUAL,
      instintivoPercentile: percentiles.INSTINTIVO,
      practicoPercentile: percentiles.PRACTICO,
      altruistaPercentile: percentiles.ALTRUISTA,
      armoniosoPercentile: percentiles.ARMONIOSO,
      objetivoPercentile: percentiles.OBJETIVO,
      benevoloPercentile: percentiles.BENEVOLO,
      intencionalPercentile: percentiles.INTENCIONAL,
      dominantePercentile: percentiles.DOMINANTE,
      colaborativoPercentile: percentiles.COLABORATIVO,
      estructuradoPercentile: percentiles.ESTRUCTURADO,
      receptivoPercentile: percentiles.RECEPTIVO,
    };

    if (existingResult) {
      result = await prisma.externalDrivingForcesResult.update({
        where: { id: existingResult.id },
        data: resultData,
      });
    } else {
      result = await prisma.externalDrivingForcesResult.create({
        data: {
          externalEvaluationId: evaluation.id,
          ...resultData,
        },
      });
    }

    // Marcar evaluación como completada
    await prisma.externalDrivingForcesEvaluation.update({
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
        'DRIVING_FORCES',
        evaluation.recipientName,
        evaluation.recipientEmail,
        params.token
      );
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    // Update campaign candidate if this evaluation belongs to a campaign
    try {
      await updateCampaignCandidateOnCompletion(params.token, 'DRIVING_FORCES');
    } catch (campaignError) {
      console.error('Error updating campaign candidate:', campaignError);
    }

    return NextResponse.json({ 
      result, 
      message: 'Evaluación completada exitosamente' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error al completar evaluación:', error);
    return NextResponse.json(
      { error: 'Error al completar evaluación' },
      { status: 500 }
    );
  }
}
