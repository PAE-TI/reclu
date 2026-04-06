import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { sendPurchaseInvoiceEmail } from '@/lib/email';

type StripeCheckoutSession = Stripe.Checkout.Session;

export type StripePurchaseResolution =
  | {
      state: 'completed';
      creditAmount: number;
      newBalance: number;
      invoiceNumber: string;
      paymentProvider: 'STRIPE';
      paymentIntentId: string | null;
      customerId: string | null;
    }
  | {
      state: 'pending';
      message: string;
    }
  | {
      state: 'cancelled';
      message: string;
    }
  | {
      state: 'failed';
      message: string;
    }
  | {
      state: 'not_found';
      message: string;
    };

type ResolveOptions = {
  requireUserId?: string;
  source?: 'return' | 'webhook';
  markFailure?: boolean;
  eventType?: string;
};

type PurchaseWithUser = Awaited<ReturnType<typeof findStripePurchase>>;

async function getStripeSecretKey() {
  const stripeSecretSetting = await prisma.systemSettings.findUnique({
    where: { key: 'stripe_secret_key' },
    select: { value: true },
  });

  return stripeSecretSetting?.value || null;
}

async function getStripeWebhookSecret() {
  const stripeWebhookSetting = await prisma.systemSettings.findUnique({
    where: { key: 'stripe_webhook_secret' },
    select: { value: true },
  });

  return stripeWebhookSetting?.value || null;
}

