'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Lock,
  Shield,
  Award,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Branding Header Component
function BrandingHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">MotivaIQ</h1>
              <p className="text-xs text-gray-500">Plataforma de Talento</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100">
            <Heart className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-medium text-rose-600">Inteligencia Emocional</span>
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
        <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">¿Te interesa evaluar a tu equipo?</h3>
            <p className="text-rose-100 mb-4 text-sm">Descubre el potencial de tu organización con evaluaciones DISC, Fuerzas Motivadoras e Inteligencia Emocional</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 bg-white text-rose-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-rose-50 transition-colors shadow-lg">
                Conocer MotivaIQ <ArrowRight className="w-4 h-4" />
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
            © 2025 MotivaIQ. Plataforma de evaluación de talento empresarial.
          </div>
        </div>
      </div>
    </footer>
  );
}

interface EQQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  dimension: string;
  subdimension: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
}

interface Evaluation {
  id: string;
  title: string;
  recipientName: string;
  status: string;
  senderUser: {
    firstName: string | null;
    lastName: string | null;
    company: string | null;
  };
}

export default function ExternalEQEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [questions, setQuestions] = useState<EQQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    fetchEvaluation();
  }, [token]);

  const fetchEvaluation = async () => {
    try {
      // Fetch evaluation details
      const evalResponse = await fetch(`/api/external-eq-evaluations/${token}`);
      if (!evalResponse.ok) {
        const errorData = await evalResponse.json();
        setError(errorData.error || 'Evaluación no encontrada');
        setIsLoading(false);
        return;
      }
      const evalData = await evalResponse.json();
      
      if (evalData.status === 'COMPLETED') {
        setIsCompleted(true);
        setEvaluation(evalData);
        setIsLoading(false);
        return;
      }
      
      setEvaluation(evalData);

      // Fetch questions
      const questionsResponse = await fetch(`/api/external-eq-evaluations/${token}/questions`);
      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);
      }
    } catch (error) {
      console.error('Error fetching evaluation:', error);
      setError('Error al cargar la evaluación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectResponse = (value: number) => {
    const question = questions[currentQuestion];
    if (!question) return;
    setResponses((prev) => ({
      ...prev,
      [question.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Verify all questions are answered
    const answeredCount = Object.keys(responses).length;
    if (answeredCount < questions.length) {
      toast.error(`Por favor responde todas las preguntas (${answeredCount}/${questions.length})`);
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedResponses = Object.entries(responses).map(([questionId, selectedValue]) => ({
        questionId,
        selectedValue,
      }));

      const response = await fetch(`/api/external-eq-evaluations/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: formattedResponses }),
      });

      if (response.ok) {
        setIsCompleted(true);
        toast.success('¡Evaluación completada exitosamente!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error al enviar la evaluación');
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast.error('Error al enviar la evaluación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDimensionLabel = (dimension: string) => {
    const labels: Record<string, string> = {
      SELF_AWARENESS: 'Autoconciencia',
      SELF_REGULATION: 'Autorregulación',
      MOTIVATION: 'Motivación',
      EMPATHY: 'Empatía',
      SOCIAL_SKILLS: 'Habilidades Sociales',
    };
    return labels[dimension] || dimension;
  };

  const getDimensionColor = (dimension: string) => {
    const colors: Record<string, string> = {
      SELF_AWARENESS: 'bg-red-100 text-red-700',
      SELF_REGULATION: 'bg-orange-100 text-orange-700',
      MOTIVATION: 'bg-yellow-100 text-yellow-700',
      EMPATHY: 'bg-green-100 text-green-700',
      SOCIAL_SKILLS: 'bg-blue-100 text-blue-700',
    };
    return colors[dimension] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-rose-500 mx-auto mb-4" />
            <p className="text-gray-600">Cargando evaluación...</p>
          </div>
        </main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Evaluación Completada!</h2>
              <p className="text-gray-600 mb-6">
                Gracias {evaluation?.recipientName} por completar la evaluación de Inteligencia Emocional.
              </p>
              <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                <Lock className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Tus resultados son confidenciales y serán revisados por el administrador.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  // Welcome screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Evaluación de Inteligencia Emocional</CardTitle>
                  <CardDescription className="text-rose-100">MotivaIQ EQ Assessment</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Bienvenido/a, {evaluation?.recipientName}
                </h2>
                <p className="text-gray-600">
                  Has sido invitado/a por{' '}
                  <strong>
                    {evaluation?.senderUser?.firstName} {evaluation?.senderUser?.lastName}
                  </strong>
                  {evaluation?.senderUser?.company && ` de ${evaluation.senderUser.company}`}
                </p>
              </div>

              <div className="bg-rose-50 rounded-xl p-5 border border-rose-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  ¿Qué mide esta evaluación?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  La Inteligencia Emocional (EQ) es la capacidad de reconocer, entender y manejar tus emociones 
                  y las de los demás. Esta evaluación mide 5 dimensiones clave:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-red-100 text-red-700">1</Badge>
                    <span><strong>Autoconciencia:</strong> Reconocer tus emociones</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-orange-100 text-orange-700">2</Badge>
                    <span><strong>Autorregulación:</strong> Manejar impulsos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-yellow-100 text-yellow-700">3</Badge>
                    <span><strong>Motivación:</strong> Impulso interno</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-green-100 text-green-700">4</Badge>
                    <span><strong>Empatía:</strong> Comprender a otros</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-blue-100 text-blue-700">5</Badge>
                    <span><strong>Habilidades Sociales:</strong> Gestionar relaciones</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-rose-600">{questions.length}</div>
                  <div className="text-xs text-gray-500">Preguntas</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-rose-600">10-12</div>
                  <div className="text-xs text-gray-500">Minutos</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-rose-600">1-5</div>
                  <div className="text-xs text-gray-500">Escala</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>ℹ️ Instrucciones:</strong> Para cada afirmación, indica qué tan de acuerdo estás 
                  en una escala del 1 (Totalmente en desacuerdo) al 5 (Totalmente de acuerdo). 
                  Responde según cómo actúas normalmente, no cómo te gustaría actuar.
                </p>
              </div>

              <Button
                onClick={() => setHasStarted(true)}
                className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-lg"
              >
                Comenzar Evaluación
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  // Questionnaire
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sin preguntas disponibles</h2>
              <p className="text-gray-600">No se encontraron preguntas para esta evaluación. Por favor contacta al administrador.</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  const question = questions[currentQuestion];
  if (!question) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-rose-500" />
        </main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentResponse = responses[question.id];

  const likertOptions = [
    { value: 1, label: question.optionA || 'Totalmente en desacuerdo' },
    { value: 2, label: question.optionB || 'En desacuerdo' },
    { value: 3, label: question.optionC || 'Neutral' },
    { value: 4, label: question.optionD || 'De acuerdo' },
    { value: 5, label: question.optionE || 'Totalmente de acuerdo' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <BrandingHeader />
      <main className="flex-1 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span className="text-sm font-medium text-gray-700">Evaluación EQ</span>
            </div>
            <span className="text-sm text-gray-500">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            {/* Dimension Badge */}
            <div className="mb-4">
              <Badge className={getDimensionColor(question.dimension)}>
                {getDimensionLabel(question.dimension)}
              </Badge>
              {question.subdimension && (
                <span className="text-xs text-gray-500 ml-2">
                  • {question.subdimension}
                </span>
              )}
            </div>

            {/* Question Text */}
            <h2 className="text-xl font-semibold text-gray-900 mb-8 leading-relaxed">
              {question.questionText}
            </h2>

            {/* Likert Scale Options */}
            <div className="space-y-3">
              {likertOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelectResponse(option.value)}
                  className={`
                    w-full p-4 rounded-xl border-2 text-left transition-all
                    ${currentResponse === option.value
                      ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200'
                      : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                      ${currentResponse === option.value
                        ? 'bg-rose-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {option.value}
                    </div>
                    <span className={`
                      font-medium
                      ${currentResponse === option.value ? 'text-rose-700' : 'text-gray-700'}
                    `}>
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              {currentQuestion < questions.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!currentResponse}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || Object.keys(responses).length < questions.length}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Finalizar
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Answered count */}
            <div className="text-center mt-4 text-sm text-gray-500">
              {Object.keys(responses).length} de {questions.length} preguntas respondidas
            </div>
          </CardContent>
        </Card>
      </div>
      </main>
      <BrandingFooter showCTA={false} />
    </div>
  );
}
