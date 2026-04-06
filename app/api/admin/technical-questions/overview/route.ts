import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { JOB_POSITIONS } from '@/lib/job-positions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const [totalQuestions, activeQuestions, templatesCount, difficultyStats, positionStats, categoryStats] = await Promise.all([
      prisma.technicalQuestion.count(),
      prisma.technicalQuestion.count({ where: { isActive: true } }),
      prisma.technicalQuestionTemplate.count(),
      prisma.technicalQuestion.groupBy({
        by: ['difficulty'],
        _count: { id: true },
      }),
      prisma.technicalQuestion.groupBy({
        by: ['jobPositionId'],
        _count: { id: true },
      }),
      prisma.technicalQuestion.groupBy({
        by: ['category'],
        _count: { id: true },
      }),
    ]);

    const difficultyMap: Record<string, number> = {};
    difficultyStats.forEach(item => {
      difficultyMap[item.difficulty] = item._count.id;
    });

    const positionMap = positionStats.reduce((acc, item) => {
      acc[item.jobPositionId] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    const topPositions = JOB_POSITIONS
      .map(position => ({
        id: position.id,
        title: position.title,
        titleEn: position.titleEn || position.title,
        category: position.category,
        questionCount: positionMap[position.id] || 0,
      }))
      .filter(item => item.questionCount > 0)
      .sort((a, b) => b.questionCount - a.questionCount)
      .slice(0, 6);

    const topCategories = categoryStats
      .filter(item => item.category)
      .map(item => ({
        name: item.category as string,
        count: item._count.id,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const coveredPositions = JOB_POSITIONS.filter(position => positionMap[position.id]).length;

    return NextResponse.json({
      overview: {
        totalQuestions,
        activeQuestions,
        inactiveQuestions: totalQuestions - activeQuestions,
        templatesCount,
        coveredPositions,
        totalPositions: JOB_POSITIONS.length,
        difficulty: {
          easy: difficultyMap.EASY || 0,
          medium: difficultyMap.MEDIUM || 0,
          hard: difficultyMap.HARD || 0,
        },
        topPositions,
        topCategories,
      },
    });
  } catch (error) {
    console.error('Error fetching technical questions overview:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
