'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Target,
  Award,
  Activity,
  Calendar,
  Brain,
  Sparkles
} from 'lucide-react';

interface DiscProfile {
  dominante: number;
  influyente: number;
  estable: number;
  concienzudo: number;
}

interface DFProfile {
  topMotivators: string[];
  averages: Record<string, number>;
}

interface AnalyticsSummaryProps {
  discCount: number;
  dfCount: number;
  averageDiscProfile: DiscProfile | null;
  averageDFProfile: DFProfile | null;
  primaryDiscStyle: string;
  topMotivator: string | null;
  consistencyScore: number;
  lastEvaluationDate?: string;
  improvementAreas: string[];
  hasIntegratedData: boolean;
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

export default function AnalyticsSummary({
  discCount,
  dfCount,
  averageDiscProfile,
  averageDFProfile,
  primaryDiscStyle,
  topMotivator,
  consistencyScore,
  lastEvaluationDate,
  improvementAreas,
  hasIntegratedData
}: AnalyticsSummaryProps) {
  // Use mounted state to avoid hydration mismatch with date calculations
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  
  useEffect(() => {
    setMounted(true);
    setCurrentTime(Date.now());
  }, []);

  const getDaysAgo = () => {
    if (!mounted || !lastEvaluationDate) return null;
    return Math.floor((currentTime - new Date(lastEvaluationDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  const getConsistencyLevel = (score: number) => {
    if (score >= 80) return { label: 'Muy Consistente', color: 'bg-green-500' };
    if (score >= 60) return { label: 'Consistente', color: 'bg-blue-500' };
    if (score >= 40) return { label: 'Moderadamente Consistente', color: 'bg-yellow-500' };
    return { label: 'Variable', color: 'bg-red-500' };
  };

  const consistency = getConsistencyLevel(consistencyScore);

  const getStyleColor = (style: string) => {
    switch (style.toLowerCase()) {
      case 'dominante': case 'd': return 'bg-red-500';
      case 'influyente': case 'i': return 'bg-yellow-500';
      case 'estable': case 's': return 'bg-green-500';
      case 'concienzudo': case 'c': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStyleName = (style: string) => {
    switch (style.toUpperCase()) {
      case 'D': return 'Dominante';
      case 'I': return 'Influyente';
      case 'S': return 'Estable';
      case 'C': return 'Concienzudo';
      default: return style;
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Tarjetas de Resumen Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total DISC */}
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Evaluaciones DISC</p>
                <p className="text-3xl font-bold text-gray-900">{discCount}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {discCount > 0 ? 'Perfiles analizados' : 'Sin evaluaciones'}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Fuerzas Motivadoras */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Fuerzas Motivadoras</p>
                <p className="text-3xl font-bold text-gray-900">{dfCount}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {dfCount > 0 ? 'Perfiles analizados' : 'Sin evaluaciones'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado Integrado */}
        <Card className={`border-0 shadow-lg ${hasIntegratedData ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-gray-50 to-slate-50'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${hasIntegratedData ? 'text-green-600' : 'text-gray-600'}`}>
                  Análisis Integrado
                </p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {hasIntegratedData ? 'Disponible' : 'No disponible'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {hasIntegratedData 
                    ? 'DISC + FM combinado' 
                    : 'Completa ambas evaluaciones'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${hasIntegratedData ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Sparkles className={`w-6 h-6 ${hasIntegratedData ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Última Evaluación */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Última Evaluación</p>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {lastEvaluationDate 
                    ? new Date(lastEvaluationDate).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric'
                      })
                    : 'N/A'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {lastEvaluationDate && mounted
                    ? `Hace ${getDaysAgo()} días`
                    : lastEvaluationDate ? '...' : 'Sin evaluaciones'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda Fila: Perfiles y Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Perfil DISC Promedio */}
        {averageDiscProfile && discCount > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5 text-indigo-600" />
                Perfil DISC Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-red-600 font-bold text-sm">D</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{averageDiscProfile.dominante.toFixed(0)}%</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-yellow-600 font-bold text-sm">I</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{averageDiscProfile.influyente.toFixed(0)}%</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-green-600 font-bold text-sm">S</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{averageDiscProfile.estable.toFixed(0)}%</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-blue-600 font-bold text-sm">C</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{averageDiscProfile.concienzudo.toFixed(0)}%</div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estilo Predominante:</span>
                  <Badge className={`text-white ${getStyleColor(primaryDiscStyle)}`}>
                    {getStyleName(primaryDiscStyle)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Motivadores */}
        {averageDFProfile && dfCount > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-purple-600" />
                Motivadores Principales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {averageDFProfile.topMotivators.slice(0, 4).map((motivator, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                      ${index === 0 ? 'bg-purple-600' : index === 1 ? 'bg-purple-500' : index === 2 ? 'bg-purple-400' : 'bg-purple-300'}`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700 flex-1">
                      {motivatorLabels[motivator] || motivator}
                    </span>
                    <span className="text-sm text-gray-500">
                      {averageDFProfile.averages[motivator]?.toFixed(0) || '-'}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Consistencia y Áreas de Desarrollo */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-amber-600" />
              Métricas Clave
            </CardTitle>
          </CardHeader>
          <CardContent>
            {discCount > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Consistencia de Perfil</span>
                  <span className="text-sm font-bold">{consistencyScore.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${consistency.color}`}
                    style={{ width: `${consistencyScore}%` }}
                  />
                </div>
                <Badge className={`mt-2 text-white text-xs ${consistency.color}`}>
                  {consistency.label}
                </Badge>
              </div>
            )}
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Áreas de Desarrollo</span>
              </div>
              {improvementAreas.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {improvementAreas.slice(0, 3).map((area, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-orange-700 border-orange-300">
                      {area}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  Completa más evaluaciones para identificar áreas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
