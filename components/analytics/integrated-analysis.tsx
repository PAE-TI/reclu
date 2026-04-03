'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  Sparkles, 
  Users, 
  Briefcase, 
  Heart,
  Zap,
  Shield,
  MessageCircle,
  Compass,
  Dna,
  Scale,
  Award,
  TrendingUp,
  Activity,
  FileCode,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useLanguage, Language } from '@/contexts/language-context';

interface DiscData {
  percentileD: number;
  percentileI: number;
  percentileS: number;
  percentileC: number;
  primaryStyle: string;
}

interface DFData {
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
  topMotivator?: string;
  primaryMotivators?: string[];
}

interface EQData {
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

interface DNAData {
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
}

interface AcumenData {
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
}

interface ValuesData {
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
}

interface StressData {
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
  stressProfile?: string;
  riskFactors?: string[];
  protectiveFactors?: string[];
  primaryStrengths?: string[];
  developmentAreas?: string[];
}

interface TechnicalData {
  totalScore: number;
  correctAnswers: number;
  totalQuestions: number;
  performanceLevel: string;
  easyScore: number;
  mediumScore: number;
  hardScore: number;
  categoryScores?: Record<string, number>;
  strengths?: string[];
  weaknesses?: string[];
  averageResponseTime?: number;
  totalTime?: number;
}

interface IntegratedAnalysisProps {
  discData: DiscData | null;
  dfData: DFData | null;
  eqData?: EQData | null;
  dnaData?: DNAData | null;
  acumenData?: AcumenData | null;
  valuesData?: ValuesData | null;
  stressData?: StressData | null;
  technicalData?: TechnicalData | null;
  userName?: string;
}

const getDiscStyleDescriptions = (t: (key: string) => string): Record<string, { 
  name: string; 
  behavioral: string; 
  communication: string;
  icon: React.ReactNode;
}> => ({
  D: {
    name: t('analytics.disc.dominant.name'),
    behavioral: t('analytics.disc.dominant.behavioral'),
    communication: t('analytics.disc.dominant.communication'),
    icon: <Zap className="w-5 h-5 text-red-600" />
  },
  I: {
    name: t('analytics.disc.influential.name'),
    behavioral: t('analytics.disc.influential.behavioral'),
    communication: t('analytics.disc.influential.communication'),
    icon: <MessageCircle className="w-5 h-5 text-yellow-600" />
  },
  S: {
    name: t('analytics.disc.steady.name'),
    behavioral: t('analytics.disc.steady.behavioral'),
    communication: t('analytics.disc.steady.communication'),
    icon: <Shield className="w-5 h-5 text-green-600" />
  },
  C: {
    name: t('analytics.disc.conscientious.name'),
    behavioral: t('analytics.disc.conscientious.behavioral'),
    communication: t('analytics.disc.conscientious.communication'),
    icon: <Compass className="w-5 h-5 text-blue-600" />
  }
});

const getMotivatorDescriptions = (t: (key: string) => string): Record<string, { name: string; drive: string }> => ({
  INTELECTUAL: { name: t('analytics.motivator.intellectual.name'), drive: t('analytics.motivator.intellectual.drive') },
  INSTINTIVO: { name: t('analytics.motivator.instinctive.name'), drive: t('analytics.motivator.instinctive.drive') },
  PRACTICO: { name: t('analytics.motivator.practical.name'), drive: t('analytics.motivator.practical.drive') },
  ALTRUISTA: { name: t('analytics.motivator.altruistic.name'), drive: t('analytics.motivator.altruistic.drive') },
  ARMONIOSO: { name: t('analytics.motivator.harmonious.name'), drive: t('analytics.motivator.harmonious.drive') },
  OBJETIVO: { name: t('analytics.motivator.objective.name'), drive: t('analytics.motivator.objective.drive') },
  BENEVOLO: { name: t('analytics.motivator.benevolent.name'), drive: t('analytics.motivator.benevolent.drive') },
  INTENCIONAL: { name: t('analytics.motivator.intentional.name'), drive: t('analytics.motivator.intentional.drive') },
  DOMINANTE: { name: t('analytics.motivator.commanding.name'), drive: t('analytics.motivator.commanding.drive') },
  COLABORATIVO: { name: t('analytics.motivator.collaborative.name'), drive: t('analytics.motivator.collaborative.drive') },
  ESTRUCTURADO: { name: t('analytics.motivator.structured.name'), drive: t('analytics.motivator.structured.drive') },
  RECEPTIVO: { name: t('analytics.motivator.receptive.name'), drive: t('analytics.motivator.receptive.drive') },
});

export default function IntegratedAnalysis({ discData, dfData, eqData, dnaData, acumenData, valuesData, stressData, technicalData, userName = 'Usuario' }: IntegratedAnalysisProps) {
  const { language, t } = useLanguage();
  
  const discStyleDescriptions = useMemo(() => getDiscStyleDescriptions(t), [t]);
  const motivatorDescriptions = useMemo(() => getMotivatorDescriptions(t), [t]);
  
  const analysis = useMemo(() => {
    if (!discData || !dfData) return null;

    const discStyle = discData.primaryStyle || 'D';
    const styleInfo = discStyleDescriptions[discStyle];

    // Determinar los top 3 motivadores
    const motivators = [
      { key: 'INTELECTUAL', value: dfData.intelectualPercentile },
      { key: 'INSTINTIVO', value: dfData.instintivoPercentile },
      { key: 'PRACTICO', value: dfData.practicoPercentile },
      { key: 'ALTRUISTA', value: dfData.altruistaPercentile },
      { key: 'ARMONIOSO', value: dfData.armoniosoPercentile },
      { key: 'OBJETIVO', value: dfData.objetivoPercentile },
      { key: 'BENEVOLO', value: dfData.benevoloPercentile },
      { key: 'INTENCIONAL', value: dfData.intencionalPercentile },
      { key: 'DOMINANTE', value: dfData.dominantePercentile },
      { key: 'COLABORATIVO', value: dfData.colaborativoPercentile },
      { key: 'ESTRUCTURADO', value: dfData.estructuradoPercentile },
      { key: 'RECEPTIVO', value: dfData.receptivoPercentile },
    ].sort((a, b) => b.value - a.value);

    const topMotivators = motivators.slice(0, 3);

    // Generar insights integrados
    const insights = generateIntegratedInsights(discStyle, topMotivators.map(m => m.key), discData, dfData, language);

    return {
      discStyle,
      styleInfo,
      topMotivators,
      insights,
      profileSummary: generateProfileSummary(discStyle, topMotivators[0].key, language),
      workStyle: generateWorkStyle(discStyle, topMotivators, language),
      communicationStyle: generateCommunicationStyle(discStyle, topMotivators, language),
      leadershipStyle: generateLeadershipStyle(discStyle, topMotivators, language),
      teamRole: generateTeamRole(discStyle, topMotivators, language),
      stressManagement: generateStressManagement(discStyle, topMotivators, language),
    };
  }, [discData, dfData, discStyleDescriptions, language]);

  if (!analysis) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('analytics.integrated.notAvailable')}
          </h3>
          <p className="text-gray-600">
            {t('analytics.integrated.notAvailableDesc')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-0 shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl">{t('analytics.integrated.title')}</span>
              <p className="text-sm font-normal text-gray-500 mt-1">{t('analytics.integrated.subtitle')}</p>
            </div>
          </CardTitle>
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            {t('analytics.integrated.completeProfile')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumen del Perfil */}
        <div className="p-5 rounded-xl bg-white/80 border border-indigo-100 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            {t('analytics.integrated.profileSummary')}
          </h4>
          <p className="text-gray-700 leading-relaxed">
            {analysis.profileSummary}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-indigo-100 text-indigo-800">
              DISC: {analysis.styleInfo.name}
            </Badge>
            {analysis.topMotivators.slice(0, 2).map((m, i) => (
              <Badge key={i} className="bg-purple-100 text-purple-800">
                {motivatorDescriptions[m.key]?.name || m.key}
              </Badge>
            ))}
          </div>
        </div>

        {/* Grid de Análisis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estilo de Trabajo */}
          <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
            <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              {t('analytics.integrated.workStyle')}
            </h5>
            <p className="text-sm text-gray-700">{analysis.workStyle}</p>
          </div>

          {/* Comunicación */}
          <div className="p-4 rounded-lg bg-green-50/50 border border-green-100">
            <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {t('analytics.integrated.communicationStyle')}
            </h5>
            <p className="text-sm text-gray-700">{analysis.communicationStyle}</p>
          </div>

          {/* Liderazgo */}
          <div className="p-4 rounded-lg bg-yellow-50/50 border border-yellow-100">
            <h5 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t('analytics.integrated.leadershipPotential')}
            </h5>
            <p className="text-sm text-gray-700">{analysis.leadershipStyle}</p>
          </div>

