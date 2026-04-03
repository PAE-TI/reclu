'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Brain,
  Target,
  Heart,
  Dna,
  Sparkles,
  Shield,
  Activity,
  CheckCircle2,
  Loader2,
  Package,
  Mail,
  User,
  Info,
  Check,
  ArrowRight,
  Clock,
  FileText,
  Coins,
  AlertTriangle,
  MailPlus,
  Mails,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/language-context';

const getEvaluationTypes = (t: (key: string) => string) => [
  {
    id: 'DISC',
    name: t('batch.eval.disc'),
    description: t('batch.eval.discDesc'),
    icon: Brain,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    questions: 24,
    time: '10-15 min',
  },
  {
    id: 'DRIVING_FORCES',
    name: t('batch.eval.df'),
    description: t('batch.eval.dfDesc'),
    icon: Target,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    questions: 12,
    time: '8-10 min',
  },
  {
    id: 'EQ',
    name: t('batch.eval.eq'),
    description: t('batch.eval.eqDesc'),
    icon: Heart,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    questions: 25,
    time: '10-12 min',
  },
  {
    id: 'DNA',
    name: t('batch.eval.dna'),
    description: t('batch.eval.dnaDesc'),
    icon: Dna,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    questions: 25,
    time: '10-12 min',
  },
  {
    id: 'ACUMEN',
    name: t('batch.eval.acumen'),
    description: t('batch.eval.acumenDesc'),
    icon: Sparkles,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    questions: 30,
    time: '12-15 min',
  },
  {
    id: 'VALUES',
    name: t('batch.eval.values'),
    description: t('batch.eval.valuesDesc'),
    icon: Shield,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    questions: 25,
    time: '10-12 min',
  },
  {
    id: 'STRESS',
    name: t('batch.eval.stress'),
    description: t('batch.eval.stressDesc'),
    icon: Activity,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    questions: 25,
    time: '10-12 min',
  },
];

