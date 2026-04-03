import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { JOB_POSITIONS } from '@/lib/job-positions';

// GET - Get all job positions with question counts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Get question counts by position
    const questionCounts = await prisma.technicalQuestion.groupBy({
      by: ['jobPositionId'],
      _count: { _all: true },
    });

    const countMap = questionCounts.reduce((acc, item) => {
      acc[item.jobPositionId] = item._count._all;
      return acc;
    }, {} as Record<string, number>);

    // Map positions with their question counts
    const positions = JOB_POSITIONS.map(pos => ({
      id: pos.id,
      title: pos.title,
      titleEn: pos.titleEn || pos.title,
      category: pos.category,
      questionCount: countMap[pos.id] || 0,
    }));

    // Sort by category then by title
    positions.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.title.localeCompare(b.title);
    });

    const totalQuestions = await prisma.technicalQuestion.count();
    const positionsWithQuestions = positions.filter(p => p.questionCount > 0).length;

    return NextResponse.json({
      positions,
      stats: {
        totalPositions: positions.length,
        positionsWithQuestions,
        totalQuestions,
      }
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
