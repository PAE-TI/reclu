'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, TrendingUp, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface PricingSettings {
  creditPriceUSD: number;
  minCredits: number;
  maxCredits: number;
}

export function CreditPricingCard() {
  const [settings, setSettings] = useState<PricingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const [creditPriceUSD, setCreditPriceUSD] = useState(0.1);
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
        setCreditPriceUSD(data.settings.creditPriceUSD || 0.1);
        setMinCredits(data.settings.minCredits || 10);
        setMaxCredits(data.settings.maxCredits || 1000);
      }
    } catch (error) {
      console.error('Error fetching pricing settings:', error);
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

  const previewRows = [
    { label: `${minCredits} créditos (mínimo)`, amount: minCredits * creditPriceUSD },
    { label: '50 créditos', amount: 50 * creditPriceUSD },
    { label: '100 créditos', amount: 100 * creditPriceUSD },
    { label: `${maxCredits} créditos (máximo)`, amount: maxCredits * creditPriceUSD },
  ];

  if (loading) {
    return (
      <Card className="mb-8 border-emerald-200 bg-gradient-to-br from-emerald-50 to-lime-50">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border-emerald-200 bg-gradient-to-br from-emerald-50 to-lime-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-900">Configuración de Precios</span>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700">
            <TrendingUp className="w-3 h-3 mr-1" />
            Activo
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">
            Define el precio base y el rango de compra. La vista previa muestra cómo se verán los importes para usuarios.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
              >
                {saving === 'credit_price_usd' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </Button>
            </div>
          </div>

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

        <div className="rounded-2xl border border-emerald-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h5 className="text-sm font-semibold text-emerald-800">Vista previa de precios</h5>
          </div>
          <div className="space-y-2 text-sm">
            {previewRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                <span className="text-slate-600">{row.label}</span>
                <span className="font-semibold text-emerald-700">${row.amount.toFixed(2)} USD</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
