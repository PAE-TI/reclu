import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Obtener access token de PayPal
async function getPayPalAccessToken(): Promise<string | null> {
  try {
    const settings = await prisma.systemSettings.findMany({
      where: {
        key: {
          in: ['paypal_client_id', 'paypal_client_secret', 'paypal_mode']
        }
      }
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach(s => settingsMap[s.key] = s.value);

    const clientId = settingsMap['paypal_client_id'];
    const clientSecret = settingsMap['paypal_client_secret'];
    const mode = settingsMap['paypal_mode'] || 'sandbox';

    if (!clientId || !clientSecret) {
      return null;
    }

    const baseUrl = mode === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      console.error('PayPal auth error:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que es el usuario principal (no facilitador)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, ownerId: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (user.ownerId) {
      return NextResponse.json({ 
        error: 'Solo el usuario principal de la cuenta puede comprar créditos' 
      }, { status: 403 });
    }

    const body = await request.json();
    const { creditAmount } = body;

    // Obtener configuración
    const settings = await prisma.systemSettings.findMany({
      where: {
        key: {
          in: [
            'credit_price_usd',
            'credit_purchases_enabled',
            'min_credits_purchase',
            'max_credits_purchase',
            'paypal_mode'
          ]
        }
      }
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach(s => settingsMap[s.key] = s.value);

    // Validaciones
    if (settingsMap['credit_purchases_enabled'] !== 'true') {
      return NextResponse.json({ 
        error: 'Las compras de créditos no están habilitadas actualmente' 
      }, { status: 400 });
    }

    const pricePerCredit = parseFloat(settingsMap['credit_price_usd'] || '0.10');
    const minCredits = parseInt(settingsMap['min_credits_purchase'] || '10');
    const maxCredits = parseInt(settingsMap['max_credits_purchase'] || '1000');

    if (!creditAmount || creditAmount < minCredits || creditAmount > maxCredits) {
      return NextResponse.json({ 
        error: `La cantidad debe estar entre ${minCredits} y ${maxCredits} créditos` 
      }, { status: 400 });
    }

    const totalPrice = (creditAmount * pricePerCredit).toFixed(2);

    // Obtener access token de PayPal
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'PayPal no está configurado correctamente' 
      }, { status: 500 });
    }

    const mode = settingsMap['paypal_mode'] || 'sandbox';
    const baseUrl = mode === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    // Crear orden en PayPal
    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: `credits_${session.user.id}_${Date.now()}`,
          description: `${creditAmount} créditos Reclu`,
          amount: {
            currency_code: 'USD',
            value: totalPrice
          }
        }]
      })
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text();
      console.error('PayPal order error:', errorData);
      return NextResponse.json({ 
        error: 'Error al crear la orden de PayPal' 
      }, { status: 500 });
    }

    const orderData = await orderResponse.json();

    // Crear registro de compra
    const purchase = await prisma.creditPurchase.create({
      data: {
        userId: session.user.id,
        creditAmount,
        priceUSD: parseFloat(totalPrice),
        pricePerCredit,
        paypalOrderId: orderData.id,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      orderId: orderData.id,
      purchaseId: purchase.id,
      creditAmount,
      totalPrice
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