          {/* Rol en Equipo */}
          <div className="p-4 rounded-lg bg-purple-50/50 border border-purple-100">
            <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              {t('analytics.integrated.teamRole')}
            </h5>
            <p className="text-sm text-gray-700">{analysis.teamRole}</p>
          </div>
        </div>

        {/* Insights Integrados */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
          <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {t('analytics.integrated.keyInsights')}
          </h4>
          <ul className="space-y-2">
            {analysis.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-amber-500 mt-0.5">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>

        {/* Manejo del Estrés */}
        <div className="p-4 rounded-lg bg-red-50/50 border border-red-100">
          <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            {t('analytics.integrated.stressManagement')}
          </h5>
          <p className="text-sm text-gray-700">{analysis.stressManagement}</p>
        </div>

        {/* Inteligencia Emocional (si está disponible) */}
        {eqData && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200">
            <h4 className="font-semibold text-rose-900 mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              {t('analytics.integrated.eqIntegrated')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">{t('analytics.integrated.level')} EQ: <span className="text-rose-600 font-bold">{eqData.eqLevel?.replace('_', ' ')}</span></p>
                <p className="text-sm text-gray-600">
                  {discData && getEQInsight(discData.primaryStyle, eqData, language)}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">{t('analytics.eq.selfAwareness')}</span>
                  <span className="font-medium text-rose-600">{eqData.autoconcienciaPercentile}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${eqData.autoconcienciaPercentile}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">{t('analytics.eq.empathy')}</span>
                  <span className="font-medium text-pink-600">{eqData.empatiaPercentile}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${eqData.empatiaPercentile}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">{t('analytics.eq.socialSkills')}</span>
                  <span className="font-medium text-purple-600">{eqData.habilidadesSocialesPercentile}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${eqData.habilidadesSocialesPercentile}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Competencias DNA-25 (si está disponible) */}
        {dnaData && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200">
            <h4 className="font-semibold text-teal-900 mb-3 flex items-center gap-2">
              <Dna className="w-5 h-5" />
              {t('analytics.integrated.dnaIntegrated')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {t('analytics.integrated.level')}: <span className="text-teal-600 font-bold">{dnaData.dnaLevel?.replace('_', ' ')}</span>
                </p>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {t('analytics.integrated.profile')}: <span className="text-teal-600">{dnaData.dnaProfile}</span>
                </p>
                <p className="text-sm text-gray-600">
                  {discData && getDNAInsight(discData.primaryStyle, dnaData, language)}
                </p>
                {dnaData.primaryStrengths && dnaData.primaryStrengths.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">{t('analytics.dna.topCompetencies')}:</p>
                    <div className="flex flex-wrap gap-1">
                      {dnaData.primaryStrengths.slice(0, 3).map(s => (
                        <Badge key={s} variant="outline" className="text-teal-600 border-teal-300 text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">🧠 {t('analytics.dnaCategory.thinking')}</span>
                  <span className="font-medium text-indigo-600">{dnaData.thinkingCategoryScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${dnaData.thinkingCategoryScore}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">💬 {t('analytics.dnaCategory.communication')}</span>
                  <span className="font-medium text-purple-600">{dnaData.communicationCategoryScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${dnaData.communicationCategoryScore}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">👥 {t('analytics.dnaCategory.leadership')}</span>
                  <span className="font-medium text-pink-600">{dnaData.leadershipCategoryScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${dnaData.leadershipCategoryScore}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">🎯 {t('analytics.dnaCategory.results')}</span>
                  <span className="font-medium text-amber-600">{dnaData.resultsCategoryScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${dnaData.resultsCategoryScore}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">🤝 {t('analytics.dnaCategory.relationships')}</span>
                  <span className="font-medium text-green-600">{dnaData.relationshipCategoryScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${dnaData.relationshipCategoryScore}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Capacidad Acumen (si está disponible) */}
        {acumenData && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <Compass className="w-5 h-5" />
              {t('analytics.integrated.acumenIntegrated')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {t('analytics.integrated.level')}: <span className="text-amber-600 font-bold">{acumenData.acumenLevel?.replace('_', ' ')}</span>
                </p>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {t('analytics.integrated.profile')}: <span className="text-amber-600">{acumenData.acumenProfile}</span>
                </p>
                <p className="text-sm text-gray-600">
                  {discData && getAcumenInsight(discData.primaryStyle, acumenData, language)}
                </p>
                {acumenData.primaryStrengths && acumenData.primaryStrengths.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">{t('analytics.integrated.strengths')}:</p>
                    <div className="flex flex-wrap gap-1">
                      {acumenData.primaryStrengths.slice(0, 3).map(s => (
                        <Badge key={s} variant="outline" className="text-amber-600 border-amber-300 text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 mb-2">{t('analytics.integrated.externalClarity')}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">🔍 {t('analytics.integrated.understandingOthers')}</span>
                    <span className="font-medium text-blue-600">{acumenData.understandingOthersClarity}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${acumenData.understandingOthersClarity * 10}%` }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">⚙️ {t('analytics.integrated.practicalThinking')}</span>
                    <span className="font-medium text-blue-600">{acumenData.practicalThinkingClarity}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${acumenData.practicalThinkingClarity * 10}%` }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">📊 {t('analytics.integrated.systemsJudgment')}</span>
                    <span className="font-medium text-blue-600">{acumenData.systemsJudgmentClarity}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${acumenData.systemsJudgmentClarity * 10}%` }} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">{t('analytics.integrated.internalClarity')}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">🪞 {t('analytics.integrated.senseOfSelf')}</span>
                    <span className="font-medium text-purple-600">{acumenData.senseOfSelfClarity}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${acumenData.senseOfSelfClarity * 10}%` }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">🎭 {t('analytics.integrated.roleAwareness')}</span>
                    <span className="font-medium text-purple-600">{acumenData.roleAwarenessClarity}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${acumenData.roleAwarenessClarity * 10}%` }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">🧭 {t('analytics.integrated.selfDirection')}</span>
                    <span className="font-medium text-purple-600">{acumenData.selfDirectionClarity}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${acumenData.selfDirectionClarity * 10}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Valores e Integridad (si está disponible) */}
        {valuesData && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
            <h4 className="font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              {t('analytics.integrated.valuesIntegrated')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-violet-600">{valuesData.integrityScore}</p>
                    <p className="text-xs text-gray-500">{t('analytics.integrated.integrity')}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-purple-600">{valuesData.consistencyScore}</p>
                    <p className="text-xs text-gray-500">{t('analytics.integrated.consistency')}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-pink-600">{valuesData.authenticityScore}</p>
                    <p className="text-xs text-gray-500">{t('analytics.integrated.authenticity')}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {discData && getValuesInsight(discData.primaryStyle, valuesData, language)}
                </p>
                {valuesData.primaryValues && valuesData.primaryValues.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">{t('analytics.integrated.primaryValues')}:</p>
                    <div className="flex flex-wrap gap-1">
                      {valuesData.primaryValues.slice(0, 3).map(v => (
                        <Badge key={v} variant="outline" className="text-violet-600 border-violet-300 text-xs">
                          {v}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {[
                  { key: 'teoricoPercentile', labelKey: 'analytics.values.theoretical', icon: '📚', color: 'bg-blue-500' },
                  { key: 'utilitarioPercentile', labelKey: 'analytics.values.utilitarian', icon: '💰', color: 'bg-green-500' },
                  { key: 'esteticoPercentile', labelKey: 'analytics.values.aesthetic', icon: '🎨', color: 'bg-pink-500' },
                  { key: 'socialPercentile', labelKey: 'analytics.values.social', icon: '🤝', color: 'bg-orange-500' },
                  { key: 'individualistaPercentile', labelKey: 'analytics.values.individualistic', icon: '🏆', color: 'bg-purple-500' },
                  { key: 'tradicionalPercentile', labelKey: 'analytics.values.traditional', icon: '⚖️', color: 'bg-slate-500' },
                ].map(({ key, labelKey, icon, color }) => {
                  const value = valuesData[key as keyof ValuesData] as number;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">{icon} {t(labelKey)}</span>
                        <span className="font-medium text-violet-600">{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Estrés y Resiliencia (si está disponible) */}
        {stressData && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {t('analytics.integrated.stressIntegrated')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-orange-600">{stressData.indiceResiliencia}</p>
                    <p className="text-xs text-gray-500">{t('analytics.integrated.resilience')}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-rose-600">{stressData.nivelEstresGeneral}</p>
                    <p className="text-xs text-gray-500">{t('analytics.integrated.generalStress')}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-amber-600">{stressData.capacidadAdaptacion}</p>
                    <p className="text-xs text-gray-500">{t('analytics.integrated.adaptation')}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {discData && getStressInsight(discData.primaryStyle, stressData, language)}
                </p>
                {stressData.protectiveFactors && stressData.protectiveFactors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">{t('analytics.integrated.protectiveFactors')}:</p>
                    <div className="flex flex-wrap gap-1">
                      {stressData.protectiveFactors.slice(0, 3).map(f => (
                        <Badge key={f} variant="outline" className="text-green-600 border-green-300 text-xs">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {[
                  { key: 'estresLaboralScore', labelKey: 'analytics.stress.workStress', icon: '💼', color: 'bg-red-500', inverted: true },
                  { key: 'capacidadRecuperacionScore', labelKey: 'analytics.stress.recovery', icon: '🔄', color: 'bg-green-500', inverted: false },
                  { key: 'manejoEmocionalScore', labelKey: 'analytics.stress.emotionalManagement', icon: '🎭', color: 'bg-blue-500', inverted: false },
                  { key: 'equilibrioVidaScore', labelKey: 'analytics.stress.lifeBalance', icon: '⚖️', color: 'bg-purple-500', inverted: false },
                  { key: 'resilienciaScore', labelKey: 'analytics.stress.resilience', icon: '💪', color: 'bg-orange-500', inverted: false },
                ].map(({ key, labelKey, icon, color, inverted }) => {
                  const value = stressData[key as keyof StressData] as number;
                  const displayValue = inverted ? 100 - value : value;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">{icon} {t(labelKey)}</span>
                        <span className="font-medium text-orange-600">{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className={`${inverted ? 'bg-red-400' : color} h-1.5 rounded-full`} style={{ width: `${displayValue}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Pruebas Técnicas (si está disponible) */}
        {technicalData && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200">
            <h4 className="font-semibold text-sky-900 mb-3 flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              {language === 'es' ? 'Competencias Técnicas Integradas' : 'Integrated Technical Skills'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-sky-600">{Math.round(technicalData.totalScore)}%</p>
                    <p className="text-xs text-gray-500">{language === 'es' ? 'Puntaje Total' : 'Total Score'}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-cyan-600">{technicalData.correctAnswers}/{technicalData.totalQuestions}</p>
                    <p className="text-xs text-gray-500">{language === 'es' ? 'Correctas' : 'Correct'}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <Badge className={`${
                      technicalData.totalScore >= 80 ? 'bg-green-100 text-green-700' :
                      technicalData.totalScore >= 60 ? 'bg-blue-100 text-blue-700' :
                      technicalData.totalScore >= 40 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {technicalData.performanceLevel}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {discData ? (
                    language === 'es' 
                      ? `Con un estilo ${discData.primaryStyle} y un puntaje técnico del ${Math.round(technicalData.totalScore)}%, ${userName} ${technicalData.totalScore >= 70 ? 'demuestra sólidas competencias técnicas que complementan su perfil de comportamiento' : 'tiene oportunidades de fortalecer sus conocimientos técnicos para potenciar su perfil'}.`
                      : `With a ${discData.primaryStyle} style and a technical score of ${Math.round(technicalData.totalScore)}%, ${userName} ${technicalData.totalScore >= 70 ? 'demonstrates solid technical competencies that complement their behavioral profile' : 'has opportunities to strengthen technical knowledge to enhance their profile'}.`
                  ) : (
                    language === 'es'
                      ? `${userName} obtuvo un puntaje técnico del ${Math.round(technicalData.totalScore)}% con ${technicalData.correctAnswers} respuestas correctas.`
                      : `${userName} achieved a technical score of ${Math.round(technicalData.totalScore)}% with ${technicalData.correctAnswers} correct answers.`
                  )}
                </p>
                {technicalData.strengths && technicalData.strengths.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      {language === 'es' ? 'Fortalezas:' : 'Strengths:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {technicalData.strengths.slice(0, 3).map(s => (
                        <Badge key={s} variant="outline" className="text-green-600 border-green-300 text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {technicalData.weaknesses && technicalData.weaknesses.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-amber-600" />
                      {language === 'es' ? 'Áreas de mejora:' : 'Areas to improve:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {technicalData.weaknesses.slice(0, 3).map(w => (
                        <Badge key={w} variant="outline" className="text-amber-600 border-amber-300 text-xs">
                          {w}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {[
                  { label: language === 'es' ? 'Preguntas Fáciles' : 'Easy Questions', value: technicalData.easyScore, color: 'bg-green-500', icon: '🟢' },
                  { label: language === 'es' ? 'Preguntas Medias' : 'Medium Questions', value: technicalData.mediumScore, color: 'bg-yellow-500', icon: '🟡' },
                  { label: language === 'es' ? 'Preguntas Difíciles' : 'Hard Questions', value: technicalData.hardScore, color: 'bg-red-500', icon: '🔴' },
                ].map(({ label, value, color, icon }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">{icon} {label}</span>
                      <span className="font-medium text-sky-600">{Math.round(value || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className={`${color} h-1.5 rounded-full`} style={{ width: `${value || 0}%` }} />
                    </div>
                  </div>
                ))}
                {technicalData.averageResponseTime && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {language === 'es' ? 'Tiempo promedio por pregunta:' : 'Average time per question:'} {Math.round(technicalData.averageResponseTime)}s
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resumen Ejecutivo MotivaIQ Completo */}
        {discData && dfData && eqData && dnaData && acumenData && valuesData && stressData && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border border-indigo-300">
            <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5" />
              {t('analytics.integrated.executiveSummary')}
              {technicalData && (
                <Badge className="bg-sky-100 text-sky-700 text-xs ml-2">
                  + {language === 'es' ? 'Técnica' : 'Technical'}
                </Badge>
              )}
            </h4>
            <div className={`grid grid-cols-2 md:grid-cols-4 ${technicalData ? 'lg:grid-cols-8' : 'lg:grid-cols-7'} gap-3 mb-4`}>
              <div className="text-center p-3 bg-white/80 rounded-xl">
                <Brain className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-indigo-600">{discData.primaryStyle}</p>
                <p className="text-xs text-gray-500">DISC</p>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-xl">
                <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-purple-600">{dfData.topMotivator?.substring(0, 4) || 'FM'}</p>
                <p className="text-xs text-gray-500">{t('analytics.integrated.motivator')}</p>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-xl">
                <Heart className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-rose-600">{eqData.totalScore}</p>
                <p className="text-xs text-gray-500">EQ</p>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-xl">
                <Dna className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-teal-600">{dnaData.totalDNAPercentile}%</p>
                <p className="text-xs text-gray-500">DNA-25</p>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-xl">
                <Compass className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-amber-600">{acumenData.totalAcumenScore.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Acumen</p>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-xl">
                <Scale className="w-5 h-5 text-violet-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-violet-600">{valuesData.integrityScore}</p>
                <p className="text-xs text-gray-500">{t('analytics.integrated.integrity')}</p>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-xl">
                <Activity className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-orange-600">{stressData.indiceResiliencia}</p>
                <p className="text-xs text-gray-500">{t('analytics.integrated.resilience')}</p>
              </div>
              {technicalData && (
                <div className="text-center p-3 bg-white/80 rounded-xl border border-sky-200">
                  <FileCode className="w-5 h-5 text-sky-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-sky-600">{Math.round(technicalData.totalScore)}%</p>
                  <p className="text-xs text-gray-500">{language === 'es' ? 'Técnica' : 'Technical'}</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-white/60 rounded-xl">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>{t('analytics.integrated.fullProfileDesc')}</strong> {discStyleDescriptions[discData.primaryStyle]?.name || (language === 'es' ? 'conductual' : 'behavioral')} 
                {' '}{t('analytics.integrated.withMotivation')} {motivatorDescriptions[dfData.topMotivator || 'PRACTICO']?.name.toLowerCase() || (language === 'es' ? 'práctica' : 'practical')}.
                {' '}{t('analytics.integrated.eqOf')} {eqData.totalScore} {t('analytics.integrated.points')} 
                {eqData.totalScore >= 70 ? ` ${t('analytics.integrated.highEmotionalCapacity')}` : ` ${t('analytics.integrated.emotionalDevAreas')}`}.
                {' '}{t('analytics.integrated.withDNA')} {dnaData.totalDNAPercentile}%, 
                {dnaData.totalDNAPercentile >= 70 ? ` ${t('analytics.integrated.wellDeveloped')}` : ` ${t('analytics.integrated.growthOpportunities')}`}.
                {' '}{t('analytics.integrated.judgmentCapacity')} {acumenData.totalAcumenScore.toFixed(1)}/10) 
                {acumenData.totalAcumenScore >= 7 ? ` ${t('analytics.integrated.isNotable')}` : ` ${t('analytics.integrated.canBeStrengthened')}`}.
                {' '}{t('analytics.integrated.integrityOf')} {valuesData.integrityScore} 
                {valuesData.integrityScore >= 70 ? ` ${t('analytics.integrated.solidAlignment')}` : ` ${t('analytics.integrated.coherenceOpportunities')}`}.
                {' '}{t('analytics.integrated.resilienceIndexOf')} {stressData.indiceResiliencia} 
                {stressData.indiceResiliencia >= 70 ? ` ${t('analytics.integrated.excellentStressCapacity')}` : ` ${t('analytics.integrated.stressDevAreas')}`}.
                {technicalData && (
                  <>
                    {' '}{language === 'es' 
                      ? `Además, su competencia técnica del ${Math.round(technicalData.totalScore)}%` 
                      : `Additionally, their technical competency of ${Math.round(technicalData.totalScore)}%`}
                    {technicalData.totalScore >= 70 
                      ? (language === 'es' ? ' refuerza su perfil con sólidos conocimientos del cargo.' : ' reinforces their profile with solid job knowledge.')
                      : (language === 'es' ? ' presenta oportunidades de desarrollo técnico específico.' : ' presents opportunities for specific technical development.')
                    }
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getValuesInsight(discStyle: string, valuesData: ValuesData, language: Language = 'es'): string {
  const avgIntegrity = (valuesData.integrityScore + valuesData.consistencyScore + valuesData.authenticityScore) / 3;
  
  const insights: Record<string, { high: string; low: string }> = language === 'es' ? {
    D: {
      high: 'Su estilo Dominante se refuerza con valores sólidos de integridad, permitiéndole liderar con autoridad moral y generar confianza en sus decisiones.',
      low: 'Su orientación a resultados puede beneficiarse de una mayor reflexión sobre valores personales para construir relaciones más duraderas.'
    },
    I: {
      high: 'Su carisma natural se potencia con valores auténticos, generando conexiones genuinas y siendo un modelo de comportamiento positivo.',
      low: 'Su naturaleza social puede fortalecerse desarrollando mayor consistencia entre sus valores declarados y sus acciones.'
    },
    S: {
      high: 'Su estabilidad natural combinada con valores sólidos le convierte en un pilar de confianza y ética para el equipo.',
      low: 'Su tendencia a la armonía puede equilibrarse siendo más asertivo en defender sus valores fundamentales.'
    },
    C: {
      high: 'Su naturaleza analítica se complementa con valores claros, permitiéndole tomar decisiones éticas basadas en principios sólidos.',
      low: 'Puede beneficiarse de conectar más sus valores personales con sus interacciones diarias para mayor impacto.'
    }
  } : {
    D: {
      high: 'Your Dominant style is reinforced by solid integrity values, allowing you to lead with moral authority and generate trust in your decisions.',
      low: 'Your results orientation can benefit from greater reflection on personal values to build more lasting relationships.'
    },
    I: {
      high: 'Your natural charisma is enhanced by authentic values, generating genuine connections and being a model of positive behavior.',
      low: 'Your social nature can be strengthened by developing greater consistency between your declared values and your actions.'
    },
    S: {
      high: 'Your natural stability combined with solid values makes you a pillar of trust and ethics for the team.',
      low: 'Your tendency towards harmony can be balanced by being more assertive in defending your fundamental values.'
    },
    C: {
      high: 'Your analytical nature is complemented by clear values, allowing you to make ethical decisions based on solid principles.',
      low: 'You can benefit from connecting your personal values more with your daily interactions for greater impact.'
    }
  };
  
  return avgIntegrity >= 70 ? insights[discStyle]?.high || insights['S'].high : insights[discStyle]?.low || insights['S'].low;
}

function getStressInsight(discStyle: string, stressData: StressData, language: Language = 'es'): string {
  const resilience = stressData.indiceResiliencia;
  
  const insights: Record<string, { high: string; low: string }> = language === 'es' ? {
    D: {
      high: 'Su estilo Dominante se complementa con alta resiliencia, permitiéndole mantener el enfoque en resultados incluso bajo presión intensa.',
      low: 'Su orientación a resultados puede generar estrés cuando las cosas no avanzan al ritmo deseado. Desarrollar técnicas de manejo del estrés mejorará su sostenibilidad.'
    },
    I: {
      high: 'Su naturaleza optimista se potencia con buena gestión del estrés, manteniéndole energizado y positivo incluso en momentos difíciles.',
      low: 'Su sensibilidad social puede hacerle vulnerable al estrés por conflictos interpersonales. Fortalecer sus límites mejorará su bienestar.'
    },
    S: {
      high: 'Su estabilidad natural se alinea con excelente manejo del estrés, convirtiéndole en un ancla de calma para el equipo.',
      low: 'Los cambios abruptos pueden afectar su bienestar. Desarrollar mayor flexibilidad le ayudará a mantener su equilibrio natural.'
    },
    C: {
      high: 'Su naturaleza analítica se complementa con buena gestión del estrés, permitiéndole mantener la precisión y calidad incluso bajo presión.',
      low: 'La ambigüedad y los errores pueden generar ansiedad. Desarrollar tolerancia a la incertidumbre mejorará su bienestar general.'
    }
  } : {
    D: {
      high: 'Your Dominant style is complemented by high resilience, allowing you to maintain focus on results even under intense pressure.',
      low: 'Your results orientation can generate stress when things don\'t progress at the desired pace. Developing stress management techniques will improve sustainability.'
    },
    I: {
      high: 'Your optimistic nature is enhanced by good stress management, keeping you energized and positive even in difficult times.',
      low: 'Your social sensitivity can make you vulnerable to stress from interpersonal conflicts. Strengthening your boundaries will improve your wellbeing.'
    },
    S: {
      high: 'Your natural stability aligns with excellent stress management, making you an anchor of calm for the team.',
      low: 'Abrupt changes can affect your wellbeing. Developing greater flexibility will help you maintain your natural balance.'
    },
    C: {
      high: 'Your analytical nature is complemented by good stress management, allowing you to maintain precision and quality even under pressure.',
      low: 'Ambiguity and errors can generate anxiety. Developing tolerance for uncertainty will improve your overall wellbeing.'
    }
  };
  
  return resilience >= 65 ? insights[discStyle]?.high || insights['S'].high : insights[discStyle]?.low || insights['S'].low;
}

function getEQInsight(discStyle: string, eqData: EQData, language: Language = 'es'): string {
  const avgEQ = (eqData.autoconcienciaPercentile + eqData.autorregulacionPercentile + 
                 eqData.motivacionPercentile + eqData.empatiaPercentile + 
                 eqData.habilidadesSocialesPercentile) / 5;
  
  const insights: Record<string, { high: string; low: string }> = language === 'es' ? {
    D: {
      high: 'Su estilo Dominante se equilibra con alta inteligencia emocional, permitiéndole liderar con autoridad pero también con sensibilidad hacia el equipo.',
      low: 'Su estilo directo puede beneficiarse de desarrollar mayor empatía y autoconciencia para mejorar las relaciones interpersonales.'
    },
    I: {
      high: 'Su carisma natural se potencia con su alta inteligencia emocional, haciéndole un comunicador excepcional y un motivador efectivo.',
      low: 'Aunque sociable, puede mejorar su autorregulación para mantener el enfoque y gestionar mejor sus emociones en situaciones difíciles.'
    },
    S: {
      high: 'Su estabilidad natural combinada con alta EQ le convierte en un pilar de apoyo emocional para el equipo, generando confianza duradera.',
      low: 'Su tendencia a evitar conflictos puede equilibrarse desarrollando más asertividad a través del trabajo en habilidades sociales.'
    },
    C: {
      high: 'Su naturaleza analítica se complementa con inteligencia emocional, permitiéndole tomar decisiones basadas en datos sin ignorar el factor humano.',
      low: 'Puede beneficiarse de desarrollar más habilidades sociales y empatía para conectar mejor con colegas menos analíticos.'
    }
  } : {
    D: {
      high: 'Your Dominant style is balanced with high emotional intelligence, allowing you to lead with authority but also with sensitivity towards the team.',
      low: 'Your direct style can benefit from developing greater empathy and self-awareness to improve interpersonal relationships.'
    },
    I: {
      high: 'Your natural charisma is enhanced by your high emotional intelligence, making you an exceptional communicator and effective motivator.',
      low: 'Although sociable, you can improve your self-regulation to maintain focus and better manage your emotions in difficult situations.'
    },
    S: {
      high: 'Your natural stability combined with high EQ makes you a pillar of emotional support for the team, generating lasting trust.',
      low: 'Your tendency to avoid conflicts can be balanced by developing more assertiveness through work on social skills.'
    },
    C: {
      high: 'Your analytical nature is complemented by emotional intelligence, allowing you to make data-based decisions without ignoring the human factor.',
      low: 'You can benefit from developing more social skills and empathy to connect better with less analytical colleagues.'
    }
  };
  
  return avgEQ >= 60 ? insights[discStyle]?.high || insights['S'].high : insights[discStyle]?.low || insights['S'].low;
}

function getDNAInsight(discStyle: string, dnaData: DNAData, language: Language = 'es'): string {
  const avgDNA = dnaData.totalDNAPercentile;
  
  const insights: Record<string, { high: string; low: string }> = language === 'es' ? {
    D: {
      high: 'Su perfil dominante se potencia con fuertes competencias en liderazgo y orientación a resultados, convirtiéndole en un ejecutor excepcional.',
      low: 'Su estilo directo puede beneficiarse del desarrollo de competencias en comunicación y relaciones interpersonales.'
    },
    I: {
      high: 'Su carisma natural se complementa con competencias desarrolladas en comunicación y habilidades sociales, haciéndole un influenciador efectivo.',
      low: 'Puede fortalecer su impacto desarrollando competencias en pensamiento analítico y orientación a resultados.'
    },
    S: {
      high: 'Su estabilidad natural se alinea con fuertes competencias en relaciones y trabajo en equipo, convirtiéndole en un pilar de confianza.',
      low: 'Puede expandir su impacto desarrollando competencias de liderazgo y toma de decisiones para complementar su naturaleza colaborativa.'
    },
    C: {
      high: 'Su naturaleza analítica se refuerza con competencias desarrolladas en pensamiento estratégico y atención al detalle.',
      low: 'Puede ampliar su efectividad desarrollando competencias en comunicación y liderazgo para compartir mejor sus análisis.'
    }
  } : {
    D: {
      high: 'Your dominant profile is enhanced by strong competencies in leadership and results orientation, making you an exceptional executor.',
      low: 'Your direct style can benefit from developing competencies in communication and interpersonal relationships.'
    },
    I: {
      high: 'Your natural charisma is complemented by developed competencies in communication and social skills, making you an effective influencer.',
      low: 'You can strengthen your impact by developing competencies in analytical thinking and results orientation.'
    },
    S: {
      high: 'Your natural stability aligns with strong competencies in relationships and teamwork, making you a pillar of trust.',
      low: 'You can expand your impact by developing leadership and decision-making competencies to complement your collaborative nature.'
    },
    C: {
      high: 'Your analytical nature is reinforced by developed competencies in strategic thinking and attention to detail.',
      low: 'You can broaden your effectiveness by developing competencies in communication and leadership to better share your analyses.'
    }
  };
  
  return avgDNA >= 60 ? insights[discStyle]?.high || insights['S'].high : insights[discStyle]?.low || insights['S'].low;
}

function getAcumenInsight(discStyle: string, acumenData: AcumenData, language: Language = 'es'): string {
  const avgAcumen = (acumenData.externalClarityScore + acumenData.internalClarityScore) / 2;
  
  const insights: Record<string, { high: string; low: string }> = language === 'es' ? {
    D: {
      high: 'Su estilo dominante se potencia con alta claridad perceptual, permitiéndole tomar decisiones rápidas y acertadas.',
      low: 'Su estilo directo puede beneficiarse de desarrollar mayor claridad en la comprensión de otros y autoconciencia.'
    },
    I: {
      high: 'Su carisma natural se complementa con alta capacidad de juicio, permitiéndole influir de manera efectiva.',
      low: 'Puede fortalecer su impacto desarrollando mayor claridad en el pensamiento práctico y la auto-dirección.'
    },
    S: {
      high: 'Su estabilidad natural se alinea con fuerte capacidad de juicio y autoconocimiento.',
      low: 'Puede expandir su capacidad desarrollando mayor claridad en el juicio de sistemas y conciencia del rol.'
    },
    C: {
      high: 'Su naturaleza analítica se refuerza con alta claridad perceptual, combinando datos con comprensión del contexto.',
      low: 'Puede ampliar su efectividad desarrollando mayor comprensión de otros y sentido de sí mismo.'
    }
  } : {
    D: {
      high: 'Your dominant style is enhanced by high perceptual clarity, allowing you to make quick and accurate decisions.',
      low: 'Your direct style can benefit from developing greater clarity in understanding others and self-awareness.'
    },
    I: {
      high: 'Your natural charisma is complemented by high judgment capacity, allowing you to influence effectively.',
      low: 'You can strengthen your impact by developing greater clarity in practical thinking and self-direction.'
    },
    S: {
      high: 'Your natural stability aligns with strong judgment capacity and self-knowledge.',
      low: 'You can expand your capacity by developing greater clarity in systems judgment and role awareness.'
    },
    C: {
      high: 'Your analytical nature is reinforced by high perceptual clarity, combining data with contextual understanding.',
      low: 'You can broaden your effectiveness by developing greater understanding of others and sense of self.'
    }
  };
  
  return avgAcumen >= 7 ? insights[discStyle]?.high || insights['S'].high : insights[discStyle]?.low || insights['S'].low;
}

function generateProfileSummary(discStyle: string, topMotivator: string, language: Language = 'es'): string {
  const summaries: Record<string, Record<string, string>> = language === 'es' ? {
    D: {
      INTELECTUAL: 'Líder orientado al conocimiento que combina la toma de decisiones rápida con un profundo deseo de entender el por qué.',
      INSTINTIVO: 'Tomador de decisiones pragmático que confía en su experiencia e intuición para liderar.',
      PRACTICO: 'Ejecutor eficiente que busca resultados tangibles y medibles. Muy orientado a la productividad.',
      DOMINANTE: 'Líder nato con fuerte necesidad de reconocimiento y control.',
      default: 'Perfil orientado a resultados con un estilo directo y decisivo.'
    },
    I: {
      INTELECTUAL: 'Comunicador entusiasta con sed de conocimiento. Combina carisma natural con curiosidad intelectual.',
      ARMONIOSO: 'Persona sociable que busca crear ambientes positivos. Su optimismo natural se alinea con su deseo de armonía.',
      BENEVOLO: 'Influenciador empático que genuinamente se preocupa por el bienestar de otros.',
      default: 'Perfil expresivo y optimista que disfruta de las interacciones sociales.'
    },
    S: {
      COLABORATIVO: 'Persona confiable que prefiere trabajar en equipo sin buscar protagonismo.',
      ESTRUCTURADO: 'Profesional metódico que valora la consistencia y los procedimientos establecidos.',
      ALTRUISTA: 'Persona paciente y servicial que encuentra satisfacción en ayudar sin esperar reconocimiento.',
      default: 'Perfil estable y cooperador que valora las relaciones a largo plazo y la armonía del equipo.'
    },
    C: {
      INTELECTUAL: 'Analista riguroso con pasión por el aprendizaje profundo.',
      OBJETIVO: 'Profesional meticuloso enfocado en la funcionalidad y objetividad.',
      ESTRUCTURADO: 'Especialista en procesos que valora los sistemas probados y la calidad.',
      default: 'Perfil analítico y orientado a la calidad. Combina atención al detalle con motivadores únicos.'
    }
  } : {
    D: {
      INTELECTUAL: 'Knowledge-oriented leader who combines quick decision-making with a deep desire to understand the why.',
      INSTINTIVO: 'Pragmatic decision-maker who relies on experience and intuition to lead.',
      PRACTICO: 'Efficient executor seeking tangible, measurable results. Highly productivity-oriented.',
      DOMINANTE: 'Natural leader with strong need for recognition and control.',
      default: 'Results-oriented profile with a direct, decisive style.'
    },
    I: {
      INTELECTUAL: 'Enthusiastic communicator with thirst for knowledge. Combines natural charisma with intellectual curiosity.',
      ARMONIOSO: 'Sociable person seeking to create positive environments. Natural optimism aligns with desire for harmony.',
      BENEVOLO: 'Empathetic influencer who genuinely cares about others\' wellbeing.',
      default: 'Expressive, optimistic profile that enjoys social interactions.'
    },
    S: {
      COLABORATIVO: 'Reliable person who prefers teamwork without seeking the spotlight.',
      ESTRUCTURADO: 'Methodical professional who values consistency and established procedures.',
      ALTRUISTA: 'Patient, helpful person who finds satisfaction in helping without expecting recognition.',
      default: 'Stable, cooperative profile that values long-term relationships and team harmony.'
    },
    C: {
      INTELECTUAL: 'Rigorous analyst with passion for deep learning.',
      OBJETIVO: 'Meticulous professional focused on functionality and objectivity.',
      ESTRUCTURADO: 'Process specialist who values proven systems and quality.',
      default: 'Analytical, quality-oriented profile. Combines attention to detail with unique motivators.'
    }
  };

  const defaultText = language === 'es' 
    ? 'Perfil único que combina comportamientos DISC con motivadores específicos.'
    : 'Unique profile combining DISC behaviors with specific motivators.';

  return summaries[discStyle]?.[topMotivator] || summaries[discStyle]?.default || defaultText;
}

function generateWorkStyle(discStyle: string, topMotivators: { key: string; value: number }[], language: Language = 'es'): string {
  const topMotivator = topMotivators[0].key;
  
  const styles: Record<string, string> = language === 'es' ? {
    D: 'Trabaja de manera independiente, toma decisiones rápidas y se enfoca en resultados.',
    I: 'Trabaja mejor en equipo, genera energía positiva y motiva a otros.',
    S: 'Trabaja de manera consistente y confiable. Prefiere ambientes estables con expectativas claras.',
    C: 'Trabaja de manera metódica y precisa. Prefiere ambientes estructurados con acceso a información.',
  } : {
    D: 'Works independently, makes quick decisions and focuses on results.',
    I: 'Works best in teams, generates positive energy and motivates others.',
    S: 'Works consistently and reliably. Prefers stable environments with clear expectations.',
    C: 'Works methodically and precisely. Prefers structured environments with access to information.',
  };

  let style = styles[discStyle] || styles['S'];

  const additions: Record<string, string> = language === 'es' ? {
    INTELECTUAL: ' Busca oportunidades de aprendizaje continuo.',
    PRACTICO: ' Se enfoca en la eficiencia y el valor tangible.',
    RECEPTIVO: ' Está abierto a nuevas metodologías e innovación.'
  } : {
    INTELECTUAL: ' Seeks continuous learning opportunities.',
    PRACTICO: ' Focuses on efficiency and tangible value.',
    RECEPTIVO: ' Is open to new methodologies and innovation.'
  };

  if (additions[topMotivator]) {
    style += additions[topMotivator];
  }

  return style;
}

function generateCommunicationStyle(discStyle: string, topMotivators: { key: string; value: number }[], language: Language = 'es'): string {
  const styles: Record<string, string> = language === 'es' ? {
    D: 'Comunicación directa y concisa. Prefiere ir al punto y hablar de resultados.',
    I: 'Comunicación expresiva y entusiasta. Disfruta las historias y conexiones personales.',
    S: 'Comunicación calmada y considerada. Escucha activamente y prefiere conversaciones sin presión.',
    C: 'Comunicación precisa y bien fundamentada. Prefiere datos y lógica.',
  } : {
    D: 'Direct, concise communication. Prefers to get to the point and talk about results.',
    I: 'Expressive, enthusiastic communication. Enjoys stories and personal connections.',
    S: 'Calm, considerate communication. Listens actively and prefers pressure-free conversations.',
    C: 'Precise, well-founded communication. Prefers data and logic.',
  };

  return styles[discStyle] || styles['S'];
}

function generateLeadershipStyle(discStyle: string, topMotivators: { key: string; value: number }[], language: Language = 'es'): string {
  const topMotivator = topMotivators[0].key;

  const baseStyles: Record<string, string> = language === 'es' ? {
    D: 'Liderazgo directivo y orientado a resultados. Toma decisiones rápidamente.',
    I: 'Liderazgo inspirador y motivacional. Crea visión y energiza al equipo.',
    S: 'Liderazgo servicial y de apoyo. Construye consenso y desarrolla a otros.',
    C: 'Liderazgo basado en expertise y estándares. Establece procesos claros.',
  } : {
    D: 'Directive, results-oriented leadership. Makes decisions quickly.',
    I: 'Inspiring, motivational leadership. Creates vision and energizes the team.',
    S: 'Servant, supportive leadership. Builds consensus and develops others.',
    C: 'Expertise and standards-based leadership. Establishes clear processes.',
  };

  let style = baseStyles[discStyle] || baseStyles['S'];

  const additions: Record<string, string> = language === 'es' ? {
    DOMINANTE: ' Busca activamente posiciones de autoridad.',
    COLABORATIVO: ' Prefiere liderar como facilitador.',
    BENEVOLO: ' Lidera con genuino interés por el equipo.',
    ALTRUISTA: ' Lidera con genuino interés por el equipo.'
  } : {
    DOMINANTE: ' Actively seeks authority positions.',
    COLABORATIVO: ' Prefers to lead as a facilitator.',
    BENEVOLO: ' Leads with genuine interest in the team.',
    ALTRUISTA: ' Leads with genuine interest in the team.'
  };

  if (additions[topMotivator]) {
    style += additions[topMotivator];
  }

  return style;
}

function generateTeamRole(discStyle: string, topMotivators: { key: string; value: number }[], language: Language = 'es'): string {
  const roles: Record<string, string> = language === 'es' ? {
    D: 'Impulsor del equipo que genera momentum y supera obstáculos. Ideal para liderar iniciativas.',
    I: 'Conector del equipo que mantiene la moral alta y facilita la comunicación.',
    S: 'Estabilizador del equipo que mantiene cohesión y consistencia.',
    C: 'Especialista del equipo que garantiza calidad y precisión.',
  } : {
    D: 'Team driver who generates momentum and overcomes obstacles. Ideal for leading initiatives.',
    I: 'Team connector who keeps morale high and facilitates communication.',
    S: 'Team stabilizer who maintains cohesion and consistency.',
    C: 'Team specialist who ensures quality and precision.',
  };

  return roles[discStyle] || roles['S'];
}

function generateStressManagement(discStyle: string, topMotivators: { key: string; value: number }[], language: Language = 'es'): string {
  const stressors: Record<string, string> = language === 'es' ? {
    D: 'Se estresa con falta de control o resultados lentos. Bajo presión puede volverse impaciente. Necesita autonomía y desafíos.',
    I: 'Se estresa con aislamiento o tareas muy detalladas. Bajo presión puede perder enfoque. Necesita interacción y reconocimiento.',
    S: 'Se estresa con cambios abruptos o conflictos. Bajo presión puede volverse pasivo. Necesita estabilidad y tiempo para adaptarse.',
    C: 'Se estresa con ambigüedad o errores. Bajo presión puede volverse excesivamente crítico. Necesita claridad y estándares.',
  } : {
    D: 'Gets stressed with lack of control or slow results. Under pressure may become impatient. Needs autonomy and challenges.',
    I: 'Gets stressed with isolation or very detailed tasks. Under pressure may lose focus. Needs interaction and recognition.',
    S: 'Gets stressed with abrupt changes or conflicts. Under pressure may become passive. Needs stability and time to adapt.',
    C: 'Gets stressed with ambiguity or errors. Under pressure may become overly critical. Needs clarity and standards.',
  };

  return stressors[discStyle] || stressors['S'];
}

function generateIntegratedInsights(discStyle: string, topMotivators: string[], discData: DiscData, dfData: DFData, language: Language = 'es'): string[] {
  const insights: string[] = [];
  const topMotivator = topMotivators[0];

  const insightTexts = language === 'es' ? {
    D_COLABORATIVO: 'Tu comportamiento orientado a resultados se equilibra con una motivación colaborativa. Puedes liderar eficazmente cuando canalizas tu energía hacia el apoyo del equipo.',
    I_INTELECTUAL: 'Tu carisma natural combinado con curiosidad intelectual te convierte en un excelente comunicador de ideas complejas.',
    S_RECEPTIVO: 'Aunque prefieres estabilidad, tu motivación receptiva indica apertura a nuevas ideas. Puedes implementar cambios de manera gradual.',
    C_ARMONIOSO: 'Tu precisión analítica se complementa con una apreciación por la armonía. Buscas soluciones que sean correctas y agradables.',
    balanced: 'Tu perfil DISC es relativamente equilibrado, lo que indica adaptabilidad conductual.',
    specialized: 'Tienes un estilo DISC muy definido con marcada especialización.',
    D_DOMINANTE: 'Alta coherencia entre tu comportamiento (Dominante) y motivación (Dominante).',
    I_ARMONIOSO: 'Tu estilo influyente se alinea con tu búsqueda de armonía.',
    S_ESTRUCTURADO: 'Tu preferencia por estabilidad se refuerza con motivación por métodos tradicionales.',
    C_INTELECTUAL: 'Tu comportamiento analítico se potencia con motivación intelectual.',
    receptive: 'Tu motivación receptiva hacia nuevas ideas puede ser tu catalizador de crecimiento.',
    helping: 'Tu orientación hacia ayudar a otros es una fortaleza valiosa. Asegúrate de también cuidar tus propias necesidades.',
    generic: 'La combinación de tu perfil DISC con tus motivadores crea un estilo profesional único.'
  } : {
    D_COLABORATIVO: 'Your results-oriented behavior is balanced by collaborative motivation. You can lead effectively by channeling your energy to team support.',
    I_INTELECTUAL: 'Your natural charisma combined with intellectual curiosity makes you an excellent communicator of complex ideas.',
    S_RECEPTIVO: 'Although you prefer stability, your receptive motivation indicates openness to new ideas. You can implement changes gradually.',
    C_ARMONIOSO: 'Your analytical precision is complemented by an appreciation for harmony. You seek solutions that are both correct and pleasant.',
    balanced: 'Your DISC profile is relatively balanced, indicating behavioral adaptability.',
    specialized: 'You have a very defined DISC style with marked specialization.',
    D_DOMINANTE: 'High coherence between your behavior (Dominant) and motivation (Dominant).',
    I_ARMONIOSO: 'Your influential style aligns with your search for harmony.',
    S_ESTRUCTURADO: 'Your preference for stability is reinforced by motivation for traditional methods.',
    C_INTELECTUAL: 'Your analytical behavior is enhanced by intellectual motivation.',
    receptive: 'Your receptive motivation towards new ideas can be your growth catalyst.',
    helping: 'Your orientation towards helping others is a valuable strength. Make sure to also take care of your own needs.',
    generic: 'The combination of your DISC profile with your motivators creates a unique professional style.'
  };
  
  if (discStyle === 'D' && topMotivator === 'COLABORATIVO') {
    insights.push(insightTexts.D_COLABORATIVO);
  } else if (discStyle === 'I' && topMotivator === 'INTELECTUAL') {
    insights.push(insightTexts.I_INTELECTUAL);
  } else if (discStyle === 'S' && topMotivator === 'RECEPTIVO') {
    insights.push(insightTexts.S_RECEPTIVO);
  } else if (discStyle === 'C' && topMotivator === 'ARMONIOSO') {
    insights.push(insightTexts.C_ARMONIOSO);
  }

  const scores = [discData.percentileD, discData.percentileI, discData.percentileS, discData.percentileC];
  const avgDisc = scores.reduce((a, b) => a + b) / 4;
  const variance = Math.sqrt(scores.reduce((sum, s) => sum + Math.pow(s - avgDisc, 2), 0) / 4);
  
  if (variance < 15) {
    insights.push(insightTexts.balanced);
  } else if (variance > 25) {
    insights.push(insightTexts.specialized);
  }

  if (discStyle === 'D' && topMotivators.includes('DOMINANTE')) {
    insights.push(insightTexts.D_DOMINANTE);
  } else if (discStyle === 'I' && topMotivators.includes('ARMONIOSO')) {
    insights.push(insightTexts.I_ARMONIOSO);
  } else if (discStyle === 'S' && topMotivators.includes('ESTRUCTURADO')) {
    insights.push(insightTexts.S_ESTRUCTURADO);
  } else if (discStyle === 'C' && topMotivators.includes('INTELECTUAL')) {
    insights.push(insightTexts.C_INTELECTUAL);
  }

  if (topMotivators.includes('RECEPTIVO') && !['I'].includes(discStyle)) {
    insights.push(insightTexts.receptive);
  }

  if (topMotivators.includes('BENEVOLO') || topMotivators.includes('ALTRUISTA')) {
    insights.push(insightTexts.helping);
  }

  if (insights.length < 3) {
    insights.push(insightTexts.generic);
  }

  return insights.slice(0, 5);
}
