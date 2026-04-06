'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Code,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileCode,
  Briefcase,
  BarChart3,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Eye,
  RefreshCw,
  Layers3,
  Sparkles,
  BookOpen,
  ListChecks,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/language-context';

interface TechnicalQuestion {
  id: string;
  jobPosition: string;
  questionNumber: number;
  questionText: string;
  questionTextEn: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionAEn: string | null;
  optionBEn: string | null;
  optionCEn: string | null;
  optionDEn: string | null;
  correctAnswer: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  categoryEn: string | null;
  weight: number;
  createdAt: string;
}

interface Position {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  questionCount: number;
}

interface Stats {
  byDifficulty: Record<string, number>;
  byPosition: number;
  byCategory: Record<string, number>;
}

interface Overview {
  totalQuestions: number;
  activeQuestions: number;
  inactiveQuestions: number;
  templatesCount: number;
  coveredPositions: number;
  totalPositions: number;
  difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  topPositions: {
    id: string;
    title: string;
    titleEn: string;
    category: string;
    questionCount: number;
  }[];
  topCategories: {
    name: string;
    count: number;
  }[];
}

interface TechnicalTemplate {
  id: string;
  name: string;
  description: string | null;
  basePositionId: string;
  basePositionTitle: string;
  createdAt: string;
  updatedAt: string;
  ownerUser: {
    name: string | null;
    company: string | null;
    email: string;
  };
  questionCount: number;
}

const DIFFICULTIES = [
  { value: 'EASY', label: 'Fácil', labelEn: 'Easy', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'MEDIUM', label: 'Media', labelEn: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'HARD', label: 'Difícil', labelEn: 'Hard', color: 'bg-red-100 text-red-700 border-red-200' },
];

const CATEGORIES = [
  'Conocimiento Técnico',
  'Resolución de Problemas',
  'Toma de Decisiones',
  'Mejores Prácticas',
  'Casos Prácticos',
];

export default function AdminTechnicalQuestionsPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  
  const [questions, setQuestions] = useState<TechnicalQuestion[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [templates, setTemplates] = useState<TechnicalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<TechnicalQuestion | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    jobPosition: '',
    questionText: '',
    questionTextEn: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    optionAEn: '',
    optionBEn: '',
    optionCEn: '',
    optionDEn: '',
    correctAnswer: 'A',
    difficulty: 'MEDIUM',
    category: 'Conocimiento Técnico',
    categoryEn: 'Technical Knowledge',
    weight: 1.0,
  });
  
  // View mode
  const [viewMode, setViewMode] = useState<'overview' | 'questions' | 'positions' | 'templates'>('overview');
  const [previewLang, setPreviewLang] = useState<'es' | 'en'>('es');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab === 'questions' || tab === 'positions' || tab === 'templates' || tab === 'overview') {
      setViewMode(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchQuestions();
    fetchPositions();
  }, [currentPage, filterPosition, filterDifficulty, filterCategory]);

  useEffect(() => {
    fetchOverview();
    fetchTemplates();
  }, []);

  const fetchQuestions = async (override?: {
    page?: number;
    search?: string;
    jobPosition?: string;
    difficulty?: string;
    category?: string;
  }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (override?.page ?? currentPage).toString(),
        limit: '20',
      });
      
      const searchValue = override?.search ?? searchTerm;
      const positionValue = override?.jobPosition ?? filterPosition;
      const difficultyValue = override?.difficulty ?? filterDifficulty;
      const categoryValue = override?.category ?? filterCategory;

      if (positionValue !== 'all') params.append('jobPosition', positionValue);
      if (difficultyValue !== 'all') params.append('difficulty', difficultyValue);
      if (categoryValue !== 'all') params.append('category', categoryValue);
      if (searchValue) params.append('search', searchValue);

      const response = await fetch(`/api/admin/technical-questions?${params}`);
      if (!response.ok) {
        if (response.status === 403) {
          toast.error('No tienes permisos de administrador');
          router.push('/dashboard');
          return;
        }
        throw new Error('Error al cargar preguntas');
      }
      const data = await response.json();
      setQuestions(data.questions);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setStats(data.stats);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar preguntas');
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    setPositionsLoading(true);
    try {
      const response = await fetch('/api/admin/technical-questions/positions');
      if (response.ok) {
        const data = await response.json();
        setPositions(data.positions);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setPositionsLoading(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const response = await fetch('/api/admin/technical-questions/overview');
      if (response.ok) {
        const data = await response.json();
        setOverview(data.overview);
      }
    } catch (error) {
      console.error('Error fetching overview:', error);
    }
  };

  const fetchTemplates = async () => {
    setTemplatesLoading(true);
    try {
      const response = await fetch('/api/admin/technical-templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchQuestions({ page: 1 });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterPosition('all');
    setFilterDifficulty('all');
    setFilterCategory('all');
    setCurrentPage(1);
    fetchQuestions({
      page: 1,
      search: '',
      jobPosition: 'all',
      difficulty: 'all',
      category: 'all',
    });
  };

  const openCreateDialog = () => {
    setIsCreating(true);
    setFormData({
      jobPosition: filterPosition !== 'all' ? filterPosition : '',
      questionText: '',
      questionTextEn: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      optionAEn: '',
      optionBEn: '',
      optionCEn: '',
      optionDEn: '',
      correctAnswer: 'A',
      difficulty: 'MEDIUM',
      category: 'Conocimiento Técnico',
      categoryEn: 'Technical Knowledge',
      weight: 1.0,
    });
    setEditDialogOpen(true);
  };

  const openEditDialog = (question: TechnicalQuestion) => {
    setIsCreating(false);
    setSelectedQuestion(question);
    setFormData({
      jobPosition: question.jobPosition,
      questionText: question.questionText,
      questionTextEn: question.questionTextEn || '',
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      optionAEn: question.optionAEn || '',
      optionBEn: question.optionBEn || '',
      optionCEn: question.optionCEn || '',
      optionDEn: question.optionDEn || '',
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      category: question.category,
      categoryEn: question.categoryEn || '',
      weight: question.weight,
    });
    setEditDialogOpen(true);
  };

  const openPreviewDialog = (question: TechnicalQuestion) => {
    setSelectedQuestion(question);
    setPreviewDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.jobPosition || !formData.questionText || !formData.optionA || !formData.optionB || !formData.optionC || !formData.optionD) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setSaving(true);
    try {
      const url = isCreating 
        ? '/api/admin/technical-questions'
        : `/api/admin/technical-questions/${selectedQuestion?.id}`;
      
      const response = await fetch(url, {
        method: isCreating ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al guardar');
      }

      toast.success(isCreating ? 'Pregunta creada exitosamente' : 'Pregunta actualizada exitosamente');
      setEditDialogOpen(false);
      fetchQuestions();
      fetchPositions();
      fetchOverview();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al guardar pregunta');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedQuestion) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/technical-questions/${selectedQuestion.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al eliminar');
      }

      toast.success('Pregunta eliminada exitosamente');
      setDeleteDialogOpen(false);
      setSelectedQuestion(null);
      fetchQuestions();
      fetchPositions();
      fetchOverview();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar pregunta');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    setDeletingTemplateId(templateId);
    try {
      const response = await fetch(`/api/admin/technical-templates/${templateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al eliminar la plantilla');
      }

      toast.success('Plantilla eliminada exitosamente');
      fetchTemplates();
      fetchOverview();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar plantilla');
    } finally {
      setDeletingTemplateId(null);
    }
  };

  const getPositionTitle = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    return position ? (language === 'es' ? position.title : position.titleEn) : positionId;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const diff = DIFFICULTIES.find(d => d.value === difficulty);
    return diff ? (
      <Badge className={diff.color}>
        {language === 'es' ? diff.label : diff.labelEn}
      </Badge>
    ) : null;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {language === 'es' ? 'Volver al panel' : 'Back to dashboard'}
        </Link>
        <Button onClick={openCreateDialog} className="bg-sky-600 hover:bg-sky-700 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          {language === 'es' ? 'Nueva pregunta' : 'New question'}
        </Button>
      </div>

      <Card className="overflow-hidden border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 text-white shadow-2xl">
        <CardContent className="p-0">
          <div className="grid gap-0 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-100">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'es' ? 'Centro de pruebas técnicas' : 'Technical test center'}
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {language === 'es' ? 'Gestión técnica moderna' : 'Modern technical management'}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                {language === 'es'
                  ? 'Administra el banco de preguntas, revisa cobertura por cargo y gestiona plantillas desde un solo lugar.'
                  : 'Manage the question bank, review role coverage, and handle templates from one place.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={openCreateDialog} className="bg-white text-slate-950 hover:bg-slate-100">
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Crear pregunta' : 'Create question'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewMode('overview')}
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <ListChecks className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Ver resumen' : 'View overview'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    fetchQuestions();
                    fetchPositions();
                    fetchOverview();
                    fetchTemplates();
                  }}
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Actualizar' : 'Refresh'}
                </Button>
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/5 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                    {language === 'es' ? 'Total' : 'Total'}
                  </p>
                  <p className="mt-2 text-3xl font-semibold">{overview?.totalQuestions ?? total}</p>
                  <p className="mt-1 text-xs text-slate-300">{language === 'es' ? 'Preguntas activas' : 'Live questions'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                    {language === 'es' ? 'Plantillas' : 'Templates'}
                  </p>
                  <p className="mt-2 text-3xl font-semibold">{overview?.templatesCount ?? templates.length}</p>
                  <p className="mt-1 text-xs text-slate-300">{language === 'es' ? 'Reutilizables' : 'Reusable sets'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                    {language === 'es' ? 'Cobertura' : 'Coverage'}
                  </p>
                  <p className="mt-2 text-3xl font-semibold">{overview ? `${overview.coveredPositions}` : positions.filter(p => p.questionCount > 0).length}</p>
                  <p className="mt-1 text-xs text-slate-300">{language === 'es' ? 'Cargos cubiertos' : 'Covered roles'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                    {language === 'es' ? 'Difíciles' : 'Hard'}
                  </p>
                  <p className="mt-2 text-3xl font-semibold">{overview?.difficulty.hard ?? stats?.byDifficulty?.HARD ?? 0}</p>
                  <p className="mt-1 text-xs text-slate-300">{language === 'es' ? 'Nivel alto' : 'Advanced level'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-50 p-2.5 text-sky-600">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{language === 'es' ? 'Total preguntas' : 'Total questions'}</p>
                <p className="text-2xl font-semibold text-slate-900">{overview?.totalQuestions ?? total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{language === 'es' ? 'Cobertura de cargos' : 'Role coverage'}</p>
                <p className="text-2xl font-semibold text-slate-900">{overview?.coveredPositions ?? 0}/{overview?.totalPositions ?? positions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-600">
                <Layers3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{language === 'es' ? 'Plantillas' : 'Templates'}</p>
                <p className="text-2xl font-semibold text-slate-900">{overview?.templatesCount ?? templates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-rose-50 p-2.5 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{language === 'es' ? 'Difíciles' : 'Hard questions'}</p>
                <p className="text-2xl font-semibold text-slate-900">{overview?.difficulty.hard ?? stats?.byDifficulty?.HARD ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'overview' | 'questions' | 'positions' | 'templates')} className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-2 md:grid-cols-4">
          <TabsTrigger value="overview" className="rounded-xl px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Resumen' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="questions" className="rounded-xl px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FileCode className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Banco' : 'Bank'}
          </TabsTrigger>
          <TabsTrigger value="positions" className="rounded-xl px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Briefcase className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Cargos' : 'Roles'}
          </TabsTrigger>
          <TabsTrigger value="templates" className="rounded-xl px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Layers3 className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Plantillas' : 'Templates'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b bg-slate-50/80">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-sky-600" />
                  {language === 'es' ? 'Cobertura por cargo' : 'Coverage by role'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {overview?.topPositions?.length ? (
                  <div className="divide-y divide-slate-100">
                    {overview.topPositions.map(position => (
                      <button
                        key={position.id}
                        type="button"
                        onClick={() => {
                          setFilterPosition(position.id);
                          setViewMode('questions');
                          setCurrentPage(1);
                        }}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900">{language === 'es' ? position.title : position.titleEn}</p>
                          <p className="text-sm text-slate-500">{position.category}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                            {position.questionCount}
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-sm text-slate-500">
                    {language === 'es' ? 'Todavía no hay cargos con preguntas.' : 'No roles with questions yet.'}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b bg-slate-50/80">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ListChecks className="w-5 h-5 text-sky-600" />
                  {language === 'es' ? 'Distribución de dificultad' : 'Difficulty mix'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                {([
                  ['EASY', 'EASY', 'Fácil', 'Easy', 'bg-emerald-500'],
                  ['MEDIUM', 'MEDIUM', 'Media', 'Medium', 'bg-amber-500'],
                  ['HARD', 'HARD', 'Difícil', 'Hard', 'bg-rose-500'],
                ] as const).map(([key, value, labelEs, labelEn, color]) => {
                  const amount = overview?.difficulty[key === 'EASY' ? 'easy' : key === 'MEDIUM' ? 'medium' : 'hard'] ?? stats?.byDifficulty?.[value] ?? 0;
                  const totalBase = (overview?.totalQuestions ?? total) || 1;
                  const percent = Math.round((amount / totalBase) * 100);
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{language === 'es' ? labelEs : labelEn}</span>
                        <span className="text-slate-500">{amount}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full ${color}`} style={{ width: `${Math.max(percent, amount > 0 ? 6 : 0)}%` }} />
                      </div>
                    </div>
                  );
                })}

                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-800">
                    {language === 'es' ? 'Top categorías' : 'Top categories'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(overview?.topCategories || []).map(category => (
                      <Badge key={category.name} variant="outline" className="bg-white">
                        {category.name} · {category.count}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={language === 'es' ? 'Buscar por texto, tema o respuesta...' : 'Search by text, topic or answer...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Select value={filterPosition} onValueChange={(v) => { setFilterPosition(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={language === 'es' ? 'Cargo' : 'Role'} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="all">{language === 'es' ? 'Todos los cargos' : 'All roles'}</SelectItem>
                    {positions.filter(p => p.questionCount > 0).map((pos) => (
                      <SelectItem key={pos.id} value={pos.id}>
                        {language === 'es' ? pos.title : pos.titleEn} ({pos.questionCount})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterDifficulty} onValueChange={(v) => { setFilterDifficulty(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={language === 'es' ? 'Dificultad' : 'Difficulty'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'es' ? 'Todas' : 'All'}</SelectItem>
                    {DIFFICULTIES.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value}>
                        {language === 'es' ? diff.label : diff.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={language === 'es' ? 'Categoría' : 'Category'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'es' ? 'Todas' : 'All'}</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleSearch} className="justify-center">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" onClick={resetFilters} className="justify-center">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b bg-slate-50/80">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileCode className="w-5 h-5 text-sky-600" />
                  {language === 'es' ? 'Banco de preguntas' : 'Question bank'}
                </CardTitle>
                <Badge variant="outline" className="bg-white">
                  {total} {language === 'es' ? 'preguntas' : 'questions'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {questions.length === 0 ? (
                <div className="p-10 text-center">
                  <FileCode className="mx-auto mb-3 w-12 h-12 text-slate-300" />
                  <p className="text-slate-500">
                    {language === 'es' ? 'No se encontraron preguntas' : 'No questions found'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className="px-5 py-4 transition-colors hover:bg-slate-50/80"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                              {getPositionTitle(question.jobPosition)}
                            </Badge>
                            {getDifficultyBadge(question.difficulty)}
                            <Badge variant="outline" className="text-slate-500">
                              #{question.questionNumber}
                            </Badge>
                            {question.category && (
                              <Badge variant="outline" className="bg-white text-slate-600">
                                {question.category}
                              </Badge>
                            )}
                          </div>
                          <p className="line-clamp-2 text-base font-medium text-slate-900">
                            {language === 'es' ? question.questionText : (question.questionTextEn || question.questionText)}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              {language === 'es' ? 'Correcta' : 'Correct'}: {question.correctAnswer}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <BarChart3 className="w-4 h-4 text-slate-400" />
                              {language === 'es' ? 'Peso' : 'Weight'} {question.weight}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 self-start">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openPreviewDialog(question)}
                            className="h-9 w-9 p-0 hover:bg-sky-50"
                            title={language === 'es' ? 'Vista previa' : 'Preview'}
                          >
                            <Eye className="w-4 h-4 text-sky-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(question)}
                            className="h-9 w-9 p-0 hover:bg-amber-50"
                            title={language === 'es' ? 'Editar' : 'Edit'}
                          >
                            <Edit className="w-4 h-4 text-amber-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedQuestion(question);
                              setDeleteDialogOpen(true);
                            }}
                            className="h-9 w-9 p-0 hover:bg-red-50"
                            title={language === 'es' ? 'Eliminar' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 px-1">
              <p className="text-sm text-slate-500">
                {language === 'es' ? 'Mostrando' : 'Showing'} {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, total)} {language === 'es' ? 'de' : 'of'} {total}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-slate-600">
                  {currentPage} {language === 'es' ? 'de' : 'of'} {totalPages}
                </span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b bg-slate-50/80">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="w-5 h-5 text-sky-600" />
                {language === 'es' ? 'Cobertura por cargo' : 'Coverage by role'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {positionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {positions.filter(p => p.questionCount > 0).map((position) => (
                    <div
                      key={position.id}
                      className="flex flex-col gap-3 p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {language === 'es' ? position.title : position.titleEn}
                        </p>
                        <p className="text-sm text-slate-500">{position.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                          {position.questionCount} {language === 'es' ? 'preguntas' : 'questions'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFilterPosition(position.id);
                            setViewMode('questions');
                            setCurrentPage(1);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {language === 'es' ? 'Ver banco' : 'Open bank'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b bg-slate-50/80">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers3 className="w-5 h-5 text-sky-600" />
                {language === 'es' ? 'Plantillas técnicas' : 'Technical templates'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  {language === 'es'
                    ? 'Las plantillas guardan sets completos de 20 preguntas para reutilizarlos al enviar evaluaciones.'
                    : 'Templates save complete 20-question sets so you can reuse them when sending evaluations.'}
                </p>
                <Button variant="outline" onClick={() => router.push('/external-technical-evaluations?tab=templates')}>
                  <ListChecks className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Abrir envío' : 'Open sending flow'}
                </Button>
              </div>

              {templatesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
                </div>
              ) : templates.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <Layers3 className="mx-auto mb-3 w-10 h-10 text-slate-300" />
                  <p className="font-medium text-slate-800">
                    {language === 'es' ? 'Todavía no hay plantillas guardadas' : 'No templates saved yet'}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {language === 'es'
                      ? 'Las plantillas aparecerán aquí cuando se guarden desde el constructor técnico.'
                      : 'Templates will appear here once they are saved from the technical builder.'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {templates.map(template => (
                    <Card key={template.id} className="border-slate-200 shadow-sm">
                      <CardContent className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-semibold text-slate-900">{template.name}</h3>
                            <p className="text-sm text-slate-500">{template.basePositionTitle}</p>
                          </div>
                          <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                            {template.questionCount}
                          </Badge>
                        </div>
                        {template.description && (
                          <p className="line-clamp-2 text-sm text-slate-600">{template.description}</p>
                        )}
                        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                          <span className="truncate">
                            {template.ownerUser.name || template.ownerUser.email}
                          </span>
                          <span>{new Date(template.updatedAt).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => router.push('/external-technical-evaluations?tab=templates')}
                          >
                            {language === 'es' ? 'Usar' : 'Use'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeleteTemplate(template.id)}
                            disabled={deletingTemplateId === template.id}
                          >
                            {deletingTemplateId === template.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Edit/Create Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isCreating ? <Plus className="w-5 h-5 text-sky-600" /> : <Edit className="w-5 h-5 text-amber-600" />}
              {isCreating 
                ? (language === 'es' ? 'Nueva Pregunta' : 'New Question')
                : (language === 'es' ? 'Editar Pregunta' : 'Edit Question')}
            </DialogTitle>
            <DialogDescription>
              {language === 'es' 
                ? 'Complete los campos en español e inglés para soporte bilingüe'
                : 'Fill in both Spanish and English fields for bilingual support'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Position & Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{language === 'es' ? 'Cargo' : 'Position'} *</Label>
                <Select
                  value={formData.jobPosition}
                  onValueChange={(v) => setFormData({ ...formData, jobPosition: v })}
                  disabled={!isCreating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'es' ? 'Seleccionar cargo' : 'Select position'} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {positions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id}>
                        {language === 'es' ? pos.title : pos.titleEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{language === 'es' ? 'Dificultad' : 'Difficulty'} *</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(v) => setFormData({ ...formData, difficulty: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value}>
                        {language === 'es' ? diff.label : diff.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{language === 'es' ? 'Categoría' : 'Category'}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Question Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  🇪🇸 {language === 'es' ? 'Pregunta (Español)' : 'Question (Spanish)'} *
                </Label>
                <Textarea
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder={language === 'es' ? 'Escriba la pregunta...' : 'Write the question...'}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  🇺🇸 {language === 'es' ? 'Pregunta (Inglés)' : 'Question (English)'}
                </Label>
                <Textarea
                  value={formData.questionTextEn}
                  onChange={(e) => setFormData({ ...formData, questionTextEn: e.target.value })}
                  placeholder={language === 'es' ? 'Traducción al inglés...' : 'English translation...'}
                  rows={3}
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <Label>{language === 'es' ? 'Opciones de Respuesta' : 'Answer Options'}</Label>
              {['A', 'B', 'C', 'D'].map((opt) => (
                <div key={opt} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`w-8 h-8 flex items-center justify-center ${
                        formData.correctAnswer === opt 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {opt}
                    </Badge>
                    <Input
                      value={formData[`option${opt}` as keyof typeof formData] as string}
                      onChange={(e) => setFormData({ ...formData, [`option${opt}`]: e.target.value })}
                      placeholder={`${language === 'es' ? 'Opción' : 'Option'} ${opt} (ES)`}
                      className="flex-1"
                    />
                  </div>
                  <Input
                    value={formData[`option${opt}En` as keyof typeof formData] as string}
                    onChange={(e) => setFormData({ ...formData, [`option${opt}En`]: e.target.value })}
                    placeholder={`${language === 'es' ? 'Opción' : 'Option'} ${opt} (EN)`}
                  />
                </div>
              ))}
            </div>

            {/* Correct Answer */}
            <div className="space-y-2">
              <Label>{language === 'es' ? 'Respuesta Correcta' : 'Correct Answer'} *</Label>
              <Select
                value={formData.correctAnswer}
                onValueChange={(v) => setFormData({ ...formData, correctAnswer: v })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {language === 'es' ? 'Opción' : 'Option'} {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={saving}>
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-sky-600 hover:bg-sky-700">
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : isCreating ? (
                <Plus className="w-4 h-4 mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {saving 
                ? (language === 'es' ? 'Guardando...' : 'Saving...') 
                : (language === 'es' ? 'Guardar' : 'Save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-sky-600" />
                {language === 'es' ? 'Vista Previa' : 'Preview'}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant={previewLang === 'es' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewLang('es')}
                  className={previewLang === 'es' ? 'bg-sky-600' : ''}
                >
                  🇪🇸 ES
                </Button>
                <Button
                  variant={previewLang === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewLang('en')}
                  className={previewLang === 'en' ? 'bg-sky-600' : ''}
                >
                  🇺🇸 EN
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedQuestion && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">
                  {getPositionTitle(selectedQuestion.jobPosition)}
                </Badge>
                {getDifficultyBadge(selectedQuestion.difficulty)}
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium text-gray-900 mb-4">
                  {previewLang === 'es' 
                    ? selectedQuestion.questionText 
                    : (selectedQuestion.questionTextEn || selectedQuestion.questionText)}
                </p>
                
                <div className="space-y-2">
                  {['A', 'B', 'C', 'D'].map((opt) => {
                    const isCorrect = selectedQuestion.correctAnswer === opt;
                    const optionText = previewLang === 'es'
                      ? selectedQuestion[`option${opt}` as keyof TechnicalQuestion]
                      : (selectedQuestion[`option${opt}En` as keyof TechnicalQuestion] || selectedQuestion[`option${opt}` as keyof TechnicalQuestion]);
                    
                    return (
                      <div
                        key={opt}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          isCorrect 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <Badge className={isCorrect ? 'bg-green-500' : 'bg-gray-200 text-gray-700'}>
                          {opt}
                        </Badge>
                        <span className={isCorrect ? 'font-medium text-green-700' : ''}>
                          {optionText as string}
                        </span>
                        {isCorrect && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p><strong>{language === 'es' ? 'Categoría' : 'Category'}:</strong> {selectedQuestion.category}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              {language === 'es' ? 'Eliminar Pregunta' : 'Delete Question'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'es' 
                ? '¿Estás seguro de eliminar esta pregunta? Esta acción no se puede deshacer.'
                : 'Are you sure you want to delete this question? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {language === 'es' ? 'Eliminar' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
