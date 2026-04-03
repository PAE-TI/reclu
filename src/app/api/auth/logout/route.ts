import { NextResponse } from "next/server";

import { getSessionCookieOptions } from "@/lib/auth-session";

function buildLogoutResponse() {
  const response = NextResponse.json({ ok: true });
  const cookieConfig = getSessionCookieOptions();
  response.cookies.set(cookieConfig.name, "", {
    ...cookieConfig.options,
    maxAge: 0,
  });
  return response;
}

export async function POST() {
  return buildLogoutResponse();
}

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/auth/signin", request.url));
  const cookieConfig = getSessionCookieOptions();
  response.cookies.set(cookieConfig.name, "", {
    ...cookieConfig.options,
    maxAge: 0,
  });
  return response;
}
