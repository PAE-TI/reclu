import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

type QuestionSetConfig = {
  questionIds: string[];
  basePositionId: string;
  sourcePositionId?: string;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const templates = await prisma.technicalQuestionTemplate.findMany({
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      include: {
        ownerUser: {
          select: {
            name: true,
            company: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      templates: templates.map(template => ({
        ...template,
        questionCount: (template.questionSetConfig as QuestionSetConfig)?.questionIds?.length || 0,
      })),
    });
  } catch (error) {
    console.error('Error fetching admin technical templates:', error);
    return NextResponse.json({ error: 'Error al obtener plantillas técnicas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name, description, basePositionId, basePositionTitle, questionSetConfig } = body as {
      name?: string;
      description?: string;
      basePositionId?: string;
      basePositionTitle?: string;
      questionSetConfig?: QuestionSetConfig;
    };

    if (!name?.trim()) {
      return NextResponse.json({ error: 'El nombre de la plantilla es requerido' }, { status: 400 });
    }

    if (!basePositionId) {
      return NextResponse.json({ error: 'El cargo base es requerido' }, { status: 400 });
    }

    if (!questionSetConfig || !Array.isArray(questionSetConfig.questionIds) || questionSetConfig.questionIds.length !== 20) {
      return NextResponse.json({ error: 'La plantilla debe contener exactamente 20 preguntas' }, { status: 400 });
    }

    const template = await prisma.technicalQuestionTemplate.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        ownerUserId: user.id,
        basePositionId,
        basePositionTitle: basePositionTitle || basePositionId,
        questionSetConfig,
      },
    });

    return NextResponse.json({
      template: {
        ...template,
        questionCount: questionSetConfig.questionIds.length,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin technical template:', error);
    return NextResponse.json({ error: 'Error al guardar la plantilla técnica' }, { status: 500 });
  }
}
