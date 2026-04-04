import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Helper para obtener info de permisos del usuario
async function getUserPermissions(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      id: true, 
      ownerId: true, 
      role: true,
      memberOf: {
        select: {
          accessLevel: true,
          ownerId: true,
        }
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
    canCreateCampaigns: isOwner || isFullAccess, // Solo owner o full access pueden crear
    canViewPrivate: isOwner || isFullAccess,      // Solo owner o full access ven privadas
  };
}

// GET - Obtener todas las campañas del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const permissions = await getUserPermissions(session.user.id);
    if (!permissions) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Construir el filtro según permisos
    let whereClause: any = { userId: permissions.ownerId };
    
    // Si NO puede ver privadas, solo mostrar las públicas
    if (!permissions.canViewPrivate) {
      whereClause.isPrivate = false;
    }

    const campaigns = await prisma.selectionCampaign.findMany({
      where: whereClause,
      include: {
        candidates: {
          select: {
            id: true,
            status: true,
            overallScore: true,
          },
        },
        user: {
          select: {
            name: true,
            company: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Agregar estadísticas a cada campaña
    const campaignsWithStats = campaigns.map(campaign => {
      const totalCandidates = campaign.candidates.length;
      const completedCandidates = campaign.candidates.filter(c => c.status === 'COMPLETED').length;
      const avgScore = campaign.candidates.filter(c => c.overallScore !== null)
        .reduce((sum, c) => sum + (c.overallScore || 0), 0) / (campaign.candidates.filter(c => c.overallScore !== null).length || 1);

      return {
        id: campaign.id,
        name: campaign.name,
        jobTitle: campaign.jobTitle,
        jobCategory: campaign.jobCategory,
        description: campaign.description,
        status: campaign.status,
        evaluationTypes: campaign.evaluationTypes,
        isPrivate: campaign.isPrivate,
        allowTeamAddCandidates: campaign.allowTeamAddCandidates,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        closedAt: campaign.closedAt,
        hiredCandidateId: campaign.hiredCandidateId,
        hiredCandidateName: campaign.hiredCandidateName,
        completionNotes: campaign.completionNotes,
        createdBy: campaign.user?.company || campaign.user?.name,
        stats: {
          totalCandidates,
          completedCandidates,
          pendingCandidates: totalCandidates - completedCandidates,
          avgScore: Math.round(avgScore * 10) / 10,
        },
      };
    });

    return NextResponse.json({ 
      campaigns: campaignsWithStats,
      permissions: {
        canCreate: permissions.canCreateCampaigns,
        canViewPrivate: permissions.canViewPrivate,
      }
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Error al obtener campañas' }, { status: 500 });
  }
}

// POST - Crear nueva campaña
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const permissions = await getUserPermissions(session.user.id);
    if (!permissions) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar permiso para crear campañas
    if (!permissions.canCreateCampaigns) {
      return NextResponse.json(
        { error: 'Solo el administrador o usuarios con acceso completo pueden crear campañas' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, jobTitle, jobCategory, description, evaluationTypes, isPrivate, allowTeamAddCandidates } = body;

    if (!name || !jobTitle) {
      return NextResponse.json(
        { error: 'El nombre y el cargo son obligatorios' },
        { status: 400 }
      );
    }

    const campaign = await prisma.selectionCampaign.create({
      data: {
        name,
        jobTitle,
        jobCategory: jobCategory || null,
        description: description || null,
        evaluationTypes: evaluationTypes || ['DISC', 'DRIVING_FORCES', 'EQ'],
        isPrivate: isPrivate !== false, // Default true
        allowTeamAddCandidates: allowTeamAddCandidates === true, // Default false
        userId: permissions.ownerId,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: 'Error al crear la campaña' }, { status: 500 });
  }
}
