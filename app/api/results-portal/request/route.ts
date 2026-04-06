import { NextRequest, NextResponse } from 'next/server';
import {
  normalizePortalEmail,
  setPortalSessionCookie,
} from '@/lib/results-portal';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim() : '';

    if (!email) {
      return NextResponse.json({ error: 'El correo es requerido' }, { status: 400 });
    }

    const normalizedEmail = normalizePortalEmail(email);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Ingresa un correo válido' }, { status: 400 });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Acceso concedido',
      email: normalizedEmail,
    });

    setPortalSessionCookie(response, normalizedEmail);
    return response;
  } catch (error) {
    console.error('Error creating results portal access:', error);
    return NextResponse.json(
      { error: 'No se pudo preparar el acceso al portal' },
      { status: 500 }
    );
  }
}
