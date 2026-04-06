import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const settings = await prisma.systemSettings.findMany({
      where: {
        key: {
          in: ['stripe_secret_key', 'stripe_mode', 'stripe_enabled'],
        },
      },
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach(setting => {
      if (setting.key === 'stripe_secret_key') {
        settingsMap[stripeSecretKeyConfigKey] = setting.value ? `********${setting.value.slice(-4)}` : '';
        settingsMap[stripeSecretKeyConfiguredKey] = setting.value ? 'true' : 'false';
      } else {
        settingsMap[setting.key] = setting.value;
      }
    });

    return NextResponse.json({
      settings: {
        secretKeyMasked: settingsMap[stripeSecretKeyConfigKey] || '',
        secretKeyConfigured: settingsMap[stripeSecretKeyConfiguredKey] === 'true',
        mode: settingsMap.stripe_mode === 'live' ? 'live' : 'test',
        purchasesEnabled: settingsMap.stripe_enabled === 'true',
      },
    });
  } catch (error) {
    console.error('Error fetching Stripe settings:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { key, value } = body;

    const allowedKeys = ['stripe_secret_key', 'stripe_mode', 'stripe_enabled'];
    if (!allowedKeys.includes(key)) {
      return NextResponse.json({ error: 'Clave no permitida' }, { status: 400 });
    }

    if (key === 'stripe_mode' && !['test', 'live'].includes(value)) {
      return NextResponse.json({ error: 'Modo inválido' }, { status: 400 });
    }

    if (key === 'stripe_enabled' && !['true', 'false'].includes(String(value))) {
      return NextResponse.json({ error: 'Valor inválido' }, { status: 400 });
    }

    await prisma.systemSettings.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value), description: `Stripe setting: ${key}` },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating Stripe settings:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

const stripeSecretKeyConfigKey = 'stripe_secret_key';
const stripeSecretKeyConfiguredKey = 'stripe_secret_key_configured';
