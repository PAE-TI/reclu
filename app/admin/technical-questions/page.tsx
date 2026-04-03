'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  XCircle,
  ArrowLeft,
  AlertTriangle,
  Eye,
  Filter,
  RefreshCw,
  Globe,
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
  const { language, t } = useLanguage();
  
  const [questions, setQuestions] = useState<TechnicalQuestion[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [positionsLoading, setPositionsLoading] = useState(true);
  
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
  const [viewMode, setViewMode] = useState<'questions' | 'positions'>('questions');
  const [previewLang, setPreviewLang] = useState<'es' | 'en'>('es');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    fetchQuestions();
    fetchPositions();
  }, [currentPage, filterPosition, filterDifficulty, filterCategory]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });
      
      if (filterPosition !== 'all') params.append('jobPosition', filterPosition);
      if (filterDifficulty !== 'all') params.append('difficulty', filterDifficulty);
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (searchTerm) params.append('search', searchTerm);

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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchQuestions();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterPosition('all');
    setFilterDifficulty('all');
    setFilterCategory('all');
    setCurrentPage(1);
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
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar pregunta');
    } finally {
      setDeleting(false);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/admin" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al Panel de Admin
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl">
              <FileCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'es' ? 'Gestión de Preguntas Técnicas' : 'Technical Questions Management'}
              </h1>
              <p className="text-gray-600">
                {language === 'es' 
                  ? 'Administra las preguntas técnicas para evaluaciones' 
                  : 'Manage technical questions for evaluations'}
              </p>
            </div>
          </div>
          <Button onClick={openCreateDialog} className="bg-sky-600 hover:bg-sky-700">
            <Plus className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Nueva Pregunta' : 'New Question'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <FileCode className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-sky-700">{total}</p>
                  <p className="text-xs text-sky-600">
                    {language === 'es' ? 'Total Preguntas' : 'Total Questions'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{stats.byDifficulty?.EASY || 0}</p>
                  <p className="text-xs text-green-600">
                    {language === 'es' ? 'Fáciles' : 'Easy'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-700">{stats.byDifficulty?.MEDIUM || 0}</p>
                  <p className="text-xs text-amber-600">
                    {language === 'es' ? 'Medias' : 'Medium'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700">{stats.byDifficulty?.HARD || 0}</p>
                  <p className="text-xs text-red-600">
                    {language === 'es' ? 'Difíciles' : 'Hard'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'questions' | 'positions')} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            {language === 'es' ? 'Preguntas' : 'Questions'}
          </TabsTrigger>
          <TabsTrigger value="positions" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            {language === 'es' ? 'Por Cargo' : 'By Position'}
          </TabsTrigger>
        </TabsList>

        {/* Questions View */}
        <TabsContent value="questions">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={language === 'es' ? 'Buscar preguntas...' : 'Search questions...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Select value={filterPosition} onValueChange={(v) => { setFilterPosition(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder={language === 'es' ? 'Cargo' : 'Position'} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="all">{language === 'es' ? 'Todos los cargos' : 'All positions'}</SelectItem>
                    {positions.filter(p => p.questionCount > 0).map((pos) => (
                      <SelectItem key={pos.id} value={pos.id}>
                        {language === 'es' ? pos.title : pos.titleEn} ({pos.questionCount})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterDifficulty} onValueChange={(v) => { setFilterDifficulty(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full lg:w-36">
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
                <Button variant="outline" onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" onClick={resetFilters}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-sky-600" />
                  {language === 'es' ? 'Preguntas Técnicas' : 'Technical Questions'}
                </CardTitle>
                <Badge variant="outline" className="bg-white">
                  {total} {language === 'es' ? 'preguntas' : 'questions'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <FileCode className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">
                    {language === 'es' ? 'No se encontraron preguntas' : 'No questions found'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className="p-4 hover:bg-gray-50/80 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 text-xs">
                              {getPositionTitle(question.jobPosition)}
                            </Badge>
                            {getDifficultyBadge(question.difficulty)}
                            <Badge variant="outline" className="text-xs">
                              #{question.questionNumber}
                            </Badge>
                          </div>
                          <p className="text-gray-900 font-medium line-clamp-2 mb-2">
                            {language === 'es' ? question.questionText : (question.questionTextEn || question.questionText)}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                              {language === 'es' ? 'Respuesta' : 'Answer'}: {question.correctAnswer}
                            </span>
                            <span>{question.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openPreviewDialog(question)}
                            className="h-8 w-8 p-0 hover:bg-sky-50"
                            title={language === 'es' ? 'Vista previa' : 'Preview'}
                          >
                            <Eye className="w-4 h-4 text-sky-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(question)}
                            className="h-8 w-8 p-0 hover:bg-amber-50"
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
                            className="h-8 w-8 p-0 hover:bg-red-50"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <p className="text-sm text-gray-600">
                {language === 'es' ? 'Mostrando' : 'Showing'} {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, total)} {language === 'es' ? 'de' : 'of'} {total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  {currentPage} {language === 'es' ? 'de' : 'of'} {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Positions View */}
        <TabsContent value="positions">
          <Card>
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-sky-600" />
                {language === 'es' ? 'Preguntas por Cargo' : 'Questions by Position'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {positionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {positions.filter(p => p.questionCount > 0).map((position) => (
                    <div
                      key={position.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {language === 'es' ? position.title : position.titleEn}
                        </p>
                        <p className="text-sm text-gray-500">{position.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">
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
                          {language === 'es' ? 'Ver' : 'View'}
                        </Button>
                      </div>
                    </div>
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
