import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

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
    if (!settingsObj['defaultUserActive']) {
      settingsObj['defaultUserActive'] = 'true';
    }
    if (!settingsObj['defaultCredits']) {
      settingsObj['defaultCredits'] = '100';
    }
    if (!settingsObj['creditsPerEvaluation']) {
      settingsObj['creditsPerEvaluation'] = '2';
    }

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

    // Upsert la configuración
    const setting = await prisma.systemSettings.upsert({
      where: { key },
      update: { value: String(value) },
      create: {
        key,
        value: String(value),
        description: getSettingDescription(key)
      }
    });

    return NextResponse.json({ setting });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}

function getSettingDescription(key: string): string {
  const descriptions: Record<string, string> = {
    'defaultUserActive': 'Define si los nuevos usuarios registrados quedan activos automáticamente',
    'defaultCredits': 'Créditos iniciales que reciben los nuevos usuarios al registrarse',
    'creditsPerEvaluation': 'Créditos que se descuentan al enviar cada evaluación',
  };
  return descriptions[key] || '';
}
