import { NextResponse } from "next/server";

import { createUser, findUserByEmail } from "@/lib/auth-store";
import { createSessionToken, getSessionCookieOptions } from "@/lib/auth-session";
import { hashPassword } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      companyName?: string;
      email?: string;
      password?: string;
    };

    const fullName = body.fullName?.trim() ?? "";
    const companyName = body.companyName?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!fullName || !companyName || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son obligatorios." }, { status: 400 });
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Correo electronico invalido." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "La contrasena debe tener al menos 8 caracteres." }, { status: 400 });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "Este correo ya esta registrado." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const createdUser = await createUser({
      email,
      fullName,
      companyName,
      passwordHash,
    });

    const token = createSessionToken({
      userId: createdUser.id,
      email: createdUser.email,
    });
    const cookieConfig = getSessionCookieOptions();

    const response = NextResponse.json({
      ok: true,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        fullName: createdUser.full_name,
        companyName: createdUser.company_name,
      },
    });
    response.cookies.set(cookieConfig.name, token, cookieConfig.options);
    return response;
  } catch (error) {
    console.error("register error", error);
    return NextResponse.json({ error: "No se pudo completar el registro." }, { status: 500 });
  }
}
