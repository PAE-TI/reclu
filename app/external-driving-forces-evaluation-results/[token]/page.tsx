'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Lock,
  Mail,
  Sparkles,
  Shield,
  Award,
  Users,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  Loader2,
  Star,
  Flame,
  User,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage, Language } from '@/contexts/language-context';


// Branding Header Component
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">{t('results.brand.dfResults')}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'es' ? 'EN' : 'ES'}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Branding Footer Component
function BrandingFooter({ showCTA = true }: { showCTA?: boolean }) {
  const { t } = useLanguage();
  
  return (
    <footer className="mt-auto">
      {showCTA && (
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">{t('results.footer.interestedTitle')}</h3>
            <p className="text-purple-100 mb-4 text-sm">{t('results.footer.interestedSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 bg-white text-purple-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg">
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
          <div className="text-center text-gray-500 text-sm">
            {t('results.footer.copyright')}
          </div>
        </div>
      </div>
    </footer>
  );
}

interface DrivingForcesResult {
  id: string;
  motivationalProfile: string;
  primaryMotivators: string[];
  situationalMotivators: string[];
  indifferentMotivators: string[];
  topMotivator: string;
  secondMotivator?: string;
  thirdMotivator?: string;
  fourthMotivator?: string;
  intelectualPercentile: number;
  instintivoPercentile: number;
  practicoPercentile: number;
  altruistaPercentile: number;
  armoniosoPercentile: number;
  objetivoPercentile: number;
  benevoloPercentile: number;
  intencionalPercentile: number;
  dominantePercentile: number;
  colaborativoPercentile: number;
  estructuradoPercentile: number;
  receptivoPercentile: number;
}

interface Evaluation {
  id: string;
  title: string;
  recipientName: string;
  recipientEmail: string;
  status: string;
  completedAt: string | null;
  senderUserId: string;
  result: DrivingForcesResult | null;
  senderUser: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    name?: string;
    company: string | null;
  };
}

export default function ExternalDrivingForcesResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession() || {};
  const { language, t } = useLanguage();
  const token = params.token as string;

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requireAuth, setRequireAuth] = useState(false);

  // Translated motivator info
  const motivatorInfo = useMemo(() => ({
    intelectual: {
      name: t('df.intellectual'),
      description: t('df.intellectual.desc'),
      color: 'bg-blue-500',
      pair: t('df.pair.knowledge')
    },
    instintivo: {
      name: t('df.instinctive'),
      description: t('df.instinctive.desc'),
      color: 'bg-orange-500',
      pair: t('df.pair.knowledge')
    },
    practico: {
      name: t('df.practical'),
      description: t('df.practical.desc'),
      color: 'bg-green-600',
      pair: t('df.pair.utility')
    },
    altruista: {
      name: t('df.altruistic'),
      description: t('df.altruistic.desc'),
      color: 'bg-pink-500',
      pair: t('df.pair.utility')
    },
    armonioso: {
      name: t('df.harmonious'),
      description: t('df.harmonious.desc'),
      color: 'bg-teal-500',
      pair: t('df.pair.environment')
    },
    objetivo: {
      name: t('df.objective'),
      description: t('df.objective.desc'),
      color: 'bg-gray-600',
      pair: t('df.pair.environment')
    },
    benevolo: {
      name: t('df.benevolent'),
      description: t('df.benevolent.desc'),
      color: 'bg-rose-500',
      pair: t('df.pair.others')
    },
    intencional: {
      name: t('df.intentional'),
      description: t('df.intentional.desc'),
      color: 'bg-amber-600',
      pair: t('df.pair.others')
    },
    dominante: {
      name: t('df.dominant'),
      description: t('df.dominant.desc'),
      color: 'bg-red-600',
      pair: t('df.pair.power')
    },
    colaborativo: {
      name: t('df.collaborative'),
      description: t('df.collaborative.desc'),
      color: 'bg-cyan-500',
      pair: t('df.pair.power')
    },
    estructurado: {
      name: t('df.structured'),
      description: t('df.structured.desc'),
      color: 'bg-indigo-600',
      pair: t('df.pair.methodologies')
    },
    receptivo: {
      name: t('df.receptive'),
      description: t('df.receptive.desc'),
      color: 'bg-violet-500',
      pair: t('df.pair.methodologies')
    }
  }), [language, t]);

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    fetchResults();
  }, [token, sessionStatus]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/external-driving-forces-evaluations/${token}?results=true`);
      const data = await response.json();
      
      if (!response.ok) {
        if (data.requireAuth) {
          setRequireAuth(true);
        }
        setError(data.error || t('results.error'));
        setIsLoading(false);
        return;
      }
      
      setEvaluation(data.evaluation);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError(t('results.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return 'text-emerald-600 bg-emerald-100';
    if (percentile >= 60) return 'text-green-600 bg-green-100';
    if (percentile >= 40) return 'text-amber-600 bg-amber-100';
    if (percentile >= 20) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPercentileBarColor = (percentile: number) => {
    if (percentile >= 80) return 'bg-emerald-500';
    if (percentile >= 60) return 'bg-green-500';
    if (percentile >= 40) return 'bg-amber-500';
    if (percentile >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">{t('results.loading')}</p>
          </div>
        </main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  if (requireAuth || (error && !session)) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <Lock className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.restrictedAccess')}</h2>
              <p className="text-gray-600 mb-6">
                {t('results.restrictedMessage')}
              </p>
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.error')}</h2>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.notFound')}</h2>
              <p className="text-gray-600">{t('results.notFoundMessage')}</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  if (evaluation.status === 'PENDING') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.pendingEvaluation')}</h2>
              <p className="text-gray-600 mb-4">
                <strong>{evaluation.recipientName}</strong> {t('results.pendingMessage')}
              </p>
              <Button variant="outline" onClick={() => router.push('/external-driving-forces-evaluations')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('results.backToEvaluations')}
              </Button>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  if (!evaluation.result) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.resultsNotAvailable')}</h2>
              <p className="text-gray-600">{t('results.processingMessage')}</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  const result = evaluation.result;
  const senderName = evaluation.senderUser.name || 
    `${evaluation.senderUser.firstName || ''} ${evaluation.senderUser.lastName || ''}`.trim();

  const allMotivators = [
    { key: 'intelectual', percentile: result.intelectualPercentile },
    { key: 'instintivo', percentile: result.instintivoPercentile },
    { key: 'practico', percentile: result.practicoPercentile },
    { key: 'altruista', percentile: result.altruistaPercentile },
    { key: 'armonioso', percentile: result.armoniosoPercentile },
    { key: 'objetivo', percentile: result.objetivoPercentile },
    { key: 'benevolo', percentile: result.benevoloPercentile },
    { key: 'intencional', percentile: result.intencionalPercentile },
    { key: 'dominante', percentile: result.dominantePercentile },
    { key: 'colaborativo', percentile: result.colaborativoPercentile },
    { key: 'estructurado', percentile: result.estructuradoPercentile },
    { key: 'receptivo', percentile: result.receptivoPercentile },
  ].sort((a, b) => b.percentile - a.percentile);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      <BrandingHeader />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/external-driving-forces-evaluations')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('results.backToEvaluations')}
          </Button>

          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t('results.df.title')}</h1>
                  <p className="text-purple-100">{evaluation.title}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{evaluation.recipientName}</h2>
                    <p className="text-sm text-gray-500">{evaluation.recipientEmail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                    {result.motivationalProfile}
                  </Badge>
                  {evaluation.completedAt && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center justify-end gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(evaluation.completedAt)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-green-50 border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Flame className="w-5 h-5" />
                    {t('results.df.primaryMotivators')}
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    {t('results.df.primaryMotivatorsDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.primaryMotivators.map((motivator, index) => {
                      const key = motivator.toLowerCase();
                      const info = motivatorInfo[key as keyof typeof motivatorInfo];
                      const percentile = allMotivators.find(m => m.key === key)?.percentile || 0;
                      
                      return (
                        <div key={motivator} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${info?.color || 'bg-gray-500'}`}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-gray-900">{info?.name || motivator}</span>
                                <span className="text-sm font-medium text-green-700">{percentile.toFixed(0)}%</span>
                              </div>
                              <p className="text-sm text-gray-600">{info?.description}</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentile}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    {t('results.df.fullProfile')}
                  </CardTitle>
                  <CardDescription>
                    {t('results.df.fullProfileDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {allMotivators.map(({ key, percentile }) => {
                      const info = motivatorInfo[key as keyof typeof motivatorInfo];
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${info?.color || 'bg-gray-400'}`} />
                              <span className="font-medium text-gray-700">{info?.name || key}</span>
                              <span className="text-xs text-gray-500">({info?.pair})</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPercentileColor(percentile)}`}>
                              {percentile.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${getPercentileBarColor(percentile)} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${percentile}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-amber-50 border-amber-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800 text-lg">
                      <TrendingUp className="w-4 h-4" />
                      {t('results.df.situationalMotivators')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.situationalMotivators.map((motivator) => {
                        const key = motivator.toLowerCase();
                        const info = motivatorInfo[key as keyof typeof motivatorInfo];
                        return (
                          <li key={motivator} className="flex items-center gap-2 text-amber-700">
                            <div className={`w-2 h-2 rounded-full ${info?.color || 'bg-gray-400'}`} />
                            <span className="text-sm">{info?.name || motivator}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-50 border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-700 text-lg">
                      <TrendingDown className="w-4 h-4" />
                      {t('results.df.indifferentMotivators')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.indifferentMotivators.map((motivator) => {
                        const key = motivator.toLowerCase();
                        const info = motivatorInfo[key as keyof typeof motivatorInfo];
                        return (
                          <li key={motivator} className="flex items-center gap-2 text-gray-600">
                            <div className={`w-2 h-2 rounded-full ${info?.color || 'bg-gray-400'}`} />
                            <span className="text-sm">{info?.name || motivator}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
                  <h3 className="text-lg font-bold mb-1">{t('results.df.primaryMotivator')}</h3>
                  <div className="text-3xl font-bold mb-2">
                    {motivatorInfo[result.topMotivator.toLowerCase() as keyof typeof motivatorInfo]?.name || result.topMotivator}
                  </div>
                  <p className="text-purple-100 text-sm">
                    {motivatorInfo[result.topMotivator.toLowerCase() as keyof typeof motivatorInfo]?.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{t('results.df.info')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{t('results.df.evaluated')}</div>
                      <div className="text-xs text-gray-600">{evaluation.recipientName}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{t('results.sentBy')}</div>
                      <div className="text-xs text-gray-600">{senderName}</div>
                    </div>
                  </div>

                  {evaluation.completedAt && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{t('results.completed')}</div>
                        <div className="text-xs text-gray-600">
                          {formatDate(evaluation.completedAt)}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-500 mb-2">{t('results.df.motivationalProfile')}</div>
                    <div className="text-xl font-bold text-purple-600">{result.motivationalProfile}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    {t('results.df.top4Motivators')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[result.topMotivator, result.secondMotivator, result.thirdMotivator, result.fourthMotivator]
                      .filter(Boolean)
                      .map((motivator, index) => {
                        const key = (motivator || '').toLowerCase();
                        const info = motivatorInfo[key as keyof typeof motivatorInfo];
                        return (
                          <div key={motivator} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${info?.color || 'bg-gray-400'}`}>
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {info?.name || motivator}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <BrandingFooter showCTA={false} />
    </div>
  );
}
