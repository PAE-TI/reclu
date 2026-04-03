'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Zap, Users, MessageCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { useLanguage, Language } from '@/contexts/language-context';

interface EQData {
  id: string;
  totalScore: number;
  eqLevel: string;
  autoconcienciaPercentile: number;
  autorregulacionPercentile: number;
  motivacionPercentile: number;
  empatiaPercentile: number;
  habilidadesSocialesPercentile: number;
  strengths?: string[];
  developmentAreas?: string[];
  profile?: string;
}

interface EQChartProps {
  data: EQData;
  showDetails?: boolean;
  compact?: boolean;
  language?: Language;
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'MUY_ALTO': return 'bg-green-500';
    case 'ALTO': return 'bg-emerald-500';
    case 'MODERADO': return 'bg-yellow-500';
    case 'BAJO': return 'bg-orange-500';
    case 'MUY_BAJO': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getLevelLabel = (level: string, lang: Language) => {
  const isEn = lang === 'en';
  switch (level) {
    case 'MUY_ALTO': return isEn ? 'Very High' : 'Muy Alto';
    case 'ALTO': return isEn ? 'High' : 'Alto';
    case 'MODERADO': return isEn ? 'Moderate' : 'Moderado';
    case 'BAJO': return isEn ? 'Low' : 'Bajo';
    case 'MUY_BAJO': return isEn ? 'Very Low' : 'Muy Bajo';
    default: return level;
  }
};

const getDimensionLabels = (lang: Language) => {
  const isEn = lang === 'en';
  return {
    autoconciencia: { label: isEn ? 'Self-Awareness' : 'Autoconciencia', shortLabel: 'AC', icon: Brain, color: '#f43f5e' },
    autorregulacion: { label: isEn ? 'Self-Regulation' : 'Autorregulación', shortLabel: 'AR', icon: Zap, color: '#ec4899' },
    motivacion: { label: isEn ? 'Motivation' : 'Motivación', shortLabel: 'MO', icon: Heart, color: '#d946ef' },
    empatia: { label: isEn ? 'Empathy' : 'Empatía', shortLabel: 'EM', icon: Users, color: '#a855f7' },
    habilidadesSociales: { label: isEn ? 'Social Skills' : 'Hab. Sociales', shortLabel: 'HS', icon: MessageCircle, color: '#8b5cf6' },
  };
};

export default function EQChart({ data, showDetails = true, compact = false, language: propLanguage }: EQChartProps) {
  const { language: contextLanguage } = useLanguage();
  const language = propLanguage || contextLanguage;
  const dimensionLabels = getDimensionLabels(language);

  const radarData = [
    { dimension: dimensionLabels.autoconciencia.label, value: data.autoconcienciaPercentile, fullMark: 100 },
    { dimension: dimensionLabels.autorregulacion.label, value: data.autorregulacionPercentile, fullMark: 100 },
    { dimension: dimensionLabels.motivacion.label, value: data.motivacionPercentile, fullMark: 100 },
    { dimension: dimensionLabels.empatia.label, value: data.empatiaPercentile, fullMark: 100 },
    { dimension: dimensionLabels.habilidadesSociales.label, value: data.habilidadesSocialesPercentile, fullMark: 100 },
  ];

  const barData = [
    { name: 'AC', fullName: dimensionLabels.autoconciencia.label, value: data.autoconcienciaPercentile, color: '#f43f5e' },
    { name: 'AR', fullName: dimensionLabels.autorregulacion.label, value: data.autorregulacionPercentile, color: '#ec4899' },
    { name: 'MO', fullName: dimensionLabels.motivacion.label, value: data.motivacionPercentile, color: '#d946ef' },
    { name: 'EM', fullName: dimensionLabels.empatia.label, value: data.empatiaPercentile, color: '#a855f7' },
    { name: 'HS', fullName: dimensionLabels.habilidadesSociales.label, value: data.habilidadesSocialesPercentile, color: '#8b5cf6' },
  ];

  // Labels
  const eqTitle = language === 'es' ? 'Inteligencia Emocional' : 'Emotional Intelligence';
  const eqScoreLabel = language === 'es' ? 'Puntuación EQ' : 'EQ Score';
  const totalScoreLabel = language === 'es' ? 'Puntuación Total' : 'Total Score';
  const strengthsLabel = language === 'es' ? '💪 Fortalezas EQ' : '💪 EQ Strengths';
  const developmentAreasLabel = language === 'es' ? '📈 Áreas de Desarrollo' : '📈 Development Areas';
  const allAboveAverageLabel = language === 'es' ? 'Todas las dimensiones están por encima del promedio' : 'All dimensions are above average';
  const eqProfileLabel = language === 'es' ? '🎯 Perfil EQ' : '🎯 EQ Profile';

  // Sort by percentile to find strengths and areas to develop
  const sortedDimensions = [...barData].sort((a, b) => b.value - a.value);
  const topDimensions = sortedDimensions.slice(0, 2);
  const lowDimensions = sortedDimensions.filter(d => d.value < 50);

  if (compact) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-rose-600" />
              {eqTitle}
            </CardTitle>
            <Badge className={`text-white ${getLevelColor(data.eqLevel)}`}>
              {getLevelLabel(data.eqLevel, language)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-rose-600">{data.totalScore}</div>
              <div className="text-sm text-gray-500">{eqScoreLabel}</div>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="name" width={30} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value}%`,
                    props.payload.fullName
                  ]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-600" />
            {eqTitle} (EQ)
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-rose-600">{data.totalScore}</div>
              <div className="text-xs text-gray-500">{totalScoreLabel}</div>
            </div>
            <Badge className={`text-white px-3 py-1 ${getLevelColor(data.eqLevel)}`}>
              {getLevelLabel(data.eqLevel, language)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10 }}
                />
                <Radar
                  name="EQ"
                  dataKey="value"
                  stroke="#f43f5e"
                  fill="#f43f5e"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Dimension Bars */}
          <div className="space-y-3">
            {barData.map((dim, index) => {
              const Icon = Object.values(dimensionLabels)[index].icon;
              return (
                <div key={dim.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: dim.color }} />
                      <span className="text-sm font-medium text-gray-700">{dim.fullName}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: dim.color }}>
                      {dim.value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${dim.value}%`, backgroundColor: dim.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
            {/* Strengths */}
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-800 mb-2">{strengthsLabel}</h4>
              <div className="space-y-2">
                {topDimensions.map((dim) => (
                  <div key={dim.name} className="flex items-center gap-2">
                    <Badge className="bg-green-500 text-white">{dim.value}%</Badge>
                    <span className="text-sm text-green-700">{dim.fullName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Development Areas */}
            <div className="bg-amber-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-amber-800 mb-2">{developmentAreasLabel}</h4>
              <div className="space-y-2">
                {lowDimensions.length > 0 ? (
                  lowDimensions.map((dim) => (
                    <div key={dim.name} className="flex items-center gap-2">
                      <Badge className="bg-amber-500 text-white">{dim.value}%</Badge>
                      <span className="text-sm text-amber-700">{dim.fullName}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-amber-700">{allAboveAverageLabel}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {data.profile && (
          <div className="mt-4 p-4 bg-rose-50 rounded-xl">
            <h4 className="text-sm font-semibold text-rose-800 mb-1">{eqProfileLabel}</h4>
            <p className="text-sm text-rose-700">{data.profile}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
