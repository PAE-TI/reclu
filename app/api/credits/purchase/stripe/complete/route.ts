import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendPurchaseInvoiceEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const sessionId = body.sessionId || body.session_id;

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId requerido' }, { status: 400 });
    }

    const stripeSecretSetting = await prisma.systemSettings.findUnique({
      where: { key: 'stripe_secret_key' },
      select: { value: true },
    });

    if (!stripeSecretSetting?.value) {
      return NextResponse.json({ error: 'Stripe no está configurado' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretSetting.value);
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    if (!checkoutSession) {
      return NextResponse.json({ error: 'Sesión de Stripe no encontrada' }, { status: 404 });
    }

    const purchase = await prisma.creditPurchase.findUnique({
      where: { stripeCheckoutSessionId: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
            credits: true,
          },
        },
      },
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
        creditAmount: purchase.creditAmount,
        newBalance: purchase.user.credits,
        invoiceNumber: purchase.invoiceNumber,
        paymentProvider: 'STRIPE',
      });
    }

    if (checkoutSession.payment_status !== 'paid') {
      await prisma.creditPurchase.update({
        where: { id: purchase.id },
        data: {
          status: 'FAILED',
          errorMessage: `Estado de Stripe: ${checkoutSession.payment_status || checkoutSession.status}`,
        },
      });

      return NextResponse.json(
        { error: `Pago no completado. Estado: ${checkoutSession.payment_status || checkoutSession.status}` },
        { status: 400 }
      );
    }

    const paymentIntentId =
      typeof checkoutSession.payment_intent === 'string'
        ? checkoutSession.payment_intent
        : checkoutSession.payment_intent?.id || null;
    const customerId = typeof checkoutSession.customer === 'string' ? checkoutSession.customer : checkoutSession.customer?.id || null;
    const invoiceNumber = `INV-${Date.now()}-${purchase.id.slice(-6).toUpperCase()}`;
    const newBalance = purchase.user.credits + purchase.creditAmount;

    await prisma.$transaction([
      prisma.creditPurchase.update({
        where: { id: purchase.id },
        data: {
          status: 'COMPLETED',
          stripePaymentIntentId: paymentIntentId,
          stripeCustomerId: customerId,
          completedAt: new Date(),
          invoiceNumber,
        },
      }),
      prisma.user.update({
        where: { id: purchase.userId },
        data: { credits: newBalance },
      }),
      prisma.creditTransaction.create({
        data: {
          userId: purchase.userId,
          amount: purchase.creditAmount,
          type: 'PURCHASE',
          description: `Compra de ${purchase.creditAmount} créditos vía Stripe (${invoiceNumber})`,
          balanceAfter: newBalance,
        },
      }),
    ]);

    try {
      await sendPurchaseInvoiceEmail({
        to: purchase.user.email,
        userName: purchase.user.firstName || purchase.user.email,
        invoiceNumber,
        creditAmount: purchase.creditAmount,
        pricePerCredit: purchase.pricePerCredit,
        totalAmount: purchase.priceUSD,
        paymentProvider: 'Stripe',
        paymentReference: paymentIntentId || sessionId,
        purchaseDate: new Date(),
      });

      await prisma.creditPurchase.update({
        where: { id: purchase.id },
        data: { invoiceSentAt: new Date() },
      });
    } catch (emailError) {
      console.error('Error sending Stripe invoice email:', emailError);
    }

    return NextResponse.json({
      success: true,
      creditAmount: purchase.creditAmount,
      newBalance,
      invoiceNumber,
      paymentProvider: 'STRIPE',
    });
  } catch (error) {
    console.error('Error completing Stripe payment:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
