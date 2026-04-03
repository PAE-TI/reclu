
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface DrivingForceScores {
  [key: string]: number;
}

// POST - Recalcular todos los resultados de Driving Forces
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener todos los resultados existentes que necesitan recalculo
    const existingResults = await prisma.drivingForcesResult.findMany({
      include: {
        evaluation: {
          include: {
            responses: {
              include: {
                question: true
              }
            }
          }
        }
      }
    });

    let recalculatedCount = 0;

    for (const result of existingResults) {
      const responses = result.evaluation.responses;

      if (responses.length === 0) continue;

      // Inicializar scores y contadores
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
        
        scores[question.forceA] += response.rankingA;
        scores[question.forceB] += response.rankingB;
        scores[question.forceC] += response.rankingC;
        scores[question.forceD] += response.rankingD;
        
        forceCounts[question.forceA]++;
        forceCounts[question.forceB]++;
        forceCounts[question.forceC]++;
        forceCounts[question.forceD]++;
      });

      // Recalcular percentiles normalizados por fuerza
      const percentiles: DrivingForceScores = {};
      Object.entries(scores).forEach(([force, totalScore]) => {
        const count = forceCounts[force];
        
        if (count === 0) {
          percentiles[force] = 50;
          return;
        }
        
        const minPossible = count * 1;
        const maxPossible = count * 4;
        const rawPercentile = ((maxPossible - totalScore) / (maxPossible - minPossible)) * 100;
        percentiles[force] = Math.round(Math.max(0, Math.min(100, rawPercentile)) * 10) / 10;
      });

      // Reordenar fuerzas por percentil
      const sortedForces = Object.entries(percentiles)
        .sort(([, a], [, b]) => b - a)
        .map(([force]) => force);

      const primaryMotivators = sortedForces.slice(0, 4);
      const situationalMotivators = sortedForces.slice(4, 8);
      const indifferentMotivators = sortedForces.slice(8, 12);

      // Actualizar resultado
      await prisma.drivingForcesResult.update({
        where: { id: result.id },
        data: {
          // Raw scores actualizados
          intelectualScore: scores.INTELECTUAL,
          instintivoScore: scores.INSTINTIVO,
          practicoScore: scores.PRACTICO,
          altruistaScore: scores.ALTRUISTA,
          armoniosoScore: scores.ARMONIOSO,
          objetivoScore: scores.OBJETIVO,
          benevoloScore: scores.BENEVOLO,
          intencionalScore: scores.INTENCIONAL,
          dominanteScore: scores.DOMINANTE,
          colaborativoScore: scores.COLABORATIVO,
          estructuradoScore: scores.ESTRUCTURADO,
          receptivoScore: scores.RECEPTIVO,
          
          // Percentiles corregidos
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
          
          // Clusters actualizados
          primaryMotivators,
          situationalMotivators,
          indifferentMotivators,
          
          // Top motivators actualizados
          topMotivator: sortedForces[0] as any,
          secondMotivator: sortedForces[1] as any,
          thirdMotivator: sortedForces[2] as any,
          fourthMotivator: sortedForces[3] as any,
        },
      });

      recalculatedCount++;
    }

    return NextResponse.json({ 
      message: `Se recalcularon ${recalculatedCount} resultados correctamente`,
      recalculatedCount 
    }, { status: 200 });

  } catch (error) {
    console.error('Error al recalcular resultados:', error);
    return NextResponse.json(
      { error: 'Error al recalcular resultados' },
      { status: 500 }
    );
  }
}
