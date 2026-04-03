
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface Context {
  params: { id: string };
}

// GET - Obtener resultado de Driving Forces por ID
export async function GET(req: NextRequest, { params }: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const result = await prisma.drivingForcesResult.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        evaluation: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            completedAt: true,
          },
        },
        interpretation: true,
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Resultado no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el usuario tenga acceso al resultado
    if (result.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permisos para ver este resultado' },
        { status: 403 }
      );
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener resultado:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
