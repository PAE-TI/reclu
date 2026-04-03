import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const evaluationType = searchParams.get('evaluationType');
    const evaluationId = searchParams.get('evaluationId');
    const recipientEmail = searchParams.get('recipientEmail');

    if (!evaluationType || !evaluationId || !recipientEmail) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // Get current user with team relationships
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        memberOf: true,  // If user is a facilitator
        teamMembers: {   // If user is an owner, their team members
          where: { status: 'ACCEPTED' },
          select: { facilitatorId: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Build the list of author IDs whose notes this user can see
    const authorIds: string[] = [user.id];
    
    // If user is a facilitator, include owner's ID
    if (user.memberOf && user.memberOf.status === 'ACCEPTED') {
      authorIds.push(user.memberOf.ownerId);
      
      // If facilitator has FULL_ACCESS, include other team members
      if (user.memberOf.accessLevel === 'FULL_ACCESS') {
        const otherMembers = await prisma.teamMember.findMany({
          where: { 
            ownerId: user.memberOf.ownerId,
            status: 'ACCEPTED',
            facilitatorId: { not: null },
          },
          select: { facilitatorId: true },
        });
        otherMembers.forEach(m => {
          if (m.facilitatorId) authorIds.push(m.facilitatorId);
        });
      }
    }
    
    // If user is an owner, include all their team members
    if (user.teamMembers && user.teamMembers.length > 0) {
      user.teamMembers.forEach(m => {
        if (m.facilitatorId) authorIds.push(m.facilitatorId);
      });
    }

    // Count notes for this evaluation
    const count = await prisma.evaluationNote.count({
      where: {
        evaluationType: evaluationType as 'DISC' | 'DRIVING_FORCES' | 'EQ' | 'DNA' | 'ACUMEN' | 'VALUES' | 'STRESS',
        evaluationId,
        recipientEmail,
        authorId: { in: authorIds },
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error getting notes count:', error);
    return NextResponse.json(
      { error: 'Error al obtener conteo de notas' },
      { status: 500 }
    );
  }
}
