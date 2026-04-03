import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// POST - Bulk delete questions
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
    const { action, questionIds, jobPosition } = body;

    if (action === 'delete') {
      // Check which questions have responses
      const questionsWithResponses = await prisma.externalTechnicalResponse.groupBy({
        by: ['questionId'],
        where: {
          questionId: { in: questionIds }
        }
      });

      const idsWithResponses = questionsWithResponses.map(q => q.questionId);
      const deletableIds = questionIds.filter((id: string) => !idsWithResponses.includes(id));

      if (deletableIds.length === 0) {
        return NextResponse.json(
          { error: 'Ninguna de las preguntas seleccionadas puede ser eliminada porque ya tienen respuestas' },
          { status: 400 }
        );
      }

      await prisma.technicalQuestion.deleteMany({
        where: { id: { in: deletableIds } }
      });

      return NextResponse.json({
        deleted: deletableIds.length,
        skipped: idsWithResponses.length,
        message: idsWithResponses.length > 0 
          ? `Se eliminaron ${deletableIds.length} preguntas. ${idsWithResponses.length} no se pudieron eliminar porque tienen respuestas.`
          : `Se eliminaron ${deletableIds.length} preguntas.`
      });
    }

    if (action === 'deleteByPosition' && jobPosition) {
      // Check for responses
      const questionsForPosition = await prisma.technicalQuestion.findMany({
        where: { jobPositionId: jobPosition },
        select: { id: true }
      });

      const questionIdsForPosition = questionsForPosition.map(q => q.id);

      const questionsWithResponses = await prisma.externalTechnicalResponse.groupBy({
        by: ['questionId'],
        where: {
          questionId: { in: questionIdsForPosition }
        }
      });

      if (questionsWithResponses.length > 0) {
        return NextResponse.json(
          { error: 'No se pueden eliminar las preguntas de este cargo porque algunas ya tienen respuestas' },
          { status: 400 }
        );
      }

      const result = await prisma.technicalQuestion.deleteMany({
        where: { jobPositionId: jobPosition }
      });

      return NextResponse.json({
        deleted: result.count,
        message: `Se eliminaron ${result.count} preguntas del cargo.`
      });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('Error in bulk operation:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
