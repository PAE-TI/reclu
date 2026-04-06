import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getFacilitatorInfo } from '@/lib/team';

export const dynamic = 'force-dynamic';

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  name?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const MAX_NAME_LENGTH = 100;
const MAX_TEXT_LENGTH = 120;

// GET - Obtener información del perfil
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        jobTitle: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            sentExternalEvaluations: true,
            sentExternalDrivingForcesEvaluations: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Get facilitator info if applicable
    const facilitatorInfo = await getFacilitatorInfo(session.user.id);

    return NextResponse.json({ 
      user,
      facilitatorInfo 
    }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar información del perfil
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data: UpdateProfileData = await req.json();

    // Check if user is a facilitator
    const facilitatorInfo = await getFacilitatorInfo(session.user.id);
    const isFacilitator = !!facilitatorInfo;

    // Validaciones básicas
    if (data.firstName && data.firstName.trim().length < 2) {
      return NextResponse.json(
        { error: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400 }
      );
    }

    if (data.firstName && data.firstName.trim().length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: 'El nombre es demasiado largo' },
        { status: 400 }
      );
    }

    if (data.lastName && data.lastName.trim().length < 2) {
      return NextResponse.json(
        { error: 'El apellido debe tener al menos 2 caracteres' },
        { status: 400 }
      );
    }

    if (data.lastName && data.lastName.trim().length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: 'El apellido es demasiado largo' },
        { status: 400 }
      );
    }

    if (data.company && data.company.trim().length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: 'La empresa es demasiado larga' },
        { status: 400 }
      );
    }

    if (data.jobTitle && data.jobTitle.trim().length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: 'El cargo es demasiado largo' },
        { status: 400 }
      );
    }

    // Validar cambio de contraseña
    if (data.newPassword) {
      if (!data.currentPassword) {
        return NextResponse.json(
          { error: 'Debes proporcionar la contraseña actual' },
          { status: 400 }
        );
      }

      if (data.newPassword !== data.confirmPassword) {
        return NextResponse.json(
          { error: 'Las contraseñas no coinciden' },
          { status: 400 }
        );
      }

      if (data.newPassword.length < 6) {
        return NextResponse.json(
          { error: 'La nueva contraseña debe tener al menos 6 caracteres' },
          { status: 400 }
        );
      }

      if (data.newPassword.length > 128) {
        return NextResponse.json(
          { error: 'La nueva contraseña es demasiado larga' },
          { status: 400 }
        );
      }

      // Verificar contraseña actual
      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id }
      });

      if (!currentUser || !currentUser.password) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        data.currentPassword,
        currentUser.password
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'La contraseña actual es incorrecta' },
          { status: 400 }
        );
      }
    }

    // Preparar datos para actualización
    const updateData: any = {};

    // Actualizar campos - facilitators can only update name, not company or jobTitle
    if (data.firstName !== undefined) updateData.firstName = data.firstName.trim();
    if (data.lastName !== undefined) updateData.lastName = data.lastName.trim();
    
    // Only non-facilitators can update company and jobTitle
    if (!isFacilitator) {
      if (data.company !== undefined) updateData.company = data.company.trim().slice(0, MAX_TEXT_LENGTH) || null;
      if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle.trim().slice(0, MAX_TEXT_LENGTH) || null;
    }
    
    // Actualizar name combinado si se proporciona alguno de los nombres
    if (data.firstName !== undefined || data.lastName !== undefined) {
      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { firstName: true, lastName: true }
      });
      
      if (currentUser) {
        const firstName = data.firstName !== undefined ? data.firstName.trim() : (currentUser.firstName || '');
        const lastName = data.lastName !== undefined ? data.lastName.trim() : (currentUser.lastName || '');
        updateData.name = `${firstName} ${lastName}`.trim();
      }
    }

    // Hash de nueva contraseña si se proporciona
    if (data.newPassword) {
      updateData.password = await bcrypt.hash(data.newPassword, 12);
    }

    updateData.updatedAt = new Date();

    // Actualizar usuario en la base de datos
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        jobTitle: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(
      {
        message: 'Perfil actualizado exitosamente',
        user: updatedUser
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
