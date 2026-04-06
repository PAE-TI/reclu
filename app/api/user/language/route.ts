import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { language: true },
    });

    return NextResponse.json({ language: user?.language || 'es' });
  } catch (error) {
    console.error('Error fetching language:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestUrl = new URL(request.url);
    const origin = request.headers.get('origin') || request.headers.get('referer');
    if (!origin) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    try {
      if (new URL(origin).origin !== requestUrl.origin) {
        return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    const { language } = await request.json();
    
    if (!language || !['es', 'en'].includes(language)) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { language },
    });

    return NextResponse.json({ success: true, language });
  } catch (error) {
    console.error('Error updating language:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
