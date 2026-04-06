import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - Obtener configuración de PayPal
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const settings = await prisma.systemSettings.findMany({
      where: {
        key: {
          in: [
            'paypal_client_id',
            'paypal_client_secret',
            'paypal_mode',
            'credit_price_usd',
            'credit_purchases_enabled',
            'paypal_enabled',
            'min_credits_purchase',
            'max_credits_purchase'
          ]
        }
      }
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach((s: { key: string; value: string }) => {
      // No devolver el client_secret completo por seguridad
      if (s.key === 'paypal_client_secret') {
        settingsMap[s.key] = s.value ? '********' + s.value.slice(-4) : '';
        settingsMap['paypal_client_secret_configured'] = s.value ? 'true' : 'false';
      } else {
        settingsMap[s.key] = s.value;
      }
    });

    return NextResponse.json({
      settings: {
        clientId: settingsMap['paypal_client_id'] || '',
        clientSecretMasked: settingsMap['paypal_client_secret'] || '',
        clientSecretConfigured: settingsMap['paypal_client_secret_configured'] === 'true',
        mode: settingsMap['paypal_mode'] || 'sandbox',
        creditPriceUSD: parseFloat(settingsMap['credit_price_usd'] || '0.10'),
        purchasesEnabled: Object.prototype.hasOwnProperty.call(settingsMap, 'paypal_enabled')
          ? settingsMap['paypal_enabled'] === 'true'
          : settingsMap['credit_purchases_enabled'] === 'true',
        minCredits: parseInt(settingsMap['min_credits_purchase'] || '10'),
        maxCredits: parseInt(settingsMap['max_credits_purchase'] || '1000')
      }
    });
  } catch (error) {
    console.error('Error fetching PayPal settings:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// PUT - Actualizar configuración de PayPal
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { key, value } = body;

    const allowedKeys = [
      'paypal_client_id',
      'paypal_client_secret',
      'paypal_mode',
      'credit_price_usd',
      'credit_purchases_enabled',
      'paypal_enabled',
      'min_credits_purchase',
      'max_credits_purchase'
    ];

    if (!allowedKeys.includes(key)) {
      return NextResponse.json({ error: 'Clave no permitida' }, { status: 400 });
    }

    // Validaciones específicas
    if (key === 'credit_price_usd') {
      const price = parseFloat(value);
      if (isNaN(price) || price <= 0 || price > 100) {
        return NextResponse.json({ error: 'Precio debe estar entre 0.01 y 100 USD' }, { status: 400 });
      }
    }

    if (key === 'min_credits_purchase' || key === 'max_credits_purchase') {
      const credits = parseInt(value);
      if (isNaN(credits) || credits < 1) {
        return NextResponse.json({ error: 'Cantidad de créditos inválida' }, { status: 400 });
      }
    }

    await prisma.systemSettings.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value), description: `PayPal setting: ${key}` }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating PayPal settings:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
