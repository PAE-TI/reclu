
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { themePreference: true },
    });

    return NextResponse.json({ themePreference: user?.themePreference || 'light' });
  } catch (error) {
    console.error('Error fetching theme preference:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { themePreference } = await request.json();

    if (!['light', 'dark', 'system'].includes(themePreference)) {
      return NextResponse.json({ error: 'Preferencia de tema inválida' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { themePreference },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving theme preference:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
