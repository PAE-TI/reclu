'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dna, Brain, MessageSquare, Users, Target, Heart } from 'lucide-react';
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

interface DNAData {
  id: string;
  totalDNAPercentile: number;
  dnaLevel: string;
  dnaProfile: string;
  thinkingCategoryScore: number;
  communicationCategoryScore: number;
  leadershipCategoryScore: number;
  resultsCategoryScore: number;
  relationshipCategoryScore: number;
  primaryStrengths?: string[];
  developmentAreas?: string[];
  // Competency percentiles
  analyticalThinkingPercentile?: number;
  problemSolvingPercentile?: number;
  creativityPercentile?: number;
  adaptabilityPercentile?: number;
  achievementOrientationPercentile?: number;
  timeManagementPercentile?: number;
  planningOrganizationPercentile?: number;
  attentionToDetailPercentile?: number;
  customerServicePercentile?: number;
  writtenCommunicationPercentile?: number;
  verbalCommunicationPercentile?: number;
  influencePercentile?: number;
  negotiationPercentile?: number;
  presentationSkillsPercentile?: number;
  teamworkPercentile?: number;
  leadershipPercentile?: number;
  developingOthersPercentile?: number;
  conflictManagementPercentile?: number;
  decisionMakingPercentile?: number;
  strategicThinkingPercentile?: number;
  relationshipBuildingPercentile?: number;
  businessAcumenPercentile?: number;
  resultsOrientationPercentile?: number;
  resiliencePercentile?: number;
  accountabilityPercentile?: number;
}

interface DNAChartProps {
  data: DNAData;
  showDetails?: boolean;
  compact?: boolean;
  language?: Language;
}

