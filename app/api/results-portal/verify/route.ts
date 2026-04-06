import { NextRequest, NextResponse } from 'next/server';
import {
  clearPortalSessionCookie,
  normalizePortalCode,
  normalizePortalEmail,
  setPortalSessionCookie,
  verifyPortalAccessCode,
} from '@/lib/results-portal';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const code = typeof body?.code === 'string' ? body.code.trim() : '';

    if (!email || !code) {
      return NextResponse.json({ error: 'Correo y código son requeridos' }, { status: 400 });
    }

    const normalizedEmail = normalizePortalEmail(email);
    const normalizedCode = normalizePortalCode(code);
    const isValid = await verifyPortalAccessCode(normalizedEmail, normalizedCode);

    if (!isValid) {
      return NextResponse.json(
        { error: 'El código no es válido o ya expiró' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      email: normalizedEmail,
    });

    clearPortalSessionCookie(response);
    setPortalSessionCookie(response, normalizedEmail);

    return response;
  } catch (error) {
    console.error('Error verifying results portal access:', error);
    return NextResponse.json(
      { error: 'No se pudo verificar el acceso' },
      { status: 500 }
    );
  }
}
