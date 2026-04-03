import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { JOB_POSITIONS } from '@/lib/job-positions';
import { getQuestionsForPosition, TechnicalQuestionTemplate } from '@/lib/technical-questions';

// POST - Seed technical questions for all positions or specific position
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Solo administradores pueden ejecutar este endpoint' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { positionId, force = false } = body;

    let positionsToSeed = positionId
      ? JOB_POSITIONS.filter(p => p.id === positionId)
      : JOB_POSITIONS;

    const results: { positionId: string; created: number; skipped: boolean }[] = [];

    for (const position of positionsToSeed) {
      // Check if questions already exist for this position
      const existingCount = await prisma.technicalQuestion.count({
        where: { jobPositionId: position.id },
      });

      if (existingCount > 0 && !force) {
        results.push({ positionId: position.id, created: 0, skipped: true });
        continue;
      }

      // If forcing, delete existing questions first
      if (force && existingCount > 0) {
        await prisma.technicalQuestion.deleteMany({
          where: { jobPositionId: position.id },
        });
      }

      // Get questions for this position
      const questions = getQuestionsForPosition(position.id);

      // Create questions
      const createdQuestions = await prisma.technicalQuestion.createMany({
        data: questions.map((q, index) => ({
          jobPositionId: position.id,
          questionNumber: index + 1,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          difficulty: q.difficulty,
          category: q.category,
          weight: 1.0,
          isActive: true,
        })),
      });

      results.push({ positionId: position.id, created: createdQuestions.count, skipped: false });
    }

    const totalCreated = results.reduce((acc, r) => acc + r.created, 0);
    const totalSkipped = results.filter(r => r.skipped).length;

    return NextResponse.json({
      success: true,
      message: `Se crearon ${totalCreated} preguntas para ${results.length - totalSkipped} cargos. ${totalSkipped} cargos omitidos (ya tenían preguntas).`,
      details: results,
    });
  } catch (error) {
    console.error('Error seeding technical questions:', error);
    return NextResponse.json(
      { error: 'Error al crear preguntas técnicas' },
      { status: 500 }
    );
  }
}

// GET - Check status of technical questions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get count of questions per position
    const questionCounts = await prisma.technicalQuestion.groupBy({
      by: ['jobPositionId'],
      _count: { id: true },
    });

    const countMap = new Map(questionCounts.map(q => [q.jobPositionId, q._count.id]));

    const positionsWithCounts = JOB_POSITIONS.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      questionCount: countMap.get(p.id) || 0,
    }));

    const totalPositions = JOB_POSITIONS.length;
    const positionsWithQuestions = questionCounts.length;
    const totalQuestions = questionCounts.reduce((acc, q) => acc + q._count.id, 0);

    return NextResponse.json({
      summary: {
        totalPositions,
        positionsWithQuestions,
        positionsWithoutQuestions: totalPositions - positionsWithQuestions,
        totalQuestions,
      },
      positions: positionsWithCounts,
    });
  } catch (error) {
    console.error('Error checking technical questions:', error);
    return NextResponse.json(
      { error: 'Error al verificar preguntas' },
      { status: 500 }
    );
  }
}
