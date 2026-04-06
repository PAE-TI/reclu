import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getPaymentSettingsMap } from '@/lib/payment-settings';

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

    const settings = await getPaymentSettingsMap();

    const paypalAvailable = settings.creditPurchasesEnabled && settings.paypalEnabled && !!settings.paypalClientId;
    const stripeAvailable = settings.creditPurchasesEnabled && settings.stripeEnabled && settings.stripeSecretKeyConfigured;

    return NextResponse.json({
      enabled: paypalAvailable || stripeAvailable,
      pricePerCredit: settings.creditPriceUSD,
      minCredits: settings.minCredits,
      maxCredits: settings.maxCredits,
      paypalEnabled: paypalAvailable,
      paypalClientId: paypalAvailable ? settings.paypalClientId : null,
      stripeEnabled: stripeAvailable,
      stripeConfigured: settings.stripeSecretKeyConfigured,
      stripeMode: settings.stripeMode,
    });
  } catch (error) {
    console.error('Error fetching purchase settings:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
