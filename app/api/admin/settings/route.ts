import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  SYSTEM_SETTING_DEFAULTS,
  SYSTEM_SETTING_DESCRIPTIONS,
  normalizeSettingValue,
} from '@/lib/system-settings';

export const dynamic = "force-dynamic";

// GET: Obtener configuración del sistema
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Solo admins pueden ver la configuración
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Obtener todas las configuraciones
    const settings = await prisma.systemSettings.findMany();
    
    // Convertir a objeto key-value
    const settingsObj: Record<string, string> = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });

    // Valores por defecto si no existen
    Object.entries(SYSTEM_SETTING_DEFAULTS).forEach(([key, value]) => {
      if (!settingsObj[key]) {
        settingsObj[key] = value;
      }
    });

    return NextResponse.json({ settings: settingsObj });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

// PUT: Actualizar configuración
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key y value son requeridos' },
        { status: 400 }
      );
    }

    const allowedKeys = Object.keys(SYSTEM_SETTING_DEFAULTS);

    if (!allowedKeys.includes(key)) {
      return NextResponse.json(
        { error: 'Clave no permitida' },
        { status: 400 }
      );
    }

    const normalizedValue = normalizeSettingValue(key, value);
    validateSettingValue(key, normalizedValue);

    // Upsert la configuración
    const setting = await prisma.systemSettings.upsert({
      where: { key },
      update: { value: normalizedValue },
      create: {
        key,
        value: normalizedValue,
        description: SYSTEM_SETTING_DESCRIPTIONS[key] || ''
      }
    });

    return NextResponse.json({ setting });
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('inválido') ||
      error.message.includes('permitida') ||
      error.message.includes('entre')
    )) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    console.error('Error updating setting:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}

function validateSettingValue(key: string, value: string) {
  if (key === 'defaultUserActive' || key === 'signupEnabled' || key === 'allowExternalPdfExport') {
    if (!['true', 'false'].includes(value)) {
      throw new Error(`Valor booleano inválido para ${key}`);
    }
    return;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Valor numérico inválido para ${key}`);
  }

  const limits: Record<string, { min: number; max: number }> = {
    defaultCredits: { min: 0, max: 100000 },
    creditsPerEvaluation: { min: 1, max: 1000 },
    passwordMinLength: { min: 8, max: 64 },
    loginMaxAttempts: { min: 1, max: 20 },
    loginLockoutMinutes: { min: 1, max: 1440 },
    technicalEvaluationExpiryDays: { min: 1, max: 365 },
    auditRetentionDays: { min: 7, max: 3650 },
  };

  const limit = limits[key];
  if (limit && (parsed < limit.min || parsed > limit.max)) {
    throw new Error(`El valor para ${key} debe estar entre ${limit.min} y ${limit.max}`);
  }
}
