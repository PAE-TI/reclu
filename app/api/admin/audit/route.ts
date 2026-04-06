import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listRecentAdminAuditLogs } from '@/lib/admin-audit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const limit = Number.parseInt(request.nextUrl.searchParams.get('limit') || '10', 10);
    const logs = await listRecentAdminAuditLogs(Number.isNaN(limit) ? 10 : limit);

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching admin audit logs:', error);
    return NextResponse.json({ error: 'Error al obtener auditoría' }, { status: 500 });
  }
}
