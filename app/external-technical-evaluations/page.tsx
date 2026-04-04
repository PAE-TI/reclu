'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import {
  Plus,
  Mail,
  Send,
  Users,
  FileCode,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Eye,
  Copy,
  Trash2,
  RefreshCw,
  Briefcase,
  Search,
  Target,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { EvaluationNotesButton } from '@/components/evaluation-notes';
import { ExternalTechnicalQuestionBuilder } from '@/components/external-technical-question-builder';
import { useLanguage } from '@/contexts/language-context';
import { JOB_POSITIONS, JOB_CATEGORIES, JobCategory } from '@/lib/job-positions';

interface TechnicalEvaluation {
  id: string;
  title: string;
  description: string | null;
  recipientName: string;
  recipientEmail: string;
  jobPositionId: string;
  jobPositionTitle: string;
  token: string;
  tokenExpiry: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  senderUser: {
    name: string | null;
    company: string | null;
  };
  result: {
    totalScore: number;
    correctAnswers: number;
    totalQuestions: number;
    performanceLevel: string;
  } | null;
}

interface QuestionBankQuestion {
  id: string;
  jobPositionId: string;
  jobPositionTitle: string;
  questionNumber: number;
  questionText: string;
  category: string | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

interface QuestionSetConfig {
  basePositionId: string;
  sourcePositionId: string;
  filters: {
    search: string;
    category: string;
    difficulty: 'all' | 'EASY' | 'MEDIUM' | 'HARD';
  };
  questionIds: string[];
}

export default function ExternalTechnicalEvaluationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, language } = useLanguage();

  const [evaluations, setEvaluations] = useState<TechnicalEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('send');
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    jobPositionId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<TechnicalEvaluation | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [resending, setResending] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionBankQuestion[]>([]);
  const [questionSetConfig, setQuestionSetConfig] = useState<QuestionSetConfig | null>(null);
  const [questionsReady, setQuestionsReady] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchEvaluations();
    }
  }, [status, router]);

  const fetchEvaluations = async () => {
    try {
      const response = await fetch('/api/external-technical-evaluations');
      if (!response.ok) throw new Error(t('extEval.error.loadFailed'));
      
      const data = await response.json();
      setEvaluations(data.evaluations || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter job positions based on search and category
  const filteredPositions = useMemo(() => {
    return JOB_POSITIONS.filter(pos => {
      const matchesSearch = searchTerm === '' || 
        pos.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pos.synonyms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || pos.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).slice(0, 50);
  }, [searchTerm, selectedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobPositionId) {
      setError(language === 'es' ? 'Selecciona un cargo' : 'Select a job position');
      return;
    }

    if (!questionsReady || selectedQuestions.length !== 20) {
      setError(language === 'es'
        ? 'Debes completar y revisar las 20 preguntas antes de enviar.'
        : 'You must complete and review all 20 questions before sending.'
      );
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/external-technical-evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          questionIds: selectedQuestions.map(question => question.id),
          questionSetConfig,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('extEval.error.createFailed'));
      }
      
      setSuccess(`${t('extEval.success.sent')} ${formData.recipientEmail}`);
      setFormData({ recipientName: '', recipientEmail: '', jobPositionId: '' });
      setSearchTerm('');
      setSelectedQuestions([]);
      setQuestionSetConfig(null);
      setQuestionsReady(false);
      fetchEvaluations();
      window.dispatchEvent(new Event('credits-updated'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const copyInvitationLink = async (token: string) => {
    const link = `${window.location.origin}/external-technical-evaluation/${token}`;
    await navigator.clipboard.writeText(link);
    setSuccess(t('extEval.success.copied'));
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteClick = (evaluation: TechnicalEvaluation) => {
    setEvaluationToDelete(evaluation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!evaluationToDelete) return;

    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/external-technical-evaluations/${evaluationToDelete.token}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('extEval.error.deleteFailed'));
      }

      setSuccess(t('extEval.success.deleted').replace('{name}', evaluationToDelete.recipientName));
      fetchEvaluations();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setEvaluationToDelete(null);
    }
  };

  const handleResendEmail = async (token: string, recipientName: string) => {
    setResending(token);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/external-technical-evaluations/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('extEval.error.resendFailed'));
      }

      setSuccess(`${t('extEval.success.resent')} ${recipientName}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(null);
    }
  };

  const getStatusBadge = (evaluation: TechnicalEvaluation) => {
    const isExpired = new Date() > new Date(evaluation.tokenExpiry);
    
    if (isExpired && evaluation.status !== 'COMPLETED') {
      return <Badge className="bg-red-500 text-white">{t('extEval.status.expired')}</Badge>;
    }
    
    switch (evaluation.status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500 text-white">{t('extEval.status.completed')}</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-500 text-white">{t('extEval.status.pending')}</Badge>;
      default:
        return <Badge variant="secondary">{evaluation.status}</Badge>;
    }
  };

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case 'EXCELENTE': return 'text-green-600';
      case 'MUY_BUENO': return 'text-emerald-600';
      case 'BUENO': return 'text-blue-600';
      case 'ACEPTABLE': return 'text-yellow-600';
      case 'NECESITA_MEJORA': return 'text-orange-600';
      case 'INSUFICIENTE': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceLabel = (level: string) => {
    const labels: Record<string, string> = {
      'EXCELENTE': language === 'es' ? 'Excelente' : 'Excellent',
      'MUY_BUENO': language === 'es' ? 'Muy Bueno' : 'Very Good',
      'BUENO': language === 'es' ? 'Bueno' : 'Good',
      'ACEPTABLE': language === 'es' ? 'Aceptable' : 'Acceptable',
      'NECESITA_MEJORA': language === 'es' ? 'Necesita Mejora' : 'Needs Improvement',
      'INSUFICIENTE': language === 'es' ? 'Insuficiente' : 'Insufficient',
    };
    return labels[level] || level;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('extEval.loading')}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const completedCount = evaluations.filter(e => e.status === 'COMPLETED').length;
  const pendingCount = evaluations.filter(e => e.status === 'PENDING' && new Date() <= new Date(e.tokenExpiry)).length;
  const expiredCount = evaluations.filter(e => e.status !== 'COMPLETED' && new Date() > new Date(e.tokenExpiry)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'es' ? 'Evaluaciones Técnicas Externas' : 'External Technical Evaluations'}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'es' 
              ? 'Envía evaluaciones técnicas específicas para cada cargo a candidatos externos'
              : 'Send job-specific technical evaluations to external candidates'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('extEval.stats.totalSent')}</p>
                  <p className="text-2xl font-bold text-gray-900">{evaluations.length}</p>
                </div>
                <FileCode className="w-8 h-8 text-sky-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('extEval.stats.completed')}</p>
                  <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('extEval.stats.pending')}</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('extEval.stats.expired')}</p>
                  <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-700 flex items-center justify-between gap-4">
              <span>{error}</span>
              {error.includes('Créditos insuficientes') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/settings')}
                  className="border-red-300 text-red-700 hover:bg-red-100 whitespace-nowrap"
                >
                  {t('extEval.error.goToSettings')}
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="grid w-full grid-cols-2 lg:w-[400px] bg-gray-100 p-1 rounded-md">
            <Button
              variant={activeTab === 'send' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('send')}
              className={`flex items-center gap-2 ${activeTab === 'send' ? 'bg-sky-600 hover:bg-sky-700' : ''}`}
            >
              <Send className="w-4 h-4" />
              {t('extEval.tabs.send')}
            </Button>
            <Button
              variant={activeTab === 'manage' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('manage')}
              className={`flex items-center gap-2 ${activeTab === 'manage' ? 'bg-sky-600 hover:bg-sky-700' : ''}`}
            >
              <Users className="w-4 h-4" />
              {t('extEval.tabs.manage')} ({evaluations.length})
            </Button>
          </div>

          {/* Send Form */}
          {activeTab === 'send' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-sky-600" />
                      {language === 'es' ? 'Enviar Evaluación Técnica' : 'Send Technical Evaluation'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'es' 
                        ? 'Las preguntas se generan automáticamente según el cargo seleccionado'
                        : 'Questions are automatically generated based on the selected position'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="recipientName">{t('extEval.form.fullNameRequired')}</Label>
                          <Input
                            id="recipientName"
                            value={formData.recipientName}
                            onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                            placeholder={t('extEval.form.namePlaceholder')}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="recipientEmail">{t('extEval.form.emailRequired')}</Label>
                          <Input
                            id="recipientEmail"
                            type="email"
                            value={formData.recipientEmail}
                            onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                            placeholder={t('extEval.form.emailPlaceholder')}
                            required
                          />
                        </div>
                      </div>

                      {/* Job Position Selection */}
                      <div className="space-y-4">
                        <Label>{language === 'es' ? 'Cargo a Evaluar *' : 'Position to Evaluate *'}</Label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              placeholder={language === 'es' ? 'Buscar cargo...' : 'Search position...'}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder={language === 'es' ? 'Todas las categorías' : 'All categories'} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">{language === 'es' ? 'Todas las categorías' : 'All categories'}</SelectItem>
                              {Object.entries(JOB_CATEGORIES).map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.jobPositionId && (
                          <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-sky-600" />
                                <span className="font-medium text-sky-800">
                                  {JOB_POSITIONS.find(p => p.id === formData.jobPositionId)?.title}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setFormData({ ...formData, jobPositionId: '' })}
                                className="text-sky-600 hover:text-sky-800"
                              >
                                {language === 'es' ? 'Cambiar' : 'Change'}
                              </Button>
                            </div>
                          </div>
                        )}

                        {!formData.jobPositionId && (
                          <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
                            {filteredPositions.length === 0 ? (
                              <div className="p-4 text-center text-gray-500">
                                {language === 'es' ? 'No se encontraron cargos' : 'No positions found'}
                              </div>
                            ) : (
                              filteredPositions.map(pos => (
                                <button
                                  key={pos.id}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, jobPositionId: pos.id })}
                                  className="w-full p-3 text-left hover:bg-sky-50 transition-colors flex items-center justify-between"
                                >
                                  <div>
                                    <p className="font-medium text-gray-900">{pos.title}</p>
                                    <p className="text-sm text-gray-500">{JOB_CATEGORIES[pos.category].name}</p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {pos.subcategory}
                                  </Badge>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>

                      {formData.jobPositionId && (
                        <ExternalTechnicalQuestionBuilder
                          basePositionId={formData.jobPositionId}
                          language={language === 'es' ? 'es' : 'en'}
                          onChange={({ questionIds, questionSetConfig: config, selectedQuestions: previewQuestions, ready }) => {
                            setSelectedQuestions(previewQuestions);
                            setQuestionSetConfig(config);
                            setQuestionsReady(ready && questionIds.length === 20);
                          }}
                        />
                      )}

                      <Button
                        type="submit"
                        disabled={submitting || !formData.jobPositionId || !questionsReady}
                        className="w-full bg-sky-600 hover:bg-sky-700"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t('extEval.form.sending')}
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {t('extEval.form.send')}
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-sky-50 border-sky-200 border shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sky-800 text-lg">
                      ✅ {t('extEval.howItWorks.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-sky-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <p className="text-sky-700 text-sm">{language === 'es' ? 'Selecciona el cargo específico a evaluar' : 'Select the specific position to evaluate'}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-sky-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <p className="text-sky-700 text-sm">{language === 'es' ? 'El candidato recibe el enlace por email' : 'Candidate receives the link by email'}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-sky-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <p className="text-sky-700 text-sm">
                        {language === 'es'
                          ? 'Revisa las 20 preguntas, cámbialas por otras de cualquier cargo, tema o nivel y personaliza el set completo'
                          : 'Review the 20 questions, swap them for others from any role, topic, or difficulty, and fully customize the set'}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-sky-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <p className="text-sky-700 text-sm">{language === 'es' ? 'Recibirás los resultados con análisis detallado' : "You'll receive results with detailed analysis"}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-200 border shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800 text-lg">
                      ⚠️ {t('extEval.important.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-amber-700 text-sm space-y-2">
                      <li>• {t('extEval.important.expiry')}</li>
                      <li>• {t('extEval.important.singleUse')}</li>
                      <li>• {language === 'es' ? 'Las preguntas son únicas para cada cargo' : 'Questions are unique to each position'}</li>
                      <li>• {t('extEval.important.canDelete')}</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Manage Evaluations */}
          {activeTab === 'manage' && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-sky-600" />
                  {language === 'es' ? 'Gestionar Evaluaciones Técnicas' : 'Manage Technical Evaluations'}
                </CardTitle>
                <CardDescription>
                  {language === 'es' 
                    ? 'Administra las evaluaciones técnicas enviadas a candidatos externos'
                    : 'Manage technical evaluations sent to external candidates'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {evaluations.length === 0 ? (
                  <div className="text-center py-12">
                    <FileCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('extEval.manage.empty')}</h3>
                    <p className="text-gray-600 mb-6">{t('extEval.manage.emptyDesc')}</p>
                    <Button 
                      onClick={() => setActiveTab('send')}
                      className="bg-sky-600 hover:bg-sky-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('extEval.manage.sendFirst')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {evaluations.map((evaluation) => {
                      const isExpired = new Date() > new Date(evaluation.tokenExpiry) && evaluation.status !== 'COMPLETED';
                      
                      return (
                        <div key={evaluation.id} className="p-4 sm:p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 overflow-hidden">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                                  {evaluation.recipientName}
                                </h3>
                                {getStatusBadge(evaluation)}
                              </div>
                              
                              <div className="space-y-1 text-sm text-gray-600 mb-3">
                                <p className="break-all">{evaluation.recipientEmail}</p>
                                <div className="flex items-center gap-2">
                                  <Briefcase className="w-4 h-4 text-sky-600" />
                                  <span className="font-medium text-sky-700">{evaluation.jobPositionTitle}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {language === 'es' ? 'Enviado: ' : 'Sent: '}
                                    {new Date(evaluation.createdAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}
                                  </span>
                                </div>
                                {evaluation.status === 'COMPLETED' && evaluation.result && (
                                  <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-sky-600" />
                                    <span>
                                      <span className={`font-semibold ${getPerformanceColor(evaluation.result.performanceLevel)}`}>
                                        {Math.round(evaluation.result.totalScore)}%
                                      </span>
                                      <span className="text-gray-500 mx-1">•</span>
                                      <span className={getPerformanceColor(evaluation.result.performanceLevel)}>
                                        {getPerformanceLabel(evaluation.result.performanceLevel)}
                                      </span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-2">
                              {evaluation.status === 'PENDING' && !isExpired && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResendEmail(evaluation.token, evaluation.recipientName)}
                                  disabled={resending === evaluation.token}
                                  className="bg-white text-sky-600 border-sky-200 hover:bg-sky-50 hover:border-sky-300"
                                >
                                  {resending === evaluation.token ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Send className="h-4 w-4" />
                                  )}
                                  <span className="ml-1 hidden sm:inline">{language === 'es' ? 'Reenviar' : 'Resend'}</span>
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyInvitationLink(evaluation.token)}
                                className="bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                              >
                                <Copy className="h-4 w-4" />
                                <span className="ml-1 hidden sm:inline">{language === 'es' ? 'Copiar' : 'Copy'}</span>
                              </Button>
                              {evaluation.status === 'COMPLETED' && (
                                <Link href={`/external-technical-evaluation-results/${evaluation.token}`}>
                                  <Button variant="outline" size="sm" className="bg-white text-green-600 border-green-200 hover:bg-green-50">
                                    <Eye className="h-4 w-4" />
                                    <span className="ml-1 hidden sm:inline">{language === 'es' ? 'Ver' : 'View'}</span>
                                  </Button>
                                </Link>
                              )}
                              <EvaluationNotesButton
                                evaluationType="TECHNICAL"
                                evaluationId={evaluation.token}
                                recipientEmail={evaluation.recipientEmail}
                                recipientName={evaluation.recipientName}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(evaluation)}
                                className="bg-white text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === 'es' ? '¿Eliminar evaluación?' : 'Delete evaluation?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'es' 
                ? `Esta acción no se puede deshacer. Se eliminará la evaluación de ${evaluationToDelete?.recipientName}.`
                : `This action cannot be undone. The evaluation for ${evaluationToDelete?.recipientName} will be deleted.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === 'es' ? 'Eliminando...' : 'Deleting...'}
                </>
              ) : (
                language === 'es' ? 'Eliminar' : 'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