async function findStripePurchase(checkoutSession: StripeCheckoutSession) {
  const purchaseId =
    checkoutSession.client_reference_id ||
    checkoutSession.metadata?.purchaseId ||
    null;

  return prisma.creditPurchase.findFirst({
    where: {
      OR: [
        { stripeCheckoutSessionId: checkoutSession.id },
        ...(purchaseId ? [{ id: purchaseId }] : []),
      ],
      paymentProvider: 'STRIPE',
    },
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
}

function buildSuccessResponse(purchase: NonNullable<PurchaseWithUser>) {
  return {
    state: 'completed' as const,
    creditAmount: purchase.creditAmount,
    newBalance: purchase.user.credits,
    invoiceNumber: purchase.invoiceNumber || '',
    paymentProvider: 'STRIPE' as const,
    paymentIntentId: purchase.stripePaymentIntentId || null,
    customerId: purchase.stripeCustomerId || null,
  };
}

function buildStatusMessage(checkoutSession: StripeCheckoutSession) {
  if (checkoutSession.status === 'expired') {
    return 'La sesión de Stripe expiró. Puedes iniciar una nueva compra.';
  }

  if (checkoutSession.status === 'complete' && checkoutSession.payment_status !== 'paid') {
    return 'Stripe está procesando el pago. En breve se confirmará automáticamente.';
  }

  return 'El pago todavía está en proceso. Espera unos segundos.';
}

async function finalizePurchase(
  checkoutSession: StripeCheckoutSession,
  purchase: NonNullable<PurchaseWithUser>
) {
  const paymentIntentId =
    typeof checkoutSession.payment_intent === 'string'
      ? checkoutSession.payment_intent
      : checkoutSession.payment_intent?.id || null;

  const customerId =
    typeof checkoutSession.customer === 'string'
      ? checkoutSession.customer
      : checkoutSession.customer?.id || null;

  const invoiceNumber = purchase.invoiceNumber || `INV-${Date.now()}-${purchase.id.slice(-6).toUpperCase()}`;

  const result = await prisma.$transaction(async (tx) => {
    const claim = await tx.creditPurchase.updateMany({
      where: {
        id: purchase.id,
        paymentProvider: 'STRIPE',
        status: 'PENDING',
      },
      data: {
        status: 'COMPLETED',
        stripePaymentIntentId: paymentIntentId,
        stripeCustomerId: customerId,
        completedAt: new Date(),
        invoiceNumber,
        errorMessage: null,
      },
    });

    if (claim.count === 0) {
      const alreadyCompleted = await tx.creditPurchase.findUnique({
        where: { id: purchase.id },
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

      return {
        alreadyCompleted: true,
        purchase: alreadyCompleted,
      };
    }

    const updatedUser = await tx.user.update({
      where: { id: purchase.userId },
      data: {
        credits: {
          increment: purchase.creditAmount,
        },
      },
      select: {
        credits: true,
      },
    });

    await tx.creditTransaction.create({
      data: {
        userId: purchase.userId,
        amount: purchase.creditAmount,
        type: 'PURCHASE',
        description: `Compra de ${purchase.creditAmount} créditos vía Stripe (${invoiceNumber})`,
        balanceAfter: updatedUser.credits,
      },
    });

    const completedPurchase = await tx.creditPurchase.findUnique({
      where: { id: purchase.id },
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

    return {
      alreadyCompleted: false,
      purchase: completedPurchase,
    };
  });

  const finalPurchase = result.purchase;
  if (!finalPurchase) {
    throw new Error('No se pudo completar la compra');
  }

  if (!result.alreadyCompleted) {
    try {
      await sendPurchaseInvoiceEmail({
        to: finalPurchase.user.email,
        userName: finalPurchase.user.firstName || finalPurchase.user.email,
        invoiceNumber,
        creditAmount: finalPurchase.creditAmount,
        pricePerCredit: finalPurchase.pricePerCredit,
        totalAmount: finalPurchase.priceUSD,
        paymentProvider: 'Stripe',
        paymentReference: paymentIntentId || checkoutSession.id,
        purchaseDate: new Date(),
      });

      await prisma.creditPurchase.update({
        where: { id: finalPurchase.id },
        data: { invoiceSentAt: new Date() },
      });
    } catch (emailError) {
      console.error('Error sending Stripe invoice email:', emailError);
    }
  }

  return buildSuccessResponse(finalPurchase);
}

async function markCancelledOrFailed(
  purchase: NonNullable<PurchaseWithUser>,
  status: 'CANCELLED' | 'FAILED',
  message: string
) {
  await prisma.creditPurchase.updateMany({
    where: {
      id: purchase.id,
      paymentProvider: 'STRIPE',
      status: 'PENDING',
    },
    data: {
      status,
      errorMessage: message,
    },
  });
}

export async function resolveStripeCheckoutSession(
  checkoutSession: StripeCheckoutSession,
  options: ResolveOptions = {}
): Promise<StripePurchaseResolution> {
  const stripeSecret = await getStripeSecretKey();
  if (!stripeSecret) {
    return { state: 'failed', message: 'Stripe no está configurado' };
  }
  const purchase = await findStripePurchase(checkoutSession);

  if (!purchase) {
    return { state: 'not_found', message: 'Compra no encontrada' };
  }

  if (options.requireUserId && purchase.userId !== options.requireUserId) {
    return { state: 'failed', message: 'No autorizado' };
  }

  if (purchase.status === 'COMPLETED') {
    return buildSuccessResponse(purchase);
  }

  if (options.eventType === 'checkout.session.async_payment_failed') {
    await markCancelledOrFailed(
      purchase,
      'FAILED',
      'Stripe no pudo completar el pago asincrónico.'
    );
    return {
      state: 'failed',
      message: 'Stripe no pudo completar el pago asincrónico.',
    };
  }

  if (checkoutSession.status === 'expired') {
    await markCancelledOrFailed(purchase, 'CANCELLED', buildStatusMessage(checkoutSession));
    return { state: 'cancelled', message: buildStatusMessage(checkoutSession) };
  }

  if (checkoutSession.payment_status !== 'paid') {
    if (checkoutSession.status === 'complete' || checkoutSession.status === 'open') {
      return {
        state: 'pending',
        message: buildStatusMessage(checkoutSession),
      };
    }

    if (options.markFailure) {
      await markCancelledOrFailed(purchase, 'FAILED', buildStatusMessage(checkoutSession));
      return { state: 'failed', message: buildStatusMessage(checkoutSession) };
    }

    return {
      state: 'pending',
      message: buildStatusMessage(checkoutSession),
    };
  }

  return finalizePurchase(checkoutSession, purchase);
}

export async function resolveStripeCheckoutSessionById(
  sessionId: string,
  options: ResolveOptions = {}
): Promise<StripePurchaseResolution> {
  const stripeSecret = await getStripeSecretKey();
  if (!stripeSecret) {
    return { state: 'failed', message: 'Stripe no está configurado' };
  }

  const stripe = new Stripe(stripeSecret);
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent'],
  });

  if (!checkoutSession) {
    return { state: 'not_found', message: 'Sesión de Stripe no encontrada' };
  }

  return resolveStripeCheckoutSession(checkoutSession, options);
}

export async function verifyStripeWebhookSignature(request: Request) {
  const stripeSecret = await getStripeSecretKey();
  const webhookSecret = await getStripeWebhookSecret();

  if (!stripeSecret || !webhookSecret) {
    return { event: null, error: 'Stripe o webhook no están configurados' } as const;
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return { event: null, error: 'Falta la firma de Stripe' } as const;
  }

  const payload = await request.text();
  const stripe = new Stripe(stripeSecret);

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    return { event, error: null } as const;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Firma inválida';
    return { event: null, error: message } as const;
  }
}
