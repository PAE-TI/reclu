import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el usuario sea admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Obtener todos los usuarios con estadísticas
    const users = await prisma.user.findMany({
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
        // Include owner info for facilitators
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
          }
        },
        // Include TeamMember info if this user is a facilitator
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
        _count: {
          select: {
            sentExternalEvaluations: true,
            sentExternalDrivingForcesEvaluations: true,
            sentExternalEQEvaluations: true,
            sentExternalDNAEvaluations: true,
            sentExternalAcumenEvaluations: true,
            sentExternalValuesEvaluations: true,
            sentExternalStressEvaluations: true,
            teamMembers: true,
            facilitators: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calcular estadísticas globales
    const facilitatorCount = users.filter(u => u.ownerId !== null).length;
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      inactiveUsers: users.filter(u => !u.isActive).length,
      adminUsers: users.filter(u => u.role === 'ADMIN').length,
      facilitatorUsers: facilitatorCount,
      mainUsers: users.length - facilitatorCount,
    };

    return NextResponse.json({ users, stats });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
