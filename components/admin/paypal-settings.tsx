'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreditCard,
  Loader2,
  DollarSign,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PayPalSettings {
  clientId: string;
  clientSecretMasked: string;
  clientSecretConfigured: boolean;
  mode: 'sandbox' | 'live';
  creditPriceUSD: number;
  purchasesEnabled: boolean;
  minCredits: number;
  maxCredits: number;
}

export function PayPalSettingsCard() {
  const [settings, setSettings] = useState<PayPalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  
  // Editable values
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [mode, setMode] = useState<'sandbox' | 'live'>('sandbox');
  const [creditPriceUSD, setCreditPriceUSD] = useState(0.10);
  const [purchasesEnabled, setPurchasesEnabled] = useState(false);
  const [minCredits, setMinCredits] = useState(10);
  const [maxCredits, setMaxCredits] = useState(1000);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/paypal-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        setClientId(data.settings.clientId || '');
        setMode(data.settings.mode || 'sandbox');
        setCreditPriceUSD(data.settings.creditPriceUSD || 0.10);
        setPurchasesEnabled(data.settings.purchasesEnabled || false);
        setMinCredits(data.settings.minCredits || 10);
        setMaxCredits(data.settings.maxCredits || 1000);
      }
    } catch (error) {
      console.error('Error fetching PayPal settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: string, successMsg: string) => {
    setSaving(key);
    try {
      const response = await fetch('/api/admin/paypal-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
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
      <Card className="mb-8 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  const isPayPalConfigured = settings?.clientId && settings?.clientSecretConfigured;

  return (
    <Card className="mb-8 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span className="text-blue-900">Configuración de PayPal</span>
          </div>
          <Badge variant={isPayPalConfigured ? "default" : "secondary"} 
                 className={isPayPalConfigured ? "bg-green-100 text-green-700" : ""}>
            {isPayPalConfigured ? (
              <><CheckCircle className="w-3 h-3 mr-1" /> Configurado</>
            ) : (
              <><XCircle className="w-3 h-3 mr-1" /> No configurado</>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Habilitar/Deshabilitar compras */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-100">
          <div>
            <h4 className="font-medium text-gray-900">Compras de créditos activas</h4>
            <p className="text-sm text-gray-600">
              {purchasesEnabled 
                ? 'Los usuarios pueden comprar créditos con PayPal' 
                : 'Las compras de créditos están deshabilitadas'
              }
            </p>
          </div>
          <Switch
            checked={purchasesEnabled}
            onCheckedChange={(checked) => {
              setPurchasesEnabled(checked);
              saveSetting('credit_purchases_enabled', String(checked), 
                checked ? 'Compras habilitadas' : 'Compras deshabilitadas');
            }}
            disabled={!isPayPalConfigured || saving !== null}
            className="data-[state=checked]:bg-green-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Credenciales PayPal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Credenciales de PayPal
            </h4>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Client ID</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Tu PayPal Client ID"
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => saveSetting('paypal_client_id', clientId, 'Client ID guardado')}
                  disabled={saving === 'paypal_client_id' || !clientId}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  {saving === 'paypal_client_id' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Client Secret</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showSecret ? 'text' : 'password'}
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder={settings?.clientSecretConfigured ? '•••••••• (ya configurado)' : 'Tu PayPal Client Secret'}
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
                    saveSetting('paypal_client_secret', clientSecret, 'Client Secret guardado');
                    setClientSecret('');
                  }}
                  disabled={saving === 'paypal_client_secret' || !clientSecret}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  {saving === 'paypal_client_secret' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </Button>
              </div>
              {settings?.clientSecretConfigured && (
                <p className="text-xs text-green-600 mt-1">✓ Secret configurado (termina en {settings.clientSecretMasked.slice(-4)})</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Modo</label>
              <Select
                value={mode}
                onValueChange={(value: 'sandbox' | 'live') => {
                  setMode(value);
                  saveSetting('paypal_mode', value, `Modo cambiado a ${value}`);
                }}
                disabled={saving !== null}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox (Pruebas)</SelectItem>
                  <SelectItem value="live">Live (Producción)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {mode === 'sandbox' ? 'Usa credenciales de prueba de PayPal Developer' : '⚠️ Modo producción - pagos reales'}
              </p>
            </div>
          </div>

          {/* Configuración de precios */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Configuración de Precios
            </h4>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Precio por crédito (USD)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="100"
                    value={creditPriceUSD}
                    onChange={(e) => setCreditPriceUSD(parseFloat(e.target.value) || 0)}
                    className="pl-7 font-mono"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => saveSetting('credit_price_usd', String(creditPriceUSD), 'Precio actualizado')}
                  disabled={saving === 'credit_price_usd'}
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  {saving === 'credit_price_usd' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Mínimo de créditos</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={minCredits}
                    onChange={(e) => setMinCredits(parseInt(e.target.value) || 1)}
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => saveSetting('min_credits_purchase', String(minCredits), 'Mínimo actualizado')}
                    disabled={saving === 'min_credits_purchase'}
                    className="border-gray-300 shrink-0"
                  >
                    {saving === 'min_credits_purchase' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Máximo de créditos</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={maxCredits}
                    onChange={(e) => setMaxCredits(parseInt(e.target.value) || 1)}
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => saveSetting('max_credits_purchase', String(maxCredits), 'Máximo actualizado')}
                    disabled={saving === 'max_credits_purchase'}
                    className="border-gray-300 shrink-0"
                  >
                    {saving === 'max_credits_purchase' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview de precios */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h5 className="text-sm font-semibold text-green-800 mb-2">Vista previa de precios</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{minCredits} créditos (mínimo)</span>
                  <span className="font-semibold text-green-700">${(minCredits * creditPriceUSD).toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">50 créditos</span>
                  <span className="font-semibold text-green-700">${(50 * creditPriceUSD).toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">100 créditos</span>
                  <span className="font-semibold text-green-700">${(100 * creditPriceUSD).toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{maxCredits} créditos (máximo)</span>
                  <span className="font-semibold text-green-700">${(maxCredits * creditPriceUSD).toFixed(2)} USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
