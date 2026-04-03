import { NextResponse } from "next/server";

import { findUserByEmail, savePasswordResetToken } from "@/lib/auth-store";
import { randomToken, sha256 } from "@/lib/security";

const RESET_WINDOW_MINUTES = 30;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase() ?? "";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Ingresa un correo valido." }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      // Respuesta neutra para no filtrar existencia de correos.
      return NextResponse.json({
        ok: true,
        message: "Si el correo existe, enviaremos instrucciones para restablecer la contrasena.",
      });
    }

    const rawToken = randomToken(24);
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(Date.now() + RESET_WINDOW_MINUTES * 60 * 1000);

    await savePasswordResetToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_PRODUCTION_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/reset-password?token=${rawToken}`;

    return NextResponse.json({
      ok: true,
      message: "Si el correo existe, enviaremos instrucciones para restablecer la contrasena.",
      resetUrl,
    });
  } catch (error) {
    console.error("forgot-password error", error);
    return NextResponse.json({ error: "No se pudo procesar la solicitud." }, { status: 500 });
  }
}
