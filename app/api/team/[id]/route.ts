import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';
import { sendTeamInvitationEmail } from '@/lib/email';
import { getAppBaseUrl } from '@/lib/site-url';

// GET - Get single team member details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: params.id,
        ownerId: user.id
      },
      include: {
        facilitator: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      }
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'Miembro no encontrado' }, { status: 404 });
    }

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { error: 'Error al obtener miembro' },
      { status: 500 }
    );
  }
}

// PUT - Update team member (access level, name, job title)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: params.id,
        ownerId: user.id
      }
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'Miembro no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { name, jobTitle, accessLevel, action } = body;

    // Handle resend invitation action
    if (action === 'resend') {
      if (teamMember.status !== 'PENDING') {
        return NextResponse.json(
          { error: 'Solo se pueden reenviar invitaciones pendientes' },
          { status: 400 }
        );
      }

      // Generate new token
      const newToken = randomBytes(32).toString('hex');
      const tokenExpiry = new Date();
      tokenExpiry.setDate(tokenExpiry.getDate() + 7);

      await prisma.teamMember.update({
        where: { id: teamMember.id },
        data: {
          inviteToken: newToken,
          tokenExpiry
        }
      });

      // Send invitation email
      try {
        await sendTeamInvitationEmail({
          recipientEmail: teamMember.email,
          recipientName: teamMember.name,
          senderName: user.name || user.email,
          company: user.company || 'Reclu',
          jobTitle: teamMember.jobTitle,
          inviteToken: newToken
        });
      } catch (emailError) {
        console.error('Error sending invitation email:', emailError);
      }

      return NextResponse.json({
        success: true,
        message: 'Invitación reenviada',
        inviteLink: `${getAppBaseUrl()}/team/invite/${newToken}`
      });
    }

    // Update team member data
    const updateData: { name?: string; jobTitle?: string; accessLevel?: 'FULL_ACCESS' | 'OWN_EVALUATIONS' } = {};
    
    if (name) updateData.name = name;
    if (jobTitle) updateData.jobTitle = jobTitle;
    if (accessLevel) updateData.accessLevel = accessLevel;

    const updatedMember = await prisma.teamMember.update({
      where: { id: teamMember.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      teamMember: updatedMember
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Error al actualizar miembro' },
      { status: 500 }
    );
  }
}

// DELETE - Remove team member / Revoke invitation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: params.id,
        ownerId: user.id
      },
      include: {
        facilitator: true
      }
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'Miembro no encontrado' }, { status: 404 });
    }

    // If the team member has an associated user, deactivate it
    if (teamMember.facilitatorId) {
      await prisma.user.update({
        where: { id: teamMember.facilitatorId },
        data: { isActive: false }
      });
    }

    // Update status to revoked instead of deleting
    await prisma.teamMember.update({
      where: { id: teamMember.id },
      data: { status: 'REVOKED' }
    });

    return NextResponse.json({
      success: true,
      message: 'Miembro eliminado del equipo'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Error al eliminar miembro' },
      { status: 500 }
    );
  }
}
