'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/language-context';

interface DrivingForcesChartProps {
  data: {
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
    topMotivator?: string;
  };
  title?: string;
  showDetails?: boolean;
  compact?: boolean;
  language?: Language;
}

const getForceLabels = (lang: Language): Record<string, { name: string; description: string; color: string; pair: string }> => {
  const isEn = lang === 'en';
  return {
    INTELECTUAL: { 
      name: isEn ? 'Intellectual' : 'Intelectual', 
      description: isEn ? 'Motivated by opportunities to learn' : 'Motivado por oportunidades de aprender', 
      color: '#3B82F6', 
      pair: isEn ? 'Knowledge' : 'Conocimiento' 
    },
    INSTINTIVO: { 
      name: isEn ? 'Instinctive' : 'Instintivo', 
      description: isEn ? 'Uses past experiences and intuition' : 'Usa experiencias pasadas e intuición', 
      color: '#8B5CF6', 
      pair: isEn ? 'Knowledge' : 'Conocimiento' 
    },
    PRACTICO: { 
      name: isEn ? 'Practical' : 'Práctico', 
      description: isEn ? 'Practical results and efficiency' : 'Resultados prácticos y eficiencia', 
      color: '#10B981', 
      pair: isEn ? 'Utility' : 'Utilidad' 
    },
    ALTRUISTA: { 
      name: isEn ? 'Altruistic' : 'Altruista', 
      description: isEn ? 'Complete tasks without expecting return' : 'Completar tareas sin expectativa de retorno', 
      color: '#06B6D4', 
      pair: isEn ? 'Utility' : 'Utilidad' 
    },
    ARMONIOSO: { 
      name: isEn ? 'Harmonious' : 'Armonioso', 
      description: isEn ? 'Experience and balance in the environment' : 'Experiencia y equilibrio en el entorno', 
      color: '#F59E0B', 
      pair: isEn ? 'Environment' : 'Entorno' 
    },
    OBJETIVO: { 
      name: isEn ? 'Objective' : 'Objetivo', 
      description: isEn ? 'Functionality and objectivity' : 'Funcionalidad y objetividad', 
      color: '#EF4444', 
      pair: isEn ? 'Environment' : 'Entorno' 
    },
    BENEVOLO: { 
      name: isEn ? 'Benevolent' : 'Benévolo', 
      description: isEn ? 'Help others for personal satisfaction' : 'Ayudar a otros por satisfacción personal', 
      color: '#EC4899', 
      pair: isEn ? 'Others' : 'Otros' 
    },
    INTENCIONAL: { 
      name: isEn ? 'Intentional' : 'Intencional', 
      description: isEn ? 'Help others with specific purpose' : 'Ayudar a otros con propósito específico', 
      color: '#84CC16', 
      pair: isEn ? 'Others' : 'Otros' 
    },
    DOMINANTE: { 
      name: isEn ? 'Dominant' : 'Dominante', 
      description: isEn ? 'Status, recognition and control' : 'Estatus, reconocimiento y control', 
      color: '#F97316', 
      pair: isEn ? 'Power' : 'Poder' 
    },
    COLABORATIVO: { 
      name: isEn ? 'Collaborative' : 'Colaborativo', 
      description: isEn ? 'Supporting role with little need for recognition' : 'Rol de apoyo con poca necesidad de reconocimiento', 
      color: '#14B8A6', 
      pair: isEn ? 'Power' : 'Poder' 
    },
    ESTRUCTURADO: { 
      name: isEn ? 'Structured' : 'Estructurado', 
      description: isEn ? 'Traditional approaches and proven methods' : 'Enfoques tradicionales y métodos probados', 
      color: '#6366F1', 
      pair: isEn ? 'Methodology' : 'Metodología' 
    },
    RECEPTIVO: { 
      name: isEn ? 'Receptive' : 'Receptivo', 
      description: isEn ? 'New ideas and opportunities outside the system' : 'Nuevas ideas y oportunidades fuera del sistema', 
      color: '#A855F7', 
      pair: isEn ? 'Methodology' : 'Metodología' 
    },
  };
};

