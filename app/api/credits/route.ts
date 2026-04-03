import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCreditOwnerInfo, getCreditSettings } from '@/lib/credits';

export const dynamic = "force-dynamic";

// GET: Obtener créditos del usuario actual (o del owner si es facilitador)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener información de créditos (del owner si es facilitador)
    const creditInfo = await getCreditOwnerInfo(session.user.id);
    
    // Obtener configuración de créditos
    const settings = await getCreditSettings();

    return NextResponse.json({ 
      credits: creditInfo.credits,
      isFacilitator: creditInfo.isFacilitator,
      creditOwnerName: creditInfo.creditOwnerName,
      company: creditInfo.company,
      creditsPerEvaluation: settings.creditsPerEvaluation
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json(
      { error: 'Error al obtener créditos' },
      { status: 500 }
    );
  }
}
