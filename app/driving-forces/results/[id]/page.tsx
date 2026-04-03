
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import {
  ArrowLeft,
  Target,
  TrendingUp,
  Award,
  Lightbulb,
  AlertTriangle,
  Download,
  Share,
  BarChart3,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface DrivingForcesResult {
  id: string;
  primaryMotivators: string[];
  situationalMotivators: string[];
  indifferentMotivators: string[];
  topMotivator: string;
  secondMotivator: string;
  thirdMotivator: string;
  fourthMotivator: string;
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
  interpretation?: {
    title: string;
    description: string;
    strengths: string[];
    challenges: string[];
    energizers: string[];
    stressors: string[];
    idealEnvironment: string;
    workPreferences: string;
    avoidanceAreas: string[];
    developmentTips: string[];
    careerAlignment: string[];
  };
  evaluation: {
    title: string;
    completedAt: string;
  };
}

export default function DrivingForcesResults({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [result, setResult] = useState<DrivingForcesResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchResult();
    }
  }, [status]);

  const fetchResult = async () => {
    try {
      const response = await fetch(`/api/driving-forces/results/${params.id}`);
      if (!response.ok) throw new Error('Error al cargar resultado');
      
      const data = await response.json();
      setResult(data.result);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMotivatorDisplayName = (motivator: string): string => {
    const names: { [key: string]: string } = {
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
    return names[motivator] || motivator;
  };

  const getMotivatorColor = (motivator: string): string => {
    const colors: { [key: string]: string } = {
      INTELECTUAL: 'bg-blue-100 text-blue-800',
      INSTINTIVO: 'bg-green-100 text-green-800',
      PRACTICO: 'bg-yellow-100 text-yellow-800',
      ALTRUISTA: 'bg-purple-100 text-purple-800',
      ARMONIOSO: 'bg-pink-100 text-pink-800',
      OBJETIVO: 'bg-indigo-100 text-indigo-800',
      BENEVOLO: 'bg-red-100 text-red-800',
      INTENCIONAL: 'bg-orange-100 text-orange-800',
      DOMINANTE: 'bg-teal-100 text-teal-800',
      COLABORATIVO: 'bg-cyan-100 text-cyan-800',
      ESTRUCTURADO: 'bg-lime-100 text-lime-800',
      RECEPTIVO: 'bg-emerald-100 text-emerald-800',
    };
    return colors[motivator] || 'bg-gray-100 text-gray-800';
  };

  const getAllMotivatorScores = () => {
    if (!result) return [];
    
    return [
      { name: 'Intelectual', key: 'INTELECTUAL', score: result.intelectualPercentile },
      { name: 'Instintivo', key: 'INSTINTIVO', score: result.instintivoPercentile },
      { name: 'Práctico', key: 'PRACTICO', score: result.practicoPercentile },
      { name: 'Altruista', key: 'ALTRUISTA', score: result.altruistaPercentile },
      { name: 'Armonioso', key: 'ARMONIOSO', score: result.armoniosoPercentile },
      { name: 'Objetivo', key: 'OBJETIVO', score: result.objetivoPercentile },
      { name: 'Benévolo', key: 'BENEVOLO', score: result.benevoloPercentile },
      { name: 'Intencional', key: 'INTENCIONAL', score: result.intencionalPercentile },
      { name: 'Dominante', key: 'DOMINANTE', score: result.dominantePercentile },
      { name: 'Colaborativo', key: 'COLABORATIVO', score: result.colaborativoPercentile },
      { name: 'Estructurado', key: 'ESTRUCTURADO', score: result.estructuradoPercentile },
      { name: 'Receptivo', key: 'RECEPTIVO', score: result.receptivoPercentile },
    ].sort((a, b) => b.score - a.score);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Error al cargar resultados</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/dashboard">
              <Button>Volver al Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Resultado no encontrado</h3>
            <p className="text-gray-600 mb-4">
              No se pudo encontrar el resultado solicitado.
            </p>
            <Link href="/dashboard">
              <Button>Volver al Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const motivatorScores = getAllMotivatorScores();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Resultados Driving Forces
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    {result.evaluation.title}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Completado: {new Date(result.evaluation.completedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Perfil Motivacional Principal */}
            {result.interpretation && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-yellow-600" />
                    <div>
                      <CardTitle className="text-2xl">{result.interpretation.title}</CardTitle>
                      <CardDescription>Tu perfil motivacional principal</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {result.interpretation.description}
                  </p>

                  {/* Top 4 Motivadores */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Tus Motivadores Principales</h3>
                    <div className="flex flex-wrap gap-2">
                      {[result.topMotivator, result.secondMotivator, result.thirdMotivator, result.fourthMotivator]
                        .filter(Boolean)
                        .map((motivator, index) => (
                        <Badge
                          key={motivator}
                          className={`${getMotivatorColor(motivator)} text-sm px-3 py-1`}
                        >
                          #{index + 1} {getMotivatorDisplayName(motivator)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fortalezas */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-gray-900">Fortalezas</h4>
                      </div>
                      <ul className="space-y-2">
                        {result.interpretation.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Energizadores */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        <h4 className="font-semibold text-gray-900">Te Energiza</h4>
                      </div>
                      <ul className="space-y-2">
                        {result.interpretation.energizers.map((energizer, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                            {energizer}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ambiente Laboral Ideal */}
            {result.interpretation && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-indigo-600" />
                    Ambiente y Preferencias Laborales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ambiente Ideal</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {result.interpretation.idealEnvironment}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Preferencias de Trabajo</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {result.interpretation.workPreferences}
                    </p>
                  </div>

                  {/* Áreas de Desarrollo */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Recomendaciones de Desarrollo</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {result.interpretation.developmentTips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2"></div>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Carreras Alineadas */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Carreras Alineadas</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.interpretation.careerAlignment.map((career, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {career}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            {/* Resumen de Clusters */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg">Clusters Motivacionales</CardTitle>
                <CardDescription>
                  Agrupación de tus 12 fuerzas motivacionales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Primarios */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-sm text-gray-900">Primarios (Top 4)</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.primaryMotivators.map(motivator => (
                      <Badge
                        key={motivator}
                        className="text-xs px-2 py-0.5 bg-green-100 text-green-800"
                      >
                        {getMotivatorDisplayName(motivator)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Situacionales */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-semibold text-sm text-gray-900">Situacionales</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.situationalMotivators.map(motivator => (
                      <Badge
                        key={motivator}
                        className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800"
                      >
                        {getMotivatorDisplayName(motivator)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Indiferentes */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="font-semibold text-sm text-gray-900">Indiferentes</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.indifferentMotivators.map(motivator => (
                      <Badge
                        key={motivator}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600"
                      >
                        {getMotivatorDisplayName(motivator)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Scores */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Intensidad Motivacional
                </CardTitle>
                <CardDescription>
                  Nivel de cada fuerza motivacional (0-100)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {motivatorScores.map((motivator, index) => (
                    <div key={motivator.key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {motivator.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {Math.round(Math.min(100, Math.max(0, motivator.score)))}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(100, Math.max(0, motivator.score))}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/driving-forces/new">
                  <Button className="w-full">
                    <Target className="w-4 h-4 mr-2" />
                    Nueva Evaluación
                  </Button>
                </Link>
                
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    Ver Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
