import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCreditSettings } from '@/lib/credits';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const settings = await getCreditSettings();

    return NextResponse.json({
      creditsPerEvaluation: settings.creditsPerEvaluation,
    });
  } catch (error) {
    console.error('Error fetching campaign settings:', error);
    return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 });
  }
}
