import { prisma } from '@/lib/db';

export type EvaluationType = 'DISC' | 'DRIVING_FORCES' | 'EQ' | 'DNA' | 'ACUMEN' | 'VALUES' | 'STRESS' | 'TECHNICAL';

const EVALUATION_NAMES: Record<EvaluationType, string> = {
  DISC: 'DISC',
  DRIVING_FORCES: 'Fuerzas Motivadoras',
  EQ: 'Inteligencia Emocional',
  DNA: 'DNA-25',
  ACUMEN: 'Acumen',
  VALUES: 'Valores e Integridad',
  STRESS: 'Estrés y Resiliencia',
  TECHNICAL: 'Evaluación Técnica',
};

export async function createEvaluationCompletedNotification(
  userId: string,
  evaluationType: EvaluationType,
  recipientName: string,
  recipientEmail: string,
  evaluationToken?: string
) {
  const evaluationName = EVALUATION_NAMES[evaluationType];
  
  return prisma.notification.create({
    data: {
      userId,
      type: 'EVALUATION_COMPLETED',
      title: `Evaluación ${evaluationName} completada`,
      message: `${recipientName} ha completado su evaluación de ${evaluationName}. Los resultados ya están disponibles en el panel de análisis.`,
      evaluationType,
      evaluationToken,
      recipientName,
      recipientEmail,
    },
  });
}

export async function createSystemNotification(
  userId: string,
  title: string,
  message: string
) {
  return prisma.notification.create({
    data: {
      userId,
      type: 'SYSTEM',
      title,
      message,
    },
  });
}

// Notificación de recarga de créditos
export async function createCreditRechargeNotification(
  userId: string,
  amount: number,
  newBalance: number
) {
  return prisma.notification.create({
    data: {
      userId,
      type: 'CREDIT_RECHARGE',
      title: '💰 Recarga de créditos recibida',
      message: `Se han añadido ${amount} créditos a tu cuenta. Tu nuevo saldo es de ${newBalance} créditos.`,
    },
  });
}

// Notificación de créditos en cero
export async function createCreditsZeroNotification(userId: string) {
  return prisma.notification.create({
    data: {
      userId,
      type: 'CREDITS_ZERO',
      title: '⚠️ Sin créditos disponibles',
      message: 'Tu cuenta se ha quedado sin créditos. Contacta con el administrador para recargar y poder seguir enviando evaluaciones.',
    },
  });
}

// Notificación de créditos bajos
export async function createCreditsLowNotification(
  userId: string,
  currentCredits: number
) {
  return prisma.notification.create({
    data: {
      userId,
      type: 'CREDITS_LOW',
      title: '⚠️ Créditos bajos',
      message: `Te quedan solo ${currentCredits} créditos. Considera solicitar una recarga pronto para no interrumpir tus evaluaciones.`,
    },
  });
}

// Umbral para considerar créditos bajos
export const LOW_CREDITS_THRESHOLD = 5;
