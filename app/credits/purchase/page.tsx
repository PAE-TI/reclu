'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  Coins,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Gift,
  Shield,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PurchaseSettings {
  enabled: boolean;
  reason?: string;
  pricePerCredit: number;
  minCredits: number;
  maxCredits: number;
  paypalClientId: string | null;
  paypalEnabled: boolean;
  stripeEnabled: boolean;
  stripeConfigured: boolean;
  stripeMode: 'test' | 'live';
}

export default function PurchaseCreditsPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState<PurchaseSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [creditAmount, setCreditAmount] = useState(50);
  const [processing, setProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalError, setPaypalError] = useState(false);
  const [stripeProcessing, setStripeProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{
    creditAmount: number;
    newBalance: number;
    invoiceNumber: string;
    paymentProvider?: 'PAYPAL' | 'STRIPE';
  } | null>(null);
  const stripeCompletionHandled = useRef(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchSettings();
    }
  }, [status, router]);

  useEffect(() => {
    const sessionId = searchParams?.get('stripe_session_id');
    const cancelled = searchParams?.get('stripe_cancelled');

    if (cancelled && !purchaseComplete) {
      toast.error(t('purchase.paymentCancelled'));
      router.replace('/credits/purchase');
      return;
    }

    if (!sessionId || stripeCompletionHandled.current || purchaseComplete) return;

    stripeCompletionHandled.current = true;
    completeStripePurchase(sessionId);
  }, [searchParams, purchaseComplete, router, t]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/credits/purchase/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        if (data.minCredits) {
          setCreditAmount(Math.max(data.minCredits, 50));
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeStripePurchase = async (sessionId: string) => {
    setProcessing(true);
    try {
      const response = await fetch('/api/credits/purchase/stripe/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t('purchase.errorCapturing'));
      }

      setPurchaseResult(result);
      setPurchaseComplete(true);
      window.dispatchEvent(new Event('credits-updated'));
      toast.success(t('purchase.creditsAddedToast').replace('{amount}', result.creditAmount.toString()));
      router.replace('/credits/purchase');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('purchase.paymentError'));
      router.replace('/credits/purchase');
    } finally {
      setProcessing(false);
    }
  };

  const renderPayPalButton = useCallback(() => {
    if (!settings?.paypalClientId || !window.paypal) return;

    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    
    // Clear previous buttons
    container.innerHTML = '';

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'pay',
        tagline: false
      },
      fundingSource: undefined, // Allow PayPal to determine funding sources
      createOrder: async () => {
        setProcessing(true);
        try {
          const response = await fetch('/api/credits/purchase/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ creditAmount })
          });

          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || t('purchase.errorCreatingOrder'));
          }

          return data.orderId;
        } catch (error) {
          setProcessing(false);
          toast.error(error instanceof Error ? error.message : t('purchase.paymentError'));
          throw error;
        }
      },
      onApprove: async (data: { orderID: string }) => {
        try {
          const response = await fetch('/api/credits/purchase/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID })
          });

          const result = await response.json();
          
          if (!response.ok) {
            throw new Error(result.error || t('purchase.errorCapturing'));
          }

          setPurchaseResult(result);
          setPurchaseComplete(true);
          
          // Dispatch event to update header credits
          window.dispatchEvent(new Event('credits-updated'));
          
          toast.success(t('purchase.creditsAddedToast').replace('{amount}', result.creditAmount.toString()));
        } catch (error) {
          toast.error(error instanceof Error ? error.message : t('purchase.paymentError'));
        } finally {
          setProcessing(false);
        }
      },
      onCancel: () => {
        setProcessing(false);
        toast.error(t('purchase.paymentCancelled'));
      },
      onError: (err: any) => {
        setProcessing(false);
        console.error('PayPal error:', err);
        toast.error(t('purchase.paymentError'));
      }
    }).render('#paypal-button-container');
  }, [creditAmount, settings?.paypalClientId, t]);

  const handleStripeCheckout = async () => {
    setStripeProcessing(true);
    try {
      const response = await fetch('/api/credits/purchase/create-stripe-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditAmount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('purchase.paymentError'));
      }

      if (!data.url) {
        throw new Error(t('purchase.paymentError'));
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('purchase.paymentError'));
      setStripeProcessing(false);
    }
  };

  useEffect(() => {
    if (paypalLoaded && settings?.paypalClientId) {
      renderPayPalButton();
    }
  }, [paypalLoaded, settings?.paypalClientId, creditAmount, renderPayPalButton]);

  // Timeout para detectar si PayPal no carga
  useEffect(() => {
    if (settings?.paypalClientId && !paypalLoaded && !paypalError) {
      const timeout = setTimeout(() => {
        if (!paypalLoaded) {
          setPaypalError(true);
        }
      }, 15000); // 15 segundos de timeout
      return () => clearTimeout(timeout);
    }
  }, [settings?.paypalClientId, paypalLoaded, paypalError]);

  const totalPrice = settings ? (creditAmount * settings.pricePerCredit).toFixed(2) : '0.00';

  // Calcular escalas dinámicas basadas en min/max
  const calculatePresetAmounts = (): number[] => {
    if (!settings) return [25, 50, 100, 250, 500];
    
    const min = settings.minCredits;
    const max = settings.maxCredits;
    const range = max - min;
    const step = range / 4; // 4 intervalos para 5 puntos
    
    const amounts: number[] = [];
    for (let i = 0; i < 5; i++) {
      const rawValue = min + (step * i);
      // Redondear a múltiplos de 5 para valores pequeños, 10 para medianos, 25 para grandes
      let roundedValue: number;
      if (rawValue <= 50) {
        roundedValue = Math.round(rawValue / 5) * 5;
      } else if (rawValue <= 200) {
        roundedValue = Math.round(rawValue / 10) * 10;
      } else if (rawValue <= 500) {
        roundedValue = Math.round(rawValue / 25) * 25;
      } else {
        roundedValue = Math.round(rawValue / 50) * 50;
      }
      // Asegurar que esté dentro del rango
      roundedValue = Math.max(min, Math.min(max, roundedValue));
      // Evitar duplicados
      if (!amounts.includes(roundedValue)) {
        amounts.push(roundedValue);
      }
    }
    // Asegurar que el máximo esté incluido
    if (!amounts.includes(max)) {
      amounts.push(max);
    }
    return amounts.slice(0, 5);
  };

  const presetAmounts = calculatePresetAmounts();

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!settings?.enabled) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('purchase.notAvailable')}</h2>
            <p className="text-gray-600 mb-6">
              {settings?.reason || t('purchase.notAvailableDesc')}
            </p>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('purchase.backToDashboard')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (purchaseComplete && purchaseResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="border-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 shadow-2xl overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t('purchase.success')}</h2>
            <p className="text-indigo-200 mb-6">
              {t('purchase.successDesc').replace('{amount}', '')}
              <span className="font-bold text-emerald-400">{purchaseResult.creditAmount}</span>
              {t('purchase.successDesc').split('{amount}')[1]}
            </p>

            <div className="mb-6">
              <Badge className="bg-white/10 text-white border border-white/20">
                {purchaseResult.paymentProvider === 'STRIPE'
                  ? 'Stripe'
                  : 'PayPal'}
              </Badge>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-emerald-500/20 rounded-lg">
                  <p className="text-sm text-emerald-300">{t('purchase.creditsAdded')}</p>
                  <p className="text-3xl font-bold text-emerald-400">{purchaseResult.creditAmount}</p>
                </div>
                <div className="p-4 bg-indigo-500/20 rounded-lg">
                  <p className="text-sm text-indigo-300">{t('purchase.newBalance')}</p>
                  <p className="text-3xl font-bold text-indigo-400">{purchaseResult.newBalance}</p>
                </div>
              </div>
              {purchaseResult.invoiceNumber && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-indigo-300">{t('purchase.invoiceNumber')}</p>
                  <p className="font-mono text-sm text-white">{purchaseResult.invoiceNumber}</p>
                </div>
              )}
            </div>
            
            <p className="text-sm text-indigo-300/70 mb-6">
              {t('purchase.invoiceSent')}
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('purchase.goToDashboard')}
                </Button>
              </Link>
              <Link href="/batch-evaluations">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t('purchase.sendEvaluationsBtn')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {settings.paypalEnabled && settings.paypalClientId && !paypalError && (
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${settings.paypalClientId}&currency=USD&enable-funding=card&disable-funding=paylater,venmo`}
          onLoad={() => {
            setPaypalLoaded(true);
            setPaypalError(false);
          }}
          onError={() => {
            setPaypalError(true);
            console.error('Error loading PayPal SDK');
          }}
        />
      )}
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header with gradient */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">{t('purchase.title')}</h1>
              <p className="text-gray-600">{t('purchase.subtitle')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selector de cantidad */}
          <div className="lg:col-span-2">
            <Card className="border-indigo-200/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                    <Coins className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-indigo-900">{t('purchase.selectAmount')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Preset buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {presetAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={creditAmount === amount ? 'default' : 'outline'}
                      onClick={() => setCreditAmount(amount)}
                      className={creditAmount === amount 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 shadow-md' 
                        : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300'}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>

                {/* Custom amount */}
                <div>
                  <label className="text-sm font-medium text-indigo-900 mb-2 block">
                    {t('purchase.customAmount')}
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={settings?.minCredits}
                      max={settings?.maxCredits}
                      value={creditAmount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || settings?.minCredits || 10;
                        setCreditAmount(Math.min(Math.max(val, settings?.minCredits || 10), settings?.maxCredits || 1000));
                      }}
                      className="text-center text-lg font-semibold w-32 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
                    />
                    <span className="text-indigo-700">{t('purchase.credits')}</span>
                  </div>
                  <p className="text-xs text-indigo-500 mt-1">
                    {t('purchase.minMax').replace('{min}', String(settings?.minCredits)).replace('{max}', String(settings?.maxCredits))}
                  </p>
                </div>

                {/* Price breakdown */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-xl p-5 shadow-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-indigo-300">{t('purchase.pricePerCredit')}</span>
                    <span className="font-medium text-white">${settings?.pricePerCredit.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-indigo-300">{t('purchase.quantity')}</span>
                    <span className="font-medium text-white">{creditAmount} {t('purchase.credits')}</span>
                  </div>
                  <div className="border-t border-white/20 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">{t('purchase.total')}</span>
                      <div className="text-right">
                        <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">${totalPrice}</span>
                        <span className="text-emerald-300 ml-1">USD</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PayPal Button */}
                <div className="pt-4 space-y-4">
                  {(settings?.paypalEnabled && settings?.paypalClientId) && (
                    <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">PayPal</p>
                          <p className="text-sm text-slate-500">{language === 'es' ? 'Pago rápido con tu cuenta PayPal o tarjeta.' : 'Fast checkout with PayPal or card.'}</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-700">PayPal</Badge>
                      </div>
                      {processing && (
                        <div className="flex items-center justify-center py-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                          <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-3" />
                          <span className="text-indigo-700 font-medium">{t('purchase.processing')}</span>
                        </div>
                      )}
                      <div id="paypal-button-container" className={processing ? 'hidden' : ''}></div>
                      {!paypalLoaded && !processing && settings?.paypalClientId && !paypalError && (
                        <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                          <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mb-2" />
                          <span className="text-indigo-700">{t('purchase.loadingPaypal')}</span>
                        </div>
                      )}
                      {paypalError && !paypalLoaded && (
                        <Alert className="border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-amber-800 text-sm">
                            <div className="flex flex-col gap-2">
                              <span>{t('purchase.paypalError')}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.reload()}
                                className="w-fit border-amber-300 text-amber-700 hover:bg-amber-100"
                              >
                                {t('purchase.reloadPage')}
                              </Button>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  {(settings?.stripeEnabled && settings?.stripeConfigured) && (
                    <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">Stripe</p>
                          <p className="text-sm text-slate-500">{language === 'es' ? 'Checkout seguro y profesional con tarjeta.' : 'Secure, professional card checkout.'}</p>
                        </div>
                        <Badge className="bg-sky-100 text-sky-700">Stripe</Badge>
                      </div>
                      <Button
                        onClick={handleStripeCheckout}
                        disabled={stripeProcessing || processing}
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                      >
                        {stripeProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CreditCard className="w-4 h-4 mr-2" />
                        )}
                        {stripeProcessing ? (language === 'es' ? 'Redirigiendo...' : 'Redirecting...') : (language === 'es' ? 'Pagar con Stripe' : 'Pay with Stripe')}
                      </Button>
                      <p className="mt-2 text-xs text-slate-500">
                        {settings.stripeMode === 'live'
                          ? (language === 'es' ? 'Modo producción activo.' : 'Live mode active.')
                          : (language === 'es' ? 'Modo de pruebas activo.' : 'Test mode active.')}
                      </p>
                    </div>
                  )}

                  {!settings?.paypalEnabled && !settings?.stripeEnabled && (
                    <Alert className="border-red-300 bg-gradient-to-r from-red-50 to-rose-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 text-sm">
                        {t('purchase.notAvailableDesc')}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info sidebar */}
          <div className="space-y-4">
            <Card className="border-0 bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">{t('purchase.whatCreditsFor')}</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="p-1 bg-emerald-400/20 rounded-full mt-0.5">
                      <CheckCircle className="w-3 h-3 text-emerald-300" />
                    </div>
                    <span className="text-white/90">{t('purchase.sendEvaluations')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 bg-emerald-400/20 rounded-full mt-0.5">
                      <CheckCircle className="w-3 h-3 text-emerald-300" />
                    </div>
                    <span className="text-white/90">{t('purchase.generateReports')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 bg-emerald-400/20 rounded-full mt-0.5">
                      <CheckCircle className="w-3 h-3 text-emerald-300" />
                    </div>
                    <span className="text-white/90">{t('purchase.accessIntegrated')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-emerald-900">{t('purchase.securePayment')}</h3>
                </div>
                <p className="text-sm text-emerald-700">
                  {t('purchase.securePaymentDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200/50 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-purple-900">{t('purchase.creditsNoExpire')}</h3>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
