import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';
import { sendTeamInvitationEmail } from '@/lib/email';

// GET - List team members
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        teamMembers: {
          include: {
            facilitator: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Get activity stats for each team member
    const teamMembersWithStats = await Promise.all(
      (user.teamMembers || []).map(async (member: { id: string; facilitatorId: string | null; [key: string]: unknown }) => {
        if (member.facilitatorId) {
          // Count evaluations sent by this facilitator
          const evaluationsSent = await prisma.externalEvaluation.count({
            where: { senderUserId: member.facilitatorId }
          });
          
          return {
            ...member,
            stats: {
              evaluationsSent
            }
          };
        }
        return {
          ...member,
          stats: { evaluationsSent: 0 }
        };
      })
    );

    return NextResponse.json({
      teamMembers: teamMembersWithStats,
      company: user.company
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Error al obtener miembros del equipo' },
      { status: 500 }
    );
  }
}

// POST - Invite new team member
export async function POST(request: NextRequest) {
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

    // Check if user is a facilitator (can't invite others)
    if (user.ownerId) {
      return NextResponse.json(
        { error: 'Los facilitadores no pueden invitar a otros miembros' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, jobTitle, accessLevel } = body;

    if (!name || !email || !jobTitle) {
      return NextResponse.json(
        { error: 'Nombre, email y cargo son requeridos' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Check if already invited
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        ownerId: user.id,
        email: email.toLowerCase()
      }
    });

    if (existingMember) {
      if (existingMember.status === 'ACCEPTED') {
        return NextResponse.json(
          { error: 'Este usuario ya es miembro de tu equipo' },
          { status: 400 }
        );
      } else if (existingMember.status === 'PENDING') {
        return NextResponse.json(
          { error: 'Ya existe una invitación pendiente para este email' },
          { status: 400 }
        );
      }
    }

    // Check if email already has an account
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya tiene una cuenta. El usuario debe iniciar sesión con sus credenciales existentes.' },
        { status: 400 }
      );
    }

    // Generate invitation token
    const inviteToken = randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 7); // 7 days expiry

    // Create team member invitation
    const teamMember = await prisma.teamMember.create({
      data: {
        ownerId: user.id,
        email: email.toLowerCase(),
        name,
        jobTitle,
        accessLevel: accessLevel === 'FULL_ACCESS' ? 'FULL_ACCESS' : 'OWN_EVALUATIONS',
        inviteToken,
        tokenExpiry,
        status: 'PENDING'
      }
    });

    // Send invitation email
    try {
      await sendTeamInvitationEmail({
        recipientEmail: email,
        recipientName: name,
        senderName: user.name || user.email,
        company: user.company || 'MotivaIQ',
        jobTitle,
        inviteToken
      });
    } catch (emailError) {
      console.error('Error sending invitation email:', emailError);
      // Don't fail the request, the user can resend
    }

    return NextResponse.json({
      success: true,
      teamMember,
      inviteLink: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/team/invite/${inviteToken}`
    });
  } catch (error) {
    console.error('Error creating team invitation:', error);
    return NextResponse.json(
      { error: 'Error al crear invitación' },
      { status: 500 }
    );
  }
}
