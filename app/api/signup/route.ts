
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { giveInitialCredits } from '@/lib/credits';
import {
  SYSTEM_SETTING_DEFAULTS,
  getBooleanSetting,
  getNumberSetting,
  getSystemSettingsMap,
} from '@/lib/system-settings';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, language } = body;

    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const safeFirstName = typeof firstName === 'string' ? firstName.trim() : '';
    const safeLastName = typeof lastName === 'string' ? lastName.trim() : '';
    const safePassword = typeof password === 'string' ? password : '';

    if (!normalizedEmail || !safePassword || !safeFirstName || !safeLastName) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (safeFirstName.length > 100 || safeLastName.length > 100) {
      return NextResponse.json(
        { error: 'El nombre es demasiado largo' },
        { status: 400 }
      );
    }

    if (safePassword.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'El email no es válido' },
        { status: 400 }
      );
    }
    
    // Validate language
    const userLanguage = language && ['es', 'en'].includes(language) ? language : 'es';

    // Verificar if usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    const settings = await getSystemSettingsMap([
      'signupEnabled',
      'defaultUserActive',
      'passwordMinLength',
    ]);

    if (!getBooleanSetting(settings, 'signupEnabled', true)) {
      return NextResponse.json(
        { error: 'Los registros están deshabilitados temporalmente' },
        { status: 403 }
      );
    }

    const isActiveByDefault = getBooleanSetting(settings, 'defaultUserActive', true);
    const passwordMinLength = getNumberSetting(
      settings,
      'passwordMinLength',
      parseInt(SYSTEM_SETTING_DEFAULTS.passwordMinLength, 10),
      8,
      64
    );

    // Hash password
    if (safePassword.length < passwordMinLength) {
      return NextResponse.json(
        { error: `La contraseña debe tener al menos ${passwordMinLength} caracteres` },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(safePassword, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        firstName: safeFirstName,
        lastName: safeLastName,
        name: `${safeFirstName} ${safeLastName}`.trim(),
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
