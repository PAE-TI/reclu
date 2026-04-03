'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  Target, 
  Users, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Brain,
  Sparkles,
  TrendingUp,
  Heart
} from 'lucide-react';

interface DiscEvaluationData {
  percentileD: number;
  percentileI: number;
  percentileS: number;
  percentileC: number;
  personalityType: string;
  type: string;
  isOvershift?: boolean;
  isUndershift?: boolean;
  isTightPattern?: boolean;
  createdAt: string;
  primaryStyle: string;
}

interface DFEvaluationData {
  type: string;
  createdAt: string;
  topMotivator?: string;
  primaryMotivators?: string[];
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
}

interface InsightsPanelProps {
  discEvaluations: DiscEvaluationData[];
  dfEvaluations: DFEvaluationData[];
  latestDiscEvaluation?: DiscEvaluationData;
  latestDFEvaluation?: DFEvaluationData;
  showIntegrated?: boolean;
}

interface Insight {
  id: string;
  type: 'strength' | 'opportunity' | 'trend' | 'recommendation' | 'integrated';
  icon: React.ReactNode;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'disc' | 'df' | 'integrated' | 'general';
}

const motivatorLabels: Record<string, string> = {
  INTELECTUAL: 'Intelectual',
  INSTINTIVO: 'Instintivo',
  PRACTICO: 'Práctico',
  ALTRUISTA: 'Altruista',
  ARMONIOSO: 'Armonioso',
  OBJETIVO: 'Objetivo',
  BENEVOLO: 'Benévolo',
  INTENCIONAL: 'Intencional',
  DOMINANTE: 'Dominante',
  COLABORATIVO: 'Colaborativo',
  ESTRUCTURADO: 'Estructurado',
  RECEPTIVO: 'Receptivo',
};

