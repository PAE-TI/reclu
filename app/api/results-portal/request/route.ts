import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { prisma } from '@/lib/db';
import {
  buildResultsPortalLink,
  createPortalAccessCode,
  normalizePortalEmail,
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

    const access = await createPortalAccessCode(normalizedEmail);
    const accessLink = buildResultsPortalLink(normalizedEmail, access.rawCode);
    const subjectData = emailService.generateResultsPortalAccessEmail(
      normalizedEmail,
      access.code,
      accessLink,
      access.expiresInMinutes
    );

    const sent = await emailService.sendEmail({
      to: normalizedEmail,
      subject: subjectData.subject,
      html: subjectData.html,
      text: subjectData.text,
    });

    if (!sent) {
      await prisma.verificationToken.deleteMany({
        where: { identifier: normalizedEmail },
      });
      return NextResponse.json(
        { error: 'No se pudo enviar el correo de acceso' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Te enviamos un código de acceso y un enlace directo a tu correo.',
      email: normalizedEmail,
    });
  } catch (error) {
    console.error('Error creating results portal access:', error);
    return NextResponse.json(
      { error: 'No se pudo preparar el acceso al portal' },
      { status: 500 }
    );
  }
}
