'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, AlertCircle, Loader2, ArrowLeft, User, Sparkles, Shield, Award, Users, ArrowRight, LogIn, Brain, TrendingUp, TrendingDown, Globe } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';


function BrandingHeader() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Reclu</h1>
              <p className="text-xs text-gray-500">{t('results.brand.platform')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100">
              <Target className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-600">{t('results.brand.acumenResults')}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'es' ? 'EN' : 'ES'}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function BrandingFooter({ showCTA = true }: { showCTA?: boolean }) {
  const { t } = useLanguage();
  
  return (
    <footer className="mt-auto">
      {showCTA && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">{t('results.footer.interestedTitle')}</h3>
            <p className="text-amber-100 mb-4 text-sm">{t('results.footer.interestedSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 bg-white text-amber-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-50 transition-colors shadow-lg">
                {t('results.footer.learnMore')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-white/20 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30">
                {t('results.footer.createAccount')}
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="bg-gray-900 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm">{t('results.footer.confidential')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">{t('results.footer.certified')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm">{t('results.footer.evaluationsCount')}</span>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm">{t('results.footer.copyright')}</div>
        </div>
      </div>
    </footer>
  );
}

export default function ExternalAcumenResults() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession() || {};
  const { language, t } = useLanguage();
  const token = params.token as string;

  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requireAuth, setRequireAuth] = useState(false);

  const dimensionLabels = useMemo(() => ({
    understandingOthersClarity: t('acumen.understandingOthers'),
    practicalThinkingClarity: t('acumen.practicalThinking'),
    systemsJudgmentClarity: t('acumen.systemsJudgment'),
    senseOfSelfClarity: t('acumen.senseOfSelf'),
    roleAwarenessClarity: t('acumen.roleAwareness'),
    selfDirectionClarity: t('acumen.selfDirection'),
  }), [language, t]);

  const levelLabels = useMemo(() => ({
    'MUY_ALTO': t('level.veryHigh'),
    'ALTO': t('level.high'),
    'MODERADO': t('level.moderate'),
    'BAJO': t('level.low'),
    'MUY_BAJO': t('level.veryLow')
  }), [language, t]);

  useEffect(() => {
    fetchResults();
  }, [token, sessionStatus]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/external-acumen-evaluations/${token}?results=true`);
      const data = await response.json();
      if (response.status === 401 && data.requireAuth) {
        setRequireAuth(true);
        setLoading(false);
        return;
      }
      if (!response.ok) {
        setError(data.error || t('results.error'));
        setLoading(false);
        return;
      }
      setEvaluation(data);
    } catch (err) {
      setError(t('results.error'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const levelColors: Record<string, string> = {
    'MUY_ALTO': 'bg-green-500',
    'ALTO': 'bg-emerald-500',
    'MODERADO': 'bg-yellow-500',
    'BAJO': 'bg-orange-500',
    'MUY_BAJO': 'bg-red-500'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600">{t('results.loading')}</p>
          </div>
        </main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  if (requireAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.restrictedAccess')}</h2>
              <p className="text-gray-600 mb-6">{t('results.restrictedMessage')}</p>
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  {t('results.signIn')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  if (error || !evaluation?.result) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.error')}</h2>
              <p className="text-gray-600">{error || t('results.resultsNotAvailable')}</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  const result = evaluation.result;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <BrandingHeader />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <Button variant="ghost" onClick={() => router.push('/external-acumen-evaluations')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('results.backToEvaluations')}
          </Button>

          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target className="w-9 h-9 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{t('results.acumen.title')}</h1>
                    <p className="text-amber-100">{evaluation.recipientName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${levelColors[result.acumenLevel]} text-white px-3 py-1`}>
                    {levelLabels[result.acumenLevel as keyof typeof levelLabels]}
                  </Badge>
                  <p className="text-sm text-amber-100 mt-2">{t('results.completedOn')}: {formatDate(evaluation.completedAt)}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-amber-600" />
                  {t('results.acumen.profile')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto relative">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                      <circle cx="64" cy="64" r="56" fill="none" stroke="url(#acumenGradient)" strokeWidth="12"
                        strokeDasharray={`${result.totalAcumenScore * 35.2} 352`} strokeLinecap="round" />
                      <defs>
                        <linearGradient id="acumenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#ea580c" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-amber-600">{result.totalAcumenScore.toFixed(1)}</span>
                        <span className="text-sm text-gray-500 block">{t('results.acumen.points')}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{result.acumenProfile}</h3>
                  <Badge className={`mt-2 ${levelColors[result.acumenLevel]} text-white`}>
                    {levelLabels[result.acumenLevel as keyof typeof levelLabels]}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  {t('results.acumen.clarityIndex')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-2">🌍 {t('results.acumen.externalClarity')}</p>
                    <p className="text-4xl font-bold text-blue-600">{result.externalClarityScore.toFixed(1)}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('results.acumen.of10')}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-2">🧘 {t('results.acumen.internalClarity')}</p>
                    <p className="text-4xl font-bold text-purple-600">{result.internalClarityScore.toFixed(1)}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('results.acumen.of10')}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 text-sm">{t('results.acumen.externalFactors')}</h4>
                  {['understandingOthersClarity', 'practicalThinkingClarity', 'systemsJudgmentClarity'].map(key => (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{dimensionLabels[key as keyof typeof dimensionLabels]}</span>
                        <span className="text-sm font-bold text-blue-600">{result[key].toFixed(1)}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${result[key] * 10}%` }} />
                      </div>
                    </div>
                  ))}
                  
                  <h4 className="font-semibold text-gray-700 text-sm mt-6">{t('results.acumen.internalFactors')}</h4>
                  {['senseOfSelfClarity', 'roleAwarenessClarity', 'selfDirectionClarity'].map(key => (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{dimensionLabels[key as keyof typeof dimensionLabels]}</span>
                        <span className="text-sm font-bold text-purple-600">{result[key].toFixed(1)}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${result[key] * 10}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  {t('results.disc.strengths')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.primaryStrengths && result.primaryStrengths.length > 0 ? (
                  <ul className="space-y-3">
                    {result.primaryStrengths.map((strength: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{idx + 1}</span>
                        </div>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">{t('results.acumen.noStrengths')}</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingDown className="w-5 h-5 text-amber-600" />
                  {t('results.disc.developmentAreas')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.developmentAreas && result.developmentAreas.length > 0 ? (
                  <ul className="space-y-3">
                    {result.developmentAreas.map((area: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{idx + 1}</span>
                        </div>
                        <span className="text-gray-700">{area}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">{t('results.acumen.noAreas')}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <BrandingFooter />
    </div>
  );
}
