'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Loader2, Shield, CheckCircle, XCircle, Eye, EyeOff, Save, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface StripeSettings {
  secretKeyMasked: string;
  secretKeyConfigured: boolean;
  webhookSecretMasked: string;
  webhookSecretConfigured: boolean;
  mode: 'test' | 'live';
  purchasesEnabled: boolean;
}

export function StripeSettingsCard() {
  const [settings, setSettings] = useState<StripeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const [secretKey, setSecretKey] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [mode, setMode] = useState<'test' | 'live'>('test');
  const [purchasesEnabled, setPurchasesEnabled] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/stripe-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        setMode(data.settings.mode || 'test');
        setPurchasesEnabled(data.settings.purchasesEnabled || false);
      }
    } catch (error) {
      console.error('Error fetching Stripe settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: string, successMsg: string) => {
    setSaving(key);
    try {
      const response = await fetch('/api/admin/stripe-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al guardar');
      }
      toast.success(successMsg);
      fetchSettings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <Card className="mb-8 border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
        </CardContent>
      </Card>
    );
  }

  const isStripeConfigured = Boolean(settings?.secretKeyConfigured);
  const isWebhookConfigured = Boolean(settings?.webhookSecretConfigured);

  return (
    <Card className="mb-8 border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-sky-600" />
            <span className="text-sky-900">Configuración de Stripe</span>
          </div>
          <Badge variant={isStripeConfigured ? 'default' : 'secondary'} className={isStripeConfigured ? 'bg-green-100 text-green-700' : ''}>
            {isStripeConfigured ? (
              <><CheckCircle className="w-3 h-3 mr-1" /> Configurado</>
            ) : (
              <><XCircle className="w-3 h-3 mr-1" /> No configurado</>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-sky-100">
          <div>
            <h4 className="font-medium text-gray-900">Compras de créditos con Stripe activas</h4>
            <p className="text-sm text-gray-600">
              {purchasesEnabled
                ? 'Los usuarios pueden comprar créditos con Stripe cuando la compra global esté activa.'
                : 'Stripe no aparecerá en el checkout hasta activarlo aquí.'}
            </p>
          </div>
          <Switch
            checked={purchasesEnabled}
            onCheckedChange={(checked) => {
              setPurchasesEnabled(checked);
              saveSetting('stripe_enabled', String(checked), checked ? 'Stripe habilitado' : 'Stripe deshabilitado');
            }}
            disabled={!isStripeConfigured || saving !== null}
            className="data-[state=checked]:bg-sky-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-600" />
              Credenciales de Stripe
            </h4>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Secret Key</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showSecret ? 'text' : 'password'}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder={settings?.secretKeyConfigured ? '•••••••• (ya configurada)' : 'sk_test_... / sk_live_...'}
                    className="font-mono text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    saveSetting('stripe_secret_key', secretKey, 'Secret Key guardada');
                    setSecretKey('');
                  }}
                  disabled={saving === 'stripe_secret_key' || !secretKey}
                  className="border-sky-300 text-sky-700 hover:bg-sky-100"
                >
                  {saving === 'stripe_secret_key' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </Button>
              </div>
              {settings?.secretKeyConfigured && (
                <p className="text-xs text-green-600 mt-1">✓ Secret configurada (termina en {settings.secretKeyMasked.slice(-4)})</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Webhook Secret</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showWebhookSecret ? 'text' : 'password'}
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    placeholder={settings?.webhookSecretConfigured ? '•••••••• (ya configurado)' : 'whsec_...'}
                    className="font-mono text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    saveSetting('stripe_webhook_secret', webhookSecret, 'Webhook Secret guardado');
                    setWebhookSecret('');
                  }}
                  disabled={saving === 'stripe_webhook_secret' || !webhookSecret}
                  className="border-sky-300 text-sky-700 hover:bg-sky-100"
                >
                  {saving === 'stripe_webhook_secret' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </Button>
              </div>
              {settings?.webhookSecretConfigured && (
                <p className="text-xs text-cyan-600 mt-1">✓ Webhook configurado (termina en {settings.webhookSecretMasked.slice(-4)})</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Configúralo para confirmar pagos aunque el usuario cierre la pestaña. Endpoint: <span className="font-mono text-cyan-700">/api/webhooks/stripe</span>.
                Es el modo más robusto y recomendado.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Modo</label>
              <Select
                value={mode}
                onValueChange={(value: 'test' | 'live') => {
                  setMode(value);
                  saveSetting('stripe_mode', value, `Modo cambiado a ${value}`);
                }}
                disabled={saving !== null}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {mode === 'test' ? 'Usa llaves de prueba de Stripe' : '⚠️ Modo producción - cobros reales'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              Estado operativo
            </h4>

            <div className="rounded-2xl border border-cyan-100 bg-white p-4">
              <p className="text-sm text-gray-600">Stripe se mostrará en el checkout cuando esté activado, tenga la Secret Key configurada y la compra global esté encendida.</p>
              <div className="mt-4 flex items-center gap-2">
                <Badge className={isStripeConfigured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                  {isStripeConfigured ? 'Listo para usar' : 'Falta configuración'}
                </Badge>
                <Badge className={isWebhookConfigured ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600'}>
                  {isWebhookConfigured ? 'Webhook listo' : 'Webhook pendiente'}
                </Badge>
                <Badge className={purchasesEnabled ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-600'}>
                  {purchasesEnabled ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
