import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - Get single question
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const question = await prisma.technicalQuestion.findUnique({
      where: { id: params.id },
    });

    if (!question) {
      return NextResponse.json({ error: 'Pregunta no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Update question
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const question = await prisma.technicalQuestion.update({
      where: { id: params.id },
      data: {
        ...(questionText && { questionText }),
        ...(questionTextEn && { questionTextEn }),
        ...(optionA && { optionA }),
        ...(optionB && { optionB }),
        ...(optionC && { optionC }),
        ...(optionD && { optionD }),
        ...(optionAEn && { optionAEn }),
        ...(optionBEn && { optionBEn }),
        ...(optionCEn && { optionCEn }),
        ...(optionDEn && { optionDEn }),
        ...(correctAnswer && { correctAnswer }),
        ...(difficulty && { difficulty }),
        ...(category && { category }),
        ...(categoryEn && { categoryEn }),
        ...(weight !== undefined && { weight }),
      },
    });

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if question has responses
    const responsesCount = await prisma.externalTechnicalResponse.count({
      where: { questionId: params.id },
    });

    if (responsesCount > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una pregunta que ya tiene respuestas' },
        { status: 400 }
      );
    }

    await prisma.technicalQuestion.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
