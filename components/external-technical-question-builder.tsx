'use client';

import { useEffect, useMemo, useState, type DragEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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

interface TechnicalQuestionTemplateSummary {
  id: string;
  name: string;
  description: string | null;
  basePositionId: string;
  basePositionTitle: string;
  questionSetConfig: QuestionSetConfig;
  questionCount: number;
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
  template: TechnicalQuestionTemplateSummary | null;
  onSaveTemplate: () => void;
  onChange: (payload: BuilderChangePayload) => void;
}

const QUESTION_TARGET = 20;

export function ExternalTechnicalQuestionBuilder({
  basePositionId,
  language,
  template,
  onSaveTemplate,
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
  const [categorySearchOpen, setCategorySearchOpen] = useState(false);
  const [roleSearchOpen, setRoleSearchOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');

  const basePosition = useMemo(
    () => JOB_POSITIONS.find(position => position.id === basePositionId),
    [basePositionId]
  );

  const baseTitle = language === 'es'
    ? basePosition?.title || 'Cargo base'
    : basePosition?.titleEn || basePosition?.title || 'Base position';

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }, [categories]);

  const filteredRoles = useMemo(() => {
    const term = roleSearch.trim().toLowerCase();
    return [...JOB_POSITIONS]
      .sort((a, b) => {
        const aLabel = language === 'es' ? a.title : a.titleEn || a.title;
        const bLabel = language === 'es' ? b.title : b.titleEn || b.title;
        return aLabel.localeCompare(bLabel, language === 'es' ? 'es' : 'en', { sensitivity: 'base' });
      })
      .filter(position => {
        if (!term) return true;
        const label = `${position.title} ${position.titleEn || ''} ${position.subcategory} ${position.synonyms.join(' ')} ${position.keywords.join(' ')}`.toLowerCase();
        return label.includes(term);
      });
  }, [language, roleSearch]);

  const filteredCategoryItems = useMemo(() => {
    const term = categorySearch.trim().toLowerCase();
    return sortedCategories.filter(item => {
      if (!term) return true;
      return item.name.toLowerCase().includes(term);
    });
  }, [categorySearch, sortedCategories]);

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
      setSearch('');
      setCategory('all');
      setDifficulty('all');
      setSourcePositionId('all');
      const data = await fetchBank({ positionId: basePositionId });
      const defaults = (data.questions || []).slice(0, QUESTION_TARGET);
      setSelectedQuestions(defaults);
      setAvailableQuestions(data.questions || []);
      setCategories(data.categories || []);
      setReplaceIndex(null);
      setDraggedIndex(null);
      setDropIndex(null);
    } catch (error) {
      console.error(error);
      toast.error(language === 'es' ? 'No se pudo cargar el set base' : 'Could not load the base set');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplateSet = async (selectedTemplate: TechnicalQuestionTemplateSummary) => {
    setLoading(true);
    try {
      const config = selectedTemplate.questionSetConfig;
      const selectedResponse = await fetchBank({
        questionIds: config.questionIds.join(','),
      });
      const bankResponse = await fetchBank({
        positionId: config.sourcePositionId === 'all' ? '' : config.sourcePositionId,
        search: config.filters.search,
        category: config.filters.category === 'all' ? '' : config.filters.category,
        difficulty: config.filters.difficulty,
      });

      const orderedSelectedQuestions = (selectedResponse.questions || []).sort((a: QuestionBankQuestion, b: QuestionBankQuestion) =>
        config.questionIds.indexOf(a.id) - config.questionIds.indexOf(b.id)
      );

      setSearch(config.filters.search || '');
      setCategory(config.filters.category || 'all');
      setDifficulty(config.filters.difficulty || 'all');
      setSourcePositionId(config.sourcePositionId || 'all');
      setSelectedQuestions(orderedSelectedQuestions.slice(0, QUESTION_TARGET));
      setAvailableQuestions(bankResponse.questions || orderedSelectedQuestions);
      setCategories(bankResponse.categories || []);
      setReplaceIndex(null);
      setDraggedIndex(null);
      setDropIndex(null);
    } catch (error) {
      console.error(error);
      toast.error(language === 'es' ? 'No se pudo cargar la plantilla' : 'Could not load the template');
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
    loadCategories();

    if (template) {
      loadTemplateSet(template);
      return;
    }

    loadDefaultSet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePositionId, template?.id]);

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
        toast.error(
          language === 'es'
            ? 'El set ya está completo. Reemplaza o quita una pregunta para agregar otra.'
            : 'The set is already full. Replace or remove a question before adding another.'
        );
        return prev;
      }

      return [...prev, question];
    });
  };

  const handleRemoveQuestion = (index: number) => {
    setSelectedQuestions(prev => {
      const next = prev.filter((_, itemIndex) => itemIndex !== index);
      if (replaceIndex === null) return next;

      setReplaceIndex(currentReplaceIndex => {
        if (currentReplaceIndex === null) return null;
        if (currentReplaceIndex === index) return null;
        if (currentReplaceIndex > index) return currentReplaceIndex - 1;
        return currentReplaceIndex;
      });

      return next;
    });
  };

  const startReplace = (index: number) => {
    setReplaceIndex(prev => {
      if (prev === index) {
        toast.success(language === 'es' ? 'Modo reemplazo desactivado' : 'Replace mode turned off');
        return null;
      }

      toast.success(language === 'es' ? 'Selecciona una pregunta del banco para reemplazarla' : 'Select a bank question to replace it');
      return index;
    });
  };

  const clearSelection = () => {
    setSelectedQuestions([]);
    setReplaceIndex(null);
    setDraggedIndex(null);
    setDropIndex(null);
  };

  const canAddMoreQuestions = selectedQuestions.length < QUESTION_TARGET;
  const isReplacing = replaceIndex !== null;

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setSelectedQuestions(prev => {
      if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);

      if (replaceIndex !== null) {
        setReplaceIndex(currentReplaceIndex => {
          if (currentReplaceIndex === null) return null;
          if (currentReplaceIndex === fromIndex) return toIndex;
          if (fromIndex < currentReplaceIndex && currentReplaceIndex <= toIndex) return currentReplaceIndex - 1;
          if (toIndex <= currentReplaceIndex && currentReplaceIndex < fromIndex) return currentReplaceIndex + 1;
          return currentReplaceIndex;
        });
      }

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

  const getBankCardState = (question: QuestionBankQuestion) => {
    const isSelected = selectedQuestions.some(item => item.id === question.id);
    const isSelectedReplacementTarget = replaceIndex !== null && selectedQuestions[replaceIndex]?.id === question.id;

    if (isSelectedReplacementTarget) return 'target';
    if (isSelected) return 'selected';
    if (isReplacing) return 'replace';
    if (!canAddMoreQuestions) return 'locked';
    return 'ready';
  };

  const selectedCount = selectedQuestions.length;
  const isSetComplete = selectedCount === QUESTION_TARGET;
  const isReplaceModeActive = replaceIndex !== null;
  const bankMode = isReplacing ? 'replace' : isSetComplete ? 'full' : 'ready';
  const replacementQuestion = replaceIndex !== null ? selectedQuestions[replaceIndex] : null;
  const difficultyCounts = useMemo(() => {
    return selectedQuestions.reduce(
      (acc, question) => {
        acc[question.difficulty] += 1;
        return acc;
      },
      { EASY: 0, MEDIUM: 0, HARD: 0 }
    );
  }, [selectedQuestions]);

  const bankDifficultyCounts = useMemo(() => {
    return availableQuestions.reduce(
      (acc, question) => {
        acc[question.difficulty] += 1;
        return acc;
      },
      { EASY: 0, MEDIUM: 0, HARD: 0 }
    );
  }, [availableQuestions]);

  const handleDifficultyChipClick = async (value: Difficulty) => {
    const nextDifficulty = difficulty === value ? 'all' : value;
    setDifficulty(nextDifficulty);
    setLoading(true);
    try {
      const data = await fetchBank({
        positionId: sourcePositionId === 'all' ? '' : sourcePositionId,
        search,
        category: category === 'all' ? '' : category,
        difficulty: nextDifficulty,
      });
      setAvailableQuestions(data.questions || []);
    } catch (error) {
      console.error(error);
      toast.error(language === 'es' ? 'Error al filtrar preguntas' : 'Error filtering questions');
    } finally {
      setLoading(false);
    }
  };

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
              ? 'Busca, filtra y reemplaza preguntas para construir un set técnico más preciso antes de enviar.'
              : 'Search, filter, and replace questions to build a more precise technical set before sending.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
            <div className="rounded-3xl border border-sky-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
                    {language === 'es' ? 'Buscar preguntas' : 'Search questions'}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {language === 'es'
                      ? 'Filtra por texto, tema, cargo origen y nivel para encontrar la pregunta exacta.'
                      : 'Filter by text, theme, source role, and difficulty to find the exact question.'}
                  </p>
                </div>
                <Badge className="bg-sky-100 text-sky-700 border-sky-200">
                  {language === 'es' ? 'Banco activo' : 'Active bank'}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-2 md:col-span-2 xl:col-span-2">
                  <Label>{language === 'es' ? 'Buscar preguntas' : 'Search questions'}</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder={language === 'es' ? 'zoho, api, RAG, ventas...' : 'zoho, api, RAG, sales...'}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{language === 'es' ? 'Tema' : 'Theme'}</Label>
                  <Popover open={categorySearchOpen} onOpenChange={open => {
                    setCategorySearchOpen(open);
                    if (!open) setCategorySearch('');
                  }}>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="w-full justify-between bg-white font-normal">
                        <span className="truncate">
                          {category === 'all'
                            ? (language === 'es' ? 'Todos' : 'All')
                            : category}
                        </span>
                        <Search className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder={language === 'es' ? 'Buscar tema...' : 'Search theme...'}
                          value={categorySearch}
                          onValueChange={setCategorySearch}
                        />
                        <CommandList>
                          <CommandEmpty>{language === 'es' ? 'Sin resultados' : 'No results'}</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="all"
                              onSelect={() => {
                                setCategory('all');
                                setCategorySearchOpen(false);
                              }}
                            >
                              {language === 'es' ? 'Todos' : 'All'}
                            </CommandItem>
                            {filteredCategoryItems.map(item => (
                              <CommandItem
                                key={item.name}
                                value={item.name}
                                onSelect={() => {
                                  setCategory(item.name);
                                  setCategorySearchOpen(false);
                                }}
                              >
                                <span className="flex-1 truncate">{item.name}</span>
                                <span className="ml-2 text-xs text-muted-foreground">({item.count})</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>{language === 'es' ? 'Cargo origen' : 'Source role'}</Label>
                  <Popover open={roleSearchOpen} onOpenChange={open => {
                    setRoleSearchOpen(open);
                    if (!open) setRoleSearch('');
                  }}>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="w-full justify-between bg-white font-normal">
                        <span className="truncate">
                          {sourcePositionId === 'all'
                            ? (language === 'es' ? 'Todos los cargos' : 'All roles')
                            : (JOB_POSITIONS.find(position => position.id === sourcePositionId)?.titleEn || JOB_POSITIONS.find(position => position.id === sourcePositionId)?.title || sourcePositionId)}
                        </span>
                        <Search className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[340px] p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder={language === 'es' ? 'Buscar cargo...' : 'Search role...'}
                          value={roleSearch}
                          onValueChange={setRoleSearch}
                        />
                        <CommandList>
                          <CommandEmpty>{language === 'es' ? 'Sin resultados' : 'No results'}</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="all"
                              onSelect={() => {
                                setSourcePositionId('all');
                                setRoleSearchOpen(false);
                              }}
                            >
                              {language === 'es' ? 'Todos los cargos' : 'All roles'}
                            </CommandItem>
                            {filteredRoles.map(position => (
                              <CommandItem
                                key={position.id}
                                value={`${position.title} ${position.titleEn || ''} ${position.subcategory}`}
                                onSelect={() => {
                                  setSourcePositionId(position.id);
                                  setRoleSearchOpen(false);
                                }}
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="truncate font-medium">
                                    {language === 'es' ? position.title : position.titleEn || position.title}
                                  </p>
                                  <p className="truncate text-xs text-muted-foreground">{position.subcategory}</p>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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

              <div className="mt-5 flex flex-wrap gap-2">
                <Button type="button" onClick={searchBank} disabled={loading} className="bg-sky-600 hover:bg-sky-700">
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                  {language === 'es' ? 'Buscar en banco' : 'Search bank'}
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                {language === 'es' ? 'Acciones rápidas' : 'Quick actions'}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {language === 'es'
                  ? 'Vuelve al set original o limpia por completo la selección actual.'
                  : 'Go back to the original set or clear the current selection completely.'}
              </p>
              <div className="mt-4 space-y-3">
                <Button type="button" variant="outline" onClick={loadDefaultSet} disabled={loading} className="w-full justify-start bg-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {language === 'es' ? `Recargar base: ${baseTitle}` : `Reload base: ${baseTitle}`}
                </Button>
                <Button type="button" variant="outline" onClick={clearSelection} disabled={loading} className="w-full justify-start bg-white">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Vaciar selección' : 'Clear selection'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
        <Card className="self-stretch flex flex-col border-slate-200 shadow-sm max-h-[1140px] lg:max-h-[calc(100vh-10rem)]">
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
            <div
              className={`mt-3 rounded-2xl border px-4 py-3 text-sm shadow-sm ${
                bankMode === 'replace'
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-800'
                  : bankMode === 'full'
                    ? 'border-amber-200 bg-amber-50 text-amber-800'
                    : 'border-sky-200 bg-sky-50 text-sky-800'
              }`}
            >
              <div className="flex items-start gap-3">
                {bankMode === 'replace' ? (
                  <Shuffle className="mt-0.5 h-4 w-4 shrink-0" />
                ) : bankMode === 'full' ? (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 rotate-45" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {bankMode === 'replace'
                      ? (language === 'es' ? 'Modo reemplazo activo' : 'Replace mode active')
                      : bankMode === 'full'
                        ? (language === 'es' ? 'El set está completo' : 'The set is full')
                        : (language === 'es' ? 'Banco listo para agregar' : 'Bank ready to add')}
                  </p>
                  <p className="mt-1 text-sm opacity-90">
                    {bankMode === 'replace'
                      ? (language === 'es'
                          ? 'Selecciona una pregunta del banco para sustituir la actual. Las flechas están habilitadas.'
                          : 'Pick a bank question to swap in. The arrows are enabled.')
                      : bankMode === 'full'
                        ? (language === 'es'
                            ? 'Usa Reemplazar o Vaciar selección para agregar otra pregunta.'
                            : 'Use Replace or Clear selection to add another question.')
                        : (language === 'es'
                            ? 'Selecciona preguntas del banco para completar el set técnico.'
                            : 'Select bank questions to complete the technical set.')}
                  </p>
                  {bankMode === 'replace' && replacementQuestion && (
                    <div className="mt-2 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1 text-xs font-medium text-indigo-800">
                      <span>
                        {language === 'es' ? 'Reemplazando' : 'Replacing'} #{replaceIndex + 1}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-indigo-400" />
                      <span className="max-w-[460px] truncate">
                        {replacementQuestion.questionText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                type="button"
                variant={difficulty === 'EASY' ? 'default' : 'outline'}
                onClick={() => handleDifficultyChipClick('EASY')}
                className={`h-9 rounded-full px-4 text-sm ${
                  difficulty === 'EASY'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                {language === 'es' ? 'Fácil' : 'Easy'}
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                  {bankDifficultyCounts.EASY}
                </span>
              </Button>
              <Button
                type="button"
                variant={difficulty === 'MEDIUM' ? 'default' : 'outline'}
                onClick={() => handleDifficultyChipClick('MEDIUM')}
                className={`h-9 rounded-full px-4 text-sm ${
                  difficulty === 'MEDIUM'
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
                }`}
              >
                {language === 'es' ? 'Media' : 'Medium'}
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                  {bankDifficultyCounts.MEDIUM}
                </span>
              </Button>
              <Button
                type="button"
                variant={difficulty === 'HARD' ? 'default' : 'outline'}
                onClick={() => handleDifficultyChipClick('HARD')}
                className={`h-9 rounded-full px-4 text-sm ${
                  difficulty === 'HARD'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-white text-red-700 border-red-200 hover:bg-red-50'
                }`}
              >
                {language === 'es' ? 'Difícil' : 'Hard'}
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                  {bankDifficultyCounts.HARD}
                </span>
              </Button>
              {difficulty !== 'all' && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleDifficultyChipClick(difficulty)}
                  className="h-9 rounded-full px-4 text-sm text-slate-600 hover:bg-slate-100"
                >
                  {language === 'es' ? 'Quitar filtro' : 'Clear filter'}
                </Button>
              )}
              {isReplaceModeActive && (
                <>
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-3 py-2">
                    {language === 'es' ? `Reemplazando pregunta #${replaceIndex + 1}` : `Replacing question #${replaceIndex + 1}`}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setReplaceIndex(null)}
                    className="h-9 rounded-full px-4 text-sm text-indigo-700 hover:bg-indigo-50"
                  >
                    {language === 'es' ? 'Cancelar reemplazo' : 'Cancel replace'}
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col">
            <ScrollArea className="min-h-0 flex-1 pr-3">
              <div className="space-y-4 pb-4">
                {availableQuestions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-gray-500">
                    {language === 'es'
                      ? 'No hay preguntas cargadas todavía. Usa "Buscar en banco" o recarga el set base.'
                      : 'No questions loaded yet. Use "Search bank" or reload the base set.'}
                  </div>
                ) : (
                  availableQuestions.map(question => {
                    const cardState = getBankCardState(question);
                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => {
                          if (cardState === 'locked') {
                            toast.error(
                              language === 'es'
                                ? 'El set ya está completo. Reemplaza o quita una pregunta para agregar otra.'
                                : 'The set is already full. Replace or remove a question before adding another.'
                            );
                            return;
                          }
                          handlePickQuestion(question);
                        }}
                        className={`w-full rounded-2xl border p-4 text-left transition-all ${
                          cardState === 'target'
                            ? 'border-amber-300 bg-amber-50 ring-2 ring-amber-200'
                            : cardState === 'selected'
                            ? 'border-emerald-200 bg-emerald-50'
                            : cardState === 'replace'
                              ? 'border-amber-200 hover:border-amber-300 hover:bg-amber-50'
                              : cardState === 'locked'
                                ? 'border-slate-200 bg-slate-50/60 hover:border-amber-200 hover:bg-amber-50'
                                : 'border-slate-200 hover:border-sky-200 hover:bg-sky-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
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
                            <p className="text-[15px] leading-6 font-medium text-slate-900">
                              {question.questionText}
                            </p>
                            <p className="text-xs text-slate-500">
                              #{question.questionNumber} {language === 'es' ? 'del cargo' : 'for the role'}
                            </p>
                          </div>
                          <div className="flex-shrink-0 pt-1">
                            {cardState === 'target' ? (
                              <Shuffle className="w-4 h-4 text-amber-600" />
                            ) : cardState === 'selected' ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : cardState === 'replace' ? (
                              <ArrowRight className="w-4 h-4 text-amber-600" />
                            ) : cardState === 'locked' ? (
                              <AlertCircle className="w-4 h-4 text-amber-600" />
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

        <Card className="overflow-hidden self-stretch flex flex-col border-slate-200 shadow-sm max-h-[1140px] lg:max-h-[calc(100vh-10rem)]">
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
          <CardContent className="flex min-h-0 flex-1 flex-col space-y-4">
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

            <ScrollArea className="min-h-0 flex-1 pr-2">
              <div className="space-y-4 pb-4">
                {selectedQuestions.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-gray-500">
                    {language === 'es' ? 'No hay preguntas seleccionadas.' : 'No questions selected.'}
                  </div>
                ) : (
                  selectedQuestions.map((question, index) => {
                    const isMarkedForReplacement = replaceIndex === index;

                    return (
                      <div
                        key={`${question.id}-${index}`}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={event => handleDragOver(event, index)}
                        onDrop={event => handleDrop(event, index)}
                        onDragEnd={handleDragEnd}
                        className={`group rounded-3xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                          isMarkedForReplacement
                            ? 'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200'
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
                              <div
                                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-semibold text-white shadow-sm ${
                                  isMarkedForReplacement ? 'bg-indigo-600' : 'bg-slate-900'
                                }`}
                              >
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
                                  <Badge
                                    className={
                                      question.difficulty === 'HARD'
                                        ? 'bg-red-100 text-red-700 border-red-200'
                                        : question.difficulty === 'MEDIUM'
                                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                                          : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                    }
                                  >
                                    {question.difficulty}
                                  </Badge>
                                </div>
                                <p className="text-[15px] leading-7 text-slate-900 md:text-[16px]">
                                  {question.questionText}
                                </p>
                                {isMarkedForReplacement && (
                                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700">
                                    <Shuffle className="h-3.5 w-3.5" />
                                    {language === 'es'
                                      ? 'Pregunta marcada para reemplazo'
                                      : 'Question marked for replacement'}
                                  </div>
                                )}
                              </div>
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
                    );
                  })
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

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3">
              <div className="text-sm text-sky-800">
                {language === 'es'
                  ? 'Puedes guardar el set actual como plantilla para reutilizarlo después.'
                  : 'You can save the current set as a template to reuse later.'}
              </div>
              <Button
                type="button"
                variant="outline"
                className="bg-white"
                onClick={onSaveTemplate}
                disabled={!selectedQuestions.length || selectedQuestions.length !== QUESTION_TARGET}
              >
                <FileText className="w-4 h-4 mr-2" />
                {language === 'es' ? 'Guardar plantilla' : 'Save template'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
