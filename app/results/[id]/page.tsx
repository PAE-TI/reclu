
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import ExportButton from '@/components/export-button';
import ShareButton from '@/components/share-button';
import {
  Brain,
  BarChart3,
  Star,
  TrendingUp,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Home
} from 'lucide-react';

export default async function Results({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Obtener evaluación con resultados e interpretación
  const evaluation = await prisma.discEvaluation.findFirst({
    where: { 
      id: params.id,
      userId: session.user.id 
    },
    include: {
      results: {
        include: {
          interpretation: true,
        },
      },
      responses: true,
    },
  });

  if (!evaluation || !evaluation.results?.[0]) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Evaluación no encontrada</h2>
              <p className="text-gray-600 mb-6">No se encontraron resultados para esta evaluación.</p>
              <Link href="/dashboard">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Volver al Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const result = evaluation.results[0];
  const interpretation = result.interpretation;

  // Función para obtener color de dimensión
  const getDimensionColor = (dimension: string) => {
    switch (dimension) {
      case 'D': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
      case 'I': return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' };
      case 'S': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
      case 'C': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const primaryColor = getDimensionColor(result.primaryStyle);
  const secondaryColor = result.secondaryStyle ? getDimensionColor(result.secondaryStyle) : null;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultados DISC</h1>
              <p className="text-lg text-gray-600">{evaluation.title}</p>
              <p className="text-sm text-gray-500 mt-1">
                Completado el {new Date(evaluation.completedAt!).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <ExportButton 
                evaluationId={evaluation.id}
                title="Exportar PDF"
                variant="outline"
              />
              <ShareButton 
                evaluationId={evaluation.id}
                evaluationTitle={evaluation.title}
                variant="outline"
              />
              <Link href="/dashboard">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personality Type */}
            <Card className={`${primaryColor.bg} ${primaryColor.border} border-2 shadow-xl`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`text-2xl ${primaryColor.text} flex items-center gap-2`}>
                      <Star className="w-6 h-6" />
                      {interpretation?.title || `Tipo ${result.personalityType}`}
                    </CardTitle>
                    <CardDescription className={primaryColor.text}>
                      Tu perfil de personalidad dominante
                    </CardDescription>
                  </div>
                  <div className="text-center">
                    <div className={`w-16 h-16 ${primaryColor.bg} ${primaryColor.border} border-2 rounded-full flex items-center justify-center`}>
                      <span className={`text-2xl font-bold ${primaryColor.text}`}>{result.primaryStyle}</span>
                    </div>
                    {result.secondaryStyle && (
                      <div className={`w-12 h-12 ${secondaryColor?.bg} ${secondaryColor?.border} border-2 rounded-full flex items-center justify-center mt-2`}>
                        <span className={`text-lg font-bold ${secondaryColor?.text}`}>{result.secondaryStyle}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-lg ${primaryColor.text} mb-4`}>
                  {interpretation?.description}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`w-4 h-4 ${primaryColor.text}`} />
                  <span className={`font-medium ${primaryColor.text}`}>
                    Intensidad del estilo: {result.styleIntensity.toFixed(1)}%
                  </span>
                </div>
                {result.secondaryStyle && (
                  <p className={`text-sm ${primaryColor.text}`}>
                    Estilo secundario: <strong>{result.secondaryStyle}</strong> - Complementa tu perfil principal
                  </p>
                )}
              </CardContent>
            </Card>

            {/* DISC Scores */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Puntuaciones DISC
                </CardTitle>
                <CardDescription>
                  Distribución de tus características de personalidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { label: 'D - Dominante', score: result.percentileD, color: 'bg-red-500', description: 'Orientado a resultados' },
                    { label: 'I - Influyente', score: result.percentileI, color: 'bg-yellow-500', description: 'Orientado a personas' },
                    { label: 'S - Estable', score: result.percentileS, color: 'bg-green-500', description: 'Orientado a estabilidad' },
                    { label: 'C - Concienzudo', score: result.percentileC, color: 'bg-blue-500', description: 'Orientado a precisión' }
                  ].map((dimension) => (
                    <div key={dimension.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900">{dimension.label}</span>
                          <p className="text-sm text-gray-600">{dimension.description}</p>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{dimension.score.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`${dimension.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${dimension.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Challenges */}
            {interpretation && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-green-50 border-green-200 border shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      Fortalezas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {interpretation.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-2 text-green-700">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-200 border shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <Target className="w-5 h-5" />
                      Áreas de Desarrollo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {interpretation.challenges.map((challenge, index) => (
                        <li key={index} className="flex items-center gap-2 text-amber-700">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                          <span className="text-sm">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{result.personalityType}</div>
                  <div className="text-sm text-gray-600">Tipo de Personalidad</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-indigo-600">{evaluation.responses.length}</div>
                    <div className="text-xs text-gray-600">Preguntas</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{result.styleIntensity.toFixed(0)}%</div>
                    <div className="text-xs text-gray-600">Intensidad</div>
                  </div>
                </div>

                {/* Pattern Flags */}
                <div className="space-y-2">
                  {result.isOvershift && (
                    <Badge variant="outline" className="w-full justify-center text-orange-700 border-orange-300">
                      Patrón Overshift detectado
                    </Badge>
                  )}
                  {result.isUndershift && (
                    <Badge variant="outline" className="w-full justify-center text-blue-700 border-blue-300">
                      Patrón Undershift detectado
                    </Badge>
                  )}
                  {result.isTightPattern && (
                    <Badge variant="outline" className="w-full justify-center text-purple-700 border-purple-300">
                      Patrón Tight detectado
                    </Badge>
                  )}
                  {!result.isOvershift && !result.isUndershift && !result.isTightPattern && (
                    <Badge variant="outline" className="w-full justify-center text-green-700 border-green-300">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Patrón normal
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Motivators & Stressors */}
            {interpretation && (
              <>
                <Card className="bg-blue-50 border-blue-200 border shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
                      <TrendingUp className="w-4 h-4" />
                      Motivadores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {interpretation.motivators.slice(0, 3).map((motivator, index) => (
                        <li key={index} className="flex items-center gap-2 text-blue-700">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">{motivator}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200 border shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800 text-lg">
                      <AlertTriangle className="w-4 h-4" />
                      Estresores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {interpretation.stressors.slice(0, 3).map((stressor, index) => (
                        <li key={index} className="flex items-center gap-2 text-red-700">
                          <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                          <span className="text-sm">{stressor}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Próximos Pasos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/evaluation/new">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Nueva Evaluación
                  </Button>
                </Link>
                
                <Link href="/evaluations">
                  <Button variant="outline" className="w-full">
                    Todas las Evaluaciones
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Compartir con Equipo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