const getCategoryLabels = (lang: Language) => {
  const isEn = lang === 'en';
  return {
    thinking: { label: isEn ? 'Thinking' : 'Pensamiento', shortLabel: 'PE', icon: Brain, color: '#6366f1' },
    communication: { label: isEn ? 'Communication' : 'Comunicación', shortLabel: 'CO', icon: MessageSquare, color: '#8b5cf6' },
    leadership: { label: isEn ? 'Leadership' : 'Liderazgo', shortLabel: 'LI', icon: Users, color: '#ec4899' },
    results: { label: isEn ? 'Results' : 'Resultados', shortLabel: 'RE', icon: Target, color: '#f59e0b' },
    relationship: { label: isEn ? 'Relationship' : 'Relacionamiento', shortLabel: 'RL', icon: Heart, color: '#10b981' },
  };
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Muy Alto': 
    case 'Very High': return 'bg-green-500';
    case 'Alto': 
    case 'High': return 'bg-emerald-500';
    case 'Moderado': 
    case 'Moderate': return 'bg-yellow-500';
    case 'Bajo': 
    case 'Low': return 'bg-orange-500';
    case 'Muy Bajo': 
    case 'Very Low': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getLevelLabel = (level: string, lang: Language) => {
  const isEn = lang === 'en';
  switch (level) {
    case 'Muy Alto': return isEn ? 'Very High' : 'Muy Alto';
    case 'Alto': return isEn ? 'High' : 'Alto';
    case 'Moderado': return isEn ? 'Moderate' : 'Moderado';
    case 'Bajo': return isEn ? 'Low' : 'Bajo';
    case 'Muy Bajo': return isEn ? 'Very Low' : 'Muy Bajo';
    default: return level;
  }
};

export default function DNAChart({ data, showDetails = true, compact = false, language: propLanguage }: DNAChartProps) {
  const { language: contextLanguage } = useLanguage();
  const language = propLanguage || contextLanguage;
  const categoryLabels = getCategoryLabels(language);

  // Labels
  const dnaTitle = language === 'es' ? 'Competencias DNA-25' : 'DNA-25 Competencies';
  const dnaScoreLabel = language === 'es' ? 'Puntuación DNA' : 'DNA Score';
  const totalScoreLabel = language === 'es' ? 'Puntuación Total' : 'Total Score';
  const strongCategoriesLabel = language === 'es' ? '💪 Categorías Fuertes' : '💪 Strong Categories';
  const developmentAreasLabel = language === 'es' ? '📈 Áreas de Desarrollo' : '📈 Development Areas';
  const allAboveAverageLabel = language === 'es' ? 'Todas las categorías están por encima del promedio' : 'All categories are above average';
  const dnaProfileLabel = language === 'es' ? '🧬 Perfil DNA' : '🧬 DNA Profile';
  const top5CompetenciesLabel = language === 'es' ? '🏆 Top 5 Competencias' : '🏆 Top 5 Competencies';

  const radarData = [
    { dimension: categoryLabels.thinking.label, value: data.thinkingCategoryScore, fullMark: 100 },
    { dimension: categoryLabels.communication.label, value: data.communicationCategoryScore, fullMark: 100 },
    { dimension: categoryLabels.leadership.label, value: data.leadershipCategoryScore, fullMark: 100 },
    { dimension: categoryLabels.results.label, value: data.resultsCategoryScore, fullMark: 100 },
    { dimension: categoryLabels.relationship.label, value: data.relationshipCategoryScore, fullMark: 100 },
  ];

  const barData = [
    { name: 'PE', fullName: categoryLabels.thinking.label, value: data.thinkingCategoryScore, color: '#6366f1' },
    { name: 'CO', fullName: categoryLabels.communication.label, value: data.communicationCategoryScore, color: '#8b5cf6' },
    { name: 'LI', fullName: categoryLabels.leadership.label, value: data.leadershipCategoryScore, color: '#ec4899' },
    { name: 'RE', fullName: categoryLabels.results.label, value: data.resultsCategoryScore, color: '#f59e0b' },
    { name: 'RL', fullName: categoryLabels.relationship.label, value: data.relationshipCategoryScore, color: '#10b981' },
  ];

  // Sort by score to find strengths and areas to develop
  const sortedCategories = [...barData].sort((a, b) => b.value - a.value);
  const topCategories = sortedCategories.slice(0, 2);
  const lowCategories = sortedCategories.filter(d => d.value < 50);

  if (compact) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Dna className="w-5 h-5 text-teal-600" />
              Competencias DNA-25
            </CardTitle>
            <Badge className={`text-white ${getLevelColor(data.dnaLevel)}`}>
              {data.dnaLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600">{data.totalDNAPercentile}</div>
              <div className="text-sm text-gray-500">Puntuación DNA</div>
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
            <Dna className="w-6 h-6 text-teal-600" />
            Competencias DNA-25
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-600">{data.totalDNAPercentile}</div>
              <div className="text-xs text-gray-500">Puntuación Total</div>
            </div>
            <Badge className={`text-white px-3 py-1 ${getLevelColor(data.dnaLevel)}`}>
              {data.dnaLevel}
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
                  name="DNA"
                  dataKey="value"
                  stroke="#14b8a6"
                  fill="#14b8a6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Bars */}
          <div className="space-y-3">
            {barData.map((cat, index) => {
              const Icon = Object.values(categoryLabels)[index].icon;
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: cat.color }} />
                      <span className="text-sm font-medium text-gray-700">{cat.fullName}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: cat.color }}>
                      {cat.value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
            {/* Fortalezas */}
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-800 mb-2">💪 Categorías Fuertes</h4>
              <div className="space-y-2">
                {topCategories.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <Badge className="bg-green-500 text-white">{cat.value}%</Badge>
                    <span className="text-sm text-green-700">{cat.fullName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Áreas de Desarrollo */}
            <div className="bg-amber-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-amber-800 mb-2">📈 Áreas de Desarrollo</h4>
              <div className="space-y-2">
                {lowCategories.length > 0 ? (
                  lowCategories.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-2">
                      <Badge className="bg-amber-500 text-white">{cat.value}%</Badge>
                      <span className="text-sm text-amber-700">{cat.fullName}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-amber-700">Todas las categorías están por encima del promedio</p>
                )}
              </div>
            </div>
          </div>
        )}

        {data.dnaProfile && (
          <div className="mt-4 p-4 bg-teal-50 rounded-xl">
            <h4 className="text-sm font-semibold text-teal-800 mb-1">🧬 Perfil DNA</h4>
            <p className="text-sm text-teal-700">{data.dnaProfile}</p>
          </div>
        )}

        {/* Top 5 Competencies */}
        {data.primaryStrengths && data.primaryStrengths.length > 0 && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
            <h4 className="text-sm font-semibold text-indigo-800 mb-2">🏆 Top 5 Competencias</h4>
            <div className="flex flex-wrap gap-2">
              {data.primaryStrengths.slice(0, 5).map((strength, i) => (
                <Badge key={i} variant="outline" className="border-indigo-300 text-indigo-700">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
