'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { 
  BarChart3, 
  Users,
  Brain,
  Target,
  Sparkles,
  Search,
  User,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
  ArrowRight,
  ChevronRight,
  Mail,
  Calendar,
  Layers,
  Eye,
  GitCompare,
  LayoutGrid,
  UserCircle,
  Send,
  X,
  ChevronDown,
  History,
  Loader2,
  Heart,
  Dna,
  Compass,
  Scale,
  Activity,
  Shield,
  Printer,
  Plus,
  FileCode,
  Code,
  Briefcase,
  Clock,
  Award,
  Star
} from 'lucide-react';

import DISCChart from './disc-chart';
import DrivingForcesChart from './driving-forces-chart';
import EQChart from './eq-chart';
import DNAChart from './dna-chart';
import IntegratedAnalysis from './integrated-analysis';
import { PersonNotes } from '@/components/evaluation-notes';

interface PersonData {
  id: string;
  email: string;
  name: string;
  disc: {
    id: string;
    percentileD: number;
    percentileI: number;
    percentileS: number;
    percentileC: number;
    personalityType: string;
    primaryStyle: string;
    secondaryStyle?: string;
    isOvershift?: boolean;
    isUndershift?: boolean;
    isTightPattern?: boolean;
    styleIntensity?: number;
  } | null;
  drivingForces: {
    id: string;
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
    primaryMotivators?: string[];
    situationalMotivators?: string[];
    indifferentMotivators?: string[];
    topMotivator?: string;
  } | null;
  eq: {
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
  } | null;
  dna: {
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
  } | null;
  acumen: {
    id: string;
    totalAcumenScore: number;
    acumenLevel: string;
    acumenProfile: string;
    externalClarityScore: number;
    internalClarityScore: number;
    understandingOthersClarity: number;
    practicalThinkingClarity: number;
    systemsJudgmentClarity: number;
    senseOfSelfClarity: number;
    roleAwarenessClarity: number;
    selfDirectionClarity: number;
    primaryStrengths?: string[];
    developmentAreas?: string[];
  } | null;
  values: {
    id: string;
    integrityScore: number;
    consistencyScore: number;
    authenticityScore: number;
    teoricoPercentile: number;
    utilitarioPercentile: number;
    esteticoPercentile: number;
    socialPercentile: number;
    individualistaPercentile: number;
    tradicionalPercentile: number;
    primaryValues?: string[];
    situationalValues?: string[];
    indifferentValues?: string[];
    valuesProfile?: string;
    primaryStrengths?: string[];
    developmentAreas?: string[];
  } | null;
  stress: {
    id: string;
    estresLaboralScore: number;
    capacidadRecuperacionScore: number;
    manejoEmocionalScore: number;
    equilibrioVidaScore: number;
    resilienciaScore: number;
    nivelEstresGeneral: number;
    indiceResiliencia: number;
    capacidadAdaptacion: number;
    stressLevel: string;
    resilienceLevel: string;
    stressProfile: string;
    riskFactors?: string[];
    protectiveFactors?: string[];
    primaryStrengths?: string[];
    developmentAreas?: string[];
  } | null;
  technical: {
    id: string;
    jobPositionId: string;
    totalScore: number;
    correctAnswers: number;
    totalQuestions: number;
    performanceLevel: string;
    easyScore: number;
    easyCorrect: number;
    easyTotal: number;
    mediumScore: number;
    mediumCorrect: number;
    mediumTotal: number;
    hardScore: number;
    hardCorrect: number;
    hardTotal: number;
    categoryScores?: Record<string, number>;
    strengths?: string[];
    weaknesses?: string[];
    averageResponseTime?: number;
    totalTime?: number;
  } | null;
  discDate: string | null;
  dfDate: string | null;
  eqDate: string | null;
  dnaDate: string | null;
  acumenDate: string | null;
  valuesDate: string | null;
  stressDate: string | null;
  technicalDate: string | null;
  hasComplete: boolean;
  hasFullProfile: boolean;
  hasRecluComplete?: boolean;
  hasFullReclu?: boolean;
  hasTechnical?: boolean;
}

interface AnalyticsClientProps {
  people: PersonData[];
}

type ViewMode = 'overview' | 'individual' | 'compare';
type TabType = 'all' | 'disc' | 'df' | 'eq' | 'dna' | 'acumen' | 'values' | 'stress' | 'technical' | 'integrated';

const ITEMS_PER_PAGE = 20;
const SEARCH_DEBOUNCE_MS = 300;

// Función para obtener interpretaciones DISC según idioma
function getDiscInterpretations(t: (key: string) => string): Record<string, {
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  motivators: string[];
  stressors: string[];
  communication: string[];
  idealEnvironment: string[];
}> {
  return {
    'D': {
      title: t('analytics.disc.dominant'),
      description: t('analytics.disc.dominant.desc'),
      strengths: [
        t('analytics.disc.d.strengths.1'),
        t('analytics.disc.d.strengths.2'),
        t('analytics.disc.d.strengths.3'),
        t('analytics.disc.d.strengths.4'),
        t('analytics.disc.d.strengths.5'),
        t('analytics.disc.d.strengths.6')
      ],
      challenges: [
        t('analytics.disc.d.challenges.1'),
        t('analytics.disc.d.challenges.2'),
        t('analytics.disc.d.challenges.3'),
        t('analytics.disc.d.challenges.4'),
        t('analytics.disc.d.challenges.5')
      ],
      motivators: [
        t('analytics.disc.d.motivators.1'),
        t('analytics.disc.d.motivators.2'),
        t('analytics.disc.d.motivators.3'),
        t('analytics.disc.d.motivators.4'),
        t('analytics.disc.d.motivators.5')
      ],
      stressors: [
        t('analytics.disc.d.stressors.1'),
        t('analytics.disc.d.stressors.2'),
        t('analytics.disc.d.stressors.3'),
        t('analytics.disc.d.stressors.4'),
        t('analytics.disc.d.stressors.5')
      ],
      communication: [
        t('analytics.disc.d.communication.1'),
        t('analytics.disc.d.communication.2'),
        t('analytics.disc.d.communication.3'),
        t('analytics.disc.d.communication.4'),
        t('analytics.disc.d.communication.5')
      ],
      idealEnvironment: [
        t('analytics.disc.d.environment.1'),
        t('analytics.disc.d.environment.2'),
        t('analytics.disc.d.environment.3'),
        t('analytics.disc.d.environment.4'),
        t('analytics.disc.d.environment.5')
      ]
    },
    'I': {
      title: t('analytics.disc.influential'),
      description: t('analytics.disc.influential.desc'),
      strengths: [
        t('analytics.disc.i.strengths.1'),
        t('analytics.disc.i.strengths.2'),
        t('analytics.disc.i.strengths.3'),
        t('analytics.disc.i.strengths.4'),
        t('analytics.disc.i.strengths.5'),
        t('analytics.disc.i.strengths.6')
      ],
      challenges: [
        t('analytics.disc.i.challenges.1'),
        t('analytics.disc.i.challenges.2'),
        t('analytics.disc.i.challenges.3'),
        t('analytics.disc.i.challenges.4'),
        t('analytics.disc.i.challenges.5')
      ],
      motivators: [
        t('analytics.disc.i.motivators.1'),
        t('analytics.disc.i.motivators.2'),
        t('analytics.disc.i.motivators.3'),
        t('analytics.disc.i.motivators.4'),
        t('analytics.disc.i.motivators.5')
      ],
      stressors: [
        t('analytics.disc.i.stressors.1'),
        t('analytics.disc.i.stressors.2'),
        t('analytics.disc.i.stressors.3'),
        t('analytics.disc.i.stressors.4'),
        t('analytics.disc.i.stressors.5')
      ],
      communication: [
        t('analytics.disc.i.communication.1'),
        t('analytics.disc.i.communication.2'),
        t('analytics.disc.i.communication.3'),
        t('analytics.disc.i.communication.4'),
        t('analytics.disc.i.communication.5')
      ],
      idealEnvironment: [
        t('analytics.disc.i.environment.1'),
        t('analytics.disc.i.environment.2'),
        t('analytics.disc.i.environment.3'),
        t('analytics.disc.i.environment.4'),
        t('analytics.disc.i.environment.5')
      ]
    },
    'S': {
      title: t('analytics.disc.steady'),
      description: t('analytics.disc.steady.desc'),
      strengths: [
        t('analytics.disc.s.strengths.1'),
        t('analytics.disc.s.strengths.2'),
        t('analytics.disc.s.strengths.3'),
        t('analytics.disc.s.strengths.4'),
        t('analytics.disc.s.strengths.5'),
        t('analytics.disc.s.strengths.6')
      ],
      challenges: [
        t('analytics.disc.s.challenges.1'),
        t('analytics.disc.s.challenges.2'),
        t('analytics.disc.s.challenges.3'),
        t('analytics.disc.s.challenges.4'),
        t('analytics.disc.s.challenges.5')
      ],
      motivators: [
        t('analytics.disc.s.motivators.1'),
        t('analytics.disc.s.motivators.2'),
        t('analytics.disc.s.motivators.3'),
        t('analytics.disc.s.motivators.4'),
        t('analytics.disc.s.motivators.5')
      ],
      stressors: [
        t('analytics.disc.s.stressors.1'),
        t('analytics.disc.s.stressors.2'),
        t('analytics.disc.s.stressors.3'),
        t('analytics.disc.s.stressors.4'),
        t('analytics.disc.s.stressors.5')
      ],
      communication: [
        t('analytics.disc.s.communication.1'),
        t('analytics.disc.s.communication.2'),
        t('analytics.disc.s.communication.3'),
        t('analytics.disc.s.communication.4'),
        t('analytics.disc.s.communication.5')
      ],
      idealEnvironment: [
        t('analytics.disc.s.environment.1'),
        t('analytics.disc.s.environment.2'),
        t('analytics.disc.s.environment.3'),
        t('analytics.disc.s.environment.4'),
        t('analytics.disc.s.environment.5')
      ]
    },
    'C': {
      title: t('analytics.disc.conscientious'),
      description: t('analytics.disc.conscientious.desc'),
      strengths: [
        t('analytics.disc.c.strengths.1'),
        t('analytics.disc.c.strengths.2'),
        t('analytics.disc.c.strengths.3'),
        t('analytics.disc.c.strengths.4'),
        t('analytics.disc.c.strengths.5'),
        t('analytics.disc.c.strengths.6')
      ],
      challenges: [
        t('analytics.disc.c.challenges.1'),
        t('analytics.disc.c.challenges.2'),
        t('analytics.disc.c.challenges.3'),
        t('analytics.disc.c.challenges.4'),
        t('analytics.disc.c.challenges.5')
      ],
      motivators: [
        t('analytics.disc.c.motivators.1'),
        t('analytics.disc.c.motivators.2'),
        t('analytics.disc.c.motivators.3'),
        t('analytics.disc.c.motivators.4'),
        t('analytics.disc.c.motivators.5')
      ],
      stressors: [
        t('analytics.disc.c.stressors.1'),
        t('analytics.disc.c.stressors.2'),
        t('analytics.disc.c.stressors.3'),
        t('analytics.disc.c.stressors.4'),
        t('analytics.disc.c.stressors.5')
      ],
      communication: [
        t('analytics.disc.c.communication.1'),
        t('analytics.disc.c.communication.2'),
        t('analytics.disc.c.communication.3'),
        t('analytics.disc.c.communication.4'),
        t('analytics.disc.c.communication.5')
      ],
      idealEnvironment: [
        t('analytics.disc.c.environment.1'),
        t('analytics.disc.c.environment.2'),
        t('analytics.disc.c.environment.3'),
        t('analytics.disc.c.environment.4'),
        t('analytics.disc.c.environment.5')
      ]
    }
  };
}

