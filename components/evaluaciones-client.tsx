'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PublicHeader from '@/components/public-header';
import { useLanguage } from '@/contexts/language-context';
import {
  Target,
  Flame,
  Heart,
  Dna,
  Compass,
  Shield,
  Activity,
  Clock,
  FileText,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  BarChart3,
  Zap,
  Award,
  BookOpen,
  LucideIcon
} from 'lucide-react';

interface EvaluationItem {
  slug: string;
  key: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  bgGradient: string;
  duration: string;
  questions: number;
  dimensions: string[];
}

const evaluations: EvaluationItem[] = [
  {
    slug: 'disc',
    key: 'disc',
    icon: Target,
    color: 'indigo',
    gradient: 'from-indigo-500 to-blue-600',
    bgGradient: 'from-indigo-50 to-blue-50',
    duration: '10-15 min',
    questions: 24,
    dimensions: ['Dominancia', 'Influencia', 'Estabilidad', 'Cumplimiento']
  },
  {
    slug: 'fuerzas-motivadoras',
    key: 'df',
    icon: Flame,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50',
    duration: '15-20 min',
    questions: 36,
    dimensions: ['Intelectual/Instintivo', 'Práctico/Altruista', 'Armonioso/Objetivo', 'Dominante/Colaborativo']
  },
  {
    slug: 'inteligencia-emocional',
    key: 'eq',
    icon: Heart,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    bgGradient: 'from-rose-50 to-pink-50',
    duration: '12-18 min',
    questions: 25,
    dimensions: ['Autoconciencia', 'Autorregulación', 'Motivación', 'Empatía', 'Habilidades Sociales']
  },
  {
    slug: 'dna-25',
    key: 'dna',
    icon: Dna,
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-600',
    bgGradient: 'from-teal-50 to-cyan-50',
    duration: '20-25 min',
    questions: 25,
    dimensions: ['Pensamiento', 'Comunicación', 'Liderazgo', 'Resultados', 'Relaciones']
  },
  {
    slug: 'acumen',
    key: 'aci',
    icon: Compass,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50',
    duration: '15-20 min',
    questions: 30,
    dimensions: ['Comprensión de Otros', 'Pensamiento Práctico', 'Juicio de Sistemas', 'Sentido de Sí Mismo', 'Conciencia del Rol', 'Auto-dirección']
  },
  {
    slug: 'valores-integridad',
    key: 'values',
    icon: Shield,
    color: 'violet',
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-50 to-purple-50',
    duration: '12-15 min',
    questions: 30,
    dimensions: ['Teórico', 'Utilitario', 'Estético', 'Social', 'Individualista', 'Tradicional']
  },
  {
    slug: 'estres-resiliencia',
    key: 'stress',
    icon: Activity,
    color: 'orange',
    gradient: 'from-orange-500 to-rose-600',
    bgGradient: 'from-orange-50 to-rose-50',
    duration: '12-15 min',
    questions: 30,
    dimensions: ['Estrés Laboral', 'Capacidad de Recuperación', 'Manejo Emocional', 'Equilibrio Vida-Trabajo', 'Resiliencia']
  }
];

export default function EvaluacionesClient() {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <PublicHeader />
        <div className="pt-32 pb-16" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <PublicHeader />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              {t('evaluaciones.badge')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t('evaluaciones.title1')}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t('evaluaciones.title2')}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('evaluaciones.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  {t('evaluaciones.startEvaluations')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Evaluations Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {evaluations.map((evaluation) => (
              <Link key={evaluation.slug} href={`/evaluaciones/${evaluation.slug}`}>
                <Card className={`h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${evaluation.bgGradient} group cursor-pointer`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${evaluation.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <evaluation.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {evaluation.duration}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          {evaluation.questions}
                        </Badge>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {t(`evaluaciones.${evaluation.key}.name`)}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {t(`evaluaciones.${evaluation.key}.shortDesc`)}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className={`w-4 h-4 text-${evaluation.color}-500`} />
                        {t(`evaluaciones.${evaluation.key}.benefit1`)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className={`w-4 h-4 text-${evaluation.color}-500`} />
                        {t(`evaluaciones.${evaluation.key}.benefit2`)}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                      {t('evaluaciones.learnMore')}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MotivaIQ Complete */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {t('evaluaciones.completeProfile')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {t('evaluaciones.sevenEquals360')}
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              {t('evaluaciones.completeDescription')}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {evaluations.map((e) => (
                <Badge key={e.slug} className="bg-white/20 text-white border-0 px-3 py-1">
                  <e.icon className="w-4 h-4 mr-1" />
                  {t(`evaluaciones.${e.key}.name`)}
                </Badge>
              ))}
            </div>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-indigo-50">
                {t('evaluaciones.createFreeAccount')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('evaluaciones.useCases.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('evaluaciones.useCases.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-0 shadow-lg">
              <Users className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">{t('evaluaciones.useCases.hiring')}</h3>
              <p className="text-sm text-gray-600">{t('evaluaciones.useCases.hiringDesc')}</p>
            </Card>
            <Card className="p-6 border-0 shadow-lg">
              <BarChart3 className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">{t('evaluaciones.useCases.teams')}</h3>
              <p className="text-sm text-gray-600">{t('evaluaciones.useCases.teamsDesc')}</p>
            </Card>
            <Card className="p-6 border-0 shadow-lg">
              <Award className="w-10 h-10 text-amber-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">{t('evaluaciones.useCases.succession')}</h3>
              <p className="text-sm text-gray-600">{t('evaluaciones.useCases.successionDesc')}</p>
            </Card>
            <Card className="p-6 border-0 shadow-lg">
              <Zap className="w-10 h-10 text-rose-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">{t('evaluaciones.useCases.coaching')}</h3>
              <p className="text-sm text-gray-600">{t('evaluaciones.useCases.coachingDesc')}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {t('evaluaciones.cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('evaluaciones.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8">
                {t('evaluaciones.createFreeAccount')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="px-8">
                {t('evaluaciones.cta.login')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">MotivaIQ</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">{t('evaluaciones.footer.home')}</Link>
              <Link href="/evaluaciones" className="hover:text-white transition-colors">{t('evaluaciones.footer.evaluations')}</Link>
              <Link href="/terms" className="hover:text-white transition-colors">{t('evaluaciones.footer.terms')}</Link>
            </div>
            <p className="text-sm text-gray-500">© 2026 MotivaIQ. {t('evaluaciones.footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
