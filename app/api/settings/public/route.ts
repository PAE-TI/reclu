import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// GET: Obtener configuración pública (para signup)
export async function GET(request: NextRequest) {
  try {
    const setting = await prisma.systemSettings.findUnique({
      where: { key: 'defaultUserActive' }
    });

    return NextResponse.json({ 
      defaultUserActive: setting?.value === 'true' || setting === null 
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json({ defaultUserActive: true });
  }
}
