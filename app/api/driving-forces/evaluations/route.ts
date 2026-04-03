
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - Obtener evaluaciones de Driving Forces del usuario
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const evaluations = await prisma.drivingForcesEvaluation.findMany({
      where: { userId: session.user.id },
      include: {
        results: true,
        _count: {
          select: { responses: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ evaluations }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva evaluación de Driving Forces
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await req.json();

    const evaluation = await prisma.drivingForcesEvaluation.create({
      data: {
        title: data.title || `Evaluación Driving Forces - ${new Date().toLocaleDateString()}`,
        description: data.description,
        userId: session.user.id,
        status: 'DRAFT',
        startedAt: new Date(),
      },
    });

    return NextResponse.json({ evaluation }, { status: 201 });
  } catch (error) {
    console.error('Error al crear evaluación:', error);
    return NextResponse.json(
      { error: 'Error al crear evaluación' },
      { status: 500 }
    );
  }
}
