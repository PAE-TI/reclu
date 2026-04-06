import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createAdminAuditLog } from '@/lib/admin-audit';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        jobTitle: true,
        role: true,
        isActive: true,
        credits: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        // Owner info for facilitators
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
            credits: true,
          }
        },
        // TeamMember info
        memberOf: {
          select: {
            id: true,
            accessLevel: true,
            status: true,
            jobTitle: true,
            invitedAt: true,
            acceptedAt: true,
          }
        },
        sentExternalEvaluations: {
          select: {
            id: true,
            recipientEmail: true,
            recipientName: true,
            status: true,
            createdAt: true,
            completedAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        sentExternalDrivingForcesEvaluations: {
          select: {
            id: true,
            recipientEmail: true,
            recipientName: true,
            status: true,
            createdAt: true,
            completedAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        sentExternalEQEvaluations: {
          select: {
            id: true,
            recipientEmail: true,
            recipientName: true,
            status: true,
            createdAt: true,
            completedAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        sentExternalDNAEvaluations: {
          select: {
            id: true,
            recipientEmail: true,
            recipientName: true,
            status: true,
            createdAt: true,
            completedAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        sentExternalAcumenEvaluations: {
          select: {
            id: true,
            recipientEmail: true,
            recipientName: true,
            status: true,
            createdAt: true,
            completedAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        sentExternalValuesEvaluations: {
          select: {
            id: true,
            recipientEmail: true,
            recipientName: true,
            status: true,
            createdAt: true,
            completedAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        sentExternalStressEvaluations: {
          select: {
            id: true,
            recipientEmail: true,
            recipientName: true,
            status: true,
            createdAt: true,
            completedAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            sentExternalEvaluations: true,
            sentExternalDrivingForcesEvaluations: true,
            sentExternalEQEvaluations: true,
            sentExternalDNAEvaluations: true,
            sentExternalAcumenEvaluations: true,
            sentExternalValuesEvaluations: true,
            sentExternalStressEvaluations: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    if (currentUser.id === params.id) {
      return NextResponse.json({ error: 'No puedes eliminar tu propio usuario' }, { status: 400 });
    }

    await prisma.$transaction([
      // DISC external evaluations (responses/results are Restrict)
      prisma.externalEvaluationResponse.deleteMany({ where: { externalEvaluation: { senderUserId: params.id } } }),
      prisma.externalEvaluationResult.deleteMany({ where: { externalEvaluation: { senderUserId: params.id } } }),
      prisma.externalEvaluation.deleteMany({ where: { senderUserId: params.id } }),
      // Driving Forces (responses/results are Restrict)
      prisma.externalDrivingForcesResponse.deleteMany({ where: { externalEvaluation: { senderUserId: params.id } } }),
      prisma.externalDrivingForcesResult.deleteMany({ where: { externalEvaluation: { senderUserId: params.id } } }),
      prisma.externalDrivingForcesEvaluation.deleteMany({ where: { senderUserId: params.id } }),
      // EQ (responses/results are Restrict)
      prisma.externalEQResponse.deleteMany({ where: { externalEvaluation: { senderUserId: params.id } } }),
      prisma.externalEQResult.deleteMany({ where: { externalEvaluation: { senderUserId: params.id } } }),
      prisma.externalEQEvaluation.deleteMany({ where: { senderUserId: params.id } }),
      // DNA (responses/results are Restrict)
      prisma.externalDNAResponse.deleteMany({ where: { externalEvaluation: { senderUserId: params.id } } }),
      prisma.externalDNAResult.deleteMany({ where: { externalEvaluation: { senderUserId: params.id } } }),
      prisma.externalDNAEvaluation.deleteMany({ where: { senderUserId: params.id } }),
      // Acumen (responses Cascade, results Restrict)
      prisma.externalAcumenResult.deleteMany({ where: { externalEvaluation: { senderUserId: params.id } } }),
      prisma.externalAcumenEvaluation.deleteMany({ where: { senderUserId: params.id } }),
      // Values (responses Cascade, results Restrict)
      prisma.externalValuesResult.deleteMany({ where: { externalEvaluation: { senderUserId: params.id } } }),
      prisma.externalValuesEvaluation.deleteMany({ where: { senderUserId: params.id } }),
      // Stress (responses Cascade, results Restrict)
      prisma.externalStressResult.deleteMany({ where: { externalEvaluation: { senderUserId: params.id } } }),
      prisma.externalStressEvaluation.deleteMany({ where: { senderUserId: params.id } }),
      // Technical (responses/results are Restrict)
      prisma.externalTechnicalResponse.deleteMany({ where: { externalEvaluation: { senderUserId: params.id } } }),
      prisma.externalTechnicalResult.deleteMany({ where: { externalEvaluation: { senderUserId: params.id } } }),
      prisma.externalTechnicalEvaluation.deleteMany({ where: { senderUserId: params.id } }),
      // Delete user (Account, Session, own evaluations, notifications, etc. cascade automatically)
      prisma.user.delete({ where: { id: params.id } }),
    ]);

    await createAdminAuditLog({
      actorUserId: currentUser.id,
      action: 'USER_DELETE',
      entityType: 'User',
      entityId: params.id,
      summary: `Eliminó al usuario ${params.id}`,
      metadata: { userId: params.id },
      request,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // No permitir que un admin se desactive a sí mismo
    if (currentUser.id === params.id) {
      return NextResponse.json({ error: 'No puedes modificar tu propio usuario' }, { status: 400 });
    }

    const body = await request.json();
    const { isActive, role } = body;

    const updateData: { isActive?: boolean; role?: 'USER' | 'ADMIN' | 'FACILITATOR' } = {};
    
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }
    
    if (role && ['USER', 'ADMIN', 'FACILITATOR'].includes(role)) {
      updateData.role = role;
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        role: true,
        isActive: true,
      }
    });

    if (typeof isActive === 'boolean') {
      await createAdminAuditLog({
        actorUserId: currentUser.id,
        action: 'USER_STATUS_UPDATE',
        entityType: 'User',
        entityId: params.id,
        summary: `${isActive ? 'Activó' : 'Desactivó'} al usuario ${params.id}`,
        metadata: { isActive },
        request,
      });
    }

    if (role && ['USER', 'ADMIN', 'FACILITATOR'].includes(role)) {
      await createAdminAuditLog({
        actorUserId: currentUser.id,
        action: 'USER_ROLE_UPDATE',
        entityType: 'User',
        entityId: params.id,
        summary: `Cambió el rol del usuario ${params.id} a ${role}`,
        metadata: { role },
        request,
      });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
