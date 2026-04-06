'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PDFGenerator } from '@/lib/pdf-generator';
import { useLanguage } from '@/contexts/language-context';
import {
  Search,
  Mail,
  Loader2,
  Lock,
  ExternalLink,
  Download,
  LogOut,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FolderKanban,
  FileSearch,
  ShieldCheck,
  Activity,
  Target,
  Flame,
  Heart,
  Dna,
  Compass,
  BadgeCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

type FilterState = 'all' | 'pending' | 'completed' | 'expired';
type PortalEvaluationType =
  | 'disc'
  | 'driving-forces'
  | 'eq'
  | 'dna'
  | 'acumen'
  | 'values'
  | 'stress'
  | 'technical';

interface PortalEvaluationMetric {
  label: string;
  value: string;
}

interface PortalEvaluationSummary {
  accent: 'indigo' | 'emerald' | 'rose' | 'teal' | 'amber' | 'violet' | 'orange' | 'sky';
  title: string;
  description: string;
  metrics: PortalEvaluationMetric[];
}

interface PortalEvaluationRecord {
  id: string;
  token: string;
  type: PortalEvaluationType;
  typeLabel: string;
  title: string;
  contextLabel: string | null;
  description: string | null;
  recipientName: string;
  recipientEmail: string;
  senderName: string | null;
  senderCompany: string | null;
  status: string;
  tokenExpiry: string;
  completedAt: string | null;
  createdAt: string;
  result: unknown | null;
  summary: PortalEvaluationSummary;
}

function normalizePortalCode(code: string) {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function getPortalStatusLabel(status: string) {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'Completada';
    case 'EXPIRED':
      return 'Expirada';
    default:
      return 'Pendiente';
  }
}

const accentClasses: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: 'text-indigo-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'text-emerald-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: 'text-rose-600' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', icon: 'text-teal-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', icon: 'text-violet-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: 'text-orange-600' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', icon: 'text-sky-600' },
};

const typeIcons: Record<PortalEvaluationType, any> = {
  disc: Target,
  'driving-forces': Flame,
  eq: Heart,
  dna: Dna,
  acumen: Compass,
  values: ShieldCheck,
  stress: Activity,
  technical: FileSearch,
};

function getFileName(record: PortalEvaluationRecord) {
  const base = `${record.typeLabel}-${record.title}-${record.recipientName}`.toLowerCase();
  return base.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'reporte';
}

function StatusIcon({ status }: { status: string }) {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return <CheckCircle2 className="w-4 h-4" />;
    case 'EXPIRED':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Clock3 className="w-4 h-4" />;
  }
}

