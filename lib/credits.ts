import { prisma } from './db';
import { EvaluationType } from '@prisma/client';
import { 
  createCreditsZeroNotification, 
  createCreditsLowNotification, 
  LOW_CREDITS_THRESHOLD 
} from './notifications';

// Obtener el userId del propietario de los créditos (owner o el mismo usuario si no es facilitador)
export async function getCreditOwnerId(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { ownerId: true }
  });
  
  // Si el usuario tiene un ownerId, es un facilitador y debe usar los créditos del owner
  return user?.ownerId || userId;
}

// Obtener información del propietario de los créditos para un usuario
export async function getCreditOwnerInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      id: true,
      ownerId: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          credits: true
        }
      }
    }
  });
  
  if (user?.ownerId && user?.owner) {
    return {
      isFacilitator: true,
      creditOwnerId: user.owner.id,
      creditOwnerName: user.owner.name || user.owner.email,
      company: user.owner.company,
      credits: user.owner.credits
    };
  }
  
  // Es el propietario, obtener sus propios datos
  const selfData = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, company: true, name: true, email: true }
  });
  
  return {
    isFacilitator: false,
    creditOwnerId: userId,
    creditOwnerName: selfData?.name || selfData?.email,
    company: selfData?.company,
    credits: selfData?.credits || 0
  };
}

// Obtener configuración de créditos
export async function getCreditSettings() {
  const settings = await prisma.systemSettings.findMany({
    where: {
      key: {
        in: ['defaultCredits', 'creditsPerEvaluation']
      }
    }
  });

  const settingsMap: Record<string, string> = {};
  settings.forEach(s => settingsMap[s.key] = s.value);

  return {
    defaultCredits: parseInt(settingsMap['defaultCredits'] || '100'),
    creditsPerEvaluation: parseInt(settingsMap['creditsPerEvaluation'] || '2')
  };
}

// Verificar si usuario tiene suficientes créditos (usa créditos del owner si es facilitador)
export async function hasEnoughCredits(userId: string, amount: number): Promise<boolean> {
  const creditOwnerId = await getCreditOwnerId(userId);
  const user = await prisma.user.findUnique({
    where: { id: creditOwnerId },
    select: { credits: true }
  });
  return (user?.credits || 0) >= amount;
}

// Descontar créditos por enviar evaluación (usa créditos del owner si es facilitador)
export async function deductCreditsForEvaluation(
  userId: string,
  evaluationType: EvaluationType,
  evaluationId: string,
  recipientName: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  const settings = await getCreditSettings();
  const amount = settings.creditsPerEvaluation;

  // Obtener el propietario de los créditos (owner si es facilitador)
  const creditOwnerId = await getCreditOwnerId(userId);
  
  // Obtener info del usuario que envía (para la descripción)
  const sender = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true }
  });
  const senderName = sender?.name || sender?.email || 'Usuario';
  
  // Verificar créditos del propietario
  const creditOwner = await prisma.user.findUnique({
    where: { id: creditOwnerId },
    select: { credits: true }
  });

  if (!creditOwner || creditOwner.credits < amount) {
    return { 
      success: false, 
      error: `Créditos insuficientes. Necesitas ${amount} créditos. ${userId !== creditOwnerId ? 'La empresa tiene' : 'Tienes'} ${creditOwner?.credits || 0}.` 
    };
  }

  const previousBalance = creditOwner.credits;
  const newBalance = creditOwner.credits - amount;

  const evaluationNames: Record<string, string> = {
    'DISC': 'DISC',
    'DRIVING_FORCES': 'Fuerzas Motivadoras',
    'EQ': 'Inteligencia Emocional',
    'DNA': 'DNA-25',
    'ACUMEN': 'Acumen (ACI)',
    'VALUES': 'Valores e Integridad',
    'STRESS': 'Estrés y Resiliencia'
  };

  // Descripción incluye quién envió si es facilitador
  const description = userId !== creditOwnerId
    ? `${senderName} envió evaluación ${evaluationNames[evaluationType] || evaluationType} a ${recipientName}`
    : `Evaluación ${evaluationNames[evaluationType] || evaluationType} enviada a ${recipientName}`;

  await prisma.$transaction([
    prisma.creditTransaction.create({
      data: {
        userId: creditOwnerId, // El transaction se registra en el owner
        amount: -amount,
        type: 'EVALUATION_SENT',
        description,
        evaluationType,
        evaluationId,
        balanceAfter: newBalance,
        createdBy: userId !== creditOwnerId ? userId : undefined // Registrar quién lo creó si es facilitador
      }
    }),
    prisma.user.update({
      where: { id: creditOwnerId },
      data: { credits: newBalance }
    })
  ]);

  // Crear notificaciones según el nuevo saldo (notificar al owner)
  try {
    if (newBalance === 0) {
      await createCreditsZeroNotification(creditOwnerId);
    } else if (newBalance <= LOW_CREDITS_THRESHOLD && previousBalance > LOW_CREDITS_THRESHOLD) {
      await createCreditsLowNotification(creditOwnerId, newBalance);
    }
  } catch (notifError) {
    console.error('Error creating credit notification:', notifError);
  }

  return { success: true, newBalance };
}

// Dar créditos iniciales a nuevo usuario
export async function giveInitialCredits(userId: string): Promise<number> {
  const settings = await getCreditSettings();
  const amount = settings.defaultCredits;

  await prisma.$transaction([
    prisma.creditTransaction.create({
      data: {
        userId,
        amount,
        type: 'INITIAL',
        description: 'Créditos iniciales de bienvenida',
        balanceAfter: amount
      }
    }),
    prisma.user.update({
      where: { id: userId },
      data: { credits: amount }
    })
  ]);

  return amount;
}
