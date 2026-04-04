import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - Obtener detalles de un candidato con sus evaluaciones
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; candidateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id, candidateId } = params;

    // Obtener el dueño real si es facilitador
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, ownerId: true, role: true },
    });

    const ownerId = user?.role === 'FACILITATOR' && user?.ownerId ? user.ownerId : session.user.id;

    // Verificar que la campaña pertenece al usuario
    const campaign = await prisma.selectionCampaign.findFirst({
      where: { id, userId: ownerId },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    const candidate = await prisma.campaignCandidate.findFirst({
      where: { id: candidateId, campaignId: id },
    });

    if (!candidate) {
      return NextResponse.json({ error: 'Candidato no encontrado' }, { status: 404 });
    }

    // Obtener los resultados de las evaluaciones
    const evaluationResults: Record<string, unknown> = {};

    if (candidate.discToken) {
      const discEval = await prisma.externalEvaluation.findUnique({
        where: { token: candidate.discToken },
        include: { result: true },
      });
      evaluationResults.disc = discEval;
    }

    if (candidate.drivingForcesToken) {
      const dfEval = await prisma.externalDrivingForcesEvaluation.findUnique({
        where: { token: candidate.drivingForcesToken },
        include: { result: true },
      });
      evaluationResults.drivingForces = dfEval;
    }

    if (candidate.eqToken) {
      const eqEval = await prisma.externalEQEvaluation.findUnique({
        where: { token: candidate.eqToken },
        include: { result: true },
      });
      evaluationResults.eq = eqEval;
    }

    if (candidate.dnaToken) {
      const dnaEval = await prisma.externalDNAEvaluation.findUnique({
        where: { token: candidate.dnaToken },
        include: { result: true },
      });
      evaluationResults.dna = dnaEval;
    }

    if (candidate.acumenToken) {
      const acumenEval = await prisma.externalAcumenEvaluation.findUnique({
        where: { token: candidate.acumenToken },
        include: { result: true },
      });
      evaluationResults.acumen = acumenEval;
    }

    if (candidate.valuesToken) {
      const valuesEval = await prisma.externalValuesEvaluation.findUnique({
        where: { token: candidate.valuesToken },
        include: { result: true },
      });
      evaluationResults.values = valuesEval;
    }

    if (candidate.stressToken) {
      const stressEval = await prisma.externalStressEvaluation.findUnique({
        where: { token: candidate.stressToken },
        include: { result: true },
      });
      evaluationResults.stress = stressEval;
    }

    return NextResponse.json({ 
      candidate,
      evaluations: evaluationResults,
    });
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return NextResponse.json({ error: 'Error al obtener candidato' }, { status: 500 });
  }
}

// PUT - Actualizar candidato
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; candidateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id, candidateId } = params;
    const body = await request.json();
    const { name, phone, notes, status } = body;

    // Obtener el dueño real si es facilitador
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, ownerId: true, role: true },
    });

    const ownerId = user?.role === 'FACILITATOR' && user?.ownerId ? user.ownerId : session.user.id;

    // Verificar que la campaña pertenece al usuario
    const campaign = await prisma.selectionCampaign.findFirst({
      where: { id, userId: ownerId },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    const candidate = await prisma.campaignCandidate.update({
      where: { id: candidateId },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(notes !== undefined && { notes }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({ candidate });
  } catch (error) {
    console.error('Error updating candidate:', error);
    return NextResponse.json({ error: 'Error al actualizar candidato' }, { status: 500 });
  }
}

// DELETE - Eliminar candidato de la campaña
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; candidateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id, candidateId } = params;

    // Obtener el dueño real si es facilitador
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, ownerId: true, role: true },
    });

    const ownerId = user?.role === 'FACILITATOR' && user?.ownerId ? user.ownerId : session.user.id;

    // Verificar que la campaña pertenece al usuario
    const campaign = await prisma.selectionCampaign.findFirst({
      where: { id, userId: ownerId },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    if (campaign.status === 'COMPLETED' || campaign.status === 'ARCHIVED') {
      return NextResponse.json({ error: 'No se pueden eliminar candidatos de una campaña completada o archivada' }, { status: 403 });
    }

    await prisma.campaignCandidate.delete({
      where: { id: candidateId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json({ error: 'Error al eliminar candidato' }, { status: 500 });
  }
}
