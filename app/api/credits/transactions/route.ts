import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasFullTeamAccess } from '@/lib/team';
import { getCreditOwnerId } from '@/lib/credits';

export const dynamic = "force-dynamic";

// GET: Obtener historial de transacciones del usuario o equipo
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar si el usuario tiene acceso al historial de transacciones
    // Solo owners y facilitadores con FULL_ACCESS pueden ver el historial
    const hasAccess = await hasFullTeamAccess(session.user.id);
    
    if (!hasAccess) {
      return NextResponse.json({ 
        error: 'No tienes permiso para ver el historial de transacciones',
        accessDenied: true 
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Obtener el ID del propietario de créditos (owner)
    const creditOwnerId = await getCreditOwnerId(session.user.id);

    // Buscar transacciones del owner (no del facilitador)
    const transactions = await prisma.creditTransaction.findMany({
      where: { userId: creditOwnerId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });

    // Formatear transacciones con info del facilitador
    const formattedTransactions = transactions.map(tx => ({
      id: tx.id,
      amount: tx.amount,
      type: tx.type,
      description: tx.description,
      evaluationType: tx.evaluationType,
      balanceAfter: tx.balanceAfter,
      createdAt: tx.createdAt,
      createdBy: tx.createdBy,
      createdByUser: tx.createdByUser ? {
        id: tx.createdByUser.id,
        name: `${tx.createdByUser.firstName || ''} ${tx.createdByUser.lastName || ''}`.trim() || tx.createdByUser.email,
        email: tx.createdByUser.email,
      } : null
    }));

    const total = await prisma.creditTransaction.count({
      where: { userId: creditOwnerId }
    });

    return NextResponse.json({ 
      transactions: formattedTransactions,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Error al obtener transacciones' },
      { status: 500 }
    );
  }
}
