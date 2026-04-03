
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DiscQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  questionType: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface DiscResponse {
  questionId: string;
  questionNumber: number;
  selectedOption: 'D' | 'I' | 'S' | 'C';
  responseTime?: number;
}

export default function Questionnaire({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<DiscQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<DiscResponse[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    if (session) {
      fetchQuestions();
      setStartTime(Date.now());
    }
  }, [session]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar preguntas');
      }

      setQuestions(data.questions);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      setError(error.message || 'Error al cargar las preguntas');
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const currentQuestion = questions[currentQuestionIndex];
    const responseTime = Math.round((Date.now() - startTime) / 1000);

    // Mapear opciones A,B,C,D a dimensiones D,I,S,C
    const dimensionMap = {
      'A': 'D' as const,
      'B': 'I' as const, 
      'C': 'S' as const,
      'D': 'C' as const,
    };

    const newResponse: DiscResponse = {
      questionId: currentQuestion.id,
      questionNumber: currentQuestion.questionNumber,
      selectedOption: dimensionMap[selectedOption as keyof typeof dimensionMap],
      responseTime,
    };

    const updatedResponses = [...responses];
    const existingIndex = responses.findIndex(r => r.questionId === currentQuestion.id);
    
    if (existingIndex >= 0) {
      updatedResponses[existingIndex] = newResponse;
    } else {
      updatedResponses.push(newResponse);
    }

    setResponses(updatedResponses);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
      setStartTime(Date.now());
    } else {
      // Última pregunta - enviar respuestas
      submitResponses([...updatedResponses]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      
      // Restaurar respuesta anterior si existe
      const prevQuestion = questions[currentQuestionIndex - 1];
      const prevResponse = responses.find(r => r.questionId === prevQuestion.id);
      
      if (prevResponse) {
        const reverseMap = {
          'D': 'A',
          'I': 'B', 
          'S': 'C',
          'C': 'D',
        };
        setSelectedOption(reverseMap[prevResponse.selectedOption]);
      } else {
        setSelectedOption('');
      }
    }
  };

  const submitResponses = async (allResponses: DiscResponse[]) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/evaluations/${params.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: allResponses,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar las respuestas');
      }

      // Redirigir a los resultados
      router.push(`/results/${params.id}`);
    } catch (error: any) {
      console.error('Error submitting responses:', error);
      setError(error.message || 'Error al enviar las respuestas');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando preguntas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-6">{error || 'No se pudieron cargar las preguntas'}</p>
              <Button onClick={() => router.push('/dashboard')} className="bg-indigo-600 hover:bg-indigo-700">
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Evaluación DISC</h1>
                <p className="text-sm text-gray-600">
                  Pregunta {currentQuestionIndex + 1} de {questions.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">{Math.round(progress)}%</div>
              <div className="text-sm text-gray-600">Completado</div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {isSubmitting && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-blue-700 font-medium">Procesando respuestas y calculando resultados...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">
                  {currentQuestion?.questionText}
                </CardTitle>
                <CardDescription>
                  Selecciona la opción que mejor te describe
                </CardDescription>
              </div>
              <div className="bg-indigo-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-indigo-700">
                  {currentQuestion?.questionType === 'ADJECTIVE' ? 'Adjetivos' : 'Escenarios'}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {[
                { key: 'A', text: currentQuestion?.optionA },
                { key: 'B', text: currentQuestion?.optionB },
                { key: 'C', text: currentQuestion?.optionC },
                { key: 'D', text: currentQuestion?.optionD },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleOptionSelect(option.key)}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedOption === option.key
                      ? 'border-indigo-400 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === option.key
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedOption === option.key && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{option.text}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || isSubmitting}
            className="bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <div className="text-center text-sm text-gray-600">
            {responses.length} de {questions.length} respondidas
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedOption || isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLastQuestion ? (
              <>
                {isSubmitting ? 'Procesando...' : 'Finalizar'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
