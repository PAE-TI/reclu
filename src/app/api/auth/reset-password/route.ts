import { NextResponse } from "next/server";

import { consumePasswordResetToken, updateUserPassword } from "@/lib/auth-store";
import { hashPassword, sha256 } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { token?: string; password?: string };
    const token = body.token?.trim() ?? "";
    const password = body.password ?? "";

    if (!token || !password) {
      return NextResponse.json({ error: "Token y contrasena son obligatorios." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "La contrasena debe tener al menos 8 caracteres." }, { status: 400 });
    }

    const tokenRecord = await consumePasswordResetToken(sha256(token));
    if (!tokenRecord) {
      return NextResponse.json({ error: "El enlace de recuperacion es invalido o expiro." }, { status: 400 });
    }

    const newHash = await hashPassword(password);
    await updateUserPassword(tokenRecord.user_id, newHash);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("reset-password error", error);
    return NextResponse.json({ error: "No se pudo actualizar la contrasena." }, { status: 500 });
  }
}
