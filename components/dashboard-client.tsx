'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import {
  Brain,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  Users,
  Target,
  Send,
  Building2,
  ArrowRight,
  Briefcase,
  Heart,
  Dna,
  Compass,
  Scale,
  Activity,
  Package,
  Lightbulb,
  Sparkles,
  Zap,
  Eye,
  LineChart,
  HelpCircle,
  FileCode,
  Code,
  TrendingUp,
  Award,
  UserCheck,
  Search,
  BookOpen,
  Play,
  ChevronRight,
  AlertCircle,
  Calendar,
  Rocket,
  Shield,
  GraduationCap,
  ClipboardCheck,
  Timer,
  Star,
  ArrowUpRight,
  PieChart,
  UserPlus,
  FolderOpen
} from 'lucide-react';

interface DashboardStats {
  totalEvaluations: number;
  totalCompleted: number;
  totalPending: number;
  totalExpired: number;
  totalPeopleEvaluated: number;
  completionRate: number;
  peopleWithFullMotivaIQ: number;
  recentActivity: Array<{
    type: string;
    name: string;
    email: string;
    status: string;
    date: string;
    tokenExpiry: string;
  }>;
  technicalTotal?: number;
  technicalCompleted?: number;
  technicalPending?: number;
}

interface DashboardClientProps {
  stats: DashboardStats;
}

