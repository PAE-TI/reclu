'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Send,
  Package,
  ClipboardList,
  BarChart3,
  Users,
  Eye,
  FileText,
  Copy,
  Mail,
  RefreshCw,
  Trash2,
  Download,
  Search,
  Bell,
  Settings,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
  Heart,
  Dna,
  Compass,
  Shield,
  Activity,
  Brain,
  Flame,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  MessageSquare,
  UserPlus,
  Coins,
  TrendingUp,
  LineChart,
  PieChart,
  Filter,
  Calendar,
  Clock,
  AlertCircle,
  Info,
  Lightbulb,
  BookOpen,
  GraduationCap
} from 'lucide-react';

const sections = [
  {
    id: 'enviar',
    title: 'Enviar Evaluaciones',
    icon: Send,
    color: 'from-indigo-500 to-purple-500',
    description: 'Cómo enviar pruebas a tus candidatos o colaboradores'
  },
  {
    id: 'gestionar',
    title: 'Gestionar Evaluaciones',
    icon: ClipboardList,
    color: 'from-emerald-500 to-teal-500',
    description: 'Cómo ver el estado, reenviar enlaces y administrar las pruebas'
  },
  {
    id: 'resultados',
    title: 'Ver Resultados',
    icon: Eye,
    color: 'from-blue-500 to-cyan-500',
    description: 'Cómo acceder y entender los resultados de cada evaluación'
  },
  {
    id: 'analisis',
    title: 'Análisis Avanzado',
    icon: BarChart3,
    color: 'from-amber-500 to-orange-500',
    description: 'Cómo usar el análisis individual y comparativo de personas'
  },
  {
    id: 'notas',
    title: 'Notas y Comentarios',
    icon: MessageSquare,
    color: 'from-rose-500 to-pink-500',
    description: 'Cómo agregar y gestionar notas en las evaluaciones'
  },
  {
    id: 'equipo',
    title: 'Gestión de Equipo',
    icon: Users,
    color: 'from-violet-500 to-purple-500',
    description: 'Cómo invitar facilitadores y gestionar permisos'
  }
];

