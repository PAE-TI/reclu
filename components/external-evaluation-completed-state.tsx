'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Award, CheckCircle2, Sparkles, Shield, Users } from 'lucide-react';

type Language = 'es' | 'en';

interface ExternalEvaluationCompletedStateProps {
  language?: Language;
  evaluationType?: string;
  evaluationTitle?: string;
  recipientName?: string;
  senderName?: string;
  completedAt?: string | null;
}

const copy = {
  es: {
    badge: 'Evaluación completada',
    title: '¡Evaluación Completada!',
    subtitle: 'Ya completaste esta evaluación. Si necesitas acceder nuevamente, contacta a la persona que te envió el enlace.',
    infoTitle: 'Información de la evaluación',
    type: 'Tipo',
    recipient: 'Evaluado',
    sender: 'Enviado por',
    completedAt: 'Completada el',
    noteTitle: 'Importante',
    note: 'Este enlace ya no acepta respuestas nuevas. Tus resultados han sido registrados correctamente.',
    home: 'Ir al inicio',
    signup: 'Crear cuenta gratis',
    footerTitle: '¿Te interesa evaluar a tu equipo?',
    footerText: 'Descubre el potencial de tu organización con nuestras evaluaciones de talento.',
    confidential: 'Datos 100% confidenciales',
    certified: 'Metodología certificada',
    evaluations: '+10,000 evaluaciones',
    platformDesc: 'Plataforma de evaluación de talento empresarial.',
  },
  en: {
    badge: 'Evaluation completed',
    title: 'Evaluation Completed',
    subtitle: 'You have already completed this evaluation. If you need access again, contact the person who sent the link.',
    infoTitle: 'Evaluation info',
    type: 'Type',
    recipient: 'Assessed',
    sender: 'Sent by',
    completedAt: 'Completed on',
    noteTitle: 'Important',
    note: 'This link no longer accepts new responses. Your results have been recorded successfully.',
    home: 'Go home',
    signup: 'Create free account',
    footerTitle: 'Interested in evaluating your team?',
    footerText: 'Discover your organization’s potential with our talent assessments.',
    confidential: '100% confidential data',
    certified: 'Certified methodology',
    evaluations: '+10,000 evaluations',
    platformDesc: 'Enterprise talent assessment platform.',
  },
} as const;

export default function ExternalEvaluationCompletedState({
  language = 'es',
  evaluationType,
  evaluationTitle,
  recipientName,
  senderName,
  completedAt,
}: ExternalEvaluationCompletedStateProps) {
  const t = copy[language];
  const formattedDate = completedAt
    ? new Date(completedAt).toLocaleString(language === 'es' ? 'es-ES' : 'en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Reclu
                </h1>
                <p className="text-xs text-gray-500">
                  {language === 'es' ? 'Plataforma de Talento' : 'Talent Platform'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600">{t.badge}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white/85 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{t.title}</h1>
            <p className="text-gray-600 mb-6">{t.subtitle}</p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 text-left">
              <h3 className="font-semibold text-emerald-800 mb-4">{t.infoTitle}</h3>
              <div className="space-y-2 text-sm text-emerald-700">
                {evaluationType && (
                  <div>
                    <strong>{t.type}:</strong> {evaluationType}
                  </div>
                )}
                {evaluationTitle && (
                  <div>
                    <strong>Título:</strong> {evaluationTitle}
                  </div>
                )}
                {recipientName && (
                  <div>
                    <strong>{t.recipient}:</strong> {recipientName}
                  </div>
                )}
                {senderName && (
                  <div>
                    <strong>{t.sender}:</strong> {senderName}
                  </div>
                )}
                {formattedDate && (
                  <div>
                    <strong>{t.completedAt}:</strong> {formattedDate}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">{t.noteTitle}</h3>
              <p className="text-sm text-gray-600">{t.note}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href="/">
                  {t.home}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <Link href="/auth/signup">{t.signup}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="mt-auto">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">{t.footerTitle}</h3>
            <p className="text-indigo-100 mb-4 text-sm">{t.footerText}</p>
          </div>
        </div>
        <div className="bg-gray-900 py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm">{t.confidential}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">{t.certified}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm">{t.evaluations}</span>
              </div>
            </div>
            <div className="text-center text-gray-500 text-sm">
              © 2025 Reclu. {t.platformDesc}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
