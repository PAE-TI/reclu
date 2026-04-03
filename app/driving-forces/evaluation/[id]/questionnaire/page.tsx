
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Target,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface Question {
  id: string;
  questionNumber: number;
  questionText: string;
  statementA: string;
  statementB: string;
  statementC: string;
  statementD: string;
}

interface Response {
  rankingA: number;
  rankingB: number;
  rankingC: number;
  rankingD: number;
}

export default function DrivingForcesQuestionnaire({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: Response }>({});
  const [currentResponse, setCurrentResponse] = useState<Response>({
    rankingA: 0,
    rankingB: 0,
    rankingC: 0,
    rankingD: 0
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchQuestions();
    }
  }, [status]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/driving-forces/questions');
      if (!response.ok) throw new Error('Error al cargar preguntas');
      
      const data = await response.json();
      setQuestions(data.questions);
      setStartTime(new Date());
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRankingChange = (statement: keyof Response, ranking: number) => {
    // Verificar si el ranking ya está usado
    const currentRankings = Object.values(currentResponse);
    if (currentRankings.includes(ranking) && currentResponse[statement] !== ranking) {
      // Encontrar qué statement tiene ese ranking y limpiarlo
      Object.keys(currentResponse).forEach(key => {
        if (currentResponse[key as keyof Response] === ranking) {
          setCurrentResponse(prev => ({ ...prev, [key]: 0 }));
        }
      });
    }

    setCurrentResponse(prev => ({ ...prev, [statement]: ranking }));
  };

  const isCurrentResponseValid = () => {
    const rankings = Object.values(currentResponse);
    const validRankings = rankings.filter(r => r >= 1 && r <= 4);
    const uniqueRankings = new Set(validRankings);
    
    return validRankings.length === 4 && uniqueRankings.size === 4;
  };

  const saveCurrentResponse = async () => {
    if (!isCurrentResponseValid()) return false;

    const question = questions[currentQuestionIndex];
    const responseTime = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : null;

    try {
      const response = await fetch(`/api/driving-forces/evaluations/${params.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          questionNumber: question.questionNumber,
          ...currentResponse,
          responseTime
        }),
      });

      if (!response.ok) throw new Error('Error al guardar respuesta');

      // Guardar respuesta localmente
      setResponses(prev => ({
        ...prev,
        [question.id]: { ...currentResponse }
      }));

      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    }
  };

  const handleNext = async () => {
    if (!isCurrentResponseValid()) {
      setError('Por favor, asigna un ranking del 1 al 4 a cada opción, sin repetir números');
      return;
    }

    setError('');
    const saved = await saveCurrentResponse();
    
    if (saved) {
      if (currentQuestionIndex < questions.length - 1) {
        // Siguiente pregunta
        setCurrentQuestionIndex(prev => prev + 1);
        setCurrentResponse({ rankingA: 0, rankingB: 0, rankingC: 0, rankingD: 0 });
        setStartTime(new Date());
      } else {
        // Completar evaluación
        await completeEvaluation();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      
      // Cargar respuesta anterior si existe
      const prevQuestion = questions[currentQuestionIndex - 1];
      const prevResponse = responses[prevQuestion.id];
      if (prevResponse) {
        setCurrentResponse(prevResponse);
      } else {
        setCurrentResponse({ rankingA: 0, rankingB: 0, rankingC: 0, rankingD: 0 });
      }
      setStartTime(new Date());
    }
  };

  const completeEvaluation = async () => {
    setSubmitting(true);
    
    try {
      const response = await fetch(`/api/driving-forces/evaluations/${params.id}/complete`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Error al completar evaluación');

      const data = await response.json();
      
      // Redireccionar a resultados
      router.push(`/driving-forces/results/${data.result.id}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evaluación...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No hay preguntas disponibles</h3>
            <p className="text-gray-600 mb-4">
              Las preguntas de Driving Forces no están configuradas aún.
            </p>
            <Link href="/dashboard">
              <Button>Volver al Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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
          
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Evaluación Driving Forces
              </h1>
              <p className="text-lg text-gray-600">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progreso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Pregunta */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestion.questionText}
            </CardTitle>
            <CardDescription>
              Ordena las opciones del 1 (Más como tú) al 4 (Menos como tú)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { key: 'rankingA' as keyof Response, statement: currentQuestion.statementA, label: 'A' },
                { key: 'rankingB' as keyof Response, statement: currentQuestion.statementB, label: 'B' },
                { key: 'rankingC' as keyof Response, statement: currentQuestion.statementC, label: 'C' },
                { key: 'rankingD' as keyof Response, statement: currentQuestion.statementD, label: 'D' },
              ].map(({ key, statement, label }) => (
                <div key={key} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-semibold text-indigo-600">
                      {label}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 mb-3">{statement}</p>
                      
                      {/* Ranking Buttons */}
                      <div className="flex gap-2">
                        {[1, 2, 3, 4].map(ranking => (
                          <button
                            key={ranking}
                            onClick={() => handleRankingChange(key, ranking)}
                            className={`
                              w-10 h-10 rounded-full font-semibold transition-all
                              ${currentResponse[key] === ranking 
                                ? 'bg-indigo-600 text-white shadow-lg transform scale-110' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              }
                            `}
                          >
                            {ranking}
                          </button>
                        ))}
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-2">
                        {currentResponse[key] === 1 && 'Más como tú'}
                        {currentResponse[key] === 2 && 'Bastante como tú'}
                        {currentResponse[key] === 3 && 'Un poco como tú'}
                        {currentResponse[key] === 4 && 'Menos como tú'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="text-sm text-gray-500">
            {Object.values(currentResponse).filter(r => r > 0).length} de 4 opciones completadas
          </div>

          <Button
            onClick={handleNext}
            disabled={!isCurrentResponseValid() || submitting}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Completando...
              </>
            ) : currentQuestionIndex === questions.length - 1 ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Completar
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
