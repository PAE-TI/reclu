
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { TokenUtils } from '@/lib/token-utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canAccessTeamEvaluation } from '@/lib/team';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const url = new URL(request.url);
    const includeResults = url.searchParams.get('results') === 'true';

    // Buscar evaluación por token
    const evaluation = await prisma.externalEvaluation.findUnique({
      where: { token },
      include: {
        responses: true,
        result: true,
        senderUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true
          }
        }
      }
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }

    // Verificar si el token ha expirado (solo para evaluaciones pendientes)
    if (evaluation.status === 'PENDING' && TokenUtils.isTokenExpired(evaluation.tokenExpiry)) {
      return NextResponse.json(
        { 
          error: 'El enlace ha expirado',
          expired: true,
          tokenExpiry: evaluation.tokenExpiry
        },
        { status: 410 }
      );
    }

    // Si se solicitan resultados de una evaluación completada, verificar autenticación
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

    // Verificar si ya fue completada
    if (evaluation.status === 'COMPLETED') {
      return NextResponse.json({
        evaluation: {
          id: evaluation.id,
          title: evaluation.title,
          description: evaluation.description,
          recipientName: evaluation.recipientName,
          recipientEmail: evaluation.recipientEmail,
          senderUserId: evaluation.senderUserId,
          senderUser: evaluation.senderUser,
          senderName: `${evaluation.senderUser.firstName} ${evaluation.senderUser.lastName}`,
          status: evaluation.status,
          completedAt: evaluation.completedAt,
          result: evaluation.result
        },
        alreadyCompleted: true
      });
    }

    // Calcular tiempo restante
    const timeUntilExpiry = TokenUtils.getTimeUntilExpiry(evaluation.tokenExpiry);

    return NextResponse.json({
      evaluation: {
        id: evaluation.id,
        title: evaluation.title,
        description: evaluation.description,
        recipientName: evaluation.recipientName,
        recipientEmail: evaluation.recipientEmail,
        senderUserId: evaluation.senderUserId,
        senderUser: evaluation.senderUser,
        senderName: `${evaluation.senderUser.firstName} ${evaluation.senderUser.lastName}`,
        status: evaluation.status,
        tokenExpiry: evaluation.tokenExpiry,
        timeUntilExpiry,
        hasResponses: evaluation.responses.length > 0,
        totalResponses: evaluation.responses.length
      }
    });

  } catch (error) {
    console.error('Error fetching external evaluation:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
