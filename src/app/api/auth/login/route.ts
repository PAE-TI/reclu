import { NextResponse } from "next/server";

import { findUserByEmail } from "@/lib/auth-store";
import { createSessionToken, getSessionCookieOptions } from "@/lib/auth-session";
import { verifyPassword } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Correo y contrasena son obligatorios." }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Credenciales invalidas." }, { status: 401 });
    }

    const validPassword = await verifyPassword(password, user.password_hash);
    if (!validPassword) {
      return NextResponse.json({ error: "Credenciales invalidas." }, { status: 401 });
    }

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
    });
    const cookieConfig = getSessionCookieOptions();

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        companyName: user.company_name,
      },
    });
    response.cookies.set(cookieConfig.name, token, cookieConfig.options);
    return response;
  } catch (error) {
    console.error("login error", error);
    return NextResponse.json({ error: "No se pudo iniciar sesion." }, { status: 500 });
  }
}
