
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { TokenUtils } from '@/lib/token-utils';
import { createEvaluationCompletedNotification } from '@/lib/notifications';
import { updateCampaignCandidateOnCompletion } from '@/lib/campaign-utils';

// Interface para respuestas externas
interface ExternalResponse {
  questionId: string;
  mostValue: number;
  leastValue: number;
}

// Interface para resultados DISC
interface ExternalDiscResult {
  personalityType: string;
  primaryStyle: string;
  secondaryStyle: string | null;
  styleIntensity: number;
  percentileD: number;
  percentileI: number;
  percentileS: number;
  percentileC: number;
  isOvershift: boolean;
  isUndershift: boolean;
  isTightPattern: boolean;
}

// Función para calcular resultados DISC de evaluaciones externas
function calculateExternalDiscResults(responses: ExternalResponse[]): ExternalDiscResult {
  // Inicializar contadores
  let scoreD = 0;
  let scoreI = 0;
  let scoreS = 0;
  let scoreC = 0;

  // Procesar cada respuesta
  responses.forEach(response => {
    // Mapear valores numéricos a dimensiones DISC
    // 1=A=D, 2=B=I, 3=C=S, 4=D=C
    const dimensionMap = ['', 'D', 'I', 'S', 'C']; // El índice 0 está vacío para mapear 1-4 a posiciones 1-4
    
    // Sumar puntos por respuesta "más parecido"
    const mostDimension = dimensionMap[response.mostValue];
    if (mostDimension) {
      switch (mostDimension) {
        case 'D': scoreD += 1; break;
        case 'I': scoreI += 1; break;
        case 'S': scoreS += 1; break;
        case 'C': scoreC += 1; break;
      }
    }

    // Restar puntos por respuesta "menos parecido" (opcional, según metodología)
    // En este caso, no restamos para mantener puntuaciones positivas
  });

  // Calcular percentiles (basado en 24 preguntas máximo)
  const totalQuestions = responses.length;
  const percentileD = (scoreD / totalQuestions) * 100;
  const percentileI = (scoreI / totalQuestions) * 100;
  const percentileS = (scoreS / totalQuestions) * 100;
  const percentileC = (scoreC / totalQuestions) * 100;

  // Determinar estilo primario (mayor puntuación)
  const scores = [
    { dimension: 'D', score: percentileD },
    { dimension: 'I', score: percentileI },
    { dimension: 'S', score: percentileS },
    { dimension: 'C', score: percentileC }
  ];

  scores.sort((a, b) => b.score - a.score);
  
  const primaryStyle = scores[0].dimension;
  const secondaryStyle = scores[1].score > 20 ? scores[1].dimension : null; // Solo si es significativo

  // Calcular intensidad del estilo (diferencia entre primario y promedio)
  const averageScore = (percentileD + percentileI + percentileS + percentileC) / 4;
  const styleIntensity = Math.max(0, scores[0].score - averageScore);

  // Determinar tipo de personalidad
  let personalityType = primaryStyle;
  if (secondaryStyle) {
    personalityType = primaryStyle + secondaryStyle;
  }

  // Detectar patrones especiales (simplificado)
  const maxScore = scores[0].score;
  const minScore = scores[3].score;
  const scoreDifference = maxScore - minScore;

  const isOvershift = maxScore > 80;
  const isUndershift = maxScore < 30;
  const isTightPattern = scoreDifference < 20;

  return {
    personalityType,
    primaryStyle,
    secondaryStyle,
    styleIntensity,
    percentileD,
    percentileI,
    percentileS,
    percentileC,
    isOvershift,
    isUndershift,
    isTightPattern
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const body = await request.json();
    const { responses } = body;

    // Validar estructura de respuestas
    if (!Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { error: 'Se requieren respuestas válidas' },
        { status: 400 }
      );
    }

    // Buscar evaluación por token
    const evaluation = await prisma.externalEvaluation.findUnique({
      where: { token }
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    // Verificar si el token ha expirado
    if (TokenUtils.isTokenExpired(evaluation.tokenExpiry)) {
      return NextResponse.json(
        { error: 'El enlace ha expirado' },
        { status: 410 }
      );
    }

    // Verificar si ya fue completada
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
        { status: 409 }
      );
    }

    // Validar que todas las respuestas tengan el formato correcto
    for (const response of responses) {
      if (!response.questionId || 
          typeof response.mostValue !== 'number' || 
          typeof response.leastValue !== 'number') {
        return NextResponse.json(
          { error: 'Formato de respuestas inválido' },
          { status: 400 }
        );
      }
    }

    // Usar transacción para guardar respuestas y calcular resultados
    const result = await prisma.$transaction(async (tx) => {
      // Eliminar respuestas existentes si las hay
      await tx.externalEvaluationResponse.deleteMany({
        where: { externalEvaluationId: evaluation.id }
      });

      // Guardar nuevas respuestas
      await tx.externalEvaluationResponse.createMany({
        data: responses.map(response => ({
          externalEvaluationId: evaluation.id,
          questionId: response.questionId,
          mostValue: response.mostValue,
          leastValue: response.leastValue
        }))
      });

      // Calcular resultados DISC para evaluaciones externas
      const discResults = calculateExternalDiscResults(responses);

      // Eliminar resultado existente si existe
      await tx.externalEvaluationResult.deleteMany({
        where: { externalEvaluationId: evaluation.id }
      });

      // Guardar resultado calculado
      const savedResult = await tx.externalEvaluationResult.create({
        data: {
          externalEvaluationId: evaluation.id,
          personalityType: discResults.personalityType,
          primaryStyle: discResults.primaryStyle,
          secondaryStyle: discResults.secondaryStyle,
          styleIntensity: discResults.styleIntensity,
          percentileD: discResults.percentileD,
          percentileI: discResults.percentileI,
          percentileS: discResults.percentileS,
          percentileC: discResults.percentileC,
          isOvershift: discResults.isOvershift,
          isUndershift: discResults.isUndershift,
          isTightPattern: discResults.isTightPattern
        }
      });

      // Actualizar status de la evaluación
      await tx.externalEvaluation.update({
        where: { id: evaluation.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      });

      return savedResult;
    });

    // Create notification for the sender
    try {
      await createEvaluationCompletedNotification(
        evaluation.senderUserId,
        'DISC',
        evaluation.recipientName,
        evaluation.recipientEmail,
        token
      );
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    // Update campaign candidate if this evaluation belongs to a campaign
    try {
      await updateCampaignCandidateOnCompletion(token, 'DISC');
    } catch (campaignError) {
      console.error('Error updating campaign candidate:', campaignError);
    }

    return NextResponse.json({
      success: true,
      message: 'Evaluación completada exitosamente',
      evaluationId: evaluation.id,
      resultId: result.id
    });

  } catch (error) {
    console.error('Error processing external evaluation responses:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
