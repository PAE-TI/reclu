import { NextRequest, NextResponse } from 'next/server';
import { clearPortalSessionCookie } from '@/lib/results-portal';

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest) {
  const response = NextResponse.json({ success: true });
  clearPortalSessionCookie(response);
  return response;
}
