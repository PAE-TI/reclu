import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { JOB_POSITIONS } from '@/lib/job-positions';

const DEFAULT_LIMIT = 120;
const MAX_LIMIT = 250;

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const positionId = searchParams.get('positionId') || '';
    const positionIds = (searchParams.get('positionIds') || '')
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    const questionIds = (searchParams.get('questionIds') || '')
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    const difficulty = searchParams.get('difficulty') || '';
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT, MAX_LIMIT);

    const where: Record<string, unknown> = { isActive: true };

    if (questionIds.length > 0) {
      where.id = { in: questionIds };
    } else if (positionIds.length > 0) {
      where.jobPositionId = { in: positionIds };
    } else if (positionId && positionId !== 'all') {
      where.jobPositionId = positionId;
    }

    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty;
    }

    if (category && category !== 'all') {
      where.category = {
        contains: category,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { questionText: { contains: search, mode: 'insensitive' } },
        { questionTextEn: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { categoryEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [questions, total] = await Promise.all([
      prisma.technicalQuestion.findMany({
        where: where as any,
        orderBy: [{ jobPositionId: 'asc' }, { questionNumber: 'asc' }],
        take: limit,
        select: {
          id: true,
          jobPositionId: true,
          questionNumber: true,
          questionText: true,
          questionTextEn: true,
          category: true,
          categoryEn: true,
          difficulty: true,
        },
      }),
      prisma.technicalQuestion.count({ where: where as any }),
    ]);

    const positionsMap = new Map(JOB_POSITIONS.map(position => [position.id, position]));

    const payload = questions.map(question => {
      const position = positionsMap.get(question.jobPositionId);
      return {
        ...question,
        jobPositionTitle: position?.title || question.jobPositionId,
        jobPositionCategory: position?.category || null,
      };
    });

    const counts = await prisma.technicalQuestion.groupBy({
      by: ['jobPositionId', 'difficulty'],
      _count: { id: true },
      where: { isActive: true } as any,
    });

    const categoryCounts = await prisma.technicalQuestion.groupBy({
      by: ['category'],
      _count: { id: true },
      where: { isActive: true } as any,
    });

    return NextResponse.json({
      questions: payload,
      total,
      limit,
      counts,
      categories: categoryCounts
        .filter(item => item.category)
        .map(item => ({
          name: item.category as string,
          count: item._count.id,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    });
  } catch (error) {
    console.error('Error fetching technical question bank:', error);
    return NextResponse.json({ error: 'Error al obtener el banco de preguntas' }, { status: 500 });
  }
}
