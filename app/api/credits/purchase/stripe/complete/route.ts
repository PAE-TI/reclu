import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { resolveStripeCheckoutSessionById } from '@/lib/stripe-purchase';

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

    const resolution = await resolveStripeCheckoutSessionById(sessionId, {
      requireUserId: session.user.id,
      markFailure: true,
    });

    if (resolution.state === 'completed') {
      return NextResponse.json({
        success: true,
        creditAmount: resolution.creditAmount,
        newBalance: resolution.newBalance,
        invoiceNumber: resolution.invoiceNumber,
        paymentProvider: 'STRIPE',
      });
    }

    if (resolution.state === 'pending') {
      return NextResponse.json(
        {
          processing: true,
          message: resolution.message,
        },
        { status: 202 }
      );
    }

    if (resolution.state === 'cancelled') {
      return NextResponse.json({ error: resolution.message }, { status: 400 });
    }

    if (resolution.state === 'not_found') {
      return NextResponse.json({ error: resolution.message }, { status: 404 });
    }

    return NextResponse.json({ error: resolution.message }, { status: 400 });
  } catch (error) {
    console.error('Error completing Stripe payment:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