function renderTechnicalDetails(result: any) {
  if (!result) return null;
  const categoryEntries = Object.entries(result.categoryScores || {}).sort(([, a], [, b]) => (b as number) - (a as number));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Desempeño general</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(result.totalScore || 0)}%</p>
        <p className="text-sm text-slate-600">{result.correctAnswers || 0} aciertos de {result.totalQuestions || 0}</p>
      </div>
      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nivel</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{result.performanceLevel || 'Pendiente'}</p>
        <p className="text-sm text-slate-600">Lectura automática del rendimiento</p>
      </div>
      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tiempo promedio</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {typeof result.averageTimePerQuestion === 'number'
            ? result.averageTimePerQuestion < 60
              ? `${Math.round(result.averageTimePerQuestion)}s`
              : `${Math.floor(result.averageTimePerQuestion / 60)}m ${Math.round(result.averageTimePerQuestion % 60)}s`
            : 'N/D'}
        </p>
        <p className="text-sm text-slate-600">Por pregunta</p>
      </div>
      {categoryEntries.length > 0 && (
        <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-slate-900">Categorías principales</p>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {categoryEntries.slice(0, 6).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-600">{label}</span>
                <span className="text-sm font-semibold text-slate-900">{Math.round(value as number)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function renderGenericDetails(record: PortalEvaluationRecord) {
  const result = record.result as any;
  if (!result) return null;

  switch (record.type) {
    case 'disc':
      return (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estilo principal</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{result.primaryStyle || 'N/D'}</p>
            <p className="text-sm text-slate-600">{result.personalityType || 'Perfil DISC'}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Intensidad</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(result.styleIntensity || 0)}%</p>
            <p className="text-sm text-slate-600">Claridad del patrón</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estilo secundario</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{result.secondaryStyle || 'N/D'}</p>
            <p className="text-sm text-slate-600">Complemento natural</p>
          </div>
        </div>
      );
    case 'driving-forces':
      return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(result.primaryMotivators || []).slice(0, 4).map((motivator: string, index: number) => (
            <div key={`${motivator}-${index}`} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Top {index + 1}</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{motivator}</p>
            </div>
          ))}
        </div>
      );
    case 'eq':
      return (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nivel EQ</p><p className="mt-2 text-2xl font-bold text-slate-900">{result.eqLevel || 'N/D'}</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Autoconciencia</p><p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(result.selfAwarenessPercentile || 0)}%</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Empatía</p><p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(result.empathyPercentile || 0)}%</p></div>
        </div>
      );
    case 'dna':
      return (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nivel DNA</p><p className="mt-2 text-2xl font-bold text-slate-900">{result.dnaLevel || 'N/D'}</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pensamiento</p><p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(result.thinkingCategoryScore || 0)}%</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Comunicación</p><p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(result.communicationCategoryScore || 0)}%</p></div>
        </div>
      );
    case 'acumen':
      return (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nivel</p><p className="mt-2 text-2xl font-bold text-slate-900">{result.acumenLevel || 'N/D'}</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Clarity externa</p><p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(result.externalClarityScore || 0)}%</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Clarity interna</p><p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(result.internalClarityScore || 0)}%</p></div>
        </div>
      );
    case 'values':
      return (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nivel</p><p className="mt-2 text-2xl font-bold text-slate-900">{result.valuesLevel || 'N/D'}</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Integridad</p><p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(result.integrityScore || 0)}%</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Autenticidad</p><p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(result.authenticityScore || 0)}%</p></div>
        </div>
      );
    case 'stress':
      return (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estrés general</p><p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(result.nivelEstresGeneral || 0)}%</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Resiliencia</p><p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(result.indiceResiliencia || 0)}%</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Adaptación</p><p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(result.capacidadAdaptacion || 0)}%</p></div>
        </div>
      );
    case 'technical':
      return renderTechnicalDetails(result);
    default:
      return null;
  }
}

function statusBadgeClasses(status: string) {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'EXPIRED':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    default:
      return 'bg-amber-100 text-amber-700 border-amber-200';
  }
}

