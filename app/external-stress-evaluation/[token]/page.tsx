'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Shield, 
  Award, 
  Users, 
  ArrowRight,
  Clock,
  User,
  Mail,
  PlayCircle,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Brain,
  Heart,
  Target,
  Zap,
  LifeBuoy,
  Scale
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ExternalEvaluationCompletedState from '@/components/external-evaluation-completed-state';
import ExternalEvaluationExpiredState from '@/components/external-evaluation-expired-state';

interface EvaluationData {
  id: string;
  title: string;
  recipientName: string;
  recipientEmail: string;
  status: string;
  tokenExpiry: string;
  completedAt?: string;
}

interface Question {
  id: string;
  questionNumber: number;
  questionText: string;
  dimension: string;
  category: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
}

// Header Component
function BrandingHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                Reclu
              </h1>
              <p className="text-xs text-gray-500">Plataforma de Talento</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100">
            <Activity className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-medium text-rose-600">Estrés y Resiliencia</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// Footer Component
function BrandingFooter({ showCTA = true }: { showCTA?: boolean }) {
  return (
    <footer className="mt-auto">
      {showCTA && (
        <div className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              ¿Te interesa evaluar a tu equipo?
            </h3>
            <p className="text-rose-100 mb-4 text-sm">
              Descubre el estrés, resiliencia y bienestar de tu equipo con nuestras 8 evaluaciones
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white text-rose-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-rose-50 transition-colors shadow-lg"
              >
                Conocer Reclu
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-white/20 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
              >
                Crear cuenta gratis
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="bg-gray-900 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
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
          <div className="border-t border-gray-800 pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-semibold">Reclu</span>
              </div>
              <p className="text-gray-500 text-sm text-center">
                © 2025 Reclu. Plataforma de evaluación de talento empresarial.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Términos
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function ExternalStressEvaluation() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [expired, setExpired] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    fetchEvaluation();
  }, [token]);

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/external-stress-evaluations/${token}/questions`);
      const data = await res.json();

      if (res.status === 404) {
        setError('La evaluación solicitada no existe o el enlace es inválido.');
        return;
      }

      if (res.status === 410) {
        setExpired(true);
        setError('Este enlace de evaluación ha expirado. Los enlaces son válidos por 30 días.');
        return;
      }

      if (res.status === 400 && data.error?.includes('completada')) {
        setAlreadyCompleted(true);
        setEvaluation(data.evaluation);
        return;
      }

      if (!res.ok) {
        setError(data.error || 'Error al cargar la evaluación');
        return;
      }

      setEvaluation(data.evaluation);
      setQuestions(data.questions);

      // Calculate time until expiry
      if (data.evaluation?.tokenExpiry) {
        const expiry = new Date(data.evaluation.tokenExpiry);
        const now = new Date();
        const diff = expiry.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilExpiry({ hours: Math.max(0, hours), minutes: Math.max(0, minutes) });
      }
    } catch (err) {
      setError('Error de conexión. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEvaluation = () => {
    setShowQuestionnaire(true);
  };

  const handleResponse = (value: number) => {
    setResponses({ ...responses, [questions[currentIndex].questionNumber]: value });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(responses).length < questions.length) {
      toast.error('Por favor responde todas las preguntas');
      return;
    }

    setSubmitting(true);

    try {
      const formattedResponses = Object.entries(responses).map(([qNum, value]) => ({
        questionNumber: parseInt(qNum),
        selectedValue: value,
      }));

      const res = await fetch(`/api/external-stress-evaluations/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: formattedResponses }),
      });

      if (res.ok) {
        // Show completion screen instead of redirecting to results
        setAlreadyCompleted(true);
        toast.success('¡Evaluación completada exitosamente!');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al enviar');
      }
    } catch (err) {
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <RefreshCw className="w-12 h-12 text-rose-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando Evaluación</h2>
              <p className="text-gray-600">Verificando enlace y cargando datos...</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  // Error/Expired State
  if (error || expired) {
    if (expired) {
      return (
        <ExternalEvaluationExpiredState
          evaluationType="Estrés y Resiliencia"
          evaluationTitle={evaluation?.title}
          recipientName={evaluation?.recipientName}
        />
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {expired ? 'Enlace Expirado' : 'Evaluación No Disponible'}
              </h1>
              <p className="text-lg text-gray-600 mb-6">{error}</p>
              {expired && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-amber-800 mb-2">¿Qué puedes hacer?</h3>
                  <ul className="text-sm text-amber-700 space-y-1 text-left">
                    <li>• Contacta a la persona que te envió la evaluación</li>
                    <li>• Solicita un nuevo enlace de evaluación</li>
                    <li>• Los enlaces expiran por seguridad después de 30 días</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  // Already Completed State
  if (alreadyCompleted && evaluation) {
    return (
      <ExternalEvaluationCompletedState
        evaluationType="Estrés y Resiliencia"
        evaluationTitle={evaluation.title}
        recipientName={evaluation.recipientName}
        completedAt={evaluation.completedAt}
      />
    );
  }

  // Questionnaire State
  if (showQuestionnaire && evaluation && questions.length > 0) {
    const currentQuestion = questions[currentIndex];
    const progress = (Object.keys(responses).length / questions.length) * 100;
    const currentResponse = responses[currentQuestion?.questionNumber];
    const isLastQuestion = currentIndex === questions.length - 1;
    const allAnswered = Object.keys(responses).length === questions.length;

    // Get options based on question category
    const getOptions = () => {
      if (currentQuestion.category === 'POSITIVE') {
        return [currentQuestion.optionA, currentQuestion.optionB, currentQuestion.optionC, currentQuestion.optionD, currentQuestion.optionE];
      }
      return [currentQuestion.optionA, currentQuestion.optionB, currentQuestion.optionC, currentQuestion.optionD, currentQuestion.optionE];
    };

    const options = getOptions();

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
        <BrandingHeader />
        <main className="flex-1 p-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-xl mb-6">
              <CardHeader className="bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Evaluación de Estrés y Resiliencia</CardTitle>
                    <CardDescription className="text-rose-100">Hola {evaluation?.recipientName}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-rose-100">Pregunta</p>
                    <p className="text-2xl font-bold">{currentIndex + 1}/{questions.length}</p>
                  </div>
                </div>
                <Progress value={progress} className="mt-4 h-2 bg-rose-800" />
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-8">
                  <p className="text-lg text-gray-800 font-medium">{currentQuestion?.questionText}</p>
                </div>
                <div className="space-y-3">
                  {options.map((option, idx) => {
                    const value = idx + 1;
                    const isSelected = currentResponse === value;
                    return (
                      <button 
                        key={idx} 
                        onClick={() => handleResponse(value)} 
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${isSelected ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50/50'}`}
                      >
                        <span className="font-medium">{value}. {option}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                  </Button>
                  {isLastQuestion && allAnswered ? (
                    <Button onClick={handleSubmit} disabled={submitting} className="bg-green-600 hover:bg-green-700">
                      {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Finalizar</>}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} disabled={!currentResponse} className="bg-rose-600 hover:bg-rose-700">
                      Siguiente <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  // No evaluation data
  if (!evaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600">No se pudo cargar la evaluación</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  // Welcome/Intro Screen (default state)
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      <BrandingHeader />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-600 to-orange-600 rounded-2xl shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Evaluación de Estrés y Resiliencia
            </h1>
            <p className="text-lg text-gray-600">
              Descubre tu perfil de manejo del estrés y capacidad de recuperación
            </p>
          </div>

          {/* Información de la Evaluación */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-center text-gray-900">
                {evaluation.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Detalles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <User className="w-6 h-6 text-rose-600 mb-2" />
                  <div className="text-sm text-gray-600">Evaluado</div>
                  <div className="font-semibold text-gray-900">{evaluation.recipientName}</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-6 h-6 text-rose-600 mb-2" />
                  <div className="text-sm text-gray-600">Correo</div>
                  <div className="font-semibold text-gray-900 text-sm">{evaluation.recipientEmail}</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-rose-600 mb-2" />
                  <div className="text-sm text-gray-600">Tiempo restante</div>
                  <div className="font-semibold text-gray-900">
                    {timeUntilExpiry.hours > 24 ? `${Math.floor(timeUntilExpiry.hours / 24)}d` : `${timeUntilExpiry.hours}h ${timeUntilExpiry.minutes}m`}
                  </div>
                </div>
              </div>

              {/* Información sobre Estrés */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
                <h3 className="font-semibold text-rose-800 mb-4">¿Qué mide esta evaluación?</h3>
                <p className="text-rose-700 mb-4">
                  Esta evaluación analiza tu relación con el estrés y tu capacidad de 
                  resiliencia, identificando factores de riesgo y protección:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-rose-800">Estrés Laboral</div>
                      <div className="text-sm text-rose-600">Nivel de presión y tensión en el trabajo</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <LifeBuoy className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-rose-800">Capacidad de Recuperación</div>
                      <div className="text-sm text-rose-600">Habilidad para descansar y recargar</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-rose-800">Manejo Emocional</div>
                      <div className="text-sm text-rose-600">Control y expresión de emociones</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Scale className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-rose-800">Equilibrio Vida-Trabajo</div>
                      <div className="text-sm text-rose-600">Balance entre lo personal y profesional</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:col-span-2 justify-center">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-rose-800">Resiliencia General</div>
                      <div className="text-sm text-rose-600">Capacidad de adaptación ante adversidades</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instrucciones */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Instrucciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">📝 Cómo responder:</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Lee cada afirmación cuidadosamente</li>
                      <li>• Selecciona qué tan frecuentemente te identificas</li>
                      <li>• Usa la escala de 1 a 5 según la pregunta</li>
                      <li>• Responde de manera honesta y espontánea</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">💡 Consejos importantes:</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• No hay respuestas correctas o incorrectas</li>
                      <li>• Piensa en cómo te has sentido últimamente</li>
                      <li>• No reflexiones demasiado cada respuesta</li>
                      <li>• Mantén un ambiente tranquilo</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 py-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-rose-600">30</p>
                  <p className="text-sm text-gray-500">Preguntas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-rose-600">10-12</p>
                  <p className="text-sm text-gray-500">Minutos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-rose-600">5</p>
                  <p className="text-sm text-gray-500">Dimensiones</p>
                </div>
              </div>

              {/* Iniciar */}
              <div className="text-center pt-4">
                <Button
                  onClick={handleStartEvaluation}
                  className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
                >
                  <PlayCircle className="w-6 h-6 mr-2" />
                  Comenzar Evaluación
                </Button>
                <p className="text-sm text-gray-500 mt-3">
                  Tus respuestas son 100% confidenciales
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <BrandingFooter />
    </div>
  );
}
