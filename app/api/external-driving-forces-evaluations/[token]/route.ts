
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canAccessTeamEvaluation } from '@/lib/team';

interface Context {
  params: { token: string };
}

// GET - Obtener evaluación externa por token
export async function GET(req: NextRequest, { params }: Context) {
  try {
    const url = new URL(req.url);
    const includeResults = url.searchParams.get('results') === 'true';
    
    const evaluation = await prisma.externalDrivingForcesEvaluation.findUnique({
      where: { token: params.token },
      include: {
        senderUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true,
            company: true,
          },
        },
        result: true,
        _count: {
          select: { responses: true }
        }
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    // Verificar si el token ha expirado (solo para evaluaciones pendientes)
    if (evaluation.status === 'PENDING' && new Date() > evaluation.tokenExpiry) {
      await prisma.externalDrivingForcesEvaluation.update({
        where: { id: evaluation.id },
        data: { status: 'EXPIRED' }
      });
      
      return NextResponse.json(
        { error: 'El enlace de evaluación ha expirado' },
        { status: 410 }
      );
    }

    // Si se solicitan resultados, verificar autenticación del remitente
    if (includeResults && evaluation.status === 'COMPLETED' && evaluation.result) {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Debes iniciar sesión para ver los resultados', requireAuth: true },
          { status: 401 }
        );
      }
      
      const hasAccess = await canAccessTeamEvaluation(session.user.id, evaluation.senderUserId);
      if (!hasAccess) {
        return NextResponse.json(
          { error: 'No tienes permiso para ver estos resultados' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ evaluation }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener evaluación externa:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
