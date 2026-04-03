
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { calculateDiscScores, getPersonalityInterpretation } from '@/lib/disc-calculator';

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const evaluationId = params.id;
    const body = await request.json();
    const { responses } = body;

    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Respuestas inválidas' },
        { status: 400 }
      );
    }

    // Verificar que la evaluación pertenece al usuario
    const evaluation = await prisma.discEvaluation.findFirst({
      where: { 
        id: evaluationId, 
        userId: session.user.id 
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    // Limpiar respuestas existentes si las hay
    await prisma.discResponse.deleteMany({
      where: { evaluationId, userId: session.user.id },
    });

    // Limpiar resultados existentes si los hay
    await prisma.discResult.deleteMany({
      where: { evaluationId, userId: session.user.id },
    });

    // Crear nuevas respuestas
    const responsePromises = responses.map((response: any) =>
      prisma.discResponse.create({
        data: {
          userId: session.user.id,
          evaluationId,
          questionId: response.questionId,
          questionNumber: response.questionNumber,
          selectedOption: response.selectedOption,
          responseTime: response.responseTime || null,
        },
      })
    );

    await Promise.all(responsePromises);

    // Calcular puntuaciones DISC
    const discResult = calculateDiscScores(responses);
    
    // Obtener interpretación
    const interpretation = getPersonalityInterpretation(discResult.personalityType);

    // Crear resultado en la base de datos
    const result = await prisma.discResult.create({
      data: {
        userId: session.user.id,
        evaluationId,
        scoreD: discResult.scoreD,
        scoreI: discResult.scoreI,
        scoreS: discResult.scoreS,
        scoreC: discResult.scoreC,
        percentileD: discResult.percentileD,
        percentileI: discResult.percentileI,
        percentileS: discResult.percentileS,
        percentileC: discResult.percentileC,
        primaryStyle: discResult.primaryStyle,
        secondaryStyle: discResult.secondaryStyle,
        personalityType: discResult.personalityType,
        styleIntensity: discResult.styleIntensity,
        isOvershift: discResult.isOvershift,
        isUndershift: discResult.isUndershift,
        isTightPattern: discResult.isTightPattern,
      },
    });

    // Crear interpretación en la base de datos
    await prisma.discInterpretation.create({
      data: {
        resultId: result.id,
        personalityType: discResult.personalityType,
        title: interpretation.title,
        description: interpretation.description,
        strengths: interpretation.strengths,
        challenges: interpretation.challenges,
        motivators: interpretation.motivators,
        stressors: interpretation.stressors,
        workStyle: interpretation.description, // Simplificado por ahora
        communicationStyle: interpretation.description, // Simplificado por ahora
        developmentTips: interpretation.challenges.map(c => `Trabajar en: ${c}`),
        careerSuggestions: ["Basado en tu perfil, considera roles que aprovechen tus fortalezas"],
      },
    });

    // Actualizar estado de la evaluación
    await prisma.discEvaluation.update({
      where: { id: evaluationId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Respuestas procesadas exitosamente',
      result: {
        ...discResult,
        interpretation,
      },
      evaluationId,
      resultId: result.id,
    });

  } catch (error) {
    console.error('Error processing responses:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
