'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Lock,
  Shield,
  Award,
  Users,
  Code,
  Target,
  Clock,
  FileCode,
  CheckCircle2,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import ExternalEvaluationCompletedState from '@/components/external-evaluation-completed-state';
import ExternalEvaluationExpiredState from '@/components/external-evaluation-expired-state';

// Branding Header Component with language toggle
function BrandingHeader({ language, onLanguageChange }: { language: string; onLanguageChange: (lang: 'es' | 'en') => void }) {
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
              <p className="text-xs text-gray-500">{language === 'es' ? 'Plataforma de Talento' : 'Talent Platform'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100">
              <FileCode className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-medium text-sky-600">
                {language === 'es' ? 'Evaluación Técnica' : 'Technical Evaluation'}
              </span>
            </div>
            <button
              onClick={() => onLanguageChange(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">{language === 'es' ? 'EN' : 'ES'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Branding Footer Component
function BrandingFooter({ showCTA = true, language }: { showCTA?: boolean; language: string }) {
  return (
    <footer className="mt-auto">
      {showCTA && (
        <div className="bg-gradient-to-r from-sky-500 via-cyan-600 to-blue-600 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              {language === 'es' ? '¿Te interesa evaluar a tu equipo?' : 'Interested in evaluating your team?'}
            </h3>
            <p className="text-sky-100 mb-4 text-sm">
              {language === 'es' 
                ? 'Descubre el potencial de tu organización con evaluaciones técnicas y psicométricas'
                : 'Discover your organization\'s potential with technical and psychometric assessments'
              }
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 bg-white text-sky-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-sky-50 transition-colors shadow-lg">
                {language === 'es' ? 'Conocer Reclu' : 'Learn about Reclu'} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-white/20 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30">
                {language === 'es' ? 'Crear cuenta gratis' : 'Create free account'}
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
              <span className="text-sm">{language === 'es' ? 'Datos 100% confidenciales' : '100% confidential data'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">{language === 'es' ? 'Preguntas específicas del cargo' : 'Job-specific questions'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm">{language === 'es' ? '+10,000 evaluaciones' : '+10,000 evaluations'}</span>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm">
            © 2025 Reclu. {language === 'es' ? 'Plataforma de evaluación de talento empresarial.' : 'Enterprise talent assessment platform.'}
          </div>
        </div>
      </div>
    </footer>
  );
}

interface TechnicalQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface Evaluation {
  id: string;
  recipientName: string;
  recipientEmail: string;
  jobPositionId: string;
  jobPositionTitle: string;
  status: string;
  completedAt?: string | null;
  senderUser: {
    firstName: string | null;
    lastName: string | null;
    company: string | null;
  };
}

export default function ExternalTechnicalEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const { language: contextLanguage, setLanguage } = useLanguage();
  
  // Use local state for language to allow external users to switch
  const [language, setLocalLanguage] = useState<'es' | 'en'>('es');

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [questions, setQuestions] = useState<TechnicalQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, { answer: string; startTime: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const handleLanguageChange = (lang: 'es' | 'en') => {
    setLocalLanguage(lang);
    // If questions are loaded, reload them in the new language
    if (hasStarted && questions.length > 0) {
      loadQuestions(lang);
    }
  };

  useEffect(() => {
    fetchEvaluation();
  }, [token]);

  const fetchEvaluation = async () => {
    try {
      const evalResponse = await fetch(`/api/external-technical-evaluations/${token}`);
      if (!evalResponse.ok) {
        const errorData = await evalResponse.json();
        setError(errorData.error || (language === 'es' ? 'Evaluación no encontrada' : 'Evaluation not found'));
        if (evalResponse.status === 410) {
          setExpired(true);
        }
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
    } catch (error) {
      console.error('Error fetching evaluation:', error);
      setError(language === 'es' ? 'Error al cargar la evaluación' : 'Error loading evaluation');
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuestions = async (lang?: 'es' | 'en') => {
    const loadLang = lang || language;
    setIsLoadingQuestions(true);
    try {
      const questionsResponse = await fetch(`/api/external-technical-evaluations/${token}/questions?lang=${loadLang}`);
      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        const normalizedQuestions = Array.isArray(questionsData)
          ? questionsData
          : Array.isArray(questionsData?.questions)
            ? questionsData.questions
            : [];

        if (normalizedQuestions.length === 0) {
          toast.error(loadLang === 'es' ? 'No se pudieron cargar preguntas válidas' : 'Could not load valid questions');
          return;
        }

        setQuestions(normalizedQuestions);
        setCurrentQuestion(0);
        setHasStarted(true);
        setQuestionStartTime(Date.now());
      } else {
        const errorData = await questionsResponse.json();
        toast.error(errorData.error || (loadLang === 'es' ? 'Error al cargar las preguntas' : 'Error loading questions'));
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error(language === 'es' ? 'Error al cargar las preguntas' : 'Error loading questions');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleSelectResponse = (answer: string) => {
    const question = questions[currentQuestion];
    if (!question) return;
    
    const timeSpent = Date.now() - questionStartTime;
    setResponses((prev) => ({
      ...prev,
      [question.id]: { answer, startTime: timeSpent },
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(responses).length;
    if (answeredCount < questions.length) {
      toast.error(language === 'es' 
        ? `Por favor responde todas las preguntas (${answeredCount}/${questions.length})`
        : `Please answer all questions (${answeredCount}/${questions.length})`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedResponses = Object.entries(responses).map(([questionId, data]) => ({
        questionId,
        selectedAnswer: data.answer,
        responseTime: data.startTime,
      }));

      const response = await fetch(`/api/external-technical-evaluations/${token}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: formattedResponses }),
      });

      if (response.ok) {
        setIsCompleted(true);
        toast.success(language === 'es' ? '¡Evaluación completada exitosamente!' : 'Evaluation completed successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || (language === 'es' ? 'Error al enviar la evaluación' : 'Error submitting evaluation'));
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast.error(language === 'es' ? 'Error al enviar la evaluación' : 'Error submitting evaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, Record<string, string>> = {
      es: { EASY: 'Básico', MEDIUM: 'Intermedio', HARD: 'Avanzado' },
      en: { EASY: 'Basic', MEDIUM: 'Intermediate', HARD: 'Advanced' },
    };
    return labels[language][difficulty] || difficulty;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      EASY: 'bg-green-100 text-green-700',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      HARD: 'bg-red-100 text-red-700',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  const currentQ = questions[currentQuestion];
  const currentResponse = currentQ ? responses[currentQ.id]?.answer : undefined;
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(responses).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
        <BrandingHeader language={language} onLanguageChange={handleLanguageChange} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-sky-500 mx-auto mb-4" />
            <p className="text-gray-600">{language === 'es' ? 'Cargando evaluación...' : 'Loading evaluation...'}</p>
          </div>
        </main>
        <BrandingFooter showCTA={false} language={language} />
      </div>
    );
  }

  if (error) {
    if (expired) {
      return (
        <ExternalEvaluationExpiredState
          language={language}
          evaluationType={language === 'es' ? 'Evaluación Técnica' : 'Technical Evaluation'}
          evaluationTitle={evaluation?.jobPositionTitle}
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
        <BrandingHeader language={language} onLanguageChange={handleLanguageChange} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'es' ? 'Enlace no válido' : 'Invalid Link'}
              </h2>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter showCTA={true} language={language} />
      </div>
    );
  }

  // Completed screen
  if (isCompleted) {
    return (
      <ExternalEvaluationCompletedState
        language={language}
        evaluationType={language === 'es' ? 'Evaluación Técnica' : 'Technical Evaluation'}
        evaluationTitle={evaluation?.jobPositionTitle}
        recipientName={evaluation?.recipientName}
        senderName={
          evaluation?.senderUser
            ? `${evaluation.senderUser.firstName || ''} ${evaluation.senderUser.lastName || ''}`.trim()
            : undefined
        }
        completedAt={evaluation?.completedAt}
      />
    );
  }

  // Welcome screen (before starting)
  if (!hasStarted) {
    const senderName = evaluation?.senderUser 
      ? `${evaluation.senderUser.firstName || ''} ${evaluation.senderUser.lastName || ''}`.trim() || (language === 'es' ? 'Equipo de Selección' : 'Selection Team')
      : (language === 'es' ? 'Equipo de Selección' : 'Selection Team');
    const company = evaluation?.senderUser?.company || 'Reclu';

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
        <BrandingHeader language={language} onLanguageChange={handleLanguageChange} />
        <main className="flex-1 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCode className="w-8 h-8 text-sky-600" />
                </div>
                <CardTitle className="text-2xl">
                  {language === 'es' ? 'Evaluación Técnica' : 'Technical Evaluation'}
                </CardTitle>
                <CardDescription className="text-base">
                  {language === 'es' 
                    ? `Hola ${evaluation?.recipientName}, bienvenido/a a tu evaluación técnica`
                    : `Hello ${evaluation?.recipientName}, welcome to your technical evaluation`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Job Position */}
                <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-sky-600" />
                    <div>
                      <p className="text-sm text-sky-600">{language === 'es' ? 'Cargo a evaluar' : 'Position to evaluate'}</p>
                      <p className="font-semibold text-sky-800">{evaluation?.jobPositionTitle}</p>
                    </div>
                  </div>
                </div>

                {/* Sender info */}
                <div className="text-center text-sm text-gray-600">
                  {language === 'es' 
                    ? `Invitación enviada por ${senderName} de ${company}`
                    : `Invitation sent by ${senderName} from ${company}`
                  }
                </div>

                {/* Instructions */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    {language === 'es' ? 'Instrucciones' : 'Instructions'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>
                        {language === 'es' 
                          ? 'Responderás 20 preguntas específicas para el cargo indicado'
                          : 'You will answer 20 questions specific to the indicated position'
                        }
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>
                        {language === 'es' 
                          ? 'Cada pregunta tiene 4 opciones con una sola respuesta correcta'
                          : 'Each question has 4 options with only one correct answer'
                        }
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>
                        {language === 'es' 
                          ? 'Puedes navegar entre preguntas y cambiar tus respuestas'
                          : 'You can navigate between questions and change your answers'
                        }
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>
                        {language === 'es' 
                          ? 'Tiempo estimado: 25-35 minutos'
                          : 'Estimated time: 25-35 minutes'
                        }
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Important notes */}
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-2">
                    {language === 'es' ? 'Importante' : 'Important'}
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• {language === 'es' ? 'Asegúrate de tener una conexión estable a internet' : 'Make sure you have a stable internet connection'}</li>
                    <li>• {language === 'es' ? 'Completa la evaluación en un solo intento' : 'Complete the evaluation in one attempt'}</li>
                    <li>• {language === 'es' ? 'Tus respuestas son confidenciales' : 'Your answers are confidential'}</li>
                  </ul>
                </div>

                <Button 
                  onClick={() => loadQuestions(language)}
                  disabled={isLoadingQuestions}
                  className="w-full bg-sky-600 hover:bg-sky-700 py-6 text-lg"
                >
                  {isLoadingQuestions ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {language === 'es' ? 'Preparando preguntas...' : 'Preparing questions...'}
                    </>
                  ) : (
                    <>
                      {language === 'es' ? 'Comenzar Evaluación' : 'Start Evaluation'} <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <BrandingFooter showCTA={false} language={language} />
      </div>
    );
  }

  // Questionnaire screen
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
      <BrandingHeader language={language} onLanguageChange={handleLanguageChange} />
      <main className="flex-1 py-6 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {language === 'es' ? 'Pregunta' : 'Question'} {currentQuestion + 1} {language === 'es' ? 'de' : 'of'} {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {answeredCount} {language === 'es' ? 'respondidas' : 'answered'}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question card */}
          {currentQ && (
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge className={getDifficultyColor(currentQ.difficulty)}>
                    {getDifficultyLabel(currentQ.difficulty)}
                  </Badge>
                  <Badge variant="outline" className="text-sky-600 border-sky-200">
                    {currentQ.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-relaxed">
                  {currentQ.questionText}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionKey = `option${option}` as keyof TechnicalQuestion;
                  const optionText = currentQ[optionKey] as string;
                  const isSelected = currentResponse === option;

                  return (
                    <button
                      key={option}
                      onClick={() => handleSelectResponse(option)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200'
                          : 'border-gray-200 hover:border-sky-300 hover:bg-sky-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            isSelected
                              ? 'bg-sky-500 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {option}
                        </span>
                        <span className={`${isSelected ? 'text-sky-900' : 'text-gray-700'}`}>
                          {optionText}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'es' ? 'Anterior' : 'Previous'}
            </Button>

            {currentQuestion === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || answeredCount < questions.length}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {language === 'es' ? 'Enviando...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {language === 'es' ? 'Finalizar Evaluación' : 'Finish Evaluation'}
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2"
              >
                {language === 'es' ? 'Siguiente' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Question navigator */}
          <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">
              {language === 'es' ? 'Navegación de preguntas' : 'Question navigation'}
            </p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, index) => {
                const isAnswered = !!responses[q.id];
                const isCurrent = index === currentQuestion;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestion(index);
                      setQuestionStartTime(Date.now());
                    }}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      isCurrent
                        ? 'bg-sky-600 text-white'
                        : isAnswered
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <BrandingFooter showCTA={false} language={language} />
    </div>
  );
}