export default function DrivingForcesChart({ 
  data, 
  title,
  showDetails = true,
  compact = false,
  language: propLanguage
}: DrivingForcesChartProps) {
  const { language: contextLanguage } = useLanguage();
  const language = propLanguage || contextLanguage;
  const forceLabels = useMemo(() => getForceLabels(language), [language]);
  const defaultTitle = language === 'es' ? 'Fuerzas Motivadoras' : 'Driving Forces';
  const chartData = useMemo(() => {
    const forces = [
      { key: 'INTELECTUAL', value: data.intelectualPercentile },
      { key: 'INSTINTIVO', value: data.instintivoPercentile },
      { key: 'PRACTICO', value: data.practicoPercentile },
      { key: 'ALTRUISTA', value: data.altruistaPercentile },
      { key: 'ARMONIOSO', value: data.armoniosoPercentile },
      { key: 'OBJETIVO', value: data.objetivoPercentile },
      { key: 'BENEVOLO', value: data.benevoloPercentile },
      { key: 'INTENCIONAL', value: data.intencionalPercentile },
      { key: 'DOMINANTE', value: data.dominantePercentile },
      { key: 'COLABORATIVO', value: data.colaborativoPercentile },
      { key: 'ESTRUCTURADO', value: data.estructuradoPercentile },
      { key: 'RECEPTIVO', value: data.receptivoPercentile },
    ].map(f => ({
      name: forceLabels[f.key].name,
      value: parseFloat(f.value.toFixed(1)),
      fullName: f.key,
      color: forceLabels[f.key].color,
      description: forceLabels[f.key].description,
      pair: forceLabels[f.key].pair,
    })).sort((a, b) => b.value - a.value);

    return forces;
  }, [data]);

  const topForces = chartData.slice(0, 4);
  const bottomForces = chartData.slice(-4);

  const dimensionLabel = language === 'es' ? 'Dimensión' : 'Dimension';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold" style={{ color: item.color }}>
            {item.name}: {item.value}%
          </p>
          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          <p className="text-xs text-gray-400 mt-1">{dimensionLabel}: {item.pair}</p>
        </div>
      );
    }
    return null;
  };

  const getCategoryIcon = (value: number) => {
    if (value >= 70) return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (value >= 40) return <Minus className="w-3 h-3 text-yellow-600" />;
    return <TrendingDown className="w-3 h-3 text-gray-400" />;
  };

  const mainMotivatorLabel = language === 'es' ? 'Motivador Principal' : 'Main Motivator';
  const topMotivatorsLabel = language === 'es' ? 'Motivadores Principales' : 'Main Motivators';
  const indifferentMotivatorsLabel = language === 'es' ? 'Motivadores Indiferentes' : 'Indifferent Motivators';

  if (compact) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            {title || defaultTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topForces.map((force, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: force.color }}
                />
                <span className="text-sm flex-1">{force.name}</span>
                <span className="text-sm font-semibold">{force.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          {title || defaultTitle}
        </CardTitle>
        {data.topMotivator && (
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              className="text-white"
              style={{ backgroundColor: forceLabels[data.topMotivator]?.color || '#6366F1' }}
            >
              {mainMotivatorLabel}: {forceLabels[data.topMotivator]?.name || data.topMotivator}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={showDetails ? 'h-80' : 'h-64'}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={75}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Main Motivators */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {topMotivatorsLabel}
              </h4>
              <div className="space-y-2">
                {topForces.map((force, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: force.color }}
                    />
                    <span className="text-sm flex-1 text-gray-700">{force.name}</span>
                    <Badge variant="outline" className="text-xs bg-white">
                      {force.value}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Indifferent Motivators */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Minus className="w-4 h-4" />
                {indifferentMotivatorsLabel}
              </h4>
              <div className="space-y-2">
                {bottomForces.map((force, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full opacity-50"
                      style={{ backgroundColor: force.color }}
                    />
                    <span className="text-sm flex-1 text-gray-600">{force.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {force.value}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
