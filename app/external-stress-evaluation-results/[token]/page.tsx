'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Sparkles, 
  Shield, 
  Award, 
  Users, 
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Heart,
  Zap,
  LifeBuoy,
  Scale,
  Target,
  Brain,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';


interface StressResult {
  estresLaboralScore: number;
  capacidadRecuperacionScore: number;
  manejoEmocionalScore: number;
  equilibrioVidaScore: number;
  resilienciaScore: number;
  nivelEstresGeneral: number;
  indiceResiliencia: number;
  capacidadAdaptacion: number;
  totalStressScore: number;
  stressLevel: string;
  resilienceLevel: string;
  stressProfile: string;
  riskFactors: string[];
  protectiveFactors: string[];
  primaryStrengths: string[];
  developmentAreas: string[];
}

interface EvaluationData {
  id: string;
  title: string;
  recipientName: string;
  recipientEmail: string;
  status: string;
  completedAt?: string;
}

function BrandingHeader() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">Reclu</h1>
              <p className="text-xs text-gray-500">{t('results.brand.platform')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100">
              <Activity className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-medium text-rose-600">{t('results.brand.stressResults')}</span>
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

function BrandingFooter() {
  const { t } = useLanguage();
  
  return (
    <footer className="mt-auto">
      <div className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-xl font-bold text-white mb-2">{t('results.stress.wantTeamEval')}</h3>
          <p className="text-rose-100 mb-4 text-sm">{t('results.stress.discoverAll')}</p>
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
      <div className="bg-gray-900 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
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

export default function ExternalStressResults() {
  const params = useParams();
  const { data: session } = useSession() || {};
  const { language, t } = useLanguage();
  const token = params.token as string;
  const showBrandingShell = !session;

  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [result, setResult] = useState<StressResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const stressLevelLabels = useMemo(() => ({
    'Muy Bajo': t('stress.veryLow'),
    'Bajo': t('stress.low'),
    'Moderado': t('stress.moderate'),
    'Alto': t('stress.high'),
    'Muy Alto': t('stress.veryHigh'),
  }), [language, t]);

  const resilienceLevelLabels = useMemo(() => ({
    'Muy Alta': t('stress.veryHighRes'),
    'Alta': t('stress.highRes'),
    'Moderada': t('stress.moderateRes'),
    'Baja': t('stress.lowRes'),
    'Muy Baja': t('stress.veryLowRes'),
  }), [language, t]);

  useEffect(() => {
    fetchResults();
  }, [token]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/external-stress-evaluations/${token}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('results.error'));
        return;
      }
      setEvaluation(data.evaluation);
      setResult(data.result);
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

  function getStressLevelColor(level: string): string {
    switch (level) {
      case 'Muy Bajo': return 'bg-green-100 text-green-700 border-green-200';
      case 'Bajo': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Moderado': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Alto': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Muy Alto': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  function getResilienceLevelColor(level: string): string {
    switch (level) {
      case 'Muy Alta': return 'bg-green-100 text-green-700 border-green-200';
      case 'Alta': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Moderada': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Baja': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Muy Baja': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
        {showBrandingShell && <BrandingHeader />}
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <RefreshCw className="w-12 h-12 text-rose-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('results.loading')}</h2>
            </CardContent>
          </Card>
        </main>
        {showBrandingShell && <BrandingFooter />}
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        {showBrandingShell && <BrandingHeader />}
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('results.resultsNotAvailable')}</h1>
              <p className="text-lg text-gray-600 mb-6">{error || t('results.notFoundMessage')}</p>
            </CardContent>
          </Card>
        </main>
        {showBrandingShell && <BrandingFooter />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      {showBrandingShell && <BrandingHeader />}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {session && (
            <div className="mb-6">
              <Link href="/external-stress-evaluations">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t('results.backToEvaluations')}
                </Button>
              </Link>
            </div>
          )}

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-600 to-orange-600 rounded-2xl shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('results.stress.title')}</h1>
            <p className="text-lg text-gray-600">{evaluation?.recipientName}</p>
            {evaluation?.completedAt && (
              <p className="text-sm text-gray-500 mt-1">{t('results.completedOn')} {formatDate(evaluation.completedAt)}</p>
            )}
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6">
            <CardHeader className="bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-t-xl">
              <CardTitle className="text-xl flex items-center gap-2">
                <Brain className="w-5 h-5" />
                {t('results.stress.profile')}
              </CardTitle>
              <CardDescription className="text-rose-100">{result.stressProfile}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-2">{t('results.stress.stressLevel')}</div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getStressLevelColor(result.stressLevel)}`}>
                    {result.stressLevel === 'Muy Alto' || result.stressLevel === 'Alto' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : result.stressLevel === 'Moderado' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {stressLevelLabels[result.stressLevel as keyof typeof stressLevelLabels] || result.stressLevel}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-2">{result.nivelEstresGeneral}%</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-2">{t('results.stress.resilienceIndex')}</div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getResilienceLevelColor(result.resilienceLevel)}`}>
                    <Shield className="w-4 h-4" />
                    {resilienceLevelLabels[result.resilienceLevel as keyof typeof resilienceLevelLabels] || result.resilienceLevel}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-2">{result.indiceResiliencia}%</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-2">{t('results.stress.adaptationCapacity')}</div>
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-rose-600">{result.capacidadAdaptacion}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-rose-600" />
                {t('results.stress.dimensionAnalysis')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-gray-700">{t('stress.workStress')}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{result.estresLaboralScore}%</span>
                </div>
                <Progress value={result.estresLaboralScore} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">{t('results.stress.lowerIsBetter')}</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <LifeBuoy className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-gray-700">{t('stress.recoveryCapacity')}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{result.capacidadRecuperacionScore}%</span>
                </div>
                <Progress value={result.capacidadRecuperacionScore} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">{t('results.stress.higherIsBetter')}</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-purple-500" />
                    <span className="font-medium text-gray-700">{t('stress.emotionalManagement')}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{result.manejoEmocionalScore}%</span>
                </div>
                <Progress value={result.manejoEmocionalScore} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">{t('results.stress.higherIsBetter')}</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-700">{t('stress.lifeBalance')}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{result.equilibrioVidaScore}%</span>
                </div>
                <Progress value={result.equilibrioVidaScore} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">{t('results.stress.higherIsBetter')}</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span className="font-medium text-gray-700">{t('stress.resilienceGeneral')}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{result.resilienciaScore}%</span>
                </div>
                <Progress value={result.resilienciaScore} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">{t('results.stress.higherIsBetter')}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {result.riskFactors.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    {t('results.stress.riskFactors')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.riskFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-red-500 mt-1">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {result.protectiveFactors.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    {t('results.stress.protectiveFactors')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.protectiveFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-1">✓</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.primaryStrengths.length > 0 && (
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                    <Award className="w-5 h-5" />
                    {t('results.stress.yourStrengths')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.primaryStrengths.map((strength, idx) => (
                      <Badge key={idx} className="bg-green-100 text-green-700 border-green-200">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {result.developmentAreas.length > 0 && (
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                    <Target className="w-5 h-5" />
                    {t('results.dna.developmentAreas')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.developmentAreas.map((area, idx) => (
                      <Badge key={idx} className="bg-amber-100 text-amber-700 border-amber-200">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      {showBrandingShell && <BrandingFooter />}
    </div>
  );
}
