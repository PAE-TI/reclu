'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dna,
  AlertCircle,
  Loader2,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Shield,
  Award,
  Users,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import ExternalEvaluationCompletedState from '@/components/external-evaluation-completed-state';
import ExternalEvaluationExpiredState from '@/components/external-evaluation-expired-state';

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
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Reclu</h1>
              <p className="text-xs text-gray-500">Plataforma de Talento</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100">
            <Dna className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">Evaluación DNA-25</span>
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
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">¿Te interesa evaluar a tu equipo?</h3>
            <p className="text-indigo-100 mb-4 text-sm">Descubre el potencial de tu organización con evaluaciones DISC, Fuerzas Motivadoras, EQ y DNA-25</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg">
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
  competency: string;
  category: string;
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
  recipientEmail: string;
  status: string;
  senderUser?: {
    firstName: string;
    lastName: string;
    company?: string;
  };
}

const CATEGORY_NAMES: Record<string, string> = {
  THINKING: 'Pensamiento',
  COMMUNICATION: 'Comunicación',
  LEADERSHIP: 'Liderazgo',
  RESULTS: 'Resultados',
  RELATIONSHIP: 'Relacionamiento',
};

const CATEGORY_COLORS: Record<string, string> = {
  THINKING: 'bg-indigo-100 text-indigo-700',
  COMMUNICATION: 'bg-violet-100 text-violet-700',
  LEADERSHIP: 'bg-pink-100 text-pink-700',
  RESULTS: 'bg-amber-100 text-amber-700',
  RELATIONSHIP: 'bg-emerald-100 text-emerald-700',
};

export default function ExternalDNAEvaluation() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expired, setExpired] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchEvaluation();
  }, [token]);

  const fetchEvaluation = async () => {
    try {
      const response = await fetch(`/api/external-dna-evaluations/${token}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al cargar la evaluación');
        if (response.status === 410) {
          setExpired(true);
        }
        setLoading(false);
        return;
      }

      setEvaluation(data);

      if (data.status === 'COMPLETED') {
        setCompleted(true);
        setLoading(false);
        return;
      }

      // Fetch questions
      const questionsResponse = await fetch(`/api/external-dna-evaluations/${token}/questions`);
      const questionsData = await questionsResponse.json();

      if (questionsResponse.ok) {
        setQuestions(questionsData);
      } else {
        setError('Error al cargar las preguntas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResponse = (value: number) => {
    const question = questions[currentQuestion];
    if (!question) return;
    
    setResponses({ ...responses, [question.id]: value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const formattedResponses = Object.entries(responses).map(([questionId, selectedValue]) => ({
        questionId,
        selectedValue,
      }));

      const response = await fetch(`/api/external-dna-evaluations/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: formattedResponses }),
      });

      if (response.ok) {
        setCompleted(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Error al enviar las respuestas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
              <p className="mt-4 text-gray-600">Cargando evaluación...</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  // Error state
  if (error) {
    if (expired) {
      return (
        <ExternalEvaluationExpiredState
          evaluationType="DNA-25"
          evaluationTitle={evaluation?.title}
          recipientName={evaluation?.recipientName}
          senderName={
            evaluation?.senderUser
              ? `${evaluation.senderUser.firstName || ''} ${evaluation.senderUser.lastName || ''}`.trim()
              : undefined
          }
        />
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-lg border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="mt-4 text-xl font-bold text-gray-900">Error</h2>
              <p className="mt-2 text-gray-600">{error}</p>
              <Link href="/">
                <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700">
                  Ir al Inicio
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  // Completed state
  if (completed) {
    return (
      <ExternalEvaluationCompletedState
        evaluationType="DNA-25"
        evaluationTitle={evaluation?.title}
        recipientName={evaluation?.recipientName}
        senderName={
          evaluation?.senderUser
            ? `${evaluation.senderUser.firstName || ''} ${evaluation.senderUser.lastName || ''}`.trim()
            : undefined
        }
      />
    );
  }

  // Welcome screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Dna className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Evaluación de Competencias DNA-25</CardTitle>
                  <CardDescription className="text-indigo-100">Reclu DNA Assessment</CardDescription>
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

              <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  ¿Qué mide esta evaluación?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  DNA-25 evalúa 25 competencias clave que determinan tu efectividad profesional,
                  agrupadas en 5 categorías:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-indigo-100 text-indigo-700">1</Badge>
                    <span><strong>Pensamiento:</strong> Análisis, creatividad, estrategia</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-violet-100 text-violet-700">2</Badge>
                    <span><strong>Comunicación:</strong> Verbal, escrita, influencia</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-pink-100 text-pink-700">3</Badge>
                    <span><strong>Liderazgo:</strong> Guiar, desarrollar, adaptar</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-amber-100 text-amber-700">4</Badge>
                    <span><strong>Resultados:</strong> Logro, planificación, ejecución</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-emerald-100 text-emerald-700">5</Badge>
                    <span><strong>Relacionamiento:</strong> Equipo, servicio, resiliencia</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600">25</p>
                  <p className="text-xs text-gray-500">Preguntas</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600">10-15</p>
                  <p className="text-xs text-gray-500">Minutos</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600">1-5</p>
                  <p className="text-xs text-gray-500">Escala</p>
                </div>
              </div>

              <Button
                onClick={() => setHasStarted(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-lg"
              >
                Comenzar Evaluación <ChevronRight className="w-5 h-5 ml-2" />
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto" />
              <h2 className="mt-4 text-lg font-bold text-gray-900">No hay preguntas disponibles</h2>
              <p className="mt-2 text-sm text-gray-600">
                Por favor contacta al administrador.
              </p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter />
      </div>
    );
  }

  const question = questions[currentQuestion];
  const currentResponse = question ? responses[question.id] : undefined;
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allAnswered = questions.every((q) => responses[q.id] !== undefined);

  const likertOptions = question ? [
    { value: 1, label: question.optionA || 'Nunca' },
    { value: 2, label: question.optionB || 'Raramente' },
    { value: 3, label: question.optionC || 'A veces' },
    { value: 4, label: question.optionD || 'Frecuentemente' },
    { value: 5, label: question.optionE || 'Siempre' },
  ] : [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
      <BrandingHeader />
      <main className="flex-1 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Dna className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">Evaluación DNA-25</span>
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
            {/* Category Badge */}
            <div className="mb-4">
              <Badge className={CATEGORY_COLORS[question?.category || 'THINKING']}>
                {CATEGORY_NAMES[question?.category || 'THINKING']}
              </Badge>
            </div>

            {/* Question Text */}
            <h2 className="text-xl font-semibold text-gray-900 mb-8 leading-relaxed">
              {question?.questionText}
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
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                      ${currentResponse === option.value
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {option.value}
                    </div>
                    <span className={`font-medium ${currentResponse === option.value ? 'text-indigo-700' : 'text-gray-700'}`}>
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
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>

              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                  ) : (
                    <><CheckCircle className="w-4 h-4 mr-2" /> Finalizar Evaluación</>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                  disabled={!currentResponse}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
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
