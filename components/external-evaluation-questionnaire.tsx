'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'react-hot-toast';
import {
  Brain,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  User,
  Loader2
} from 'lucide-react';
import { Language, translations } from '@/contexts/language-context';

interface Question {
  id: string;
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface Response {
  questionId: string;
  mostValue: number;
  leastValue: number;
}

interface ExternalEvaluationQuestionnaireProps {
  token: string;
  evaluationTitle: string;
  recipientName: string;
  senderName: string;
  onCompleted: () => void;
  language?: Language;
}

export default function ExternalEvaluationQuestionnaire({
  token,
  evaluationTitle,
  recipientName,
  senderName,
  onCompleted,
  language = 'es'
}: ExternalEvaluationQuestionnaireProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // Initialize startTime on client-side only to avoid hydration mismatch
  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
  }, [startTime]);

  const t = (key: string) => translations[language][key as keyof typeof translations['es']] || key;

  // Cargar preguntas
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/external-evaluations/${token}/questions`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(t('ext.notFoundMessage'));
          } else if (response.status === 410) {
            const data = await response.json();
            throw new Error(data.error || t('ext.notAvailable'));
          }
          throw new Error(t('ext.connectionError'));
        }
        const data = await response.json();
        setQuestions(data.questions);
        
        // Inicializar respuestas vacías
        const initialResponses = data.questions.map((q: Question) => ({
          questionId: q.id,
          mostValue: 0,
          leastValue: 0
        }));
        setResponses(initialResponses);
      } catch (error) {
        console.error('Error loading questions:', error);
        toast.error(error instanceof Error ? error.message : t('ext.connectionError'));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [token]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses.find(r => r.questionId === currentQuestion?.id);
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const completedQuestions = responses.filter(r => r.mostValue !== 0 && r.leastValue !== 0).length;

  const handleOptionSelect = (optionNumber: number, type: 'most' | 'least') => {
    if (!currentQuestion) return;

    setResponses(prev => prev.map(response => {
      if (response.questionId === currentQuestion.id) {
        const newResponse = { ...response };
        
        if (type === 'most') {
          newResponse.mostValue = optionNumber;
          if (newResponse.leastValue === optionNumber) {
            newResponse.leastValue = 0;
          }
        } else {
          newResponse.leastValue = optionNumber;
          if (newResponse.mostValue === optionNumber) {
            newResponse.mostValue = 0;
          }
        }
        
        return newResponse;
      }
      return response;
    }));
  };

  const canGoNext = () => {
    return currentResponse && currentResponse.mostValue !== 0 && currentResponse.leastValue !== 0;
  };

  const canGoPrev = () => {
    return currentQuestionIndex > 0;
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const incompleteResponses = responses.filter(r => r.mostValue === 0 || r.leastValue === 0);
    if (incompleteResponses.length > 0) {
      const errorMsg = language === 'es' 
        ? `Faltan ${incompleteResponses.length} preguntas por responder`
        : `${incompleteResponses.length} questions remaining`;
      toast.error(errorMsg);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/external-evaluations/${token}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t('ext.connectionError'));
      }

      toast.success(t('ext.completedSuccess'));
      onCompleted();

    } catch (error) {
      console.error('Error submitting responses:', error);
      toast.error(error instanceof Error ? error.message : t('ext.connectionError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOptionLetter = (optionNumber: number): string => {
    return ['A', 'B', 'C', 'D'][optionNumber - 1] || '';
  };

  const getOptionText = (optionNumber: number): string => {
    if (!currentQuestion) return '';
    const options = [currentQuestion.optionA, currentQuestion.optionB, currentQuestion.optionC, currentQuestion.optionD];
    return options[optionNumber - 1] || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('ext.loading')}</h2>
            <p className="text-gray-600">{t('ext.loadingDesc')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <p>{t('ext.couldNotLoad')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('ext.disc.name')} - {t('ext.progress')}
          </h1>
          <p className="text-gray-600">
            {evaluationTitle}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              {t('ext.question')} {currentQuestionIndex + 1} {t('ext.of')} {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {completedQuestions} {language === 'es' ? 'completadas' : 'completed'}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {t('ext.question')} {currentQuestionIndex + 1}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {recipientName}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Instrucciones */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">{t('ext.instructions')}</span>
              </div>
              <p className="text-blue-700 text-sm">
                {language === 'es' 
                  ? 'Selecciona la palabra que MÁS se parece a ti y la que MENOS se parece a ti. No puedes seleccionar la misma palabra para ambas opciones.'
                  : 'Select the word that is MOST like you and the word that is LEAST like you. You cannot select the same word for both options.'
                }
              </p>
            </div>

            {/* Pregunta */}
            <div className="text-center">
              <CardDescription className="text-xl font-semibold text-gray-900">
                {currentQuestion.questionText}
              </CardDescription>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MÁS se parece a ti */}
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-4 text-center">
                  ✅ {t('ext.disc.most')} {language === 'es' ? 'se parece a ti' : 'like you'}
                </h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(optionNumber => (
                    <button
                      key={`most-${optionNumber}`}
                      onClick={() => handleOptionSelect(optionNumber, 'most')}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        currentResponse?.mostValue === optionNumber
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : currentResponse?.leastValue === optionNumber
                            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                      disabled={currentResponse?.leastValue === optionNumber}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          currentResponse?.mostValue === optionNumber
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {getOptionLetter(optionNumber)}
                        </div>
                        <span className="font-medium">
                          {getOptionText(optionNumber)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* MENOS se parece a ti */}
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-4 text-center">
                  ❌ {t('ext.disc.least')} {language === 'es' ? 'se parece a ti' : 'like you'}
                </h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(optionNumber => (
                    <button
                      key={`least-${optionNumber}`}
                      onClick={() => handleOptionSelect(optionNumber, 'least')}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        currentResponse?.leastValue === optionNumber
                          ? 'bg-red-100 border-red-500 text-red-800'
                          : currentResponse?.mostValue === optionNumber
                            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'bg-white border-gray-200 hover:border-red-300 hover:bg-red-50'
                      }`}
                      disabled={currentResponse?.mostValue === optionNumber}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          currentResponse?.leastValue === optionNumber
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {getOptionLetter(optionNumber)}
                        </div>
                        <span className="font-medium">
                          {getOptionText(optionNumber)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selection Summary */}
            {canGoNext() && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-green-800">
                      <strong>{t('ext.disc.most')}:</strong> {getOptionLetter(currentResponse!.mostValue)} - {getOptionText(currentResponse!.mostValue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-red-800">
                      <strong>{t('ext.disc.least')}:</strong> {getOptionLetter(currentResponse!.leastValue)} - {getOptionText(currentResponse!.leastValue)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={!canGoPrev()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('ext.previous')}
          </Button>

          <div className="flex items-center gap-4">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!canGoNext() || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('ext.submitting')}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('ext.finishEvaluation')}
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {t('ext.next')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>{t('ext.sentBy')}: {senderName} • Reclu</p>
        </div>
      </div>
    </div>
  );
}
