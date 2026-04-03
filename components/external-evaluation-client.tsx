'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User,
  Mail,
  PlayCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ExternalEvaluationQuestionnaire from './external-evaluation-questionnaire';
import { BrandingHeader, BrandingFooter } from './external-branding';
import { Language, translations } from '@/contexts/language-context';

interface EvaluationData {
  id: string;
  title: string;
  description?: string;
  recipientName: string;
  senderName: string;
  status: string;
  tokenExpiry: string;
  timeUntilExpiry: {
    hours: number;
    minutes: number;
    expired: boolean;
  };
  hasResponses: boolean;
  totalResponses: number;
  completedAt?: string;
  result?: any;
}

interface ExternalEvaluationClientProps {
  token: string;
}

export default function ExternalEvaluationClient({ token }: ExternalEvaluationClientProps) {
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [language, setLanguage] = useState<Language>('es');
  const router = useRouter();

  // Load language from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('reclu-language') as Language;
    if (saved && (saved === 'es' || saved === 'en')) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('reclu-language', lang);
  };

  const t = (key: string) => translations[language][key as keyof typeof translations['es']] || key;

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/external-evaluations/${token}`);
      const data = await response.json();

      if (response.status === 404) {
        setError(t('ext.notFoundMessage'));
        return;
      }

      if (response.status === 410 || data.expired) {
        setExpired(true);
        setError(t('ext.expiredMessage'));
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || t('ext.connectionError'));
      }

      if (data.alreadyCompleted) {
        setAlreadyCompleted(true);
        setEvaluation(data.evaluation);
        return;
      }

      setEvaluation(data.evaluation);
    } catch (error) {
      console.error('Error fetching evaluation:', error);
      setError(t('ext.connectionError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluation();
  }, [token]);

  const handleStartEvaluation = () => {
    setShowQuestionnaire(true);
  };

  const handleEvaluationCompleted = () => {
    toast.success(t('ext.completedSuccess'));
    fetchEvaluation();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <BrandingHeader language={language} setLanguage={handleSetLanguage} evaluationType={t('ext.disc.name')} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <RefreshCw className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('ext.loading')}</h2>
              <p className="text-gray-600">{t('ext.loadingDesc')}</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter language={language} showCTA={false} />
      </div>
    );
  }

  if (error || expired) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <BrandingHeader language={language} setLanguage={handleSetLanguage} evaluationType={t('ext.disc.name')} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {expired ? t('ext.expired') : t('ext.notAvailable')}
              </h1>
              <p className="text-lg text-gray-600 mb-6">{error}</p>
              {expired && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-amber-800 mb-2">{t('ext.whatToDo')}</h3>
                  <ul className="text-sm text-amber-700 space-y-1 text-left">
                    <li>• {t('ext.contactSender')}</li>
                    <li>• {t('ext.requestNewLink')}</li>
                    <li>• {t('ext.linksExpireReason')}</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
        <BrandingFooter language={language} />
      </div>
    );
  }

  if (alreadyCompleted && evaluation) {
    const dateLocale = language === 'es' ? 'es-ES' : 'en-US';
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <BrandingHeader language={language} setLanguage={handleSetLanguage} evaluationType={t('ext.disc.name')} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {t('ext.completed')}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {t('ext.completedOn')}{' '}
                {evaluation.completedAt && new Date(evaluation.completedAt).toLocaleDateString(dateLocale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">{t('ext.evalInfo')}</h3>
                <div className="text-sm text-blue-700 space-y-1 text-left">
                  <div><strong>{t('ext.evalTitle')}:</strong> {evaluation.title}</div>
                  <div><strong>{t('ext.sentBy')}:</strong> {evaluation.senderName}</div>
                  <div><strong>{t('ext.evaluated')}:</strong> {evaluation.recipientName}</div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 text-sm">
                  {t('ext.resultsMessage')} {evaluation.senderName}, {t('ext.reportMessage')}
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter language={language} />
      </div>
    );
  }

  if (showQuestionnaire && evaluation) {
    return (
      <div className="min-h-screen flex flex-col">
        <BrandingHeader language={language} setLanguage={handleSetLanguage} evaluationType={t('ext.disc.name')} />
        <main className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <ExternalEvaluationQuestionnaire
            token={token}
            evaluationTitle={evaluation.title}
            recipientName={evaluation.recipientName}
            senderName={evaluation.senderName}
            onCompleted={handleEvaluationCompleted}
            language={language}
          />
        </main>
        <BrandingFooter language={language} showCTA={false} />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <BrandingHeader language={language} setLanguage={handleSetLanguage} evaluationType={t('ext.disc.name')} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('ext.error')}</h2>
              <p className="text-gray-600">{t('ext.couldNotLoad')}</p>
            </CardContent>
          </Card>
        </main>
        <BrandingFooter language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <BrandingHeader language={language} setLanguage={handleSetLanguage} evaluationType={t('ext.disc.name')} />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('ext.disc.name')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('ext.disc.subtitle')}
            </p>
          </div>

          {/* Información de la Evaluación */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-center text-gray-900">
                {evaluation.title}
              </CardTitle>
              {evaluation.description && (
                <CardDescription className="text-center text-lg">
                  {evaluation.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Detalles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <User className="w-6 h-6 text-indigo-600 mb-2" />
                  <div className="text-sm text-gray-600">{t('ext.assessedPerson')}</div>
                  <div className="font-semibold text-gray-900">{evaluation.recipientName}</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-6 h-6 text-indigo-600 mb-2" />
                  <div className="text-sm text-gray-600">{t('ext.sentByPerson')}</div>
                  <div className="font-semibold text-gray-900">{evaluation.senderName}</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-indigo-600 mb-2" />
                  <div className="text-sm text-gray-600">{t('ext.timeRemaining')}</div>
                  <div className="font-semibold text-gray-900">
                    {evaluation.timeUntilExpiry.hours}h {evaluation.timeUntilExpiry.minutes}m
                  </div>
                </div>
              </div>

              {/* Información sobre DISC */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-800 mb-4">{t('ext.disc.whatIs')}</h3>
                <p className="text-indigo-700 mb-4">
                  {t('ext.disc.explanation')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold">D</span>
                    </div>
                    <div>
                      <div className="font-semibold text-indigo-800">{t('ext.disc.dominant')}</div>
                      <div className="text-sm text-indigo-600">{t('ext.disc.dominantDesc')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">I</span>
                    </div>
                    <div>
                      <div className="font-semibold text-indigo-800">{t('ext.disc.influential')}</div>
                      <div className="text-sm text-indigo-600">{t('ext.disc.influentialDesc')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">S</span>
                    </div>
                    <div>
                      <div className="font-semibold text-indigo-800">{t('ext.disc.stable')}</div>
                      <div className="text-sm text-indigo-600">{t('ext.disc.stableDesc')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">C</span>
                    </div>
                    <div>
                      <div className="font-semibold text-indigo-800">{t('ext.disc.conscientious')}</div>
                      <div className="text-sm text-indigo-600">{t('ext.disc.conscientiousDesc')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instrucciones */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">{t('ext.instructions')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('ext.howToAnswer')}</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• {t('ext.disc.tip1')}</li>
                      <li>• {t('ext.disc.tip2')}</li>
                      <li>• {t('ext.disc.tip3')}</li>
                      <li>• {t('ext.beHonest')}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('ext.importantTips')}</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• {t('ext.noRightWrong')}</li>
                      <li>• {t('ext.disc.tip4')}</li>
                      <li>• {t('ext.disc.tip5')}</li>
                      <li>• {t('ext.quietEnvironment')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 py-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">24</div>
                  <div className="text-sm text-gray-600">{t('ext.questions')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">10-15</div>
                  <div className="text-sm text-gray-600">{t('ext.minutes')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">24h</div>
                  <div className="text-sm text-gray-600">{t('ext.validFor')}</div>
                </div>
              </div>

              {/* Botón para comenzar */}
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleStartEvaluation}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 shadow-lg"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  {t('ext.startEvaluation')} DISC
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <BrandingFooter language={language} />
    </div>
  );
}
