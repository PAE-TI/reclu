'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, AlertCircle, Loader2, CheckCircle, ChevronRight, ChevronLeft, Sparkles, Shield, Award, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ExternalEvaluationCompletedState from '@/components/external-evaluation-completed-state';
import ExternalEvaluationExpiredState from '@/components/external-evaluation-expired-state';

function BrandingHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Reclu</h1>
              <p className="text-xs text-gray-500">Plataforma de Talento</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100">
            <Target className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-medium text-cyan-600">Evaluación Acumen</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function BrandingFooter({ showCTA = true }: { showCTA?: boolean }) {
  return (
    <footer className="mt-auto">
      {showCTA && (
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">¿Te interesa evaluar a tu equipo?</h3>
            <p className="text-cyan-100 mb-4 text-sm">Descubre el potencial con evaluaciones completas</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 bg-white text-cyan-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-cyan-50 transition-colors shadow-lg">Conocer Reclu <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-white/20 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30">Crear cuenta gratis</Link>
            </div>
          </div>
        </div>
      )}
      <div className="bg-gray-900 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <div className="flex items-center gap-2 text-gray-400"><Shield className="w-4 h-4 text-green-400" /><span className="text-sm">Datos 100% confidenciales</span></div>
            <div className="flex items-center gap-2 text-gray-400"><Award className="w-4 h-4 text-yellow-400" /><span className="text-sm">Metodología certificada</span></div>
            <div className="flex items-center gap-2 text-gray-400"><Users className="w-4 h-4 text-blue-400" /><span className="text-sm">+10,000 evaluaciones</span></div>
          </div>
          <div className="text-center text-gray-500 text-sm">© 2025 Reclu. Plataforma de evaluación de talento empresarial.</div>
        </div>
      </div>
    </footer>
  );
}

const OPTION_VALUES: Record<string, number> = { 'Nunca': 1, 'Raramente': 2, 'A veces': 3, 'Frecuentemente': 4, 'Siempre': 5 };

export default function ExternalAcumenEvaluation() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [evaluation, setEvaluation] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [expired, setExpired] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const evalRes = await fetch(`/api/external-acumen-evaluations/${token}`);
      const data = await evalRes.json();

      if (!evalRes.ok) {
        if (evalRes.status === 400 && data.alreadyCompleted) {
          setEvaluation(data.evaluation || data);
          setCompleted(true);
          return;
        }
        if (evalRes.status === 410) {
          setExpired(true);
        }
        setError(data.error || 'Error al cargar');
        setLoading(false);
        return;
      }

      setEvaluation(data);

      if (data.status === 'COMPLETED' || data.alreadyCompleted) {
        setCompleted(true);
        return;
      }

      const questRes = await fetch(`/api/external-acumen-evaluations/${token}/questions`);
      if (questRes.ok) setQuestions(await questRes.json());
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (value: number) => {
    setResponses({ ...responses, [questions[currentQuestion].questionNumber]: value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formattedResponses = Object.entries(responses).map(([qNum, value]) => ({
        questionNumber: parseInt(qNum),
        selectedValue: value,
      }));

      const response = await fetch(`/api/external-acumen-evaluations/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: formattedResponses }),
      });

      if (response.ok) {
        setCompleted(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Error al enviar');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center"><Card className="max-w-md w-full border-0 shadow-xl"><CardContent className="p-8 text-center"><Loader2 className="w-12 h-12 animate-spin text-cyan-600 mx-auto" /><p className="mt-4 text-gray-600">Cargando evaluación...</p></CardContent></Card></main>
        <BrandingFooter showCTA={false} />
      </div>
    );
  }

  if (error) {
    if (expired) {
      return (
        <ExternalEvaluationExpiredState
          evaluationType="Acumen"
          evaluationTitle={evaluation?.title}
          recipientName={evaluation?.recipientName}
        />
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
        <BrandingHeader />
        <main className="flex-1 flex items-center justify-center p-4"><Card className="max-w-lg border-0 shadow-xl"><CardContent className="p-8 text-center"><AlertCircle className="w-16 h-16 text-red-500 mx-auto" /><h2 className="mt-4 text-xl font-bold text-gray-900">Error</h2><p className="mt-2 text-gray-600">{error}</p></CardContent></Card></main>
        <BrandingFooter />
      </div>
    );
  }

  if (completed) {
    return (
      <ExternalEvaluationCompletedState
        evaluationType="Acumen"
        evaluationTitle={evaluation?.title}
        recipientName={evaluation?.recipientName}
      />
    );
  }

  const progress = (Object.keys(responses).length / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const allAnswered = Object.keys(responses).length === questions.length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
      <BrandingHeader />
      <main className="flex-1 p-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-xl mb-6">
            <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <div><CardTitle className="text-xl">Evaluación Acumen</CardTitle><CardDescription className="text-cyan-100">Hola {evaluation?.recipientName}</CardDescription></div>
                <div className="text-right"><p className="text-sm text-cyan-100">Pregunta</p><p className="text-2xl font-bold">{currentQuestion + 1}/{questions.length}</p></div>
              </div>
              <Progress value={progress} className="mt-4 h-2 bg-cyan-800" />
            </CardHeader>
            <CardContent className="p-8">
              <div className="mb-8">
                <p className="text-lg text-gray-800 font-medium">{currentQ?.questionText}</p>
              </div>
              <div className="space-y-3">
                {['Nunca', 'Raramente', 'A veces', 'Frecuentemente', 'Siempre'].map((option, idx) => {
                  const value = idx + 1;
                  const isSelected = responses[currentQ?.questionNumber] === value;
                  return (
                    <button key={option} onClick={() => handleAnswer(value)} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${isSelected ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50'}`}>
                      <span className="font-medium">{value}. {option}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}><ChevronLeft className="w-4 h-4 mr-1" /> Anterior</Button>
                {isLastQuestion && allAnswered ? (
                  <Button onClick={handleSubmit} disabled={submitting} className="bg-green-600 hover:bg-green-700">{submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</> : <><CheckCircle className="w-4 h-4 mr-2" /> Finalizar</>}</Button>
                ) : (
                  <Button onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))} disabled={!responses[currentQ?.questionNumber]}>Siguiente <ChevronRight className="w-4 h-4 ml-1" /></Button>
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
