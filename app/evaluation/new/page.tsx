
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export default function NewEvaluation() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  if (!session) {
    redirect('/auth/signin');
  }

  const handleStartEvaluation = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Generar título automático
      const now = new Date();
      const autoTitle = `Test de Manual Interno - ${now.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      })}`;

      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: autoTitle,
          description: null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la evaluación');
      }

      // Redirigir al cuestionario
      router.push(`/evaluation/${data.evaluation.id}/questionnaire`);
    } catch (error: any) {
      console.error('Error creating evaluation:', error);
      setError(error.message || 'Error interno. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="hover:bg-white/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Test de Manual Interno</CardTitle>
                    <CardDescription>
                      Evaluación DISC de personalidad
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Instrucciones</h3>
                    <ul className="text-blue-700 text-sm space-y-2">
                      <li>• Lee cada pregunta cuidadosamente</li>
                      <li>• Selecciona la opción que mejor te describe</li>
                      <li>• No hay respuestas correctas o incorrectas</li>
                      <li>• Responde de manera espontánea y honesta</li>
                    </ul>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Link href="/dashboard" className="flex-1">
                      <Button variant="outline" className="w-full" type="button">
                        Cancelar
                      </Button>
                    </Link>
                    <Button 
                      onClick={handleStartEvaluation}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Iniciando...' : 'Comenzar Evaluación'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  ¿Qué esperar?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold text-blue-600">24</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Preguntas balanceadas</h4>
                    <p className="text-sm text-gray-600">Cuestionario científicamente validado con preguntas sobre adjetivos y escenarios</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">10-15 minutos</h4>
                    <p className="text-sm text-gray-600">Tiempo promedio para completar la evaluación completa</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Brain className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Análisis inmediato</h4>
                    <p className="text-sm text-gray-600">Resultados y reporte detallado disponibles al instante</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Dimensiones DISC</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-white font-bold">D</span>
                    </div>
                    <div className="text-xs text-gray-600">Dominante</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-white font-bold">I</span>
                    </div>
                    <div className="text-xs text-gray-600">Influyente</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-white font-bold">S</span>
                    </div>
                    <div className="text-xs text-gray-600">Estable</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-white font-bold">C</span>
                    </div>
                    <div className="text-xs text-gray-600">Concienzudo</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
