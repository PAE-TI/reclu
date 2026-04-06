import { prisma } from '@/lib/db';

export const PAYMENT_SETTING_KEYS = [
  'credit_price_usd',
  'credit_purchases_enabled',
  'min_credits_purchase',
  'max_credits_purchase',
  'paypal_client_id',
  'paypal_client_secret',
  'paypal_mode',
  'paypal_enabled',
  'stripe_secret_key',
  'stripe_mode',
  'stripe_enabled',
] as const;

export type PaymentSettingsMap = {
  creditPriceUSD: number;
  creditPurchasesEnabled: boolean;
  minCredits: number;
  maxCredits: number;
  paypalClientId: string;
  paypalClientSecretConfigured: boolean;
  paypalMode: 'sandbox' | 'live';
  paypalEnabled: boolean;
  stripeSecretKeyConfigured: boolean;
  stripeMode: 'test' | 'live';
  stripeEnabled: boolean;
};

export async function getPaymentSettingsMap(): Promise<PaymentSettingsMap> {
  const settings = await prisma.systemSettings.findMany({
    where: {
      key: {
        in: [...PAYMENT_SETTING_KEYS],
      },
    },
  });

  const settingsMap: Record<string, string> = {};
  settings.forEach(setting => {
    settingsMap[setting.key] = setting.value;
  });

  return {
    creditPriceUSD: parseFloat(settingsMap.credit_price_usd || '0.10'),
    creditPurchasesEnabled: settingsMap.credit_purchases_enabled ? settingsMap.credit_purchases_enabled === 'true' : true,
    minCredits: parseInt(settingsMap.min_credits_purchase || '10', 10),
    maxCredits: parseInt(settingsMap.max_credits_purchase || '1000', 10),
    paypalClientId: settingsMap.paypal_client_id || '',
    paypalClientSecretConfigured: Boolean(settingsMap.paypal_client_secret),
    paypalMode: settingsMap.paypal_mode === 'live' ? 'live' : 'sandbox',
    paypalEnabled: settingsMap.paypal_enabled ? settingsMap.paypal_enabled === 'true' : true,
    stripeSecretKeyConfigured: Boolean(settingsMap.stripe_secret_key),
    stripeMode: settingsMap.stripe_mode === 'live' ? 'live' : 'test',
    stripeEnabled: settingsMap.stripe_enabled === 'true',
  };
}
