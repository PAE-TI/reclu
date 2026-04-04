'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResultSummaryCard } from '@/components/result-summary-card';
import {
  Heart,
  AlertCircle,
  Loader2,
  ArrowLeft,
  User,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Brain,
  Users,
  Zap,
  Smile,
  MessageSquare,
  Sparkles,
  Shield,
  ArrowRight,
  Globe
} from 'lucide-react';
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100">
              <Heart className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-medium text-rose-600">{t('results.brand.eqResults')}</span>
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

function BrandingFooter({ showCTA = true }: { showCTA?: boolean }) {
  const { t } = useLanguage();
  
  return (
    <footer className="mt-auto">
      {showCTA && (
        <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">{t('results.footer.interestedTitle')}</h3>
            <p className="text-rose-100 mb-4 text-sm">{t('results.footer.interestedSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 bg-white text-rose-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-rose-50 transition-colors shadow-lg">
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

interface EQResult {
  id: string;
  eqProfile: string;
  eqLevel: string;
  totalEQPercentile: number;
  selfAwarenessPercentile: number;
  selfRegulationPercentile: number;
  motivationPercentile: number;
  empathyPercentile: number;
  socialSkillsPercentile: number;
  primaryStrengths: string[];
  developmentAreas: string[];
}

interface Evaluation {
  id: string;
  title: string;
  recipientName: string;
  recipientEmail: string;
  status: string;
  completedAt: string | null;
  result: EQResult | null;
  senderUser: {
    firstName: string | null;
    lastName: string | null;
    company: string | null;
  };
}

export default function ExternalEQEvaluationResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession() || {};
  const { language, t } = useLanguage();
  const token = params.token as string;
  const showBrandingShell = !session;

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requireAuth, setRequireAuth] = useState(false);

  // Translated EQ levels
  const eqLevelLabels = useMemo(() => ({
    'Muy Alto': t('eq.veryHigh'),
    'Alto': t('eq.high'),
    'Moderado': t('eq.moderate'),
    'Bajo': t('eq.low'),
    'Muy Bajo': t('eq.veryLow')
  }), [language, t]);

  const eqLevelDescriptions = useMemo(() => ({
    'Muy Alto': t('eq.veryHigh.desc'),
    'Alto': t('eq.high.desc'),
    'Moderado': t('eq.moderate.desc'),
    'Bajo': t('eq.low.desc'),
    'Muy Bajo': t('eq.veryLow.desc')
  }), [language, t]);

  // Translated dimension names
  const dimensionNames = useMemo(() => ({
    'Autoconciencia': t('eq.selfAwareness'),
    'Autorregulación': t('eq.selfRegulation'),
    'Motivación': t('eq.motivation'),
    'Empatía': t('eq.empathy'),
    'Habilidades Sociales': t('eq.socialSkills')
  }), [language, t]);

  const dimensionDescriptions = useMemo(() => ({
    'Autoconciencia': t('eq.selfAwareness.desc'),
    'Autorregulación': t('eq.selfRegulation.desc'),
    'Motivación': t('eq.motivation.desc'),
    'Empatía': t('eq.empathy.desc'),
    'Habilidades Sociales': t('eq.socialSkills.desc')
  }), [language, t]);

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    fetchResults();
  }, [token, sessionStatus]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/external-eq-evaluations/${token}?results=true`);
      const data = await response.json();
      
      if (!response.ok) {
        if (data.requireAuth) {
          setRequireAuth(true);
        }
        setError(data.error || t('results.error'));
        setIsLoading(false);
        return;
      }
      setEvaluation(data);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError(t('results.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const getEQLevelColor = (level: string) => {
    switch (level) {
      case 'Muy Alto': return 'bg-emerald-500';
      case 'Alto': return 'bg-green-500';
      case 'Moderado': return 'bg-amber-500';
      case 'Bajo': return 'bg-orange-500';
      case 'Muy Bajo': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEQLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Muy Alto': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Alto': return 'bg-green-100 text-green-700 border-green-200';
      case 'Moderado': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Bajo': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Muy Bajo': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDimensionInfo = (dimension: string) => {
    const info: Record<string, { icon: React.ReactNode; color: string }> = {
      'Autoconciencia': {
        icon: <Brain className="w-5 h-5" />,
        color: 'text-red-500 bg-red-100',
      },
      'Autorregulación': {
        icon: <Target className="w-5 h-5" />,
        color: 'text-orange-500 bg-orange-100',
      },
      'Motivación': {
        icon: <Zap className="w-5 h-5" />,
        color: 'text-yellow-600 bg-yellow-100',
      },
      'Empatía': {
        icon: <Smile className="w-5 h-5" />,
        color: 'text-green-500 bg-green-100',
      },
      'Habilidades Sociales': {
        icon: <MessageSquare className="w-5 h-5" />,
        color: 'text-blue-500 bg-blue-100',
      },
    };
    return info[dimension] || { icon: <Heart />, color: 'text-gray-500 bg-gray-100' };
  };

  if (isLoading || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        {showBrandingShell && <BrandingHeader />}
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-rose-500 mx-auto mb-4" />
            <p className="text-gray-600">{t('results.loading')}</p>
          </div>
        </main>
        {showBrandingShell && <BrandingFooter showCTA={false} />}
      </div>
    );
  }

  if (requireAuth || (error && !session)) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        {showBrandingShell && <BrandingHeader />}
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-rose-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.restrictedAccess')}</h2>
              <p className="text-gray-600 mb-6">
                {t('results.restrictedMessage')}
              </p>
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700">
                  {t('results.signIn')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        {showBrandingShell && <BrandingFooter />}
      </div>
    );
  }

  if (error || !evaluation?.result) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        {showBrandingShell && <BrandingHeader />}
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.error')}</h2>
              <p className="text-gray-600">{error || t('results.resultsNotAvailable')}</p>
            </CardContent>
          </Card>
        </main>
        {showBrandingShell && <BrandingFooter />}
      </div>
    );
  }

  const result = evaluation.result;
  const dimensions = [
    { name: 'Autoconciencia', percentile: result.selfAwarenessPercentile },
    { name: 'Autorregulación', percentile: result.selfRegulationPercentile },
    { name: 'Motivación', percentile: result.motivationPercentile },
    { name: 'Empatía', percentile: result.empathyPercentile },
    { name: 'Habilidades Sociales', percentile: result.socialSkillsPercentile },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {showBrandingShell && <BrandingHeader />}
      <main className="flex-1 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/external-eq-evaluations')}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('results.backToEvaluations')}
        </Button>

        <ResultSummaryCard
          accentClassName="bg-gradient-to-r from-rose-500 to-pink-600"
          icon={<Heart className="w-8 h-8 text-white" />}
          title={t('results.eq.title')}
          subtitle={evaluation.recipientName}
          right={
            <Badge className={getEQLevelBadgeColor(result.eqLevel)}>
              {t('results.eq.level')}: {eqLevelLabels[result.eqLevel as keyof typeof eqLevelLabels] || result.eqLevel}
            </Badge>
          }
        />

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-rose-500" />
              {t('results.eq.overallScore')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="12"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.totalEQPercentile / 100) * 553} 553`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">{result.totalEQPercentile}</span>
                  <span className="text-sm text-gray-500">{t('results.eq.percentile')}</span>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{result.eqProfile}</h3>
                <p className="text-gray-600 mb-4">
                  {eqLevelDescriptions[result.eqLevel as keyof typeof eqLevelDescriptions]}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className={getEQLevelBadgeColor(result.eqLevel)}>
                    {eqLevelLabels[result.eqLevel as keyof typeof eqLevelLabels] || result.eqLevel}
                  </Badge>
                  <Badge variant="outline" className="border-rose-200 text-rose-700">
                    {t('results.eq.topPercentile')} {100 - result.totalEQPercentile}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-500" />
              {t('results.eq.dimensionBreakdown')}
            </CardTitle>
            <CardDescription>
              {t('results.eq.dimensionBreakdownDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {dimensions.map((dim) => {
              const info = getDimensionInfo(dim.name);
              const isStrength = result.primaryStrengths.includes(dim.name);
              const isDevelopment = result.developmentAreas.includes(dim.name);
              
              return (
                <div key={dim.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${info.color}`}>
                        {info.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {dimensionNames[dim.name as keyof typeof dimensionNames] || dim.name}
                          </span>
                          {isStrength && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {t('results.eq.strength')}
                            </Badge>
                          )}
                          {isDevelopment && (
                            <Badge className="bg-amber-100 text-amber-700 text-xs">
                              <TrendingDown className="w-3 h-3 mr-1" />
                              {t('results.eq.develop')}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {dimensionDescriptions[dim.name as keyof typeof dimensionDescriptions]}
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{dim.percentile}%</span>
                  </div>
                  <Progress 
                    value={dim.percentile} 
                    className="h-3"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 border-t-4 border-t-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <TrendingUp className="w-5 h-5" />
                {t('results.eq.primaryStrengths')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.primaryStrengths.map((strength, index) => {
                  const info = getDimensionInfo(strength);
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${info.color}`}>
                        {info.icon}
                      </div>
                      <span className="font-medium text-gray-900">
                        {dimensionNames[strength as keyof typeof dimensionNames] || strength}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 border-t-4 border-t-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <Target className="w-5 h-5" />
                {t('results.eq.developmentAreas')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.developmentAreas.map((area, index) => {
                  const info = getDimensionInfo(area);
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${info.color}`}>
                        {info.icon}
                      </div>
                      <span className="font-medium text-gray-900">
                        {dimensionNames[area as keyof typeof dimensionNames] || area}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-rose-100 bg-rose-50">
          <CardContent className="p-4">
            <p className="text-sm text-rose-700 text-center">
              <strong>{t('results.eq.note')}:</strong> {t('results.eq.noteText')}
            </p>
          </CardContent>
        </Card>
      </div>
      </main>
      {showBrandingShell && <BrandingFooter />}
    </div>
  );
}
