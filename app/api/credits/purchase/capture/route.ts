import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendPurchaseInvoiceEmail } from '@/lib/email';

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

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId requerido' }, { status: 400 });
    }

    // Buscar la compra
    const purchase = await prisma.creditPurchase.findUnique({
      where: { paypalOrderId: orderId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
            credits: true
          }
        }
      }
    });

    if (!purchase) {
      return NextResponse.json({ error: 'Compra no encontrada' }, { status: 404 });
    }

    if (purchase.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    if (purchase.status === 'COMPLETED') {
      return NextResponse.json({ 
        success: true,
        message: 'El pago ya fue procesado',
        creditAmount: purchase.creditAmount
      });
    }

    // Obtener access token de PayPal
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Error de configuración PayPal' }, { status: 500 });
    }

    const settings = await prisma.systemSettings.findFirst({
      where: { key: 'paypal_mode' }
    });
    const mode = settings?.value || 'sandbox';
    const baseUrl = mode === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    // Capturar el pago en PayPal
    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!captureResponse.ok) {
      const errorData = await captureResponse.text();
      console.error('PayPal capture error:', errorData);
      
      await prisma.creditPurchase.update({
        where: { id: purchase.id },
        data: { 
          status: 'FAILED',
          errorMessage: errorData.substring(0, 500)
        }
      });

      return NextResponse.json({ error: 'Error al capturar el pago' }, { status: 500 });
    }

    const captureData = await captureResponse.json();

    if (captureData.status !== 'COMPLETED') {
      await prisma.creditPurchase.update({
        where: { id: purchase.id },
        data: { 
          status: 'FAILED',
          errorMessage: `Estado de PayPal: ${captureData.status}`
        }
      });

      return NextResponse.json({ 
        error: `Pago no completado. Estado: ${captureData.status}` 
      }, { status: 400 });
    }

    // Extraer información del pago
    const payer = captureData.payer || {};
    const payerId = payer.payer_id;
    const payerEmail = payer.email_address;

    // Generar número de factura
    const invoiceNumber = `INV-${Date.now()}-${purchase.id.slice(-6).toUpperCase()}`;

    // Actualizar la compra y añadir créditos en una transacción
    const newBalance = purchase.user.credits + purchase.creditAmount;

    await prisma.$transaction([
      prisma.creditPurchase.update({
        where: { id: purchase.id },
        data: {
          status: 'COMPLETED',
          paypalPayerId: payerId,
          paypalPayerEmail: payerEmail,
          completedAt: new Date(),
          invoiceNumber
        }
      }),
      prisma.user.update({
        where: { id: purchase.userId },
        data: { credits: newBalance }
      }),
      prisma.creditTransaction.create({
        data: {
          userId: purchase.userId,
          amount: purchase.creditAmount,
          type: 'PURCHASE',
          description: `Compra de ${purchase.creditAmount} créditos vía PayPal (${invoiceNumber})`,
          balanceAfter: newBalance
        }
      })
    ]);

    // Enviar factura por email
    try {
      await sendPurchaseInvoiceEmail({
        to: purchase.user.email,
        userName: purchase.user.firstName || purchase.user.email,
        invoiceNumber,
        creditAmount: purchase.creditAmount,
        pricePerCredit: purchase.pricePerCredit,
        totalAmount: purchase.priceUSD,
        paypalOrderId: orderId,
        purchaseDate: new Date()
      });

      await prisma.creditPurchase.update({
        where: { id: purchase.id },
        data: { invoiceSentAt: new Date() }
      });
    } catch (emailError) {
      console.error('Error sending invoice email:', emailError);
      // No fallar si el email no se envía
    }

    return NextResponse.json({
      success: true,
      creditAmount: purchase.creditAmount,
      newBalance,
      invoiceNumber
    });
  } catch (error) {
    console.error('Error capturing payment:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
