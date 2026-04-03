import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { EvaluationNote } from '@prisma/client';

// GET - Obtener todas las notas de una persona específica (por email)
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
    const recipientEmail = searchParams.get('email');

    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'Email es requerido' },
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

    // Obtener todas las notas de esta persona
    const notes = await prisma.evaluationNote.findMany({
      where: {
        recipientEmail,
        authorId: { in: authorIds },
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
      orderBy: { createdAt: 'desc' },
    });

    // Agrupar notas por tipo de evaluación
    type NoteWithAuthor = typeof notes[number];
    const notesByType = notes.reduce((acc: Record<string, NoteWithAuthor[]>, note: NoteWithAuthor) => {
      const type = note.evaluationType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(note);
      return acc;
    }, {});

    return NextResponse.json({ 
      notes,
      notesByType,
      totalCount: notes.length,
    });
  } catch (error) {
    console.error('Error al obtener notas por persona:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
