import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

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

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