export default function DashboardClient({ stats }: DashboardClientProps) {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [showAllTips, setShowAllTips] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    setCurrentTime(Date.now());
  }, []);

  const dayOfYear = useMemo(() => {
    if (!mounted) return 0;
    return Math.floor((currentTime - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  }, [mounted, currentTime]);

  // Tips para headhunters - Colores profesionales indigo-purple
  const headhunterTips = [
    {
      icon: Target,
      title: language === 'es' ? 'Define el Perfil Ideal' : 'Define the Ideal Profile',
      desc: language === 'es' 
        ? 'Antes de evaluar, define qué competencias son críticas para el cargo. Usa la biblioteca de +225 cargos como referencia.'
        : 'Before evaluating, define critical competencies for the role. Use the 225+ position library as reference.',
      color: 'from-indigo-700 to-purple-700',
      bgColor: 'bg-indigo-50',
      link: '/campaigns/new'
    },
    {
      icon: Users,
      title: language === 'es' ? 'Compara Candidatos Objetivamente' : 'Compare Candidates Objectively',
      desc: language === 'es' 
        ? 'Usa el análisis comparativo para evaluar candidatos contra el perfil ideal y entre sí. Elimina sesgos en la selección.'
        : 'Use comparative analysis to evaluate candidates against the ideal profile and each other. Eliminate selection bias.',
      color: 'from-indigo-600 to-purple-600',
      bgColor: 'bg-indigo-50',
      link: '/analytics?mode=compare'
    },
    {
      icon: FileCode,
      title: language === 'es' ? 'Valida Conocimientos Técnicos' : 'Validate Technical Knowledge',
      desc: language === 'es' 
        ? 'Complementa evaluaciones psicométricas con pruebas técnicas. Verifica que el candidato tiene el conocimiento que dice tener.'
        : 'Complement psychometric evaluations with technical tests. Verify the candidate has the claimed knowledge.',
      color: 'from-indigo-700 to-purple-700',
      bgColor: 'bg-indigo-50',
      link: '/external-technical-evaluations'
    },
    {
      icon: BarChart3,
      title: language === 'es' ? 'Análisis Integrado 360°' : 'Integrated 360° Analysis',
      desc: language === 'es' 
        ? 'Un perfil completo con las 8 evaluaciones te da una visión integral del candidato: comportamiento, motivación, inteligencia emocional y competencias.'
        : 'A complete profile with all 8 assessments gives you a comprehensive view: behavior, motivation, emotional intelligence, and competencies.',
      color: 'from-indigo-600 to-purple-600',
      bgColor: 'bg-indigo-50',
      link: '/analytics'
    },
    {
      icon: Clock,
      title: language === 'es' ? 'Agiliza tu Proceso' : 'Streamline Your Process',
      desc: language === 'es' 
        ? 'Envía evaluaciones en lote a múltiples candidatos. Ahorra tiempo y mantén consistencia en tu proceso de selección.'
        : 'Send batch evaluations to multiple candidates. Save time and maintain consistency in your selection process.',
      color: 'from-indigo-700 to-purple-700',
      bgColor: 'bg-indigo-50',
      link: '/batch-evaluations'
    },
    {
      icon: Shield,
      title: language === 'es' ? 'Evalúa Valores e Integridad' : 'Assess Values & Integrity',
      desc: language === 'es' 
        ? 'Los valores del candidato deben alinearse con la cultura organizacional. Usa la evaluación de Valores e Integridad para validarlo.'
        : 'Candidate values must align with organizational culture. Use the Values & Integrity assessment to validate.',
      color: 'from-indigo-600 to-purple-600',
      bgColor: 'bg-indigo-50',
      link: '/external-values-evaluations'
    }
  ];

  const tipIndex = dayOfYear % headhunterTips.length;
  const todayTip = headhunterTips[tipIndex];
  const TipIcon = todayTip.icon;

  const getStatusText = (status: string, tokenExpiry: string) => {
    if (mounted && new Date(currentTime) > new Date(tokenExpiry) && status === 'PENDING') return language === 'es' ? 'Expirado' : 'Expired';
    switch (status) {
      case 'COMPLETED': return language === 'es' ? 'Completado' : 'Completed';
      case 'PENDING': return language === 'es' ? 'Pendiente' : 'Pending';
      default: return status;
    }
  };

  const getStatusColor = (status: string, tokenExpiry: string) => {
    if (mounted && new Date(currentTime) > new Date(tokenExpiry) && status === 'PENDING') return 'bg-red-100 text-red-700';
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: string) => {
    // Use UTC to avoid hydration mismatches between server and client
    const d = new Date(date);
    const day = d.getUTCDate();
    const monthNames = language === 'es' 
      ? ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[d.getUTCMonth()];
    return `${day} de ${month}`;
  };

  const getEvalTypeIcon = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'DISC': return <Target className={iconClass} />;
      case 'DF': return <Sparkles className={iconClass} />;
      case 'EQ': return <Heart className={iconClass} />;
      case 'DNA': return <Dna className={iconClass} />;
      case 'ACI': return <Compass className={iconClass} />;
      case 'VALUES': return <Scale className={iconClass} />;
      case 'STRESS': return <Activity className={iconClass} />;
      case 'TECHNICAL': return <FileCode className={iconClass} />;
      default: return <Brain className={iconClass} />;
    }
  };

  const completedToday = stats.recentActivity.filter(a => {
    if (!mounted) return false;
    const actDate = new Date(a.date).toDateString();
    const today = new Date(currentTime).toDateString();
    return actDate === today && a.status === 'COMPLETED';
  }).length;

  const pendingEvaluations = stats.recentActivity.filter(a => a.status === 'PENDING').length;

  // Quick actions para headhunters - Colores profesionales
  const quickActions = [
    {
      icon: Briefcase,
      title: language === 'es' ? 'Nueva Campaña' : 'New Campaign',
      desc: language === 'es' ? 'Inicia un proceso de selección' : 'Start a selection process',
      href: '/campaigns/new',
      color: 'bg-gradient-to-r from-indigo-600 to-purple-600',
      primary: true
    },
    {
      icon: Package,
      title: language === 'es' ? 'Enviar Evaluaciones' : 'Send Evaluations',
      desc: language === 'es' ? 'Los 8 módulos disponibles' : 'All 8 modules available',
      href: '/batch-evaluations',
      color: 'bg-indigo-600'
    },
    {
      icon: Users,
      title: language === 'es' ? 'Comparar Candidatos' : 'Compare Candidates',
      desc: language === 'es' ? 'Análisis comparativo' : 'Comparative analysis',
      href: '/analytics?mode=compare',
      color: 'bg-purple-600'
    },
    {
      icon: Eye,
      title: language === 'es' ? 'Ver Resultados' : 'View Results',
      desc: language === 'es' ? 'Análisis individual' : 'Individual analysis',
      href: '/analytics?mode=individual',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* HEADER - Diseño Profesional Sobrio */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                  {language === 'es' ? 'Centro de Reclutamiento' : 'Recruitment Center'}
                </h1>
                <p className="text-slate-600">
                  {language === 'es' ? 'Tu hub para seleccionar el mejor talento' : 'Your hub for selecting the best talent'}
                </p>
              </div>
            </div>
            
            {/* CTA Principal */}
            <Link href="/campaigns/new">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg w-full lg:w-auto">
                <Plus className="w-5 h-5 mr-2" />
                {language === 'es' ? 'Nueva Campaña de Selección' : 'New Selection Campaign'}
              </Button>
            </Link>
          </div>

          {/* KPIs Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
            <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      {language === 'es' ? 'Candidatos' : 'Candidates'}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalPeopleEvaluated}</p>
                  </div>
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {language === 'es' ? 'Total evaluados' : 'Total evaluated'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      {language === 'es' ? 'Completadas' : 'Completed'}
                    </p>
                    <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.totalCompleted}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${stats.completionRate || 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(stats.completionRate || 0)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      {language === 'es' ? 'Pendientes' : 'Pending'}
                    </p>
                    <p className="text-3xl font-bold text-amber-600 mt-1">{stats.totalPending}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {language === 'es' ? 'Esperando respuesta' : 'Awaiting response'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      {language === 'es' ? 'Perfiles 360°' : '360° Profiles'}
                    </p>
                    <p className="text-3xl font-bold text-purple-600 mt-1">{stats.peopleWithFullMotivaIQ}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {language === 'es' ? '8 módulos completos' : '8 complete modules'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 border-0 shadow-lg col-span-2 lg:col-span-1">
              <CardContent className="p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-indigo-300 font-medium uppercase tracking-wide">
                      {language === 'es' ? 'Hoy' : 'Today'}
                    </p>
                    <p className="text-3xl font-bold mt-1">{completedToday}</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-xs text-indigo-300 mt-2">
                  {language === 'es' ? 'Evaluaciones completadas' : 'Evaluations completed'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              {language === 'es' ? 'Acciones Rápidas' : 'Quick Actions'}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <Link key={idx} href={action.href} className="group">
                  <div className={`
                    relative h-full p-4 rounded-2xl transition-all duration-300 cursor-pointer
                    ${action.primary 
                      ? `${action.color} text-white shadow-lg hover:shadow-xl hover:scale-[1.02]`
                      : 'bg-white border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:scale-[1.02]'
                    }
                  `}>
                    <div className={`
                      p-2.5 rounded-xl w-fit mb-3
                      ${action.primary ? 'bg-white/10' : `${action.color}`}
                    `}>
                      <ActionIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`font-semibold ${action.primary ? 'text-white' : 'text-slate-900'}`}>
                      {action.title}
                    </h3>
                    <p className={`text-xs mt-1 ${action.primary ? 'text-slate-300' : 'text-slate-500'}`}>
                      {action.desc}
                    </p>
                    <ArrowRight className={`
                      absolute bottom-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all
                      ${action.primary ? 'text-white' : 'text-slate-600'}
                    `} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL - 2 COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA - Actividad y Pipeline */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Alertas importantes */}
            {stats.totalPending > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {language === 'es' 
                        ? `Tienes ${stats.totalPending} evaluaciones pendientes de respuesta`
                        : `You have ${stats.totalPending} evaluations pending response`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === 'es'
                        ? 'Los candidatos tienen 30 días para completar. Considera reenviar el correo si llevan tiempo sin responder.'
                        : 'Candidates have 30 days to complete. Consider resending the email if they haven\'t responded.'}
                    </p>
                  </div>
                  <Link href="/batch-evaluations">
                    <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                      {language === 'es' ? 'Ver' : 'View'}
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Actividad Reciente */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    {language === 'es' ? 'Actividad Reciente' : 'Recent Activity'}
                  </CardTitle>
                  <Link href="/analytics">
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                      {language === 'es' ? 'Ver todo' : 'View all'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {stats.recentActivity.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {language === 'es' ? 'Sin actividad aún' : 'No activity yet'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
                      {language === 'es' 
                        ? 'Comienza enviando evaluaciones a tus candidatos para ver la actividad aquí.'
                        : 'Start by sending evaluations to your candidates to see activity here.'}
                    </p>
                    <Link href="/batch-evaluations">
                      <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Send className="w-4 h-4 mr-2" />
                        {language === 'es' ? 'Enviar Primera Evaluación' : 'Send First Evaluation'}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {stats.recentActivity.slice(0, 6).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            {getEvalTypeIcon(activity.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{activity.name}</p>
                            <p className="text-xs text-gray-500">{activity.type} • {formatDate(activity.date)}</p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(activity.status, activity.tokenExpiry)} text-xs`}>
                          {getStatusText(activity.status, activity.tokenExpiry)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Módulos Disponibles */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    {language === 'es' ? '8 Módulos de Evaluación' : '8 Evaluation Modules'}
                  </CardTitle>
                  <Link href="/evaluations-guide">
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                      {language === 'es' ? 'Ver Guía' : 'View Guide'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  {language === 'es' 
                    ? 'Combina módulos para obtener una visión 360° de cada candidato'
                    : 'Combine modules for a 360° view of each candidate'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { name: 'DISC', icon: Target, color: 'indigo', desc: language === 'es' ? 'Comportamiento' : 'Behavior' },
                    { name: language === 'es' ? 'F. Motivadoras' : 'Driving Forces', icon: Sparkles, color: 'purple', desc: language === 'es' ? 'Motivación' : 'Motivation' },
                    { name: 'EQ', icon: Heart, color: 'rose', desc: language === 'es' ? 'Inteligencia Emocional' : 'Emotional Intelligence' },
                    { name: 'DNA-25', icon: Dna, color: 'teal', desc: language === 'es' ? 'Competencias' : 'Competencies' },
                    { name: 'Acumen', icon: Compass, color: 'amber', desc: language === 'es' ? 'Capacidad Analítica' : 'Analytical Capacity' },
                    { name: language === 'es' ? 'Valores' : 'Values', icon: Shield, color: 'violet', desc: language === 'es' ? 'Integridad' : 'Integrity' },
                    { name: language === 'es' ? 'Estrés' : 'Stress', icon: Activity, color: 'orange', desc: language === 'es' ? 'Resiliencia' : 'Resilience' },
                    { name: language === 'es' ? 'Técnica' : 'Technical', icon: FileCode, color: 'sky', desc: language === 'es' ? 'Conocimientos' : 'Knowledge', isNew: true },
                  ].map((mod, idx) => {
                    const ModIcon = mod.icon;
                    return (
                      <div key={idx} className={`p-3 rounded-xl bg-${mod.color}-50 border border-${mod.color}-100 hover:border-${mod.color}-200 transition-colors relative`}>
                        {mod.isNew && (
                          <Badge className="absolute -top-2 -right-2 bg-sky-500 text-white text-[9px] px-1.5">
                            NEW
                          </Badge>
                        )}
                        <ModIcon className={`w-5 h-5 text-${mod.color}-600 mb-2`} />
                        <p className="font-semibold text-gray-900 text-sm">{mod.name}</p>
                        <p className="text-xs text-gray-500">{mod.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* COLUMNA DERECHA - Tips y Recursos */}
          <div className="space-y-6">
            
            {/* Tip del Día */}
            <Card className={`bg-gradient-to-br ${todayTip.color} border-0 shadow-xl text-white overflow-hidden`}>
              <CardContent className="p-5 relative">
                <div className="absolute top-3 right-3 opacity-10">
                  <TipIcon className="w-20 h-20" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5" />
                    <span className="text-sm font-semibold opacity-90">
                      {language === 'es' ? 'Tip del Día' : 'Tip of the Day'}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{todayTip.title}</h4>
                  <p className="text-sm opacity-90 leading-relaxed">{todayTip.desc}</p>
                  <Link href={todayTip.link}>
                    <Button size="sm" variant="secondary" className="mt-4 bg-white/20 hover:bg-white/30 text-white border-0">
                      {language === 'es' ? 'Aplicar ahora' : 'Apply now'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Más Tips */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  {language === 'es' ? 'Consejos para Headhunters' : 'Tips for Headhunters'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {headhunterTips.slice(0, showAllTips ? 6 : 3).map((tip, idx) => {
                    if (idx === tipIndex) return null; // Skip today's tip
                    const TIcon = tip.icon;
                    return (
                      <Link key={idx} href={tip.link}>
                        <div className={`p-3 ${tip.bgColor} rounded-xl hover:scale-[1.02] transition-all cursor-pointer`}>
                          <div className="flex items-start gap-3">
                            <TIcon className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{tip.title}</p>
                              <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{tip.desc}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {!showAllTips && (
                  <Button 
                    variant="ghost" 
                    className="w-full mt-3 text-indigo-600 hover:text-indigo-700"
                    onClick={() => setShowAllTips(true)}
                  >
                    {language === 'es' ? 'Ver más consejos' : 'View more tips'}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Guía y Recursos */}
            <Card className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 border-0 shadow-xl text-white">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">
                      {language === 'es' ? '¿Primera vez?' : 'First time?'}
                    </h4>
                    <p className="text-sm text-indigo-300">
                      {language === 'es' ? 'Aprende a usar la plataforma' : 'Learn to use the platform'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link href="/evaluations-guide" className="block">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                      <Play className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm">{language === 'es' ? 'Guía de Evaluaciones' : 'Evaluations Guide'}</span>
                      <ArrowUpRight className="w-4 h-4 ml-auto text-indigo-400" />
                    </div>
                  </Link>
                  <Link href="/guia-plataforma" className="block">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                      <HelpCircle className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">{language === 'es' ? 'Cómo usar MotivaIQ' : 'How to use MotivaIQ'}</span>
                      <ArrowUpRight className="w-4 h-4 ml-auto text-indigo-400" />
                    </div>
                  </Link>
                  <Link href="/campaigns" className="block">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                      <Briefcase className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">{language === 'es' ? 'Mis Campañas' : 'My Campaigns'}</span>
                      <ArrowUpRight className="w-4 h-4 ml-auto text-indigo-400" />
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Soporte */}
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-5 text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <HelpCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">
                {language === 'es' ? '¿Necesitas ayuda?' : 'Need help?'}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {language === 'es' 
                  ? 'Estamos aquí para ayudarte a encontrar el mejor talento'
                  : 'We\'re here to help you find the best talent'}
              </p>
              <Link href="/guia-plataforma">
                <Button variant="outline" size="sm" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                  {language === 'es' ? 'Ver Guía Completa' : 'View Complete Guide'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
