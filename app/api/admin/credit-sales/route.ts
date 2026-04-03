import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - Obtener todas las ventas de créditos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    const [purchases, total] = await Promise.all([
      prisma.creditPurchase.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              company: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.creditPurchase.count({ where })
    ]);

    // Estadísticas generales
    const stats = await prisma.creditPurchase.aggregate({
      _sum: {
        priceUSD: true,
        creditAmount: true
      },
      _count: true,
      where: { status: 'COMPLETED' }
    });

    return NextResponse.json({
      purchases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        totalRevenue: stats._sum.priceUSD || 0,
        totalCredits: stats._sum.creditAmount || 0,
        totalSales: stats._count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching credit sales:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
