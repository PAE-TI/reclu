'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  BarChart3,
  Brain,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface AnalysisResult {
  rankedCandidates: Array<{
    candidateId: string;
    candidateName: string;
    overallScore: number;
    fitPercentage: number;
    rankPosition: number;
    dimensionScores: Record<string, number>;
    strengths: string[];
    areasOfConcern: string[];
    recommendations: string[];
    compatibilityDetails: Array<{
      category: string;
      description: string;
      score: number;
      status: 'excellent' | 'good' | 'moderate' | 'low';
    }>;
  }>;
  summary: {
    totalCandidates: number;
    completedEvaluations: number;
    topCandidate: { name: string; score: number } | null;
    averageScore: number;
    scoreDistribution: { excellent: number; good: number; moderate: number; low: number };
    recommendationSummary: string;
  };
  analysisLanguage?: string;
}

interface CampaignAnalysisDashboardProps {
  analysisResult: AnalysisResult;
  language: string;
  t: (key: string) => string;
  analyzing: boolean;
  onReanalyze: () => void;
}

const scoreBands = [
  { key: 'excellent', labelEs: 'Excelente', labelEn: 'Excellent', color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { key: 'good', labelEs: 'Bueno', labelEn: 'Good', color: '#2563eb', bg: 'bg-blue-50', border: 'border-blue-200' },
  { key: 'moderate', labelEs: 'Moderado', labelEn: 'Moderate', color: '#d97706', bg: 'bg-amber-50', border: 'border-amber-200' },
  { key: 'low', labelEs: 'Bajo', labelEn: 'Low', color: '#dc2626', bg: 'bg-red-50', border: 'border-red-200' },
];

const dimensionMeta = [
  { key: 'disc', label: 'DISC', short: 'D' },
  { key: 'drivingForces', label: 'Motivaciones', short: 'F' },
  { key: 'eq', label: 'EQ', short: 'EQ' },
  { key: 'dna', label: 'DNA-25', short: 'DNA' },
  { key: 'acumen', label: 'Juicio', short: 'J' },
  { key: 'values', label: 'Valores', short: 'V' },
  { key: 'stress', label: 'Resiliencia', short: 'R' },
];

export default function CampaignAnalysisDashboard({
  analysisResult,
  language,
  t,
  analyzing,
  onReanalyze,
}: CampaignAnalysisDashboardProps) {
  const completedCandidates = analysisResult.rankedCandidates.filter(candidate => candidate.overallScore > 0);

  const scoreDistributionData = scoreBands.map(band => ({
    ...band,
    label: language === 'en' ? band.labelEn : band.labelEs,
    value: analysisResult.summary.scoreDistribution[band.key as keyof AnalysisResult['summary']['scoreDistribution']],
  }));

  const topCandidatesData = useMemo(
    () =>
      completedCandidates
        .slice(0, 5)
        .map(candidate => ({
          name: candidate.candidateName,
          score: candidate.overallScore,
        }))
        .reverse(),
    [completedCandidates]
  );

  const dimensionAverageData = useMemo(() => {
    const withScores = completedCandidates.filter(candidate => candidate.overallScore > 0);
    return dimensionMeta
      .map(dimension => {
        const values = withScores
          .map(candidate => candidate.dimensionScores?.[dimension.key])
          .filter((value): value is number => typeof value === 'number' && value > 0);
        const average = values.length
          ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
          : 0;
        return {
          ...dimension,
          value: average,
        };
      })
      .filter(item => item.value > 0);
  }, [completedCandidates]);

  const dimensionInsights = useMemo(() => {
    if (!dimensionAverageData.length) return null;
    const strongest = [...dimensionAverageData].sort((a, b) => b.value - a.value)[0];
    const weakest = [...dimensionAverageData].sort((a, b) => a.value - b.value)[0];
    return { strongest, weakest };
  }, [dimensionAverageData]);

  const averageScore = analysisResult.summary.averageScore;
  const completionRate = analysisResult.summary.totalCandidates > 0
    ? Math.round((analysisResult.summary.completedEvaluations / analysisResult.summary.totalCandidates) * 100)
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-100';
    if (score >= 65) return 'bg-blue-100';
    if (score >= 50) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              {t('campaigns.detail.summary')}
            </CardTitle>
            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              {analysisResult.summary.recommendationSummary}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-white border border-indigo-200 text-indigo-700">
              <Users className="w-3 h-3 mr-1" />
              {analysisResult.summary.totalCandidates} candidatos
            </Badge>
            <Badge className="bg-white border border-emerald-200 text-emerald-700">
              <ShieldCheck className="w-3 h-3 mr-1" />
              {analysisResult.summary.completedEvaluations} evaluados
            </Badge>
          </div>
        </div>

        {analysisResult.analysisLanguage && analysisResult.analysisLanguage !== language && (
          <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">{t('campaigns.detail.analysisInOtherLanguage')}</p>
              <p className="text-xs text-amber-700">El análisis se generó en otro idioma. Puedes volver a ejecutarlo para regenerarlo.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onReanalyze}
              disabled={analyzing}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              {analyzing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1" />}
              {t('campaigns.detail.reanalyze')}
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Promedio general</p>
                <p className={`mt-1 text-3xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}%</p>
              </div>
              <div className={`rounded-xl p-3 ${getScoreBg(averageScore)}`}>
                <Award className={`w-5 h-5 ${getScoreColor(averageScore)}`} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">Cobertura</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{completionRate}%</p>
            <p className="mt-1 text-sm text-gray-500">Evaluaciones completas sobre el total de candidatos</p>
          </div>

          <div className="rounded-2xl border border-white bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">Mejor perfil</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 line-clamp-1">
              {analysisResult.summary.topCandidate?.name || 'Sin datos'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {analysisResult.summary.topCandidate ? `${analysisResult.summary.topCandidate.score}% de ajuste` : 'Todavía no hay un candidato líder'}
            </p>
          </div>

          <div className="rounded-2xl border border-white bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">Lectura ejecutiva</p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {dimensionInsights
                ? `La fortaleza más alta es ${dimensionInsights.strongest.label} y la brecha principal está en ${dimensionInsights.weakest.label}.`
                : 'Aún no hay suficientes datos para un diagnóstico por dimensiones.'}
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Distribución de ajuste
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }}
                    formatter={(value: number) => [`${value}`, 'Candidatos']}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {scoreDistributionData.map(entry => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                Perfil promedio por dimensión
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={dimensionAverageData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="short" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Promedio"
                    dataKey="value"
                    stroke="#4f46e5"
                    fill="#818cf8"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }}
                    formatter={(value: number) => [`${value}%`, 'Promedio']}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-600" />
                Top 5 candidatos
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCandidatesData} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }}
                    formatter={(value: number) => [`${value}%`, 'Ajuste']}
                  />
                  <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                    {topCandidatesData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={index === topCandidatesData.length - 1 ? '#059669' : '#6366f1'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Fortalezas y alertas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dimensionInsights ? (
                  <>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-emerald-700">Fortaleza principal</p>
                      <p className="mt-1 text-lg font-semibold text-emerald-900">
                        {dimensionInsights.strongest.label}
                      </p>
                      <p className="text-sm text-emerald-700">
                        Promedio de {dimensionInsights.strongest.value}% entre los candidatos completados.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-amber-700">Brecha a revisar</p>
                      <p className="mt-1 text-lg font-semibold text-amber-900">
                        {dimensionInsights.weakest.label}
                      </p>
                      <p className="text-sm text-amber-700">
                        Promedio de {dimensionInsights.weakest.value}%. Conviene validar si este eje es crítico para el cargo.
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No hay suficiente información para derivar patrones por dimensión.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Resumen de decisión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700">{analysisResult.summary.recommendationSummary}</p>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Lectura rápida</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {analysisResult.summary.scoreDistribution.excellent > 0
                      ? `Hay ${analysisResult.summary.scoreDistribution.excellent} perfiles de alto ajuste listos para avanzar.`
                      : 'No hay perfiles de ajuste excelente; conviene revisar brechas y ampliar el pool si es necesario.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {scoreDistributionData.map(band => (
            <div key={band.key} className={`rounded-2xl border ${band.border} ${band.bg} p-4`}>
              <p className="text-xs uppercase tracking-wide text-gray-600">{band.label}</p>
              <p className="mt-1 text-3xl font-bold" style={{ color: band.color }}>{band.value}</p>
              <p className="text-xs text-gray-500">Candidatos en este rango</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