export default function BatchEvaluationsPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const { t, language } = useLanguage();
  const EVALUATION_TYPES = getEvaluationTypes(t);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [selectedEvaluations, setSelectedEvaluations] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [singleEmail, setSingleEmail] = useState(true);
  const [creditInfo, setCreditInfo] = useState<{
    credits: number;
    creditsPerEvaluation: number;
    isFacilitator: boolean;
    creditOwnerName?: string;
  } | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/credits')
        .then(res => res.json())
        .then(data => {
          setCreditInfo({
            credits: data.credits || 0,
            creditsPerEvaluation: data.creditsPerEvaluation || 2,
            isFacilitator: data.isFacilitator || false,
            creditOwnerName: data.creditOwnerName
          });
        })
        .catch(err => console.error('Error fetching credits:', err));
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const toggleEvaluation = (id: string) => {
    setSelectedEvaluations(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const allIds = EVALUATION_TYPES.map(e => e.id);
    if (selectedEvaluations.length === allIds.length) {
      setSelectedEvaluations([]);
    } else {
      setSelectedEvaluations([...allIds]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientName.trim() || !recipientEmail.trim()) {
      toast.error(t('batch.fillAllFields'));
      return;
    }
    
    if (selectedEvaluations.length === 0) {
      toast.error(t('batch.selectAtLeastOne'));
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/batch-evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: recipientName.trim(),
          recipientEmail: recipientEmail.trim().toLowerCase(),
          evaluations: selectedEvaluations,
          singleEmail: singleEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar evaluaciones');
      }

      toast.success(data.message);
      setSent(true);
      // Update credits in header immediately
      window.dispatchEvent(new Event('credits-updated'));
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error sending evaluations';
      if (errorMessage.includes('Créditos insuficientes') || errorMessage.includes('Insufficient credits')) {
        toast.custom((toastData) => (
          <div className={`${toastData.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-red-50 border border-red-200 shadow-lg rounded-lg pointer-events-auto flex items-center justify-between p-4`}>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">{errorMessage}</p>
            </div>
            <button
              onClick={() => {
                toast.dismiss(toastData.id);
                router.push('/settings');
              }}
              className="ml-4 flex-shrink-0 bg-red-100 text-red-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-red-200 transition-colors"
            >
              {t('batch.goToSettings')}
            </button>
          </div>
        ), { duration: 8000 });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setRecipientName('');
    setRecipientEmail('');
    setSelectedEvaluations([]);
    setSent(false);
    setSingleEmail(true);
  };

  const totalQuestions = selectedEvaluations.reduce((acc, id) => {
    const eval_ = EVALUATION_TYPES.find(e => e.id === id);
    return acc + (eval_?.questions || 0);
  }, 0);

  const estimatedTime = selectedEvaluations.length * 12; // ~12 min promedio
  
  // Calcular créditos
  const creditsPerEval = creditInfo?.creditsPerEvaluation || 2;
  const totalCredits = selectedEvaluations.length * creditsPerEval;
  const hasEnoughCredits = creditInfo ? creditInfo.credits >= totalCredits : true;

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('batch.success')}</h2>
              <p className="text-gray-600 mb-6">
                {t('batch.successMessage').replace('{count}', String(selectedEvaluations.length))}{' '}
                <span className="font-semibold">{recipientName}</span> ({recipientEmail})
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {selectedEvaluations.map(id => {
                  const eval_ = EVALUATION_TYPES.find(e => e.id === id);
                  if (!eval_) return null;
                  return (
                    <Badge key={id} className={`${eval_.bgColor} ${eval_.color} border ${eval_.borderColor}`}>
                      <eval_.icon className="w-3 h-3 mr-1" />
                      {eval_.name}
                    </Badge>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500 mb-6">
                {singleEmail 
                  ? t('batch.singleEmailSent')
                  : t('batch.multipleEmailsSent')
                }
                {' '}{t('batch.viewProgress')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={resetForm} variant="outline" className="border-gray-300">
                  {t('batch.sendMore')}
                </Button>
                <Button onClick={() => router.push('/dashboard')} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  {t('batch.goToDashboard')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 mb-6 shadow-xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl lg:text-2xl font-bold text-white">
                  {t('batch.title')}
                </h1>
              </div>
              <p className="text-white/80 text-sm lg:text-base max-w-xl">
                {t('batch.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Créditos a consumir - Card principal */}
          <Card className={`backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow ${
            !hasEnoughCredits && selectedEvaluations.length > 0 
              ? 'bg-red-50 ring-2 ring-red-300' 
              : 'bg-white/80'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shadow-md ${
                  !hasEnoughCredits && selectedEvaluations.length > 0
                    ? 'bg-gradient-to-br from-red-500 to-rose-500'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                }`}>
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${
                    !hasEnoughCredits && selectedEvaluations.length > 0 ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {totalCredits}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">{t('batch.creditsToUse')}</p>
                </div>
              </div>
              {creditInfo && (
                <p className={`text-xs mt-2 ${
                  !hasEnoughCredits && selectedEvaluations.length > 0 ? 'text-red-500 font-medium' : 'text-gray-400'
                }`}>
                  {!hasEnoughCredits && selectedEvaluations.length > 0 
                    ? t('batch.insufficient').replace('{count}', String(creditInfo.credits))
                    : `${t('batch.available')}: ${creditInfo.credits}`
                  }
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600">{selectedEvaluations.length}</p>
                  <p className="text-xs text-gray-500 font-medium">{t('batch.selected')}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {creditsPerEval} {creditsPerEval !== 1 ? t('batch.creditsEach') : t('batch.creditEach')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-md">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                  <p className="text-xs text-gray-500 font-medium">{t('batch.questions')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl shadow-md">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">~{estimatedTime}</p>
                  <p className="text-xs text-gray-500 font-medium">{t('batch.minutes')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Formulario */}
            <div className="lg:col-span-2 space-y-6">
              {/* Datos del destinatario */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    {t('batch.recipientData')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('batch.fullName')}</Label>
                      <Input
                        id="name"
                        placeholder={t('batch.fullNamePlaceholder')}
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        disabled={sending}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('batch.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('batch.emailPlaceholder')}
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        disabled={sending}
                        className="bg-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Modo de envío de correos */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    {t('batch.sendFormat')}
                  </CardTitle>
                  <CardDescription>{t('batch.sendFormatDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Opción: Un solo correo */}
                    <div
                      onClick={() => !sending && setSingleEmail(true)}
                      className={`
                        relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${singleEmail
                          ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-200 ring-offset-1 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }
                        ${sending ? 'opacity-60 cursor-not-allowed' : ''}
                      `}
                    >
                      <div 
                        className={`mt-1 h-5 w-5 shrink-0 rounded-full flex items-center justify-center ${singleEmail ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow' : 'border-2 border-gray-300 bg-white'}`}
                      >
                        {singleEmail && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MailPlus className={`w-5 h-5 ${singleEmail ? 'text-blue-600' : 'text-gray-400'}`} />
                          <span className={`font-semibold ${singleEmail ? 'text-blue-900' : 'text-gray-700'}`}>
                            {t('batch.singleEmail')}
                          </span>
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                            {t('batch.recommended')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('batch.singleEmailDesc')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Opción: Múltiples correos */}
                    <div
                      onClick={() => !sending && setSingleEmail(false)}
                      className={`
                        relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${!singleEmail
                          ? 'border-purple-300 bg-purple-50 ring-2 ring-purple-200 ring-offset-1 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }
                        ${sending ? 'opacity-60 cursor-not-allowed' : ''}
                      `}
                    >
                      <div 
                        className={`mt-1 h-5 w-5 shrink-0 rounded-full flex items-center justify-center ${!singleEmail ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow' : 'border-2 border-gray-300 bg-white'}`}
                      >
                        {!singleEmail && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Mails className={`w-5 h-5 ${!singleEmail ? 'text-purple-600' : 'text-gray-400'}`} />
                          <span className={`font-semibold ${!singleEmail ? 'text-purple-900' : 'text-gray-700'}`}>
                            {t('batch.multipleEmails')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('batch.multipleEmailsDesc')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Selección de evaluaciones */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      {t('batch.selectEvaluations')}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAll}
                      disabled={sending}
                      className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                    >
                      {selectedEvaluations.length === EVALUATION_TYPES.length ? t('batch.deselectAll') : t('batch.selectAll')}
                    </Button>
                  </div>
                  <CardDescription>{t('batch.selectEvaluationsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {EVALUATION_TYPES.map((eval_) => {
                      const isSelected = selectedEvaluations.includes(eval_.id);
                      return (
                        <div
                          key={eval_.id}
                          onClick={() => !sending && toggleEvaluation(eval_.id)}
                          className={`
                            relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                            ${isSelected
                              ? `${eval_.borderColor} ${eval_.bgColor} ring-2 ring-offset-1 shadow-md`
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                            }
                            ${sending ? 'opacity-60 cursor-not-allowed' : ''}
                          `}
                        >
                          <div 
                            className={`mt-1 h-5 w-5 shrink-0 rounded flex items-center justify-center ${isSelected ? 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow' : 'border-2 border-gray-300 bg-white'}`}
                          >
                            {isSelected && (
                              <Check className="h-3.5 w-3.5 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${eval_.bgColor}`}>
                                <eval_.icon className={`w-4 h-4 ${eval_.color}`} />
                              </div>
                              <span className="font-medium text-gray-900">{eval_.name}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{eval_.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                              <span>{eval_.questions} {language === 'en' ? 'questions' : 'preguntas'}</span>
                              <span>•</span>
                              <span>{eval_.time}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel lateral - Resumen */}
            <div className="space-y-4">
              <Card className="sticky top-4 bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                      <Send className="w-4 h-4 text-white" />
                    </div>
                    {t('batch.sendSummary')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recipientName && (
                    <div className="flex items-center gap-2 text-sm p-3 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 text-indigo-500" />
                      <span className="text-gray-600">{t('batch.to')}:</span>
                      <span className="font-medium text-gray-900">{recipientName}</span>
                    </div>
                  )}
                  {recipientEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500 truncate">{recipientEmail}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-gray-600">{t('batch.selectedEvaluations')}</span>
                      <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">{selectedEvaluations.length} {t('batch.of')} 7</Badge>
                    </div>
                    
                    {selectedEvaluations.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {selectedEvaluations.map(id => {
                          const eval_ = EVALUATION_TYPES.find(e => e.id === id);
                          if (!eval_) return null;
                          return (
                            <div key={id} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-lg">
                              <eval_.icon className={`w-4 h-4 ${eval_.color}`} />
                              <span className="text-gray-700">{eval_.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          {t('batch.totalQuestions')}
                        </span>
                        <span className="font-bold text-gray-900">{totalQuestions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-500" />
                          {t('batch.estimatedTime')}
                        </span>
                        <span className="font-bold text-gray-900">~{estimatedTime} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Banner de Créditos */}
                  {selectedEvaluations.length > 0 && (
                    <div className={`rounded-xl p-4 border-2 ${
                      hasEnoughCredits 
                        ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200' 
                        : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${hasEnoughCredits ? 'bg-emerald-100' : 'bg-red-100'}`}>
                          <Coins className={`w-5 h-5 ${hasEnoughCredits ? 'text-emerald-600' : 'text-red-600'}`} />
                        </div>
                        <div>
                          <p className={`text-lg font-bold ${hasEnoughCredits ? 'text-emerald-700' : 'text-red-700'}`}>
                            {totalCredits} {totalCredits !== 1 ? t('batch.credits') : t('batch.credit')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedEvaluations.length} {selectedEvaluations.length !== 1 ? t('batch.evaluations') : t('batch.evaluation')} × {creditsPerEval} {creditsPerEval !== 1 ? t('batch.credits') : t('batch.credit')} {language === 'en' ? 'each' : 'c/u'}
                          </p>
                        </div>
                      </div>
                      {creditInfo && (
                        <p className={`text-xs ${hasEnoughCredits ? 'text-emerald-600' : 'text-red-600'}`}>
                          {hasEnoughCredits 
                            ? `${language === 'en' ? 'You have' : 'Tienes'} ${creditInfo.credits} ${language === 'en' ? 'credits available' : 'créditos disponibles'}`
                            : `❌ ${t('batch.insufficient').replace('{count}', String(creditInfo.credits))}`
                          }
                        </p>
                      )}
                    </div>
                  )}

                  {/* Advertencia de no reembolso */}
                  {selectedEvaluations.length > 0 && (
                    <div className="flex items-start gap-2 text-xs bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-amber-800">
                        <strong>⚠️ {t('batch.important')}:</strong> {t('batch.noRefund')}
                      </span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg h-12 text-base"
                    disabled={sending || selectedEvaluations.length === 0 || !recipientName || !recipientEmail}
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('batch.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        {t('batch.send')} {selectedEvaluations.length} {selectedEvaluations.length !== 1 ? t('batch.evaluations') : t('batch.evaluation')}
                      </>
                    )}
                  </Button>

                  <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>
                      {singleEmail 
                        ? t('batch.singleEmailInfo')
                        : t('batch.multipleEmailsInfo')
                      }
                      {' '}{t('batch.linksValid')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
