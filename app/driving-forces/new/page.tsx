
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import {
  ArrowLeft,
  Target,
  AlertCircle,
  Zap,
  Brain,
  Heart
} from 'lucide-react';

export default function NewDrivingForcesEvaluation() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/driving-forces/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title || `Evaluación Driving Forces - ${new Date().toLocaleDateString()}`,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la evaluación');
      }

      const { evaluation } = await response.json();
      
      // Redireccionar a la evaluación
      router.push(`/driving-forces/evaluation/${evaluation.id}/questionnaire`);
    } catch (error: any) {
      setError(error.message || 'Error al crear la evaluación');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nueva Evaluación Driving Forces
              </h1>
              <p className="text-lg text-gray-600">
                Descubre tus 12 fuerzas motivacionales
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Configurar Evaluación</CardTitle>
                <CardDescription>
                  Personaliza tu evaluación de fuerzas motivacionales
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título de la Evaluación</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={`Evaluación Driving Forces - ${new Date().toLocaleDateString()}`}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">
                      Si dejas esto vacío, se generará un título automático
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción (Opcional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe el propósito de esta evaluación..."
                      rows={4}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creando Evaluación...
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          Comenzar Evaluación
                        </>
                      )}
                    </Button>
                    
                    <Link href="/dashboard">
                      <Button type="button" variant="outline" className="w-full sm:w-auto">
                        Cancelar
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Información */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  ¿Qué son las Driving Forces?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">
                  Las <strong>Driving Forces</strong> representan las 12 fuerzas motivacionales 
                  que impulsan tu comportamiento y decisiones.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Motivaciones Internas</p>
                      <p className="text-xs text-gray-600">Descubre qué te energiza y motiva verdaderamente</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Valores Personales</p>
                      <p className="text-xs text-gray-600">Identifica tus valores y prioridades fundamentales</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Dirección Profesional</p>
                      <p className="text-xs text-gray-600">Alinea tu carrera con tus motivadores naturales</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Las 12 Fuerzas Motivacionales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-1 gap-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Intelectual</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Instintivo</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Práctico</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Altruista</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs">Armonioso</span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">Objetivo</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Benévolo</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Intencional</span>
                    <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs">Dominante</span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-xs">Colaborativo</span>
                    <span className="px-2 py-1 bg-lime-100 text-lime-800 rounded text-xs">Estructurado</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs">Receptivo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-amber-800 mb-2">
                    ⏱️ Tiempo Estimado
                  </p>
                  <p className="text-2xl font-bold text-amber-900 mb-1">15-20 min</p>
                  <p className="text-xs text-amber-700">
                    10 preguntas de ranking motivacional
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
