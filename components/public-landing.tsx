'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicHeader from '@/components/public-header';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language-context';
import { 
  Brain, 
  Users, 
  BarChart3, 
  ArrowRight,
  CheckCircle,
  Target,
  Zap,
  TrendingUp,
  Shield,
  Building2,
  Clock,
  LineChart,
  Heart,
  Compass,
  Sparkles,
  Dna,
  Activity,
  Star,
  Quote,
  ChevronRight,
  ChevronDown,
  Briefcase,
  UsersRound,
  UserPlus,
  ClipboardCheck,
  Percent,
  Filter,
  Flame,
  Eye,
  PieChart,
  Globe,
  FileCode,
  Search,
  Cpu,
  Award,
  Rocket,
  BadgeCheck,
  Timer,
  DollarSign,
  Layers,
  Play,
  ArrowUpRight,
  CircleCheck
} from 'lucide-react';

export default function PublicLanding() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* Hero - Talent Platform */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-cyan-500/30 backdrop-blur-sm">
                <Cpu className="w-4 h-4" />
                {language === 'es' ? 'Plataforma de talento con IA' : 'AI-powered talent platform'}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {language === 'es' ? 'Gestiona' : 'Manage'}
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent"> {language === 'es' ? 'campañas de talento' : 'talent campaigns'}</span>
                <span className="block mt-2">{language === 'es' ? 'con análisis científico y pruebas personalizables' : 'with scientific analysis and customizable tests'}</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {language === 'es' 
                  ? 'Reclu te permite crear campañas de selección, evaluar equipos internos y lanzar pruebas técnicas con plantillas, banco de preguntas, reemplazo y resultados claros. Todo en un solo lugar.'
                  : 'Reclu lets you create selection campaigns, evaluate internal teams and launch technical tests with templates, question bank, replacement tools and clear results. All in one place.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-lg px-8 py-6 rounded-xl group shadow-2xl shadow-cyan-500/25 w-full sm:w-auto">
                    {language === 'es' ? 'Crear mi cuenta' : 'Create my account'}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/mis-resultados">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl border-2 border-white/20 text-white bg-white/5 hover:bg-white/10 w-full sm:w-auto">
                    <Search className="w-5 h-5 mr-2" />
                    {language === 'es' ? 'Ver mis resultados' : 'View my results'}
                  </Button>
                </Link>
                <Link href="/#como-funciona">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl border-2 border-white/20 text-white bg-white/5 hover:bg-white/10 w-full sm:w-auto">
                    <Play className="w-5 h-5 mr-2" />
                    {language === 'es' ? 'Ver la plataforma' : 'See the platform'}
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '2', label: language === 'es' ? 'Tipos de campaña' : 'Campaign types', icon: Layers },
                  { value: '8', label: language === 'es' ? 'Módulos' : 'Modules', icon: Target },
                  { value: '225+', label: language === 'es' ? 'Cargos técnicos' : 'Tech roles', icon: FileCode },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                    <stat.icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AI Analysis Preview */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/30 rounded-lg">
                      <Search className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">{language === 'es' ? 'Campaña activa' : 'Active campaign'}</p>
                      <p className="text-white font-semibold">{language === 'es' ? 'Campaña de talento interno' : 'Internal talent campaign'}</p>
                    </div>
                    <Badge className="ml-auto bg-green-500/20 text-green-300 border-green-500/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      {language === 'es' ? 'Procesando' : 'Processing'}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{language === 'es' ? 'Personas evaluadas' : 'People evaluated'}</span>
                    <span className="text-white font-semibold">24 / 30</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full w-[80%] animate-pulse"></div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs font-medium text-gray-400 uppercase mb-3">{language === 'es' ? 'Top perfiles identificados' : 'Top profiles identified'}</p>
                    {[
                      { name: 'María López G.', score: 94, match: language === 'es' ? 'Match Excelente' : 'Excellent Match', color: 'emerald' },
                      { name: 'Carlos R. Pérez', score: 89, match: language === 'es' ? 'Match Alto' : 'High Match', color: 'cyan' },
                      { name: 'Ana Martínez D.', score: 85, match: language === 'es' ? 'Match Alto' : 'High Match', color: 'indigo' },
                    ].map((candidate, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl p-3 mb-2 border border-white/10 hover:border-cyan-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${i === 0 ? 'from-emerald-500 to-teal-500' : i === 1 ? 'from-cyan-500 to-blue-500' : 'from-indigo-500 to-purple-500'} flex items-center justify-center`}>
                            <span className="text-white text-sm font-bold">{i + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{candidate.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <CircleCheck className={`w-3 h-3 ${i === 0 ? 'text-emerald-400' : 'text-cyan-400'}`} />
                              <span className="text-[10px] text-gray-400">{candidate.match}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${i === 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>{candidate.score}%</p>
                          <p className="text-[10px] text-gray-500">{language === 'es' ? 'compatibilidad' : 'compatibility'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">{language === 'es' ? 'Evaluaciones aplicadas:' : 'Assessments applied:'}</span>
                      <div className="flex gap-1">
                        {['DISC', 'EQ', 'DNA', 'TEC', 'PLN'].map((mod, j) => (
                          <span key={j} className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-[10px]">{mod}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <div className="absolute -left-4 top-1/3 bg-white rounded-xl shadow-2xl p-3 border animate-bounce" style={{animationDuration: '3s'}}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{language === 'es' ? 'Candidato ideal' : 'Ideal candidate'}</p>
                    <p className="text-[10px] text-gray-500">{language === 'es' ? 'encontrado' : 'found'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution - Por qué Reclu */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-red-100 text-red-700 mb-4">
              {language === 'es' ? 'El Problema' : 'The Problem'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === 'es' ? 'Tomar decisiones de talento sin datos ' : 'Making talent decisions without data '}
              <span className="text-red-500">{language === 'es' ? 'cuesta caro' : 'is expensive'}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'es' 
                ? 'Las decisiones basadas solo en intuición afectan la selección, la movilidad interna y el desarrollo del equipo. Reclu unifica evaluación, comparación y seguimiento con datos claros.'
                : 'Decisions based only on intuition affect hiring, internal mobility and team development. Reclu unifies assessment, comparison and follow-up with clear data.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Sin Reclu */}
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{language === 'es' ? 'Procesos aislados' : 'Isolated processes'}</h3>
                  <p className="text-sm text-gray-500">{language === 'es' ? 'Selección, equipos e informes por separado' : 'Hiring, teams and reports handled separately'}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {(language === 'es' ? [
                  'Decisiones basadas en intuición',
                  'Revisión manual de perfiles y resultados',
                  'Falta de una vista única de talento',
                  'Información técnica y conductual dispersa',
                  'Poca trazabilidad entre campañas',
                ] : [
                  'Decisions based on intuition',
                  'Manual review of profiles and results',
                  'No single talent view',
                  'Scattered technical and behavioral data',
                  'Low traceability across campaigns',
                ]).map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-xs">✕</span>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Con Reclu */}
            <div className="bg-gradient-to-br from-cyan-50 to-indigo-50 rounded-2xl p-8 border border-cyan-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{language === 'es' ? 'Con Reclu' : 'With Reclu'}</h3>
                  <p className="text-sm text-gray-500">{language === 'es' ? 'Plataforma de talento' : 'Talent platform'}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {(language === 'es' ? [
                  'Campañas de selección e internas',
                  'Pruebas técnicas con plantillas y banco de preguntas',
                  'Comparación clara entre personas y equipos',
                  'Resultados y análisis listos para decidir',
                  'Proceso moderno, trazable y profesional',
                ] : [
                  'Hiring and internal team campaigns',
                  'Technical tests with templates and a question bank',
                  'Clear comparison across people and teams',
                  'Results and analysis ready for decisions',
                  'Modern, traceable and professional workflow',
                ]).map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de campañas */}
      <section id="tipos-campanas" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-indigo-100 text-indigo-700 mb-4">
              <Layers className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Tipos de campaña' : 'Campaign types'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === 'es' ? 'Diseñado para selección y equipos internos' : 'Built for hiring and internal teams'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {language === 'es'
                ? 'Cada campaña se adapta al objetivo real: contratar, comparar talento interno o evaluar capacidades técnicas con sets personalizados.'
                : 'Each campaign adapts to the real goal: hire, compare internal talent, or evaluate technical skills with custom sets.'}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {[
              {
                icon: UsersRound,
                title: language === 'es' ? 'Campañas de selección' : 'Selection campaigns',
                desc: language === 'es'
                  ? 'Define el cargo a cubrir, asigna evaluaciones y recibe candidatos ordenados por compatibilidad.'
                  : 'Define the role to fill, assign assessments and receive candidates ranked by compatibility.',
                bullets: language === 'es'
                  ? ['Cargo objetivo', 'Ranking de candidatos', 'Resultados por persona']
                  : ['Target role', 'Candidate ranking', 'Per-person results'],
                color: 'indigo',
              },
              {
                icon: Users,
                title: language === 'es' ? 'Campañas de equipo interno' : 'Internal team campaigns',
                desc: language === 'es'
                  ? 'Evalúa a tu equipo actual, compara perfiles, detecta brechas y crea planes de desarrollo.'
                  : 'Assess your current team, compare profiles, detect gaps and build development plans.',
                bullets: language === 'es'
                  ? ['Área o equipo', 'Comparación interna', 'Lectura de desarrollo']
                  : ['Team or area', 'Internal comparison', 'Development insights'],
                color: 'cyan',
              },
              {
                icon: FileCode,
                title: language === 'es' ? 'Pruebas técnicas personalizables' : 'Custom technical tests',
                desc: language === 'es'
                  ? 'Usa plantillas, mezcla preguntas por cargo, tema o nivel, reemplaza preguntas y revisa todo antes de enviar.'
                  : 'Use templates, mix questions by role, topic or level, replace questions and review everything before sending.',
                bullets: language === 'es'
                  ? ['Plantillas', 'Banco de preguntas', 'Vista previa y reemplazo']
                  : ['Templates', 'Question bank', 'Preview and replacement'],
                color: 'sky',
              },
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className={`h-2 bg-gradient-to-r ${
                    item.color === 'indigo' ? 'from-indigo-500 to-purple-500' :
                    item.color === 'cyan' ? 'from-cyan-500 to-blue-500' :
                    'from-sky-500 to-cyan-500'
                  }`} />
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        item.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                        item.color === 'cyan' ? 'bg-cyan-100 text-cyan-600' :
                        'bg-sky-100 text-sky-600'
                      }`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.bullets.map((bullet) => (
                        <Badge key={bullet} variant="outline" className="text-gray-700 border-gray-200 bg-gray-50">
                          {bullet}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Módulos de Análisis */}
      <section id="modulos" className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-indigo-100 text-indigo-700 mb-4">
              <Layers className="w-4 h-4 mr-2" />
              {language === 'es' ? '8 Módulos de Análisis' : '8 Analysis Modules'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === 'es' ? 'Análisis ' : 'Scientific '}
              <span className="text-indigo-600">{language === 'es' ? 'científico integral' : 'comprehensive analysis'}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'es' 
                ? 'Cada módulo evalúa una dimensión clave del candidato. Juntos, construyen un perfil 360° que predice el éxito laboral.'
                : 'Each module evaluates a key dimension of the candidate. Together, they build a 360° profile that predicts job success.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, name: 'DISC', desc: language === 'es' ? 'Estilo conductual y comunicación' : 'Behavioral style and communication', color: 'indigo', bgClass: 'bg-indigo-100', textClass: 'text-indigo-600', borderClass: 'border-indigo-200', hoverClass: 'hover:border-indigo-400' },
              { icon: Flame, name: language === 'es' ? 'Motivadores' : 'Motivators', desc: language === 'es' ? '12 fuerzas que impulsan decisiones' : '12 forces that drive decisions', color: 'purple', bgClass: 'bg-purple-100', textClass: 'text-purple-600', borderClass: 'border-purple-200', hoverClass: 'hover:border-purple-400' },
              { icon: Heart, name: 'EQ', desc: language === 'es' ? 'Inteligencia emocional' : 'Emotional intelligence', color: 'rose', bgClass: 'bg-rose-100', textClass: 'text-rose-600', borderClass: 'border-rose-200', hoverClass: 'hover:border-rose-400' },
              { icon: Dna, name: 'DNA-25', desc: language === 'es' ? '25 competencias medibles' : '25 measurable competencies', color: 'teal', bgClass: 'bg-teal-100', textClass: 'text-teal-600', borderClass: 'border-teal-200', hoverClass: 'hover:border-teal-400' },
              { icon: Compass, name: 'Acumen', desc: language === 'es' ? 'Claridad en toma de decisiones' : 'Clarity in decision making', color: 'amber', bgClass: 'bg-amber-100', textClass: 'text-amber-600', borderClass: 'border-amber-200', hoverClass: 'hover:border-amber-400' },
              { icon: Shield, name: language === 'es' ? 'Valores' : 'Values', desc: language === 'es' ? 'Alineación cultural' : 'Cultural alignment', color: 'violet', bgClass: 'bg-violet-100', textClass: 'text-violet-600', borderClass: 'border-violet-200', hoverClass: 'hover:border-violet-400' },
              { icon: Activity, name: language === 'es' ? 'Estrés' : 'Stress', desc: language === 'es' ? 'Manejo bajo presión' : 'Handling under pressure', color: 'orange', bgClass: 'bg-orange-100', textClass: 'text-orange-600', borderClass: 'border-orange-200', hoverClass: 'hover:border-orange-400' },
              { icon: FileCode, name: language === 'es' ? 'Técnica' : 'Technical', desc: language === 'es' ? '+225 cargos · plantillas · banco de preguntas' : '+225 roles · templates · question bank', color: 'sky', bgClass: 'bg-sky-100', textClass: 'text-sky-600', borderClass: 'border-sky-200', hoverClass: 'hover:border-sky-400', isNew: true },
            ].map((mod, i) => (
              <div key={i} className={`bg-white rounded-xl p-6 border-2 ${mod.borderClass} ${mod.hoverClass} transition-all hover:shadow-lg hover:-translate-y-1 group relative`}>
                {mod.isNew && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-sky-500 text-white text-[10px] px-2 py-0.5 shadow-lg">{language === 'es' ? 'NUEVO' : 'NEW'}</Badge>
                  </div>
                )}
                <div className={`w-14 h-14 rounded-xl ${mod.bgClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <mod.icon className={`w-7 h-7 ${mod.textClass}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{mod.name}</h3>
                <p className="text-sm text-gray-600">{mod.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-100">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-700 font-medium">
                {language === 'es' ? 'Todos los módulos se integran en un ' : 'All modules integrate into a '}
                <span className="text-indigo-600 font-bold">{language === 'es' ? 'perfil unificado' : 'unified profile'}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona / Campañas */}
      <section id="campanas" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-cyan-100 text-cyan-700 mb-4">
              <Rocket className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Proceso Simple' : 'Simple Process'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {language === 'es' ? 'Encuentra talento en ' : 'Find talent in '}
              <span className="text-cyan-600">{language === 'es' ? '3 pasos' : '3 steps'}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: '01', 
                icon: Briefcase, 
                title: language === 'es' ? 'Crea tu campaña' : 'Create your campaign',
                desc: language === 'es' 
                  ? 'Define el cargo, selecciona los módulos de evaluación que necesitas y carga tus candidatos.'
                  : 'Define the position, select the evaluation modules you need and upload your candidates.',
                color: 'cyan'
              },
              { 
                step: '02', 
                icon: Cpu, 
                title: language === 'es' ? 'Reclu analiza' : 'Reclu analyzes',
                desc: language === 'es' 
                  ? 'Los candidatos completan las evaluaciones. Nuestro sistema procesa los datos y genera perfiles completos.'
                  : 'Candidates complete evaluations. Our system processes data and generates complete profiles.',
                color: 'indigo'
              },
              { 
                step: '03', 
                icon: Award, 
                title: language === 'es' ? 'Recibe tu ranking' : 'Receive your ranking',
                desc: language === 'es' 
                  ? 'Obtén un ranking ordenado por compatibilidad con el cargo. Toma decisiones basadas en datos.'
                  : 'Get a ranking sorted by position compatibility. Make data-driven decisions.',
                color: 'purple'
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all h-full">
                  <div className={`absolute -top-4 -left-2 text-6xl font-black bg-gradient-to-r ${item.color === 'cyan' ? 'from-cyan-200 to-cyan-300' : item.color === 'indigo' ? 'from-indigo-200 to-indigo-300' : 'from-purple-200 to-purple-300'} bg-clip-text text-transparent`}>
                    {item.step}
                  </div>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color === 'cyan' ? 'from-cyan-500 to-cyan-600' : item.color === 'indigo' ? 'from-indigo-500 to-indigo-600' : 'from-purple-500 to-purple-600'} flex items-center justify-center mb-6 shadow-lg`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resultados Visuales */}
      <section id="resultados" className="py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <Badge className="bg-white/10 text-white border-white/20 mb-4">
              <Eye className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Reportes Detallados' : 'Detailed Reports'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {language === 'es' ? 'Datos que ' : 'Data that '}
              <span className="text-cyan-400">{language === 'es' ? 'revelan potencial' : 'reveal potential'}</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {language === 'es' 
                ? 'Cada módulo genera reportes visuales con gráficos, scores y análisis que facilitan la comparación entre candidatos.'
                : 'Each module generates visual reports with charts, scores and analysis that facilitate comparison between candidates.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* DISC Preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-500/30 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">DISC</h3>
                  <p className="text-xs text-gray-400">{language === 'es' ? 'Estilo conductual' : 'Behavioral style'}</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-end h-24 mb-2">
                  {[
                    { label: 'D', value: 78, color: 'bg-red-400' },
                    { label: 'I', value: 45, color: 'bg-yellow-400' },
                    { label: 'S', value: 62, color: 'bg-green-400' },
                    { label: 'C', value: 85, color: 'bg-blue-400' },
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className={`w-10 ${bar.color} rounded-t`} style={{height: `${bar.value}%`}}></div>
                      <span className="text-xs text-gray-400">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* EQ Preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-500/30 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">EQ</h3>
                  <p className="text-xs text-gray-400">{language === 'es' ? 'Inteligencia emocional' : 'Emotional intelligence'}</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 flex items-center justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                    <circle cx="48" cy="48" r="40" stroke="url(#eqGradient)" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="50" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="eqGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">80</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Preview */}
            <div className="bg-gradient-to-br from-sky-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-5 border border-sky-400/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sky-500/30 rounded-lg flex items-center justify-center">
                  <FileCode className="w-5 h-5 text-sky-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{language === 'es' ? 'Técnica' : 'Technical'}</h3>
                  <p className="text-xs text-gray-400">{language === 'es' ? 'Conocimiento del cargo' : 'Position knowledge'}</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500 w-[15%]"></div>
                  <div className="h-full bg-yellow-500 w-[25%]"></div>
                  <div className="h-full bg-red-500 w-[60%]"></div>
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                  <span>{language === 'es' ? 'Básico' : 'Basic'}</span>
                  <span>{language === 'es' ? 'Intermedio' : 'Intermediate'}</span>
                  <span>{language === 'es' ? 'Avanzado' : 'Advanced'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="py-20 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              {language === 'es' ? 'Para Todo Tipo de Empresa' : 'For All Business Types'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {language === 'es' ? 'Desde startups hasta ' : 'From startups to '}
              <span className="text-cyan-200">{language === 'es' ? 'multinacionales' : 'multinational corporations'}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Rocket, 
                title: language === 'es' ? 'Startups' : 'Startups', 
                desc: language === 'es' ? 'Cada contratación cuenta. Asegura que tu equipo fundador tenga el ADN correcto.' : 'Every hire counts. Ensure your founding team has the right DNA.',
                stat: '1-10',
                statLabel: language === 'es' ? 'empleados' : 'employees'
              },
              { 
                icon: Building2, 
                title: language === 'es' ? 'PyMEs' : 'SMBs', 
                desc: language === 'es' ? 'Escala tu equipo con confianza. Reduce la rotación y mejora la productividad.' : 'Scale your team with confidence. Reduce turnover and improve productivity.',
                stat: '10-500',
                statLabel: language === 'es' ? 'empleados' : 'employees'
              },
              { 
                icon: Globe, 
                title: language === 'es' ? 'Enterprise' : 'Enterprise', 
                desc: language === 'es' ? 'Estandariza tu proceso de selección globalmente con métricas consistentes.' : 'Standardize your selection process globally with consistent metrics.',
                stat: '500+',
                statLabel: language === 'es' ? 'empleados' : 'employees'
              },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{item.stat}</p>
                    <p className="text-xs text-cyan-200">{item.statLabel}</p>
                  </div>
                </div>
                <h3 className="font-bold text-white text-xl mb-2">{item.title}</h3>
                <p className="text-cyan-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-700 mb-4">
              <Star className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Testimonios' : 'Testimonials'}
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900">
              {language === 'es' ? 'Empresas que confían en Reclu' : 'Companies that trust Reclu'}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: t('testimonials.quote1'), author: t('testimonials.author1'), role: t('testimonials.role1'), avatar: 'MG' },
              { quote: t('testimonials.quote2'), author: t('testimonials.author2'), role: t('testimonials.role2'), avatar: 'CR' },
              { quote: t('testimonials.quote3'), author: t('testimonials.author3'), role: t('testimonials.role3'), avatar: 'AM' },
            ].map((testimonial, i) => (
              <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-indigo-100 text-indigo-700 mb-4">
              {language === 'es' ? 'Preguntas Frecuentes' : 'FAQ'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === 'es' ? '¿Tienes ' : 'Have '}
              <span className="text-indigo-600">{language === 'es' ? 'preguntas?' : 'questions?'}</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: language === 'es' ? '¿Qué incluye Reclu?' : 'What does Reclu include?',
                a: language === 'es' 
                  ? 'Reclu incluye 8 módulos de evaluación científica: DISC, Motivadores, EQ, DNA-25, Acumen, Valores, Estrés y Pruebas Técnicas. Cada módulo genera reportes detallados para una visión 360° del candidato.'
                  : 'Reclu includes 8 scientific assessment modules: DISC, Motivators, EQ, DNA-25, Acumen, Values, Stress and Technical Tests. Each module generates detailed reports for a 360° candidate view.'
              },
              {
                q: language === 'es' ? '¿Cómo funcionan las campañas de reclutamiento?' : 'How do recruitment campaigns work?',
                a: language === 'es'
                  ? 'Creas una campaña, eliges si es de selección o de equipo interno, seleccionas los módulos de evaluación y Reclu envía las invitaciones automáticamente. Luego recibes resultados y comparaciones ordenadas por compatibilidad.'
                  : 'You create a campaign, choose whether it is for selection or internal team use, select the assessment modules and Reclu automatically sends invitations. Then you receive ordered results and comparisons by compatibility.'
              },
              {
                q: language === 'es' ? '¿Cuánto tiempo toman las evaluaciones?' : 'How long do evaluations take?',
                a: language === 'es'
                  ? 'Las evaluaciones psicométricas toman entre 8-20 minutos cada una. Las pruebas técnicas toman aproximadamente 25-35 minutos y se pueden configurar con plantillas y preguntas personalizadas. Cada persona puede completarlas en cualquier momento.'
                  : 'Psychometric evaluations take 8-20 minutes each. Technical tests take approximately 25-35 minutes and can be configured with templates and custom questions. Each person can complete them at any time.'
              },
              {
                q: language === 'es' ? '¿Qué cargos cubren las pruebas técnicas?' : 'What positions do technical tests cover?',
                a: language === 'es'
                  ? 'Tenemos más de 225 cargos cubiertos con 13,700+ preguntas en tecnología, administración, finanzas, marketing, recursos humanos, ventas, ingeniería y más. Además, puedes combinar preguntas por cargo, tema y nivel, o usar plantillas listas para enviar.'
                  : 'We have 225+ positions covered with 13,700+ questions in technology, administration, finance, marketing, human resources, sales, engineering and more. You can also combine questions by role, topic and level, or use ready-to-send templates.'
              },
              {
                q: language === 'es' ? '¿Cómo se protegen los datos?' : 'How is data protected?',
                a: language === 'es'
                  ? 'Todos los datos están encriptados y almacenados de forma segura. Solo el usuario que envía la evaluación puede ver los resultados. Cumplimos con las normativas de protección de datos.'
                  : 'All data is encrypted and securely stored. Only the user who sends the evaluation can view results. We comply with data protection regulations.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-cyan-500/30">
            <Zap className="w-4 h-4" />
            {language === 'es' ? 'Comienza hoy' : 'Start today'}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            {language === 'es' ? 'Construye decisiones de talento que ' : 'Build talent decisions that '}
            <span className="text-cyan-400">{language === 'es' ? 'sí funcionan' : 'actually work'}</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            {language === 'es' 
              ? 'Únete a equipos que ya usan campañas, pruebas técnicas y analítica para contratar, desarrollar y comparar con más claridad.'
              : 'Join teams already using campaigns, technical tests and analytics to hire, develop and compare with more clarity.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-lg px-10 py-7 rounded-xl shadow-2xl shadow-cyan-500/25 group">
                {language === 'es' ? 'Crear Cuenta Gratis' : 'Create Free Account'}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="border-2 border-white/30 text-white bg-white/5 hover:bg-white/10 text-lg px-10 py-7 rounded-xl">
                {language === 'es' ? 'Ya tengo cuenta' : 'I have an account'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-lg">Reclu</span>
                <p className="text-xs text-gray-500">{language === 'es' ? 'Plataforma de talento' : 'Talent platform'}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link>
            </div>
            <p className="text-sm">© 2026 Reclu. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
