
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { giveInitialCredits } from '@/lib/credits';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, language } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }
    
    // Validate language
    const userLanguage = language && ['es', 'en'].includes(language) ? language : 'es';

    // Verificar if usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Verificar configuración de activación por defecto
    const defaultActiveSetting = await prisma.systemSettings.findUnique({
      where: { key: 'defaultUserActive' }
    });
    const isActiveByDefault = defaultActiveSetting?.value !== 'false';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        isActive: isActiveByDefault,
        language: userLanguage,
      },
    });

    // Dar créditos iniciales
    const initialCredits = await giveInitialCredits(user.id);

    // Si el usuario queda inactivo, indicarlo en la respuesta
    if (!isActiveByDefault) {
      return NextResponse.json({
        message: 'Cuenta creada exitosamente',
        requiresActivation: true,
        initialCredits,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    }

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      requiresActivation: false,
      initialCredits,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
