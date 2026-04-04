
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ExternalEvaluationCompletedState from '@/components/external-evaluation-completed-state';
import ExternalEvaluationExpiredState from '@/components/external-evaluation-expired-state';
import {
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Brain,
  Sparkles,
  Shield,
  Award,
  Users
} from 'lucide-react';
import Link from 'next/link';

// Branding Header Component
function BrandingHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Reclu</h1>
              <p className="text-xs text-gray-500">Plataforma de Talento</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Fuerzas Motivadoras</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// Branding Footer Component
function BrandingFooter({ showCTA = true }: { showCTA?: boolean }) {
  return (
    <footer className="mt-auto">
      {showCTA && (
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">¿Te interesa evaluar a tu equipo?</h3>
            <p className="text-purple-100 mb-4 text-sm">Descubre el potencial de tu organización con evaluaciones DISC, Fuerzas Motivadoras e Inteligencia Emocional</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 bg-white text-purple-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg">
                Conocer Reclu <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-white/20 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30">
                Crear cuenta gratis
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="bg-gray-900 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm">Datos 100% confidenciales</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Metodología certificada</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm">+10,000 evaluaciones</span>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm">
            © 2025 Reclu. Plataforma de evaluación de talento empresarial.
          </div>
        </div>
      </div>
    </footer>
  );
}

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

interface Evaluation {
  id: string;
  title: string;
  description?: string;
  recipientName: string;
  status: string;
  senderUser: {
    firstName: string;
    lastName: string;
    name?: string;
  };
}

export default function ExternalDrivingForcesEvaluation({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
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
  const [expired, setExpired] = useState(false);
  const [step, setStep] = useState<'welcome' | 'questionnaire' | 'completed'>('welcome');
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    fetchEvaluation();
  }, [params.token]);

  const fetchEvaluation = async () => {
    try {
      const response = await fetch(`/api/external-driving-forces-evaluations/${params.token}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Evaluación no encontrada');
        } else if (response.status === 410) {
          setExpired(true);
        } else {
          throw new Error('Error al cargar la evaluación');
        }
        return;
      }
      
      const data = await response.json();
      setEvaluation(data.evaluation);

      if (data.evaluation.status === 'COMPLETED') {
        setStep('completed');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/external-driving-forces-evaluations/${params.token}/questions`);
      if (!response.ok) throw new Error('Error al cargar preguntas');
      
      const data = await response.json();
      setQuestions(data.questions);
      setStartTime(new Date());
    } catch (error: any) {
      setError(error.message);
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

    try {
      const response = await fetch(`/api/external-driving-forces-evaluations/${params.token}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          ...currentResponse,
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
      const response = await fetch(`/api/external-driving-forces-evaluations/${params.token}/responses`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Error al completar evaluación');

      setStep('completed');
      // No redirigimos a resultados - los resultados son solo para el administrador
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startQuestionnaire = () => {
    setStep('questionnaire');
    fetchQuestions();
  };

  const senderName = evaluation?.senderUser
    ? evaluation.senderUser.name || `${evaluation.senderUser.firstName} ${evaluation.senderUser.lastName}`.trim()
    : undefined;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando evaluación...</p>
          </div>
        </main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  if (error) {
    if (expired) {
      return (
        <ExternalEvaluationExpiredState
          evaluationType="Fuerzas Motivadoras"
          evaluationTitle={evaluation?.title}
          recipientName={evaluation?.recipientName}
          senderName={senderName}
        />
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  if (step === 'completed') {
    return (
      <ExternalEvaluationCompletedState
        evaluationType="Fuerzas Motivadoras"
        evaluationTitle={evaluation?.title}
        recipientName={evaluation?.recipientName}
        senderName={
          evaluation?.senderUser
            ? evaluation.senderUser.name || `${evaluation.senderUser.firstName} ${evaluation.senderUser.lastName}`.trim()
            : undefined
        }
      />
    );
  }

  if (!evaluation) return null;

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Evaluación Driving Forces
            </h1>
            <p className="text-lg text-gray-600">
              Descubre tus 12 fuerzas motivacionales
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información de la Evaluación */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {evaluation.title}
                  </CardTitle>
                  <CardDescription>
                    Enviado por: {senderName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {evaluation.description && (
                    <p className="text-gray-700 mb-4">
                      {evaluation.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>Recipiente: {evaluation.recipientName}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    ¿Qué son las Driving Forces?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Las <strong>Driving Forces</strong> representan las 12 fuerzas motivacionales 
                    que impulsan tu comportamiento y decisiones en el trabajo y la vida.
                  </p>
                  
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Identifica qué te energiza y motiva verdaderamente
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      Revela tus valores y prioridades fundamentales
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Ayuda a alinear tu carrera con tus motivadores naturales
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Información de la Evaluación */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="pt-6 text-center">
                  <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-amber-900 mb-1">15-20 minutos</p>
                  <p className="text-sm text-amber-700">Tiempo estimado</p>
                  <p className="text-xs text-amber-600 mt-2">
                    10 preguntas de ranking motivacional
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Instrucciones</h3>
                    <p className="text-sm text-gray-600">
                      Para cada pregunta, ordena las 4 opciones del 1 al 4:
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <span className="text-green-800">Más como tú</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                      <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-yellow-800">Bastante como tú</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                      <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-orange-800">Un poco como tú</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                      <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <span className="text-red-800">Menos como tú</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  onClick={startQuestionnaire}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8"
                >
                  Comenzar Evaluación
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  // Questionnaire view
  if (step === 'questionnaire' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Evaluación Driving Forces
                </h1>
                <p className="text-gray-600">
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
        </main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <BrandingHeader />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando preguntas...</p>
        </div>
      </main>
      <BrandingFooter showCTA={false} />
    </div>
  );
}