export default function InsightsPanel({ 
  discEvaluations, 
  dfEvaluations,
  latestDiscEvaluation, 
  latestDFEvaluation,
  showIntegrated = true
}: InsightsPanelProps) {
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    // === INSIGHTS DE DISC ===
    if (latestDiscEvaluation) {
      const { percentileD, percentileI, percentileS, percentileC } = latestDiscEvaluation;

      // Insight sobre estilo dominante
      const maxPercentile = Math.max(percentileD, percentileI, percentileS, percentileC);
      let dominantStyle = '';
      if (maxPercentile === percentileD) dominantStyle = 'Dominante';
      else if (maxPercentile === percentileI) dominantStyle = 'Influyente';
      else if (maxPercentile === percentileS) dominantStyle = 'Estable';
      else dominantStyle = 'Concienzudo';

      insights.push({
        id: 'dominant-style',
        type: 'strength',
        icon: <Brain className="w-4 h-4" />,
        title: `Fortaleza en estilo ${dominantStyle}`,
        description: `Tu puntuación de ${maxPercentile.toFixed(0)}% en ${dominantStyle} indica características muy desarrolladas en esta dimensión conductual.`,
        priority: 'high',
        category: 'disc'
      });

      // Insight sobre balance DISC
      const scores = [percentileD, percentileI, percentileS, percentileC];
      const avgScore = scores.reduce((a, b) => a + b) / 4;
      const standardDeviation = Math.sqrt(scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / 4);
      
      if (standardDeviation < 15) {
        insights.push({
          id: 'balanced-profile',
          type: 'strength',
          icon: <CheckCircle className="w-4 h-4" />,
          title: 'Perfil DISC Equilibrado',
          description: 'Tu perfil muestra balance entre las dimensiones DISC, indicando alta adaptabilidad a diferentes situaciones.',
          priority: 'medium',
          category: 'disc'
        });
      }

      // Patrones especiales
      if (latestDiscEvaluation.isOvershift) {
        insights.push({
          id: 'overshift-pattern',
          type: 'opportunity',
          icon: <AlertTriangle className="w-4 h-4" />,
          title: 'Patrón de Sobreesfuerzo Detectado',
          description: 'Podrías estar forzando comportamientos que no son naturales. Considera equilibrar tu enfoque.',
          priority: 'high',
          category: 'disc'
        });
      }
    }

    // === INSIGHTS DE FUERZAS MOTIVADORAS ===
    if (latestDFEvaluation) {
      // Obtener top motivadores
      const motivators = [
        { key: 'INTELECTUAL', value: latestDFEvaluation.intelectualPercentile },
        { key: 'INSTINTIVO', value: latestDFEvaluation.instintivoPercentile },
        { key: 'PRACTICO', value: latestDFEvaluation.practicoPercentile },
        { key: 'ALTRUISTA', value: latestDFEvaluation.altruistaPercentile },
        { key: 'ARMONIOSO', value: latestDFEvaluation.armoniosoPercentile },
        { key: 'OBJETIVO', value: latestDFEvaluation.objetivoPercentile },
        { key: 'BENEVOLO', value: latestDFEvaluation.benevoloPercentile },
        { key: 'INTENCIONAL', value: latestDFEvaluation.intencionalPercentile },
        { key: 'DOMINANTE', value: latestDFEvaluation.dominantePercentile },
        { key: 'COLABORATIVO', value: latestDFEvaluation.colaborativoPercentile },
        { key: 'ESTRUCTURADO', value: latestDFEvaluation.estructuradoPercentile },
        { key: 'RECEPTIVO', value: latestDFEvaluation.receptivoPercentile },
      ].sort((a, b) => b.value - a.value);

      const topMotivator = motivators[0];
      const secondMotivator = motivators[1];

      insights.push({
        id: 'top-motivator',
        type: 'strength',
        icon: <Target className="w-4 h-4" />,
        title: `Motivador Principal: ${motivatorLabels[topMotivator.key]}`,
        description: `Con ${topMotivator.value.toFixed(0)}%, este motivador impulsa significativamente tu toma de decisiones y satisfacción laboral.`,
        priority: 'high',
        category: 'df'
      });

      // Insight sobre combinación de motivadores
      if (topMotivator.key === 'INTELECTUAL' && secondMotivator.key === 'RECEPTIVO') {
        insights.push({
          id: 'intellectual-receptive',
          type: 'strength',
          icon: <Lightbulb className="w-4 h-4" />,
          title: 'Perfil Innovador',
          description: 'Tu combinación de motivación intelectual y receptividad te posiciona como un innovador natural abierto a nuevas ideas.',
          priority: 'medium',
          category: 'df'
        });
      }

      if (topMotivator.key === 'BENEVOLO' || topMotivator.key === 'ALTRUISTA') {
        insights.push({
          id: 'helper-profile',
          type: 'strength',
          icon: <Heart className="w-4 h-4" />,
          title: 'Orientación al Servicio',
          description: 'Tu alta motivación por ayudar a otros es una fortaleza valiosa. Asegúrate de equilibrar con autocuidado.',
          priority: 'medium',
          category: 'df'
        });
      }

      // Insight sobre motivadores bajos
      const lowestMotivator = motivators[motivators.length - 1];
      if (lowestMotivator.value < 30) {
        insights.push({
          id: 'low-motivator',
          type: 'opportunity',
          icon: <TrendingUp className="w-4 h-4" />,
          title: `Área de Desarrollo: ${motivatorLabels[lowestMotivator.key]}`,
          description: `Tareas relacionadas con ${motivatorLabels[lowestMotivator.key].toLowerCase()} pueden requerir esfuerzo adicional o delegación.`,
          priority: 'low',
          category: 'df'
        });
      }
    }

    // === INSIGHTS INTEGRADOS (DISC + FM) ===
    if (showIntegrated && latestDiscEvaluation && latestDFEvaluation) {
      const discStyle = latestDiscEvaluation.primaryStyle;
      const topMotivatorKey = latestDFEvaluation.topMotivator || 
        (latestDFEvaluation.primaryMotivators && latestDFEvaluation.primaryMotivators[0]);

      insights.push({
        id: 'integrated-available',
        type: 'integrated',
        icon: <Sparkles className="w-4 h-4" />,
        title: 'Análisis Reclu Completo Disponible',
        description: 'Tienes datos de comportamiento (DISC) y motivadores (FM). Esto permite un análisis integral de tu perfil profesional.',
        priority: 'high',
        category: 'integrated'
      });

      // Coherencia comportamiento-motivación
      if (discStyle === 'D' && topMotivatorKey === 'DOMINANTE') {
        insights.push({
          id: 'aligned-dominant',
          type: 'integrated',
          icon: <Zap className="w-4 h-4" />,
          title: 'Alta Coherencia: Líder Natural',
          description: 'Tu comportamiento dominante se alinea con motivación por liderazgo y control. Perfil muy consistente para roles de autoridad.',
          priority: 'high',
          category: 'integrated'
        });
      } else if (discStyle === 'S' && topMotivatorKey === 'COLABORATIVO') {
        insights.push({
          id: 'aligned-supportive',
          type: 'integrated',
          icon: <Users className="w-4 h-4" />,
          title: 'Alta Coherencia: Pilar del Equipo',
          description: 'Tu estabilidad conductual combinada con motivación colaborativa te convierte en un soporte invaluable para cualquier equipo.',
          priority: 'high',
          category: 'integrated'
        });
      } else if (discStyle === 'C' && topMotivatorKey === 'INTELECTUAL') {
        insights.push({
          id: 'aligned-analytical',
          type: 'integrated',
          icon: <Brain className="w-4 h-4" />,
          title: 'Alta Coherencia: Experto Analítico',
          description: 'Tu precisión metodológica se potencia con curiosidad intelectual. Ideal para roles que requieren expertise profunda.',
          priority: 'high',
          category: 'integrated'
        });
      } else if (discStyle === 'I' && topMotivatorKey === 'ARMONIOSO') {
        insights.push({
          id: 'aligned-harmonious',
          type: 'integrated',
          icon: <Heart className="w-4 h-4" />,
          title: 'Alta Coherencia: Armonizador Social',
          description: 'Tu carisma natural se combina con búsqueda de armonía. Exceles creando ambientes positivos y relaciones.',
          priority: 'high',
          category: 'integrated'
        });
      }

      // Tensiones potenciales
      if (discStyle === 'D' && topMotivatorKey === 'COLABORATIVO') {
        insights.push({
          id: 'tension-d-collaborative',
          type: 'recommendation',
          icon: <AlertTriangle className="w-4 h-4" />,
          title: 'Tensión Potencial Detectada',
          description: 'Tu comportamiento directo puede chocar con tu motivación colaborativa. Encuentra balance liderando a través del empoderamiento.',
          priority: 'medium',
          category: 'integrated'
        });
      }
    }

    // === INSIGHTS DE TENDENCIAS ===
    if (discEvaluations.length >= 2) {
      const latest = discEvaluations[0];
      const previous = discEvaluations[1];
      
      const changes = {
        D: latest.percentileD - previous.percentileD,
        I: latest.percentileI - previous.percentileI,
        S: latest.percentileS - previous.percentileS,
        C: latest.percentileC - previous.percentileC
      };

      const significantChanges = Object.entries(changes).filter(([, change]) => Math.abs(change) > 10);
      
      if (significantChanges.length > 0) {
        const [dimension, change] = significantChanges.reduce((max, curr) => 
          Math.abs(curr[1]) > Math.abs(max[1]) ? curr : max
        );
        
        const dimensionNames: Record<string, string> = { D: 'Dominante', I: 'Influyente', S: 'Estable', C: 'Concienzudo' };
        const trend = change > 0 ? 'aumento' : 'disminución';
        
        insights.push({
          id: 'significant-change',
          type: 'trend',
          icon: <ArrowRight className="w-4 h-4" />,
          title: `Cambio en ${dimensionNames[dimension]}`,
          description: `Has mostrado un ${trend} de ${Math.abs(change).toFixed(0)} puntos en tu dimensión ${dimensionNames[dimension]}.`,
          priority: 'medium',
          category: 'disc'
        });
      }
    }

    // Ordenar por prioridad y categoría
    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const categoryOrder = { integrated: 4, disc: 3, df: 2, general: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return categoryOrder[b.category] - categoryOrder[a.category];
    });
  };

  const insights = generateInsights();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strength': return 'bg-green-100 text-green-800';
      case 'opportunity': return 'bg-blue-100 text-blue-800';
      case 'trend': return 'bg-purple-100 text-purple-800';
      case 'recommendation': return 'bg-orange-100 text-orange-800';
      case 'integrated': return 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'strength': return 'Fortaleza';
      case 'opportunity': return 'Oportunidad';
      case 'trend': return 'Tendencia';
      case 'recommendation': return 'Recomendación';
      case 'integrated': return 'Integrado';
      default: return type;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'disc': return <Brain className="w-3 h-3 text-indigo-500" />;
      case 'df': return <Target className="w-3 h-3 text-purple-500" />;
      case 'integrated': return <Sparkles className="w-3 h-3 text-amber-500" />;
      default: return null;
    }
  };

  if (insights.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay suficientes datos para generar insights</p>
          <p className="text-sm text-gray-500 mt-2">
            Completa evaluaciones DISC y de Fuerzas Motivadoras para obtener insights personalizados
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          Insights Personalizados
          <Badge variant="secondary" className="ml-2">
            {insights.length} insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={`p-4 rounded-lg border transition-all hover:shadow-md
              ${insight.category === 'integrated' 
                ? 'bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-indigo-200' 
                : 'border-gray-200 bg-gray-50/50'}`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                {insight.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                  <div className="flex items-center gap-1">
                    {getCategoryIcon(insight.category)}
                    <Badge className={`text-xs ${getTypeColor(insight.type)}`}>
                      {getTypeLabel(insight.type)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
