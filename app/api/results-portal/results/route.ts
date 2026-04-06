import { NextRequest, NextResponse } from 'next/server';
import { getPortalEvaluationsByEmail, getPortalEmailFromRequest } from '@/lib/results-portal';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const email = getPortalEmailFromRequest(request);
    if (!email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const evaluations = await getPortalEvaluationsByEmail(email);
    const counts = evaluations.reduce(
      (acc, evaluation) => {
        acc.total += 1;
        acc[evaluation.status.toLowerCase() as 'pending' | 'completed' | 'expired'] =
          (acc[evaluation.status.toLowerCase() as 'pending' | 'completed' | 'expired'] || 0) + 1;
        return acc;
      },
      { total: 0, pending: 0, completed: 0, expired: 0 }
    );

    return NextResponse.json({
      email,
      counts,
      evaluations,
    });
  } catch (error) {
    console.error('Error fetching portal results:', error);
    return NextResponse.json(
      { error: 'No se pudieron cargar los resultados' },
      { status: 500 }
    );
  }
}