// Componente de análisis detallado DISC
function DISCDetailedAnalysis({ primaryStyle }: { primaryStyle: string }) {
  const { t } = useLanguage();
  const discInterpretations = getDiscInterpretations(t);
  const interpretation = discInterpretations[primaryStyle];
  if (!interpretation) return null;

  const styleColors: Record<string, { bg: string; text: string; border: string; light: string }> = {
    'D': { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-200', light: 'bg-red-50' },
    'I': { bg: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-200', light: 'bg-yellow-50' },
    'S': { bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-200', light: 'bg-green-50' },
    'C': { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-200', light: 'bg-blue-50' }
  };
  const colors = styleColors[primaryStyle] || styleColors['D'];

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className={`${colors.light} ${colors.border} border-b`}>
        <CardTitle className={`text-lg ${colors.text} flex items-center gap-2`}>
          <Brain className="w-5 h-5" />
          {t('analytics.disc.detailedAnalysis')} {interpretation.title}
        </CardTitle>
        <CardDescription className="text-gray-600">{interpretation.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fortalezas */}
          <div className={`p-4 rounded-xl ${colors.light} ${colors.border} border`}>
            <h4 className={`font-semibold ${colors.text} mb-3 flex items-center gap-2`}>
              <CheckCircle2 className="w-4 h-4" />
              {t('analytics.disc.strengths')}
            </h4>
            <ul className="space-y-2">
              {interpretation.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className={`w-1.5 h-1.5 ${colors.bg} rounded-full mt-1.5 flex-shrink-0`}></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Desafíos */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <h4 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {t('analytics.disc.developmentAreas')}
            </h4>
            <ul className="space-y-2">
              {interpretation.challenges.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Motivadores */}
          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {t('analytics.disc.motivators')}
            </h4>
            <ul className="space-y-2">
              {interpretation.motivators.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Estresores */}
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
            <h4 className="font-semibold text-rose-700 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {t('analytics.disc.stressors')}
            </h4>
            <ul className="space-y-2">
              {interpretation.stressors.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Comunicación */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
            <h4 className="font-semibold text-indigo-700 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t('analytics.disc.howToCommunicate')}
            </h4>
            <ul className="space-y-2">
              {interpretation.communication.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Ambiente Ideal */}
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
            <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              {t('analytics.disc.idealEnvironment')}
            </h4>
            <ul className="space-y-2">
              {interpretation.idealEnvironment.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Función para obtener descripciones de dimensiones EQ según idioma
function getEqDimensionDescriptions(t: (key: string) => string): Record<string, { name: string; description: string; high: string; development: string }> {
  return {
    autoconciencia: {
      name: t('analytics.eq.selfAwareness'),
      description: t('analytics.eq.selfAwareness.desc'),
      high: t('analytics.eq.selfAwareness.high'),
      development: t('analytics.eq.selfAwareness.development')
    },
    autorregulacion: {
      name: t('analytics.eq.selfRegulation'),
      description: t('analytics.eq.selfRegulation.desc'),
      high: t('analytics.eq.selfRegulation.high'),
      development: t('analytics.eq.selfRegulation.development')
    },
    motivacion: {
      name: t('analytics.eq.motivation'),
      description: t('analytics.eq.motivation.desc'),
      high: t('analytics.eq.motivation.high'),
      development: t('analytics.eq.motivation.development')
    },
    empatia: {
      name: t('analytics.eq.empathy'),
      description: t('analytics.eq.empathy.desc'),
      high: t('analytics.eq.empathy.high'),
      development: t('analytics.eq.empathy.development')
    },
    habilidadesSociales: {
      name: t('analytics.eq.socialSkills'),
      description: t('analytics.eq.socialSkills.desc'),
      high: t('analytics.eq.socialSkills.high'),
      development: t('analytics.eq.socialSkills.development')
    }
  };
}

// Componente de análisis detallado EQ
function EQDetailedAnalysis({ data }: { data: PersonData['eq'] }) {
  const { t } = useLanguage();
  
  if (!data) return null;

  const eqDimensionDescriptions = getEqDimensionDescriptions(t);

  const dimensions = [
    { key: 'autoconciencia', value: data.autoconcienciaPercentile, color: 'rose' },
    { key: 'autorregulacion', value: data.autorregulacionPercentile, color: 'purple' },
    { key: 'motivacion', value: data.motivacionPercentile, color: 'amber' },
    { key: 'empatia', value: data.empatiaPercentile, color: 'teal' },
    { key: 'habilidadesSociales', value: data.habilidadesSocialesPercentile, color: 'indigo' }
  ];

  const getLevel = (value: number) => {
    if (value >= 80) return { label: t('analytics.eq.veryHigh'), color: 'text-green-600 bg-green-100' };
    if (value >= 60) return { label: t('analytics.eq.high'), color: 'text-blue-600 bg-blue-100' };
    if (value >= 40) return { label: t('analytics.eq.moderate'), color: 'text-amber-600 bg-amber-100' };
    if (value >= 20) return { label: t('analytics.eq.developing'), color: 'text-orange-600 bg-orange-100' };
    return { label: t('analytics.eq.opportunityArea'), color: 'text-red-600 bg-red-100' };
  };

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-200">
        <CardTitle className="text-lg text-rose-700 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          {t('analytics.eq.detailedAnalysis')}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {t('analytics.eq.5dimensions')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {dimensions.map(({ key, value, color }) => {
            const desc = eqDimensionDescriptions[key];
            const level = getLevel(value);
            return (
              <div key={key} className={`p-4 rounded-xl bg-${color}-50 border border-${color}-200`} style={{ backgroundColor: `var(--${color}-50, #fdf2f8)` }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{desc.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-700">{value}%</span>
                    <Badge className={level.color}>{level.label}</Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div className={`bg-${color}-500 h-2 rounded-full`} style={{ width: `${value}%`, backgroundColor: color === 'rose' ? '#f43f5e' : color === 'purple' ? '#a855f7' : color === 'amber' ? '#f59e0b' : color === 'teal' ? '#14b8a6' : '#6366f1' }}></div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{desc.description}</p>
                <div className="text-xs text-gray-500 bg-white/50 p-2 rounded-lg">
                  <strong>{t('analytics.eq.interpretation')}:</strong> {value >= 60 ? desc.high : desc.development}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fortalezas y Áreas de desarrollo */}
        {(data.strengths?.length || data.developmentAreas?.length) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {data.strengths && data.strengths.length > 0 && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <h5 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('analytics.eq.identifiedStrengths')}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {data.strengths.map((s, i) => (
                    <Badge key={i} className="bg-green-100 text-green-800">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {data.developmentAreas && data.developmentAreas.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <h5 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {t('analytics.eq.developmentAreas')}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {data.developmentAreas.map((s, i) => (
                    <Badge key={i} className="bg-amber-100 text-amber-800">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Función para obtener descripciones de categorías DNA-25 según idioma
function getDnaCategoryDescriptions(t: (key: string) => string): Record<string, { name: string; description: string; competencies: string[] }> {
  return {
    thinking: {
      name: t('analytics.dna.thinking'),
      description: t('analytics.dna.thinking.desc'),
      competencies: [
        t('analytics.dna.comp.analyticalThinking'),
        t('analytics.dna.comp.problemSolving'),
        t('analytics.dna.comp.decisionMaking'),
        t('analytics.dna.comp.conceptualThinking'),
        t('analytics.dna.comp.creativity')
      ]
    },
    communication: {
      name: t('analytics.dna.communication'),
      description: t('analytics.dna.communication.desc'),
      competencies: [
        t('analytics.dna.comp.oralCommunication'),
        t('analytics.dna.comp.writtenCommunication'),
        t('analytics.dna.comp.activeListening'),
        t('analytics.dna.comp.presentations'),
        t('analytics.dna.comp.negotiation')
      ]
    },
    leadership: {
      name: t('analytics.dna.leadership'),
      description: t('analytics.dna.leadership.desc'),
      competencies: [
        t('analytics.dna.comp.developingOthers'),
        t('analytics.dna.comp.strategicVision'),
        t('analytics.dna.comp.delegation'),
        t('analytics.dna.comp.influence'),
        t('analytics.dna.comp.changeManagement')
      ]
    },
    results: {
      name: t('analytics.dna.results'),
      description: t('analytics.dna.results.desc'),
      competencies: [
        t('analytics.dna.comp.achievementOrientation'),
        t('analytics.dna.comp.planning'),
        t('analytics.dna.comp.timeManagement'),
        t('analytics.dna.comp.initiative'),
        t('analytics.dna.comp.accountability')
      ]
    },
    relationship: {
      name: t('analytics.dna.relationship'),
      description: t('analytics.dna.relationship.desc'),
      competencies: [
        t('analytics.dna.comp.teamwork'),
        t('analytics.dna.comp.relationshipBuilding'),
        t('analytics.dna.comp.empathy'),
        t('analytics.dna.comp.customerService'),
        t('analytics.dna.comp.collaboration')
      ]
    }
  };
}

// Componente de análisis detallado DNA-25
function DNADetailedAnalysis({ data }: { data: PersonData['dna'] }) {
  const { t } = useLanguage();
  
  if (!data) return null;

  const dnaCategoryDescriptions = getDnaCategoryDescriptions(t);

  const categories = [
    { key: 'thinking', value: data.thinkingCategoryScore, color: 'blue' },
    { key: 'communication', value: data.communicationCategoryScore, color: 'purple' },
    { key: 'leadership', value: data.leadershipCategoryScore, color: 'amber' },
    { key: 'results', value: data.resultsCategoryScore, color: 'green' },
    { key: 'relationship', value: data.relationshipCategoryScore, color: 'teal' }
  ];

  const getLevel = (value: number) => {
    if (value >= 80) return { label: t('analytics.dna.exceptional'), color: 'text-green-600 bg-green-100' };
    if (value >= 60) return { label: t('analytics.dna.competent'), color: 'text-blue-600 bg-blue-100' };
    if (value >= 40) return { label: t('analytics.dna.developing'), color: 'text-amber-600 bg-amber-100' };
    return { label: t('analytics.dna.opportunityArea'), color: 'text-orange-600 bg-orange-100' };
  };

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-200">
        <CardTitle className="text-lg text-teal-700 flex items-center gap-2">
          <Dna className="w-5 h-5" />
          {t('analytics.dna.detailedAnalysis')}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {t('analytics.dna.25competencies')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {categories.map(({ key, value, color }) => {
            const desc = dnaCategoryDescriptions[key];
            const level = getLevel(value);
            const bgColor = color === 'blue' ? '#eff6ff' : color === 'purple' ? '#faf5ff' : color === 'amber' ? '#fffbeb' : color === 'green' ? '#f0fdf4' : '#f0fdfa';
            const barColor = color === 'blue' ? '#3b82f6' : color === 'purple' ? '#a855f7' : color === 'amber' ? '#f59e0b' : color === 'green' ? '#22c55e' : '#14b8a6';
            
            return (
              <div key={key} className="p-4 rounded-xl border" style={{ backgroundColor: bgColor, borderColor: `${barColor}40` }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{desc.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-700">{value}%</span>
                    <Badge className={level.color}>{level.label}</Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: barColor }}></div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{desc.description}</p>
                <div className="flex flex-wrap gap-1">
                  {desc.competencies.map((comp, i) => (
                    <Badge key={i} variant="outline" className="text-xs" style={{ borderColor: `${barColor}60`, color: barColor }}>{comp}</Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Perfil y métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 text-center">
            <p className="text-sm text-gray-500 mb-1">{t('analytics.dna.profile')}</p>
            <p className="font-semibold text-teal-700">{data.dnaProfile}</p>
          </div>
          <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-200 text-center">
            <p className="text-sm text-gray-500 mb-1">{t('analytics.dna.totalPercentile')}</p>
            <p className="text-2xl font-bold text-cyan-700">{data.totalDNAPercentile}%</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
            <p className="text-sm text-gray-500 mb-1">{t('analytics.dna.generalLevel')}</p>
            <p className="font-semibold text-indigo-700">{data.dnaLevel?.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Fortalezas y Áreas de desarrollo */}
        {(data.primaryStrengths?.length || data.developmentAreas?.length) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {data.primaryStrengths && data.primaryStrengths.length > 0 && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <h5 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('analytics.dna.topCompetencies')}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {data.primaryStrengths.map((s, i) => (
                    <Badge key={i} className="bg-green-100 text-green-800">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {data.developmentAreas && data.developmentAreas.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <h5 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {t('analytics.eq.developmentAreas')}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {data.developmentAreas.map((s, i) => (
                    <Badge key={i} className="bg-amber-100 text-amber-800">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Función para obtener descripciones de Fuerzas Motivadoras según idioma
function getDrivingForcesDescriptions(t: (key: string) => string): Record<string, { name: string; description: string; drive: string }> {
  return {
    intelectual: { 
      name: t('analytics.df.intellectual'), 
      description: t('analytics.df.intellectual.desc'), 
      drive: t('analytics.df.intellectual.drive') 
    },
    instintivo: { 
      name: t('analytics.df.instinctive'), 
      description: t('analytics.df.instinctive.desc'), 
      drive: t('analytics.df.instinctive.drive') 
    },
    practico: { 
      name: t('analytics.df.practical'), 
      description: t('analytics.df.practical.desc'), 
      drive: t('analytics.df.practical.drive') 
    },
    altruista: { 
      name: t('analytics.df.altruistic'), 
      description: t('analytics.df.altruistic.desc'), 
      drive: t('analytics.df.altruistic.drive') 
    },
    armonioso: { 
      name: t('analytics.df.harmonious'), 
      description: t('analytics.df.harmonious.desc'), 
      drive: t('analytics.df.harmonious.drive') 
    },
    objetivo: { 
      name: t('analytics.df.objective'), 
      description: t('analytics.df.objective.desc'), 
      drive: t('analytics.df.objective.drive') 
    },
    benevolo: { 
      name: t('analytics.df.benevolent'), 
      description: t('analytics.df.benevolent.desc'), 
      drive: t('analytics.df.benevolent.drive') 
    },
    intencional: { 
      name: t('analytics.df.intentional'), 
      description: t('analytics.df.intentional.desc'), 
      drive: t('analytics.df.intentional.drive') 
    },
    dominante: { 
      name: t('analytics.df.dominant'), 
      description: t('analytics.df.dominant.desc'), 
      drive: t('analytics.df.dominant.drive') 
    },
    colaborativo: { 
      name: t('analytics.df.collaborative'), 
      description: t('analytics.df.collaborative.desc'), 
      drive: t('analytics.df.collaborative.drive') 
    },
    estructurado: { 
      name: t('analytics.df.structured'), 
      description: t('analytics.df.structured.desc'), 
      drive: t('analytics.df.structured.drive') 
    },
    receptivo: { 
      name: t('analytics.df.receptive'), 
      description: t('analytics.df.receptive.desc'), 
      drive: t('analytics.df.receptive.drive') 
    }
  };
}

// Componente de análisis detallado Fuerzas Motivadoras
function DrivingForcesDetailedAnalysis({ data }: { data: PersonData['drivingForces'] }) {
  const { t } = useLanguage();
  const drivingForcesDescriptions = getDrivingForcesDescriptions(t);
  
  if (!data) return null;

  const forces = [
    { key: 'intelectual', value: data.intelectualPercentile, pair: 'instintivo', pairValue: data.instintivoPercentile },
    { key: 'practico', value: data.practicoPercentile, pair: 'altruista', pairValue: data.altruistaPercentile },
    { key: 'armonioso', value: data.armoniosoPercentile, pair: 'objetivo', pairValue: data.objetivoPercentile },
    { key: 'benevolo', value: data.benevoloPercentile, pair: 'intencional', pairValue: data.intencionalPercentile },
    { key: 'dominante', value: data.dominantePercentile, pair: 'colaborativo', pairValue: data.colaborativoPercentile },
    { key: 'estructurado', value: data.estructuradoPercentile, pair: 'receptivo', pairValue: data.receptivoPercentile }
  ];

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200">
        <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
          <Target className="w-5 h-5" />
          {t('analytics.df.detailedAnalysis')}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {t('analytics.df.6pairs')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {forces.map(({ key, value, pair, pairValue }) => {
            const desc1 = drivingForcesDescriptions[key];
            const desc2 = drivingForcesDescriptions[pair];
            const dominant = value > pairValue ? key : pair;
            const dominantDesc = value > pairValue ? desc1 : desc2;
            
            return (
              <div key={key} className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className={`text-sm font-medium ${value > pairValue ? 'text-purple-700' : 'text-gray-500'}`}>{desc1.name}</p>
                      <p className={`text-xl font-bold ${value > pairValue ? 'text-purple-600' : 'text-gray-400'}`}>{value}%</p>
                    </div>
                    <span className="text-gray-400">vs</span>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${pairValue > value ? 'text-indigo-700' : 'text-gray-500'}`}>{desc2.name}</p>
                      <p className={`text-xl font-bold ${pairValue > value ? 'text-indigo-600' : 'text-gray-400'}`}>{pairValue}%</p>
                    </div>
                  </div>
                  <Badge className={dominant === key ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}>
                    {t('analytics.df.predominant')}: {dominantDesc.name}
                  </Badge>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute left-0 h-full bg-purple-500" style={{ width: `${value}%` }}></div>
                  <div className="absolute right-0 h-full bg-indigo-500" style={{ width: `${pairValue}%` }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2"><strong>{t('analytics.df.dominantDrive')}:</strong> {dominantDesc.drive}</p>
              </div>
            );
          })}
        </div>

        {/* Motivadores principales */}
        {(data.primaryMotivators?.length || data.situationalMotivators?.length) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {data.primaryMotivators && data.primaryMotivators.length > 0 && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <h5 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {t('analytics.df.primaryMotivators')}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {data.primaryMotivators.map((m, i) => (
                    <Badge key={i} className="bg-green-100 text-green-800">{m}</Badge>
                  ))}
                </div>
              </div>
            )}
            {data.situationalMotivators && data.situationalMotivators.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h5 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {t('analytics.df.situationalMotivators')}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {data.situationalMotivators.map((m, i) => (
                    <Badge key={i} className="bg-blue-100 text-blue-800">{m}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente PersonSelector optimizado para 100+ personas
interface PersonSelectorProps {
  people: PersonData[];
  selectedPerson: PersonData | null;
  onSelect: (person: PersonData) => void;
  recentSelections: PersonData[];
  getDiscColor: (style: string) => string;
  mode?: 'single' | 'multi';
  compareList?: PersonData[];
  onToggleCompare?: (person: PersonData) => void;
}

function PersonSelector({ 
  people, 
  selectedPerson, 
  onSelect, 
  recentSelections,
  getDiscColor,
  mode = 'single',
  compareList = [],
  onToggleCompare
}: PersonSelectorProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setVisibleCount(ITEMS_PER_PAGE);
      setIsSearching(false);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter people
  const filteredPeople = useMemo(() => {
    if (!debouncedSearch.trim()) return people;
    const q = debouncedSearch.toLowerCase();
    return people.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.email.toLowerCase().includes(q)
    );
  }, [people, debouncedSearch]);

  const visiblePeople = filteredPeople.slice(0, visibleCount);
  const hasMore = filteredPeople.length > visibleCount;

  const handleSelect = (person: PersonData) => {
    if (mode === 'single') {
      onSelect(person);
      setIsOpen(false);
      setSearch('');
    } else {
      onToggleCompare?.(person);
    }
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger/Input */}
      <div 
        className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
          isOpen ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-gray-300'
        } bg-white`}
        onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 100); }}
      >
        {mode === 'single' && selectedPerson ? (
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {selectedPerson.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{selectedPerson.name}</p>
              <p className="text-xs text-gray-500 truncate">{selectedPerson.email}</p>
            </div>
            <div className="flex gap-1 flex-wrap">
              {selectedPerson.disc && (
                <Badge className={`${getDiscColor(selectedPerson.disc.primaryStyle)} text-white text-xs`}>
                  {selectedPerson.disc.primaryStyle}
                </Badge>
              )}
              {selectedPerson.drivingForces && (
                <Badge className="bg-purple-500 text-white text-xs">FM</Badge>
              )}
              {selectedPerson.eq && (
                <Badge className="bg-rose-500 text-white text-xs">EQ</Badge>
              )}
              {selectedPerson.dna && (
                <Badge className="bg-teal-500 text-white text-xs">DNA</Badge>
              )}
              {selectedPerson.acumen && (
                <Badge className="bg-amber-500 text-white text-xs">ACI</Badge>
              )}
              {selectedPerson.values && (
                <Badge className="bg-violet-500 text-white text-xs">Val</Badge>
              )}
              {selectedPerson.stress && (
                <Badge className="bg-orange-500 text-white text-xs">Str</Badge>
              )}
              {selectedPerson.technical && (
                <Badge className="bg-sky-500 text-white text-xs">Téc</Badge>
              )}
              {selectedPerson.hasFullProfile && (
                <Sparkles className="w-4 h-4 text-amber-500" />
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 text-gray-500">
            <Search className="w-5 h-5" />
            <span>{mode === 'single' ? t('analytics.searchAndSelect') : `${t('analytics.selectPeople')} (${compareList.length}/4)`}</span>
          </div>
        )}
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                ref={inputRef}
                placeholder={t('analytics.search.placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-10"
                autoFocus
              />
              {search && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setSearch(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{filteredPeople.length} {t('analytics.of')} {people.length} {t('analytics.people')}</span>
              {isSearching && <Loader2 className="w-3 h-3 animate-spin" />}
            </div>
          </div>

          {/* Recent Selections (only show when not searching and mode is single) */}
          {mode === 'single' && !debouncedSearch && recentSelections.length > 0 && (
            <div className="p-2 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-medium text-gray-500 px-2 mb-2 flex items-center gap-1">
                <History className="w-3 h-3" /> {t('analytics.recent')}
              </p>
              <div className="flex flex-wrap gap-2 px-2">
                {recentSelections.slice(0, 5).map(person => (
                  <button
                    key={`recent-${person.id}`}
                    onClick={() => handleSelect(person)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-medium">
                      {person.name.charAt(0)}
                    </div>
                    <span className="text-gray-700">{person.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* People List */}
          <div className="max-h-[50vh] sm:max-h-[300px] overflow-y-auto overscroll-contain">
            <div className="p-2">
              {visiblePeople.length > 0 ? (
                <>
                  {visiblePeople.map(person => {
                    const isSelected = mode === 'single' 
                      ? selectedPerson?.id === person.id 
                      : compareList.some(p => p.id === person.id);
                    
                    return (
                      <div
                        key={person.id}
                        onClick={() => handleSelect(person)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-indigo-50 border border-indigo-200' 
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          isSelected ? 'bg-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                        }`}>
                          {person.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{person.name}</p>
                          <p className="text-xs text-gray-500 truncate">{person.email}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          {person.disc && (
                            <Badge className={`${getDiscColor(person.disc.primaryStyle)} text-white text-xs`}>
                              {person.disc.primaryStyle}
                            </Badge>
                          )}
                          {person.drivingForces && (
                            <Badge className="bg-purple-500 text-white text-xs">FM</Badge>
                          )}
                          {person.eq && (
                            <Badge className="bg-rose-500 text-white text-xs">EQ</Badge>
                          )}
                          {person.dna && (
                            <Badge className="bg-teal-500 text-white text-xs">DNA</Badge>
                          )}
                          {person.acumen && (
                            <Badge className="bg-amber-500 text-white text-xs">ACI</Badge>
                          )}
                          {person.values && (
                            <Badge className="bg-violet-500 text-white text-xs">Val</Badge>
                          )}
                          {person.stress && (
                            <Badge className="bg-orange-500 text-white text-xs">Str</Badge>
                          )}
                          {person.technical && (
                            <Badge className="bg-sky-500 text-white text-xs">Téc</Badge>
                          )}
                          {person.hasFullProfile && (
                            <Sparkles className="w-4 h-4 text-amber-500" />
                          )}
                          {mode === 'multi' && isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                          )}
                        </div>
                        <div className="flex sm:hidden items-center gap-1">
                          {person.disc && (
                            <Badge className={`${getDiscColor(person.disc.primaryStyle)} text-white text-xs`}>
                              {person.disc.primaryStyle}
                            </Badge>
                          )}
                          {mode === 'multi' && isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Load More Button */}
                  {hasMore && (
                    <button
                      onClick={(e) => { e.stopPropagation(); loadMore(); }}
                      className="w-full py-3 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {t('analytics.loadMore')} ({filteredPeople.length - visibleCount} {t('analytics.remaining')})
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">{t('analytics.noPersonsFound')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('analytics.tryAnotherSearch')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {mode === 'single' && (
            <div className="p-2 border-t border-gray-100 bg-gray-50 text-center rounded-b-xl">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {t('analytics.pressEscClose')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Colores consistentes para personas en comparación
const COMPARE_COLORS = [
  { bg: 'bg-indigo-500', bgLight: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-300', fill: '#6366f1' },
  { bg: 'bg-emerald-500', bgLight: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-300', fill: '#10b981' },
  { bg: 'bg-amber-500', bgLight: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-300', fill: '#f59e0b' },
  { bg: 'bg-rose-500', bgLight: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-300', fill: '#f43f5e' },
];

// Nombres amigables para motivadores
const MOTIVATOR_NAMES: Record<string, string> = {
  intelectualPercentile: 'Intelectual',
  instintivoPercentile: 'Instintivo',
  practicoPercentile: 'Práctico',
  altruistaPercentile: 'Altruista',
  armoniosoPercentile: 'Armonioso',
  objetivoPercentile: 'Objetivo',
  benevoloPercentile: 'Benévolo',
  intencionalPercentile: 'Intencional',
  dominantePercentile: 'Dominante',
  colaborativoPercentile: 'Colaborativo',
  estructuradoPercentile: 'Estructurado',
  receptivoPercentile: 'Receptivo',
};

// Nombres EQ
const EQ_DIMENSION_NAMES: Record<string, string> = {
  autoconcienciaPercentile: 'Autoconciencia',
  autorregulacionPercentile: 'Autorregulación',
  motivacionPercentile: 'Motivación',
  empatiaPercentile: 'Empatía',
  habilidadesSocialesPercentile: 'Hab. Sociales',
};

// Descripción estilos DISC
const DISC_DESCRIPTIONS: Record<string, { name: string; traits: string[] }> = {
  D: { name: 'Dominancia', traits: ['Directo', 'Orientado a resultados', 'Decisivo', 'Competitivo'] },
  I: { name: 'Influencia', traits: ['Sociable', 'Optimista', 'Colaborador', 'Expresivo'] },
  S: { name: 'Estabilidad', traits: ['Paciente', 'Confiable', 'Orientado al equipo', 'Calmado'] },
  C: { name: 'Cumplimiento', traits: ['Analítico', 'Detallista', 'Preciso', 'Sistemático'] },
};

interface CompareViewProps {
  people: PersonData[];
  compareList: PersonData[];
  recentSelections: PersonData[];
  getDiscColor: (style: string) => string;
  toggleCompare: (person: PersonData) => void;
}

function CompareView({ people, compareList, recentSelections, getDiscColor, toggleCompare }: CompareViewProps) {
  const { t, language } = useLanguage();
  const [compareTab, setCompareTab] = useState<'resumen' | 'disc' | 'fm' | 'eq' | 'dna' | 'acumen' | 'values' | 'stress' | 'technical' | 'equipo' | 'compatibilidad'>('resumen');
  
  // Calcular compatibilidad entre dos personas
  const calculateCompatibility = (p1: PersonData, p2: PersonData) => {
    let score = 0;
    let factors = 0;
    
    // DISC compatibility
    if (p1.disc && p2.disc) {
      const discDiff = (
        Math.abs(p1.disc.percentileD - p2.disc.percentileD) +
        Math.abs(p1.disc.percentileI - p2.disc.percentileI) +
        Math.abs(p1.disc.percentileS - p2.disc.percentileS) +
        Math.abs(p1.disc.percentileC - p2.disc.percentileC)
      ) / 4;
      // Complementarios (diferencias medias) son buenos para equipos
      const discScore = discDiff >= 20 && discDiff <= 40 ? 85 : discDiff < 20 ? 90 - discDiff : 100 - discDiff;
      score += Math.max(0, Math.min(100, discScore));
      factors++;
    }
    
    // FM compatibility - buscar motivadores complementarios
    if (p1.drivingForces && p2.drivingForces) {
      const p1Top = p1.drivingForces.primaryMotivators?.slice(0, 3) || [];
      const p2Top = p2.drivingForces.primaryMotivators?.slice(0, 3) || [];
      const shared = p1Top.filter(m => p2Top.includes(m)).length;
      const fmScore = shared >= 2 ? 85 : shared === 1 ? 75 : 60;
      score += fmScore;
      factors++;
    }
    
    // EQ compatibility
    if (p1.eq && p2.eq) {
      const avgEQ = (p1.eq.totalScore + p2.eq.totalScore) / 2;
      const eqScore = avgEQ >= 70 ? 90 : avgEQ >= 50 ? 75 : 60;
      score += eqScore;
      factors++;
    }
    
    return factors > 0 ? Math.round(score / factors) : 0;
  };

  // Generar insights de equipo
  const generateTeamInsights = () => {
    const insights: { type: 'strength' | 'opportunity' | 'synergy' | 'tension'; text: string }[] = [];
    
    // Analizar diversidad DISC
    const discStyles = compareList.filter(p => p.disc).map(p => p.disc!.primaryStyle);
    const uniqueStyles = [...new Set(discStyles)];
    
    if (uniqueStyles.length === compareList.filter(p => p.disc).length && uniqueStyles.length >= 2) {
      insights.push({ type: 'strength', text: 'Equipo con alta diversidad de estilos DISC - excelente para abordar problemas desde múltiples perspectivas' });
    } else if (uniqueStyles.length === 1 && compareList.filter(p => p.disc).length >= 2) {
      insights.push({ type: 'opportunity', text: `Todos comparten el estilo ${uniqueStyles[0]} - considerar incorporar perspectivas diferentes para mayor balance` });
    }
    
    // Analizar D vs S (estilos opuestos)
    const hasD = discStyles.includes('D');
    const hasS = discStyles.includes('S');
    if (hasD && hasS) {
      insights.push({ type: 'tension', text: 'Combinación D-S puede generar fricción: el estilo D prefiere acción rápida mientras S busca estabilidad' });
    }
    
    // Analizar I vs C
    const hasI = discStyles.includes('I');
    const hasC = discStyles.includes('C');
    if (hasI && hasC) {
      insights.push({ type: 'synergy', text: 'La combinación I-C equilibra creatividad social con rigor analítico' });
    }
    
    // Analizar motivadores compartidos
    const allTopMotivators = compareList
      .filter(p => p.drivingForces?.primaryMotivators)
      .flatMap(p => p.drivingForces!.primaryMotivators!.slice(0, 2));
    
    const motivatorCounts: Record<string, number> = {};
    allTopMotivators.forEach(m => { motivatorCounts[m] = (motivatorCounts[m] || 0) + 1; });
    
    const sharedMotivator = Object.entries(motivatorCounts).find(([_, count]) => count >= 2);
    if (sharedMotivator) {
      insights.push({ type: 'synergy', text: `Motivador compartido: ${sharedMotivator[0]} - facilita alineación de objetivos` });
    }
    
    // Analizar EQ promedio
    const eqScores = compareList.filter(p => p.eq).map(p => p.eq!.totalScore);
    if (eqScores.length >= 2) {
      const avgEQ = eqScores.reduce((a, b) => a + b, 0) / eqScores.length;
      if (avgEQ >= 75) {
        insights.push({ type: 'strength', text: 'Alto nivel de Inteligencia Emocional promedio - equipo con gran capacidad para manejar relaciones y conflictos' });
      } else if (avgEQ < 50) {
        insights.push({ type: 'opportunity', text: 'Oportunidad de desarrollo en Inteligencia Emocional para mejorar la dinámica del equipo' });
      }
    }
    
    return insights;
  };

  const teamInsights = useMemo(() => generateTeamInsights(), [compareList]);

  // Calcular compatibilidad promedio del grupo (debe estar antes del return condicional)
  const avgCompatibility = useMemo(() => {
    if (compareList.length < 2) return 0;
    let totalScore = 0;
    let pairs = 0;
    for (let i = 0; i < compareList.length; i++) {
      for (let j = i + 1; j < compareList.length; j++) {
        totalScore += calculateCompatibility(compareList[i], compareList[j]);
        pairs++;
      }
    }
    return pairs > 0 ? Math.round(totalScore / pairs) : 0;
  }, [compareList]);

  // Si no hay suficientes personas seleccionadas
  if (compareList.length < 2) {
    return (
      <div className="space-y-6">
        {/* Hero Section - Comparar */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 p-6 sm:p-8 shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <GitCompare className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('analytics.comparePeople')}</h1>
                <p className="text-white/80 text-sm sm:text-base">{t('analytics.compare.discoverSynergies')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{t('analytics.upTo4People')}</p>
                    <p className="text-white/70 text-xs">{t('analytics.sideComparison')}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Layers className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{t('analytics.7dimensions')}</p>
                    <p className="text-white/70 text-xs">{t('analytics.fullRecluAnalysis')}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{t('analytics.teamDynamics')}</p>
                    <p className="text-white/70 text-xs">{t('analytics.compatibilityInsights')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selector de personas */}
        <Card className="bg-white border-0 shadow-xl relative z-20">
          <div className="bg-gradient-to-r from-rose-50 to-purple-50 px-6 py-4 border-b border-rose-100 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-rose-600" />
                  {t('analytics.selectPeople')}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{t('analytics.selectMin2')} ({people.length} {t('analytics.people')})</p>
              </div>
              {compareList.length > 0 && (
                <Badge className="bg-rose-100 text-rose-700 text-sm px-3 py-1.5">
                  {compareList.length}/4 {t('analytics.selectedPeople')}
                </Badge>
              )}
            </div>
          </div>
          <CardContent className="p-6 relative z-30">
            <PersonSelector
              people={people}
              selectedPerson={null}
              onSelect={() => {}}
              recentSelections={recentSelections}
              getDiscColor={getDiscColor}
              mode="multi"
              compareList={compareList}
              onToggleCompare={toggleCompare}
            />

            {compareList.length > 0 && (
              <div className="mt-6 p-5 bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 rounded-xl border border-rose-200">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-gray-900">{t('analytics.selectedPeople')}</p>
                  <span className="text-rose-600 text-sm font-medium">{2 - compareList.length > 0 ? `${2 - compareList.length} ${t('analytics.remaining')}` : '✓'}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {compareList.map((person, idx) => (
                    <div 
                      key={person.id}
                      className={`flex items-center gap-3 bg-white px-4 py-3 rounded-xl border-2 shadow-sm transition-all hover:shadow-md ${COMPARE_COLORS[idx].border}`}
                    >
                      <div className={`w-10 h-10 rounded-full ${COMPARE_COLORS[idx].bg} flex items-center justify-center text-white font-bold shadow-lg`}>
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">{person.name}</span>
                        <div className="flex gap-1 mt-0.5 flex-wrap">
                          {person.disc && <span className="text-xs text-indigo-600 font-medium">DISC</span>}
                          {person.drivingForces && <span className="text-xs text-purple-600 font-medium">• FM</span>}
                          {person.eq && <span className="text-xs text-rose-600 font-medium">• EQ</span>}
                          {person.dna && <span className="text-xs text-teal-600 font-medium">• DNA</span>}
                          {person.acumen && <span className="text-xs text-amber-600 font-medium">• ACI</span>}
                          {person.values && <span className="text-xs text-violet-600 font-medium">• Val</span>}
                          {person.stress && <span className="text-xs text-orange-600 font-medium">• Str</span>}
                          {person.technical && <span className="text-xs text-sky-600 font-medium">• Téc</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCompare(person)}
                        className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Características del análisis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-white to-rose-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{t('analytics.compare.teamDynamics')}</h3>
                  <p className="text-gray-600 text-sm">{t('analytics.compare.teamDynamicsDesc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{t('analytics.compare.compatibilityMatrix')}</h3>
                  <p className="text-gray-600 text-sm">{t('analytics.compatibilityDesc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-amber-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{t('analytics.compare.strengthsGaps')}</h3>
                  <p className="text-gray-600 text-sm">{t('analytics.compare.strengthsGapsDesc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{t('analytics.compare.synergiesTensions')}</h3>
                  <p className="text-gray-600 text-sm">{t('analytics.compare.synergiesTensionsDesc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header con indicadores */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 p-4 sm:p-6 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl flex-shrink-0">
                <GitCompare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-white">{t('analytics.comparing')} {compareList.length} {t('analytics.people')}</h1>
                <p className="text-white/80 text-sm">{t('analytics.compare.deepAnalysis')}</p>
              </div>
            </div>
            
            {/* Indicador de compatibilidad promedio */}
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-base sm:text-xl font-bold ${
                    avgCompatibility >= 80 ? 'bg-emerald-500' : 
                    avgCompatibility >= 60 ? 'bg-amber-500' : 'bg-orange-500'
                  } text-white shadow-lg flex-shrink-0`}>
                    {avgCompatibility}%
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm sm:text-base">{t('analytics.compare.compatibility')}</p>
                    <p className="text-white/70 text-xs sm:text-sm">
                      {avgCompatibility >= 80 ? t('analytics.compare.excellentTeam') : 
                       avgCompatibility >= 60 ? t('analytics.compare.goodSynergy') : t('analytics.compare.opportunities')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personas seleccionadas */}
          <div className="flex flex-wrap gap-2 mt-4">
            {compareList.map((person, idx) => (
              <div 
                key={person.id}
                className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20 min-w-0 max-w-full"
              >
                <div className={`w-8 h-8 flex-shrink-0 rounded-full ${COMPARE_COLORS[idx].bg} flex items-center justify-center text-white font-bold shadow-lg`}>
                  {person.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white truncate text-sm max-w-[120px]">{person.name}</p>
                  <div className="hidden sm:flex gap-1 mt-0.5 flex-wrap">
                    {person.disc && <span className="text-xs text-white/80">{person.disc.primaryStyle}</span>}
                    {person.drivingForces && <span className="text-xs text-white/80">• FM</span>}
                    {person.eq && <span className="text-xs text-white/80">• EQ</span>}
                    {person.dna && <span className="text-xs text-white/80">• DNA</span>}
                    {person.acumen && <span className="text-xs text-white/80">• ACI</span>}
                    {person.values && <span className="text-xs text-white/80">• Val</span>}
                    {person.stress && <span className="text-xs text-white/80">• Str</span>}
                    {person.technical && <span className="text-xs text-white/80">• Téc</span>}
                  </div>
                </div>
                <button
                  onClick={() => toggleCompare(person)}
                  className="flex-shrink-0 p-1 text-white/60 hover:text-white hover:bg-white/20 rounded-full transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            
            {compareList.length < 4 && (
              <button 
                onClick={() => {}}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl border border-dashed border-white/30 text-white/70 hover:text-white transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">{t('analytics.compare.addPerson')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs de navegación modernos */}
      <Card className="bg-white border-0 shadow-lg relative z-20">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-2 sm:px-4 py-2 sm:py-3 border-b rounded-t-lg">
          <div className="flex gap-0.5 sm:gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { key: 'resumen', labelKey: 'analytics.compare.tab.summary', icon: Layers, color: 'indigo' },
              { key: 'disc', labelKey: 'analytics.compare.tab.disc', icon: Brain, color: 'indigo' },
              { key: 'fm', labelKey: 'analytics.compare.tab.df', icon: Target, color: 'purple' },
              { key: 'eq', labelKey: 'analytics.compare.tab.eq', icon: Heart, color: 'rose' },
              { key: 'dna', labelKey: 'analytics.compare.tab.dna', icon: Dna, color: 'teal' },
              { key: 'acumen', labelKey: 'analytics.compare.tab.acumen', icon: Compass, color: 'amber' },
              { key: 'values', labelKey: 'analytics.compare.tab.values', icon: Scale, color: 'violet' },
              { key: 'stress', labelKey: 'analytics.compare.tab.stress', icon: Activity, color: 'orange' },
              { key: 'technical', labelKey: 'analytics.compare.tab.technical', icon: FileCode, color: 'sky' },
              { key: 'equipo', labelKey: 'analytics.compare.tab.team', icon: Users, color: 'emerald' },
              { key: 'compatibilidad', labelKey: 'analytics.compare.tab.compatibility', icon: Sparkles, color: 'pink' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setCompareTab(tab.key as typeof compareTab)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  compareTab === tab.key 
                    ? `bg-${tab.color}-100 text-${tab.color}-700 shadow-sm` 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>{t(tab.labelKey)}</span>
              </button>
            ))}
          </div>
        </div>
        <CardContent className="p-2 sm:p-4 relative z-30">
          <PersonSelector
            people={people}
            selectedPerson={null}
            onSelect={() => {}}
            recentSelections={recentSelections}
            getDiscColor={getDiscColor}
            mode="multi"
            compareList={compareList}
            onToggleCompare={toggleCompare}
          />
        </CardContent>
      </Card>

      {/* TAB: RESUMEN */}
      {compareTab === 'resumen' && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className={`grid gap-4 ${compareList.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : compareList.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
            {compareList.map((person, idx) => (
              <Card key={person.id} className={`border-t-4 ${
                idx === 0 ? 'border-t-indigo-500' :
                idx === 1 ? 'border-t-emerald-500' :
                idx === 2 ? 'border-t-amber-500' :
                'border-t-rose-500'
              } shadow-lg`}>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 rounded-full ${COMPARE_COLORS[idx].bg} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3`}>
                      {person.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-gray-900">{person.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{person.email}</p>
                  </div>

                  {/* DISC */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2 flex items-center gap-1">
                      <Brain className="w-3 h-3" /> DISC
                    </p>
                    {person.disc ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 ${getDiscColor(person.disc.primaryStyle)} rounded-lg flex items-center justify-center text-white font-bold`}>
                          {person.disc.primaryStyle}
                        </div>
                        <div className="flex-1 text-sm">
                          <p className="font-medium text-gray-900">{DISC_DESCRIPTIONS[person.disc.primaryStyle]?.name}</p>
                          <p className="text-gray-500 text-xs">{person.disc.personalityType}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">{t('analytics.compare.notEvaluated')}</p>
                    )}
                  </div>

                  {/* FM */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2 flex items-center gap-1">
                      <Target className="w-3 h-3" /> {t('analytics.compare.mainMotivator')}
                    </p>
                    {person.drivingForces ? (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 capitalize text-sm">{person.drivingForces.topMotivator?.toLowerCase()}</p>
                          <div className="flex gap-1 mt-1">
                            {person.drivingForces.primaryMotivators?.slice(0, 2).map(m => (
                              <Badge key={m} variant="outline" className="text-xs py-0">{m.substring(0, 4)}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">{t('analytics.compare.notEvaluated')}</p>
                    )}
                  </div>

                  {/* EQ */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2 flex items-center gap-1">
                      <Heart className="w-3 h-3" /> EQ
                    </p>
                    {person.eq ? (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {person.eq.totalScore}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{person.eq.eqLevel.replace('_', ' ')}</p>
                          <p className="text-gray-500 text-xs">{person.eq.profile}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">{t('analytics.compare.notEvaluated')}</p>
                    )}
                  </div>

                  {/* DNA */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2 flex items-center gap-1">
                      <Dna className="w-3 h-3" /> DNA-25
                    </p>
                    {person.dna ? (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {person.dna.totalDNAPercentile}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{person.dna.dnaLevel}</p>
                          <p className="text-gray-500 text-xs">{person.dna.dnaProfile}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">{t('analytics.compare.notEvaluated')}</p>
                    )}
                  </div>

                  {/* Acumen */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2 flex items-center gap-1">
                      <Compass className="w-3 h-3" /> Acumen
                    </p>
                    {person.acumen ? (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {person.acumen.totalAcumenScore}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{person.acumen.acumenLevel?.replace('_', ' ')}</p>
                          <p className="text-gray-500 text-xs">{person.acumen.acumenProfile}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">{t('analytics.compare.notEvaluated')}</p>
                    )}
                  </div>

                  {/* Values */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2 flex items-center gap-1">
                      <Scale className="w-3 h-3" /> {t('analytics.compare.values')}
                    </p>
                    {person.values ? (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-violet-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {person.values.integrityScore}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{t('analytics.compare.integrity')}</p>
                          <p className="text-gray-500 text-xs">{person.values.valuesProfile}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">{t('analytics.compare.notEvaluated')}</p>
                    )}
                  </div>

                  {/* Stress */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> {t('analytics.compare.stress')}
                    </p>
                    {person.stress ? (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {person.stress.indiceResiliencia}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{person.stress.resilienceLevel}</p>
                          <p className="text-gray-500 text-xs">{t('analytics.compare.stress')}: {person.stress.stressLevel}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">{t('analytics.compare.notEvaluated')}</p>
                    )}
                  </div>

                  {/* Technical */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2 flex items-center gap-1">
                      <FileCode className="w-3 h-3" /> {language === 'es' ? 'Técnica' : 'Technical'}
                    </p>
                    {person.technical ? (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {Math.round(person.technical.totalScore)}%
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{person.technical.performanceLevel}</p>
                          <p className="text-gray-500 text-xs">{person.technical.correctAnswers}/{person.technical.totalQuestions} {language === 'es' ? 'correctas' : 'correct'}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">{t('analytics.compare.notEvaluated')}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Team Insights */}
          {teamInsights.length > 0 && (
            <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-rose-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  {t('analytics.compare.teamInsights')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamInsights.map((insight, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        insight.type === 'strength' ? 'bg-green-50 border border-green-200' :
                        insight.type === 'opportunity' ? 'bg-amber-50 border border-amber-200' :
                        insight.type === 'synergy' ? 'bg-blue-50 border border-blue-200' :
                        'bg-orange-50 border border-orange-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-full ${
                        insight.type === 'strength' ? 'bg-green-100' :
                        insight.type === 'opportunity' ? 'bg-amber-100' :
                        insight.type === 'synergy' ? 'bg-blue-100' :
                        'bg-orange-100'
                      }`}>
                        {insight.type === 'strength' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        {insight.type === 'opportunity' && <TrendingUp className="w-4 h-4 text-amber-600" />}
                        {insight.type === 'synergy' && <Zap className="w-4 h-4 text-blue-600" />}
                        {insight.type === 'tension' && <AlertCircle className="w-4 h-4 text-orange-600" />}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold uppercase mb-0.5 ${
                          insight.type === 'strength' ? 'text-green-700' :
                          insight.type === 'opportunity' ? 'text-amber-700' :
                          insight.type === 'synergy' ? 'text-blue-700' :
                          'text-orange-700'
                        }`}>
                          {insight.type === 'strength' && t('analytics.compare.strength')}
                          {insight.type === 'opportunity' && t('analytics.compare.opportunity')}
                          {insight.type === 'synergy' && t('analytics.compare.synergy')}
                          {insight.type === 'tension' && t('analytics.compare.attention')}
                        </p>
                        <p className="text-sm text-gray-700">{insight.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* TAB: DISC */}
      {compareTab === 'disc' && (
        <div className="space-y-6">
          {/* Comparativa DISC */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                {t('analytics.compare.profileComparison')} DISC
              </CardTitle>
              <CardDescription>{language === 'es' ? 'Análisis detallado de comportamientos y estilos' : 'Detailed analysis of behaviors and styles'}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Gráfico de barras comparativo */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.percentileByDimension')}</h4>
                {['D', 'I', 'S', 'C'].map(dim => (
                  <div key={dim} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 min-w-0 flex-shrink-0 w-28 truncate">
                        {dim} - {DISC_DESCRIPTIONS[dim].name}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {compareList.map((person, idx) => {
                        const value = person.disc 
                          ? person.disc[`percentile${dim}` as keyof typeof person.disc] as number
                          : 0;
                        return (
                          <div key={person.id} className="flex items-center gap-3">
                            <span className={`text-xs font-medium ${COMPARE_COLORS[idx].text} w-16 truncate flex-shrink-0`}>
                              {person.name.split(' ')[0]}
                            </span>
                            <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                              <div 
                                className={`h-full ${COMPARE_COLORS[idx].bg} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{ width: person.disc ? `${value}%` : '0%' }}
                              >
                                {person.disc && (
                                  <span className="text-xs font-bold text-white">{value.toFixed(0)}%</span>
                                )}
                              </div>
                            </div>
                            {!person.disc && <span className="text-xs text-gray-400">N/A</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabla de estilos */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.styleSummary')}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-semibold text-gray-600">{t('analytics.compare.person')}</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-600">{t('analytics.compare.primaryStyle')}</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-600">{t('analytics.compare.type')}</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-600">{t('analytics.compare.characteristics')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compareList.map((person, idx) => (
                        <tr key={person.id} className="border-b border-gray-100">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full ${COMPARE_COLORS[idx].bg} flex items-center justify-center text-white font-bold text-sm`}>
                                {person.name.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-900">{person.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            {person.disc ? (
                              <div className={`inline-flex items-center justify-center w-10 h-10 ${getDiscColor(person.disc.primaryStyle)} rounded-lg text-white font-bold`}>
                                {person.disc.primaryStyle}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="text-gray-700">{person.disc?.personalityType || '-'}</span>
                          </td>
                          <td className="py-3 px-2">
                            {person.disc ? (
                              <div className="flex flex-wrap gap-1">
                                {DISC_DESCRIPTIONS[person.disc.primaryStyle].traits.slice(0, 3).map(trait => (
                                  <Badge key={trait} variant="outline" className="text-xs">{trait}</Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">{t('analytics.compare.notEvaluated')}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: FM */}
      {compareTab === 'fm' && (
        <div className="space-y-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                {t('analytics.compare.dfComparison')}
              </CardTitle>
              <CardDescription>{t('analytics.compare.motivatorsDrivers')}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Top Motivadores */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.mainMotivators')}</h4>
                <div className={`grid gap-4 ${compareList.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : compareList.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
                  {compareList.map((person, idx) => (
                    <div key={person.id} className={`p-4 rounded-xl ${COMPARE_COLORS[idx].bgLight} border ${COMPARE_COLORS[idx].border}`}>
                      <p className={`font-semibold ${COMPARE_COLORS[idx].text} mb-3`}>{person.name}</p>
                      {person.drivingForces?.primaryMotivators ? (
                        <div className="space-y-2">
                          {person.drivingForces.primaryMotivators.slice(0, 4).map((motivator, i) => (
                            <div key={motivator} className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-500 w-4">{i + 1}.</span>
                              <span className="text-sm text-gray-700 capitalize">{motivator.toLowerCase()}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">{t('analytics.compare.notEvaluated')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Gráfico comparativo de todos los motivadores */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.percentileByMotivator')}</h4>
                <div className="space-y-3">
                  {Object.entries(MOTIVATOR_NAMES).map(([key, name]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">{name}</span>
                      </div>
                      <div className="space-y-1.5">
                        {compareList.map((person, idx) => {
                          const value = person.drivingForces 
                            ? (person.drivingForces[key as keyof typeof person.drivingForces] as number)
                            : 0;
                          return (
                            <div key={person.id} className="flex items-center gap-2">
                              <span className={`text-xs ${COMPARE_COLORS[idx].text} w-16 truncate`}>
                                {person.name.split(' ')[0]}
                              </span>
                              <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden">
                                <div 
                                  className={`h-full ${COMPARE_COLORS[idx].bg} rounded-full transition-all duration-500`}
                                  style={{ width: person.drivingForces ? `${value}%` : '0%' }}
                                />
                              </div>
                              <span className="text-xs font-medium text-gray-600 w-10 text-right">
                                {person.drivingForces ? `${value.toFixed(0)}%` : 'N/A'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: EQ */}
      {compareTab === 'eq' && (
        <div className="space-y-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" />
                {t('analytics.compare.eqComparison')}
              </CardTitle>
              <CardDescription>{t('analytics.compare.5eqDimensions')}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Scores totales */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.totalEQScore')}</h4>
                <div className={`grid gap-4 ${compareList.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : compareList.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
                  {compareList.map((person, idx) => (
                    <div key={person.id} className={`relative overflow-hidden p-6 rounded-xl bg-gradient-to-br ${
                      idx === 0 ? 'from-indigo-500 to-indigo-600' :
                      idx === 1 ? 'from-emerald-500 to-emerald-600' :
                      idx === 2 ? 'from-amber-500 to-amber-600' :
                      'from-rose-500 to-rose-600'
                    } text-white`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                      <p className="font-medium opacity-90 mb-1">{person.name}</p>
                      {person.eq ? (
                        <>
                          <p className="text-4xl font-bold">{person.eq.totalScore}</p>
                          <p className="text-sm opacity-80 mt-1">{person.eq.eqLevel.replace('_', ' ')}</p>
                        </>
                      ) : (
                        <p className="text-lg opacity-70 mt-2">{t('analytics.compare.notEvaluated')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimensiones EQ */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.byDimension')}</h4>
                {Object.entries(EQ_DIMENSION_NAMES).map(([key, name]) => (
                  <div key={key} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{name}</span>
                    </div>
                    <div className="space-y-2">
                      {compareList.map((person, idx) => {
                        const value = person.eq 
                          ? (person.eq[key as keyof typeof person.eq] as number)
                          : 0;
                        return (
                          <div key={person.id} className="flex items-center gap-3">
                            <span className={`text-xs font-medium ${COMPARE_COLORS[idx].text} w-16 truncate flex-shrink-0`}>
                              {person.name.split(' ')[0]}
                            </span>
                            <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                              <div 
                                className={`h-full ${COMPARE_COLORS[idx].bg} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{ width: person.eq ? `${value}%` : '0%' }}
                              >
                                {person.eq && (
                                  <span className="text-xs font-bold text-white">{value.toFixed(0)}%</span>
                                )}
                              </div>
                            </div>
                            {!person.eq && <span className="text-xs text-gray-400">N/A</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fortalezas y áreas de desarrollo */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    {t('analytics.compare.mainStrengths')}
                  </h4>
                  <div className="space-y-2">
                    {compareList.map((person, idx) => (
                      <div key={person.id} className={`p-3 rounded-lg ${COMPARE_COLORS[idx].bgLight}`}>
                        <p className={`text-xs font-semibold ${COMPARE_COLORS[idx].text} mb-1`}>{person.name}</p>
                        {person.eq?.strengths ? (
                          <div className="flex flex-wrap gap-1">
                            {person.eq.strengths.slice(0, 2).map(s => (
                              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">{t('analytics.compare.notEvaluated')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    {t('analytics.compare.developmentAreas')}
                  </h4>
                  <div className="space-y-2">
                    {compareList.map((person, idx) => (
                      <div key={person.id} className={`p-3 rounded-lg ${COMPARE_COLORS[idx].bgLight}`}>
                        <p className={`text-xs font-semibold ${COMPARE_COLORS[idx].text} mb-1`}>{person.name}</p>
                        {person.eq?.developmentAreas ? (
                          <div className="flex flex-wrap gap-1">
                            {person.eq.developmentAreas.slice(0, 2).map(s => (
                              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">{t('analytics.compare.notEvaluated')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: DNA */}
      {compareTab === 'dna' && (
        <div className="space-y-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dna className="w-5 h-5 text-teal-600" />
                {t('analytics.compare.dnaComparison')}
              </CardTitle>
              <CardDescription>{t('analytics.compare.5categoryAnalysis')}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Scores totales */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.totalDNAScore')}</h4>
                <div className={`grid gap-4 ${compareList.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : compareList.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
                  {compareList.map((person, idx) => (
                    <div key={person.id} className={`relative overflow-hidden p-6 rounded-xl bg-gradient-to-br ${
                      idx === 0 ? 'from-teal-500 to-teal-600' :
                      idx === 1 ? 'from-cyan-500 to-cyan-600' :
                      idx === 2 ? 'from-emerald-500 to-emerald-600' :
                      'from-green-500 to-green-600'
                    } text-white`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                      <p className="font-medium opacity-90 mb-1">{person.name}</p>
                      {person.dna ? (
                        <>
                          <p className="text-4xl font-bold">{person.dna.totalDNAPercentile}</p>
                          <p className="text-sm opacity-80 mt-1">{person.dna.dnaLevel}</p>
                        </>
                      ) : (
                        <p className="text-lg opacity-70 mt-2">{t('analytics.compare.notEvaluated')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Perfiles DNA */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.dnaProfiles')}</h4>
                <div className={`grid gap-4 ${compareList.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : compareList.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
                  {compareList.map((person, idx) => (
                    <div key={person.id} className={`p-4 rounded-xl ${COMPARE_COLORS[idx].bgLight} border ${COMPARE_COLORS[idx].border}`}>
                      <p className={`font-semibold ${COMPARE_COLORS[idx].text} mb-2`}>{person.name}</p>
                      {person.dna ? (
                        <>
                          <p className="text-sm font-medium text-gray-900">{person.dna.dnaProfile}</p>
                          {person.dna.primaryStrengths && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {person.dna.primaryStrengths.slice(0, 3).map((s, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-400 italic">{t('analytics.compare.notEvaluated')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Categorías DNA */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.byCategory')}</h4>
                {[
                  { key: 'thinkingCategoryScore', nameKey: 'analytics.compare.thinking', icon: '🧠' },
                  { key: 'communicationCategoryScore', nameKey: 'analytics.compare.communicationCat', icon: '💬' },
                  { key: 'leadershipCategoryScore', nameKey: 'analytics.compare.leadershipCat', icon: '👥' },
                  { key: 'resultsCategoryScore', nameKey: 'analytics.compare.results', icon: '🎯' },
                  { key: 'relationshipCategoryScore', nameKey: 'analytics.compare.relationship', icon: '🤝' },
                ].map(({ key, nameKey, icon }) => (
                  <div key={key} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{icon} {t(nameKey)}</span>
                    </div>
                    <div className="space-y-2">
                      {compareList.map((person, idx) => {
                        const value = person.dna 
                          ? (person.dna[key as keyof typeof person.dna] as number)
                          : 0;
                        return (
                          <div key={person.id} className="flex items-center gap-3">
                            <span className={`text-xs font-medium ${COMPARE_COLORS[idx].text} w-16 truncate flex-shrink-0`}>
                              {person.name.split(' ')[0]}
                            </span>
                            <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                              <div 
                                className={`h-full ${COMPARE_COLORS[idx].bg} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{ width: person.dna ? `${value}%` : '0%' }}
                              >
                                {person.dna && (
                                  <span className="text-xs font-bold text-white">{value.toFixed(0)}%</span>
                                )}
                              </div>
                            </div>
                            {!person.dna && <span className="text-xs text-gray-400">N/A</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fortalezas y áreas de desarrollo */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    {t('analytics.compare.top3Competencies')}
                  </h4>
                  <div className="space-y-2">
                    {compareList.map((person, idx) => (
                      <div key={person.id} className={`p-3 rounded-lg ${COMPARE_COLORS[idx].bgLight}`}>
                        <p className={`text-xs font-semibold ${COMPARE_COLORS[idx].text} mb-1`}>{person.name}</p>
                        {person.dna?.primaryStrengths ? (
                          <div className="flex flex-wrap gap-1">
                            {person.dna.primaryStrengths.slice(0, 3).map(s => (
                              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">{t('analytics.compare.notEvaluated')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    {t('analytics.compare.developmentAreas')}
                  </h4>
                  <div className="space-y-2">
                    {compareList.map((person, idx) => (
                      <div key={person.id} className={`p-3 rounded-lg ${COMPARE_COLORS[idx].bgLight}`}>
                        <p className={`text-xs font-semibold ${COMPARE_COLORS[idx].text} mb-1`}>{person.name}</p>
                        {person.dna?.developmentAreas ? (
                          <div className="flex flex-wrap gap-1">
                            {person.dna.developmentAreas.slice(0, 3).map(s => (
                              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">{t('analytics.compare.notEvaluated')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: ACUMEN */}
      {compareTab === 'acumen' && (
        <div className="space-y-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-600" />
                {t('analytics.compare.acumenComparison')}
              </CardTitle>
              <CardDescription>{t('analytics.compare.6dimensionAnalysis')}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Scores totales */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.totalAcumenScoreLabel')}</h4>
                <div className={`grid gap-4 ${compareList.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : compareList.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
                  {compareList.map((person, idx) => (
                    <div key={person.id} className={`relative overflow-hidden p-6 rounded-xl bg-gradient-to-br ${
                      idx === 0 ? 'from-amber-500 to-amber-600' :
                      idx === 1 ? 'from-orange-500 to-orange-600' :
                      idx === 2 ? 'from-yellow-500 to-yellow-600' :
                      'from-amber-600 to-orange-600'
                    } text-white`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                      <p className="font-medium opacity-90 mb-1">{person.name}</p>
                      {person.acumen ? (
                        <>
                          <p className="text-4xl font-bold">{person.acumen.totalAcumenScore}</p>
                          <p className="text-sm opacity-80 mt-1">{person.acumen.acumenLevel?.replace('_', ' ')}</p>
                        </>
                      ) : (
                        <p className="text-lg opacity-70 mt-2">{t('analytics.compare.notEvaluated')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Perfiles Acumen */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.acumenProfiles')}</h4>
                <div className={`grid gap-4 ${compareList.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : compareList.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
                  {compareList.map((person, idx) => (
                    <div key={person.id} className={`p-4 rounded-xl ${COMPARE_COLORS[idx].bgLight} border ${COMPARE_COLORS[idx].border}`}>
                      <p className={`font-semibold ${COMPARE_COLORS[idx].text} mb-2`}>{person.name}</p>
                      {person.acumen ? (
                        <>
                          <p className="text-sm font-medium text-gray-900">{person.acumen.acumenProfile}</p>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <p className="text-xs text-gray-500">{t('analytics.compare.external')}</p>
                              <p className="font-bold text-blue-600">{person.acumen.externalClarityScore}</p>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded">
                              <p className="text-xs text-gray-500">{t('analytics.compare.internal')}</p>
                              <p className="font-bold text-purple-600">{person.acumen.internalClarityScore}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400 italic">{t('analytics.compare.notEvaluated')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimensiones Acumen - Externos */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.externalFactors')}</h4>
                {[
                  { key: 'understandingOthersClarity', nameKey: 'analytics.compare.understandingOthers', icon: '🔍' },
                  { key: 'practicalThinkingClarity', nameKey: 'analytics.compare.practicalThinking', icon: '⚙️' },
                  { key: 'systemsJudgmentClarity', nameKey: 'analytics.compare.systemsJudgment', icon: '📊' },
                ].map(({ key, nameKey, icon }) => (
                  <div key={key} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{icon} {t(nameKey)}</span>
                    </div>
                    <div className="space-y-2">
                      {compareList.map((person, idx) => {
                        const value = person.acumen 
                          ? (person.acumen[key as keyof typeof person.acumen] as number)
                          : 0;
                        return (
                          <div key={person.id} className="flex items-center gap-3">
                            <span className={`text-xs font-medium ${COMPARE_COLORS[idx].text} w-16 truncate flex-shrink-0`}>
                              {person.name.split(' ')[0]}
                            </span>
                            <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                              <div 
                                className={`h-full ${COMPARE_COLORS[idx].bg} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{ width: person.acumen ? `${value * 10}%` : '0%' }}
                              >
                                {person.acumen && (
                                  <span className="text-xs font-bold text-white">{value.toFixed(1)}</span>
                                )}
                              </div>
                            </div>
                            {!person.acumen && <span className="text-xs text-gray-400">N/A</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Dimensiones Acumen - Internos */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.internalFactors')}</h4>
                {[
                  { key: 'senseOfSelfClarity', nameKey: 'analytics.compare.senseOfSelf', icon: '🪞' },
                  { key: 'roleAwarenessClarity', nameKey: 'analytics.compare.roleAwareness', icon: '🎭' },
                  { key: 'selfDirectionClarity', nameKey: 'analytics.compare.selfDirection', icon: '🧭' },
                ].map(({ key, nameKey, icon }) => (
                  <div key={key} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{icon} {t(nameKey)}</span>
                    </div>
                    <div className="space-y-2">
                      {compareList.map((person, idx) => {
                        const value = person.acumen 
                          ? (person.acumen[key as keyof typeof person.acumen] as number)
                          : 0;
                        return (
                          <div key={person.id} className="flex items-center gap-3">
                            <span className={`text-xs font-medium ${COMPARE_COLORS[idx].text} w-16 truncate flex-shrink-0`}>
                              {person.name.split(' ')[0]}
                            </span>
                            <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                              <div 
                                className={`h-full ${COMPARE_COLORS[idx].bg} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{ width: person.acumen ? `${value * 10}%` : '0%' }}
                              >
                                {person.acumen && (
                                  <span className="text-xs font-bold text-white">{value.toFixed(1)}</span>
                                )}
                              </div>
                            </div>
                            {!person.acumen && <span className="text-xs text-gray-400">N/A</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fortalezas y áreas de desarrollo */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    {t('analytics.compare.mainStrengths')}
                  </h4>
                  <div className="space-y-2">
                    {compareList.map((person, idx) => (
                      <div key={person.id} className={`p-3 rounded-lg ${COMPARE_COLORS[idx].bgLight}`}>
                        <p className={`text-xs font-semibold ${COMPARE_COLORS[idx].text} mb-1`}>{person.name}</p>
                        {person.acumen?.primaryStrengths ? (
                          <div className="flex flex-wrap gap-1">
                            {person.acumen.primaryStrengths.slice(0, 3).map(s => (
                              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">{t('analytics.compare.notEvaluated')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    {t('analytics.compare.developmentAreas')}
                  </h4>
                  <div className="space-y-2">
                    {compareList.map((person, idx) => (
                      <div key={person.id} className={`p-3 rounded-lg ${COMPARE_COLORS[idx].bgLight}`}>
                        <p className={`text-xs font-semibold ${COMPARE_COLORS[idx].text} mb-1`}>{person.name}</p>
                        {person.acumen?.developmentAreas ? (
                          <div className="flex flex-wrap gap-1">
                            {person.acumen.developmentAreas.slice(0, 3).map(s => (
                              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">{t('analytics.compare.notEvaluated')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: VALUES */}
      {compareTab === 'values' && (
        <div className="space-y-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-violet-600" />
                {t('analytics.compare.valuesComparison')}
              </CardTitle>
              <CardDescription>{t('analytics.compare.6valuesAnalysis')}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Scores de Integridad */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.integrityIndicators')}</h4>
                <div className={`grid gap-4 ${compareList.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : compareList.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
                  {compareList.map((person, idx) => (
                    <div key={person.id} className={`relative overflow-hidden p-6 rounded-xl bg-gradient-to-br ${
                      idx === 0 ? 'from-violet-500 to-purple-600' :
                      idx === 1 ? 'from-purple-500 to-pink-600' :
                      idx === 2 ? 'from-fuchsia-500 to-violet-600' :
                      'from-indigo-500 to-purple-600'
                    } text-white`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                      <p className="font-medium opacity-90 mb-1">{person.name}</p>
                      {person.values ? (
                        <>
                          <p className="text-4xl font-bold">{person.values.integrityScore}</p>
                          <p className="text-sm opacity-80 mt-1">{t('analytics.compare.integrity')}</p>
                          <div className="flex gap-2 mt-3">
                            <div className="text-center px-2">
                              <p className="text-lg font-bold">{person.values.consistencyScore}</p>
                              <p className="text-xs opacity-70">{t('analytics.compare.consistency')}</p>
                            </div>
                            <div className="text-center px-2">
                              <p className="text-lg font-bold">{person.values.authenticityScore}</p>
                              <p className="text-xs opacity-70">{t('analytics.compare.authenticity')}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-lg opacity-70 mt-2">{t('analytics.compare.notEvaluated')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimensiones de Valores */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.valueDimensions')}</h4>
                {[
                  { key: 'teoricoPercentile', nameKey: 'analytics.compare.theoretical', icon: '📚', descKey: 'analytics.compare.theoreticalDesc' },
                  { key: 'utilitarioPercentile', nameKey: 'analytics.compare.utilitarian', icon: '💰', descKey: 'analytics.compare.utilitarianDesc' },
                  { key: 'esteticoPercentile', nameKey: 'analytics.compare.aesthetic', icon: '🎨', descKey: 'analytics.compare.aestheticDesc' },
                  { key: 'socialPercentile', nameKey: 'analytics.compare.social', icon: '🤝', descKey: 'analytics.compare.socialDesc' },
                  { key: 'individualistaPercentile', nameKey: 'analytics.compare.individualist', icon: '🏆', descKey: 'analytics.compare.individualistDesc' },
                  { key: 'tradicionalPercentile', nameKey: 'analytics.compare.traditional', icon: '⚖️', descKey: 'analytics.compare.traditionalDesc' },
                ].map(({ key, nameKey, icon, descKey }) => (
                  <div key={key} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{icon} {t(nameKey)}</span>
                      <span className="text-xs text-gray-500">{t(descKey)}</span>
                    </div>
                    <div className="space-y-2">
                      {compareList.map((person, idx) => {
                        const value = person.values 
                          ? (person.values[key as keyof typeof person.values] as number)
                          : 0;
                        return (
                          <div key={person.id} className="flex items-center gap-3">
                            <span className={`text-xs font-medium ${COMPARE_COLORS[idx].text} w-16 truncate flex-shrink-0`}>
                              {person.name.split(' ')[0]}
                            </span>
                            <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                              <div 
                                className={`h-full ${COMPARE_COLORS[idx].bg} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{ width: person.values ? `${value}%` : '0%' }}
                              >
                                {person.values && (
                                  <span className="text-xs font-bold text-white">{value}%</span>
                                )}
                              </div>
                            </div>
                            {!person.values && <span className="text-xs text-gray-400">N/A</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Valores Primarios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600" />
                    {t('analytics.compare.primaryValues')}
                  </h4>
                  <div className="space-y-2">
                    {compareList.map((person, idx) => (
                      <div key={person.id} className={`p-3 rounded-lg ${COMPARE_COLORS[idx].bgLight}`}>
                        <p className={`text-xs font-semibold ${COMPARE_COLORS[idx].text} mb-1`}>{person.name}</p>
                        {person.values?.primaryValues ? (
                          <div className="flex flex-wrap gap-1">
                            {person.values.primaryValues.slice(0, 3).map(v => (
                              <Badge key={v} variant="outline" className="text-xs">{v}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">{t('analytics.compare.notEvaluated')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    {t('analytics.compare.indifferentValues')}
                  </h4>
                  <div className="space-y-2">
                    {compareList.map((person, idx) => (
                      <div key={person.id} className={`p-3 rounded-lg ${COMPARE_COLORS[idx].bgLight}`}>
                        <p className={`text-xs font-semibold ${COMPARE_COLORS[idx].text} mb-1`}>{person.name}</p>
                        {person.values?.indifferentValues ? (
                          <div className="flex flex-wrap gap-1">
                            {person.values.indifferentValues.slice(0, 3).map(v => (
                              <Badge key={v} variant="outline" className="text-xs">{v}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">{t('analytics.compare.notEvaluated')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Alineación de Valores del Grupo */}
              {compareList.filter(p => p.values).length >= 2 && (
                <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
                  <h4 className="font-semibold text-violet-900 mb-3 flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    {t('analytics.compare.groupValuesAlignment')}
                  </h4>
                  {(() => {
                    const withValues = compareList.filter(p => p.values);
                    const allPrimaryValues = withValues.flatMap(p => p.values?.primaryValues || []);
                    const sharedValues = [...new Set(allPrimaryValues)].filter(v => 
                      withValues.every(p => p.values?.primaryValues?.includes(v))
                    );
                    const conflictingValues = [...new Set(
                      withValues.flatMap(p => p.values?.indifferentValues || [])
                    )].filter(v => withValues.some(p => p.values?.primaryValues?.includes(v)));
                    
                    return (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong className="text-green-700">{t('analytics.compare.sharedValues')}:</strong>
                          </p>
                          {sharedValues.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {sharedValues.map(v => (
                                <Badge key={v} className="bg-green-100 text-green-700 border-green-300">{v}</Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">{t('analytics.compare.noSharedPrimaryValues')}</p>
                          )}
                        </div>
                        {conflictingValues.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              <strong className="text-orange-700">{t('analytics.compare.possibleTensions')}:</strong>
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {conflictingValues.map(v => (
                                <Badge key={v} className="bg-orange-100 text-orange-700 border-orange-300">{v}</Badge>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {t('analytics.compare.tensionsExplanation')}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: STRESS - Análisis de Estrés y Resiliencia */}
      {compareTab === 'stress' && (
        <div className="space-y-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-600" />
                {t('analytics.compare.stressComparison')}
              </CardTitle>
              <CardDescription>{t('analytics.compare.5stressDimensions')}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Indicadores Principales */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.resilienceIndicators')}</h4>
                <div className={`grid gap-4 ${compareList.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : compareList.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
                  {compareList.map((person, idx) => (
                    <div key={person.id} className={`relative overflow-hidden p-6 rounded-xl bg-gradient-to-br ${
                      idx === 0 ? 'from-orange-500 to-rose-600' :
                      idx === 1 ? 'from-rose-500 to-orange-600' :
                      idx === 2 ? 'from-amber-500 to-orange-600' :
                      'from-red-500 to-rose-600'
                    } text-white`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                      <p className="font-medium opacity-90 mb-1">{person.name}</p>
                      {person.stress ? (
                        <>
                          <p className="text-4xl font-bold">{person.stress.indiceResiliencia}%</p>
                          <p className="text-sm opacity-80 mt-1">{person.stress.resilienceLevel}</p>
                          <div className="flex gap-2 mt-3">
                            <div className="text-center px-2">
                              <p className="text-lg font-bold">{person.stress.nivelEstresGeneral}%</p>
                              <p className="text-xs opacity-70">{t('analytics.compare.stress')}</p>
                            </div>
                            <div className="text-center px-2">
                              <p className="text-lg font-bold">{person.stress.capacidadAdaptacion}%</p>
                              <p className="text-xs opacity-70">{t('analytics.compare.adapt')}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-lg opacity-70 mt-2">{t('analytics.compare.notEvaluated')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimensiones de Estrés */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t('analytics.compare.stressWellbeingDimensions')}</h4>
                {[
                  { key: 'estresLaboralScore', nameKey: 'analytics.compare.workStress', icon: '⚡', descKey: 'analytics.compare.workStressDesc', invert: true },
                  { key: 'capacidadRecuperacionScore', nameKey: 'analytics.compare.recoveryCapacity', icon: '🔄', descKey: 'analytics.compare.recoveryCapacityDesc' },
                  { key: 'manejoEmocionalScore', nameKey: 'analytics.compare.emotionalManagement', icon: '💜', descKey: 'analytics.compare.emotionalManagementDesc' },
                  { key: 'equilibrioVidaScore', nameKey: 'analytics.compare.workLifeBalance', icon: '⚖️', descKey: 'analytics.compare.workLifeBalanceDesc' },
                  { key: 'resilienciaScore', nameKey: 'analytics.compare.generalResilience', icon: '🛡️', descKey: 'analytics.compare.generalResilienceDesc' },
                ].map(({ key, nameKey, icon, descKey, invert }) => (
                  <div key={key} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{icon} {t(nameKey)}</span>
                      <span className="text-xs text-gray-500">{t(descKey)}</span>
                    </div>
                    <div className="space-y-2">
                      {compareList.map((person, idx) => {
                        const value = person.stress 
                          ? (person.stress[key as keyof typeof person.stress] as number)
                          : 0;
                        const barColor = invert 
                          ? (value <= 30 ? 'bg-green-500' : value <= 50 ? 'bg-yellow-500' : value <= 70 ? 'bg-orange-500' : 'bg-red-500')
                          : COMPARE_COLORS[idx].bg;
                        return (
                          <div key={person.id} className="flex items-center gap-3">
                            <span className={`text-xs font-medium ${COMPARE_COLORS[idx].text} w-16 truncate flex-shrink-0`}>
                              {person.name.split(' ')[0]}
                            </span>
                            <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                              <div 
                                className={`h-full ${barColor} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{ width: person.stress ? `${value}%` : '0%' }}
                              >
                                {person.stress && (
                                  <span className="text-xs font-bold text-white">{value}%</span>
                                )}
                              </div>
                            </div>
                            {!person.stress && <span className="text-xs text-gray-400">N/A</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Factores de Riesgo y Protección */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    {t('analytics.compare.protectiveFactors')}
                  </h4>
                  <div className="space-y-2">
                    {compareList.map((person, idx) => (
                      <div key={person.id} className={`p-3 rounded-lg ${COMPARE_COLORS[idx].bgLight}`}>
                        <p className={`text-xs font-semibold ${COMPARE_COLORS[idx].text} mb-1`}>{person.name}</p>
                        {person.stress?.protectiveFactors && person.stress.protectiveFactors.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {person.stress.protectiveFactors.slice(0, 3).map(f => (
                              <Badge key={f} className="bg-green-100 text-green-700 text-xs">{f}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">{t('analytics.compare.notEvaluated')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    {t('analytics.compare.riskFactors')}
                  </h4>
                  <div className="space-y-2">
                    {compareList.map((person, idx) => (
                      <div key={person.id} className={`p-3 rounded-lg ${COMPARE_COLORS[idx].bgLight}`}>
                        <p className={`text-xs font-semibold ${COMPARE_COLORS[idx].text} mb-1`}>{person.name}</p>
                        {person.stress?.riskFactors && person.stress.riskFactors.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {person.stress.riskFactors.slice(0, 3).map(f => (
                              <Badge key={f} className="bg-red-100 text-red-700 text-xs">{f}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">{t('analytics.compare.noRiskFactors')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Análisis del Equipo */}
              {compareList.filter(p => p.stress).length >= 2 && (
                <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    {t('analytics.compare.teamWellbeingAnalysis')}
                  </h4>
                  {(() => {
                    const withStress = compareList.filter(p => p.stress);
                    const avgStress = Math.round(withStress.reduce((sum, p) => sum + (p.stress?.nivelEstresGeneral || 0), 0) / withStress.length);
                    const avgResilience = Math.round(withStress.reduce((sum, p) => sum + (p.stress?.indiceResiliencia || 0), 0) / withStress.length);
                    const highStress = withStress.filter(p => (p.stress?.nivelEstresGeneral || 0) > 60);
                    const lowResilience = withStress.filter(p => (p.stress?.indiceResiliencia || 0) < 50);
                    
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-white rounded-lg">
                            <p className="text-sm text-gray-600">{t('analytics.compare.teamAvgStress')}</p>
                            <p className={`text-2xl font-bold ${avgStress > 60 ? 'text-red-600' : avgStress > 40 ? 'text-amber-600' : 'text-green-600'}`}>
                              {avgStress}%
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded-lg">
                            <p className="text-sm text-gray-600">{t('analytics.compare.avgResilience')}</p>
                            <p className={`text-2xl font-bold ${avgResilience >= 70 ? 'text-green-600' : avgResilience >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                              {avgResilience}%
                            </p>
                          </div>
                        </div>
                        {highStress.length > 0 && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm font-medium text-red-700">
                              ⚠️ {highStress.length} {t('analytics.compare.highStressMembers')}: {highStress.map(p => p.name.split(' ')[0]).join(', ')}
                            </p>
                          </div>
                        )}
                        {lowResilience.length > 0 && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm font-medium text-amber-700">
                              💡 {lowResilience.length} {t('analytics.compare.needResilienceStrengthening')}: {lowResilience.map(p => p.name.split(' ')[0]).join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: TECHNICAL - Comparación de Pruebas Técnicas */}
      {compareTab === 'technical' && (
        <div className="space-y-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-sky-600" />
                {language === 'es' ? 'Comparación de Pruebas Técnicas' : 'Technical Tests Comparison'}
              </CardTitle>
              <CardDescription>{language === 'es' ? 'Análisis comparativo de conocimientos técnicos por cargo' : 'Comparative analysis of technical knowledge by position'}</CardDescription>
            </CardHeader>
            <CardContent>
              {compareList.filter(p => p.technical).length === 0 ? (
                <div className="text-center py-12">
                  <FileCode className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">{language === 'es' ? 'Sin pruebas técnicas completadas' : 'No completed technical tests'}</p>
                  <p className="text-sm text-gray-400">{language === 'es' ? 'Las personas seleccionadas no tienen evaluaciones técnicas.' : 'Selected people have no technical evaluations.'}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Ranking por puntaje */}
                  <div className="p-4 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl border border-sky-200">
                    <h4 className="text-sm font-semibold text-sky-900 mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {language === 'es' ? 'Ranking por Puntaje Total' : 'Ranking by Total Score'}
                    </h4>
                    <div className="space-y-3">
                      {compareList
                        .filter(p => p.technical)
                        .sort((a, b) => (b.technical?.totalScore || 0) - (a.technical?.totalScore || 0))
                        .map((person, idx) => (
                          <div key={person.id} className="flex items-center gap-4 p-3 bg-white rounded-lg">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white ${
                              idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-600' : 'bg-gray-300'
                            }`}>
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{person.name}</p>
                              <p className="text-xs text-gray-500">{person.technical?.performanceLevel}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-sky-600">{Math.round(person.technical?.totalScore || 0)}%</p>
                              <p className="text-xs text-gray-500">{person.technical?.correctAnswers}/{person.technical?.totalQuestions} {language === 'es' ? 'correctas' : 'correct'}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Comparación por dificultad */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Fácil */}
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <h5 className="text-sm font-semibold text-green-800 mb-3">{language === 'es' ? 'Preguntas Fáciles' : 'Easy Questions'}</h5>
                      <div className="space-y-2">
                        {compareList.filter(p => p.technical).map(person => (
                          <div key={person.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{person.name.split(' ')[0]}</span>
                            <span className="font-semibold text-green-700">{Math.round(person.technical?.easyScore || 0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Medio */}
                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <h5 className="text-sm font-semibold text-yellow-800 mb-3">{language === 'es' ? 'Preguntas Medias' : 'Medium Questions'}</h5>
                      <div className="space-y-2">
                        {compareList.filter(p => p.technical).map(person => (
                          <div key={person.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{person.name.split(' ')[0]}</span>
                            <span className="font-semibold text-yellow-700">{Math.round(person.technical?.mediumScore || 0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Difícil */}
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <h5 className="text-sm font-semibold text-red-800 mb-3">{language === 'es' ? 'Preguntas Difíciles' : 'Hard Questions'}</h5>
                      <div className="space-y-2">
                        {compareList.filter(p => p.technical).map(person => (
                          <div key={person.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{person.name.split(' ')[0]}</span>
                            <span className="font-semibold text-red-700">{Math.round(person.technical?.hardScore || 0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Fortalezas y Debilidades */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {compareList.filter(p => p.technical).map(person => (
                      <div key={person.id} className="p-4 bg-white rounded-xl border">
                        <h5 className="font-semibold text-gray-900 mb-3">{person.name}</h5>
                        {person.technical?.strengths && person.technical.strengths.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-green-700 mb-1">{language === 'es' ? 'Fortalezas:' : 'Strengths:'}</p>
                            <div className="flex flex-wrap gap-1">
                              {person.technical.strengths.slice(0, 3).map((s, i) => (
                                <Badge key={i} className="bg-green-100 text-green-700 text-xs">{s}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {person.technical?.weaknesses && person.technical.weaknesses.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-amber-700 mb-1">{language === 'es' ? 'Áreas de mejora:' : 'Areas to improve:'}</p>
                            <div className="flex flex-wrap gap-1">
                              {person.technical.weaknesses.slice(0, 3).map((w, i) => (
                                <Badge key={i} className="bg-amber-100 text-amber-700 text-xs">{w}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: EQUIPO - Análisis de Trabajo en Equipo */}
      {compareTab === 'equipo' && (
        <div className="space-y-6">
          {/* Card Principal: Dinámica de Equipo */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                {language === 'es' ? 'Análisis de Dinámica de Equipo' : 'Team Dynamics Analysis'}
              </CardTitle>
              <CardDescription>{language === 'es' ? 'Evaluación integral para trabajo colaborativo y gestión de recursos humanos' : 'Comprehensive evaluation for collaborative work and HR management'}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Resumen de Equipo */}
              <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200">
                <h4 className="text-lg font-semibold text-indigo-900 mb-4">{language === 'es' ? 'Perfil del Equipo' : 'Team Profile'}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const styles = compareList.filter(p => p.disc).map(p => p.disc!.primaryStyle);
                    const hasD = styles.includes('D');
                    const hasI = styles.includes('I');
                    const hasS = styles.includes('S');
                    const hasC = styles.includes('C');
                    const diversity = new Set(styles).size;
                    
                    return (
                      <>
                        <div className="text-center p-3 bg-white rounded-xl">
                          <p className="text-3xl font-bold text-indigo-600">{compareList.length}</p>
                          <p className="text-xs text-gray-500">{language === 'es' ? 'Miembros' : 'Members'}</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-xl">
                          <p className="text-3xl font-bold text-purple-600">{diversity}/4</p>
                          <p className="text-xs text-gray-500">{language === 'es' ? 'Diversidad DISC' : 'DISC Diversity'}</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-xl">
                          <p className="text-3xl font-bold text-teal-600">
                            {compareList.filter(p => p.hasFullProfile).length}
                          </p>
                          <p className="text-xs text-gray-500">{language === 'es' ? 'Perfil Completo' : 'Complete Profile'}</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-xl">
                          <p className="text-3xl font-bold text-amber-600">
                            {Math.round(compareList.filter(p => p.eq).reduce((acc, p) => acc + (p.eq?.totalScore || 0), 0) / Math.max(1, compareList.filter(p => p.eq).length))}
                          </p>
                          <p className="text-xs text-gray-500">{language === 'es' ? 'EQ Promedio' : 'Average EQ'}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Fortalezas Colectivas vs Áreas de Desarrollo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Fortalezas */}
                <div className="p-5 rounded-xl bg-green-50 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {language === 'es' ? 'Fortalezas Colectivas del Equipo' : 'Team Collective Strengths'}
                  </h4>
                  <div className="space-y-3">
                    {(() => {
                      const strengths: {area: string; contributors: string[]; reason: string}[] = [];
                      
                      // Analizar DISC
                      const discStyles = compareList.filter(p => p.disc);
                      if (discStyles.some(p => p.disc?.primaryStyle === 'D')) {
                        strengths.push({
                          area: '🎯 Orientación a Resultados',
                          contributors: discStyles.filter(p => p.disc?.primaryStyle === 'D').map(p => p.name.split(' ')[0]),
                          reason: 'Capacidad de tomar decisiones rápidas y enfocarse en metas'
                        });
                      }
                      if (discStyles.some(p => p.disc?.primaryStyle === 'I')) {
                        strengths.push({
                          area: '💬 Comunicación y Motivación',
                          contributors: discStyles.filter(p => p.disc?.primaryStyle === 'I').map(p => p.name.split(' ')[0]),
                          reason: 'Habilidad para inspirar y mantener el ánimo del equipo'
                        });
                      }
                      if (discStyles.some(p => p.disc?.primaryStyle === 'S')) {
                        strengths.push({
                          area: '🤝 Estabilidad y Cohesión',
                          contributors: discStyles.filter(p => p.disc?.primaryStyle === 'S').map(p => p.name.split(' ')[0]),
                          reason: 'Genera confianza y mantiene la armonía del grupo'
                        });
                      }
                      if (discStyles.some(p => p.disc?.primaryStyle === 'C')) {
                        strengths.push({
                          area: '📊 Análisis y Calidad',
                          contributors: discStyles.filter(p => p.disc?.primaryStyle === 'C').map(p => p.name.split(' ')[0]),
                          reason: 'Atención al detalle y pensamiento sistemático'
                        });
                      }
                      
                      // Analizar EQ alto
                      const highEQ = compareList.filter(p => p.eq && p.eq.totalScore >= 70);
                      if (highEQ.length > 0) {
                        strengths.push({
                          area: '❤️ Inteligencia Emocional',
                          contributors: highEQ.map(p => p.name.split(' ')[0]),
                          reason: 'Alta capacidad de gestión emocional y empatía'
                        });
                      }
                      
                      // Analizar DNA fuerte
                      const strongDNA = compareList.filter(p => p.dna && p.dna.totalDNAPercentile >= 70);
                      if (strongDNA.length > 0) {
                        strengths.push({
                          area: '🧬 Competencias Desarrolladas',
                          contributors: strongDNA.map(p => p.name.split(' ')[0]),
                          reason: 'Habilidades profesionales bien desarrolladas'
                        });
                      }
                      
                      return strengths.slice(0, 5).map((s, i) => (
                        <div key={i} className="p-3 bg-white rounded-lg border border-green-100">
                          <p className="font-medium text-gray-900">{s.area}</p>
                          <p className="text-xs text-gray-600 mt-1">{s.reason}</p>
                          <div className="flex gap-1 mt-2">
                            {s.contributors.map(c => (
                              <Badge key={c} className="bg-green-100 text-green-700 text-xs">{c}</Badge>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Áreas de Desarrollo */}
                <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {language === 'es' ? 'Áreas de Desarrollo del Equipo' : 'Team Development Areas'}
                  </h4>
                  <div className="space-y-3">
                    {(() => {
                      const gaps: {area: string; issue: string; recommendation: string}[] = [];
                      
                      // Analizar estilos DISC faltantes
                      const styles = compareList.filter(p => p.disc).map(p => p.disc!.primaryStyle);
                      if (!styles.includes('D')) {
                        gaps.push({
                          area: language === 'es' ? '🎯 Liderazgo Decisivo' : '🎯 Decisive Leadership',
                          issue: language === 'es' ? 'Ningún miembro tiene estilo Dominante' : 'No member has Dominant style',
                          recommendation: language === 'es' ? 'Designar roles claros de toma de decisiones' : 'Assign clear decision-making roles'
                        });
                      }
                      if (!styles.includes('I')) {
                        gaps.push({
                          area: language === 'es' ? '💬 Energía Social' : '💬 Social Energy',
                          issue: language === 'es' ? 'Falta estilo Influyente en el equipo' : 'Missing Influential style in team',
                          recommendation: language === 'es' ? 'Fomentar actividades de team building' : 'Encourage team building activities'
                        });
                      }
                      if (!styles.includes('S')) {
                        gaps.push({
                          area: language === 'es' ? '🤝 Estabilidad' : '🤝 Stability',
                          issue: language === 'es' ? 'Ausencia de estilo Estable' : 'Absence of Steady style',
                          recommendation: language === 'es' ? 'Establecer procesos y rutinas consistentes' : 'Establish consistent processes and routines'
                        });
                      }
                      if (!styles.includes('C')) {
                        gaps.push({
                          area: language === 'es' ? '📊 Control de Calidad' : '📊 Quality Control',
                          issue: language === 'es' ? 'Sin estilo Concienzudo en el grupo' : 'No Conscientious style in group',
                          recommendation: language === 'es' ? 'Implementar checklists y revisiones de calidad' : 'Implement checklists and quality reviews'
                        });
                      }
                      
                      // EQ bajo promedio
                      const avgEQ = compareList.filter(p => p.eq).reduce((acc, p) => acc + (p.eq?.totalScore || 0), 0) / Math.max(1, compareList.filter(p => p.eq).length);
                      if (avgEQ < 60 && compareList.some(p => p.eq)) {
                        gaps.push({
                          area: language === 'es' ? '❤️ Gestión Emocional' : '❤️ Emotional Management',
                          issue: language === 'es' ? `EQ promedio del equipo: ${Math.round(avgEQ)}` : `Team average EQ: ${Math.round(avgEQ)}`,
                          recommendation: language === 'es' ? 'Capacitación en inteligencia emocional' : 'Emotional intelligence training'
                        });
                      }
                      
                      return gaps.slice(0, 4).map((g, i) => (
                        <div key={i} className="p-3 bg-white rounded-lg border border-amber-100">
                          <p className="font-medium text-gray-900">{g.area}</p>
                          <p className="text-xs text-red-600 mt-1">{g.issue}</p>
                          <p className="text-xs text-gray-600 mt-1">💡 {g.recommendation}</p>
                        </div>
                      ));
                    })()}
                    {(() => {
                      const styles = compareList.filter(p => p.disc).map(p => p.disc!.primaryStyle);
                      const hasAll = ['D', 'I', 'S', 'C'].every(s => styles.includes(s));
                      if (hasAll) {
                        return (
                          <div className="p-3 bg-green-100 rounded-lg border border-green-200">
                            <p className="font-medium text-green-800">{language === 'es' ? '✅ Equipo Balanceado' : '✅ Balanced Team'}</p>
                            <p className="text-xs text-green-700 mt-1">{language === 'es' ? 'El equipo cuenta con los 4 estilos DISC representados' : 'The team has all 4 DISC styles represented'}</p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>

              {/* Roles Sugeridos */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  {language === 'es' ? 'Roles Sugeridos para el Equipo' : 'Suggested Team Roles'}
                </h4>
                <div className={`grid gap-4 ${compareList.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : compareList.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
                  {compareList.map((person, idx) => {
                    // Determinar rol sugerido basado en perfil
                    let role = 'Colaborador';
                    let roleIcon = '👤';
                    let roleDesc = 'Contribuye al equipo';
                    
                    if (person.disc?.primaryStyle === 'D' && person.acumen && (person.acumen.totalAcumenScore ?? 0) >= 7) {
                      role = 'Líder de Proyecto';
                      roleIcon = '👑';
                      roleDesc = 'Dirección estratégica y toma de decisiones';
                    } else if (person.disc?.primaryStyle === 'D') {
                      role = 'Ejecutor';
                      roleIcon = '⚡';
                      roleDesc = 'Impulsa resultados y cierra pendientes';
                    } else if (person.disc?.primaryStyle === 'I' && person.eq && person.eq.totalScore >= 70) {
                      role = 'Facilitador';
                      roleIcon = '🎤';
                      roleDesc = 'Comunicación y motivación del equipo';
                    } else if (person.disc?.primaryStyle === 'I') {
                      role = 'Promotor';
                      roleIcon = '📢';
                      roleDesc = 'Genera entusiasmo y conexiones';
                    } else if (person.disc?.primaryStyle === 'S' && person.eq && person.eq.empatiaPercentile >= 70) {
                      role = 'Mediador';
                      roleIcon = '🕊️';
                      roleDesc = 'Resolución de conflictos y cohesión';
                    } else if (person.disc?.primaryStyle === 'S') {
                      role = 'Soporte';
                      roleIcon = '🤲';
                      roleDesc = 'Apoyo consistente y confiable';
                    } else if (person.disc?.primaryStyle === 'C' && person.dna && person.dna.totalDNAPercentile >= 70) {
                      role = 'Analista Senior';
                      roleIcon = '🔬';
                      roleDesc = 'Análisis profundo y control de calidad';
                    } else if (person.disc?.primaryStyle === 'C') {
                      role = 'Especialista';
                      roleIcon = '📋';
                      roleDesc = 'Detalle técnico y precisión';
                    }
                    
                    return (
                      <div key={person.id} className={`p-4 rounded-xl ${COMPARE_COLORS[idx].bgLight} border ${COMPARE_COLORS[idx].border}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-full ${COMPARE_COLORS[idx].bg} flex items-center justify-center text-white font-bold`}>
                            {person.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{person.name.split(' ')[0]}</p>
                            {person.disc && (
                              <Badge className="bg-gray-200 text-gray-700 text-xs">{person.disc.primaryStyle}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-2xl mb-1">{roleIcon}</p>
                          <p className="font-semibold text-gray-900">{role}</p>
                          <p className="text-xs text-gray-500 mt-1">{roleDesc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recomendaciones de Comunicación */}
              <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {language === 'es' ? 'Guía de Comunicación para el Equipo' : 'Team Communication Guide'}
                </h4>
                <div className="space-y-3">
                  {compareList.filter(p => p.disc).map((person, idx) => {
                    const tips: Record<string, string> = {
                      'D': language === 'es' ? 'Ser directo, ir al grano, enfocarse en resultados y dar autonomía' : 'Be direct, get to the point, focus on results and give autonomy',
                      'I': language === 'es' ? 'Mostrar entusiasmo, permitir expresión de ideas, reconocer públicamente' : 'Show enthusiasm, allow expression of ideas, recognize publicly',
                      'S': language === 'es' ? 'Dar tiempo para adaptarse, ser paciente, ofrecer apoyo y seguridad' : 'Give time to adapt, be patient, offer support and security',
                      'C': language === 'es' ? 'Proporcionar datos, ser preciso, dar tiempo para análisis' : 'Provide data, be precise, give time for analysis'
                    };
                    return (
                      <div key={person.id} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                        <div className={`w-8 h-8 rounded-full ${COMPARE_COLORS[idx].bg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                          {person.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{person.name}</p>
                          <p className="text-sm text-gray-600">{tips[person.disc?.primaryStyle || 'S']}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Virtudes vs Falencias Comparativas */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                {language === 'es' ? 'Virtudes y Falencias Comparativas' : 'Comparative Strengths and Weaknesses'}
              </CardTitle>
              <CardDescription>{language === 'es' ? 'Análisis detallado para toma de decisiones de RRHH' : 'Detailed analysis for HR decision-making'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">{language === 'es' ? 'Aspecto' : 'Aspect'}</th>
                      {compareList.map((person, idx) => (
                        <th key={person.id} className="text-center p-3">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${COMPARE_COLORS[idx].bgLight}`}>
                            <div className={`w-6 h-6 rounded-full ${COMPARE_COLORS[idx].bg} flex items-center justify-center text-white font-bold text-xs`}>
                              {person.name.charAt(0)}
                            </div>
                            <span className={`text-sm font-medium ${COMPARE_COLORS[idx].text}`}>
                              {person.name.split(' ')[0]}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Liderazgo */}
                    <tr className="border-b border-gray-100">
                      <td className="p-3 text-sm font-medium text-gray-700">🎯 {language === 'es' ? 'Liderazgo' : 'Leadership'}</td>
                      {compareList.map((person) => {
                        const score = (person.disc?.primaryStyle === 'D' ? 3 : person.disc?.primaryStyle === 'I' ? 2 : 1) +
                          (person.acumen && person.acumen.totalAcumenScore >= 7 ? 2 : 0);
                        return (
                          <td key={person.id} className="text-center p-3">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                              score >= 4 ? 'bg-green-100 text-green-700' :
                              score >= 2 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {score >= 4 ? (language === 'es' ? '✓ Fuerte' : '✓ Strong') : score >= 2 ? (language === 'es' ? '○ Medio' : '○ Medium') : (language === 'es' ? '✗ Bajo' : '✗ Low')}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    {/* Trabajo en Equipo */}
                    <tr className="border-b border-gray-100">
                      <td className="p-3 text-sm font-medium text-gray-700">🤝 {language === 'es' ? 'Trabajo en Equipo' : 'Teamwork'}</td>
                      {compareList.map((person) => {
                        const score = (person.disc?.primaryStyle === 'S' ? 3 : person.disc?.primaryStyle === 'I' ? 2 : 1) +
                          (person.eq && person.eq.empatiaPercentile >= 70 ? 2 : person.eq && person.eq.empatiaPercentile >= 50 ? 1 : 0);
                        return (
                          <td key={person.id} className="text-center p-3">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                              score >= 4 ? 'bg-green-100 text-green-700' :
                              score >= 2 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {score >= 4 ? (language === 'es' ? '✓ Fuerte' : '✓ Strong') : score >= 2 ? (language === 'es' ? '○ Medio' : '○ Medium') : (language === 'es' ? '✗ Bajo' : '✗ Low')}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    {/* Análisis */}
                    <tr className="border-b border-gray-100">
                      <td className="p-3 text-sm font-medium text-gray-700">📊 {language === 'es' ? 'Capacidad Analítica' : 'Analytical Capacity'}</td>
                      {compareList.map((person) => {
                        const score = (person.disc?.primaryStyle === 'C' ? 3 : 1) +
                          (person.acumen && person.acumen.practicalThinkingClarity >= 7 ? 2 : 0);
                        return (
                          <td key={person.id} className="text-center p-3">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                              score >= 4 ? 'bg-green-100 text-green-700' :
                              score >= 2 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {score >= 4 ? (language === 'es' ? '✓ Fuerte' : '✓ Strong') : score >= 2 ? (language === 'es' ? '○ Medio' : '○ Medium') : (language === 'es' ? '✗ Bajo' : '✗ Low')}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    {/* Comunicación */}
                    <tr className="border-b border-gray-100">
                      <td className="p-3 text-sm font-medium text-gray-700">💬 {language === 'es' ? 'Comunicación' : 'Communication'}</td>
                      {compareList.map((person) => {
                        const score = (person.disc?.primaryStyle === 'I' ? 3 : person.disc?.primaryStyle === 'S' ? 2 : 1) +
                          (person.eq && person.eq.habilidadesSocialesPercentile >= 70 ? 2 : 0);
                        return (
                          <td key={person.id} className="text-center p-3">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                              score >= 4 ? 'bg-green-100 text-green-700' :
                              score >= 2 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {score >= 4 ? (language === 'es' ? '✓ Fuerte' : '✓ Strong') : score >= 2 ? (language === 'es' ? '○ Medio' : '○ Medium') : (language === 'es' ? '✗ Bajo' : '✗ Low')}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    {/* Integridad */}
                    <tr className="border-b border-gray-100">
                      <td className="p-3 text-sm font-medium text-gray-700">⚖️ {language === 'es' ? 'Integridad' : 'Integrity'}</td>
                      {compareList.map((person) => {
                        const score = person.values ? 
                          (person.values.integrityScore >= 80 ? 5 : person.values.integrityScore >= 60 ? 3 : 1) : 0;
                        return (
                          <td key={person.id} className="text-center p-3">
                            {person.values ? (
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                                score >= 4 ? 'bg-green-100 text-green-700' :
                                score >= 2 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {score >= 4 ? (language === 'es' ? '✓ Fuerte' : '✓ Strong') : score >= 2 ? (language === 'es' ? '○ Medio' : '○ Medium') : (language === 'es' ? '✗ Bajo' : '✗ Low')}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">N/E</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Gestión del Estrés */}
                    <tr className="border-b border-gray-100">
                      <td className="p-3 text-sm font-medium text-gray-700">🧘 {language === 'es' ? 'Gestión del Estrés' : 'Stress Management'}</td>
                      {compareList.map((person) => {
                        const score = (person.eq && person.eq.autorregulacionPercentile >= 70 ? 3 : person.eq && person.eq.autorregulacionPercentile >= 50 ? 2 : 1) +
                          (person.disc?.primaryStyle === 'S' ? 1 : 0);
                        return (
                          <td key={person.id} className="text-center p-3">
                            {person.eq ? (
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                                score >= 3 ? 'bg-green-100 text-green-700' :
                                score >= 2 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {score >= 3 ? (language === 'es' ? '✓ Fuerte' : '✓ Strong') : score >= 2 ? (language === 'es' ? '○ Medio' : '○ Medium') : (language === 'es' ? '✗ Bajo' : '✗ Low')}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">N/E</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex gap-4 justify-center text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-green-100" />
                  <span className="text-gray-600">{language === 'es' ? 'Fortaleza' : 'Strength'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-yellow-100" />
                  <span className="text-gray-600">{language === 'es' ? 'Desarrollo' : 'Development'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-red-100" />
                  <span className="text-gray-600">{language === 'es' ? 'Área Crítica' : 'Critical Area'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">N/E</span>
                  <span className="text-gray-600">{language === 'es' ? 'No Evaluado' : 'Not Evaluated'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: COMPATIBILIDAD */}
      {compareTab === 'compatibilidad' && (
        <div className="space-y-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Matriz de Compatibilidad
              </CardTitle>
              <CardDescription>Evaluación de sinergia y complementariedad entre perfiles</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Matriz de compatibilidad */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Matriz de Compatibilidad</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-3"></th>
                        {compareList.map((person, idx) => (
                          <th key={person.id} className="p-3 text-center">
                            <div className={`w-10 h-10 rounded-full ${COMPARE_COLORS[idx].bg} flex items-center justify-center text-white font-bold mx-auto mb-1`}>
                              {person.name.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-600">{person.name.split(' ')[0]}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {compareList.map((person1, idx1) => (
                        <tr key={person1.id}>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full ${COMPARE_COLORS[idx1].bg} flex items-center justify-center text-white font-bold text-sm`}>
                                {person1.name.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{person1.name.split(' ')[0]}</span>
                            </div>
                          </td>
                          {compareList.map((person2, idx2) => {
                            const compat = idx1 === idx2 ? 100 : calculateCompatibility(person1, person2);
                            return (
                              <td key={person2.id} className="p-3 text-center">
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl font-bold text-lg ${
                                  idx1 === idx2 
                                    ? 'bg-gray-100 text-gray-400' 
                                    : compat >= 80 
                                      ? 'bg-green-100 text-green-700' 
                                      : compat >= 60 
                                        ? 'bg-yellow-100 text-yellow-700' 
                                        : 'bg-orange-100 text-orange-700'
                                }`}>
                                  {idx1 === idx2 ? '-' : `${compat}%`}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-4 justify-center mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-green-100" />
                    <span className="text-gray-600">Alta (80%+)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-yellow-100" />
                    <span className="text-gray-600">Media (60-79%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-orange-100" />
                    <span className="text-gray-600">Baja (&lt;60%)</span>
                  </div>
                </div>
              </div>

              {/* Parejas más compatibles */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Análisis de Parejas</h4>
                <div className="space-y-4">
                  {compareList.slice(0, -1).flatMap((p1, i) => 
                    compareList.slice(i + 1).map(p2 => {
                      const compat = calculateCompatibility(p1, p2);
                      const idxP1 = compareList.findIndex(p => p.id === p1.id);
                      const idxP2 = compareList.findIndex(p => p.id === p2.id);
                      
                      // Determinar tipo de relación
                      let relationshipType = '';
                      let relationshipDesc = '';
                      
                      if (p1.disc && p2.disc) {
                        const sameStyle = p1.disc.primaryStyle === p2.disc.primaryStyle;
                        const oppositeStyles = 
                          (p1.disc.primaryStyle === 'D' && p2.disc.primaryStyle === 'S') ||
                          (p1.disc.primaryStyle === 'S' && p2.disc.primaryStyle === 'D') ||
                          (p1.disc.primaryStyle === 'I' && p2.disc.primaryStyle === 'C') ||
                          (p1.disc.primaryStyle === 'C' && p2.disc.primaryStyle === 'I');
                        
                        if (sameStyle) {
                          relationshipType = 'Espejo';
                          relationshipDesc = 'Comparten el mismo estilo conductual - fácil comunicación pero riesgo de puntos ciegos compartidos';
                        } else if (oppositeStyles) {
                          relationshipType = 'Complementario';
                          relationshipDesc = 'Estilos opuestos que se complementan - requiere adaptación pero aporta perspectivas diversas';
                        } else {
                          relationshipType = 'Adyacente';
                          relationshipDesc = 'Estilos cercanos con diferencias moderadas - balance entre similitud y diversidad';
                        }
                      }
                      
                      return (
                        <div key={`${p1.id}-${p2.id}`} className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-full ${COMPARE_COLORS[idxP1].bg} flex items-center justify-center text-white font-bold`}>
                                  {p1.name.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-900">{p1.name.split(' ')[0]}</span>
                              </div>
                              <ArrowRight className="w-5 h-5 text-gray-400" />
                              <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-full ${COMPARE_COLORS[idxP2].bg} flex items-center justify-center text-white font-bold`}>
                                  {p2.name.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-900">{p2.name.split(' ')[0]}</span>
                              </div>
                            </div>
                            <div className={`px-4 py-2 rounded-lg font-bold ${
                              compat >= 80 ? 'bg-green-100 text-green-700' : 
                              compat >= 60 ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {compat}% Compatibilidad
                            </div>
                          </div>
                          {relationshipType && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">{relationshipType}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">{relationshipDesc}</p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsClient({ people }: AnalyticsClientProps) {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);
  const [compareList, setCompareList] = useState<PersonData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [recentSelections, setRecentSelections] = useState<PersonData[]>([]);
  const [overviewPage, setOverviewPage] = useState(1);

  // Auto-select mode from URL parameter
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    const personEmail = searchParams.get('person');
    
    // Handle mode parameter (individual/compare)
    if (modeParam === 'individual') {
      setViewMode('individual');
      router.replace('/analytics', { scroll: false });
    } else if (modeParam === 'compare') {
      setViewMode('compare');
      router.replace('/analytics', { scroll: false });
    }
    
    // Handle person parameter (auto-select person)
    if (personEmail && people.length > 0) {
      const person = people.find(p => p.email.toLowerCase() === personEmail.toLowerCase());
      if (person) {
        setSelectedPerson(person);
        setViewMode('individual');
        // Add to recent selections
        setRecentSelections(prev => {
          const filtered = prev.filter(p => p.id !== person.id);
          return [person, ...filtered].slice(0, 5);
        });
        // Clean URL without reloading
        router.replace('/analytics', { scroll: false });
      }
    }
  }, [searchParams, people, router]);

  // Estadísticas generales
  const stats = useMemo(() => {
    const totalPeople = people.length;
    const withDisc = people.filter(p => p.disc !== null).length;
    const withDF = people.filter(p => p.drivingForces !== null).length;
    const withEQ = people.filter(p => p.eq !== null).length;
    const withDNA = people.filter(p => p.dna !== null).length;
    const withAcumen = people.filter(p => p.acumen !== null).length;
    const withValues = people.filter(p => p.values !== null).length;
    const withBoth = people.filter(p => p.hasComplete).length;
    const withFullProfile = people.filter(p => p.hasFullProfile).length;
    const withRecluComplete = people.filter(p => p.hasRecluComplete).length;
    
    // Distribución DISC
    const discDistribution = { D: 0, I: 0, S: 0, C: 0 };
    people.forEach(p => {
      if (p.disc?.primaryStyle) {
        discDistribution[p.disc.primaryStyle as keyof typeof discDistribution]++;
      }
    });

    // Top motivadores
    const motivatorCounts: Record<string, number> = {};
    people.forEach(p => {
      if (p.drivingForces?.topMotivator) {
        motivatorCounts[p.drivingForces.topMotivator] = (motivatorCounts[p.drivingForces.topMotivator] || 0) + 1;
      }
    });

    // Distribución EQ por nivel
    const eqDistribution: Record<string, number> = {};
    people.forEach(p => {
      if (p.eq?.eqLevel) {
        eqDistribution[p.eq.eqLevel] = (eqDistribution[p.eq.eqLevel] || 0) + 1;
      }
    });

    // Promedio EQ del equipo
    const eqScores = people.filter(p => p.eq?.totalScore).map(p => p.eq!.totalScore);
    const avgEQScore = eqScores.length > 0 ? Math.round(eqScores.reduce((a, b) => a + b, 0) / eqScores.length) : 0;

    // Distribución DNA por nivel
    const dnaDistribution: Record<string, number> = {};
    people.forEach(p => {
      if (p.dna?.dnaLevel) {
        dnaDistribution[p.dna.dnaLevel] = (dnaDistribution[p.dna.dnaLevel] || 0) + 1;
      }
    });

    // Promedio DNA del equipo
    const dnaScores = people.filter(p => p.dna?.totalDNAPercentile).map(p => p.dna!.totalDNAPercentile);
    const avgDNAScore = dnaScores.length > 0 ? Math.round(dnaScores.reduce((a, b) => a + b, 0) / dnaScores.length) : 0;

    // Promedios de categorías DNA del equipo
    const dnaPeopleWithCategories = people.filter(p => p.dna?.thinkingCategoryScore !== undefined);
    const dnaCategories = {
      thinking: dnaPeopleWithCategories.length > 0 
        ? Math.round(dnaPeopleWithCategories.reduce((a, b) => a + (b.dna?.thinkingCategoryScore || 0), 0) / dnaPeopleWithCategories.length) 
        : 0,
      communication: dnaPeopleWithCategories.length > 0 
        ? Math.round(dnaPeopleWithCategories.reduce((a, b) => a + (b.dna?.communicationCategoryScore || 0), 0) / dnaPeopleWithCategories.length) 
        : 0,
      leadership: dnaPeopleWithCategories.length > 0 
        ? Math.round(dnaPeopleWithCategories.reduce((a, b) => a + (b.dna?.leadershipCategoryScore || 0), 0) / dnaPeopleWithCategories.length) 
        : 0,
      results: dnaPeopleWithCategories.length > 0 
        ? Math.round(dnaPeopleWithCategories.reduce((a, b) => a + (b.dna?.resultsCategoryScore || 0), 0) / dnaPeopleWithCategories.length) 
        : 0,
      relationship: dnaPeopleWithCategories.length > 0 
        ? Math.round(dnaPeopleWithCategories.reduce((a, b) => a + (b.dna?.relationshipCategoryScore || 0), 0) / dnaPeopleWithCategories.length) 
        : 0,
    };

    // Distribución Acumen por nivel
    const acumenDistribution: Record<string, number> = {};
    people.forEach(p => {
      if (p.acumen?.acumenLevel) {
        acumenDistribution[p.acumen.acumenLevel] = (acumenDistribution[p.acumen.acumenLevel] || 0) + 1;
      }
    });

    // Promedio Acumen del equipo
    const acumenScores = people.filter(p => p.acumen?.totalAcumenScore).map(p => p.acumen!.totalAcumenScore);
    const avgAcumenScore = acumenScores.length > 0 ? Math.round((acumenScores.reduce((a, b) => a + b, 0) / acumenScores.length) * 10) / 10 : 0;

    // Promedios de dimensiones Acumen
    const acumenPeopleWithDimensions = people.filter(p => p.acumen?.externalClarityScore !== undefined);
    const acumenDimensions = {
      external: acumenPeopleWithDimensions.length > 0 
        ? Math.round((acumenPeopleWithDimensions.reduce((a, b) => a + (b.acumen?.externalClarityScore || 0), 0) / acumenPeopleWithDimensions.length) * 10) / 10 
        : 0,
      internal: acumenPeopleWithDimensions.length > 0 
        ? Math.round((acumenPeopleWithDimensions.reduce((a, b) => a + (b.acumen?.internalClarityScore || 0), 0) / acumenPeopleWithDimensions.length) * 10) / 10 
        : 0,
    };

    // Promedio de integridad del equipo (Values)
    const valuesScores = people.filter(p => p.values?.integrityScore).map(p => p.values!.integrityScore);
    const avgValuesScore = valuesScores.length > 0 ? Math.round(valuesScores.reduce((a, b) => a + b, 0) / valuesScores.length) : 0;

    // Promedios de dimensiones Values del equipo
    const valuesPeopleWithDimensions = people.filter(p => p.values?.teoricoPercentile !== undefined);
    const valuesDimensions = {
      teorico: valuesPeopleWithDimensions.length > 0 
        ? Math.round(valuesPeopleWithDimensions.reduce((a, b) => a + (b.values?.teoricoPercentile || 0), 0) / valuesPeopleWithDimensions.length) 
        : 0,
      utilitario: valuesPeopleWithDimensions.length > 0 
        ? Math.round(valuesPeopleWithDimensions.reduce((a, b) => a + (b.values?.utilitarioPercentile || 0), 0) / valuesPeopleWithDimensions.length) 
        : 0,
      estetico: valuesPeopleWithDimensions.length > 0 
        ? Math.round(valuesPeopleWithDimensions.reduce((a, b) => a + (b.values?.esteticoPercentile || 0), 0) / valuesPeopleWithDimensions.length) 
        : 0,
      social: valuesPeopleWithDimensions.length > 0 
        ? Math.round(valuesPeopleWithDimensions.reduce((a, b) => a + (b.values?.socialPercentile || 0), 0) / valuesPeopleWithDimensions.length) 
        : 0,
      individualista: valuesPeopleWithDimensions.length > 0 
        ? Math.round(valuesPeopleWithDimensions.reduce((a, b) => a + (b.values?.individualistaPercentile || 0), 0) / valuesPeopleWithDimensions.length) 
        : 0,
      tradicional: valuesPeopleWithDimensions.length > 0 
        ? Math.round(valuesPeopleWithDimensions.reduce((a, b) => a + (b.values?.tradicionalPercentile || 0), 0) / valuesPeopleWithDimensions.length) 
        : 0,
    };

    // Estadísticas de Estrés
    const withStress = people.filter(p => p.stress !== null).length;
    
    // Distribución Stress por nivel de resiliencia
    const stressDistribution: Record<string, number> = {};
    people.forEach(p => {
      if (p.stress?.resilienceLevel) {
        stressDistribution[p.stress.resilienceLevel] = (stressDistribution[p.stress.resilienceLevel] || 0) + 1;
      }
    });

    // Promedio Resiliencia del equipo
    const resilienceScores = people.filter(p => p.stress?.indiceResiliencia).map(p => p.stress!.indiceResiliencia);
    const avgResilienceScore = resilienceScores.length > 0 ? Math.round(resilienceScores.reduce((a, b) => a + b, 0) / resilienceScores.length) : 0;

    // Promedio Estrés del equipo
    const stressScores = people.filter(p => p.stress?.nivelEstresGeneral).map(p => p.stress!.nivelEstresGeneral);
    const avgStressScore = stressScores.length > 0 ? Math.round(stressScores.reduce((a, b) => a + b, 0) / stressScores.length) : 0;

    // Promedios de dimensiones Stress del equipo
    const stressPeopleWithDimensions = people.filter(p => p.stress?.estresLaboralScore !== undefined);
    const stressDimensions = {
      estresLaboral: stressPeopleWithDimensions.length > 0 
        ? Math.round(stressPeopleWithDimensions.reduce((a, b) => a + (b.stress?.estresLaboralScore || 0), 0) / stressPeopleWithDimensions.length) 
        : 0,
      capacidadRecuperacion: stressPeopleWithDimensions.length > 0 
        ? Math.round(stressPeopleWithDimensions.reduce((a, b) => a + (b.stress?.capacidadRecuperacionScore || 0), 0) / stressPeopleWithDimensions.length) 
        : 0,
      manejoEmocional: stressPeopleWithDimensions.length > 0 
        ? Math.round(stressPeopleWithDimensions.reduce((a, b) => a + (b.stress?.manejoEmocionalScore || 0), 0) / stressPeopleWithDimensions.length) 
        : 0,
      equilibrioVida: stressPeopleWithDimensions.length > 0 
        ? Math.round(stressPeopleWithDimensions.reduce((a, b) => a + (b.stress?.equilibrioVidaScore || 0), 0) / stressPeopleWithDimensions.length) 
        : 0,
      resiliencia: stressPeopleWithDimensions.length > 0 
        ? Math.round(stressPeopleWithDimensions.reduce((a, b) => a + (b.stress?.resilienciaScore || 0), 0) / stressPeopleWithDimensions.length) 
        : 0,
    };

    return {
      totalPeople,
      withDisc,
      withDF,
      withEQ,
      withDNA,
      withAcumen,
      withValues,
      withStress,
      withBoth,
      withFullProfile,
      withRecluComplete,
      discDistribution,
      motivatorCounts,
      eqDistribution,
      avgEQScore,
      dnaDistribution,
      avgDNAScore,
      dnaCategories,
      acumenDistribution,
      avgAcumenScore,
      acumenDimensions,
      avgValuesScore,
      valuesDimensions,
      stressDistribution,
      avgResilienceScore,
      avgStressScore,
      stressDimensions,
    };
  }, [people]);

  // Filtrar personas por búsqueda
  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return people;
    const query = searchQuery.toLowerCase();
    return people.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.email.toLowerCase().includes(query)
    );
  }, [people, searchQuery]);

  // Añadir a recientes
  const addToRecent = useCallback((person: PersonData) => {
    setRecentSelections(prev => {
      const filtered = prev.filter(p => p.id !== person.id);
      return [person, ...filtered].slice(0, 10);
    });
  }, []);

  // Seleccionar persona para análisis individual
  const handleSelectPerson = useCallback((person: PersonData) => {
    setSelectedPerson(person);
    addToRecent(person);
    setViewMode('individual');
  }, [addToRecent]);

  // Toggle comparación
  const toggleCompare = useCallback((person: PersonData) => {
    if (compareList.find(p => p.id === person.id)) {
      setCompareList(prev => prev.filter(p => p.id !== person.id));
    } else if (compareList.length < 4) {
      setCompareList(prev => [...prev, person]);
      addToRecent(person);
    }
  }, [compareList, addToRecent]);

  // Paginación para Overview
  const overviewPeoplePerPage = 24;
  const overviewFilteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return people;
    const q = searchQuery.toLowerCase();
    return people.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.email.toLowerCase().includes(q)
    );
  }, [people, searchQuery]);
  
  const overviewTotalPages = Math.ceil(overviewFilteredPeople.length / overviewPeoplePerPage);
  const overviewVisiblePeople = overviewFilteredPeople.slice(
    (overviewPage - 1) * overviewPeoplePerPage, 
    overviewPage * overviewPeoplePerPage
  );

  // Reset page when search changes
  useEffect(() => {
    setOverviewPage(1);
  }, [searchQuery]);

  // Obtener color del estilo DISC
  const getDiscColor = (style: string) => {
    switch (style) {
      case 'D': return 'bg-red-500';
      case 'I': return 'bg-yellow-500';
      case 'S': return 'bg-green-500';
      case 'C': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getDiscColorText = (style: string) => {
    switch (style) {
      case 'D': return 'text-red-600';
      case 'I': return 'text-yellow-600';
      case 'S': return 'text-green-600';
      case 'C': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  // Renderizar vista vacía
  if (people.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('analytics.title')}</h1>
          <p className="text-lg text-gray-600">{t('analytics.subtitle')}</p>
        </div>

        <Card className="bg-white border-0 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-indigo-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('analytics.noEvaluations')}
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('analytics.noEvaluations.desc')}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
              <Link href="/external-evaluations">
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs">
                  <Brain className="w-4 h-4 mr-1" />
                  DISC
                </Button>
              </Link>
              <Link href="/external-driving-forces-evaluations">
                <Button size="sm" variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 text-xs">
                  <Target className="w-4 h-4 mr-1" />
                  {t('analytics.module.df')}
                </Button>
              </Link>
              <Link href="/external-eq-evaluations">
                <Button size="sm" variant="outline" className="w-full border-rose-300 text-rose-700 hover:bg-rose-50 text-xs">
                  <Heart className="w-4 h-4 mr-1" />
                  EQ
                </Button>
              </Link>
              <Link href="/external-dna-evaluations">
                <Button size="sm" variant="outline" className="w-full border-teal-300 text-teal-700 hover:bg-teal-50 text-xs">
                  <Dna className="w-4 h-4 mr-1" />
                  DNA-25
                </Button>
              </Link>
              <Link href="/external-acumen-evaluations">
                <Button size="sm" variant="outline" className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 text-xs">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Acumen
                </Button>
              </Link>
              <Link href="/external-values-evaluations">
                <Button size="sm" variant="outline" className="w-full border-violet-300 text-violet-700 hover:bg-violet-50 text-xs">
                  <Shield className="w-4 h-4 mr-1" />
                  {t('analytics.module.values')}
                </Button>
              </Link>
              <Link href="/external-stress-evaluations">
                <Button size="sm" variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 text-xs col-span-2 sm:col-span-1">
                  <Activity className="w-4 h-4 mr-1" />
                  {t('analytics.module.stress')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Section - Diseño Profesional Sobrio */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-8 mb-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-slate-700/30 to-slate-600/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-slate-600/20 to-slate-500/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  {t('analytics.title')}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {language === 'es' ? 'Inteligencia de Talento Reclu 360°' : 'Reclu 360° Talent Intelligence'}
                </p>
              </div>
            </div>
            <p className="text-slate-300 text-sm lg:text-base max-w-xl leading-relaxed">
              {t('analytics.subtitle')}
            </p>
            
            {/* Quick Stats en Hero */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <Users className="w-4 h-4 text-slate-300" />
                <span className="text-white font-semibold">{stats.totalPeople}</span>
                <span className="text-slate-400 text-sm">{language === 'es' ? 'candidatos' : 'candidates'}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <Sparkles className="w-4 h-4 text-slate-300" />
                <span className="text-white font-semibold">{stats.withRecluComplete}</span>
                <span className="text-slate-400 text-sm">{language === 'es' ? 'perfil 360°' : '360° profile'}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <Layers className="w-4 h-4 text-slate-300" />
                <span className="text-white font-semibold">8</span>
                <span className="text-slate-400 text-sm">{language === 'es' ? 'módulos' : 'modules'}</span>
              </div>
            </div>
          </div>
          
          {/* Controles de vista rediseñados */}
          <div className="flex flex-col gap-3">
            <p className="text-slate-500 text-xs uppercase tracking-wider font-medium">{language === 'es' ? 'Modo de Vista' : 'View Mode'}</p>
            <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setViewMode('overview'); setSelectedPerson(null); }}
                className={viewMode === 'overview' 
                  ? 'bg-white text-slate-900 border-white hover:bg-slate-100 shadow-lg' 
                  : 'bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/30'}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                {t('analytics.view.overview')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('individual')}
                className={viewMode === 'individual' 
                  ? 'bg-white text-slate-900 border-white hover:bg-slate-100 shadow-lg' 
                  : 'bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/30'}
              >
                <UserCircle className="w-4 h-4 mr-2" />
                {t('analytics.view.individual')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('compare')}
                disabled={people.length < 2}
                className={viewMode === 'compare' 
                  ? 'bg-white text-slate-900 border-white hover:bg-slate-100 shadow-lg' 
                  : 'bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/30 disabled:opacity-30'}
              >
                <GitCompare className="w-4 h-4 mr-2" />
                {t('analytics.view.compare')}
                {compareList.length > 0 && (
                  <Badge className="ml-2 bg-slate-600 text-white text-xs">{compareList.length}</Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards - Diseño Sobrio */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">{stats.totalPeople}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{t('analytics.stats.people')}</p>
              </div>
              <div className="p-3 bg-slate-100 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <TrendingUp className="w-3 h-3" />
              <span>{language === 'es' ? 'Total evaluados' : 'Total evaluated'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-600">{stats.withFullProfile}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{language === 'es' ? 'Perfil Completo' : 'Full Profile'}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <Award className="w-3 h-3" />
              <span>8 {language === 'es' ? 'módulos' : 'modules'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-600">{stats.withRecluComplete}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">Reclu 360°</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <Star className="w-3 h-3" />
              <span>{language === 'es' ? 'Análisis integrado' : 'Integrated analysis'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-rose-600">{stats.avgEQScore > 0 ? stats.avgEQScore : '-'}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{t('analytics.stats.avgEQ')}</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <TrendingUp className="w-3 h-3" />
              <span>{language === 'es' ? 'Inteligencia Emocional' : 'Emotional Intelligence'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-sky-600">{people.filter(p => p.technical).length}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{language === 'es' ? 'Test Técnico' : 'Technical Test'}</p>
              </div>
              <div className="p-3 bg-sky-50 rounded-xl group-hover:scale-110 transition-transform">
                <FileCode className="w-5 h-5 text-sky-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <Code className="w-3 h-3" />
              <span>{language === 'es' ? 'Competencias técnicas' : 'Technical skills'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vista General */}
      {viewMode === 'overview' && (
        <div className="space-y-6">
          {/* Métricas principales - Layout mejorado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card: Evaluaciones por tipo - 8 módulos Reclu */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.completedEvaluations')}</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2 p-2.5 bg-indigo-50 rounded-xl">
                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                      <Brain className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{stats.withDisc}</p>
                      <p className="text-xs text-gray-500">DISC</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-purple-50 rounded-xl">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <Target className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{stats.withDF}</p>
                      <p className="text-xs text-gray-500">FM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-rose-50 rounded-xl">
                    <div className="p-1.5 bg-rose-100 rounded-lg">
                      <Heart className="w-4 h-4 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{stats.withEQ}</p>
                      <p className="text-xs text-gray-500">EQ</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-teal-50 rounded-xl">
                    <div className="p-1.5 bg-teal-100 rounded-lg">
                      <Dna className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{stats.withDNA}</p>
                      <p className="text-xs text-gray-500">DNA-25</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-xl">
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <Compass className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{stats.withAcumen}</p>
                      <p className="text-xs text-gray-500">Acumen</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-violet-50 rounded-xl">
                    <div className="p-1.5 bg-violet-100 rounded-lg">
                      <Scale className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{stats.withValues}</p>
                      <p className="text-xs text-gray-500">{language === 'es' ? 'Valores' : 'Values'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-orange-50 rounded-xl">
                    <div className="p-1.5 bg-orange-100 rounded-lg">
                      <Activity className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{stats.withStress}</p>
                      <p className="text-xs text-gray-500">{language === 'es' ? 'Estrés' : 'Stress'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-sky-50 rounded-xl">
                    <div className="p-1.5 bg-sky-100 rounded-lg">
                      <FileCode className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{people.filter(p => p.technical).length}</p>
                      <p className="text-xs text-gray-500">{language === 'es' ? 'Técnica' : 'Technical'}</p>
                    </div>
                  </div>
                </div>
                {/* Resumen módulos */}
                <div className="mt-3 flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl border border-indigo-200">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">8 {language === 'es' ? 'Módulos Reclu' : 'Reclu Modules'}</p>
                    <p className="text-xs text-gray-500">{language === 'es' ? 'Sistema completo de evaluación 360°' : 'Complete 360° evaluation system'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card: Promedios del equipo */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.team.averages')}</h3>
                <div className="space-y-3">
                  {stats.withEQ > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-600" />
                        <span className="font-medium text-gray-700 text-sm">EQ</span>
                      </div>
                      <span className="text-2xl font-bold text-rose-600">{stats.avgEQScore}</span>
                    </div>
                  )}
                  {stats.withDNA > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Dna className="w-5 h-5 text-teal-600" />
                        <span className="font-medium text-gray-700 text-sm">DNA</span>
                      </div>
                      <span className="text-2xl font-bold text-teal-600">{stats.avgDNAScore}</span>
                    </div>
                  )}
                  {stats.withAcumen > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Compass className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-gray-700 text-sm">Acumen</span>
                      </div>
                      <span className="text-2xl font-bold text-amber-600">{stats.avgAcumenScore}</span>
                    </div>
                  )}
                  {stats.withValues > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-violet-600" />
                        <span className="font-medium text-gray-700 text-sm">{t('analytics.team.integrity')}</span>
                      </div>
                      <span className="text-2xl font-bold text-violet-600">{stats.avgValuesScore}</span>
                    </div>
                  )}
                  {stats.withStress > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-orange-600" />
                        <span className="font-medium text-gray-700 text-sm">{t('analytics.team.resilience')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-600">{stats.avgResilienceScore}%</span>
                        <p className="text-xs text-gray-500">{t('analytics.team.stress')}: {stats.avgStressScore}%</p>
                      </div>
                    </div>
                  )}
                  {people.filter(p => p.technical).length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-sky-600" />
                        <span className="font-medium text-gray-700 text-sm">{language === 'es' ? 'Técnica' : 'Technical'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-sky-600">
                          {Math.round(people.filter(p => p.technical).reduce((sum, p) => sum + (p.technical?.totalScore || 0), 0) / people.filter(p => p.technical).length)}%
                        </span>
                        <p className="text-xs text-gray-500">{people.filter(p => p.technical).length} {language === 'es' ? 'evaluados' : 'evaluated'}</p>
                      </div>
                    </div>
                  )}
                  {stats.withEQ === 0 && stats.withDNA === 0 && stats.withAcumen === 0 && stats.withValues === 0 && stats.withStress === 0 && people.filter(p => p.technical).length === 0 && (
                    <div className="text-center py-6 text-gray-400">
                      <p>{language === 'es' ? 'Sin datos de evaluaciones aún' : 'No evaluation data yet'}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribución DISC, Motivadores, EQ, DNA, Acumen y Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Distribución DISC */}
            {stats.withDisc > 0 && (
              <Card className="bg-white border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="w-5 h-5 text-indigo-600" />
                    {t('analytics.team.discDistribution')}
                  </CardTitle>
                  <CardDescription>{t('analytics.team.primaryStyles')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(['D', 'I', 'S', 'C'] as const).map(style => {
                      const count = stats.discDistribution[style];
                      const percentage = stats.withDisc > 0 ? (count / stats.withDisc) * 100 : 0;
                      const colors = {
                        D: 'bg-red-500',
                        I: 'bg-yellow-500',
                        S: 'bg-green-500',
                        C: 'bg-blue-500'
                      };
                      
                      return (
                        <div key={style}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {t(`disc.${style.toLowerCase()}`)}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {count} ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`${colors[style]} h-3 rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Motivadores */}
            {stats.withDF > 0 && Object.keys(stats.motivatorCounts).length > 0 && (
              <Card className="bg-white border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-purple-600" />
                    {t('analytics.team.motivators')}
                  </CardTitle>
                  <CardDescription>{t('analytics.team.commonMotivators')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.motivatorCounts)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([motivator, count]) => {
                        const percentage = (count / stats.withDF) * 100;
                        return (
                          <div key={motivator}>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700 capitalize">
                                {motivator.toLowerCase()}
                              </span>
                              <span className="text-sm font-bold text-gray-900">
                                {count} ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Distribución EQ */}
            {stats.withEQ > 0 && Object.keys(stats.eqDistribution).length > 0 && (
              <Card className="bg-white border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="w-5 h-5 text-rose-600" />
                    {t('analytics.team.eqLevels')}
                  </CardTitle>
                  <CardDescription>{t('analytics.team.eqDistribution')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const levelOrder = ['MUY_ALTO', 'ALTO', 'MODERADO', 'BAJO', 'MUY_BAJO'];
                      const levelLabels: Record<string, string> = {
                        MUY_ALTO: 'Muy Alto',
                        ALTO: 'Alto',
                        MODERADO: 'Moderado',
                        BAJO: 'Bajo',
                        MUY_BAJO: 'Muy Bajo'
                      };
                      const levelColors: Record<string, string> = {
                        MUY_ALTO: 'bg-green-500',
                        ALTO: 'bg-emerald-500',
                        MODERADO: 'bg-yellow-500',
                        BAJO: 'bg-orange-500',
                        MUY_BAJO: 'bg-red-500'
                      };
                      
                      return levelOrder
                        .filter(level => stats.eqDistribution[level])
                        .map(level => {
                          const count = stats.eqDistribution[level];
                          const percentage = (count / stats.withEQ) * 100;
                          
                          return (
                            <div key={level}>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                  {levelLabels[level]}
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                  {count} ({percentage.toFixed(0)}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className={`${levelColors[level]} h-3 rounded-full transition-all duration-500`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        });
                    })()}
                  </div>
                  
                  {/* Promedio EQ */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t('analytics.team.average')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-rose-600">{stats.avgEQScore}</span>
                        <span className="text-sm text-gray-500">/ 100</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Distribución DNA - Siempre visible */}
            <Card className="bg-white border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Dna className="w-5 h-5 text-teal-600" />
                  {t('analytics.team.dnaLevels')}
                </CardTitle>
                <CardDescription>{t('analytics.team.competenciesDistribution')}</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.withDNA > 0 && Object.keys(stats.dnaDistribution).length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {(() => {
                        const levelOrder = ['MUY_ALTO', 'ALTO', 'MODERADO', 'BAJO', 'MUY_BAJO'];
                        const levelLabels: Record<string, string> = language === 'es' ? {
                          MUY_ALTO: 'Muy Alto',
                          ALTO: 'Alto',
                          MODERADO: 'Moderado',
                          BAJO: 'Bajo',
                          MUY_BAJO: 'Muy Bajo'
                        } : {
                          MUY_ALTO: 'Very High',
                          ALTO: 'High',
                          MODERADO: 'Moderate',
                          BAJO: 'Low',
                          MUY_BAJO: 'Very Low'
                        };
                        const levelColors: Record<string, string> = {
                          MUY_ALTO: 'bg-teal-600',
                          ALTO: 'bg-teal-500',
                          MODERADO: 'bg-cyan-500',
                          BAJO: 'bg-orange-500',
                          MUY_BAJO: 'bg-red-500'
                        };
                        
                        return levelOrder
                          .filter(level => stats.dnaDistribution[level])
                          .map(level => {
                            const count = stats.dnaDistribution[level];
                            const percentage = (count / stats.withDNA) * 100;
                            
                            return (
                              <div key={level}>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    {levelLabels[level]}
                                  </span>
                                  <span className="text-sm font-bold text-gray-900">
                                    {count} ({percentage.toFixed(0)}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div
                                    className={`${levelColors[level]} h-3 rounded-full transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          });
                      })()}
                    </div>
                    
                    {/* Promedio DNA */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t('analytics.team.average')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-teal-600">{stats.avgDNAScore}</span>
                          <span className="text-sm text-gray-500">/ 100</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Dna className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">{language === 'es' ? 'Sin evaluaciones DNA-25' : 'No DNA-25 evaluations'}</p>
                    <p className="text-xs text-gray-400">{language === 'es' ? 'Envía evaluaciones para ver la distribución' : 'Send evaluations to see the distribution'}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Distribución Acumen */}
            <Card className="bg-white border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Compass className="w-5 h-5 text-amber-600" />
                  {t('analytics.team.acumenLevels')}
                </CardTitle>
                <CardDescription>{t('analytics.team.judgmentDistribution')}</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.withAcumen > 0 && Object.keys(stats.acumenDistribution).length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {(() => {
                        const levelOrder = ['MUY_ALTO', 'ALTO', 'MODERADO', 'BAJO', 'MUY_BAJO'];
                        const levelLabels: Record<string, string> = language === 'es' ? {
                          MUY_ALTO: 'Muy Alto',
                          ALTO: 'Alto',
                          MODERADO: 'Moderado',
                          BAJO: 'Bajo',
                          MUY_BAJO: 'Muy Bajo'
                        } : {
                          MUY_ALTO: 'Very High',
                          ALTO: 'High',
                          MODERADO: 'Moderate',
                          BAJO: 'Low',
                          MUY_BAJO: 'Very Low'
                        };
                        const levelColors: Record<string, string> = {
                          MUY_ALTO: 'bg-green-500',
                          ALTO: 'bg-emerald-500',
                          MODERADO: 'bg-amber-500',
                          BAJO: 'bg-orange-500',
                          MUY_BAJO: 'bg-red-500'
                        };
                        
                        return levelOrder
                          .filter(level => stats.acumenDistribution[level])
                          .map(level => {
                            const count = stats.acumenDistribution[level];
                            const percentage = (count / stats.withAcumen) * 100;
                            
                            return (
                              <div key={level}>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    {levelLabels[level]}
                                  </span>
                                  <span className="text-sm font-bold text-gray-900">
                                    {count} ({percentage.toFixed(0)}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div
                                    className={`${levelColors[level]} h-3 rounded-full transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          });
                      })()}
                    </div>
                    
                    {/* Promedio Acumen */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t('analytics.team.average')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-amber-600">{stats.avgAcumenScore}</span>
                          <span className="text-sm text-gray-500">/ 10</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">{language === 'es' ? 'Sin evaluaciones Acumen' : 'No Acumen evaluations'}</p>
                    <p className="text-xs text-gray-400">{language === 'es' ? 'Envía evaluaciones para ver la distribución' : 'Send evaluations to see the distribution'}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Distribución Values */}
            <Card className="bg-white border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Scale className="w-5 h-5 text-violet-600" />
                  {t('analytics.team.valuesIntegrity')}
                </CardTitle>
                <CardDescription>{t('analytics.team.valuesDimensions')}</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.withValues > 0 ? (
                  <>
                    <div className="space-y-3">
                      {[
                        { key: 'teorico', labelKey: 'values.theoretical', emoji: '📚', color: 'bg-blue-500' },
                        { key: 'utilitario', labelKey: 'values.utilitarian', emoji: '💰', color: 'bg-green-500' },
                        { key: 'estetico', labelKey: 'values.aesthetic', emoji: '🎨', color: 'bg-pink-500' },
                        { key: 'social', labelKey: 'values.social', emoji: '🤝', color: 'bg-orange-500' },
                        { key: 'individualista', labelKey: 'values.individualistic', emoji: '🏆', color: 'bg-purple-500' },
                        { key: 'tradicional', labelKey: 'values.traditional', emoji: '⚖️', color: 'bg-slate-500' },
                      ].map(({ key, labelKey, emoji, color }) => (
                        <div key={key}>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">{emoji} {t(labelKey)}</span>
                            <span className="text-xs font-bold text-gray-900">
                              {stats.valuesDimensions[key as keyof typeof stats.valuesDimensions]}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${stats.valuesDimensions[key as keyof typeof stats.valuesDimensions]}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Promedio Integridad */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t('analytics.team.avgIntegrity')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-violet-600">{stats.avgValuesScore}</span>
                          <span className="text-sm text-gray-500">/ 100</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Scale className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">{language === 'es' ? 'Sin evaluaciones de Valores' : 'No Values evaluations'}</p>
                    <p className="text-xs text-gray-400">{language === 'es' ? 'Envía evaluaciones para ver la distribución' : 'Send evaluations to see the distribution'}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Distribución Estrés y Resiliencia */}
            <Card className="bg-white border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-orange-600" />
                  {t('analytics.team.stressResilience')}
                </CardTitle>
                <CardDescription>{t('analytics.team.resilienceLevels')}</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.withStress > 0 && Object.keys(stats.stressDistribution).length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {(() => {
                        const levelOrder = ['Muy Alta', 'Alta', 'Moderada', 'Baja', 'Muy Baja'];
                        const levelLabels: Record<string, string> = language === 'es' ? {
                          'Muy Alta': 'Resiliencia Muy Alta',
                          'Alta': 'Resiliencia Alta',
                          'Moderada': 'Resiliencia Moderada',
                          'Baja': 'Resiliencia Baja',
                          'Muy Baja': 'Resiliencia Muy Baja'
                        } : {
                          'Muy Alta': 'Very High Resilience',
                          'Alta': 'High Resilience',
                          'Moderada': 'Moderate Resilience',
                          'Baja': 'Low Resilience',
                          'Muy Baja': 'Very Low Resilience'
                        };
                        const levelColors: Record<string, string> = {
                          'Muy Alta': 'bg-green-500',
                          'Alta': 'bg-emerald-500',
                          'Moderada': 'bg-yellow-500',
                          'Baja': 'bg-orange-500',
                          'Muy Baja': 'bg-red-500'
                        };
                        
                        return levelOrder
                          .filter(level => stats.stressDistribution[level])
                          .map(level => {
                            const count = stats.stressDistribution[level];
                            const percentage = (count / stats.withStress) * 100;
                            
                            return (
                              <div key={level}>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    {levelLabels[level]}
                                  </span>
                                  <span className="text-sm font-bold text-gray-900">
                                    {count} ({percentage.toFixed(0)}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div
                                    className={`${levelColors[level]} h-3 rounded-full transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          });
                      })()}
                    </div>
                    
                    {/* Promedios Estrés/Resiliencia */}
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-xl">
                        <span className="text-2xl font-bold text-green-600">{stats.avgResilienceScore}%</span>
                        <p className="text-xs text-gray-500">{t('analytics.team.avgResilience')}</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-xl">
                        <span className="text-2xl font-bold text-orange-600">{stats.avgStressScore}%</span>
                        <p className="text-xs text-gray-500">{t('analytics.team.avgStress')}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">{language === 'es' ? 'Sin evaluaciones de Estrés' : 'No Stress evaluations'}</p>
                    <p className="text-xs text-gray-400">{language === 'es' ? 'Envía evaluaciones para ver la distribución' : 'Send evaluations to see the distribution'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Categorías DNA del Equipo - Nueva sección */}
          {stats.withDNA > 0 && (
            <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
                    <Dna className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xl">{t('analytics.team.dnaCompetencies')}</span>
                    <p className="text-sm font-normal text-gray-500 mt-1">{t('analytics.team.avgByCategory')} ({stats.withDNA} {t('analytics.team.evaluated')})</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Pensamiento */}
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🧠</span>
                      <span className="text-sm font-medium text-gray-700">{t('dna.thinking')}</span>
                    </div>
                    <div className="text-3xl font-bold text-indigo-600 mb-2">{stats.dnaCategories.thinking}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.dnaCategories.thinking}%` }} />
                    </div>
                  </div>

                  {/* Comunicación */}
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">💬</span>
                      <span className="text-sm font-medium text-gray-700">{t('dna.communication')}</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">{stats.dnaCategories.communication}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.dnaCategories.communication}%` }} />
                    </div>
                  </div>

                  {/* Liderazgo */}
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">👥</span>
                      <span className="text-sm font-medium text-gray-700">{t('dna.leadership')}</span>
                    </div>
                    <div className="text-3xl font-bold text-pink-600 mb-2">{stats.dnaCategories.leadership}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.dnaCategories.leadership}%` }} />
                    </div>
                  </div>

                  {/* Resultados */}
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🎯</span>
                      <span className="text-sm font-medium text-gray-700">{t('dna.results')}</span>
                    </div>
                    <div className="text-3xl font-bold text-amber-600 mb-2">{stats.dnaCategories.results}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.dnaCategories.results}%` }} />
                    </div>
                  </div>

                  {/* Relaciones */}
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🤝</span>
                      <span className="text-sm font-medium text-gray-700">{t('dna.relationships')}</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">{stats.dnaCategories.relationship}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.dnaCategories.relationship}%` }} />
                    </div>
                  </div>
                </div>

                {/* Insights del DNA del equipo */}
                <div className="mt-6 p-4 bg-white/80 rounded-xl border border-teal-200">
                  <h4 className="font-semibold text-teal-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {t('analytics.team.dnaAnalysis')}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {(() => {
                      const categoryNames = language === 'es' ? {
                        thinking: 'Pensamiento Analítico',
                        communication: 'Comunicación',
                        leadership: 'Liderazgo',
                        results: 'Orientación a Resultados',
                        relationship: 'Habilidades Relacionales',
                      } : {
                        thinking: 'Analytical Thinking',
                        communication: 'Communication',
                        leadership: 'Leadership',
                        results: 'Results Orientation',
                        relationship: 'Relational Skills',
                      };
                      const categories = [
                        { name: categoryNames.thinking, score: stats.dnaCategories.thinking },
                        { name: categoryNames.communication, score: stats.dnaCategories.communication },
                        { name: categoryNames.leadership, score: stats.dnaCategories.leadership },
                        { name: categoryNames.results, score: stats.dnaCategories.results },
                        { name: categoryNames.relationship, score: stats.dnaCategories.relationship },
                      ];
                      const sorted = [...categories].sort((a, b) => b.score - a.score);
                      const top = sorted[0];
                      const lowest = sorted[sorted.length - 1];
                      
                      if (language === 'es') {
                        return `El equipo destaca en ${top.name} (${top.score}%), lo que indica una fortaleza colectiva en esta área. ${lowest.score < 50 ? `Hay oportunidad de desarrollo en ${lowest.name} (${lowest.score}%).` : `Todas las categorías están en niveles saludables.`}`;
                      } else {
                        return `The team excels in ${top.name} (${top.score}%), indicating a collective strength in this area. ${lowest.score < 50 ? `There is opportunity for development in ${lowest.name} (${lowest.score}%).` : `All categories are at healthy levels.`}`;
                      }
                    })()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dimensiones Acumen del Equipo */}
          {stats.withAcumen > 0 && (
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                    <Compass className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xl">{t('analytics.team.acumenCapacity')}</span>
                    <p className="text-sm font-normal text-gray-500 mt-1">{t('analytics.team.avgByDimension')} ({stats.withAcumen} {t('analytics.team.evaluated')})</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Factores Externos */}
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🌍</span>
                      <span className="font-semibold text-gray-700">{t('acumen.external')}</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-4">{stats.acumenDimensions.external}</div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{t('acumen.understanding')}</span>
                          <span className="font-medium text-blue-600">{(stats.acumenDimensions.external * 1.0).toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.acumenDimensions.external * 10}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{t('acumen.practical')}</span>
                          <span className="font-medium text-blue-600">{(stats.acumenDimensions.external * 1.0).toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.acumenDimensions.external * 10}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{t('acumen.systems')}</span>
                          <span className="font-medium text-blue-600">{(stats.acumenDimensions.external * 1.0).toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.acumenDimensions.external * 10}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Factores Internos */}
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🧘</span>
                      <span className="font-semibold text-gray-700">{t('acumen.internal')}</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-4">{stats.acumenDimensions.internal}</div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{t('acumen.selfSense')}</span>
                          <span className="font-medium text-purple-600">{(stats.acumenDimensions.internal * 1.0).toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats.acumenDimensions.internal * 10}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{t('acumen.roleAwareness')}</span>
                          <span className="font-medium text-purple-600">{(stats.acumenDimensions.internal * 1.0).toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats.acumenDimensions.internal * 10}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{t('acumen.selfDirection')}</span>
                          <span className="font-medium text-purple-600">{(stats.acumenDimensions.internal * 1.0).toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats.acumenDimensions.internal * 10}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insights del Acumen del equipo */}
                <div className="mt-6 p-4 bg-white/80 rounded-xl border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {t('analytics.team.acumenAnalysis')}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {(() => {
                      const external = stats.acumenDimensions.external;
                      const internal = stats.acumenDimensions.internal;
                      
                      if (language === 'es') {
                        if (external > internal) {
                          return `El equipo muestra mayor claridad externa (${external}) que interna (${internal}), lo que indica una buena capacidad para evaluar situaciones y personas externas. Se recomienda trabajar en la autoconciencia y la introspección.`;
                        } else if (internal > external) {
                          return `El equipo muestra mayor claridad interna (${internal}) que externa (${external}), lo que indica una buena autoconciencia. Se recomienda trabajar en la evaluación de situaciones y personas externas.`;
                        } else {
                          return `El equipo muestra un equilibrio entre claridad externa (${external}) e interna (${internal}), lo que indica un desarrollo balanceado en la capacidad de juicio.`;
                        }
                      } else {
                        if (external > internal) {
                          return `The team shows higher external clarity (${external}) than internal (${internal}), indicating good capacity to evaluate external situations and people. It is recommended to work on self-awareness and introspection.`;
                        } else if (internal > external) {
                          return `The team shows higher internal clarity (${internal}) than external (${external}), indicating good self-awareness. It is recommended to work on evaluating external situations and people.`;
                        } else {
                          return `The team shows a balance between external clarity (${external}) and internal (${internal}), indicating balanced development in judgment capacity.`;
                        }
                      }
                    })()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bienestar y Resiliencia del Equipo */}
          {stats.withStress > 0 && (
            <Card className="bg-gradient-to-br from-orange-50 to-rose-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xl">{t('analytics.team.wellbeing')}</span>
                    <p className="text-sm font-normal text-gray-500 mt-1">{t('analytics.team.fiveDimensions')} ({stats.withStress} {t('analytics.team.evaluated')})</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Estrés Laboral (invertido) */}
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">💼</span>
                      <span className="text-sm font-medium text-gray-700">{t('stress.workStress')}</span>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${stats.stressDimensions.estresLaboral > 60 ? 'text-red-600' : stats.stressDimensions.estresLaboral > 40 ? 'text-orange-600' : 'text-green-600'}`}>
                      {stats.stressDimensions.estresLaboral}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${stats.stressDimensions.estresLaboral > 60 ? 'bg-red-500' : stats.stressDimensions.estresLaboral > 40 ? 'bg-orange-500' : 'bg-green-500'} h-2 rounded-full transition-all duration-500`} style={{ width: `${stats.stressDimensions.estresLaboral}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{t('analytics.team.lowerBetter')}</p>
                  </div>

                  {/* Capacidad de Recuperación */}
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🔄</span>
                      <span className="text-sm font-medium text-gray-700">{t('stress.recovery')}</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">{stats.stressDimensions.capacidadRecuperacion}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.stressDimensions.capacidadRecuperacion}%` }} />
                    </div>
                  </div>

                  {/* Manejo Emocional */}
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">💭</span>
                      <span className="text-sm font-medium text-gray-700">{t('stress.emotional')}</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stats.stressDimensions.manejoEmocional}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.stressDimensions.manejoEmocional}%` }} />
                    </div>
                  </div>

                  {/* Equilibrio Vida-Trabajo */}
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">⚖️</span>
                      <span className="text-sm font-medium text-gray-700">{t('stress.lifeBalance')}</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">{stats.stressDimensions.equilibrioVida}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.stressDimensions.equilibrioVida}%` }} />
                    </div>
                  </div>

                  {/* Resiliencia */}
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🛡️</span>
                      <span className="text-sm font-medium text-gray-700">{t('stress.resilience')}</span>
                    </div>
                    <div className="text-3xl font-bold text-teal-600 mb-2">{stats.stressDimensions.resiliencia}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.stressDimensions.resiliencia}%` }} />
                    </div>
                  </div>
                </div>

                {/* Insights del Estrés del equipo */}
                <div className="mt-6 p-4 bg-white/80 rounded-xl border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {t('analytics.team.wellbeingAnalysis')}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {(() => {
                      const resilience = stats.avgResilienceScore;
                      const stress = stats.avgStressScore;
                      
                      if (language === 'es') {
                        if (resilience >= 70 && stress <= 40) {
                          return `¡Excelente! El equipo muestra alta resiliencia (${resilience}%) y bajo estrés (${stress}%), indicando un ambiente laboral saludable y capacidad para manejar desafíos.`;
                        } else if (resilience >= 50 && stress <= 60) {
                          return `El equipo presenta niveles moderados de resiliencia (${resilience}%) y estrés (${stress}%). Se recomienda fortalecer las estrategias de manejo emocional y recuperación.`;
                        } else if (stress > 60) {
                          return `⚠️ Atención: El equipo muestra niveles elevados de estrés (${stress}%). Es importante implementar programas de bienestar y revisar la carga de trabajo.`;
                        } else {
                          return `El equipo tiene una resiliencia de ${resilience}% y estrés de ${stress}%. Hay oportunidad de fortalecer las capacidades de afrontamiento y equilibrio vida-trabajo.`;
                        }
                      } else {
                        if (resilience >= 70 && stress <= 40) {
                          return `Excellent! The team shows high resilience (${resilience}%) and low stress (${stress}%), indicating a healthy work environment and capacity to handle challenges.`;
                        } else if (resilience >= 50 && stress <= 60) {
                          return `The team shows moderate levels of resilience (${resilience}%) and stress (${stress}%). It is recommended to strengthen emotional management and recovery strategies.`;
                        } else if (stress > 60) {
                          return `⚠️ Warning: The team shows elevated stress levels (${stress}%). It is important to implement wellness programs and review workload.`;
                        } else {
                          return `The team has a resilience of ${resilience}% and stress of ${stress}%. There is opportunity to strengthen coping capacities and work-life balance.`;
                        }
                      }
                    })()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de personas con paginación */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>{t('analytics.evaluatedPeople')}</CardTitle>
                  <CardDescription>
                    {overviewFilteredPeople.length} {t('analytics.people')} 
                    {searchQuery && ` "${searchQuery}"`}
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t('analytics.search.placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {overviewVisiblePeople.map(person => (
                  <div
                    key={person.id}
                    onClick={() => handleSelectPerson(person)}
                    className="p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {person.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors truncate">
                            {person.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{person.email}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {person.disc && (
                        <Badge className={`${getDiscColor(person.disc.primaryStyle)} text-white text-xs px-1.5 py-0.5`}>
                          {person.disc.primaryStyle}
                        </Badge>
                      )}
                      {person.drivingForces && (
                        <Badge className="bg-purple-500 text-white text-xs px-1.5 py-0.5">FM</Badge>
                      )}
                      {person.eq && (
                        <Badge className="bg-rose-500 text-white text-xs px-1.5 py-0.5">EQ</Badge>
                      )}
                      {person.dna && (
                        <Badge className="bg-teal-500 text-white text-xs px-1.5 py-0.5">DNA</Badge>
                      )}
                      {person.acumen && (
                        <Badge className="bg-amber-500 text-white text-xs px-1.5 py-0.5">ACI</Badge>
                      )}
                      {person.values && (
                        <Badge className="bg-violet-500 text-white text-xs px-1.5 py-0.5">Val</Badge>
                      )}
                      {person.stress && (
                        <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0.5">Str</Badge>
                      )}
                      {person.technical && (
                        <Badge className="bg-sky-500 text-white text-xs px-1.5 py-0.5">Téc</Badge>
                      )}
                      {person.hasFullReclu && (
                        <Badge className="bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 text-white text-xs px-1.5 py-0.5">
                          <Sparkles className="w-3 h-3" />
                        </Badge>
                      )}
                      {!person.disc && !person.drivingForces && !person.eq && !person.dna && !person.acumen && !person.values && !person.stress && !person.technical && (
                        <Badge variant="outline" className="text-gray-500 text-xs">
                          Pendiente
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {overviewFilteredPeople.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">{t('analytics.noPersonsFound')}</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              )}

              {/* Paginación */}
              {overviewTotalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
                  <p className="text-sm text-gray-500">
                    Mostrando {((overviewPage - 1) * overviewPeoplePerPage) + 1} - {Math.min(overviewPage * overviewPeoplePerPage, overviewFilteredPeople.length)} de {overviewFilteredPeople.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOverviewPage(p => Math.max(1, p - 1))}
                      disabled={overviewPage === 1}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, overviewTotalPages) }, (_, i) => {
                        let pageNum: number;
                        if (overviewTotalPages <= 5) {
                          pageNum = i + 1;
                        } else if (overviewPage <= 3) {
                          pageNum = i + 1;
                        } else if (overviewPage >= overviewTotalPages - 2) {
                          pageNum = overviewTotalPages - 4 + i;
                        } else {
                          pageNum = overviewPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={overviewPage === pageNum ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setOverviewPage(pageNum)}
                            className={overviewPage === pageNum ? 'bg-indigo-600' : ''}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOverviewPage(p => Math.min(overviewTotalPages, p + 1))}
                      disabled={overviewPage === overviewTotalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vista Individual */}
      {viewMode === 'individual' && (
        <div className="space-y-6">
          {/* Hero Section - Individual */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 sm:p-8 shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('analytics.individualAnalysis')}</h1>
                  <p className="text-white/80 text-sm sm:text-base">{language === 'es' ? 'Perfil completo Reclu de una persona' : 'Complete Reclu profile of a person'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{language === 'es' ? '8 Módulos' : '8 Modules'}</p>
                      <p className="text-white/70 text-xs">{language === 'es' ? 'Visión 360° del perfil' : '360° profile view'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{language === 'es' ? 'Gráficas Detalladas' : 'Detailed Charts'}</p>
                      <p className="text-white/70 text-xs">{language === 'es' ? 'Cada dimensión analizada' : 'Each dimension analyzed'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{t('analytics.integratedAnalysis')}</p>
                      <p className="text-white/70 text-xs">{language === 'es' ? 'Perfil Reclu completo' : 'Complete Reclu profile'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selector de persona optimizado */}
          <Card className="bg-white border-0 shadow-xl relative z-20">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <Search className="w-5 h-5 text-amber-600" />
                    {t('analytics.selectPerson')}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{language === 'es' ? `Elige entre ${people.length} personas evaluadas para ver su perfil completo` : `Choose from ${people.length} evaluated people to see their full profile`}</p>
                </div>
                {selectedPerson && (
                  <Badge className="bg-amber-100 text-amber-700 text-sm px-3 py-1.5">
                    {language === 'es' ? '1 seleccionada' : '1 selected'}
                  </Badge>
                )}
              </div>
            </div>
            <CardContent className="p-6 relative z-30">
              <PersonSelector
                people={people}
                selectedPerson={selectedPerson}
                onSelect={handleSelectPerson}
                recentSelections={recentSelections}
                getDiscColor={getDiscColor}
                mode="single"
              />
            </CardContent>
          </Card>

          {/* Contenido del análisis individual */}
          {selectedPerson ? (
            <div className="space-y-6">
              {/* Header de la persona */}
              <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 shadow-xl text-white">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
                        {selectedPerson.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedPerson.name}</h2>
                        <p className="text-indigo-200 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {selectedPerson.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPerson.disc && (
                        <Badge className="bg-white/20 text-white border-0">
                          <Brain className="w-3 h-3 mr-1" />
                          DISC
                        </Badge>
                      )}
                      {selectedPerson.drivingForces && (
                        <Badge className="bg-white/20 text-white border-0">
                          <Target className="w-3 h-3 mr-1" />
                          FM
                        </Badge>
                      )}
                      {selectedPerson.eq && (
                        <Badge className="bg-white/20 text-white border-0">
                          <Heart className="w-3 h-3 mr-1" />
                          EQ
                        </Badge>
                      )}
                      {selectedPerson.dna && (
                        <Badge className="bg-white/20 text-white border-0">
                          <Dna className="w-3 h-3 mr-1" />
                          DNA
                        </Badge>
                      )}
                      {selectedPerson.acumen && (
                        <Badge className="bg-white/20 text-white border-0">
                          <Compass className="w-3 h-3 mr-1" />
                          ACI
                        </Badge>
                      )}
                      {selectedPerson.values && (
                        <Badge className="bg-white/20 text-white border-0">
                          <Scale className="w-3 h-3 mr-1" />
                          {language === 'es' ? 'Valores' : 'Values'}
                        </Badge>
                      )}
                      {selectedPerson.stress && (
                        <Badge className="bg-white/20 text-white border-0">
                          <Activity className="w-3 h-3 mr-1" />
                          {language === 'es' ? 'Estrés' : 'Stress'}
                        </Badge>
                      )}
                      {selectedPerson.technical && (
                        <Badge className="bg-white/20 text-white border-0">
                          <FileCode className="w-3 h-3 mr-1" />
                          {language === 'es' ? 'Técnica' : 'Technical'}
                        </Badge>
                      )}
                      {selectedPerson.hasFullReclu && (
                        <Badge className="bg-white text-indigo-600">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {language === 'es' ? 'Reclu Completo' : 'Complete Reclu'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs de contenido */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="w-full">
                <TabsList className="grid w-full grid-cols-10 bg-white shadow-lg rounded-xl p-1">
                  <TabsTrigger value="all" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg text-xs">
                    <Layers className="w-3 h-3 mr-1" />
                    {language === 'es' ? 'Todo' : 'All'}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="disc" 
                    disabled={!selectedPerson.disc}
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg text-xs"
                  >
                    <Brain className="w-3 h-3 mr-1" />
                    DISC
                  </TabsTrigger>
                  <TabsTrigger 
                    value="df" 
                    disabled={!selectedPerson.drivingForces}
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg text-xs"
                  >
                    <Target className="w-3 h-3 mr-1" />
                    FM
                  </TabsTrigger>
                  <TabsTrigger 
                    value="eq" 
                    disabled={!selectedPerson.eq}
                    className="data-[state=active]:bg-rose-600 data-[state=active]:text-white rounded-lg text-xs"
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    EQ
                  </TabsTrigger>
                  <TabsTrigger 
                    value="dna" 
                    disabled={!selectedPerson.dna}
                    className="data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg text-xs"
                  >
                    <Dna className="w-3 h-3 mr-1" />
                    DNA
                  </TabsTrigger>
                  <TabsTrigger 
                    value="acumen" 
                    disabled={!selectedPerson.acumen}
                    className="data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-lg text-xs"
                  >
                    <Compass className="w-3 h-3 mr-1" />
                    ACI
                  </TabsTrigger>
                  <TabsTrigger 
                    value="values" 
                    disabled={!selectedPerson.values}
                    className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg text-xs"
                  >
                    <Scale className="w-3 h-3 mr-1" />
                    {language === 'es' ? 'Valores' : 'Values'}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="stress" 
                    disabled={!selectedPerson.stress}
                    className="data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-lg text-xs"
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    {language === 'es' ? 'Estrés' : 'Stress'}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="technical" 
                    disabled={!selectedPerson.technical}
                    className="data-[state=active]:bg-sky-600 data-[state=active]:text-white rounded-lg text-xs"
                  >
                    <FileCode className="w-3 h-3 mr-1" />
                    {language === 'es' ? 'Técnica' : 'Technical'}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="integrated" 
                    disabled={!selectedPerson.hasComplete}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg text-xs"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {language === 'es' ? 'Integrado' : 'Integrated'}
                  </TabsTrigger>
                </TabsList>

                {/* Tab: Todo */}
                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {selectedPerson.disc && (
                      <DISCChart
                        percentileD={selectedPerson.disc.percentileD}
                        percentileI={selectedPerson.disc.percentileI}
                        percentileS={selectedPerson.disc.percentileS}
                        percentileC={selectedPerson.disc.percentileC}
                        title={language === 'es' ? 'Perfil DISC' : 'DISC Profile'}
                        showDetails={false}
                      />
                    )}
                    {selectedPerson.drivingForces && (
                      <DrivingForcesChart
                        data={selectedPerson.drivingForces}
                        title={language === 'es' ? 'Fuerzas Motivadoras' : 'Driving Forces'}
                        showDetails={false}
                      />
                    )}
                    {selectedPerson.eq && (
                      <EQChart
                        data={selectedPerson.eq}
                        showDetails={false}
                        compact={true}
                      />
                    )}
                    {selectedPerson.dna && (
                      <DNAChart
                        data={selectedPerson.dna}
                        showDetails={false}
                        compact={true}
                      />
                    )}
                    {selectedPerson.acumen && (
                      <Card className="bg-white border-0 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-xl pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Compass className="w-4 h-4" />
                            Acumen (ACI)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                              <p className="text-xs text-gray-500">{language === 'es' ? 'Externo' : 'External'}</p>
                              <p className="text-lg font-bold text-blue-600">{selectedPerson.acumen.externalClarityScore}</p>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded-lg">
                              <p className="text-xs text-gray-500">{language === 'es' ? 'Interno' : 'Internal'}</p>
                              <p className="text-lg font-bold text-purple-600">{selectedPerson.acumen.internalClarityScore}</p>
                            </div>
                          </div>
                          <div className="text-center p-2 bg-amber-50 rounded-lg">
                            <p className="text-xs text-gray-500">{language === 'es' ? 'Nivel' : 'Level'}</p>
                            <p className="text-sm font-bold text-amber-600">{selectedPerson.acumen.acumenLevel?.replace('_', ' ')}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {selectedPerson.values && (
                      <Card className="bg-white border-0 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-xl pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Scale className="w-4 h-4" />
                            {language === 'es' ? 'Valores e Integridad' : 'Values & Integrity'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="text-center p-2 bg-violet-50 rounded-lg">
                              <p className="text-xs text-gray-500">{language === 'es' ? 'Teórico' : 'Theoretical'}</p>
                              <p className="text-sm font-bold text-violet-600">{selectedPerson.values.teoricoPercentile}%</p>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded-lg">
                              <p className="text-xs text-gray-500">{language === 'es' ? 'Utilitario' : 'Utilitarian'}</p>
                              <p className="text-sm font-bold text-green-600">{selectedPerson.values.utilitarioPercentile}%</p>
                            </div>
                            <div className="text-center p-2 bg-pink-50 rounded-lg">
                              <p className="text-xs text-gray-500">{language === 'es' ? 'Estético' : 'Aesthetic'}</p>
                              <p className="text-sm font-bold text-pink-600">{selectedPerson.values.esteticoPercentile}%</p>
                            </div>
                            <div className="text-center p-2 bg-red-50 rounded-lg">
                              <p className="text-xs text-gray-500">{language === 'es' ? 'Social' : 'Social'}</p>
                              <p className="text-sm font-bold text-red-600">{selectedPerson.values.socialPercentile}%</p>
                            </div>
                            <div className="text-center p-2 bg-amber-50 rounded-lg">
                              <p className="text-xs text-gray-500">{language === 'es' ? 'Individual' : 'Individualistic'}</p>
                              <p className="text-sm font-bold text-amber-600">{selectedPerson.values.individualistaPercentile}%</p>
                            </div>
                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                              <p className="text-xs text-gray-500">{language === 'es' ? 'Tradicional' : 'Traditional'}</p>
                              <p className="text-sm font-bold text-blue-600">{selectedPerson.values.tradicionalPercentile}%</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {selectedPerson.stress && (
                      <Card className="bg-white border-0 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-t-xl pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            {language === 'es' ? 'Estrés y Resiliencia' : 'Stress & Resilience'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="text-center p-2 bg-green-50 rounded-lg">
                              <p className="text-xs text-gray-500">{language === 'es' ? 'Resiliencia' : 'Resilience'}</p>
                              <p className="text-lg font-bold text-green-600">{selectedPerson.stress.indiceResiliencia}</p>
                            </div>
                            <div className="text-center p-2 bg-orange-50 rounded-lg">
                              <p className="text-xs text-gray-500">{language === 'es' ? 'Estrés' : 'Stress'}</p>
                              <p className="text-lg font-bold text-orange-600">{selectedPerson.stress.nivelEstresGeneral}</p>
                            </div>
                          </div>
                          <div className="text-center p-2 bg-rose-50 rounded-lg">
                            <p className="text-xs text-gray-500">{language === 'es' ? 'Nivel' : 'Level'}</p>
                            <p className="text-sm font-bold text-rose-600">{selectedPerson.stress.resilienceLevel}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {!selectedPerson.disc && (
                      <Card className="bg-gray-50 border-2 border-dashed border-gray-200">
                        <CardContent className="p-8 text-center">
                          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 mb-4">{language === 'es' ? 'Evaluación DISC pendiente' : 'DISC evaluation pending'}</p>
                          <Link href="/external-evaluations">
                            <Button variant="outline" size="sm">
                              <Send className="w-4 h-4 mr-2" />
                              {language === 'es' ? 'Enviar Evaluación' : 'Send Evaluation'}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    )}
                    {!selectedPerson.drivingForces && (
                      <Card className="bg-gray-50 border-2 border-dashed border-gray-200">
                        <CardContent className="p-8 text-center">
                          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 mb-4">{language === 'es' ? 'Evaluación FM pendiente' : 'DF evaluation pending'}</p>
                          <Link href="/external-driving-forces-evaluations">
                            <Button variant="outline" size="sm">
                              <Send className="w-4 h-4 mr-2" />
                              {language === 'es' ? 'Enviar Evaluación' : 'Send Evaluation'}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    )}
                    {!selectedPerson.eq && (
                      <Card className="bg-gray-50 border-2 border-dashed border-gray-200">
                        <CardContent className="p-8 text-center">
                          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 mb-4">{language === 'es' ? 'Evaluación EQ pendiente' : 'EQ evaluation pending'}</p>
                          <Link href="/external-eq-evaluations">
                            <Button variant="outline" size="sm">
                              <Send className="w-4 h-4 mr-2" />
                              {language === 'es' ? 'Enviar Evaluación' : 'Send Evaluation'}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    )}
                    {!selectedPerson.dna && (
                      <Card className="bg-gray-50 border-2 border-dashed border-gray-200">
                        <CardContent className="p-8 text-center">
                          <Dna className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 mb-4">{language === 'es' ? 'Evaluación DNA-25 pendiente' : 'DNA-25 evaluation pending'}</p>
                          <Link href="/external-dna-evaluations">
                            <Button variant="outline" size="sm">
                              <Send className="w-4 h-4 mr-2" />
                              {language === 'es' ? 'Enviar Evaluación' : 'Send Evaluation'}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    )}
                    {!selectedPerson.acumen && (
                      <Card className="bg-gray-50 border-2 border-dashed border-gray-200">
                        <CardContent className="p-8 text-center">
                          <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 mb-4">{language === 'es' ? 'Evaluación Acumen pendiente' : 'Acumen evaluation pending'}</p>
                          <Link href="/external-acumen-evaluations">
                            <Button variant="outline" size="sm">
                              <Send className="w-4 h-4 mr-2" />
                              {language === 'es' ? 'Enviar Evaluación' : 'Send Evaluation'}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    )}
                    {!selectedPerson.values && (
                      <Card className="bg-gray-50 border-2 border-dashed border-gray-200">
                        <CardContent className="p-8 text-center">
                          <Scale className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 mb-4">{language === 'es' ? 'Evaluación Valores pendiente' : 'Values evaluation pending'}</p>
                          <Link href="/external-values-evaluations">
                            <Button variant="outline" size="sm">
                              <Send className="w-4 h-4 mr-2" />
                              {language === 'es' ? 'Enviar Evaluación' : 'Send Evaluation'}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    )}
                    {!selectedPerson.stress && (
                      <Card className="bg-gray-50 border-2 border-dashed border-gray-200">
                        <CardContent className="p-8 text-center">
                          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 mb-4">{language === 'es' ? 'Evaluación Estrés pendiente' : 'Stress evaluation pending'}</p>
                          <Link href="/external-stress-evaluations">
                            <Button variant="outline" size="sm">
                              <Send className="w-4 h-4 mr-2" />
                              {language === 'es' ? 'Enviar Evaluación' : 'Send Evaluation'}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {/* Tab: DISC */}
                <TabsContent value="disc" className="mt-6">
                  {selectedPerson.disc && (
                    <div className="space-y-6">
                      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-0 shadow-lg overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white pb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 rounded-xl">
                              <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{language === 'es' ? 'Perfil DISC' : 'DISC Profile'}</CardTitle>
                              <CardDescription className="text-red-100">
                                {language === 'es' ? 'Análisis de estilos de comportamiento' : 'Behavioral styles analysis'}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                              <DISCChart
                                percentileD={selectedPerson.disc.percentileD}
                                percentileI={selectedPerson.disc.percentileI}
                                percentileS={selectedPerson.disc.percentileS}
                                percentileC={selectedPerson.disc.percentileC}
                                title={language === 'es' ? 'Perfil DISC Detallado' : 'Detailed DISC Profile'}
                                showDetails={true}
                              />
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                              <h4 className="text-lg font-semibold">{language === 'es' ? 'Resumen DISC' : 'DISC Summary'}</h4>
                              <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <div className={`w-16 h-16 ${getDiscColor(selectedPerson.disc.primaryStyle)} rounded-full flex items-center justify-center mx-auto mb-2`}>
                                  <span className="text-2xl font-bold text-white">{selectedPerson.disc.primaryStyle}</span>
                                </div>
                                <p className="font-semibold text-gray-900">{language === 'es' ? 'Estilo Primario' : 'Primary Style'}</p>
                                <p className="text-sm text-gray-500">{selectedPerson.disc.personalityType}</p>
                              </div>
                              {selectedPerson.disc.secondaryStyle && (
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <span className="text-sm text-gray-600">{language === 'es' ? 'Estilo Secundario' : 'Secondary Style'}</span>
                                  <Badge className={getDiscColor(selectedPerson.disc.secondaryStyle)}>
                                    {selectedPerson.disc.secondaryStyle}
                                  </Badge>
                                </div>
                              )}
                              {selectedPerson.disc.styleIntensity && (
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <span className="text-sm text-gray-600">Intensidad</span>
                                  <span className="font-semibold">{selectedPerson.disc.styleIntensity.toFixed(0)}%</span>
                                </div>
                              )}
                              {selectedPerson.discDate && (
                                <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(selectedPerson.discDate).toLocaleDateString('es-ES', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Análisis detallado DISC */}
                      <DISCDetailedAnalysis primaryStyle={selectedPerson.disc.primaryStyle} />
                    </div>
                  )}
                </TabsContent>

                {/* Tab: Fuerzas Motivadoras */}
                <TabsContent value="df" className="mt-6">
                  {selectedPerson.drivingForces && (
                    <div className="space-y-6">
                      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white pb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 rounded-xl">
                              <Target className="w-6 h-6" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">Fuerzas Motivadoras</CardTitle>
                              <CardDescription className="text-purple-100">
                                Análisis de motivadores y valores personales
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                              <DrivingForcesChart
                                data={selectedPerson.drivingForces}
                                title={language === 'es' ? 'Fuerzas Motivadoras Detalladas' : 'Detailed Driving Forces'}
                                showDetails={true}
                              />
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                              <h4 className="text-lg font-semibold">{language === 'es' ? 'Resumen FM' : 'DF Summary'}</h4>
                              {selectedPerson.drivingForces.topMotivator && (
                                <div className="text-center p-4 bg-purple-50 rounded-xl">
                                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Target className="w-8 h-8 text-white" />
                                  </div>
                                  <p className="font-semibold text-gray-900">{language === 'es' ? 'Motivador Principal' : 'Main Motivator'}</p>
                                  <p className="text-sm text-purple-600 capitalize">{selectedPerson.drivingForces.topMotivator.toLowerCase()}</p>
                                </div>
                              )}
                              {selectedPerson.drivingForces.primaryMotivators && selectedPerson.drivingForces.primaryMotivators.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">{language === 'es' ? 'Motivadores Principales' : 'Main Motivators'}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedPerson.drivingForces.primaryMotivators.slice(0, 4).map(m => (
                                      <Badge key={m} variant="outline" className="text-purple-600 border-purple-200">
                                        {m.substring(0, 3)}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {selectedPerson.dfDate && (
                                <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(selectedPerson.dfDate).toLocaleDateString('es-ES', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Análisis detallado Fuerzas Motivadoras */}
                      <DrivingForcesDetailedAnalysis data={selectedPerson.drivingForces} />
                    </div>
                  )}
                </TabsContent>

                {/* Tab: EQ */}
                <TabsContent value="eq" className="mt-6">
                  {selectedPerson.eq && (
                    <div className="space-y-6">
                      <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-0 shadow-lg overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white pb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 rounded-xl">
                              <Heart className="w-6 h-6" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{language === 'es' ? 'Inteligencia Emocional' : 'Emotional Intelligence'}</CardTitle>
                              <CardDescription className="text-rose-100">
                                {language === 'es' ? 'Análisis de competencias emocionales' : 'Emotional competencies analysis'}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                              <EQChart
                                data={selectedPerson.eq}
                                showDetails={true}
                              />
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                              <h4 className="text-lg font-semibold">{language === 'es' ? 'Resumen EQ' : 'EQ Summary'}</h4>
                              <div className="text-center p-4 bg-rose-50 rounded-xl">
                                <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <Heart className="w-8 h-8 text-white" />
                                </div>
                                <p className="font-semibold text-gray-900">{language === 'es' ? 'Nivel EQ' : 'EQ Level'}</p>
                                <p className="text-sm text-rose-600">{selectedPerson.eq.eqLevel?.replace('_', ' ')}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-4xl font-bold text-rose-600">{selectedPerson.eq.totalScore}</p>
                                <p className="text-sm text-gray-500">{language === 'es' ? 'Puntuación Total' : 'Total Score'}</p>
                              </div>
                              {selectedPerson.eq.strengths && selectedPerson.eq.strengths.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">{language === 'es' ? 'Fortalezas' : 'Strengths'}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedPerson.eq.strengths.slice(0, 3).map(s => (
                                      <Badge key={s} variant="outline" className="text-green-600 border-green-200 text-xs">
                                        {s}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {selectedPerson.eqDate && (
                                <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(selectedPerson.eqDate).toLocaleDateString('es-ES', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Análisis detallado EQ */}
                      <EQDetailedAnalysis data={selectedPerson.eq} />
                    </div>
                  )}
                </TabsContent>

                {/* Tab: DNA-25 */}
                <TabsContent value="dna" className="mt-6">
                  {selectedPerson.dna && (
                    <div className="space-y-6">
                      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-0 shadow-lg overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white pb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 rounded-xl">
                              <Dna className="w-6 h-6" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">DNA-25 Competencias</CardTitle>
                              <CardDescription className="text-teal-100">
                                Análisis de 25 competencias profesionales
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                              <DNAChart
                                data={selectedPerson.dna}
                                showDetails={true}
                              />
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                              <h4 className="text-lg font-semibold">{language === 'es' ? 'Resumen DNA-25' : 'DNA-25 Summary'}</h4>
                              <div className="text-center p-4 bg-teal-50 rounded-xl">
                                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <Dna className="w-8 h-8 text-white" />
                                </div>
                                <p className="font-semibold text-gray-900">{language === 'es' ? 'Nivel DNA' : 'DNA Level'}</p>
                                <p className="text-sm text-teal-600">{selectedPerson.dna.dnaLevel?.replace('_', ' ')}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-4xl font-bold text-teal-600">{selectedPerson.dna.totalDNAPercentile}</p>
                                <p className="text-sm text-gray-500">{language === 'es' ? 'Percentil Total' : 'Total Percentile'}</p>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">{language === 'es' ? 'Perfil' : 'Profile'}</p>
                                <p className="text-sm font-medium text-gray-900">{selectedPerson.dna.dnaProfile}</p>
                              </div>
                              {selectedPerson.dna.primaryStrengths && selectedPerson.dna.primaryStrengths.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">{language === 'es' ? 'Top Competencias' : 'Top Competencies'}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedPerson.dna.primaryStrengths.slice(0, 3).map(s => (
                                      <Badge key={s} variant="outline" className="text-teal-600 border-teal-200 text-xs">
                                        {s}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {selectedPerson.dna.developmentAreas && selectedPerson.dna.developmentAreas.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">Áreas de Desarrollo</p>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedPerson.dna.developmentAreas.slice(0, 3).map(s => (
                                      <Badge key={s} variant="outline" className="text-amber-600 border-amber-200 text-xs">
                                        {s}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {selectedPerson.dnaDate && (
                                <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(selectedPerson.dnaDate).toLocaleDateString('es-ES', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Análisis detallado DNA-25 */}
                      <DNADetailedAnalysis data={selectedPerson.dna} />
                    </div>
                  )}
                </TabsContent>

                {/* Tab: Acumen */}
                <TabsContent value="acumen" className="mt-6">
                  {selectedPerson.acumen && (
                    <div className="space-y-6">
                      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-lg overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white pb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 rounded-xl">
                              <Compass className="w-6 h-6" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{language === 'es' ? 'Índice de Capacidad Acumen (ACI)' : 'Acumen Capacity Index (ACI)'}</CardTitle>
                              <CardDescription className="text-amber-100">
                                {language === 'es' ? 'Claridad perceptual y capacidad de juicio' : 'Perceptual clarity and judgment capacity'}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          {/* Métricas principales */}
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-3xl font-bold text-blue-600">{selectedPerson.acumen.externalClarityScore}</p>
                              <p className="text-xs text-gray-500 mt-1">{language === 'es' ? 'Claridad Externa' : 'External Clarity'}</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-3xl font-bold text-purple-600">{selectedPerson.acumen.internalClarityScore}</p>
                              <p className="text-xs text-gray-500 mt-1">{language === 'es' ? 'Claridad Interna' : 'Internal Clarity'}</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-3xl font-bold text-amber-600">{selectedPerson.acumen.totalAcumenScore}</p>
                              <p className="text-xs text-gray-500 mt-1">{language === 'es' ? 'Puntuación Total' : 'Total Score'}</p>
                            </div>
                          </div>

                          {/* Factores */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-white rounded-xl shadow-sm">
                              <h4 className="font-semibold text-gray-900 mb-4">{language === 'es' ? 'Factores Externos' : 'External Factors'}</h4>
                              <div className="space-y-3">
                                {[
                                  { key: 'understandingOthersClarity', label: language === 'es' ? '🔍 Comprensión de Otros' : '🔍 Understanding Others', color: 'bg-blue-500' },
                                  { key: 'practicalThinkingClarity', label: language === 'es' ? '🛠️ Pensamiento Práctico' : '🛠️ Practical Thinking', color: 'bg-blue-500' },
                                  { key: 'systemsJudgmentClarity', label: language === 'es' ? '⚙️ Juicio de Sistemas' : '⚙️ Systems Judgment', color: 'bg-blue-500' },
                                ].map(({ key, label, color }) => {
                                  const value = selectedPerson.acumen![key as keyof typeof selectedPerson.acumen] as number;
                                  return (
                                    <div key={key}>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-700">{label}</span>
                                        <span className="font-bold text-blue-600">{value}</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className={`${color} h-2 rounded-full`} style={{ width: `${value * 10}%` }}></div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl shadow-sm">
                              <h4 className="font-semibold text-gray-900 mb-4">{language === 'es' ? 'Factores Internos' : 'Internal Factors'}</h4>
                              <div className="space-y-3">
                                {[
                                  { key: 'senseOfSelfClarity', label: language === 'es' ? '🪞 Sentido de Sí Mismo' : '🪞 Sense of Self', color: 'bg-purple-500' },
                                  { key: 'roleAwarenessClarity', label: language === 'es' ? '🎭 Conciencia del Rol' : '🎭 Role Awareness', color: 'bg-purple-500' },
                                  { key: 'selfDirectionClarity', label: language === 'es' ? '🧭 Auto-dirección' : '🧭 Self-Direction', color: 'bg-purple-500' },
                                ].map(({ key, label, color }) => {
                                  const value = selectedPerson.acumen![key as keyof typeof selectedPerson.acumen] as number;
                                  return (
                                    <div key={key}>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-700">{label}</span>
                                        <span className="font-bold text-purple-600">{value}</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className={`${color} h-2 rounded-full`} style={{ width: `${value * 10}%` }}></div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Nivel y Perfil */}
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                              <h5 className="font-semibold text-amber-900 mb-1">{language === 'es' ? 'Nivel Acumen' : 'Acumen Level'}</h5>
                              <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                                {selectedPerson.acumen.acumenLevel?.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                              <h5 className="font-semibold text-orange-900 mb-1">{language === 'es' ? 'Perfil' : 'Profile'}</h5>
                              <p className="text-sm text-orange-800">{selectedPerson.acumen.acumenProfile}</p>
                            </div>
                          </div>

                          {/* Fortalezas y Áreas de desarrollo */}
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            {selectedPerson.acumen.primaryStrengths && selectedPerson.acumen.primaryStrengths.length > 0 && (
                              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" />
                                  {language === 'es' ? 'Fortalezas' : 'Strengths'}
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {selectedPerson.acumen.primaryStrengths.map((s, i) => (
                                    <Badge key={i} className="bg-green-100 text-green-800 border-green-300">
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedPerson.acumen.developmentAreas && selectedPerson.acumen.developmentAreas.length > 0 && (
                              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                <h5 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4" />
                                  {language === 'es' ? 'Áreas de Desarrollo' : 'Development Areas'}
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {selectedPerson.acumen.developmentAreas.map((s, i) => (
                                    <Badge key={i} className="bg-amber-100 text-amber-800 border-amber-300">
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Fecha de evaluación */}
                          {selectedPerson.acumenDate && (
                            <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(selectedPerson.acumenDate).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                {/* Tab: Valores */}
                <TabsContent value="values" className="mt-6">
                  {selectedPerson.values && (
                    <div className="space-y-6">
                      {/* Card principal con dimensiones de valores */}
                      <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-0 shadow-lg overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white pb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 rounded-xl">
                              <Scale className="w-6 h-6" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{language === 'es' ? 'Valores e Integridad' : 'Values & Integrity'}</CardTitle>
                              <CardDescription className="text-violet-100">
                                {language === 'es' ? 'Análisis de dimensiones de valores personales' : 'Personal values dimensions analysis'}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          {/* Métricas principales */}
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-3xl font-bold text-violet-600">{selectedPerson.values.integrityScore}</p>
                              <p className="text-xs text-gray-500 mt-1">{language === 'es' ? 'Integridad' : 'Integrity'}</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-3xl font-bold text-purple-600">{selectedPerson.values.consistencyScore}</p>
                              <p className="text-xs text-gray-500 mt-1">{language === 'es' ? 'Consistencia' : 'Consistency'}</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-3xl font-bold text-pink-600">{selectedPerson.values.authenticityScore}</p>
                              <p className="text-xs text-gray-500 mt-1">{language === 'es' ? 'Autenticidad' : 'Authenticity'}</p>
                            </div>
                          </div>
                          
                          {/* Dimensiones de valores */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">{language === 'es' ? 'Dimensiones de Valores' : 'Value Dimensions'}</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {[
                                { key: 'teoricoPercentile', label: language === 'es' ? '📚 Teórico' : '📚 Theoretical', color: 'bg-blue-500', desc: language === 'es' ? 'Búsqueda de conocimiento' : 'Knowledge pursuit' },
                                { key: 'utilitarioPercentile', label: language === 'es' ? '💰 Utilitario' : '💰 Utilitarian', color: 'bg-green-500', desc: language === 'es' ? 'Retorno de inversión' : 'Return on investment' },
                                { key: 'esteticoPercentile', label: language === 'es' ? '🎨 Estético' : '🎨 Aesthetic', color: 'bg-pink-500', desc: language === 'es' ? 'Armonía y belleza' : 'Harmony and beauty' },
                                { key: 'socialPercentile', label: language === 'es' ? '🤝 Social' : '🤝 Social', color: 'bg-orange-500', desc: language === 'es' ? 'Ayudar a otros' : 'Helping others' },
                                { key: 'individualistaPercentile', label: language === 'es' ? '🏆 Individualista' : '🏆 Individualistic', color: 'bg-purple-500', desc: language === 'es' ? 'Liderazgo personal' : 'Personal leadership' },
                                { key: 'tradicionalPercentile', label: language === 'es' ? '⚖️ Tradicional' : '⚖️ Traditional', color: 'bg-slate-500', desc: language === 'es' ? 'Orden y estructura' : 'Order and structure' },
                              ].map(({ key, label, color, desc }) => {
                                const value = selectedPerson.values![key as keyof typeof selectedPerson.values] as number;
                                return (
                                  <div key={key} className="p-4 bg-white rounded-xl shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium text-gray-700">{label}</span>
                                      <span className="text-lg font-bold text-gray-900">{value}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                      <div
                                        className={`${color} h-2.5 rounded-full transition-all duration-500`}
                                        style={{ width: `${value}%` }}
                                      />
                                    </div>
                                    <p className="text-xs text-gray-500">{desc}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Perfil de valores */}
                          {selectedPerson.values.valuesProfile && (
                            <div className="mt-6 p-4 bg-white rounded-xl shadow-sm">
                              <h4 className="font-semibold text-gray-900 mb-2">{language === 'es' ? 'Perfil de Valores' : 'Values Profile'}</h4>
                              <p className="text-gray-700">{selectedPerson.values.valuesProfile}</p>
                            </div>
                          )}
                          
                          {/* Valores primarios y áreas de desarrollo */}
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            {selectedPerson.values.primaryValues && selectedPerson.values.primaryValues.length > 0 && (
                              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" />
                                  {language === 'es' ? 'Valores Primarios' : 'Primary Values'}
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {selectedPerson.values.primaryValues.map((v, i) => (
                                    <Badge key={i} className="bg-green-100 text-green-800 border-green-300">
                                      {v}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedPerson.values.developmentAreas && selectedPerson.values.developmentAreas.length > 0 && (
                              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                <h5 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4" />
                                  {language === 'es' ? 'Áreas de Desarrollo' : 'Development Areas'}
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {selectedPerson.values.developmentAreas.map((v, i) => (
                                    <Badge key={i} className="bg-amber-100 text-amber-800 border-amber-300">
                                      {v}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Fecha de evaluación */}
                          {selectedPerson.valuesDate && (
                            <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(selectedPerson.valuesDate).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                {/* Tab: Estrés */}
                <TabsContent value="stress" className="mt-6">
                  {selectedPerson.stress && (
                    <div className="space-y-6">
                      {/* Card principal con dimensiones de estrés */}
                      <Card className="bg-gradient-to-br from-orange-50 to-rose-50 border-0 shadow-lg overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-orange-500 to-rose-500 text-white pb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 rounded-xl">
                              <Activity className="w-6 h-6" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{language === 'es' ? 'Estrés y Resiliencia' : 'Stress & Resilience'}</CardTitle>
                              <CardDescription className="text-orange-100">
                                {language === 'es' ? 'Análisis de capacidad de manejo del estrés y resiliencia' : 'Stress management and resilience capacity analysis'}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          {/* Métricas principales */}
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-3xl font-bold text-green-600">{selectedPerson.stress.indiceResiliencia}</p>
                              <p className="text-xs text-gray-500 mt-1">{language === 'es' ? 'Índice Resiliencia' : 'Resilience Index'}</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-3xl font-bold text-orange-600">{selectedPerson.stress.nivelEstresGeneral}</p>
                              <p className="text-xs text-gray-500 mt-1">{language === 'es' ? 'Nivel Estrés' : 'Stress Level'}</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-3xl font-bold text-blue-600">{selectedPerson.stress.capacidadAdaptacion}</p>
                              <p className="text-xs text-gray-500 mt-1">{language === 'es' ? 'Adaptación' : 'Adaptation'}</p>
                            </div>
                          </div>
                          
                          {/* Dimensiones de estrés */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">{language === 'es' ? '5 Dimensiones de Análisis' : '5 Analysis Dimensions'}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { key: 'estresLaboralScore', label: language === 'es' ? '💼 Estrés Laboral' : '💼 Work Stress', color: 'bg-red-500', desc: language === 'es' ? 'Presión del trabajo (invertido)' : 'Work pressure (inverted)', inverted: true },
                                { key: 'capacidadRecuperacionScore', label: language === 'es' ? '🔄 Capacidad de Recuperación' : '🔄 Recovery Capacity', color: 'bg-green-500', desc: language === 'es' ? 'Habilidad para recuperarse' : 'Ability to recover', inverted: false },
                                { key: 'manejoEmocionalScore', label: language === 'es' ? '💭 Manejo Emocional' : '💭 Emotional Management', color: 'bg-blue-500', desc: language === 'es' ? 'Control de emociones bajo presión' : 'Emotion control under pressure', inverted: false },
                                { key: 'equilibrioVidaScore', label: language === 'es' ? '⚖️ Equilibrio Vida-Trabajo' : '⚖️ Work-Life Balance', color: 'bg-purple-500', desc: language === 'es' ? 'Balance personal y profesional' : 'Personal and professional balance', inverted: false },
                                { key: 'resilienciaScore', label: language === 'es' ? '🛡️ Resiliencia' : '🛡️ Resilience', color: 'bg-teal-500', desc: language === 'es' ? 'Fortaleza ante adversidad' : 'Strength against adversity', inverted: false },
                              ].map(({ key, label, color, desc, inverted }) => {
                                const value = selectedPerson.stress![key as keyof typeof selectedPerson.stress] as number;
                                return (
                                  <div key={key} className="p-4 bg-white rounded-xl shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium text-gray-700">{label}</span>
                                      <span className="text-lg font-bold text-gray-900">{value}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                      <div
                                        className={`${inverted ? 'bg-red-500' : color} h-2.5 rounded-full transition-all duration-500`}
                                        style={{ width: `${value}%` }}
                                      />
                                    </div>
                                    <p className="text-xs text-gray-500">{desc}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Perfil de estrés */}
                          {selectedPerson.stress.stressProfile && (
                            <div className="mt-6 p-4 bg-white rounded-xl shadow-sm">
                              <h4 className="font-semibold text-gray-900 mb-2">{language === 'es' ? 'Perfil de Estrés' : 'Stress Profile'}</h4>
                              <p className="text-gray-700">{selectedPerson.stress.stressProfile}</p>
                            </div>
                          )}
                          
                          {/* Niveles */}
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                              <h5 className="font-semibold text-green-900 mb-1">{language === 'es' ? 'Nivel de Resiliencia' : 'Resilience Level'}</h5>
                              <Badge className="bg-green-100 text-green-800 border-green-300">
                                {selectedPerson.stress.resilienceLevel}
                              </Badge>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                              <h5 className="font-semibold text-orange-900 mb-1">{language === 'es' ? 'Nivel de Estrés' : 'Stress Level'}</h5>
                              <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                                {selectedPerson.stress.stressLevel}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Factores protectores y de riesgo */}
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            {selectedPerson.stress.protectiveFactors && selectedPerson.stress.protectiveFactors.length > 0 && (
                              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" />
                                  {language === 'es' ? 'Factores Protectores' : 'Protective Factors'}
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {selectedPerson.stress.protectiveFactors.map((f, i) => (
                                    <Badge key={i} className="bg-green-100 text-green-800 border-green-300">
                                      {f}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedPerson.stress.riskFactors && selectedPerson.stress.riskFactors.length > 0 && (
                              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4" />
                                  {language === 'es' ? 'Factores de Riesgo' : 'Risk Factors'}
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {selectedPerson.stress.riskFactors.map((f, i) => (
                                    <Badge key={i} className="bg-red-100 text-red-800 border-red-300">
                                      {f}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Fortalezas y áreas de desarrollo */}
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            {selectedPerson.stress.primaryStrengths && selectedPerson.stress.primaryStrengths.length > 0 && (
                              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" />
                                  {language === 'es' ? 'Fortalezas' : 'Strengths'}
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {selectedPerson.stress.primaryStrengths.map((s, i) => (
                                    <Badge key={i} className="bg-blue-100 text-blue-800 border-blue-300">
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedPerson.stress.developmentAreas && selectedPerson.stress.developmentAreas.length > 0 && (
                              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                <h5 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4" />
                                  {language === 'es' ? 'Áreas de Desarrollo' : 'Development Areas'}
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {selectedPerson.stress.developmentAreas.map((d, i) => (
                                    <Badge key={i} className="bg-amber-100 text-amber-800 border-amber-300">
                                      {d}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Fecha de evaluación */}
                          {selectedPerson.stressDate && (
                            <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(selectedPerson.stressDate).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                {/* Tab: Técnica */}
                <TabsContent value="technical" className="mt-6">
                  {selectedPerson.technical && (
                    <div className="space-y-6">
                      {/* Card Principal de Resultados Técnicos */}
                      <Card className="border-0 shadow-xl bg-gradient-to-br from-sky-50 via-white to-cyan-50">
                        <CardHeader className="border-b bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-t-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-white/20 rounded-xl">
                                <FileCode className="w-8 h-8" />
                              </div>
                              <div>
                                <CardTitle className="text-2xl">{language === 'es' ? 'Evaluación Técnica' : 'Technical Evaluation'}</CardTitle>
                                <p className="text-sky-100 text-sm">{language === 'es' ? 'Análisis de competencias técnicas por cargo' : 'Technical competencies analysis by position'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-4xl font-bold">{Math.round(selectedPerson.technical.totalScore)}%</p>
                              <Badge className={`${
                                selectedPerson.technical.totalScore >= 80 ? 'bg-green-500' :
                                selectedPerson.technical.totalScore >= 60 ? 'bg-blue-500' :
                                selectedPerson.technical.totalScore >= 40 ? 'bg-yellow-500' :
                                'bg-red-500'
                              } text-white`}>
                                {selectedPerson.technical.performanceLevel}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Estadísticas Generales */}
                            <div className="bg-white rounded-xl p-4 border border-sky-100 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="font-semibold text-gray-700">{language === 'es' ? 'Respuestas Correctas' : 'Correct Answers'}</span>
                              </div>
                              <p className="text-3xl font-bold text-sky-600">
                                {selectedPerson.technical.correctAnswers}/{selectedPerson.technical.totalQuestions}
                              </p>
                              <p className="text-sm text-gray-500">
                                {language === 'es' ? 'preguntas acertadas' : 'questions answered correctly'}
                              </p>
                            </div>

                            {/* Tiempo Promedio */}
                            {selectedPerson.technical.averageResponseTime && (
                              <div className="bg-white rounded-xl p-4 border border-sky-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                  <Clock className="w-5 h-5 text-sky-500" />
                                  <span className="font-semibold text-gray-700">{language === 'es' ? 'Tiempo Promedio' : 'Average Time'}</span>
                                </div>
                                <p className="text-3xl font-bold text-cyan-600">
                                  {Math.round(selectedPerson.technical.averageResponseTime)}s
                                </p>
                                <p className="text-sm text-gray-500">
                                  {language === 'es' ? 'por pregunta' : 'per question'}
                                </p>
                              </div>
                            )}

                            {/* Total Time */}
                            <div className="bg-white rounded-xl p-4 border border-sky-100 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <Briefcase className="w-5 h-5 text-indigo-500" />
                                <span className="font-semibold text-gray-700">{language === 'es' ? 'Cargo Evaluado' : 'Position Evaluated'}</span>
                              </div>
                              <p className="text-lg font-bold text-indigo-600">
                                ID: {selectedPerson.technical.jobPositionId || 'N/A'}
                              </p>
                            </div>
                          </div>

                          {/* Rendimiento por Dificultad */}
                          <div className="mt-6">
                            <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                              <Target className="w-5 h-5 text-sky-600" />
                              {language === 'es' ? 'Rendimiento por Nivel de Dificultad' : 'Performance by Difficulty Level'}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Fácil */}
                              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-green-700">🟢 {language === 'es' ? 'Fácil' : 'Easy'}</span>
                                  <span className="text-lg font-bold text-green-600">{Math.round(selectedPerson.technical.easyScore || 0)}%</span>
                                </div>
                                <div className="w-full bg-green-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${selectedPerson.technical.easyScore || 0}%` }}
                                  />
                                </div>
                                <p className="text-xs text-green-600 mt-1">
                                  {selectedPerson.technical.easyCorrect || 0}/{selectedPerson.technical.easyTotal || 0} {language === 'es' ? 'correctas' : 'correct'}
                                </p>
                              </div>

                              {/* Media */}
                              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-yellow-700">🟡 {language === 'es' ? 'Media' : 'Medium'}</span>
                                  <span className="text-lg font-bold text-yellow-600">{Math.round(selectedPerson.technical.mediumScore || 0)}%</span>
                                </div>
                                <div className="w-full bg-yellow-200 rounded-full h-2">
                                  <div 
                                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${selectedPerson.technical.mediumScore || 0}%` }}
                                  />
                                </div>
                                <p className="text-xs text-yellow-600 mt-1">
                                  {selectedPerson.technical.mediumCorrect || 0}/{selectedPerson.technical.mediumTotal || 0} {language === 'es' ? 'correctas' : 'correct'}
                                </p>
                              </div>

                              {/* Difícil */}
                              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-red-700">🔴 {language === 'es' ? 'Difícil' : 'Hard'}</span>
                                  <span className="text-lg font-bold text-red-600">{Math.round(selectedPerson.technical.hardScore || 0)}%</span>
                                </div>
                                <div className="w-full bg-red-200 rounded-full h-2">
                                  <div 
                                    className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${selectedPerson.technical.hardScore || 0}%` }}
                                  />
                                </div>
                                <p className="text-xs text-red-600 mt-1">
                                  {selectedPerson.technical.hardCorrect || 0}/{selectedPerson.technical.hardTotal || 0} {language === 'es' ? 'correctas' : 'correct'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Fortalezas y Debilidades */}
                          {((selectedPerson.technical.strengths && selectedPerson.technical.strengths.length > 0) || (selectedPerson.technical.weaknesses && selectedPerson.technical.weaknesses.length > 0)) && (
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedPerson.technical.strengths && selectedPerson.technical.strengths.length > 0 && (
                                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                  <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    {language === 'es' ? 'Fortalezas' : 'Strengths'}
                                  </h5>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedPerson.technical.strengths.map((s: string, i: number) => (
                                      <Badge key={i} className="bg-green-100 text-green-700 border-green-200">
                                        {s}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {selectedPerson.technical.weaknesses && selectedPerson.technical.weaknesses.length > 0 && (
                                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                  <h5 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {language === 'es' ? 'Áreas de Mejora' : 'Areas for Improvement'}
                                  </h5>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedPerson.technical.weaknesses.map((w: string, i: number) => (
                                      <Badge key={i} className="bg-red-100 text-red-700 border-red-200">
                                        {w}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Puntuación por Categorías */}
                          {selectedPerson.technical.categoryScores && Object.keys(selectedPerson.technical.categoryScores).length > 0 && (
                            <div className="mt-6">
                              <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <Code className="w-5 h-5 text-sky-600" />
                                {language === 'es' ? 'Rendimiento por Categoría' : 'Performance by Category'}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.entries(selectedPerson.technical.categoryScores).map(([category, score]: [string, any]) => (
                                  <div key={category} className="bg-white rounded-lg p-3 border border-sky-100">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-700 truncate">{category}</span>
                                      <span className={`text-sm font-bold ${
                                        score >= 80 ? 'text-green-600' :
                                        score >= 60 ? 'text-blue-600' :
                                        score >= 40 ? 'text-yellow-600' :
                                        'text-red-600'
                                      }`}>{Math.round(score)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className={`h-1.5 rounded-full transition-all duration-500 ${
                                          score >= 80 ? 'bg-green-500' :
                                          score >= 60 ? 'bg-blue-500' :
                                          score >= 40 ? 'bg-yellow-500' :
                                          'bg-red-500'
                                        }`}
                                        style={{ width: `${score}%` }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                {/* Tab: Integrado */}
                <TabsContent value="integrated" className="mt-6">
                  {selectedPerson.hasComplete && selectedPerson.disc && selectedPerson.drivingForces && (
                    <div>
                      {/* Botón de imprimir */}
                      <div className="flex justify-end mb-4">
                        <Button
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            if (!printWindow) return;
                            
                            // Generate analysis data
                            const discStyle = selectedPerson.disc?.primaryStyle || 'D';
                            const discStyleDescriptions: Record<string, { name: string; behavioral: string }> = {
                              D: { name: 'Dominante', behavioral: 'Orientado a resultados, directo, decisivo y competitivo' },
                              I: { name: 'Influyente', behavioral: 'Entusiasta, optimista, colaborativo y expresivo' },
                              S: { name: 'Estable', behavioral: 'Paciente, fiable, cooperador y orientado al equipo' },
                              C: { name: 'Concienzudo', behavioral: 'Analítico, preciso, sistemático y orientado a la calidad' }
                            };
                            const motivatorDescriptions: Record<string, { name: string; drive: string }> = {
                              INTELECTUAL: { name: 'Intelectual', drive: 'Impulsado por el conocimiento y aprendizaje continuo' },
                              INSTINTIVO: { name: 'Instintivo', drive: 'Guiado por experiencia e intuición práctica' },
                              PRACTICO: { name: 'Práctico', drive: 'Enfocado en eficiencia y resultados tangibles' },
                              ALTRUISTA: { name: 'Altruista', drive: 'Motivado por contribuir sin esperar recompensa' },
                              ARMONIOSO: { name: 'Armonioso', drive: 'Busca equilibrio y experiencias positivas' },
                              OBJETIVO: { name: 'Objetivo', drive: 'Orientado a funcionalidad y objetividad' },
                              BENEVOLO: { name: 'Benévolo', drive: 'Impulsado por ayudar a otros desinteresadamente' },
                              INTENCIONAL: { name: 'Intencional', drive: 'Ayuda estratégica con propósitos claros' },
                              DOMINANTE: { name: 'Dominante', drive: 'Busca reconocimiento, estatus y control' },
                              COLABORATIVO: { name: 'Colaborativo', drive: 'Prefiere roles de apoyo sin buscar reconocimiento' },
                              ESTRUCTURADO: { name: 'Estructurado', drive: 'Valora métodos probados y tradición' },
                              RECEPTIVO: { name: 'Receptivo', drive: 'Abierto a nuevas ideas e innovación' },
                            };
                            const styleInfo = discStyleDescriptions[discStyle];
                            const df = selectedPerson.drivingForces;
                            const motivators = df ? [
                              { key: 'INTELECTUAL', value: df.intelectualPercentile },
                              { key: 'INSTINTIVO', value: df.instintivoPercentile },
                              { key: 'PRACTICO', value: df.practicoPercentile },
                              { key: 'ALTRUISTA', value: df.altruistaPercentile },
                              { key: 'ARMONIOSO', value: df.armoniosoPercentile },
                              { key: 'OBJETIVO', value: df.objetivoPercentile },
                              { key: 'BENEVOLO', value: df.benevoloPercentile },
                              { key: 'INTENCIONAL', value: df.intencionalPercentile },
                              { key: 'DOMINANTE', value: df.dominantePercentile },
                              { key: 'COLABORATIVO', value: df.colaborativoPercentile },
                              { key: 'ESTRUCTURADO', value: df.estructuradoPercentile },
                              { key: 'RECEPTIVO', value: df.receptivoPercentile },
                            ].sort((a, b) => b.value - a.value) : [];
                            const topMotivators = motivators.slice(0, 3);
                            const topMotivator = topMotivators[0]?.key || 'PRACTICO';
                            
                            const profileSummary = selectedPerson.name + ' presenta un perfil conductual ' + (styleInfo?.name || 'único') + ', caracterizado por ser ' + (styleInfo?.behavioral || 'versátil') + '. Su principal motivador es ' + (motivatorDescriptions[topMotivator]?.name || 'Práctico') + ', lo que significa que está ' + (motivatorDescriptions[topMotivator]?.drive || 'enfocado en resultados') + '.';
                            
                            const workStyles: Record<string, string> = {
                              D: 'Prefiere trabajar de forma independiente con autonomía y control sobre sus proyectos. Busca resultados rápidos y toma decisiones con determinación.',
                              I: 'Florece en ambientes colaborativos y dinámicos. Aporta energía positiva al equipo y busca variedad en sus tareas.',
                              S: 'Trabaja mejor en entornos estables y predecibles. Valora la armonía del equipo y prefiere procesos bien establecidos.',
                              C: 'Se destaca en trabajo que requiere precisión y análisis detallado. Prefiere tener información completa antes de actuar.'
                            };
                            const commStyles: Record<string, string> = {
                              D: 'Comunicación directa, concisa y orientada a resultados. Prefiere ir al punto rápidamente sin rodeos.',
                              I: 'Comunicación expresiva, entusiasta y personal. Disfruta las interacciones sociales y construir relaciones.',
                              S: 'Comunicación calmada, empática y considerada. Escucha activamente y busca consenso.',
                              C: 'Comunicación precisa, lógica y basada en datos. Prefiere información detallada y estructurada.'
                            };
                            const leaderStyles: Record<string, string> = {
                              D: 'Liderazgo orientado a resultados con enfoque en objetivos claros. Toma decisiones rápidas y asume responsabilidad.',
                              I: 'Liderazgo inspiracional que motiva a través del entusiasmo. Excelente para construir cultura de equipo positiva.',
                              S: 'Liderazgo de apoyo que prioriza el bienestar del equipo. Crea ambientes de trabajo estables y colaborativos.',
                              C: 'Liderazgo basado en expertise y conocimiento. Establece estándares altos de calidad y precisión.'
                            };
                            const teamRoles: Record<string, string> = {
                              D: 'Impulsor del equipo que mantiene el enfoque en metas. Excelente para liderar iniciativas y superar obstáculos.',
                              I: 'Animador del equipo que fomenta la colaboración. Aporta creatividad y mantiene alta la moral del grupo.',
                              S: 'Mediador del equipo que mantiene la armonía. Confiable para tareas consistentes y apoyo a compañeros.',
                              C: 'Analista del equipo que asegura la calidad. Valioso para revisar detalles y prevenir errores.'
                            };
                            const stressMgmt: Record<string, string> = {
                              D: 'Bajo estrés puede volverse impaciente o autoritario. Se beneficia de delegar y confiar más en otros.',
                              I: 'Bajo estrés puede perder enfoque o evitar conflictos. Necesita estructura y tiempo para reflexionar.',
                              S: 'Bajo estrés puede resistir el cambio o sobre-comprometerse. Requiere límites claros y tiempo de adaptación.',
                              C: 'Bajo estrés puede volverse crítico o perfeccionista. Se beneficia de aceptar que "suficientemente bueno" a veces basta.'
                            };

                            // Build HTML parts using arrays to avoid complex template nesting
                            const htmlParts: string[] = [];
                            
                            // Header and styles
                            htmlParts.push('<!DOCTYPE html><html><head>');
                            htmlParts.push('<title>Análisis Integrado Reclu - ' + selectedPerson.name + '</title>');
                            htmlParts.push('<style>');
                            htmlParts.push("@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');");
                            htmlParts.push('* { margin: 0; padding: 0; box-sizing: border-box; }');
                            htmlParts.push("body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #faf5ff 100%); color: #1f2937; min-height: 100vh; padding: 0; }");
                            htmlParts.push('.reclu-header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%); color: white; padding: 32px 40px; margin-bottom: 32px; }');
                            htmlParts.push('.header-content { max-width: 1200px; margin: 0 auto; }');
                            htmlParts.push('.logo-section { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }');
                            htmlParts.push('.logo-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }');
                            htmlParts.push('.logo-text { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }');
                            htmlParts.push('.logo-subtext { font-size: 14px; opacity: 0.9; margin-top: 2px; }');
                            htmlParts.push('.person-info { display: flex; align-items: center; gap: 16px; padding: 20px; background: rgba(255,255,255,0.15); border-radius: 16px; }');
                            htmlParts.push('.person-avatar { width: 64px; height: 64px; background: rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; }');
                            htmlParts.push('.person-details h2 { font-size: 22px; font-weight: 600; margin-bottom: 4px; }');
                            htmlParts.push('.person-details p { font-size: 14px; opacity: 0.9; }');
                            htmlParts.push('.report-badge { margin-left: auto; background: rgba(255,255,255,0.25); padding: 8px 16px; border-radius: 9999px; font-size: 13px; font-weight: 600; }');
                            htmlParts.push('.main-content { max-width: 1200px; margin: 0 auto; padding: 0 40px 40px; }');
                            htmlParts.push('.analysis-card { background: linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #faf5ff 100%); border: 1px solid #e0e7ff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(79, 70, 229, 0.1); margin-bottom: 24px; }');
                            htmlParts.push('.card-header { padding: 20px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #e5e7eb; background: rgba(255,255,255,0.8); }');
                            htmlParts.push('.card-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }');
                            htmlParts.push('.card-icon.indigo { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; }');
                            htmlParts.push('.card-icon.rose { background: linear-gradient(135deg, #f43f5e, #ec4899); color: white; }');
                            htmlParts.push('.card-icon.teal { background: linear-gradient(135deg, #14b8a6, #06b6d4); color: white; }');
                            htmlParts.push('.card-icon.amber { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; }');
                            htmlParts.push('.card-icon.violet { background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; }');
                            htmlParts.push('.card-icon.orange { background: linear-gradient(135deg, #f97316, #ef4444); color: white; }');
                            htmlParts.push('.card-title-text { font-size: 18px; font-weight: 600; color: #1f2937; }');
                            htmlParts.push('.card-subtitle { font-size: 13px; color: #6b7280; }');
                            htmlParts.push('.card-content { padding: 24px; }');
                            htmlParts.push('.section-box { padding: 20px; border-radius: 16px; margin-bottom: 16px; border: 1px solid; }');
                            htmlParts.push('.section-box.blue { background: linear-gradient(135deg, #eff6ff, #dbeafe); border-color: #bfdbfe; }');
                            htmlParts.push('.section-box.green { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-color: #bbf7d0; }');
                            htmlParts.push('.section-box.yellow { background: linear-gradient(135deg, #fefce8, #fef9c3); border-color: #fef08a; }');
                            htmlParts.push('.section-box.purple { background: linear-gradient(135deg, #faf5ff, #f3e8ff); border-color: #e9d5ff; }');
                            htmlParts.push('.section-box.amber { background: linear-gradient(135deg, #fffbeb, #fef3c7); border-color: #fde68a; }');
                            htmlParts.push('.section-box.red { background: linear-gradient(135deg, #fef2f2, #fee2e2); border-color: #fecaca; }');
                            htmlParts.push('.section-box.rose { background: linear-gradient(135deg, #fff1f2, #ffe4e6); border-color: #fecdd3; }');
                            htmlParts.push('.section-box.teal { background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border-color: #99f6e4; }');
                            htmlParts.push('.section-box.violet { background: linear-gradient(135deg, #f5f3ff, #ede9fe); border-color: #ddd6fe; }');
                            htmlParts.push('.section-box.orange { background: linear-gradient(135deg, #fff7ed, #ffedd5); border-color: #fed7aa; }');
                            htmlParts.push('.section-box.indigo-full { background: linear-gradient(135deg, #e0e7ff, #c7d2fe, #fce7f3); border-color: #a5b4fc; }');
                            htmlParts.push('.section-title { font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }');
                            htmlParts.push('.section-title.blue { color: #1e40af; } .section-title.green { color: #166534; } .section-title.yellow { color: #854d0e; } .section-title.purple { color: #6b21a8; } .section-title.amber { color: #92400e; } .section-title.red { color: #b91c1c; } .section-title.rose { color: #9f1239; } .section-title.teal { color: #0f766e; } .section-title.violet { color: #5b21b6; } .section-title.orange { color: #c2410c; } .section-title.indigo { color: #3730a3; }');
                            htmlParts.push('.section-text { font-size: 14px; line-height: 1.6; color: #4b5563; }');
                            htmlParts.push('.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }');
                            htmlParts.push('.grid-7 { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; margin-bottom: 20px; }');
                            htmlParts.push('.metric-card { text-align: center; padding: 16px 12px; background: rgba(255,255,255,0.8); border-radius: 12px; border: 1px solid #e5e7eb; }');
                            htmlParts.push('.metric-icon { font-size: 20px; margin-bottom: 8px; }');
                            htmlParts.push('.metric-value { font-size: 22px; font-weight: 700; margin-bottom: 4px; }');
                            htmlParts.push('.metric-value.indigo { color: #4f46e5; } .metric-value.purple { color: #7c3aed; } .metric-value.rose { color: #e11d48; } .metric-value.teal { color: #0d9488; } .metric-value.amber { color: #d97706; } .metric-value.violet { color: #8b5cf6; } .metric-value.orange { color: #ea580c; }');
                            htmlParts.push('.metric-label { font-size: 11px; color: #6b7280; font-weight: 500; }');
                            htmlParts.push('.score-row { display: flex; gap: 16px; margin-bottom: 16px; }');
                            htmlParts.push('.score-card { text-align: center; padding: 16px 20px; background: white; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }');
                            htmlParts.push('.score-value { font-size: 28px; font-weight: 700; }');
                            htmlParts.push('.score-label { font-size: 12px; color: #6b7280; margin-top: 4px; }');
                            htmlParts.push('.badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin: 3px; }');
                            htmlParts.push('.badge.indigo { background: #e0e7ff; color: #4338ca; } .badge.purple { background: #f3e8ff; color: #7c3aed; } .badge.rose { background: #ffe4e6; color: #be123c; } .badge.teal { background: #ccfbf1; color: #0d9488; } .badge.amber { background: #fef3c7; color: #d97706; } .badge.violet { background: #ede9fe; color: #7c3aed; } .badge.orange { background: #ffedd5; color: #ea580c; } .badge.green { background: #dcfce7; color: #16a34a; } .badge.outline { background: transparent; border: 1px solid currentColor; }');
                            htmlParts.push('.progress-container { margin-bottom: 12px; }');
                            htmlParts.push('.progress-header { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }');
                            htmlParts.push('.progress-label { color: #4b5563; }');
                            htmlParts.push('.progress-value { font-weight: 600; }');
                            htmlParts.push('.progress-bar { height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }');
                            htmlParts.push('.progress-fill { height: 100%; border-radius: 4px; }');
                            htmlParts.push('.progress-fill.indigo { background: linear-gradient(90deg, #4f46e5, #6366f1); } .progress-fill.purple { background: linear-gradient(90deg, #7c3aed, #a855f7); } .progress-fill.rose { background: linear-gradient(90deg, #f43f5e, #ec4899); } .progress-fill.pink { background: linear-gradient(90deg, #ec4899, #f472b6); } .progress-fill.teal { background: linear-gradient(90deg, #14b8a6, #2dd4bf); } .progress-fill.amber { background: linear-gradient(90deg, #f59e0b, #fbbf24); } .progress-fill.blue { background: linear-gradient(90deg, #3b82f6, #60a5fa); } .progress-fill.green { background: linear-gradient(90deg, #22c55e, #4ade80); } .progress-fill.orange { background: linear-gradient(90deg, #f97316, #fb923c); } .progress-fill.red { background: linear-gradient(90deg, #ef4444, #f87171); } .progress-fill.slate { background: linear-gradient(90deg, #64748b, #94a3b8); }');
                            htmlParts.push('.insights-list { list-style: none; padding: 0; }');
                            htmlParts.push('.insights-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #4b5563; margin-bottom: 10px; line-height: 1.5; }');
                            htmlParts.push('.insights-list li::before { content: "•"; color: #f59e0b; font-size: 18px; line-height: 1; }');
                            htmlParts.push('.executive-box { padding: 20px; background: rgba(255,255,255,0.6); border-radius: 16px; }');
                            htmlParts.push('.executive-text { font-size: 14px; line-height: 1.7; color: #374151; }');
                            htmlParts.push('.executive-text strong { color: #1f2937; }');
                            htmlParts.push('.reclu-footer { margin-top: 40px; padding: 24px 40px; background: linear-gradient(135deg, #1e1b4b, #312e81); color: white; text-align: center; }');
                            htmlParts.push('.footer-logo { font-size: 20px; font-weight: 700; margin-bottom: 8px; }');
                            htmlParts.push('.footer-text { font-size: 13px; opacity: 0.8; }');
                            htmlParts.push('.footer-date { font-size: 12px; opacity: 0.6; margin-top: 12px; }');
                            htmlParts.push('@media print { body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } .reclu-header, .reclu-footer, .analysis-card, .section-box, .badge, .progress-fill, .card-icon, .metric-card { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } .section-box, .analysis-card { page-break-inside: avoid; } @page { margin: 0.5cm; } }');
                            htmlParts.push('</style></head><body>');
                            
                            // Header
                            htmlParts.push('<div class="reclu-header"><div class="header-content">');
                            htmlParts.push('<div class="logo-section"><div class="logo-icon">💼</div><div><div class="logo-text">Reclu</div><div class="logo-subtext">Plataforma de Análisis de Talento</div></div></div>');
                            htmlParts.push('<div class="person-info"><div class="person-avatar">' + selectedPerson.name.charAt(0).toUpperCase() + '</div>');
                            htmlParts.push('<div class="person-details"><h2>' + selectedPerson.name + '</h2><p>' + selectedPerson.email + '</p></div>');
                            htmlParts.push('<div class="report-badge">✨ Análisis Integrado Completo</div></div></div></div>');
                            
                            // Main content
                            htmlParts.push('<div class="main-content">');
                            
                            // Card 1: Integrated Analysis
                            htmlParts.push('<div class="analysis-card"><div class="card-header"><div class="card-icon indigo">✨</div><div><div class="card-title-text">Análisis Integrado Reclu</div><div class="card-subtitle">Comportamiento + Motivadores</div></div></div><div class="card-content">');
                            
                            // Profile Summary
                            htmlParts.push('<div class="section-box indigo-full"><div class="section-title indigo">🧠 Resumen del Perfil</div><p class="section-text">' + profileSummary + '</p>');
                            htmlParts.push('<div style="margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px;"><span class="badge indigo">DISC: ' + (styleInfo?.name || discStyle) + '</span>');
                            topMotivators.slice(0, 2).forEach(m => {
                              htmlParts.push('<span class="badge purple">' + (motivatorDescriptions[m.key]?.name || m.key) + '</span>');
                            });
                            htmlParts.push('</div></div>');
                            
                            // Grid of 4 analysis boxes
                            htmlParts.push('<div class="grid-2">');
                            htmlParts.push('<div class="section-box blue"><div class="section-title blue">💼 Estilo de Trabajo</div><p class="section-text">' + (workStyles[discStyle] || workStyles['D']) + '</p></div>');
                            htmlParts.push('<div class="section-box green"><div class="section-title green">💬 Estilo de Comunicación</div><p class="section-text">' + (commStyles[discStyle] || commStyles['D']) + '</p></div>');
                            htmlParts.push('<div class="section-box yellow"><div class="section-title yellow">👥 Potencial de Liderazgo</div><p class="section-text">' + (leaderStyles[discStyle] || leaderStyles['D']) + '</p></div>');
                            htmlParts.push('<div class="section-box purple"><div class="section-title purple">❤️ Rol en Equipo</div><p class="section-text">' + (teamRoles[discStyle] || teamRoles['D']) + '</p></div>');
                            htmlParts.push('</div>');
                            
                            // Insights
                            htmlParts.push('<div class="section-box amber"><div class="section-title amber">✨ Insights Clave del Perfil Integrado</div><ul class="insights-list">');
                            htmlParts.push('<li>Combina el estilo ' + (styleInfo?.name || 'conductual') + ' con motivación ' + (motivatorDescriptions[topMotivator]?.name || 'práctica') + ' para resultados efectivos.</li>');
                            htmlParts.push('<li>Su segundo motivador ' + (motivatorDescriptions[topMotivators[1]?.key]?.name || '') + ' complementa su enfoque principal.</li>');
                            const roleDesc = discStyle === 'D' ? 'liderazgo y toma de decisiones' : discStyle === 'I' ? 'creatividad y relaciones' : discStyle === 'S' ? 'consistencia y apoyo' : 'análisis y precisión';
                            htmlParts.push('<li>Tiene potencial para roles que requieran ' + roleDesc + '.</li>');
                            htmlParts.push('</ul></div>');
                            
                            // Stress Management
                            htmlParts.push('<div class="section-box red"><div class="section-title red">🛡️ Manejo del Estrés y Áreas de Cuidado</div><p class="section-text">' + (stressMgmt[discStyle] || stressMgmt['D']) + '</p></div>');
                            
                            htmlParts.push('</div></div>');
                            
                            // EQ Card
                            if (selectedPerson.eq) {
                              const eq = selectedPerson.eq;
                              htmlParts.push('<div class="analysis-card"><div class="card-header"><div class="card-icon rose">❤️</div><div><div class="card-title-text">Inteligencia Emocional Integrada</div><div class="card-subtitle">EQ Assessment</div></div></div><div class="card-content"><div class="grid-2"><div>');
                              htmlParts.push('<div class="score-row"><div class="score-card" style="flex:1;"><div class="score-value" style="color:#e11d48;">' + eq.totalScore + '</div><div class="score-label">Puntuación Total EQ</div></div>');
                              htmlParts.push('<div class="score-card" style="flex:1;"><div class="score-value" style="color:#7c3aed; font-size:18px;">' + (eq.eqLevel?.replace('_', ' ') || 'N/A') + '</div><div class="score-label">' + (language === 'es' ? 'Nivel EQ' : 'EQ Level') + '</div></div></div>');
                              const eqDesc = eq.totalScore >= 70 ? 'Alto nivel de inteligencia emocional. Excelente capacidad para reconocer, entender y manejar emociones propias y de otros.' : eq.totalScore >= 50 ? 'Nivel moderado de inteligencia emocional. Buena base con oportunidades de desarrollo en áreas específicas.' : 'Área de desarrollo identificada. Se recomienda trabajar en habilidades de gestión emocional.';
                              htmlParts.push('<p class="section-text" style="margin-top:12px;">' + eqDesc + '</p></div><div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">Autoconciencia</span><span class="progress-value" style="color:#e11d48;">' + eq.autoconcienciaPercentile + '%</span></div><div class="progress-bar"><div class="progress-fill rose" style="width:' + eq.autoconcienciaPercentile + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">Autorregulación</span><span class="progress-value" style="color:#ec4899;">' + eq.autorregulacionPercentile + '%</span></div><div class="progress-bar"><div class="progress-fill pink" style="width:' + eq.autorregulacionPercentile + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">Motivación</span><span class="progress-value" style="color:#f59e0b;">' + eq.motivacionPercentile + '%</span></div><div class="progress-bar"><div class="progress-fill amber" style="width:' + eq.motivacionPercentile + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">Empatía</span><span class="progress-value" style="color:#8b5cf6;">' + eq.empatiaPercentile + '%</span></div><div class="progress-bar"><div class="progress-fill purple" style="width:' + eq.empatiaPercentile + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">Habilidades Sociales</span><span class="progress-value" style="color:#6366f1;">' + eq.habilidadesSocialesPercentile + '%</span></div><div class="progress-bar"><div class="progress-fill indigo" style="width:' + eq.habilidadesSocialesPercentile + '%"></div></div></div>');
                              htmlParts.push('</div></div></div></div>');
                            }
                            
                            // DNA Card
                            if (selectedPerson.dna) {
                              const dna = selectedPerson.dna;
                              htmlParts.push('<div class="analysis-card"><div class="card-header"><div class="card-icon teal">🧬</div><div><div class="card-title-text">Competencias DNA-25 Integradas</div><div class="card-subtitle">25 Competencias Clave</div></div></div><div class="card-content"><div class="grid-2"><div>');
                              htmlParts.push('<div class="score-row"><div class="score-card" style="flex:1;"><div class="score-value" style="color:#0d9488;">' + dna.totalDNAPercentile + '%</div><div class="score-label">Percentil Total DNA</div></div>');
                              htmlParts.push('<div class="score-card" style="flex:1;"><div class="score-value" style="color:#14b8a6; font-size:16px;">' + (dna.dnaLevel?.replace('_', ' ') || 'N/A') + '</div><div class="score-label">Nivel DNA</div></div></div>');
                              htmlParts.push('<p class="section-text" style="margin-top:12px;"><strong>Perfil:</strong> ' + (dna.dnaProfile || 'Perfil de competencias equilibrado') + '</p>');
                              if (dna.primaryStrengths?.length) {
                                htmlParts.push('<div style="margin-top:12px;"><p style="font-size:12px; color:#6b7280; margin-bottom:6px;">Top Competencias:</p><div style="display:flex; flex-wrap:wrap; gap:6px;">');
                                dna.primaryStrengths.slice(0, 3).forEach(s => { htmlParts.push('<span class="badge teal outline">' + s + '</span>'); });
                                htmlParts.push('</div></div>');
                              }
                              htmlParts.push('</div><div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">🧠 Pensamiento</span><span class="progress-value" style="color:#4f46e5;">' + dna.thinkingCategoryScore + '%</span></div><div class="progress-bar"><div class="progress-fill indigo" style="width:' + dna.thinkingCategoryScore + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">💬 Comunicación</span><span class="progress-value" style="color:#7c3aed;">' + dna.communicationCategoryScore + '%</span></div><div class="progress-bar"><div class="progress-fill purple" style="width:' + dna.communicationCategoryScore + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">👥 Liderazgo</span><span class="progress-value" style="color:#ec4899;">' + dna.leadershipCategoryScore + '%</span></div><div class="progress-bar"><div class="progress-fill pink" style="width:' + dna.leadershipCategoryScore + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">🎯 Resultados</span><span class="progress-value" style="color:#f59e0b;">' + dna.resultsCategoryScore + '%</span></div><div class="progress-bar"><div class="progress-fill amber" style="width:' + dna.resultsCategoryScore + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">🤝 Relaciones</span><span class="progress-value" style="color:#22c55e;">' + dna.relationshipCategoryScore + '%</span></div><div class="progress-bar"><div class="progress-fill green" style="width:' + dna.relationshipCategoryScore + '%"></div></div></div>');
                              htmlParts.push('</div></div></div></div>');
                            }
                            
                            // Acumen Card
                            if (selectedPerson.acumen) {
                              const ac = selectedPerson.acumen;
                              htmlParts.push('<div class="analysis-card"><div class="card-header"><div class="card-icon amber">🧭</div><div><div class="card-title-text">Capacidad Acumen Integrada</div><div class="card-subtitle">Índice de Claridad y Juicio</div></div></div><div class="card-content"><div class="grid-2"><div>');
                              htmlParts.push('<div class="score-row"><div class="score-card" style="flex:1;"><div class="score-value" style="color:#d97706;">' + (ac.totalAcumenScore?.toFixed(1) || '0') + '/10</div><div class="score-label">Puntuación Total Acumen</div></div>');
                              htmlParts.push('<div class="score-card" style="flex:1;"><div class="score-value" style="color:#f97316; font-size:16px;">' + (ac.acumenLevel?.replace('_', ' ') || 'N/A') + '</div><div class="score-label">Nivel Acumen</div></div></div>');
                              htmlParts.push('<p class="section-text" style="margin-top:12px;"><strong>Perfil:</strong> ' + (ac.acumenProfile || 'Capacidad de juicio balanceada') + '</p>');
                              if (ac.primaryStrengths?.length) {
                                htmlParts.push('<div style="margin-top:12px;"><p style="font-size:12px; color:#6b7280; margin-bottom:6px;">Fortalezas:</p><div style="display:flex; flex-wrap:wrap; gap:6px;">');
                                ac.primaryStrengths.slice(0, 3).forEach(s => { htmlParts.push('<span class="badge amber outline">' + s + '</span>'); });
                                htmlParts.push('</div></div>');
                              }
                              htmlParts.push('</div><div>');
                              htmlParts.push('<p style="font-size:12px; font-weight:500; color:#6b7280; margin-bottom:8px;">Claridad Externa</p>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">🔍 Comprensión Otros</span><span class="progress-value" style="color:#3b82f6;">' + ac.understandingOthersClarity + '/10</span></div><div class="progress-bar"><div class="progress-fill blue" style="width:' + ((ac.understandingOthersClarity || 0) * 10) + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">⚙️ Pensamiento Práctico</span><span class="progress-value" style="color:#3b82f6;">' + ac.practicalThinkingClarity + '/10</span></div><div class="progress-bar"><div class="progress-fill blue" style="width:' + ((ac.practicalThinkingClarity || 0) * 10) + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">📊 Juicio Sistemas</span><span class="progress-value" style="color:#3b82f6;">' + ac.systemsJudgmentClarity + '/10</span></div><div class="progress-bar"><div class="progress-fill blue" style="width:' + ((ac.systemsJudgmentClarity || 0) * 10) + '%"></div></div></div>');
                              htmlParts.push('<p style="font-size:12px; font-weight:500; color:#6b7280; margin:12px 0 8px;">Claridad Interna</p>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">🪞 Sentido de Sí</span><span class="progress-value" style="color:#7c3aed;">' + ac.senseOfSelfClarity + '/10</span></div><div class="progress-bar"><div class="progress-fill purple" style="width:' + ((ac.senseOfSelfClarity || 0) * 10) + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">🎭 Conciencia Rol</span><span class="progress-value" style="color:#7c3aed;">' + ac.roleAwarenessClarity + '/10</span></div><div class="progress-bar"><div class="progress-fill purple" style="width:' + ((ac.roleAwarenessClarity || 0) * 10) + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">🧭 Auto-dirección</span><span class="progress-value" style="color:#7c3aed;">' + ac.selfDirectionClarity + '/10</span></div><div class="progress-bar"><div class="progress-fill purple" style="width:' + ((ac.selfDirectionClarity || 0) * 10) + '%"></div></div></div>');
                              htmlParts.push('</div></div></div></div>');
                            }
                            
                            // Values Card
                            if (selectedPerson.values) {
                              const val = selectedPerson.values;
                              htmlParts.push('<div class="analysis-card"><div class="card-header"><div class="card-icon violet">⚖️</div><div><div class="card-title-text">Valores e Integridad Integrados</div><div class="card-subtitle">Alineación de Valores</div></div></div><div class="card-content"><div class="grid-2"><div>');
                              htmlParts.push('<div class="score-row"><div class="score-card" style="flex:1;"><div class="score-value" style="color:#7c3aed;">' + val.integrityScore + '</div><div class="score-label">Integridad</div></div>');
                              htmlParts.push('<div class="score-card" style="flex:1;"><div class="score-value" style="color:#8b5cf6;">' + val.consistencyScore + '</div><div class="score-label">Consistencia</div></div>');
                              htmlParts.push('<div class="score-card" style="flex:1;"><div class="score-value" style="color:#a855f7;">' + val.authenticityScore + '</div><div class="score-label">Autenticidad</div></div></div>');
                              if (val.primaryValues?.length) {
                                htmlParts.push('<div style="margin-top:16px;"><p style="font-size:12px; color:#6b7280; margin-bottom:6px;">Valores Primarios:</p><div style="display:flex; flex-wrap:wrap; gap:6px;">');
                                val.primaryValues.slice(0, 3).forEach(v => { htmlParts.push('<span class="badge violet outline">' + v + '</span>'); });
                                htmlParts.push('</div></div>');
                              }
                              htmlParts.push('</div><div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">📚 Teórico</span><span class="progress-value" style="color:#3b82f6;">' + val.teoricoPercentile + '%</span></div><div class="progress-bar"><div class="progress-fill blue" style="width:' + val.teoricoPercentile + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">💰 Utilitario</span><span class="progress-value" style="color:#22c55e;">' + val.utilitarioPercentile + '%</span></div><div class="progress-bar"><div class="progress-fill green" style="width:' + val.utilitarioPercentile + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">🎨 Estético</span><span class="progress-value" style="color:#ec4899;">' + val.esteticoPercentile + '%</span></div><div class="progress-bar"><div class="progress-fill pink" style="width:' + val.esteticoPercentile + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">🤝 Social</span><span class="progress-value" style="color:#f97316;">' + val.socialPercentile + '%</span></div><div class="progress-bar"><div class="progress-fill orange" style="width:' + val.socialPercentile + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">🏆 Individualista</span><span class="progress-value" style="color:#7c3aed;">' + val.individualistaPercentile + '%</span></div><div class="progress-bar"><div class="progress-fill purple" style="width:' + val.individualistaPercentile + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">⚖️ Tradicional</span><span class="progress-value" style="color:#64748b;">' + val.tradicionalPercentile + '%</span></div><div class="progress-bar"><div class="progress-fill slate" style="width:' + val.tradicionalPercentile + '%"></div></div></div>');
                              htmlParts.push('</div></div></div></div>');
                            }
                            
                            // Stress Card
                            if (selectedPerson.stress) {
                              const str = selectedPerson.stress;
                              htmlParts.push('<div class="analysis-card"><div class="card-header"><div class="card-icon orange">📊</div><div><div class="card-title-text">Estrés y Resiliencia Integrados</div><div class="card-subtitle">Capacidad de Adaptación</div></div></div><div class="card-content"><div class="grid-2"><div>');
                              htmlParts.push('<div class="score-row"><div class="score-card" style="flex:1;"><div class="score-value" style="color:#ea580c;">' + str.indiceResiliencia + '</div><div class="score-label">Resiliencia</div></div>');
                              htmlParts.push('<div class="score-card" style="flex:1;"><div class="score-value" style="color:#ef4444;">' + str.nivelEstresGeneral + '</div><div class="score-label">Estrés General</div></div>');
                              htmlParts.push('<div class="score-card" style="flex:1;"><div class="score-value" style="color:#f59e0b;">' + str.capacidadAdaptacion + '</div><div class="score-label">Adaptación</div></div></div>');
                              if (str.protectiveFactors?.length) {
                                htmlParts.push('<div style="margin-top:16px;"><p style="font-size:12px; color:#6b7280; margin-bottom:6px;">Factores Protectores:</p><div style="display:flex; flex-wrap:wrap; gap:6px;">');
                                str.protectiveFactors.slice(0, 3).forEach(f => { htmlParts.push('<span class="badge green">' + f + '</span>'); });
                                htmlParts.push('</div></div>');
                              }
                              htmlParts.push('</div><div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">💼 Estrés Laboral</span><span class="progress-value" style="color:#ef4444;">' + str.estresLaboralScore + '%</span></div><div class="progress-bar"><div class="progress-fill red" style="width:' + (100 - str.estresLaboralScore) + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">🔄 Recuperación</span><span class="progress-value" style="color:#22c55e;">' + str.capacidadRecuperacionScore + '%</span></div><div class="progress-bar"><div class="progress-fill green" style="width:' + str.capacidadRecuperacionScore + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">🎭 Manejo Emocional</span><span class="progress-value" style="color:#3b82f6;">' + str.manejoEmocionalScore + '%</span></div><div class="progress-bar"><div class="progress-fill blue" style="width:' + str.manejoEmocionalScore + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">⚖️ Equilibrio Vida</span><span class="progress-value" style="color:#7c3aed;">' + str.equilibrioVidaScore + '%</span></div><div class="progress-bar"><div class="progress-fill purple" style="width:' + str.equilibrioVidaScore + '%"></div></div></div>');
                              htmlParts.push('<div class="progress-container"><div class="progress-header"><span class="progress-label">💪 Resiliencia</span><span class="progress-value" style="color:#f97316;">' + str.resilienciaScore + '%</span></div><div class="progress-bar"><div class="progress-fill orange" style="width:' + str.resilienciaScore + '%"></div></div></div>');
                              htmlParts.push('</div></div></div></div>');
                            }
                            
                            // Executive Summary (if all 7 modules complete)
                            if (selectedPerson.eq && selectedPerson.dna && selectedPerson.acumen && selectedPerson.values && selectedPerson.stress) {
                              const eq = selectedPerson.eq;
                              const dna = selectedPerson.dna;
                              const ac = selectedPerson.acumen;
                              const val = selectedPerson.values;
                              const str = selectedPerson.stress;
                              htmlParts.push('<div class="analysis-card" style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #fce7f3 100%);">');
                              htmlParts.push('<div class="card-header" style="background: rgba(255,255,255,0.5);"><div class="card-icon indigo">🏆</div><div><div class="card-title-text">Resumen Ejecutivo Reclu Completo</div><div class="card-subtitle">8 Módulos de Evaluación</div></div></div><div class="card-content">');
                              htmlParts.push('<div class="grid-7">');
                              htmlParts.push('<div class="metric-card"><div class="metric-icon">🧠</div><div class="metric-value indigo">' + discStyle + '</div><div class="metric-label">DISC</div></div>');
                              htmlParts.push('<div class="metric-card"><div class="metric-icon">🎯</div><div class="metric-value purple">' + (motivatorDescriptions[topMotivator]?.name || 'FM').substring(0, 4) + '</div><div class="metric-label">Motivador</div></div>');
                              htmlParts.push('<div class="metric-card"><div class="metric-icon">❤️</div><div class="metric-value rose">' + eq.totalScore + '</div><div class="metric-label">EQ</div></div>');
                              htmlParts.push('<div class="metric-card"><div class="metric-icon">🧬</div><div class="metric-value teal">' + dna.totalDNAPercentile + '%</div><div class="metric-label">DNA-25</div></div>');
                              htmlParts.push('<div class="metric-card"><div class="metric-icon">🧭</div><div class="metric-value amber">' + (ac.totalAcumenScore?.toFixed(1) || '0') + '</div><div class="metric-label">Acumen</div></div>');
                              htmlParts.push('<div class="metric-card"><div class="metric-icon">⚖️</div><div class="metric-value violet">' + val.integrityScore + '</div><div class="metric-label">Integridad</div></div>');
                              htmlParts.push('<div class="metric-card"><div class="metric-icon">📊</div><div class="metric-value orange">' + str.indiceResiliencia + '</div><div class="metric-label">Resiliencia</div></div>');
                              htmlParts.push('</div>');
                              
                              const eqInsight = eq.totalScore >= 70 ? 'indica alta capacidad de gestión emocional' : 'muestra áreas de desarrollo en gestión emocional';
                              const dnaInsight = dna.totalDNAPercentile >= 70 ? 'demuestra competencias bien desarrolladas' : 'tiene oportunidades de crecimiento';
                              const acInsight = (ac.totalAcumenScore || 0) >= 7 ? 'es notable' : 'puede fortalecerse';
                              const valInsight = val.integrityScore >= 70 ? 'refleja sólida alineación de valores' : 'indica oportunidades de coherencia';
                              const strInsight = str.indiceResiliencia >= 70 ? 'demuestra excelente capacidad para manejar el estrés' : 'sugiere áreas de desarrollo en manejo del estrés';
                              
                              htmlParts.push('<div class="executive-box"><p class="executive-text">');
                              htmlParts.push('<strong>Perfil Completo:</strong> Este individuo presenta un estilo <strong>' + (styleInfo?.name || 'conductual') + '</strong> con motivación <strong>' + (motivatorDescriptions[topMotivator]?.name?.toLowerCase() || 'práctica') + '</strong>. ');
                              htmlParts.push('Su inteligencia emocional de <strong>' + eq.totalScore + ' puntos</strong> ' + eqInsight + '. ');
                              htmlParts.push('Con un DNA-25 del <strong>' + dna.totalDNAPercentile + '%</strong>, ' + dnaInsight + '. ');
                              htmlParts.push('Su capacidad de juicio (Acumen: <strong>' + (ac.totalAcumenScore?.toFixed(1) || '0') + '/10</strong>) ' + acInsight + '. ');
                              htmlParts.push('Su integridad de <strong>' + val.integrityScore + '</strong> ' + valInsight + '. ');
                              htmlParts.push('Finalmente, su índice de resiliencia de <strong>' + str.indiceResiliencia + '</strong> ' + strInsight + '.');
                              htmlParts.push('</p></div></div></div>');
                            }
                            
                            htmlParts.push('</div>');
                            
                            // Footer
                            const now = new Date();
                            const dateStr = now.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
                            const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                            htmlParts.push('<div class="reclu-footer">');
                            htmlParts.push('<div class="footer-logo">💼 Reclu</div>');
                            htmlParts.push('<div class="footer-text">Plataforma de Evaluación y Análisis de Talento Empresarial</div>');
                            htmlParts.push('<div class="footer-date">Reporte generado el ' + dateStr + ' a las ' + timeStr + '</div>');
                            htmlParts.push('</div></body></html>');
                            
                            printWindow.document.write(htmlParts.join(''));
                            printWindow.document.close();
                            setTimeout(() => { printWindow.print(); }, 500);
                          }}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        >
                          <Printer className="w-4 h-4 mr-2" />
                          {t('analytics.downloadPrint')}
                        </Button>
                      </div>
                      
                      {/* Contenido para imprimir */}
                      <div id="integrated-analysis-print">
                        <IntegratedAnalysis
                          discData={{
                            percentileD: selectedPerson.disc.percentileD,
                            percentileI: selectedPerson.disc.percentileI,
                            percentileS: selectedPerson.disc.percentileS,
                            percentileC: selectedPerson.disc.percentileC,
                            primaryStyle: selectedPerson.disc.primaryStyle,
                          }}
                          dfData={selectedPerson.drivingForces}
                          eqData={selectedPerson.eq || undefined}
                          dnaData={selectedPerson.dna || undefined}
                          acumenData={selectedPerson.acumen || undefined}
                          valuesData={selectedPerson.values || undefined}
                          stressData={selectedPerson.stress || undefined}
                          technicalData={selectedPerson.technical || undefined}
                          userName={selectedPerson.name}
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Historial de Notas de la persona */}
              <PersonNotes
                recipientEmail={selectedPerson.email}
                recipientName={selectedPerson.name}
                className="mt-6"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Empty State con explicación */}
              <Card className="bg-gradient-to-br from-white to-amber-50 border-0 shadow-xl overflow-hidden">
                <CardContent className="p-8 sm:p-12">
                  <div className="text-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <UserCircle className="w-10 h-10 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('analytics.empty.title')}</h3>
                    <p className="text-gray-600 mb-8">{t('analytics.empty.description')}</p>
                    
                    {/* Qué verás */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-amber-100 text-left">
                      <h4 className="font-semibold text-gray-900 mb-4 text-center">{t('analytics.empty.whatYouSee')}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                          <Brain className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{t('analytics.empty.disc')}</p>
                            <p className="text-xs text-gray-600">{t('analytics.empty.disc.desc')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                          <Target className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{t('analytics.empty.df')}</p>
                            <p className="text-xs text-gray-600">{t('analytics.empty.df.desc')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg">
                          <Heart className="w-5 h-5 text-rose-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{t('analytics.empty.eq')}</p>
                            <p className="text-xs text-gray-600">{t('analytics.empty.eq.desc')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                          <Dna className="w-5 h-5 text-teal-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{t('analytics.empty.dna')}</p>
                            <p className="text-xs text-gray-600">{t('analytics.empty.dna.desc')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                          <Compass className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{t('analytics.empty.aci')}</p>
                            <p className="text-xs text-gray-600">{t('analytics.empty.aci.desc')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg">
                          <Scale className="w-5 h-5 text-violet-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{t('analytics.empty.values')}</p>
                            <p className="text-xs text-gray-600">{t('analytics.empty.values.desc')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg sm:col-span-2">
                          <Activity className="w-5 h-5 text-orange-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{t('analytics.empty.stress')}</p>
                            <p className="text-xs text-gray-600">{t('analytics.empty.stress.desc')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center">
                  <p className="text-3xl font-bold text-indigo-600">{people.length}</p>
                  <p className="text-sm text-gray-600 font-medium">{t('analytics.empty.peopleEvaluated')}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center">
                  <p className="text-3xl font-bold text-emerald-600">{people.filter(p => p.hasFullReclu).length}</p>
                  <p className="text-sm text-gray-600 font-medium">{t('analytics.empty.completeProfile')}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center">
                  <p className="text-3xl font-bold text-purple-600">{people.filter(p => p.disc).length}</p>
                  <p className="text-sm text-gray-600 font-medium">{t('analytics.empty.withDisc')}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center">
                  <p className="text-3xl font-bold text-rose-600">{people.filter(p => p.eq).length}</p>
                  <p className="text-sm text-gray-600 font-medium">{t('analytics.empty.withEQ')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vista Comparar */}
      {viewMode === 'compare' && (
        <CompareView
          people={people}
          compareList={compareList}
          recentSelections={recentSelections}
          getDiscColor={getDiscColor}
          toggleCompare={toggleCompare}
        />
      )}
    </div>
  );
}