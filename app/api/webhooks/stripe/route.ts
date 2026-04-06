import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { resolveStripeCheckoutSession, verifyStripeWebhookSignature } from '@/lib/stripe-purchase';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const verified = await verifyStripeWebhookSignature(request);

    if (verified.error || !verified.event) {
      return NextResponse.json({ error: verified.error || 'Webhook inválido' }, { status: 400 });
    }

    const event = verified.event;

    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        await resolveStripeCheckoutSession(checkoutSession, {
          source: 'webhook',
          eventType: event.type,
        });
        break;
      }
      case 'checkout.session.expired': {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        await resolveStripeCheckoutSession(checkoutSession, {
          source: 'webhook',
          markFailure: true,
          eventType: event.type,
        });
        break;
      }
      case 'checkout.session.async_payment_failed': {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        await resolveStripeCheckoutSession(checkoutSession, {
          source: 'webhook',
          markFailure: true,
          eventType: event.type,
        });
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
