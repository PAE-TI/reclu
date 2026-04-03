import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - Obtener configuración pública de compras para usuarios
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que es el usuario principal (no facilitador)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { ownerId: true }
    });

    if (user?.ownerId) {
      return NextResponse.json({ 
        enabled: false,
        reason: 'Solo el usuario principal de la cuenta puede comprar créditos'
      });
    }

    const settings = await prisma.systemSettings.findMany({
      where: {
        key: {
          in: [
            'credit_price_usd',
            'credit_purchases_enabled',
            'min_credits_purchase',
            'max_credits_purchase',
            'paypal_client_id'
          ]
        }
      }
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach(s => settingsMap[s.key] = s.value);

    const enabled = settingsMap['credit_purchases_enabled'] === 'true' && 
                    !!settingsMap['paypal_client_id'];

    return NextResponse.json({
      enabled,
      pricePerCredit: parseFloat(settingsMap['credit_price_usd'] || '0.10'),
      minCredits: parseInt(settingsMap['min_credits_purchase'] || '10'),
      maxCredits: parseInt(settingsMap['max_credits_purchase'] || '1000'),
      paypalClientId: enabled ? settingsMap['paypal_client_id'] : null
    });
  } catch (error) {
    console.error('Error fetching purchase settings:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
