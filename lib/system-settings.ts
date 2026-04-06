import { prisma } from '@/lib/db';

export const SYSTEM_SETTING_DEFAULTS = {
  defaultUserActive: 'true',
  defaultCredits: '100',
  creditsPerEvaluation: '2',
  creditPurchasesEnabled: 'true',
  signupEnabled: 'true',
  passwordMinLength: '8',
  loginMaxAttempts: '5',
  loginLockoutMinutes: '15',
  technicalEvaluationExpiryDays: '30',
  allowExternalPdfExport: 'true',
  auditRetentionDays: '180',
} as const;

export const SYSTEM_SETTING_DESCRIPTIONS: Record<string, string> = {
  defaultUserActive: 'Define si los nuevos usuarios registrados quedan activos automáticamente',
  defaultCredits: 'Créditos iniciales que reciben los nuevos usuarios al registrarse',
  creditsPerEvaluation: 'Créditos que se descuentan al enviar cada evaluación',
  creditPurchasesEnabled: 'Activa o desactiva la compra de créditos desde la tienda pública',
  signupEnabled: 'Permite o bloquea el registro de nuevos usuarios',
  passwordMinLength: 'Longitud mínima requerida para contraseñas nuevas y cambios de contraseña',
  loginMaxAttempts: 'Cantidad máxima de intentos fallidos antes de bloquear temporalmente una cuenta',
  loginLockoutMinutes: 'Tiempo de bloqueo en minutos después de superar el límite de intentos',
  technicalEvaluationExpiryDays: 'Días de vigencia por defecto para evaluaciones técnicas enviadas',
  allowExternalPdfExport: 'Permite descargar reportes PDF desde evaluaciones externas y técnicas',
  auditRetentionDays: 'Días de retención sugeridos para registros de auditoría',
};

export const SECURITY_SETTINGS_KEYS = [
  'signupEnabled',
  'creditPurchasesEnabled',
  'defaultUserActive',
  'passwordMinLength',
  'loginMaxAttempts',
  'loginLockoutMinutes',
  'technicalEvaluationExpiryDays',
  'allowExternalPdfExport',
  'auditRetentionDays',
] as const;

export type SystemSettingKey = keyof typeof SYSTEM_SETTING_DEFAULTS;

export async function getSystemSettingsMap(keys: string[] = Object.keys(SYSTEM_SETTING_DEFAULTS)) {
  const settings = await prisma.systemSettings.findMany({
    where: {
      key: {
        in: keys,
      },
    },
  });

  const settingsMap: Record<string, string> = { ...SYSTEM_SETTING_DEFAULTS };
  settings.forEach((setting) => {
    settingsMap[setting.key] = setting.value;
  });

  return settingsMap;
}

export function getBooleanSetting(
  settings: Record<string, string>,
  key: string,
  defaultValue = true
) {
  const value = settings[key];
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return value === 'true';
}

export function getNumberSetting(
  settings: Record<string, string>,
  key: string,
  defaultValue: number,
  min?: number,
  max?: number
) {
  const parsed = parseInt(settings[key] || String(defaultValue), 10);
  if (Number.isNaN(parsed)) {
    return defaultValue;
  }
  const safeMin = typeof min === 'number' ? min : Number.NEGATIVE_INFINITY;
  const safeMax = typeof max === 'number' ? max : Number.POSITIVE_INFINITY;
  return Math.min(Math.max(parsed, safeMin), safeMax);
}

export function normalizeSettingValue(key: string, value: unknown) {
  if (key in SYSTEM_SETTING_DEFAULTS) {
    if (typeof SYSTEM_SETTING_DEFAULTS[key as SystemSettingKey] === 'string') {
      if (key === 'defaultUserActive' || key === 'signupEnabled' || key === 'allowExternalPdfExport' || key === 'creditPurchasesEnabled') {
        return value === true || value === 'true' ? 'true' : 'false';
      }
    }
  }

  if (
    key === 'defaultCredits' ||
    key === 'creditsPerEvaluation' ||
    key === 'passwordMinLength' ||
    key === 'loginMaxAttempts' ||
    key === 'loginLockoutMinutes' ||
    key === 'technicalEvaluationExpiryDays' ||
    key === 'auditRetentionDays'
  ) {
    const parsed = Number.parseInt(String(value), 10);
    if (Number.isNaN(parsed)) {
      throw new Error(`Valor numérico inválido para ${key}`);
    }
    return String(parsed);
  }

  return String(value);
}
