'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Star,
  BarChart3,
  CheckCircle,
  Target,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  Users,
  Mail,
  Calendar,
  Sparkles,
  Shield,
  Award,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lock,
  Clock,
  User,
  Globe
} from 'lucide-react';
import Link from 'next/link';

// Branding Header Component
function BrandingHeader({ t, language, setLanguage }: { t: (key: string) => string; language: string; setLanguage: (lang: 'es' | 'en') => void }) {
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">{t('results.brand.discResults')}</span>
            </div>
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Branding Footer Component
function BrandingFooter({ showCTA = true, t }: { showCTA?: boolean; t: (key: string) => string }) {
  return (
    <footer className="mt-auto">
      {showCTA && (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">{t('results.footer.interestedTitle')}</h3>
            <p className="text-indigo-100 mb-4 text-sm">{t('results.footer.interestedSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg">
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

interface DISCResult {
  id: string;
  primaryStyle: string;
  secondaryStyle?: string;
  personalityType: string;
  styleIntensity: number;
  percentileD: number;
  percentileI: number;
  percentileS: number;
  percentileC: number;
}

interface Evaluation {
  id: string;
  title: string;
  description?: string;
  recipientName: string;
  recipientEmail: string;
  status: string;
  completedAt: string | null;
  senderUserId: string;
  result: DISCResult | null;
  senderUser: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
  };
}

const getDimensionColor = (dimension: string) => {
  switch (dimension) {
    case 'D': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', bar: 'bg-red-500' };
    case 'I': return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', bar: 'bg-yellow-500' };
    case 'S': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', bar: 'bg-green-500' };
    case 'C': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', bar: 'bg-blue-500' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', bar: 'bg-gray-500' };
  }
};

export default function ExternalEvaluationResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession() || {};
  const { language, setLanguage, t } = useLanguage();
  const token = params.token as string;

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requireAuth, setRequireAuth] = useState(false);

  // Build interpretations using translations
  const interpretations = useMemo(() => ({
    'D': {
      title: t('disc.d.title'),
      description: t('disc.d.description'),
      strengths: [t('disc.d.strength1'), t('disc.d.strength2'), t('disc.d.strength3'), t('disc.d.strength4'), t('disc.d.strength5')],
      challenges: [t('disc.d.challenge1'), t('disc.d.challenge2'), t('disc.d.challenge3'), t('disc.d.challenge4')],
      motivators: [t('disc.d.motivator1'), t('disc.d.motivator2'), t('disc.d.motivator3'), t('disc.d.motivator4'), t('disc.d.motivator5')],
      stressors: [t('disc.d.stressor1'), t('disc.d.stressor2'), t('disc.d.stressor3'), t('disc.d.stressor4'), t('disc.d.stressor5')]
    },
    'I': {
      title: t('disc.i.title'),
      description: t('disc.i.description'),
      strengths: [t('disc.i.strength1'), t('disc.i.strength2'), t('disc.i.strength3'), t('disc.i.strength4'), t('disc.i.strength5')],
      challenges: [t('disc.i.challenge1'), t('disc.i.challenge2'), t('disc.i.challenge3'), t('disc.i.challenge4')],
      motivators: [t('disc.i.motivator1'), t('disc.i.motivator2'), t('disc.i.motivator3'), t('disc.i.motivator4'), t('disc.i.motivator5')],
      stressors: [t('disc.i.stressor1'), t('disc.i.stressor2'), t('disc.i.stressor3'), t('disc.i.stressor4'), t('disc.i.stressor5')]
    },
    'S': {
      title: t('disc.s.title'),
      description: t('disc.s.description'),
      strengths: [t('disc.s.strength1'), t('disc.s.strength2'), t('disc.s.strength3'), t('disc.s.strength4'), t('disc.s.strength5')],
      challenges: [t('disc.s.challenge1'), t('disc.s.challenge2'), t('disc.s.challenge3'), t('disc.s.challenge4')],
      motivators: [t('disc.s.motivator1'), t('disc.s.motivator2'), t('disc.s.motivator3'), t('disc.s.motivator4'), t('disc.s.motivator5')],
      stressors: [t('disc.s.stressor1'), t('disc.s.stressor2'), t('disc.s.stressor3'), t('disc.s.stressor4'), t('disc.s.stressor5')]
    },
    'C': {
      title: t('disc.c.title'),
      description: t('disc.c.description'),
      strengths: [t('disc.c.strength1'), t('disc.c.strength2'), t('disc.c.strength3'), t('disc.c.strength4'), t('disc.c.strength5')],
      challenges: [t('disc.c.challenge1'), t('disc.c.challenge2'), t('disc.c.challenge3'), t('disc.c.challenge4')],
      motivators: [t('disc.c.motivator1'), t('disc.c.motivator2'), t('disc.c.motivator3'), t('disc.c.motivator4'), t('disc.c.motivator5')],
      stressors: [t('disc.c.stressor1'), t('disc.c.stressor2'), t('disc.c.stressor3'), t('disc.c.stressor4'), t('disc.c.stressor5')]
    }
  }), [t]);

  // Dimension labels for scores
  const dimensionLabels = useMemo(() => ([
    { key: 'D', label: t('disc.d'), desc: t('disc.d.desc') },
    { key: 'I', label: t('disc.i'), desc: t('disc.i.desc') },
    { key: 'S', label: t('disc.s'), desc: t('disc.s.desc') },
    { key: 'C', label: t('disc.c'), desc: t('disc.c.desc') }
  ]), [t]);

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    fetchResults();
  }, [token, sessionStatus]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/external-evaluations/${token}?results=true`);
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
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(t('results.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'en' ? 'en-US' : 'es-ES';
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <BrandingHeader t={t} language={language} setLanguage={setLanguage} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">{t('results.loading')}</p>
          </div>
        </main>
        <BrandingFooter showCTA={false} t={t} />
      </div>
    );
  }

  // Si requiere autenticación
  if (requireAuth || (error && !session)) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <BrandingHeader t={t} language={language} setLanguage={setLanguage} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <Lock className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.restrictedAccess')}</h2>
              <p className="text-gray-600 mb-6">
                {t('results.restrictedMessage')}
              </p>
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  {t('results.signIn')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter t={t} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <BrandingHeader t={t} language={language} setLanguage={setLanguage} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.error')}</h2>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter t={t} />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <BrandingHeader t={t} language={language} setLanguage={setLanguage} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.notFound')}</h2>
              <p className="text-gray-600">{t('results.notFoundMessage')}</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter t={t} />
      </div>
    );
  }

  // Si la evaluación está pendiente
  if (evaluation.status === 'PENDING') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <BrandingHeader t={t} language={language} setLanguage={setLanguage} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.pendingEvaluation')}</h2>
              <p className="text-gray-600 mb-4">
                <strong>{evaluation.recipientName}</strong> {t('results.pendingMessage')}
              </p>
              <Button variant="outline" onClick={() => router.push('/external-evaluations')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('results.backToEvaluations')}
              </Button>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter showCTA={false} t={t} />
      </div>
    );
  }

  // Si no hay resultados
  if (!evaluation.result) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <BrandingHeader t={t} language={language} setLanguage={setLanguage} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.resultsNotAvailable')}</h2>
              <p className="text-gray-600">{t('results.processingMessage')}</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter t={t} />
      </div>
    );
  }

  const result = evaluation.result;
  const interpretation = interpretations[result.primaryStyle as keyof typeof interpretations] || interpretations['D'];
  const primaryColor = getDimensionColor(result.primaryStyle);
  const senderName = `${evaluation.senderUser.firstName || ''} ${evaluation.senderUser.lastName || ''}`.trim();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <BrandingHeader t={t} language={language} setLanguage={setLanguage} />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push('/external-evaluations')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('results.backToEvaluations')}
          </Button>

          {/* Header Card */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t('results.disc.title')}</h1>
                  <p className="text-indigo-100">{evaluation.title}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{evaluation.recipientName}</h2>
                    <p className="text-sm text-gray-500">{evaluation.recipientEmail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${primaryColor.bg} ${primaryColor.text} ${primaryColor.border}`}>
                    {result.personalityType}
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
            {/* Main Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personality Type */}
              <Card className={`${primaryColor.bg} ${primaryColor.border} border-2 shadow-xl`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className={`text-2xl ${primaryColor.text} flex items-center gap-2`}>
                        <Star className="w-6 h-6" />
                        {interpretation.title}
                      </CardTitle>
                      <CardDescription className={primaryColor.text}>
                        {t('results.disc.dominantProfile')}
                      </CardDescription>
                    </div>
                    <div className="text-center">
                      <div className={`w-16 h-16 ${primaryColor.bg} ${primaryColor.border} border-2 rounded-full flex items-center justify-center`}>
                        <span className={`text-2xl font-bold ${primaryColor.text}`}>{result.primaryStyle}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-lg ${primaryColor.text} mb-4`}>
                    {interpretation.description}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className={`w-4 h-4 ${primaryColor.text}`} />
                    <span className={`font-medium ${primaryColor.text}`}>
                      {t('results.disc.styleIntensity')}: {result.styleIntensity.toFixed(1)}%
                    </span>
                  </div>
                  {result.secondaryStyle && (
                    <p className={`text-sm ${primaryColor.text}`}>
                      {t('results.disc.secondaryStyle')}: <strong>{result.secondaryStyle}</strong>
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* DISC Scores */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    {t('results.disc.scores')}
                  </CardTitle>
                  <CardDescription>
                    {t('results.disc.distribution')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { label: dimensionLabels[0].label, score: result.percentileD, color: getDimensionColor('D'), description: dimensionLabels[0].desc },
                      { label: dimensionLabels[1].label, score: result.percentileI, color: getDimensionColor('I'), description: dimensionLabels[1].desc },
                      { label: dimensionLabels[2].label, score: result.percentileS, color: getDimensionColor('S'), description: dimensionLabels[2].desc },
                      { label: dimensionLabels[3].label, score: result.percentileC, color: getDimensionColor('C'), description: dimensionLabels[3].desc }
                    ].map((dimension) => (
                      <div key={dimension.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">{dimension.label}</span>
                            <p className="text-sm text-gray-600">{dimension.description}</p>
                          </div>
                          <span className="text-lg font-bold text-gray-900">{dimension.score.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`${dimension.color.bar} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${dimension.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Strengths & Challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-green-50 border-green-200 border shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      {t('results.disc.strengths')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {interpretation.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-2 text-green-700">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-200 border shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <Target className="w-5 h-5" />
                      {t('results.disc.developmentAreas')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {interpretation.challenges.map((challenge, index) => (
                        <li key={index} className="flex items-center gap-2 text-amber-700">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                          <span className="text-sm">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Primary Style Card */}
              <Card className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-xl">
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
                  <h3 className="text-lg font-bold mb-1">{t('results.disc.primaryStyle')}</h3>
                  <div className="text-3xl font-bold mb-2">
                    {interpretation.title}
                  </div>
                  <p className="text-indigo-100 text-sm">
                    {t('results.disc.type')}: {result.personalityType}
                  </p>
                </CardContent>
              </Card>

              {/* Evaluation Info */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{t('results.evaluationInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{t('results.recipient')}</div>
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

                  <div className="text-center pt-4 border-t">
                    <div className="text-2xl font-bold text-indigo-600">{result.personalityType}</div>
                    <div className="text-sm text-gray-600">{t('results.disc.type')}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Motivators & Stressors */}
              <Card className="bg-blue-50 border-blue-200 border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
                    <TrendingUp className="w-4 h-4" />
                    {t('results.disc.motivators')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {interpretation.motivators.slice(0, 4).map((motivator, index) => (
                      <li key={index} className="flex items-center gap-2 text-blue-700">
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">{motivator}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200 border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800 text-lg">
                    <AlertTriangle className="w-4 h-4" />
                    {t('results.disc.stressors')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {interpretation.stressors.slice(0, 4).map((stressor, index) => (
                      <li key={index} className="flex items-center gap-2 text-red-700">
                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                        <span className="text-sm">{stressor}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <BrandingFooter showCTA={false} t={t} />
    </div>
  );
}
