import { NextRequest, NextResponse } from 'next/server';
import { createSecurityHeaders, isSafeMethod, isSameOriginRequest } from './lib/security';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const headers = createSecurityHeaders(request.nextUrl.pathname.startsWith('/api/'));

  headers.forEach((value, key) => {
    response.headers.set(key, value);
  });

  if (request.nextUrl.pathname.startsWith('/api/') && !isSafeMethod(request.method)) {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json(
        { error: 'Origen inválido' },
        { status: 403, headers }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