const modules = [
  { name: 'DISC', icon: Target, color: 'text-blue-600', bg: 'bg-blue-100', description: 'Comportamiento' },
  { name: 'Fuerzas Motivadoras', icon: Flame, color: 'text-purple-600', bg: 'bg-purple-100', description: 'Motivaciones' },
  { name: 'Inteligencia Emocional', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100', description: 'EQ' },
  { name: 'DNA-25', icon: Dna, color: 'text-teal-600', bg: 'bg-teal-100', description: 'Competencias' },
  { name: 'Acumen (ACI)', icon: Brain, color: 'text-amber-600', bg: 'bg-amber-100', description: 'Juicio' },
  { name: 'Valores', icon: Shield, color: 'text-violet-600', bg: 'bg-violet-100', description: 'Integridad' },
  { name: 'Estrés', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100', description: 'Resiliencia' },
];

export default function GuiaPlataformaPage() {
  const [activeSection, setActiveSection] = useState<string | null>('enviar');

  const toggleSection = (id: string) => {
    setActiveSection(activeSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-6 mb-8 shadow-xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Guía Completa de Reclu</h1>
                <p className="text-slate-300 text-sm">Todo lo que necesitas saber para usar la plataforma</p>
              </div>
            </div>
            <p className="text-slate-200 text-base max-w-2xl">
              Aprende paso a paso cómo enviar evaluaciones, gestionar resultados, analizar perfiles y sacar el máximo provecho de los 8 módulos de Reclu.
            </p>
          </div>
        </div>

        {/* Módulos disponibles */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-600" />
            Los 7 Módulos de Reclu
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {modules.map((mod) => (
              <div key={mod.name} className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm text-center">
                <div className={`${mod.bg} w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <mod.icon className={`w-5 h-5 ${mod.color}`} />
                </div>
                <p className="text-xs font-semibold text-slate-800 truncate">{mod.name}</p>
                <p className="text-[10px] text-slate-500">{mod.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Índice de secciones */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700" />
            Contenido de la Guía
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  activeSection === section.id
                    ? 'bg-slate-100 border-slate-300 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow'
                }`}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${section.color}`}>
                  <section.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{section.title}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{section.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de cada sección */}
        <div className="space-y-4">
          
          {/* SECCIÓN: ENVIAR EVALUACIONES */}
          <Card className={`border-0 shadow-lg overflow-hidden ${activeSection === 'enviar' ? 'ring-2 ring-slate-400' : ''}`}>
            <button
              onClick={() => toggleSection('enviar')}
              className="w-full"
            >
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Send className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-lg">1. Enviar Evaluaciones</CardTitle>
                      <CardDescription className="text-white/70">Cómo enviar pruebas a candidatos o colaboradores</CardDescription>
                    </div>
                  </div>
                  {activeSection === 'enviar' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
            </button>
            {activeSection === 'enviar' && (
              <CardContent className="p-6 space-y-6">
                {/* Opción 1: Envío múltiple */}
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    Opción A: Enviar Pruebas (Múltiples módulos)
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p><strong>Ubicación:</strong> Menú lateral → "Enviar Pruebas" o botón principal en el Dashboard</p>
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <p className="font-semibold text-indigo-800 mb-2">Pasos:</p>
                      <ol className="list-decimal list-inside space-y-2 text-indigo-700">
                        <li>Ingresa el <strong>nombre completo</strong> del destinatario</li>
                        <li>Ingresa su <strong>correo electrónico</strong></li>
                        <li>Selecciona los <strong>módulos</strong> que deseas enviar (puedes seleccionar todos con un clic)</li>
                        <li>Revisa el <strong>costo en créditos</strong> que se muestra en tiempo real</li>
                        <li>Haz clic en <strong>"Enviar Evaluaciones"</strong></li>
                      </ol>
                    </div>
                    <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-800">Cada evaluación consume créditos. El costo se muestra antes de enviar.</p>
                    </div>
                  </div>
                </div>

                {/* Opción 2: Envío individual */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-purple-600" />
                    Opción B: Enviar un módulo específico
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>Cada módulo tiene su propia página de gestión donde puedes enviar evaluaciones individuales:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-2 rounded text-xs">Menú → DISC → "Nueva Evaluación"</div>
                      <div className="bg-gray-50 p-2 rounded text-xs">Menú → Fuerzas Motivadoras → "Nueva"</div>
                      <div className="bg-gray-50 p-2 rounded text-xs">Menú → Inteligencia Emocional → "Nueva"</div>
                      <div className="bg-gray-50 p-2 rounded text-xs">Menú → DNA-25 → "Nueva Evaluación"</div>
                    </div>
                  </div>
                </div>

                {/* Qué recibe el destinatario */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    ¿Qué recibe el destinatario?
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Un correo electrónico por cada evaluación enviada</li>
                    <li>• Instrucciones claras sobre cómo completar la prueba</li>
                    <li>• Un enlace único y seguro que expira en 30 días</li>
                    <li>• Tiempo estimado de completación (10-15 minutos por prueba)</li>
                  </ul>
                </div>
              </CardContent>
            )}
          </Card>

          {/* SECCIÓN: GESTIONAR EVALUACIONES */}
          <Card className={`border-0 shadow-lg overflow-hidden ${activeSection === 'gestionar' ? 'ring-2 ring-emerald-400' : ''}`}>
            <button onClick={() => toggleSection('gestionar')} className="w-full">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-lg">2. Gestionar Evaluaciones</CardTitle>
                      <CardDescription className="text-white/70">Ver estado, reenviar enlaces y administrar pruebas</CardDescription>
                    </div>
                  </div>
                  {activeSection === 'gestionar' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
            </button>
            {activeSection === 'gestionar' && (
              <CardContent className="p-6 space-y-6">
                {/* Dónde ver evaluaciones */}
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">¿Dónde veo mis evaluaciones enviadas?</h3>
                  <p className="text-sm text-gray-700 mb-3">En el menú lateral, cada módulo tiene su página de gestión:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <Link href="/external-evaluations" className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span>DISC</span>
                      <ArrowRight className="w-3 h-3 ml-auto" />
                    </Link>
                    <Link href="/external-driving-forces-evaluations" className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                      <Flame className="w-4 h-4 text-purple-600" />
                      <span>Fuerzas Motivadoras</span>
                      <ArrowRight className="w-3 h-3 ml-auto" />
                    </Link>
                    <Link href="/external-eq-evaluations" className="flex items-center gap-2 p-2 bg-rose-50 rounded-lg hover:bg-rose-100 transition">
                      <Heart className="w-4 h-4 text-rose-600" />
                      <span>Inteligencia Emocional</span>
                      <ArrowRight className="w-3 h-3 ml-auto" />
                    </Link>
                    <Link href="/external-dna-evaluations" className="flex items-center gap-2 p-2 bg-teal-50 rounded-lg hover:bg-teal-100 transition">
                      <Dna className="w-4 h-4 text-teal-600" />
                      <span>DNA-25 Competencias</span>
                      <ArrowRight className="w-3 h-3 ml-auto" />
                    </Link>
                  </div>
                </div>

                {/* Estados de evaluación */}
                <div className="border-l-4 border-teal-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">Estados de las evaluaciones</h3>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                      <Badge className="bg-amber-100 text-amber-700 mb-1">Pendiente</Badge>
                      <p className="text-xs text-amber-800">Enviada, esperando respuesta</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <Badge className="bg-green-100 text-green-700 mb-1">Completada</Badge>
                      <p className="text-xs text-green-800">Finalizada, ver resultados</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg text-center">
                      <Badge className="bg-red-100 text-red-700 mb-1">Expirada</Badge>
                      <p className="text-xs text-red-800">Link vencido (30 días)</p>
                    </div>
                  </div>
                </div>

                {/* Acciones disponibles */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-800 mb-3">Acciones disponibles en cada evaluación:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Copy className="w-4 h-4" />
                      <span><strong>Copiar enlace:</strong> Para reenviar manualmente</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Eye className="w-4 h-4" />
                      <span><strong>Ver resultados:</strong> Solo si está completada</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Download className="w-4 h-4" />
                      <span><strong>Exportar PDF:</strong> Descargar informe</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700">
                      <MessageSquare className="w-4 h-4" />
                      <span><strong>Notas:</strong> Agregar comentarios</span>
                    </div>
                  </div>
                </div>

                {/* Tip importante */}
                <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800"><strong>Tip:</strong> Si el destinatario no recibió el correo, puedes copiar el enlace y enviárselo por WhatsApp, Slack u otro medio.</p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* SECCIÓN: VER RESULTADOS */}
          <Card className={`border-0 shadow-lg overflow-hidden ${activeSection === 'resultados' ? 'ring-2 ring-blue-400' : ''}`}>
            <button onClick={() => toggleSection('resultados')} className="w-full">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-lg">3. Ver Resultados</CardTitle>
                      <CardDescription className="text-white/70">Acceder y entender los resultados de cada evaluación</CardDescription>
                    </div>
                  </div>
                  {activeSection === 'resultados' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
            </button>
            {activeSection === 'resultados' && (
              <CardContent className="p-6 space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">¿Cómo accedo a los resultados?</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Ve a la página de gestión del módulo correspondiente (ej: DISC)</li>
                    <li>Busca la evaluación con estado <Badge className="bg-green-100 text-green-700 text-xs">Completada</Badge></li>
                    <li>Haz clic en el botón <strong>"Ver Resultados"</strong></li>
                  </ol>
                </div>

                <div className="border-l-4 border-cyan-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">¿Qué incluyen los resultados?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <strong className="text-gray-900">DISC:</strong> Perfil de comportamiento con gráfico de barras, estilo natural vs adaptado, fortalezas y áreas de desarrollo.
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <strong className="text-gray-900">Fuerzas Motivadoras:</strong> Ranking de 12 motivadores, top 3 fuerzas dominantes, motivadores situacionales.
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <strong className="text-gray-900">EQ:</strong> Puntuación de 5 dimensiones emocionales, gráfico radar, recomendaciones de desarrollo.
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <strong className="text-gray-900">DNA-25:</strong> 25 competencias profesionales con niveles de desarrollo y áreas prioritarias.
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 flex items-center gap-2 mb-2">
                    <Download className="w-4 h-4" />
                    Exportar a PDF
                  </h4>
                  <p className="text-sm text-blue-700">Cada resultado puede exportarse a PDF profesional para compartir con el evaluado o guardar en su expediente. El botón "Exportar PDF" está disponible en la página de resultados.</p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* SECCIÓN: ANÁLISIS AVANZADO */}
          <Card className={`border-0 shadow-lg overflow-hidden ${activeSection === 'analisis' ? 'ring-2 ring-amber-400' : ''}`}>
            <button onClick={() => toggleSection('analisis')} className="w-full">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-lg">4. Análisis Avanzado</CardTitle>
                      <CardDescription className="text-white/70">Análisis individual y comparativo de personas</CardDescription>
                    </div>
                  </div>
                  {activeSection === 'analisis' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
            </button>
            {activeSection === 'analisis' && (
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-3 bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                  <Info className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-800">El Análisis Avanzado es la función más poderosa de Reclu</p>
                    <p className="text-sm text-amber-700 mt-1">Te permite ver el perfil integrado de una persona (combinando todos sus módulos) o comparar varias personas entre sí.</p>
                  </div>
                </div>

                <div className="border-l-4 border-amber-500 pl-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    Análisis Individual
                  </h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>¿Para qué sirve?</strong> Ver el perfil completo Reclu de una persona que ha completado varios módulos.</p>
                    <div className="bg-amber-50 rounded-lg p-4">
                      <p className="font-semibold text-amber-800 mb-2">Pasos:</p>
                      <ol className="list-decimal list-inside space-y-1 text-amber-700">
                        <li>Ve a <strong>Menú → Análisis Avanzado</strong></li>
                        <li>Selecciona una persona de la lista</li>
                        <li>Verás su perfil integrado con todos los módulos completados</li>
                        <li>Usa las pestañas para ver cada dimensión en detalle</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    Análisis Comparativo
                  </h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>¿Para qué sirve?</strong> Comparar el perfil de 2 o más personas lado a lado.</p>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="font-semibold text-orange-800 mb-2">Pasos:</p>
                      <ol className="list-decimal list-inside space-y-1 text-orange-700">
                        <li>Ve a <strong>Menú → Análisis Avanzado</strong></li>
                        <li>Activa el modo <strong>"Comparar"</strong></li>
                        <li>Selecciona las personas que quieres comparar (2 o más)</li>
                        <li>Verás gráficos comparativos de cada dimensión</li>
                      </ol>
                    </div>
                    <p className="text-gray-600"><strong>Ideal para:</strong> Decidir entre candidatos finalistas, formar equipos equilibrados, identificar gaps de competencias.</p>
                  </div>
                </div>

                <Link href="/analytics">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Ir a Análisis Avanzado
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            )}
          </Card>

          {/* SECCIÓN: NOTAS */}
          <Card className={`border-0 shadow-lg overflow-hidden ${activeSection === 'notas' ? 'ring-2 ring-rose-400' : ''}`}>
            <button onClick={() => toggleSection('notas')} className="w-full">
              <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-lg">5. Notas y Comentarios</CardTitle>
                      <CardDescription className="text-white/70">Agregar y gestionar notas en evaluaciones</CardDescription>
                    </div>
                  </div>
                  {activeSection === 'notas' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
            </button>
            {activeSection === 'notas' && (
              <CardContent className="p-6 space-y-6">
                <div className="border-l-4 border-rose-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">¿Qué son las notas?</h3>
                  <p className="text-sm text-gray-700">Las notas te permiten agregar comentarios, observaciones o recordatorios a cada evaluación. Son visibles solo para ti y tu equipo (facilitadores), no para el evaluado.</p>
                </div>

                <div className="border-l-4 border-pink-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">¿Cómo agregar notas?</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Ve a la página de gestión de cualquier módulo (ej: DISC)</li>
                    <li>Encuentra la evaluación deseada</li>
                    <li>Haz clic en el botón <Badge className="bg-amber-100 text-amber-700">Notas</Badge></li>
                    <li>Escribe tu comentario y haz clic en "Enviar"</li>
                  </ol>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                  <h4 className="font-semibold text-rose-800 mb-2">Usos comunes de las notas:</h4>
                  <ul className="text-sm text-rose-700 space-y-1">
                    <li>• Registrar observaciones de una entrevista</li>
                    <li>• Anotar comentarios del cliente o jefe directo</li>
                    <li>• Marcar seguimientos pendientes</li>
                    <li>• Documentar decisiones de contratación</li>
                  </ul>
                </div>
              </CardContent>
            )}
          </Card>

          {/* SECCIÓN: GESTIÓN DE EQUIPO */}
          <Card className={`border-0 shadow-lg overflow-hidden ${activeSection === 'equipo' ? 'ring-2 ring-violet-400' : ''}`}>
            <button onClick={() => toggleSection('equipo')} className="w-full">
              <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-lg">6. Gestión de Equipo</CardTitle>
                      <CardDescription className="text-white/70">Invitar facilitadores y gestionar permisos</CardDescription>
                    </div>
                  </div>
                  {activeSection === 'equipo' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
            </button>
            {activeSection === 'equipo' && (
              <CardContent className="p-6 space-y-6">
                <div className="border-l-4 border-violet-500 pl-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <UserPlus className="w-5 h-5 text-violet-600" />
                    Invitar Facilitadores
                  </h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>Puedes invitar a otras personas de tu organización para que envíen y gestionen evaluaciones.</p>
                    <div className="bg-violet-50 rounded-lg p-4">
                      <p className="font-semibold text-violet-800 mb-2">Pasos:</p>
                      <ol className="list-decimal list-inside space-y-1 text-violet-700">
                        <li>Ve a <strong>Menú → Mi Equipo</strong></li>
                        <li>Haz clic en <strong>"Invitar Facilitador"</strong></li>
                        <li>Ingresa el email y selecciona el nivel de acceso</li>
                        <li>El facilitador recibirá un email para crear su cuenta</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">Niveles de acceso</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <Badge className="bg-green-100 text-green-700 mb-2">Acceso Completo</Badge>
                      <p className="text-green-800">Ve todas las evaluaciones del equipo y puede enviar nuevas.</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <Badge className="bg-amber-100 text-amber-700 mb-2">Solo Propias</Badge>
                      <p className="text-amber-800">Solo ve las evaluaciones que él mismo envió.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                  <h4 className="font-semibold text-violet-800 flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4" />
                    Créditos compartidos
                  </h4>
                  <p className="text-sm text-violet-700">Los facilitadores usan los créditos de la cuenta principal (propietario). No necesitan comprar créditos por separado.</p>
                </div>

                <Link href="/team">
                  <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white">
                    <Users className="w-5 h-5 mr-2" />
                    Ir a Gestión de Equipo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            )}
          </Card>

        </div>

        {/* CTA Final */}
        <div className="mt-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-6 text-center text-white">
          <h2 className="text-xl font-bold mb-2">¿Listo para comenzar?</h2>
          <p className="text-slate-300 mb-4">Envía tu primera evaluación y descubre el potencial de tu equipo</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/batch-evaluations">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold w-full sm:w-auto">
                <Send className="w-5 h-5 mr-2" />
                Enviar Pruebas
              </Button>
            </Link>
            <Link href="/analytics">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/20 w-full sm:w-auto">
                <BarChart3 className="w-5 h-5 mr-2" />
                Ver Análisis Avanzado
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
