import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { EvaluationType, TeamMember } from '@prisma/client';

// GET - Obtener notas de una evaluación específica
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const evaluationType = searchParams.get('evaluationType') as EvaluationType;
    const evaluationId = searchParams.get('evaluationId');
    const recipientEmail = searchParams.get('recipientEmail');

    if (!evaluationType || !evaluationId) {
      return NextResponse.json(
        { error: 'Tipo de evaluación e ID son requeridos' },
        { status: 400 }
      );
    }

    // Obtener información del usuario
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberOf: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Determinar qué notas puede ver el usuario
    // - Si es dueño o admin: puede ver todas las notas de las evaluaciones de su empresa
    // - Si es facilitador con FULL_ACCESS: puede ver todas las notas de su organización
    // - Si es facilitador con OWN_EVALUATIONS: solo puede ver notas de evaluaciones que él envió

    let authorIds: string[] = [];
    
    if (user.memberOf) {
      // Es facilitador
      if (user.memberOf.accessLevel === 'FULL_ACCESS') {
        // Obtener todos los facilitadores del mismo dueño + el dueño
        const teamMembers = await prisma.teamMember.findMany({
          where: {
            ownerId: user.memberOf.ownerId,
            facilitatorId: { not: null },
          },
          select: { facilitatorId: true },
        });
        authorIds = [
          user.memberOf.ownerId,
          ...teamMembers.map((m: { facilitatorId: string | null }) => m.facilitatorId!),
        ];
      } else {
        // Solo sus propias notas
        authorIds = [user.id];
      }
    } else {
      // Es dueño o admin - obtener todos los facilitadores + el usuario
      const teamMembers = await prisma.teamMember.findMany({
        where: {
          ownerId: user.id,
          facilitatorId: { not: null },
        },
        select: { facilitatorId: true },
      });
      authorIds = [
        user.id,
        ...teamMembers.map((m: { facilitatorId: string | null }) => m.facilitatorId!),
      ];
    }

    // Construir query para las notas
    const whereClause: {
      evaluationType: EvaluationType;
      evaluationId: string;
      authorId?: { in: string[] };
      recipientEmail?: string;
    } = {
      evaluationType,
      evaluationId,
      authorId: { in: authorIds },
    };

    if (recipientEmail) {
      whereClause.recipientEmail = recipientEmail;
    }

    const notes = await prisma.evaluationNote.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
            jobTitle: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error al obtener notas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva nota
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { evaluationType, evaluationId, content, recipientEmail, recipientName } = body;

    if (!evaluationType || !evaluationId || !content?.trim() || !recipientEmail) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Validar que el tipo de evaluación sea válido
    const validTypes: EvaluationType[] = ['DISC', 'DRIVING_FORCES', 'EQ', 'DNA', 'ACUMEN', 'VALUES', 'STRESS'];
    if (!validTypes.includes(evaluationType)) {
      return NextResponse.json(
        { error: 'Tipo de evaluación inválido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario tenga acceso a esta evaluación
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberOf: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Crear la nota
    const note = await prisma.evaluationNote.create({
      data: {
        authorId: session.user.id,
        evaluationType,
        evaluationId,
        content: content.trim(),
        recipientEmail,
        recipientName: recipientName || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
            jobTitle: true,
          },
        },
      },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error('Error al crear nota:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
