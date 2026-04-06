import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SYSTEM_SETTING_DEFAULTS, getNumberSetting, getSystemSettingsMap } from '@/lib/system-settings';

// GET - Get invitation details (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: { inviteToken: params.token },
      include: {
        owner: {
          select: {
            name: true,
            company: true,
            email: true
          }
        }
      }
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Invitación no encontrada' },
        { status: 404 }
      );
    }

    // Check if already accepted
    if (teamMember.status === 'ACCEPTED') {
      return NextResponse.json(
        { error: 'Esta invitación ya fue aceptada', status: 'ACCEPTED' },
        { status: 400 }
      );
    }

    // Check if revoked
    if (teamMember.status === 'REVOKED') {
      return NextResponse.json(
        { error: 'Esta invitación ha sido revocada', status: 'REVOKED' },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > teamMember.tokenExpiry) {
      await prisma.teamMember.update({
        where: { id: teamMember.id },
        data: { status: 'EXPIRED' }
      });
      return NextResponse.json(
        { error: 'Esta invitación ha expirado. Solicita una nueva invitación.', status: 'EXPIRED' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      invitation: {
        name: teamMember.name,
        email: teamMember.email,
        jobTitle: teamMember.jobTitle,
        company: teamMember.owner.company,
        senderName: teamMember.owner.name || teamMember.owner.email,
        accessLevel: teamMember.accessLevel
      }
    });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { error: 'Error al obtener invitación' },
      { status: 500 }
    );
  }
}

// POST - Accept invitation and create account
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: { inviteToken: params.token },
      include: {
        owner: true
      }
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Invitación no encontrada' },
        { status: 404 }
      );
    }

    // Validate status
    if (teamMember.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Esta invitación ya no es válida (${teamMember.status})` },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > teamMember.tokenExpiry) {
      await prisma.teamMember.update({
        where: { id: teamMember.id },
        data: { status: 'EXPIRED' }
      });
      return NextResponse.json(
        { error: 'Esta invitación ha expirado' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { password, name } = body;

    const settings = await getSystemSettingsMap(['passwordMinLength']);
    const passwordMinLength = getNumberSetting(
      settings,
      'passwordMinLength',
      parseInt(SYSTEM_SETTING_DEFAULTS.passwordMinLength, 10),
      8,
      64
    );

    if (!password || password.length < passwordMinLength) {
      return NextResponse.json(
        { error: `La contraseña debe tener al menos ${passwordMinLength} caracteres` },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: teamMember.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este correo ya tiene una cuenta asociada' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user account for the facilitator
    const newUser = await prisma.user.create({
      data: {
        email: teamMember.email,
        name: name || teamMember.name, // Allow name update during signup
        password: hashedPassword,
        company: teamMember.owner.company,
        jobTitle: teamMember.jobTitle,
        role: 'USER',
        isActive: true,
        credits: 0, // Facilitators use owner's credits
        ownerId: teamMember.ownerId // Link to owner
      }
    });

    // Update team member status
    await prisma.teamMember.update({
      where: { id: teamMember.id },
      data: {
        status: 'ACCEPTED',
        facilitatorId: newUser.id,
        acceptedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Cuenta creada exitosamente',
      user: {
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { error: 'Error al aceptar invitación' },
      { status: 500 }
    );
  }
}
