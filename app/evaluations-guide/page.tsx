'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
  Users,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Sparkles,
  Briefcase,
  MessageSquare,
  Zap,
  BarChart3,
  FileCode
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

// Static color classes for Tailwind JIT compatibility
const colorClasses: Record<string, { bg: string; text: string; hover: string; activeBg: string }> = {
  indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', hover: 'hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300', activeBg: 'bg-indigo-600 hover:bg-indigo-700' },
  purple: { bg: 'bg-purple-600', text: 'text-purple-600', hover: 'hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300', activeBg: 'bg-purple-600 hover:bg-purple-700' },
  pink: { bg: 'bg-pink-600', text: 'text-pink-600', hover: 'hover:bg-pink-50 hover:text-pink-700 hover:border-pink-300', activeBg: 'bg-rose-600 hover:bg-rose-700' },
  teal: { bg: 'bg-teal-600', text: 'text-teal-600', hover: 'hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300', activeBg: 'bg-teal-600 hover:bg-teal-700' },
  amber: { bg: 'bg-amber-600', text: 'text-amber-600', hover: 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300', activeBg: 'bg-amber-600 hover:bg-amber-700' },
  violet: { bg: 'bg-violet-600', text: 'text-violet-600', hover: 'hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300', activeBg: 'bg-violet-600 hover:bg-violet-700' },
  orange: { bg: 'bg-orange-600', text: 'text-orange-600', hover: 'hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300', activeBg: 'bg-orange-600 hover:bg-orange-700' },
  sky: { bg: 'bg-sky-600', text: 'text-sky-600', hover: 'hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300', activeBg: 'bg-sky-600 hover:bg-sky-700' },
};

const evaluationConfigs = [
  {
    id: 'disc',
    icon: Target,
    color: 'indigo',
    gradient: 'from-indigo-500 to-blue-600',
    bgGradient: 'from-indigo-50 to-blue-50',
    duration: '10-15',
    questions: 24,
    href: '/external-evaluations',
    dimensionColors: ['bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500']
  },
  {
    id: 'df',
    icon: Flame,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50',
    duration: '15-20',
    questions: 36,
    href: '/external-driving-forces-evaluations',
    dimensionColors: ['bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-amber-500', 'bg-red-500', 'bg-indigo-500']
  },
  {
    id: 'eq',
    icon: Heart,
    color: 'pink',
    gradient: 'from-rose-500 to-pink-600',
    bgGradient: 'from-rose-50 to-pink-50',
    duration: '12-18',
    questions: 25,
    href: '/external-eq-evaluations',
    dimensionColors: ['bg-rose-500', 'bg-purple-500', 'bg-amber-500', 'bg-teal-500', 'bg-blue-500']
  },
  {
    id: 'dna',
    icon: Dna,
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-600',
    bgGradient: 'from-teal-50 to-cyan-50',
    duration: '20-25',
    questions: 25,
    href: '/external-dna-evaluations',
    dimensionColors: ['bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-green-500', 'bg-rose-500']
  },
  {
    id: 'acumen',
    icon: Compass,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50',
    duration: '15-20',
    questions: 30,
    href: '/external-acumen-evaluations',
    dimensionColors: ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500']
  },
  {
    id: 'values',
    icon: Shield,
    color: 'violet',
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-50 to-purple-50',
    duration: '12-15',
    questions: 30,
    href: '/external-values-evaluations',
    dimensionColors: ['bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-red-500', 'bg-amber-500', 'bg-indigo-500']
  },
  {
    id: 'stress',
    icon: Activity,
    color: 'orange',
    gradient: 'from-orange-500 to-rose-600',
    bgGradient: 'from-orange-50 to-rose-50',
    duration: '12-15',
    questions: 30,
    href: '/external-stress-evaluations',
    dimensionColors: ['bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-blue-500', 'bg-teal-500']
  },
  {
    id: 'technical',
    icon: FileCode,
    color: 'sky',
    gradient: 'from-sky-500 to-cyan-600',
    bgGradient: 'from-sky-50 to-cyan-50',
    duration: '25-35',
    questions: 20,
    href: '/external-technical-evaluations',
    dimensionColors: ['bg-green-500', 'bg-yellow-500', 'bg-red-500'],
    isNew: true
  }
];

export default function EvaluationsGuidePage() {
  const { t, language } = useLanguage();
  const [activeEvaluationId, setActiveEvaluationId] = useState('disc');

  const evaluations = useMemo(() => {
    return evaluationConfigs.map(config => {
      const prefix = `guide.${config.id}`;
      
      // Build dimensions array based on the evaluation type
      const dimensionCount = config.dimensionColors.length;
      const dimensions = [];
      for (let i = 1; i <= dimensionCount; i++) {
        const dimKey = `${prefix}.dim${i}`;
        const dimName = t(`${dimKey}.name`);
        // Only add if translation exists (not returning the key itself)
        if (dimName !== `${dimKey}.name`) {
          dimensions.push({
            name: dimName,
            color: config.dimensionColors[i - 1],
            description: t(`${dimKey}.description`)
          });
        }
      }
      
      // If no specific dimensions found, use generic ones based on id
      if (dimensions.length === 0) {
        // For evaluations without numbered dimensions
        dimensions.push(
          { name: config.id.toUpperCase(), color: config.dimensionColors[0], description: '' }
        );
      }

      // Build use cases
      const useCases = [];
      for (let i = 1; i <= 4; i++) {
        const ucKey = `${prefix}.useCase${i}`;
        const ucTitle = t(`${ucKey}.title`);
        if (ucTitle !== `${ucKey}.title`) {
          useCases.push({
            title: ucTitle,
            description: t(`${ucKey}.description`)
          });
        }
      }

      // Build tips
      const tips = [];
      for (let i = 1; i <= 4; i++) {
        const tipKey = `${prefix}.tip${i}`;
        const tip = t(tipKey);
        if (tip !== tipKey) {
          tips.push(tip);
        }
      }

      // Build examples
      const examples = [];
      for (let i = 1; i <= 2; i++) {
        const exKey = `${prefix}.example${i}`;
        const scenario = t(`${exKey}.scenario`);
        if (scenario !== `${exKey}.scenario`) {
          examples.push({
            scenario,
            insight: t(`${exKey}.insight`)
          });
        }
      }

      return {
        ...config,
        name: t(`${prefix}.name`),
        fullName: t(`${prefix}.fullName`),
        description: t(`${prefix}.description`),
        longDescription: t(`${prefix}.longDescription`),
        dimensions,
        useCases,
        tips,
        examples
      };
    });
  }, [t, language]);

  const activeEvaluation = evaluations.find(e => e.id === activeEvaluationId) || evaluations[0];
  const IconComponent = activeEvaluation.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 shadow-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{t('guide.title')}</h1>
              <p className="text-slate-600">{t('guide.subtitle')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {evaluations.map((evalItem) => {
              const EvalIcon = evalItem.icon;
              const colors = colorClasses[evalItem.color] || colorClasses.indigo;
              const isActive = activeEvaluationId === evalItem.id;
              return (
                <Button
                  key={evalItem.id}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveEvaluationId(evalItem.id)}
                  className={isActive ? `${colors.activeBg} text-white` : `${colors.text} ${colors.hover}`}
                >
                  <EvalIcon className="w-4 h-4 mr-1" />
                  {evalItem.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <Card className={`bg-gradient-to-br ${activeEvaluation.bgGradient} border-0 shadow-xl overflow-hidden`}>
              <div className={`bg-gradient-to-r ${activeEvaluation.gradient} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{activeEvaluation.fullName}</h2>
                    <div className="flex items-center gap-4 mt-2 text-white/80">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {activeEvaluation.duration} {language === 'es' ? 'minutos' : 'minutes'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {activeEvaluation.questions} {t('guide.questions')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-lg text-gray-700 mb-4">{activeEvaluation.description}</p>
                <p className="text-gray-600 whitespace-pre-line">{activeEvaluation.longDescription}</p>
                <div className="mt-6">
                  <Link href={activeEvaluation.href}>
                    <Button className={`bg-gradient-to-r ${activeEvaluation.gradient}`}>
                      {t('guide.sendEvaluationBtn')} {activeEvaluation.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Dimensions */}
            {activeEvaluation.dimensions.length > 0 && activeEvaluation.dimensions[0].description && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-slate-700" />
                    {t('guide.dimensionsMeasured')}
                  </CardTitle>
                  <CardDescription>
                    {t('guide.dimensionsDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeEvaluation.dimensions.map((dim, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${dim.color}`}></div>
                          <h4 className="font-semibold text-slate-900">{dim.name}</h4>
                        </div>
                        <p className="text-sm text-slate-600">{dim.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Use Cases */}
            {activeEvaluation.useCases.length > 0 && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-slate-700" />
                    {t('guide.useCases')}
                  </CardTitle>
                  <CardDescription>
                    {t('guide.useCasesDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeEvaluation.useCases.map((useCase, idx) => (
                      <div key={idx} className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activeEvaluation.gradient} flex items-center justify-center flex-shrink-0`}>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{useCase.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{useCase.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Real Examples */}
            {activeEvaluation.examples.length > 0 && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-700" />
                    {t('guide.examples')}
                  </CardTitle>
                  <CardDescription>
                    {t('guide.examplesDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeEvaluation.examples.map((example, idx) => (
                      <div key={idx} className={`p-4 rounded-xl bg-gradient-to-r ${activeEvaluation.bgGradient}`}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-4 h-4 text-slate-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-1">{example.scenario}</h4>
                            <p className="text-sm text-slate-700">{example.insight}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Tips & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className={`bg-gradient-to-r ${activeEvaluation.gradient} text-white rounded-t-xl`}>
                <CardTitle className="text-lg">{t('guide.quickInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">{t('guide.duration')}</span>
                    <span className="font-semibold text-slate-900">{activeEvaluation.duration} min</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">{language === 'es' ? 'Preguntas' : 'Questions'}</span>
                    <span className="font-semibold text-slate-900">{activeEvaluation.questions}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">{t('guide.dimensions')}</span>
                    <span className="font-semibold text-slate-900">{activeEvaluation.dimensions.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            {activeEvaluation.tips.length > 0 && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    {t('guide.tips')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeEvaluation.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                        <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Card className={`bg-gradient-to-br ${activeEvaluation.bgGradient} border-0 shadow-lg`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <IconComponent className={`w-12 h-12 mx-auto mb-3 ${colorClasses[activeEvaluation.color]?.text || 'text-slate-600'}`} />
                  <h3 className="font-bold text-slate-900 mb-2">{t('guide.readyToEvaluate')}</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {t('guide.sendEvaluation').replace('{name}', activeEvaluation.name)}
                  </p>
                  <Link href={activeEvaluation.href}>
                    <Button className={`w-full bg-gradient-to-r ${activeEvaluation.gradient}`}>
                      {t('guide.send')} {activeEvaluation.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* MotivaIQ Complete */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0 shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Sparkles className="w-10 h-10 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">{t('guide.completeProfile')}</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    {t('guide.completeProfileDescription')}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1 mb-4">
                    {evaluations.map((e) => (
                      <Badge key={e.id} className="bg-white/20 text-white text-xs">
                        {e.name}
                      </Badge>
                    ))}
                  </div>
                  <Link href="/analytics">
                    <Button variant="secondary" className="w-full bg-white text-slate-900 hover:bg-slate-100">
                      {t('guide.viewAdvancedAnalysis')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Evaluations Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('guide.allEvaluations')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {evaluations.map((evalItem) => {
              const EvalIcon = evalItem.icon;
              return (
                <Card 
                  key={evalItem.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg bg-white ${
                    activeEvaluationId === evalItem.id ? 'ring-2 ring-slate-400' : ''
                  }`}
                  onClick={() => setActiveEvaluationId(evalItem.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${evalItem.gradient} flex items-center justify-center`}>
                        <EvalIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{evalItem.name}</h3>
                        <p className="text-xs text-slate-500">{evalItem.questions} {t('guide.questions')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{evalItem.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500">{evalItem.duration} min</span>
                      <Link href={evalItem.href} onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="ghost" className={`${colorClasses[evalItem.color]?.text || 'text-slate-600'} ${colorClasses[evalItem.color]?.hover || ''}`}>
                          {t('guide.send')}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
