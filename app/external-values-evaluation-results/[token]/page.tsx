'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scale, AlertCircle, Loader2, ArrowLeft, Sparkles, Shield, Award, Users, ArrowRight, Brain, TrendingUp, TrendingDown, Globe } from 'lucide-react';
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
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">MotivaIQ</h1>
              <p className="text-xs text-gray-500">{t('results.brand.platform')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100">
              <Scale className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-600">{t('results.brand.valuesResults')}</span>
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
        <div className="bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-600 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">{t('results.footer.interestedTitle')}</h3>
            <p className="text-violet-100 mb-4 text-sm">{t('results.footer.interestedSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 bg-white text-violet-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-violet-50 transition-colors shadow-lg">
                {t('results.footer.learnMore')} <ArrowRight className="w-4 h-4" />
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

export default function ExternalValuesResults() {
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
    TEORICO: t('values.theoretical'),
    UTILITARIO: t('values.utilitarian'),
    ESTETICO: t('values.aesthetic'),
    SOCIAL: t('values.social'),
    INDIVIDUALISTA: t('values.individualistic'),
    TRADICIONAL: t('values.traditional'),
  }), [language, t]);

  const dimensionDescriptions = useMemo(() => ({
    TEORICO: t('values.theoretical.fullDesc'),
    UTILITARIO: t('values.utilitarian.fullDesc'),
    ESTETICO: t('values.aesthetic.fullDesc'),
    SOCIAL: t('values.social.fullDesc'),
    INDIVIDUALISTA: t('values.individualistic.fullDesc'),
    TRADICIONAL: t('values.traditional.fullDesc'),
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
      const response = await fetch(`/api/external-values-evaluations/${token}?results=true`);
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-violet-500 mx-auto mb-4" />
            <p className="text-gray-600">{t('results.loading')}</p>
          </div>
        </main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  if (requireAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-violet-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.restrictedAccess')}</h2>
              <p className="text-gray-600 mb-6">{t('results.restrictedMessage')}</p>
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
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
  const dimensionScores = [
    { key: 'TEORICO', score: result.teoricoScore },
    { key: 'UTILITARIO', score: result.utilitarioScore },
    { key: 'ESTETICO', score: result.esteticoScore },
    { key: 'SOCIAL', score: result.socialScore },
    { key: 'INDIVIDUALISTA', score: result.individualistaScore },
    { key: 'TRADICIONAL', score: result.tradicionalScore },
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <BrandingHeader />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <Button variant="ghost" onClick={() => router.push('/external-values-evaluations')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('results.backToEvaluations')}
          </Button>

          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Scale className="w-9 h-9 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{t('results.values.title')}</h1>
                    <p className="text-violet-100">{evaluation.recipientName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${levelColors[result.valuesLevel]} text-white px-3 py-1`}>
                    {levelLabels[result.valuesLevel as keyof typeof levelLabels]}
                  </Badge>
                  <p className="text-sm text-violet-100 mt-2">{t('results.completedOn')}: {formatDate(evaluation.completedAt)}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-violet-600" />
                  {t('results.values.profile')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto relative">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                      <circle cx="64" cy="64" r="56" fill="none" stroke="url(#valuesGradient)" strokeWidth="12"
                        strokeDasharray={`${result.totalValuesScore * 3.52} 352`} strokeLinecap="round" />
                      <defs>
                        <linearGradient id="valuesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#d946ef" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-violet-600">{Math.round(result.totalValuesScore)}</span>
                        <span className="text-sm text-gray-500 block">{t('results.values.points')}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`mt-4 ${levelColors[result.valuesLevel]} text-white`}>
                    {levelLabels[result.valuesLevel as keyof typeof levelLabels]}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-600" />
                  {t('results.values.integrityIndicators')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-violet-50 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-1">{t('results.values.integrity')}</p>
                    <p className="text-3xl font-bold text-violet-600">{Math.round(result.integrityScore)}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-1">{t('results.values.consistency')}</p>
                    <p className="text-3xl font-bold text-green-600">{Math.round(result.consistencyScore)}</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-1">{t('results.values.authenticity')}</p>
                    <p className="text-3xl font-bold text-amber-600">{Math.round(result.authenticityScore)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold mb-2">{t('results.values.profile')}</h4>
                  <p className="text-sm text-gray-700">{result.valuesProfile}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-violet-600" />
                {t('results.values.dimensions')}
              </CardTitle>
              <CardDescription>{t('results.values.dimensionsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dimensionScores.map((dim, idx) => (
                  <div key={dim.key} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      idx < 2 ? 'bg-violet-500 text-white' : idx < 4 ? 'bg-violet-200 text-violet-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-900">{dimensionLabels[dim.key as keyof typeof dimensionLabels]}</span>
                        <span className="font-bold text-violet-600">{Math.round(dim.score)}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${
                          idx < 2 ? 'bg-violet-500' : idx < 4 ? 'bg-violet-300' : 'bg-gray-400'
                        }`} style={{ width: `${dim.score}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{dimensionDescriptions[dim.key as keyof typeof dimensionDescriptions]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
