'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dna,
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
  Sparkles,
  Shield,
  ArrowRight,
  LogIn,
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100">
              <Dna className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">{t('results.brand.dnaResults')}</span>
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

export default function ExternalDNAEvaluationResults() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession() || {};
  const { language, t } = useLanguage();
  const token = params.token as string;
  const showBrandingShell = !session;

  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requireAuth, setRequireAuth] = useState(false);

  const categoryNames = useMemo(() => ({
    THINKING: t('dna.cat.thinking'),
    COMMUNICATION: t('dna.cat.communication'),
    LEADERSHIP: t('dna.cat.leadership'),
    RESULTS: t('dna.cat.results'),
    RELATIONSHIP: t('dna.cat.relationship'),
  }), [language, t]);

  const competencyLabels = useMemo(() => ({
    analyticalThinkingPercentile: t('dna.analyticalThinking'),
    problemSolvingPercentile: t('dna.problemSolving'),
    creativityPercentile: t('dna.creativity'),
    adaptabilityPercentile: t('dna.adaptability'),
    achievementOrientationPercentile: t('dna.achievementOrientation'),
    timeManagementPercentile: t('dna.timeManagement'),
    planningOrganizationPercentile: t('dna.planningOrganization'),
    attentionToDetailPercentile: t('dna.attentionToDetail'),
    customerServicePercentile: t('dna.customerService'),
    writtenCommunicationPercentile: t('dna.writtenCommunication'),
    verbalCommunicationPercentile: t('dna.verbalCommunication'),
    influencePercentile: t('dna.influence'),
    negotiationPercentile: t('dna.negotiation'),
    presentationSkillsPercentile: t('dna.presentationSkills'),
    teamworkPercentile: t('dna.teamwork'),
    leadershipPercentile: t('dna.leadershipComp'),
    developingOthersPercentile: t('dna.developingOthers'),
    conflictManagementPercentile: t('dna.conflictManagement'),
    decisionMakingPercentile: t('dna.decisionMaking'),
    strategicThinkingPercentile: t('dna.strategicThinking'),
    relationshipBuildingPercentile: t('dna.relationshipBuilding'),
    businessAcumenPercentile: t('dna.businessAcumen'),
    resultsOrientationPercentile: t('dna.resultsOrientation'),
    resiliencePercentile: t('dna.resilience'),
    accountabilityPercentile: t('dna.accountability'),
  }), [language, t]);

  const levelLabels = useMemo(() => ({
    'Muy Alto': t('level.veryHigh'),
    'Alto': t('level.high'),
    'Moderado': t('level.moderate'),
    'Bajo': t('level.low'),
    'Muy Bajo': t('level.veryLow'),
  }), [language, t]);

  useEffect(() => {
    fetchResults();
  }, [token, sessionStatus]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/external-dna-evaluations/${token}?results=true`);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
        {showBrandingShell && <BrandingHeader />}
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
              <p className="mt-4 text-gray-600">{t('results.loading')}</p>
            </CardContent>
          </Card>
        </main>
        {showBrandingShell && <BrandingFooter showCTA={false} />}
      </div>
    );
  }

  if (requireAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
        {showBrandingShell && <BrandingHeader />}
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <LogIn className="w-16 h-16 text-indigo-600 mx-auto" />
              <h2 className="mt-4 text-xl font-bold text-gray-900">{t('results.restrictedAccess')}</h2>
              <p className="mt-2 text-gray-600">{t('results.restrictedMessage')}</p>
              <Link href="/auth/signin">
                <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700">
                  <LogIn className="w-4 h-4 mr-2" /> {t('results.signIn')}
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
        {showBrandingShell && <BrandingHeader />}
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-lg border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="mt-4 text-xl font-bold text-gray-900">{t('results.error')}</h2>
              <p className="mt-2 text-gray-600">{error || t('results.resultsNotAvailable')}</p>
              <Button onClick={() => router.push('/external-dna-evaluations')} className="mt-6 bg-indigo-600 hover:bg-indigo-700">
                <ArrowLeft className="w-4 h-4 mr-2" /> {t('results.backToEvaluations')}
              </Button>
            </CardContent>
          </Card>
        </main>
        {showBrandingShell && <BrandingFooter />}
      </div>
    );
  }

  const result = evaluation.result;
  const competencies = Object.entries(result)
    .filter(([key]) => key.endsWith('Percentile') && !key.startsWith('total'))
    .map(([key, value]) => ({ key, label: competencyLabels[key as keyof typeof competencyLabels] || key, value: value as number }))
    .sort((a, b) => b.value - a.value);

  const topCompetencies = competencies.slice(0, 5);
  const bottomCompetencies = competencies.slice(-5).reverse();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Muy Alto': return 'bg-green-500';
      case 'Alto': return 'bg-emerald-500';
      case 'Moderado': return 'bg-yellow-500';
      case 'Bajo': return 'bg-orange-500';
      case 'Muy Bajo': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
      {showBrandingShell && <BrandingHeader />}
      <main className="flex-1 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.push('/external-dna-evaluations')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t('results.backToEvaluations')}
        </Button>

        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <Dna className="w-9 h-9 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t('results.dna.title')}</h1>
                  <p className="text-indigo-100">{evaluation.recipientName}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`${getLevelColor(result.dnaLevel)} text-white px-3 py-1`}>
                  {levelLabels[result.dnaLevel as keyof typeof levelLabels] || result.dnaLevel}
                </Badge>
                <p className="text-sm text-indigo-100 mt-2">{t('results.completedOn')}: {formatDate(evaluation.completedAt)}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                {t('results.dna.profile')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                    <circle cx="64" cy="64" r="56" fill="none" stroke="url(#dnaGradient)" strokeWidth="12"
                      strokeDasharray={`${result.totalDNAPercentile * 3.52} 352`} strokeLinecap="round" />
                    <defs>
                      <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-indigo-600">{Math.round(result.totalDNAPercentile)}</span>
                      <span className="text-sm text-gray-500 block">{t('results.dna.percentile')}</span>
                    </div>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{result.dnaProfile}</h3>
                <Badge className={`mt-2 ${getLevelColor(result.dnaLevel)} text-white`}>
                  {t('results.dna.level')} {levelLabels[result.dnaLevel as keyof typeof levelLabels] || result.dnaLevel}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                {t('results.dna.categoryScores')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'thinkingCategoryScore', label: categoryNames.THINKING, color: '#6366f1' },
                  { key: 'communicationCategoryScore', label: categoryNames.COMMUNICATION, color: '#8b5cf6' },
                  { key: 'leadershipCategoryScore', label: categoryNames.LEADERSHIP, color: '#ec4899' },
                  { key: 'resultsCategoryScore', label: categoryNames.RESULTS, color: '#f59e0b' },
                  { key: 'relationshipCategoryScore', label: categoryNames.RELATIONSHIP, color: '#10b981' },
                ].map((cat) => (
                  <div key={cat.key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                      <span className="text-sm font-bold text-gray-900">{Math.round(result[cat.key])}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${result[cat.key]}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <TrendingUp className="w-5 h-5" />
                {t('results.dna.top5')}
              </CardTitle>
              <CardDescription>{t('results.dna.top5Desc')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {topCompetencies.map((comp, index) => (
                  <div key={comp.key} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{comp.label}</span>
                        <span className="text-sm font-bold text-green-600">{Math.round(comp.value)}%</span>
                      </div>
                      <Progress value={comp.value} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <TrendingDown className="w-5 h-5" />
                {t('results.dna.developmentAreas')}
              </CardTitle>
              <CardDescription>{t('results.dna.developmentDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {bottomCompetencies.map((comp, index) => (
                  <div key={comp.key} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-amber-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{comp.label}</span>
                        <span className="text-sm font-bold text-amber-600">{Math.round(comp.value)}%</span>
                      </div>
                      <Progress value={comp.value} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dna className="w-5 h-5 text-indigo-600" />
              {t('results.dna.allCompetencies')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competencies.map((comp) => (
                <div key={comp.key} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 truncate">{comp.label}</span>
                    <span className={`text-sm font-bold ${comp.value >= 70 ? 'text-green-600' : comp.value >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {Math.round(comp.value)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${comp.value >= 70 ? 'bg-green-500' : comp.value >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${comp.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{evaluation.recipientName}</h3>
                <p className="text-sm text-gray-500">{evaluation.recipientEmail}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-gray-500">{t('results.sentBy')}</p>
                <p className="font-medium text-gray-900">{evaluation.senderUser?.firstName} {evaluation.senderUser?.lastName}</p>
                {evaluation.senderUser?.company && <p className="text-sm text-gray-500">{evaluation.senderUser.company}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </main>
      {showBrandingShell && <BrandingFooter />}
    </div>
  );
}
