'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileCode,
  AlertCircle,
  Loader2,
  ArrowLeft,
  User,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Shield,
  ArrowRight,
  Globe,
  Users,
  BarChart3,
  Briefcase
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
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">MotivaIQ</h1>
              <p className="text-xs text-gray-500">{t('results.brand.platform')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100">
              <FileCode className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-medium text-sky-600">{t('results.technical.headerBadge')}</span>
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
        <div className="bg-gradient-to-r from-sky-500 via-cyan-600 to-blue-600 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">{t('results.footer.interestedTitle')}</h3>
            <p className="text-sky-100 mb-4 text-sm">{t('results.technical.footerSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 bg-white text-sky-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-sky-50 transition-colors shadow-lg">
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
              <span className="text-sm">{t('results.technical.positionSpecific')}</span>
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

interface TechnicalResult {
  totalScore: number;
  correctAnswers: number;
  totalQuestions: number;
  performanceLevel: string;
  categoryScores?: Record<string, number>;
  difficultyBreakdown?: {
    easy?: { correct: number; total: number };
    medium?: { correct: number; total: number };
    hard?: { correct: number; total: number };
  };
  strengths?: string[];
  weaknesses?: string[];
  averageTimePerQuestion?: number;
}

interface Evaluation {
  id: string;
  recipientName: string;
  recipientEmail: string;
  jobPositionId: string;
  jobPositionTitle: string;
  status: string;
  completedAt: string | null;
  senderUser: {
    firstName: string | null;
    lastName: string | null;
    company: string | null;
  };
  result: TechnicalResult | null;
}

export default function ExternalTechnicalEvaluationResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession() || {};
  const { language, t } = useLanguage();
  const token = params.token as string;

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requireAuth, setRequireAuth] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Translated performance levels
  const performanceLevelLabels = useMemo(() => ({
    'EXCELENTE': t('technical.level.excellent'),
    'MUY_BUENO': t('technical.level.veryGood'),
    'BUENO': t('technical.level.good'),
    'ACEPTABLE': t('technical.level.acceptable'),
    'NECESITA_MEJORA': t('technical.level.needsImprovement'),
    'INSUFICIENTE': t('technical.level.insufficient')
  }), [language, t]);

  const performanceLevelDescriptions = useMemo(() => ({
    'EXCELENTE': t('technical.level.excellent.desc'),
    'MUY_BUENO': t('technical.level.veryGood.desc'),
    'BUENO': t('technical.level.good.desc'),
    'ACEPTABLE': t('technical.level.acceptable.desc'),
    'NECESITA_MEJORA': t('technical.level.needsImprovement.desc'),
    'INSUFICIENTE': t('technical.level.insufficient.desc')
  }), [language, t]);

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    if (sessionStatus === 'unauthenticated') {
      setRequireAuth(true);
      setIsLoading(false);
      return;
    }
    fetchResults();
  }, [token, sessionStatus]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/external-technical-evaluations/${token}/results`);
      const data = await response.json();
      
      if (response.status === 403) {
        setAccessDenied(true);
        setIsLoading(false);
        return;
      }
      
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

  const getPerformanceLevelColor = (level: string) => {
    switch (level) {
      case 'EXCELENTE': return 'bg-emerald-500';
      case 'MUY_BUENO': return 'bg-green-500';
      case 'BUENO': return 'bg-blue-500';
      case 'ACEPTABLE': return 'bg-amber-500';
      case 'NECESITA_MEJORA': return 'bg-orange-500';
      case 'INSUFICIENTE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'EXCELENTE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'MUY_BUENO': return 'bg-green-100 text-green-700 border-green-200';
      case 'BUENO': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ACEPTABLE': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'NECESITA_MEJORA': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'INSUFICIENTE': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getDifficultyInfo = (difficulty: string) => {
    const info: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
      'easy': {
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'text-green-500',
        bgColor: 'bg-green-100',
      },
      'medium': {
        icon: <Target className="w-5 h-5" />,
        color: 'text-amber-500',
        bgColor: 'bg-amber-100',
      },
      'hard': {
        icon: <Award className="w-5 h-5" />,
        color: 'text-red-500',
        bgColor: 'bg-red-100',
      },
    };
    return info[difficulty] || { icon: <CheckCircle />, color: 'text-gray-500', bgColor: 'bg-gray-100' };
  };

  if (isLoading || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-sky-500 mx-auto mb-4" />
            <p className="text-gray-600">{t('results.loading')}</p>
          </div>
        </main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  if (requireAuth || (error && !session)) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-sky-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.restrictedAccess')}</h2>
              <p className="text-gray-600 mb-6">
                {t('results.restrictedMessage')}
              </p>
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700">
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

  if (accessDenied) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.accessDenied')}</h2>
              <p className="text-gray-600 mb-6">
                {t('results.accessDeniedMessage')}
              </p>
              <Link href="/external-technical-evaluations">
                <Button className="bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700">
                  {t('results.technical.backToEvaluations')}
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
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

  // Pending evaluation
  if (evaluation.status === 'PENDING') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('results.technical.pending')}</h2>
              <p className="text-gray-600 mb-4">
                <strong>{evaluation.recipientName}</strong> {t('results.technical.pendingMessage')}
              </p>
              <Button variant="outline" onClick={() => router.push('/external-technical-evaluations')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('results.technical.backToEvaluations')}
              </Button>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  const result = evaluation.result;
  const categoryEntries = Object.entries(result.categoryScores || {}).sort(([, a], [, b]) => b - a);
  const difficultyLevels = [
    { key: 'easy', label: t('results.technical.easy'), data: result.difficultyBreakdown?.easy },
    { key: 'medium', label: t('results.technical.medium'), data: result.difficultyBreakdown?.medium },
    { key: 'hard', label: t('results.technical.hard'), data: result.difficultyBreakdown?.hard },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
      <BrandingHeader />
      <main className="flex-1 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/external-technical-evaluations')}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('results.technical.backToEvaluations')}
        </Button>

        {/* Header Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-cyan-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileCode className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t('results.technical.title')}</h1>
                <p className="text-sky-100">MotivaIQ</p>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{evaluation.recipientName}</h2>
                  <p className="text-sm text-gray-500">{evaluation.recipientEmail}</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <Badge className="bg-sky-100 text-sky-700 border-sky-200">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {evaluation.jobPositionTitle}
                </Badge>
                <div>
                  <Badge className={getPerformanceLevelBadgeColor(result.performanceLevel)}>
                    {performanceLevelLabels[result.performanceLevel as keyof typeof performanceLevelLabels] || result.performanceLevel}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Score Card */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-sky-500" />
              {t('results.technical.overallScore')}
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
                    stroke="url(#techGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.totalScore / 100) * 553} 553`}
                  />
                  <defs>
                    <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${getScoreColor(result.totalScore)}`}>{Math.round(result.totalScore)}%</span>
                  <span className="text-sm text-gray-500">{t('results.technical.percentile')}</span>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {performanceLevelLabels[result.performanceLevel as keyof typeof performanceLevelLabels] || result.performanceLevel}
                </h3>
                <p className="text-gray-600 mb-4">
                  {performanceLevelDescriptions[result.performanceLevel as keyof typeof performanceLevelDescriptions]}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className={getPerformanceLevelBadgeColor(result.performanceLevel)}>
                    {performanceLevelLabels[result.performanceLevel as keyof typeof performanceLevelLabels] || result.performanceLevel}
                  </Badge>
                  <Badge variant="outline" className="border-sky-200 text-sky-700">
                    {result.correctAnswers} {t('results.technical.of')} {result.totalQuestions} {t('results.technical.questions')}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Breakdown */}
        {result.difficultyBreakdown && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sky-500" />
                {t('results.technical.difficultyBreakdown')}
              </CardTitle>
              <CardDescription>
                {t('results.technical.difficultyBreakdownDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {difficultyLevels.map((diff) => {
                if (!diff.data) return null;
                const info = getDifficultyInfo(diff.key);
                const percentage = diff.data.total > 0 ? (diff.data.correct / diff.data.total) * 100 : 0;
                
                return (
                  <div key={diff.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${info.bgColor} ${info.color}`}>
                          {info.icon}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{diff.label}</span>
                          <p className="text-xs text-gray-500">
                            {diff.data.correct} {t('results.technical.of')} {diff.data.total} {t('results.technical.correctAnswers').toLowerCase()}
                          </p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Category Performance */}
        {categoryEntries.length > 0 && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sky-500" />
                {t('results.technical.categoryPerformance')}
              </CardTitle>
              <CardDescription>
                {t('results.technical.categoryPerformanceDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryEntries.map(([category, score]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{category}</span>
                    <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                      {Math.round(score)}%
                    </span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.strengths && result.strengths.length > 0 && (
            <Card className="shadow-lg border-0 border-t-4 border-t-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="w-5 h-5" />
                  {t('results.technical.strengths')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-100 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {result.weaknesses && result.weaknesses.length > 0 && (
            <Card className="shadow-lg border-0 border-t-4 border-t-amber-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <Target className="w-5 h-5" />
                  {t('results.technical.weaknesses')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-100 text-amber-600">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900">{weakness}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Time Stats */}
        {result.averageTimePerQuestion && result.averageTimePerQuestion > 0 && (
          <Card className="shadow-sm border-sky-100">
            <CardContent className="py-4">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Clock className="w-5 h-5 text-sky-500" />
                <span>{t('results.technical.avgTime')}: <strong>{Math.round(result.averageTimePerQuestion / 1000)} {t('results.technical.seconds')}</strong></span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Note Card */}
        <Card className="shadow-sm border-sky-100 bg-sky-50">
          <CardContent className="p-4">
            <p className="text-sm text-sky-700 text-center">
              <strong>{t('results.technical.note')}:</strong> {t('results.technical.noteText')}
            </p>
          </CardContent>
        </Card>
      </div>
      </main>
      <BrandingFooter />
    </div>
  );
}
