'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { Plus, Mail, Send, Users, Scale, CheckCircle, Clock, AlertTriangle, Calendar, Eye, Copy, Trash2, RefreshCw } from 'lucide-react';
import { ExternalResultsExportButton } from '@/components/external-results-export-button';
import { EvaluationNotesButton } from '@/components/evaluation-notes';
import { useLanguage } from '@/contexts/language-context';

interface ExternalValuesEvaluation {
  id: string; title: string; description?: string; recipientName: string; recipientEmail: string;
  token: string; tokenExpiry: string; status: string; createdAt: string; completedAt?: string;
  result?: any; senderName?: string; isOwnEvaluation?: boolean;
}

export default function ExternalValuesEvaluations() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, language } = useLanguage();
  const [evaluations, setEvaluations] = useState<ExternalValuesEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('send');
  const [formData, setFormData] = useState({ recipientName: '', recipientEmail: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<ExternalValuesEvaluation | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [resending, setResending] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/signin'); return; }
    if (status === 'authenticated') { fetchEvaluations(); }
  }, [status, router]);

  const fetchEvaluations = async () => {
    try {
      const response = await fetch('/api/external-values-evaluations');
      if (!response.ok) throw new Error(t('extEval.error.loadFailed'));
      const data = await response.json();
      setEvaluations(data || []);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError(''); setSuccess('');
    try {
      const response = await fetch('/api/external-values-evaluations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientName: formData.recipientName, recipientEmail: formData.recipientEmail }),
      });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || t('extEval.error.createFailed')); }
      setSuccess(`${t('extEval.success.sent')} ${formData.recipientEmail}`);
      setFormData({ recipientName: '', recipientEmail: '' });
      fetchEvaluations(); window.dispatchEvent(new Event('credits-updated'));
    } catch (err: any) { setError(err.message); } finally { setSubmitting(false); }
  };

  const copyInvitationLink = async (token: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/external-values-evaluation/${token}`);
    setSuccess(t('extEval.success.copied')); setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteClick = (evaluation: ExternalValuesEvaluation) => { setEvaluationToDelete(evaluation); setDeleteDialogOpen(true); };

  const handleDeleteConfirm = async () => {
    if (!evaluationToDelete) return; setDeleting(true); setError('');
    try {
      const response = await fetch(`/api/external-values-evaluations/${evaluationToDelete.token}/delete`, { method: 'DELETE' });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || t('extEval.error.deleteFailed')); }
      setSuccess(t('extEval.success.deleted').replace('{name}', evaluationToDelete.recipientName)); fetchEvaluations();
    } catch (err: any) { setError(err.message); } finally { setDeleting(false); setDeleteDialogOpen(false); setEvaluationToDelete(null); }
  };

  const handleResendEmail = async (token: string, recipientName: string) => {
    setResending(token); setError(''); setSuccess('');
    try {
      const response = await fetch('/api/external-evaluations/resend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, type: 'VALUES' }) });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || t('extEval.error.resendFailed')); }
      setSuccess(`${t('extEval.success.resent')} ${recipientName}`);
    } catch (err: any) { setError(err.message); } finally { setResending(null); }
  };

  const getStatusBadge = (evaluation: ExternalValuesEvaluation) => {
    const isExpired = new Date() > new Date(evaluation.tokenExpiry);
    if (isExpired && evaluation.status !== 'COMPLETED') return <Badge className="bg-red-500 text-white">{t('extEval.status.expired')}</Badge>;
    switch (evaluation.status) {
      case 'COMPLETED': return <Badge className="bg-green-500 text-white">{t('extEval.status.completed')}</Badge>;
      case 'PENDING': return <Badge className="bg-yellow-500 text-white">{t('extEval.status.pending')}</Badge>;
      default: return <Badge variant="secondary">{evaluation.status}</Badge>;
    }
  };

  if (status === 'loading' || loading) {
    return (<div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
      <div className="text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div><p className="text-gray-600">{t('extEval.loading')}</p></div>
    </div>);
  }
  if (!session) return null;

  const completedCount = evaluations.filter(e => e.status === 'COMPLETED').length;
  const pendingCount = evaluations.filter(e => e.status === 'PENDING' && new Date() <= new Date(e.tokenExpiry)).length;
  const expiredCount = evaluations.filter(e => e.status !== 'COMPLETED' && new Date() > new Date(e.tokenExpiry)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900 mb-2">{t('extEval.values.title')}</h1><p className="text-lg text-gray-600">{t('extEval.values.subtitle')}</p></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">{t('extEval.stats.totalSent')}</p><p className="text-2xl font-bold text-gray-900">{evaluations.length}</p></div><Scale className="w-8 h-8 text-violet-600" /></div></CardContent></Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">{t('extEval.stats.completed')}</p><p className="text-2xl font-bold text-green-600">{completedCount}</p></div><CheckCircle className="w-8 h-8 text-green-600" /></div></CardContent></Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">{t('extEval.stats.pending')}</p><p className="text-2xl font-bold text-yellow-600">{pendingCount}</p></div><Clock className="w-8 h-8 text-yellow-600" /></div></CardContent></Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">{t('extEval.stats.expired')}</p><p className="text-2xl font-bold text-red-600">{expiredCount}</p></div><AlertTriangle className="w-8 h-8 text-red-600" /></div></CardContent></Card>
        </div>

        {error && (<Alert className="mb-6 border-red-200 bg-red-50"><AlertTriangle className="w-4 h-4 text-red-600" /><AlertDescription className="text-red-700">{error}</AlertDescription></Alert>)}
        {success && (<Alert className="mb-6 border-green-200 bg-green-50"><CheckCircle className="w-4 h-4 text-green-600" /><AlertDescription className="text-green-700">{success}</AlertDescription></Alert>)}

        <div className="space-y-6">
          <div className="grid w-full grid-cols-2 lg:w-[400px] bg-gray-100 p-1 rounded-md">
            <Button variant={activeTab === 'send' ? 'default' : 'ghost'} onClick={() => setActiveTab('send')} className={`flex items-center gap-2 ${activeTab === 'send' ? 'bg-violet-600 hover:bg-violet-700' : ''}`}><Send className="w-4 h-4" />{t('extEval.tabs.send')}</Button>
            <Button variant={activeTab === 'manage' ? 'default' : 'ghost'} onClick={() => setActiveTab('manage')} className={`flex items-center gap-2 ${activeTab === 'manage' ? 'bg-violet-600 hover:bg-violet-700' : ''}`}><Users className="w-4 h-4" />{t('extEval.tabs.manage')} ({evaluations.length})</Button>
          </div>

          {activeTab === 'send' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5 text-violet-600" />{t('extEval.values.formTitle')}</CardTitle><CardDescription>{t('extEval.form.description')}</CardDescription></CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label htmlFor="recipientName">{t('extEval.form.fullNameRequired')}</Label><Input id="recipientName" value={formData.recipientName} onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })} placeholder={t('extEval.form.namePlaceholder')} required /></div>
                        <div className="space-y-2"><Label htmlFor="recipientEmail">{t('extEval.form.emailRequired')}</Label><Input id="recipientEmail" type="email" value={formData.recipientEmail} onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })} placeholder={t('extEval.form.emailPlaceholder')} required /></div>
                      </div>
                      <Button type="submit" disabled={submitting} className="w-full bg-violet-600 hover:bg-violet-700">{submitting ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>{t('extEval.form.sending')}</>) : (<><Send className="w-4 h-4 mr-2" />{t('extEval.form.send')}</>)}</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="bg-violet-50 border-violet-200 border shadow-lg"><CardHeader><CardTitle className="flex items-center gap-2 text-violet-800 text-lg">✅ {t('extEval.howItWorks.title')}</CardTitle></CardHeader><CardContent className="space-y-3">{[1,2,3,4].map(i => (<div key={i} className="flex items-start gap-3"><div className="w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{i}</div><p className="text-violet-700 text-sm">{t(`extEval.howItWorks.step${i}`)}</p></div>))}</CardContent></Card>
                <Card className="bg-amber-50 border-amber-200 border shadow-lg"><CardHeader><CardTitle className="flex items-center gap-2 text-amber-800 text-lg">⚠️ {t('extEval.important.title')}</CardTitle></CardHeader><CardContent><ul className="text-amber-700 text-sm space-y-2"><li>• {t('extEval.important.expiry')}</li><li>• {t('extEval.important.singleUse')}</li><li>• {t('extEval.important.noAccount')}</li><li>• {t('extEval.important.canDelete')}</li></ul></CardContent></Card>
              </div>
            </div>
          )}

          {activeTab === 'manage' && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader><CardTitle className="flex items-center gap-2"><Scale className="w-5 h-5 text-violet-600" />{t('extEval.values.manageTitle')}</CardTitle><CardDescription>{t('extEval.values.manageDesc')}</CardDescription></CardHeader>
              <CardContent>
                {evaluations.length === 0 ? (
                  <div className="text-center py-12"><Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900 mb-2">{t('extEval.manage.empty')}</h3><p className="text-gray-600 mb-6">{t('extEval.manage.emptyDesc')}</p><Button onClick={() => setActiveTab('send')} className="bg-violet-600 hover:bg-violet-700"><Plus className="w-4 h-4 mr-2" />{t('extEval.manage.sendFirst')}</Button></div>
                ) : (
                  <div className="space-y-4">
                    {evaluations.map((evaluation) => {
                      const isExpired = new Date() > new Date(evaluation.tokenExpiry) && evaluation.status !== 'COMPLETED';
                      return (
                        <div key={evaluation.id} className="p-4 sm:p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2"><h3 className="text-base sm:text-lg font-semibold text-gray-900">{evaluation.recipientName}</h3>{getStatusBadge(evaluation)}</div>
                              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1"><Mail className="w-4 h-4" /><span className="truncate">{evaluation.recipientEmail}</span></div>
                                <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{t('extEval.manage.sentDate')}: {new Date(evaluation.createdAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}</span></div>
                                {evaluation.senderName && (<div className="flex items-center gap-1"><Users className="w-4 h-4 text-violet-500" /><span>{t('extEval.manage.sentBy')}: {evaluation.isOwnEvaluation ? t('extEval.manage.you') : evaluation.senderName}</span></div>)}
                                {evaluation.completedAt && (<div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-600" /><span>{t('extEval.manage.completedDate')}: {new Date(evaluation.completedAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}</span></div>)}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                              {!isExpired && evaluation.status !== 'COMPLETED' && (<><Button size="sm" variant="outline" onClick={() => copyInvitationLink(evaluation.token)} className="bg-white flex-1 sm:flex-none"><Copy className="w-4 h-4 mr-1" />{t('extEval.actions.copyLink')}</Button><Button size="sm" variant="outline" onClick={() => handleResendEmail(evaluation.token, evaluation.recipientName)} disabled={resending === evaluation.token} className="bg-white text-violet-600 border-violet-200 hover:bg-violet-50 flex-1 sm:flex-none">{resending === evaluation.token ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}{t('extEval.actions.resend')}</Button></>)}
                              {evaluation.status === 'COMPLETED' && evaluation.result && (<><Link href={`/external-values-evaluation-results/${evaluation.token}`} className="flex-1 sm:flex-none"><Button size="sm" className="bg-violet-600 hover:bg-violet-700 w-full"><Eye className="w-4 h-4 mr-1" />{t('extEval.actions.viewResults')}</Button></Link><ExternalResultsExportButton type="values" token={evaluation.token} recipientName={evaluation.recipientName} /></>)}
                              <EvaluationNotesButton evaluationType="VALUES" evaluationId={evaluation.token} recipientEmail={evaluation.recipientEmail} recipientName={evaluation.recipientName} />
                              <Button size="sm" variant="outline" onClick={() => handleDeleteClick(evaluation)} className="bg-white text-red-600 border-red-200 hover:bg-red-50 flex-1 sm:flex-none"><Trash2 className="w-4 h-4 sm:mr-1" /><span className="sm:inline">{t('extEval.actions.delete')}</span></Button>
                            </div>
                          </div>
                          {(isExpired || evaluation.status === 'COMPLETED') && (<div className="mt-4 pt-4 border-t border-gray-200"><p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2"><RefreshCw className="w-4 h-4" /><span>{isExpired ? (language === 'es' ? 'Enlace expirado. Elimina esta evaluación y envía una nueva para reevaluar.' : 'Link expired. Delete this evaluation and send a new one to re-evaluate.') : (language === 'es' ? '¿Necesitas reevaluar? Elimina esta evaluación y envía una nueva.' : 'Need to re-evaluate? Delete this evaluation and send a new one.')}</span></p></div>)}
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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle className="flex items-center gap-2 text-red-600"><Trash2 className="w-5 h-5" />{t('extEval.delete.title')}</AlertDialogTitle><AlertDialogDescription className="space-y-2"><p>{t('extEval.delete.description').replace('{name}', evaluationToDelete?.recipientName || '')}</p>{evaluationToDelete?.status === 'COMPLETED' && (<p className="text-amber-600 font-medium">⚠️ {language === 'es' ? 'Esta evaluación ya fue completada. Perderás los resultados.' : 'This evaluation is already completed. You will lose the results.'}</p>)}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={deleting}>{t('extEval.delete.cancel')}</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} disabled={deleting} className="bg-red-600 hover:bg-red-700">{deleting ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>{t('extEval.delete.deleting')}</>) : (<><Trash2 className="w-4 h-4 mr-2" />{t('extEval.delete.confirm')}</>)}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
