'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Coins,
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  User,
  Lock,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface CreditTransaction {
  id: string;
  amount: number;
  type: 'INITIAL' | 'EVALUATION_SENT' | 'RECHARGE' | 'ADJUSTMENT';
  description: string;
  evaluationType: string | null;
  balanceAfter: number;
  createdAt: string;
  createdBy: string | null;
  createdByUser: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const TYPE_COLORS: Record<string, string> = {
  INITIAL: 'bg-emerald-100 text-emerald-700',
  EVALUATION_SENT: 'bg-indigo-100 text-indigo-700',
  RECHARGE: 'bg-purple-100 text-purple-700',
  ADJUSTMENT: 'bg-slate-100 text-slate-700',
};

export default function SettingsPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const { t, language } = useLanguage();
  const [credits, setCredits] = useState<number>(0);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasTransactionAccess, setHasTransactionAccess] = useState(true);
  const [isFacilitator, setIsFacilitator] = useState(false);
  const itemsPerPage = 10;
  
  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      INITIAL: t('settings.txType.initial'),
      EVALUATION_SENT: t('settings.txType.evaluationSent'),
      RECHARGE: t('settings.txType.recharge'),
      ADJUSTMENT: t('settings.txType.adjustment'),
    };
    return typeMap[type] || type;
  };
  
  const dateLocale = language === 'es' ? es : enUS;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch credits
        const creditsRes = await fetch('/api/credits');
        if (creditsRes.ok) {
          const data = await creditsRes.json();
          setCredits(data.credits);
          setIsFacilitator(data.isFacilitator || false);
        }

        // Fetch transactions
        const transRes = await fetch(`/api/credits/transactions?limit=${itemsPerPage}&page=${currentPage}`);
        if (transRes.status === 403) {
          // No tiene acceso al historial de transacciones
          setHasTransactionAccess(false);
        } else if (transRes.ok) {
          const data = await transRes.json();
          setTransactions(data.transactions);
          setTotalTransactions(data.total);
          setHasTransactionAccess(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, currentPage]);

  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with gradient */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">{t('settings.title')}</h1>
            <p className="text-lg text-gray-600">
              {t('settings.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Credits Card - Now with indigo-purple theme */}
      <Card className="mb-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 border-0 shadow-xl overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <span className="text-white">{t('settings.myCredits')}</span>
          </CardTitle>
          <CardDescription className="text-indigo-300">
            {t('settings.creditsHistory')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Current Balance */}
          <div className="mb-6 p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-300 font-medium">{t('settings.currentBalance')}</p>
                <p className="text-5xl font-bold text-white">{credits}</p>
                <p className="text-xs text-purple-300 mt-1">{t('settings.availableCredits')}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-3">
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                {!isFacilitator && (
                  <Link href="/credits/purchase">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg border-0">
                      <CreditCard className="w-4 h-4 mr-2" />
                      {t('settings.buyCredits')}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-200">{t('settings.creditPolicy')}</h4>
                <p className="text-sm text-amber-300/80 mt-1">
                  {t('settings.creditPolicyDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          {hasTransactionAccess ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
              <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                <h3 className="font-semibold text-white">{t('settings.transactionHistory')}</h3>
              </div>

              {transactions.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-indigo-400/50 mx-auto mb-3" />
                  <p className="text-indigo-300">{t('settings.noTransactions')}</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-emerald-500/20' : 'bg-indigo-500/20'}`}>
                            {tx.amount > 0 ? (
                              <ArrowUpCircle className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <ArrowDownCircle className="w-5 h-5 text-indigo-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{tx.description}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge className={TYPE_COLORS[tx.type] + ' text-xs'}>
                                {getTypeLabel(tx.type)}
                              </Badge>
                              {tx.createdByUser && (
                                <Badge className="bg-purple-500/20 text-purple-300 text-xs border-purple-400/30">
                                  <User className="w-3 h-3 mr-1" />
                                  {tx.createdByUser.name}
                                </Badge>
                              )}
                              <span className="text-xs text-indigo-300/70">
                                {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true, locale: dateLocale })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount}
                          </p>
                          <p className="text-xs text-indigo-300/70">{t('settings.balance')}: {tx.balanceAfter}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex items-center justify-between">
                  <p className="text-sm text-indigo-300">
                    {t('settings.showing')} {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalTransactions)} {t('settings.of')} {totalTransactions}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-indigo-300">
                      {currentPage} {t('settings.page')} {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
              <div className="p-4 bg-white/10 rounded-full inline-block mb-4">
                <Lock className="w-8 h-8 text-indigo-300" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t('settings.restrictedAccess')}</h4>
              <p className="text-sm text-indigo-300/70">
                {t('settings.restrictedAccessDesc')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <span className="text-indigo-900">{t('settings.notifications')}</span>
            </CardTitle>
            <CardDescription className="text-indigo-600/70">
              {t('settings.notificationsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-indigo-200/50 shadow-sm">
                <div>
                  <h4 className="font-medium text-gray-900">{t('settings.completedEvaluations')}</h4>
                  <p className="text-sm text-gray-600">{t('settings.notifyWhenCompleted')}</p>
                </div>
                <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0">
                  {t('settings.activeStatus')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200/50 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-purple-900">{t('settings.account')}</span>
            </CardTitle>
            <CardDescription className="text-purple-600/70">
              {t('settings.accountSettings')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/profile/edit">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white hover:bg-purple-50 transition-colors cursor-pointer border border-purple-200/50 shadow-sm">
                  <div>
                    <h4 className="font-medium text-gray-900">{t('settings.editProfile')}</h4>
                    <p className="text-sm text-gray-600">{t('settings.updatePersonalInfo')}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-purple-400" />
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Settings */}
      <Card className="mt-8 bg-white border-indigo-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <span>{t('settings.currentSettings')}</span>
          </CardTitle>
          <CardDescription>
            {t('settings.currentSettingsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 rounded-xl shadow-sm">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg inline-block mb-2">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="font-medium text-emerald-900">{t('settings.account')}</div>
              <div className="text-sm text-emerald-700">{t('settings.accountActive')}</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/50 rounded-xl shadow-sm">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg inline-block mb-2">
                <Coins className="w-4 h-4 text-white" />
              </div>
              <div className="font-medium text-indigo-900">{t('settings.credits')}</div>
              <div className="text-sm text-indigo-700">{credits} {t('settings.available')}</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/50 rounded-xl shadow-sm">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg inline-block mb-2">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div className="font-medium text-purple-900">{t('settings.language')}</div>
              <div className="text-sm text-purple-700">{language === 'es' ? t('settings.spanish') : t('settings.english')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
