import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getPaymentSettingsMap } from '@/lib/payment-settings';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, ownerId: true, email: true, name: true, firstName: true, lastName: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (user.ownerId) {
      return NextResponse.json(
        { error: 'Solo el usuario principal de la cuenta puede comprar créditos' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const creditAmount = Number.parseInt(String(body.creditAmount || ''), 10);

    const settings = await getPaymentSettingsMap();
    const stripeSecretSetting = await prisma.systemSettings.findUnique({
      where: { key: 'stripe_secret_key' },
      select: { value: true },
    });

    if (!settings.creditPurchasesEnabled || !settings.stripeEnabled || !settings.stripeSecretKeyConfigured || !stripeSecretSetting?.value) {
      return NextResponse.json({ error: 'Stripe no está habilitado o configurado' }, { status: 400 });
    }

    if (!creditAmount || creditAmount < settings.minCredits || creditAmount > settings.maxCredits) {
      return NextResponse.json(
        { error: `La cantidad debe estar entre ${settings.minCredits} y ${settings.maxCredits} créditos` },
        { status: 400 }
      );
    }

    const pricePerCredit = settings.creditPriceUSD;
    const totalPrice = Number((creditAmount * pricePerCredit).toFixed(2));
    const origin = request.headers.get('origin') || new URL(request.url).origin;
    const stripe = new Stripe(stripeSecretSetting.value);

    const purchase = await prisma.creditPurchase.create({
      data: {
        userId: user.id,
        creditAmount,
        priceUSD: totalPrice,
        pricePerCredit,
        paymentProvider: 'STRIPE',
        status: 'PENDING',
      },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${origin}/credits/purchase?stripe_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/credits/purchase?stripe_cancelled=true`,
      customer_email: user.email,
      client_reference_id: purchase.id,
      metadata: {
        purchaseId: purchase.id,
        userId: user.id,
        creditAmount: String(creditAmount),
      },
      line_items: [
        {
          quantity: creditAmount,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(pricePerCredit * 100),
            product_data: {
              name: `${creditAmount} créditos Reclu`,
              description: `${creditAmount} créditos para compra de evaluaciones`,
            },
          },
        },
      ],
    });

    await prisma.creditPurchase.update({
      where: { id: purchase.id },
      data: {
        stripeCheckoutSessionId: checkoutSession.id,
      },
    });

    return NextResponse.json({
      success: true,
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
      purchaseId: purchase.id,
    });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
