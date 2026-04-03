import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// DELETE - Delete an external DNA evaluation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const { token } = params;
    
    // Find the evaluation
    const evaluation = await prisma.externalDNAEvaluation.findUnique({
      where: { token },
    });
    
    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluación no encontrada' },
        { status: 404 }
      );
    }
    
    // Verify ownership
    if (evaluation.senderUserId !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar esta evaluación' },
        { status: 403 }
      );
    }
    
    // Delete responses first
    await prisma.externalDNAResponse.deleteMany({
      where: { externalEvaluationId: evaluation.id },
    });
    
    // Delete result if exists
    await prisma.externalDNAResult.deleteMany({
      where: { externalEvaluationId: evaluation.id },
    });
    
    // Delete the evaluation
    await prisma.externalDNAEvaluation.delete({
      where: { id: evaluation.id },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Evaluación eliminada exitosamente',
    });
  } catch (error) {
    console.error('Error deleting DNA evaluation:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la evaluación' },
      { status: 500 }
    );
  }
}
