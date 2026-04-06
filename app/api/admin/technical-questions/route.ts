import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getJobPositionById } from '@/lib/job-positions';

// GET - List all technical questions with filters
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

    const { searchParams } = new URL(request.url);
    const jobPosition = searchParams.get('jobPosition');
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));

    const where: any = {};

    if (jobPosition) {
      where.jobPositionId = jobPosition;
    }

    if (difficulty && ['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
      where.difficulty = difficulty;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { questionText: { contains: search, mode: 'insensitive' } },
        { questionTextEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [questions, total] = await Promise.all([
      prisma.technicalQuestion.findMany({
        where,
        orderBy: [{ jobPositionId: 'asc' }, { questionNumber: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.technicalQuestion.count({ where }),
    ]);

    // Get stats
    const stats = await prisma.technicalQuestion.groupBy({
      by: ['difficulty'],
      _count: { id: true },
    });

    const positionStats = await prisma.technicalQuestion.groupBy({
      by: ['jobPositionId'],
      _count: { id: true },
    });

    const categoryStats = await prisma.technicalQuestion.groupBy({
      by: ['category'],
      _count: { id: true },
    });

    // Transform questions to include jobPosition for backward compatibility
    const transformedQuestions = questions.map(q => ({
      ...q,
      jobPosition: q.jobPositionId,
    }));

    // Build stats objects safely
    const difficultyStats: Record<string, number> = {};
    stats.forEach(s => {
      difficultyStats[s.difficulty] = s._count.id;
    });

    const catStats: Record<string, number> = {};
    categoryStats.forEach(s => {
      if (s.category) {
        catStats[s.category] = s._count.id;
      }
    });

    return NextResponse.json({
      questions: transformedQuestions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        byDifficulty: difficultyStats,
        byPosition: positionStats.length,
        byCategory: catStats,
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Create new question
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      jobPosition,
      questionText,
      questionTextEn,
      optionA,
      optionB,
      optionC,
      optionD,
      optionAEn,
      optionBEn,
      optionCEn,
      optionDEn,
      correctAnswer,
      difficulty,
      category,
      categoryEn,
      weight,
    } = body;

    // Validate required fields
    if (!jobPosition || !questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer || !difficulty || !category) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    if (!getJobPositionById(jobPosition)) {
      return NextResponse.json({ error: 'Cargo inválido' }, { status: 400 });
    }

    if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
      return NextResponse.json({ error: 'Respuesta correcta inválida' }, { status: 400 });
    }

    if (!['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
      return NextResponse.json({ error: 'Dificultad inválida' }, { status: 400 });
    }

    // Get next question number for this position
    const lastQuestion = await prisma.technicalQuestion.findFirst({
      where: { jobPositionId: jobPosition },
      orderBy: { questionNumber: 'desc' },
    });

    const questionNumber = (lastQuestion?.questionNumber || 0) + 1;

    const question = await prisma.technicalQuestion.create({
      data: {
        jobPositionId: jobPosition,
        questionNumber,
        questionText,
        questionTextEn: questionTextEn || questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        optionAEn: optionAEn || optionA,
        optionBEn: optionBEn || optionB,
        optionCEn: optionCEn || optionC,
        optionDEn: optionDEn || optionD,
        correctAnswer,
        difficulty,
        category,
        categoryEn: categoryEn || category,
        weight: weight || 1.0,
      },
    });

    return NextResponse.json({ question: { ...question, jobPosition: question.jobPositionId } }, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
