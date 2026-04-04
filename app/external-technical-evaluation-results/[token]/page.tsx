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
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Reclu</h1>
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
  const showBrandingShell = !session;

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requireAuth, setRequireAuth] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const result = evaluation?.result || null;
  const categoryEntries = useMemo(
    () => Object.entries(result?.categoryScores || {}).sort(([, a], [, b]) => b - a),
    [result]
  );
  const difficultyLevels = useMemo(
    () => [
      { key: 'easy', label: t('results.technical.easy'), data: result?.difficultyBreakdown?.easy },
      { key: 'medium', label: t('results.technical.medium'), data: result?.difficultyBreakdown?.medium },
      { key: 'hard', label: t('results.technical.hard'), data: result?.difficultyBreakdown?.hard },
    ],
    [result, t]
  );
  const analysis = useMemo(() => {
    if (!result) return null;

    const score = Math.round(result.totalScore);
    const bestCategory = categoryEntries.length > 0 ? categoryEntries[0] : null;
    const weakestCategory = categoryEntries.length > 0 ? categoryEntries[categoryEntries.length - 1] : null;
    const easy = result.difficultyBreakdown?.easy;
    const medium = result.difficultyBreakdown?.medium;
    const hard = result.difficultyBreakdown?.hard;
    const easyPct = easy && easy.total > 0 ? Math.round((easy.correct / easy.total) * 100) : null;
    const mediumPct = medium && medium.total > 0 ? Math.round((medium.correct / medium.total) * 100) : null;
    const hardPct = hard && hard.total > 0 ? Math.round((hard.correct / hard.total) * 100) : null;

    let label = '';
    let tone: 'emerald' | 'sky' | 'amber' | 'orange' | 'red' = 'sky';
    let summary = '';
    let recommendation = '';

    if (score >= 85) {
      label = language === 'es' ? 'Desempeño sobresaliente' : 'Outstanding performance';
      tone = 'emerald';
      summary = language === 'es'
        ? 'La persona demuestra un dominio técnico muy sólido y consistente. El resultado indica que puede resolver con seguridad la mayor parte de los retos del cargo y, además, sostener un rendimiento alto en escenarios complejos.'
        : 'The candidate shows very solid and consistent technical command. The result suggests they can handle most role challenges confidently and sustain high performance in complex scenarios.';
      recommendation = language === 'es'
        ? 'Es un perfil para avanzar con alta confianza. Conviene enfocarlo en profundidad técnica, impacto en negocio y ajuste con el equipo.'
        : 'This is a profile to advance with high confidence. Focus the next step on technical depth, business impact, and team fit.';
    } else if (score >= 70) {
      label = language === 'es' ? 'Perfil sólido' : 'Solid profile';
      tone = 'sky';
      summary = language === 'es'
        ? 'El desempeño es bueno y consistente. La base técnica está presente, aunque todavía hay áreas puntuales donde puede ganar precisión o velocidad de respuesta.'
        : 'Performance is good and consistent. The technical base is present, although there are still specific areas where the candidate can gain precision or speed.';
      recommendation = language === 'es'
        ? 'Puede avanzar en el proceso, idealmente contrastando con una entrevista técnica enfocada en los temas de menor puntaje.'
        : 'They can advance in the process, ideally paired with a technical interview focused on the lower-scoring topics.';
    } else if (score >= 55) {
      label = language === 'es' ? 'Base en desarrollo' : 'Developing base';
      tone = 'amber';
      summary = language === 'es'
        ? 'Existe una base funcional, pero el dominio todavía es irregular. El resultado sugiere que puede desempeñarse mejor en contextos guiados que en escenarios técnicos exigentes.'
        : 'There is a functional base, but mastery is still uneven. The result suggests the candidate may perform better in guided contexts than in demanding technical scenarios.';
      recommendation = language === 'es'
        ? 'Recomendado evaluar con preguntas prácticas adicionales o una prueba complementaria en los temas más débiles.'
        : 'Recommended to assess with additional practical questions or a complementary test in the weakest topics.';
    } else if (score >= 40) {
      label = language === 'es' ? 'Requiere refuerzo' : 'Needs reinforcement';
      tone = 'orange';
      summary = language === 'es'
        ? 'El resultado muestra brechas importantes en el dominio técnico. Hay señales de comprensión parcial, pero todavía no existe la consistencia necesaria para desempeñarse con autonomía total.'
        : 'The result shows important gaps in technical command. There are signs of partial understanding, but not yet the consistency needed to perform fully autonomously.';
      recommendation = language === 'es'
        ? 'Lo más útil es revisar fundamentos, ejercicios prácticos y una segunda validación antes de tomar una decisión final.'
        : 'The best next step is to review fundamentals, practical exercises, and a second validation before making a final decision.';
    } else {
      label = language === 'es' ? 'Alto riesgo técnico' : 'High technical risk';
      tone = 'red';
      summary = language === 'es'
        ? 'El nivel observado indica una brecha muy amplia frente a lo esperado para el cargo. La persona aún no muestra la base mínima consistente para resolver con soltura la mayoría de las preguntas.'
        : 'The observed level indicates a very wide gap versus the expected role requirements. The candidate has not yet shown a consistent minimum base to solve most questions comfortably.';
      recommendation = language === 'es'
        ? 'Conviene no avanzar sin una validación adicional o un plan claro de refuerzo, porque el riesgo de ejecución es alto.'
        : 'It is advisable not to advance without additional validation or a clear upskilling plan, because the execution risk is high.';
    }

    const difficultyComparison =
      easyPct !== null && hardPct !== null
        ? (hardPct >= easyPct - 10
            ? (language === 'es'
                ? 'La curva de dificultad se mantiene bastante estable, lo que sugiere buena base para afrontar preguntas complejas.'
                : 'Performance stays fairly stable across difficulty, suggesting a strong base for complex questions.')
            : (language === 'es'
                ? 'La caída en preguntas difíciles es visible, por lo que conviene reforzar el razonamiento avanzado y la toma de decisiones técnicas.'
                : 'There is a visible drop in hard questions, so advanced reasoning and technical decision-making should be reinforced.'))
        : null;

    return {
      label,
      tone,
      summary,
      recommendation,
      bestCategory: bestCategory ? { name: bestCategory[0], score: bestCategory[1] } : null,
      weakestCategory: weakestCategory ? { name: weakestCategory[0], score: weakestCategory[1] } : null,
      easyPct,
      mediumPct,
      hardPct,
      difficultyComparison,
    };
  }, [categoryEntries, language, result]);

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
        {showBrandingShell && <BrandingHeader />}
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-sky-500 mx-auto mb-4" />
            <p className="text-gray-600">{t('results.loading')}</p>
          </div>
        </main>
        {showBrandingShell && <BrandingFooter showCTA={false} />}
      </div>
    );
  }

  if (requireAuth || (error && !session)) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
        {showBrandingShell && <BrandingHeader />}
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
        {showBrandingShell && <BrandingFooter />}
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
        {showBrandingShell && <BrandingHeader />}
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
        {showBrandingShell && <BrandingFooter />}
      </div>
    );
  }

  if (error || !evaluation?.result) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
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

  // Pending evaluation
  if (evaluation.status === 'PENDING') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
        {showBrandingShell && <BrandingHeader />}
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
        {showBrandingShell && <BrandingFooter showCTA={false} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
      {showBrandingShell && <BrandingHeader />}
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
                <p className="text-sky-100">Reclu</p>
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
                  <Badge
                    className={
                      analysis.tone === 'emerald'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : analysis.tone === 'sky'
                          ? 'bg-sky-100 text-sky-700 border-sky-200'
                          : analysis.tone === 'amber'
                            ? 'bg-amber-100 text-amber-700 border-amber-200'
                            : analysis.tone === 'orange'
                              ? 'bg-orange-100 text-orange-700 border-orange-200'
                              : 'bg-red-100 text-red-700 border-red-200'
                    }
                  >
                    {analysis.label}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive Analysis */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-950 via-sky-950 to-indigo-950 text-white">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-300" />
              {language === 'es' ? 'Análisis ejecutivo' : 'Executive analysis'}
            </CardTitle>
            <CardDescription className="text-slate-200">
              {language === 'es'
                ? 'Lectura profesional del rendimiento, enfocada en lo que significa el resultado para la toma de decisiones.'
                : 'Professional reading of the score, focused on what the result means for decision-making.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className={`rounded-3xl border p-5 ${
              analysis.tone === 'emerald'
                ? 'border-emerald-200 bg-emerald-50'
                : analysis.tone === 'sky'
                  ? 'border-sky-200 bg-sky-50'
                  : analysis.tone === 'amber'
                    ? 'border-amber-200 bg-amber-50'
                    : analysis.tone === 'orange'
                      ? 'border-orange-200 bg-orange-50'
                      : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <BarChart3 className={`h-5 w-5 ${
                    analysis.tone === 'emerald'
                      ? 'text-emerald-600'
                      : analysis.tone === 'sky'
                        ? 'text-sky-600'
                        : analysis.tone === 'amber'
                          ? 'text-amber-600'
                          : analysis.tone === 'orange'
                            ? 'text-orange-600'
                            : 'text-red-600'
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {language === 'es' ? 'Lectura del resultado' : 'Result reading'}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">
                    {analysis.label}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white px-4 py-2 text-right shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {language === 'es' ? 'Puntaje' : 'Score'}
                  </p>
                  <p className={`text-3xl font-bold ${getScoreColor(result.totalScore)}`}>{Math.round(result.totalScore)}%</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-700">
                {analysis.summary}
              </p>
              <div className="mt-4 rounded-2xl border border-white/70 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {language === 'es' ? 'Recomendación para decisión' : 'Decision guidance'}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {analysis.recommendation}
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {language === 'es' ? 'Fortaleza principal' : 'Main strength'}
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {analysis.bestCategory?.name || (language === 'es' ? 'No hay datos' : 'No data')}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {analysis.bestCategory
                    ? `${Math.round(analysis.bestCategory.score)}% ${language === 'es' ? 'de acierto en esta área' : 'accuracy in this area'}`
                    : (language === 'es' ? 'No se pudo identificar una fortaleza clara.' : 'No clear strength could be identified.')}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {language === 'es' ? 'Área prioritaria' : 'Priority area'}
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {analysis.weakestCategory?.name || (language === 'es' ? 'No hay datos' : 'No data')}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {analysis.weakestCategory
                    ? `${Math.round(analysis.weakestCategory.score)}% ${language === 'es' ? 'de acierto. Requiere atención prioritaria.' : 'accuracy. Requires priority attention.'}`
                    : (language === 'es' ? 'No se detectaron brechas claras.' : 'No clear gaps detected.')}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {language === 'es' ? 'Lectura de dificultad' : 'Difficulty reading'}
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{language === 'es' ? 'Fácil' : 'Easy'}</span>
                    <span className="font-medium text-slate-900">{analysis.easyPct ?? '—'}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{language === 'es' ? 'Media' : 'Medium'}</span>
                    <span className="font-medium text-slate-900">{analysis.mediumPct ?? '—'}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{language === 'es' ? 'Difícil' : 'Hard'}</span>
                    <span className="font-medium text-slate-900">{analysis.hardPct ?? '—'}%</span>
                  </div>
                </div>
                {analysis.difficultyComparison && (
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {analysis.difficultyComparison}
                  </p>
                )}
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
                  <span className="text-sm text-gray-500">{language === 'es' ? 'Puntuación' : 'Score'}</span>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {analysis.label}
                </h3>
                <p className="text-gray-600 mb-4">
                  {analysis.summary}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className={
                    analysis.tone === 'emerald'
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      : analysis.tone === 'sky'
                        ? 'bg-sky-100 text-sky-700 border-sky-200'
                        : analysis.tone === 'amber'
                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : analysis.tone === 'orange'
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                  }>
                    {analysis.label}
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
      {showBrandingShell && <BrandingFooter />}
    </div>
  );
}
