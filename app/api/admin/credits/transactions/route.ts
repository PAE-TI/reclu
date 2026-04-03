import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// GET: Obtener todas las transacciones (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    const where: any = {};
    if (userId) where.userId = userId;
    if (type) where.type = type;

    const transactions = await prisma.creditTransaction.findMany({
      where,
      include: {
        user: {
          select: { email: true, firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.creditTransaction.count({ where });

    // Estadísticas generales
    const stats = await prisma.creditTransaction.groupBy({
      by: ['type'],
      _sum: { amount: true },
      _count: true
    });

    return NextResponse.json({ 
      transactions,
      total,
      pages: Math.ceil(total / limit),
      stats
    });
  } catch (error) {
    console.error('Error fetching admin transactions:', error);
    return NextResponse.json(
      { error: 'Error al obtener transacciones' },
      { status: 500 }
    );
  }
}