export default function ResultsPortalClient() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [requestEmail, setRequestEmail] = useState('');
  const [requestCode, setRequestCode] = useState('');
  const [codeRequestedFor, setCodeRequestedFor] = useState<string | null>(null);
  const [accessEmail, setAccessEmail] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<PortalEvaluationRecord[]>([]);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingCode, setLoadingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterState>('all');
  const [expandedToken, setExpandedToken] = useState<string | null>(null);

  const counts = useMemo(() => {
    return evaluations.reduce(
      (acc, evaluation) => {
        acc.total += 1;
        const key = evaluation.status.toLowerCase() as 'pending' | 'completed' | 'expired';
        acc[key] += 1;
        return acc;
      },
      { total: 0, pending: 0, completed: 0, expired: 0 }
    );
  }, [evaluations]);

  const filteredEvaluations = useMemo(() => {
    if (activeFilter === 'all') return evaluations;
    return evaluations.filter((evaluation) => evaluation.status.toLowerCase() === activeFilter);
  }, [evaluations, activeFilter]);

  const loadResults = async () => {
    setLoadingResults(true);
    try {
      const response = await fetch('/api/results-portal/results', { cache: 'no-store' });
      if (!response.ok) {
        if (response.status === 401) {
          setAccessEmail(null);
          setEvaluations([]);
          return false;
        }
        throw new Error('No se pudieron cargar los resultados');
      }

      const data = await response.json();
      setAccessEmail(data.email);
      setEvaluations(data.evaluations || []);
      setExpandedToken((current) => current || data.evaluations?.[0]?.token || null);
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudieron cargar los resultados');
      return false;
    } finally {
      setLoadingResults(false);
      setLoadingSession(false);
    }
  };

  useEffect(() => {
    const email = searchParams.get('email');
    const code = searchParams.get('code');

    const autoVerify = async () => {
      if (!email || !code) {
        setLoadingSession(false);
        await loadResults();
        return;
      }

      setRequestEmail(email);
      setRequestCode(code);
      setVerifyingCode(true);

      try {
        const response = await fetch('/api/results-portal/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code }),
        });

        if (!response.ok) {
          throw new Error('No se pudo validar el acceso automático');
        }

        toast.success('Acceso validado');
        setRequestCode('');
        router.replace('/mis-resultados');
        await loadResults();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'No se pudo validar el acceso');
        setLoadingSession(false);
      } finally {
        setVerifyingCode(false);
      }
    };

    autoVerify();
  }, [router, searchParams]);

  const handleRequestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingCode(true);
    try {
      const response = await fetch('/api/results-portal/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: requestEmail }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo enviar el código');
      }

      setCodeRequestedFor(requestEmail.trim().toLowerCase());
      setRequestCode('');
      toast.success('Revisa tu correo y usa el código para entrar');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo enviar el código');
    } finally {
      setLoadingCode(false);
    }
  };

  const handleVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVerifyingCode(true);
    try {
      const response = await fetch('/api/results-portal/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: requestEmail,
          code: normalizePortalCode(requestCode),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo verificar el código');
      }

      toast.success('Acceso concedido');
      setRequestCode('');
      router.replace('/mis-resultados');
      await loadResults();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo verificar el código');
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch('/api/results-portal/logout', { method: 'POST' });
      setAccessEmail(null);
      setEvaluations([]);
      setExpandedToken(null);
      setCodeRequestedFor(null);
      setRequestCode('');
      setActiveFilter('all');
      toast.success('Sesión cerrada');
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleDownloadPdf = async (record: PortalEvaluationRecord) => {
    try {
      const response = await fetch(`/api/export/external-pdf/${record.type}/${record.token}`);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo preparar el PDF');
      }

      const data = await response.json();
      await PDFGenerator.downloadPDF(data.html, {
        format: 'a4',
        orientation: 'portrait',
        filename: `${getFileName(record)}.pdf`,
      });
      toast.success('PDF descargado');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo descargar el PDF');
    }
  };

  const isAuthenticated = Boolean(accessEmail);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
          <Card className="border-slate-200 bg-white/95 shadow-xl shadow-slate-200/50">
            <CardHeader className="space-y-3 border-b border-slate-100 bg-gradient-to-r from-slate-950 to-indigo-950 text-white">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-100">
                <Lock className="h-3.5 w-3.5" />
                Portal privado de resultados
              </div>
              <CardTitle className="text-2xl">
                {language === 'es' ? 'Ver mis resultados' : 'View my results'}
              </CardTitle>
              <p className="text-sm leading-6 text-slate-200">
                {language === 'es'
                  ? 'Ingresa tu correo, recibe un código temporal y revisa tus evaluaciones completadas, pendientes y descargables desde un solo lugar.'
                  : 'Enter your email, receive a temporary code, and review completed, pending and downloadable assessments in one place.'}
              </p>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{counts.total}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Completadas</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-700">{counts.completed}</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Pendientes</p>
                  <p className="mt-1 text-2xl font-bold text-amber-700">{counts.pending}</p>
                </div>
              </div>

              {!isAuthenticated ? (
                <>
                  <form onSubmit={handleRequestCode} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Correo electrónico</label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          type="email"
                          value={requestEmail}
                          onChange={(e) => setRequestEmail(e.target.value)}
                          placeholder="tu@email.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button className="w-full" type="submit" disabled={loadingCode}>
                      {loadingCode ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                      {language === 'es' ? 'Enviar código' : 'Send code'}
                    </Button>
                  </form>

                  {codeRequestedFor && (
                    <form onSubmit={handleVerifyCode} className="space-y-4 rounded-3xl border border-indigo-100 bg-indigo-50/60 p-4">
                      <div>
                        <p className="text-sm font-semibold text-indigo-900">
                          {language === 'es' ? 'Ya enviamos el acceso' : 'Access sent'}
                        </p>
                        <p className="text-sm text-indigo-700">
                          {language === 'es'
                            ? 'Ingresa el código de 8 caracteres que llegó a tu correo.'
                            : 'Enter the 8-character code we sent to your email.'}
                        </p>
                      </div>
                      <Input
                        value={requestCode}
                        onChange={(e) => setRequestCode(e.target.value.toUpperCase())}
                        placeholder="ABCD-EFGH"
                        className="tracking-[0.35em] text-center font-mono text-lg"
                        required
                      />
                      <Button className="w-full" type="submit" variant="secondary" disabled={verifyingCode}>
                        {verifyingCode ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BadgeCheck className="mr-2 h-4 w-4" />}
                        {language === 'es' ? 'Ingresar' : 'Enter'}
                      </Button>
                    </form>
                  )}

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {language === 'es' ? '¿Cómo funciona?' : 'How it works'}
                    </p>
                    <ol className="mt-3 space-y-2 text-sm text-slate-600">
                      <li>1. Ingresa tu correo.</li>
                      <li>2. Recibe un código y un enlace seguro.</li>
                      <li>3. Revisa tus evaluaciones y descargas.</li>
                    </ol>
                  </div>

                  <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                    <ExternalLink className="h-4 w-4" />
                    {language === 'es' ? 'Volver al home' : 'Back to home'}
                  </Link>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-semibold text-emerald-900">
                      {language === 'es' ? 'Acceso verificado' : 'Access verified'}
                    </p>
                    <p className="text-sm text-emerald-700">
                      {language === 'es'
                        ? `Estás viendo los resultados asociados a ${accessEmail}.`
                        : `You are viewing the results associated with ${accessEmail}.`}
                    </p>
                  </div>
                  <Button variant="outline" className="w-full justify-center" onClick={handleLogout} disabled={logoutLoading}>
                    {logoutLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                    {language === 'es' ? 'Cerrar acceso' : 'Log out'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                  <FolderKanban className="h-5 w-5 text-indigo-600" />
                  {language === 'es' ? 'Mis evaluaciones' : 'My assessments'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all' as const, label: language === 'es' ? 'Todas' : 'All', count: counts.total },
                    { key: 'completed' as const, label: language === 'es' ? 'Completadas' : 'Completed', count: counts.completed },
                    { key: 'pending' as const, label: language === 'es' ? 'Pendientes' : 'Pending', count: counts.pending },
                    { key: 'expired' as const, label: language === 'es' ? 'Expiradas' : 'Expired', count: counts.expired },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        activeFilter === filter.key
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {filter.label} <span className="ml-1 text-xs opacity-70">{filter.count}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {loadingResults || verifyingCode || loadingSession ? (
              <Card className="border-slate-200 bg-white shadow-lg">
                <CardContent className="flex items-center justify-center p-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                </CardContent>
              </Card>
            ) : filteredEvaluations.length === 0 ? (
              <Card className="border-dashed border-slate-300 bg-white shadow-lg">
                <CardContent className="p-10 text-center">
                  <Sparkles className="mx-auto h-10 w-10 text-slate-300" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {isAuthenticated
                      ? language === 'es'
                        ? 'No encontramos evaluaciones para este correo'
                        : 'No assessments found for this email'
                      : language === 'es'
                        ? 'Ingresa tu correo para ver tus resultados'
                        : 'Enter your email to see your results'}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {language === 'es'
                      ? 'Una vez verificado, verás el historial de tus pruebas y podrás abrir o descargar los resultados.'
                      : 'Once verified, you will see your assessment history and can open or download reports.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredEvaluations.map((record) => {
                  const Icon = typeIcons[record.type];
                  const accent = accentClasses[record.summary.accent];
                  const expanded = expandedToken === record.token;
                  const result = record.result as any;

                  return (
                    <Card key={record.token} className="border-slate-200 bg-white shadow-lg">
                      <CardHeader className={`border-b ${accent.border} ${accent.bg}`}>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`rounded-2xl border ${accent.border} bg-white p-3 ${accent.icon}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="mb-2 flex flex-wrap gap-2">
                                <Badge className="border-slate-200 bg-white text-slate-700">{record.typeLabel}</Badge>
                                <Badge className={statusBadgeClasses(record.status)}>
                                  <StatusIcon status={record.status} />
                                  <span className="ml-1">{getPortalStatusLabel(record.status)}</span>
                                </Badge>
                              </div>
                              <CardTitle className="text-xl text-slate-900">{record.title}</CardTitle>
                              <p className="mt-1 text-sm text-slate-500">
                                {record.recipientName}
                                {record.contextLabel ? ` · ${record.contextLabel}` : ''}
                                {record.senderName ? ` · ${record.senderName}` : ''}
                                · {new Date(record.createdAt).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {record.status === 'COMPLETED' && (
                              <Button variant="outline" size="sm" onClick={() => handleDownloadPdf(record)}>
                                <Download className="mr-2 h-4 w-4" />
                                {language === 'es' ? 'Descargar PDF' : 'Download PDF'}
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => setExpandedToken(expanded ? null : record.token)}>
                              {expanded ? (
                                <>
                                  <ChevronUp className="mr-2 h-4 w-4" />
                                  {language === 'es' ? 'Ocultar' : 'Hide'}
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="mr-2 h-4 w-4" />
                                  {language === 'es' ? 'Ver detalle' : 'View detail'}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-5 p-5">
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                          {record.summary.metrics.slice(0, 4).map((metric) => (
                            <div key={`${record.token}-${metric.label}`} className="rounded-2xl bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
                              <p className="mt-1 text-lg font-bold text-slate-900">{metric.value}</p>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-sm font-semibold text-slate-900">{record.summary.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{record.summary.description}</p>
                        </div>

                        {expanded && record.status === 'COMPLETED' && (
                          <>
                            <Separator />
                            <div className="space-y-4">
                              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                {language === 'es' ? 'Detalle del resultado' : 'Result details'}
                              </h4>
                              {record.type === 'technical' ? (
                                renderTechnicalDetails(result)
                              ) : (
                                renderGenericDetails(record)
                              )}

                              {Array.isArray((result as any)?.primaryStrengths) && (result as any).primaryStrengths.length > 0 && (
                                <div className="rounded-2xl bg-emerald-50 p-4">
                                  <p className="text-sm font-semibold text-emerald-900">
                                    {language === 'es' ? 'Fortalezas principales' : 'Primary strengths'}
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {(result as any).primaryStrengths.slice(0, 6).map((item: string) => (
                                      <Badge key={item} className="bg-white text-emerald-700 border border-emerald-200">
                                        {item}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {Array.isArray((result as any)?.developmentAreas) && (result as any).developmentAreas.length > 0 && (
                                <div className="rounded-2xl bg-amber-50 p-4">
                                  <p className="text-sm font-semibold text-amber-900">
                                    {language === 'es' ? 'Áreas de desarrollo' : 'Development areas'}
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {(result as any).developmentAreas.slice(0, 6).map((item: string) => (
                                      <Badge key={item} className="bg-white text-amber-700 border border-amber-200">
                                        {item}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
