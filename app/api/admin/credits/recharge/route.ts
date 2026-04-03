import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createCreditRechargeNotification } from '@/lib/notifications';

export const dynamic = "force-dynamic";

// POST: Recargar créditos a un usuario (solo admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, amount, description } = body;

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'UserId y amount (positivo) son requeridos' },
        { status: 400 }
      );
    }

    // Obtener usuario y sus créditos actuales
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, credits: true, email: true, firstName: true, ownerId: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar que no sea un facilitador (los facilitadores usan créditos del dueño)
    if (user.ownerId !== null) {
      return NextResponse.json(
        { error: 'No se pueden recargar créditos a un facilitador. Los facilitadores usan los créditos del usuario principal que los invitó.' },
        { status: 400 }
      );
    }

    const newBalance = user.credits + amount;

    // Crear transacción y actualizar créditos
    const [transaction] = await prisma.$transaction([
      prisma.creditTransaction.create({
        data: {
          userId,
          amount,
          type: 'RECHARGE',
          description: description || `Recarga de ${amount} créditos por administrador`,
          balanceAfter: newBalance,
          createdBy: session.user.id
        }
      }),
      prisma.user.update({
        where: { id: userId },
        data: { credits: newBalance }
      })
    ]);

    // Crear notificación de recarga para el usuario
    try {
      await createCreditRechargeNotification(userId, amount, newBalance);
    } catch (notifError) {
      console.error('Error creating recharge notification:', notifError);
      // No fallar la operación si la notificación falla
    }

    return NextResponse.json({ 
      success: true, 
      newBalance,
      transaction 
    });
  } catch (error) {
    console.error('Error recharging credits:', error);
    return NextResponse.json(
      { error: 'Error al recargar créditos' },
      { status: 500 }
    );
  }
}
