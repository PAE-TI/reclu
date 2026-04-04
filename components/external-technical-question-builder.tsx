'use client';

import { useEffect, useMemo, useState, type DragEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, ArrowRight, Check, Loader2, RefreshCw, Search, Shuffle, Trash2, FileText, Layers3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { JOB_POSITIONS } from '@/lib/job-positions';

type Difficulty = 'all' | 'EASY' | 'MEDIUM' | 'HARD';

interface QuestionBankQuestion {
  id: string;
  jobPositionId: string;
  jobPositionTitle: string;
  jobPositionCategory?: string | null;
  questionNumber: number;
  questionText: string;
  questionTextEn?: string | null;
  category: string | null;
  categoryEn?: string | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

interface QuestionSetConfig {
  basePositionId: string;
  sourcePositionId: string;
  filters: {
    search: string;
    category: string;
    difficulty: Difficulty;
  };
  questionIds: string[];
}

interface BuilderChangePayload {
  questionIds: string[];
  questionSetConfig: QuestionSetConfig;
  selectedQuestions: QuestionBankQuestion[];
  ready: boolean;
}

interface ExternalTechnicalQuestionBuilderProps {
  basePositionId: string;
  language: 'es' | 'en';
  onChange: (payload: BuilderChangePayload) => void;
}

const QUESTION_TARGET = 20;

export function ExternalTechnicalQuestionBuilder({
  basePositionId,
  language,
  onChange,
}: ExternalTechnicalQuestionBuilderProps) {
  const [loading, setLoading] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<QuestionBankQuestion[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionBankQuestion[]>([]);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [sourcePositionId, setSourcePositionId] = useState('all');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const basePosition = useMemo(
    () => JOB_POSITIONS.find(position => position.id === basePositionId),
    [basePositionId]
  );

  const baseTitle = language === 'es'
    ? basePosition?.title || 'Cargo base'
    : basePosition?.titleEn || basePosition?.title || 'Base position';

  const fetchBank = async (params: Record<string, string>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });
    query.append('limit', '200');

    const response = await fetch(`/api/external-technical-evaluations/question-bank?${query.toString()}`);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'No se pudo cargar el banco de preguntas');
    }
    return response.json();
  };

  const loadDefaultSet = async () => {
    if (!basePositionId) return;
    setLoading(true);
    try {
      const data = await fetchBank({ positionId: basePositionId });
      const defaults = (data.questions || []).slice(0, QUESTION_TARGET);
      setSelectedQuestions(defaults);
      setAvailableQuestions(data.questions || []);
      setCategories(data.categories || []);
      setReplaceIndex(null);
      setSourcePositionId('all');
    } catch (error) {
      console.error(error);
      toast.error(language === 'es' ? 'No se pudo cargar el set base' : 'Could not load the base set');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchBank({});
      setCategories(data.categories || []);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const searchBank = async () => {
    setLoading(true);
    try {
      const data = await fetchBank({
        positionId: sourcePositionId === 'all' ? '' : sourcePositionId,
        search,
        category: category === 'all' ? '' : category,
        difficulty,
      });
      setAvailableQuestions(data.questions || []);
      if ((data.questions || []).length === 0) {
        toast.error(language === 'es' ? 'No se encontraron preguntas con esos filtros' : 'No questions found for those filters');
      }
    } catch (error) {
      console.error(error);
      toast.error(language === 'es' ? 'Error al buscar preguntas' : 'Error searching questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDefaultSet();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePositionId]);

  useEffect(() => {
    setSourcePositionId('all');
  }, [basePositionId]);

  useEffect(() => {
    onChange({
      questionIds: selectedQuestions.map(question => question.id),
      questionSetConfig: {
        basePositionId,
        sourcePositionId,
        filters: {
          search,
          category,
          difficulty,
        },
        questionIds: selectedQuestions.map(question => question.id),
      },
      selectedQuestions,
      ready: selectedQuestions.length === QUESTION_TARGET,
    });
  }, [basePositionId, category, difficulty, onChange, search, selectedQuestions, sourcePositionId]);

  const handlePickQuestion = (question: QuestionBankQuestion) => {
    setSelectedQuestions(prev => {
      if (replaceIndex !== null) {
        const next = [...prev];
        const existingIndex = next.findIndex(item => item.id === question.id);
        if (existingIndex >= 0 && existingIndex !== replaceIndex) {
          next.splice(existingIndex, 1);
        }
        next[replaceIndex] = question;
        setReplaceIndex(null);
        return next.slice(0, QUESTION_TARGET);
      }

      const existsIndex = prev.findIndex(item => item.id === question.id);
      if (existsIndex >= 0) {
        const next = [...prev];
        const [moved] = next.splice(existsIndex, 1);
        next.push(moved);
        return next;
      }

      if (prev.length >= QUESTION_TARGET) {
        toast.error(language === 'es' ? 'Reemplaza una pregunta antes de agregar otra' : 'Replace a question before adding another');
        return prev;
      }

      return [...prev, question];
    });
  };

  const handleRemoveQuestion = (index: number) => {
    setSelectedQuestions(prev => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const startReplace = (index: number) => {
    setReplaceIndex(index);
    toast.success(language === 'es' ? 'Selecciona una pregunta del banco para reemplazarla' : 'Select a bank question to replace it');
  };

  const clearSelection = () => {
    setSelectedQuestions([]);
    setReplaceIndex(null);
    setDraggedIndex(null);
    setDropIndex(null);
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setSelectedQuestions(prev => {
      if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    setDropIndex(index);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDropIndex(index);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    if (draggedIndex === null) return;
    moveQuestion(draggedIndex, index);
    setDraggedIndex(null);
    setDropIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropIndex(null);
  };

  const selectedCount = selectedQuestions.length;
  const difficultyCounts = useMemo(() => {
    return selectedQuestions.reduce(
      (acc, question) => {
        acc[question.difficulty] += 1;
        return acc;
      },
      { EASY: 0, MEDIUM: 0, HARD: 0 }
    );
  }, [selectedQuestions]);

  return (
    <div className="space-y-6">
      <Card className="border-sky-200 bg-sky-50/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-900">
            <Layers3 className="w-5 h-5" />
            {language === 'es' ? 'Diseño de preguntas' : 'Question design'}
          </CardTitle>
          <CardDescription className="text-sky-700">
            {language === 'es'
              ? 'Parte de un set base y personaliza cada pregunta antes de enviar la evaluación.'
              : 'Start from a base set and personalize each question before sending the evaluation.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <Label>{language === 'es' ? 'Buscar preguntas' : 'Search questions'}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={language === 'es' ? 'Tema, cargo, palabra clave...' : 'Topic, role, keyword...'}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{language === 'es' ? 'Tema' : 'Theme'}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'es' ? 'Todos' : 'All'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'es' ? 'Todos' : 'All'}</SelectItem>
                  {categories.map(item => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name} ({item.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{language === 'es' ? 'Cargo origen' : 'Source role'}</Label>
              <Select value={sourcePositionId} onValueChange={setSourcePositionId}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'es' ? 'Cargo' : 'Role'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'es' ? 'Todos los cargos' : 'All roles'}</SelectItem>
                  {JOB_POSITIONS.map(position => (
                    <SelectItem key={position.id} value={position.id}>
                      {language === 'es' ? position.title : position.titleEn || position.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{language === 'es' ? 'Nivel' : 'Difficulty'}</Label>
              <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'es' ? 'Todos' : 'All'}</SelectItem>
                  <SelectItem value="EASY">{language === 'es' ? 'Fácil' : 'Easy'}</SelectItem>
                  <SelectItem value="MEDIUM">{language === 'es' ? 'Media' : 'Medium'}</SelectItem>
                  <SelectItem value="HARD">{language === 'es' ? 'Difícil' : 'Hard'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={searchBank} disabled={loading} className="bg-sky-600 hover:bg-sky-700">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              {language === 'es' ? 'Buscar en banco' : 'Search bank'}
            </Button>
            <Button type="button" variant="outline" onClick={loadDefaultSet} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {language === 'es' ? `Recargar set base: ${baseTitle}` : `Reload base set: ${baseTitle}`}
            </Button>
            <Button type="button" variant="outline" onClick={clearSelection} disabled={loading}>
              <Trash2 className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Vaciar selección' : 'Clear selection'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-white border-sky-200 text-sky-700">
              <FileText className="w-3.5 h-3.5 mr-1" />
              {language === 'es' ? `${selectedCount}/${QUESTION_TARGET} seleccionadas` : `${selectedCount}/${QUESTION_TARGET} selected`}
            </Badge>
            <Badge className="bg-white border-emerald-200 text-emerald-700">
              {language === 'es' ? `Fácil: ${difficultyCounts.EASY}` : `Easy: ${difficultyCounts.EASY}`}
            </Badge>
            <Badge className="bg-white border-amber-200 text-amber-700">
              {language === 'es' ? `Media: ${difficultyCounts.MEDIUM}` : `Medium: ${difficultyCounts.MEDIUM}`}
            </Badge>
            <Badge className="bg-white border-red-200 text-red-700">
              {language === 'es' ? `Difícil: ${difficultyCounts.HARD}` : `Hard: ${difficultyCounts.HARD}`}
            </Badge>
            {replaceIndex !== null && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                {language === 'es' ? `Reemplazando pregunta #${replaceIndex + 1}` : `Replacing question #${replaceIndex + 1}`}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="w-4 h-4 text-sky-600" />
              {language === 'es' ? 'Banco de preguntas' : 'Question bank'}
            </CardTitle>
            <CardDescription>
              {language === 'es'
                ? 'Haz clic en una pregunta para agregarla o para reemplazar la seleccionada.'
                : 'Click a question to add it or replace the selected one.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[560px] pr-3">
              <div className="space-y-3">
                {availableQuestions.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-gray-500">
                    {language === 'es'
                      ? 'No hay preguntas cargadas todavía. Usa "Buscar en banco" o recarga el set base.'
                      : 'No questions loaded yet. Use "Search bank" or reload the base set.'}
                  </div>
                ) : (
                  availableQuestions.map(question => {
                    const isSelected = selectedQuestions.some(item => item.id === question.id);
                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => handlePickQuestion(question)}
                        className={`w-full rounded-xl border p-4 text-left transition-colors ${
                          isSelected
                            ? 'border-emerald-200 bg-emerald-50'
                            : replaceIndex !== null
                              ? 'border-amber-200 hover:border-amber-300 hover:bg-amber-50'
                              : 'border-slate-200 hover:border-sky-200 hover:bg-sky-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="bg-white">
                                {question.jobPositionTitle}
                              </Badge>
                              <Badge variant="outline" className="bg-white">
                                {question.category || question.categoryEn || 'Tema'}
                              </Badge>
                              <Badge className={
                                question.difficulty === 'HARD'
                                  ? 'bg-red-100 text-red-700 border-red-200'
                                  : question.difficulty === 'MEDIUM'
                                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                                    : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                              }>
                                {question.difficulty}
                              </Badge>
                            </div>
                            <p className="line-clamp-2 text-sm font-medium text-slate-900">
                              {question.questionText}
                            </p>
                            <p className="mt-2 text-xs text-slate-500">
                              #{question.questionNumber} {language === 'es' ? 'del cargo' : 'for the role'}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {isSelected ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : replaceIndex !== null ? (
                              <Shuffle className="w-4 h-4 text-amber-600" />
                            ) : (
                              <ArrowRight className="w-4 h-4 text-sky-600" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers3 className="w-4 h-4 text-indigo-600" />
              {language === 'es' ? 'Vista previa final' : 'Final preview'}
            </CardTitle>
            <CardDescription>
              {language === 'es'
                ? 'Este es exactamente el set que recibirá el candidato. También puedes reordenarlo arrastrando cada tarjeta.'
                : 'This is exactly the set the candidate will receive. You can also reorder it by dragging each card.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {language === 'es' ? 'Preguntas seleccionadas' : 'Selected questions'}
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {selectedCount}/{QUESTION_TARGET}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {language === 'es' ? 'El set final debe quedar completo.' : 'The final set must be complete.'}
                </p>
              </div>
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-emerald-700">
                  {language === 'es' ? 'Balance de dificultad' : 'Difficulty balance'}
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm text-emerald-900">
                    <span>{language === 'es' ? 'Fácil' : 'Easy'}</span>
                    <span>{difficultyCounts.EASY}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                    <div className="h-full bg-emerald-500" style={{ width: `${(difficultyCounts.EASY / Math.max(selectedCount, 1)) * 100}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-emerald-900">
                    <span>{language === 'es' ? 'Media' : 'Medium'}</span>
                    <span>{difficultyCounts.MEDIUM}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                    <div className="h-full bg-amber-500" style={{ width: `${(difficultyCounts.MEDIUM / Math.max(selectedCount, 1)) * 100}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-emerald-900">
                    <span>{language === 'es' ? 'Difícil' : 'Hard'}</span>
                    <span>{difficultyCounts.HARD}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                    <div className="h-full bg-red-500" style={{ width: `${(difficultyCounts.HARD / Math.max(selectedCount, 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-indigo-700">
                  {language === 'es' ? 'Fuente activa' : 'Active source'}
                </p>
                <p className="mt-1 text-lg font-semibold text-indigo-950">
                  {sourcePositionId === 'all'
                    ? (language === 'es' ? 'Todos los cargos' : 'All roles')
                    : (JOB_POSITIONS.find(position => position.id === sourcePositionId)?.titleEn || JOB_POSITIONS.find(position => position.id === sourcePositionId)?.title || sourcePositionId)}
                </p>
                <p className="mt-1 text-sm text-indigo-800">
                  {language === 'es'
                    ? 'Puedes mezclar preguntas de distintos cargos, temas y niveles.'
                    : 'You can mix questions from different roles, topics, and difficulties.'}
                </p>
              </div>
            </div>

            <ScrollArea className="h-[600px] pr-2">
              <div className="space-y-4">
                {selectedQuestions.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-gray-500">
                    {language === 'es' ? 'No hay preguntas seleccionadas.' : 'No questions selected.'}
                  </div>
                ) : (
                  selectedQuestions.map((question, index) => (
                    <div
                      key={`${question.id}-${index}`}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={event => handleDragOver(event, index)}
                      onDrop={event => handleDrop(event, index)}
                      onDragEnd={handleDragEnd}
                      className={`group rounded-3xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                        replaceIndex === index
                          ? 'border-amber-300 bg-amber-50'
                          : draggedIndex === index
                            ? 'border-sky-300 bg-sky-50 opacity-80'
                            : dropIndex === index && draggedIndex !== null
                              ? 'border-sky-400 bg-sky-50 ring-2 ring-sky-200'
                              : 'border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1 space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow-sm">
                              {index + 1}
                            </div>
                            <div className="min-w-0 flex-1 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="bg-white">
                                  {question.jobPositionTitle}
                                </Badge>
                                <Badge variant="outline" className="bg-white">
                                  {question.category || question.categoryEn || 'Tema'}
                                </Badge>
                                <Badge className={
                                  question.difficulty === 'HARD'
                                    ? 'bg-red-100 text-red-700 border-red-200'
                                    : question.difficulty === 'MEDIUM'
                                      ? 'bg-amber-100 text-amber-700 border-amber-200'
                                      : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                }>
                                  {question.difficulty}
                                </Badge>
                              </div>
                              <p className="text-[15px] leading-7 text-slate-900 md:text-[16px]">
                                {question.questionText}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span>
                              {language === 'es' ? 'Arrastra para reordenar' : 'Drag to reorder'}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>
                              {language === 'es'
                                ? 'Haz clic en reemplazar para cambiar solo esta pregunta'
                                : 'Use replace to swap only this question'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 lg:w-40 lg:flex-col lg:items-stretch lg:justify-start">
                          <Button type="button" size="sm" variant="outline" onClick={() => startReplace(index)} className="justify-center">
                            <Shuffle className="w-3.5 h-3.5 mr-1" />
                            {language === 'es' ? 'Reemplazar' : 'Replace'}
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={() => handleRemoveQuestion(index)} className="justify-center">
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            {language === 'es' ? 'Quitar' : 'Remove'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {selectedQuestions.length !== QUESTION_TARGET && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <AlertCircle className="inline-block w-4 h-4 mr-2 align-text-bottom" />
                {language === 'es'
                  ? `Debes tener exactamente ${QUESTION_TARGET} preguntas antes de enviar.`
                  : `You need exactly ${QUESTION_TARGET} questions before sending.`}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={loadDefaultSet} disabled={loading}>
                {language === 'es' ? 'Volver al set base' : 'Restore base set'}
              </Button>
              <Button type="button" variant="outline" onClick={searchBank} disabled={loading}>
                {language === 'es' ? 'Actualizar banco' : 'Refresh bank'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
