import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Helper to get evaluation status by token
async function getEvaluationStatusByToken(
  token: string | null,
  evaluationType: string
): Promise<{ status: string; completedAt: Date | null } | null> {
  if (!token) return null;

  try {
    switch (evaluationType) {
      case 'DISC': {
        const eval_ = await prisma.externalEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      case 'DRIVING_FORCES': {
        const eval_ = await prisma.externalDrivingForcesEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      case 'EQ': {
        const eval_ = await prisma.externalEQEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      case 'DNA': {
        const eval_ = await prisma.externalDNAEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      case 'ACUMEN': {
        const eval_ = await prisma.externalAcumenEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      case 'VALUES': {
        const eval_ = await prisma.externalValuesEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      case 'STRESS': {
        const eval_ = await prisma.externalStressEvaluation.findUnique({
          where: { token },
          select: { status: true, completedAt: true },
        });
        return eval_ ? { status: eval_.status, completedAt: eval_.completedAt } : null;
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}

// Helper para obtener permisos del usuario
async function getUserPermissions(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      id: true, 
      ownerId: true, 
      role: true,
      memberOf: {
        select: { accessLevel: true }
      }
    },
  });

  if (!user) return null;

  const isOwner = user.role !== 'FACILITATOR';
  const isFullAccess = user.memberOf?.accessLevel === 'FULL_ACCESS';
  const ownerId = user.role === 'FACILITATOR' && user.ownerId ? user.ownerId : userId;

  return {
    userId,
    ownerId,
    isOwner,
    isFullAccess,
    canViewPrivate: isOwner || isFullAccess,
    canEdit: isOwner || isFullAccess,
  };
}

// GET - Obtener una campaña específica con todos sus candidatos
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    const permissions = await getUserPermissions(session.user.id);
    if (!permissions) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const campaign = await prisma.selectionCampaign.findFirst({
      where: {
        id,
        userId: permissions.ownerId,
      },
      include: {
        technicalTemplate: {
          select: {
            id: true,
            name: true,
            basePositionId: true,
            basePositionTitle: true,
          },
        },
        candidates: {
          orderBy: [
            { rankPosition: 'asc' },
            { overallScore: 'desc' },
            { createdAt: 'asc' },
          ],
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    // Verificar permiso para ver si es privada
    if (campaign.isPrivate && !permissions.canViewPrivate) {
      return NextResponse.json({ error: 'No tienes permiso para ver esta campaña' }, { status: 403 });
    }

    // Calcular permisos específicos para esta campaña
    const canAddCandidates = permissions.isOwner || permissions.isFullAccess || campaign.allowTeamAddCandidates;

    // Enrich candidates with evaluation progress
    const evaluationTypes = campaign.evaluationTypes as string[];
    const enrichedCandidates = await Promise.all(
      campaign.candidates.map(async (candidate) => {
        const evaluationProgress: Record<string, { status: string; completedAt: string | null }> = {};
        
        const tokenMap: Record<string, string | null> = {
          'DISC': candidate.discToken,
          'DRIVING_FORCES': candidate.drivingForcesToken,
          'EQ': candidate.eqToken,
          'DNA': candidate.dnaToken,
          'ACUMEN': candidate.acumenToken,
          'VALUES': candidate.valuesToken,
          'STRESS': candidate.stressToken,
        };

        for (const evalType of evaluationTypes) {
          const token = tokenMap[evalType];
          const evalStatus = await getEvaluationStatusByToken(token, evalType);
          evaluationProgress[evalType] = {
            status: evalStatus?.status || 'PENDING',
            completedAt: evalStatus?.completedAt?.toISOString() || null,
          };
        }

        const completedCount = Object.values(evaluationProgress).filter(e => e.status === 'COMPLETED').length;
        const totalCount = evaluationTypes.length;

        return {
          ...candidate,
          evaluationProgress,
          completedEvaluations: completedCount,
          totalEvaluations: totalCount,
        };
      })
    );

    return NextResponse.json({ 
      campaign: {
        ...campaign,
        campaignType: campaign.campaignType,
        candidates: enrichedCandidates,
      },
      permissions: {
        canEdit: permissions.canEdit,
        canAddCandidates,
        canDelete: permissions.canEdit,
      }
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ error: 'Error al obtener la campaña' }, { status: 500 });
  }
}

// PUT - Actualizar campaña
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, jobTitle, jobCategory, description, campaignType, evaluationTypes, status, hiredCandidateId, hiredCandidateName, completionNotes, technicalTemplateId } = body;

    // Obtener el dueño real si es facilitador
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, ownerId: true, role: true },
    });

    const ownerId = user?.role === 'FACILITATOR' && user?.ownerId ? user.ownerId : session.user.id;

    // Verificar que la campaña pertenece al usuario
    const existingCampaign = await prisma.selectionCampaign.findFirst({
      where: { id, userId: ownerId },
    });

    if (!existingCampaign) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    let resolvedTechnicalTemplateId = existingCampaign.technicalTemplateId;
    if (technicalTemplateId !== undefined) {
      resolvedTechnicalTemplateId = technicalTemplateId || null;
    }

    if (Array.isArray(evaluationTypes) ? evaluationTypes.includes('TECHNICAL') : existingCampaign.evaluationTypes.includes('TECHNICAL')) {
      if (!resolvedTechnicalTemplateId) {
        return NextResponse.json(
          { error: 'Debes seleccionar una plantilla técnica para incluir la prueba técnica en la campaña' },
          { status: 400 }
        );
      }
    }

    const campaign = await prisma.selectionCampaign.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(jobTitle && { jobTitle }),
        ...(jobCategory !== undefined && { jobCategory }),
        ...(description !== undefined && { description }),
        ...(campaignType && { campaignType }),
        ...(evaluationTypes && { evaluationTypes }),
        ...(technicalTemplateId !== undefined && { technicalTemplateId: resolvedTechnicalTemplateId }),
        ...(status && { status }),
        ...(status === 'COMPLETED' && { closedAt: new Date() }),
        ...(status === 'ARCHIVED' && { archivedAt: new Date() }),
        ...(hiredCandidateId !== undefined && { hiredCandidateId: hiredCandidateId || null }),
        ...(hiredCandidateName !== undefined && { hiredCandidateName: hiredCandidateName || null }),
        ...(completionNotes !== undefined && { completionNotes: completionNotes || null }),
        ...(campaignType === 'INTERNAL_TEAM' && { isPrivate: true, allowTeamAddCandidates: true }),
      },
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json({ error: 'Error al actualizar la campaña' }, { status: 500 });
  }
}

// DELETE - Eliminar campaña
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;

    // Obtener el dueño real si es facilitador
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, ownerId: true, role: true },
    });

    const ownerId = user?.role === 'FACILITATOR' && user?.ownerId ? user.ownerId : session.user.id;

    // Verificar que la campaña pertenece al usuario
    const existingCampaign = await prisma.selectionCampaign.findFirst({
      where: { id, userId: ownerId },
    });

    if (!existingCampaign) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    // Eliminar la campaña (los candidatos se eliminan en cascada)
    await prisma.selectionCampaign.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json({ error: 'Error al eliminar la campaña' }, { status: 500 });
  }
}
