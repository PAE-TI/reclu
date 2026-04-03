import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// DELETE - Eliminar una nota (solo el autor puede eliminarla)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verificar que la nota existe y pertenece al usuario
    const note = await prisma.evaluationNote.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Nota no encontrada' },
        { status: 404 }
      );
    }

    // Solo el autor puede eliminar la nota
    if (note.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar esta nota' },
        { status: 403 }
      );
    }

    await prisma.evaluationNote.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar nota:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar una nota (solo el autor puede actualizarla)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'El contenido es requerido' },
        { status: 400 }
      );
    }

    // Verificar que la nota existe y pertenece al usuario
    const note = await prisma.evaluationNote.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Nota no encontrada' },
        { status: 404 }
      );
    }

    // Solo el autor puede actualizar la nota
    if (note.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para editar esta nota' },
        { status: 403 }
      );
    }

    const updatedNote = await prisma.evaluationNote.update({
      where: { id },
      data: {
        content: content.trim(),
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

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error('Error al actualizar nota:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
