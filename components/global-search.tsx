'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { 
  Search, 
  User, 
  FileText, 
  Target, 
  Flame, 
  Heart, 
  Dna, 
  Shield, 
  Activity,
  Clock,
  ArrowRight,
  X,
  Loader2,
  Sparkles,
  BarChart3,
  Command,
  BookOpen,
  Compass,
  CheckCircle2,
  Send,
  ExternalLink,
  FileCode
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface PersonResult {
  name: string;
  email: string;
  evaluations: string[];
  completedCount: number;
  pendingCount: number;
  latestDate: string | null;
}

interface EvaluationResult {
  id: string;
  token: string;
  type: string;
  typeKey: string;
  color: string;
  icon: string;
  recipientName: string;
  recipientEmail: string;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
  completedAt: string | null;
  summary: string;
}

interface SearchResults {
  people: PersonResult[];
  evaluations: EvaluationResult[];
}

interface QuickAction {
  labelKey: string;
  icon: typeof BarChart3;
  href: string;
  color: string;
}

const QUICK_ACTIONS_CONFIG: QuickAction[] = [
  { labelKey: 'search.action.analyticsPanel', icon: BarChart3, href: '/analytics', color: 'indigo' },
  { labelKey: 'search.action.evaluationsGuide', icon: BookOpen, href: '/evaluations-guide', color: 'violet' },
  { labelKey: 'search.action.sendDisc', icon: Target, href: '/external-evaluations', color: 'indigo' },
  { labelKey: 'search.action.sendDrivingForces', icon: Flame, href: '/external-driving-forces-evaluations', color: 'purple' },
  { labelKey: 'search.action.sendEQ', icon: Heart, href: '/external-eq-evaluations', color: 'pink' },
  { labelKey: 'search.action.sendDNA', icon: Dna, href: '/external-dna-evaluations', color: 'teal' },
  { labelKey: 'search.action.sendAcumen', icon: Compass, href: '/external-acumen-evaluations', color: 'amber' },
  { labelKey: 'search.action.sendValues', icon: Shield, href: '/external-values-evaluations', color: 'violet' },
  { labelKey: 'search.action.sendStress', icon: Activity, href: '/external-stress-evaluations', color: 'orange' },
  { labelKey: 'search.action.sendTechnical', icon: FileCode, href: '/external-technical-evaluations', color: 'sky' },
];

const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    Target, Flame, Heart, Dna, Shield, Activity, Compass, FileCode
  };
  return icons[iconName] || Target;
};

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    sky: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' },
  };
  return colors[color] || colors.indigo;
};

export default function GlobalSearch() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Translated quick actions
  const QUICK_ACTIONS = useMemo(() => {
    return QUICK_ACTIONS_CONFIG.map(action => ({
      ...action,
      label: t(action.labelKey)
    }));
  }, [t]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('reclu_recent_searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored).slice(0, 5));
    }
  }, []);

  // Save search to recent
  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('reclu_recent_searches', JSON.stringify(updated));
  };

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || null);
    } catch (error) {
      console.error('Search error:', error);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length >= 2) {
      setIsLoading(true);
      debounceRef.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    } else {
      setResults(null);
      setIsLoading(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, performSearch]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut to open search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Calculate all navigable items
  const getAllItems = () => {
    const items: { type: string; data: any }[] = [];
    
    if (results?.people) {
      results.people.forEach(p => items.push({ type: 'person', data: p }));
    }
    if (results?.evaluations) {
      results.evaluations.forEach(e => items.push({ type: 'evaluation', data: e }));
    }
    
    if (!results && query.length < 2) {
      QUICK_ACTIONS.forEach(a => items.push({ type: 'action', data: a }));
    }
    
    return items;
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const items = getAllItems();
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          handleItemSelect(items[selectedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setQuery('');
        inputRef.current?.blur();
        break;
    }
  };

  // Handle item selection
  const handleItemSelect = (item: { type: string; data: any }) => {
    if (item.type === 'person') {
      saveRecentSearch(item.data.name);
      // If person has completed evaluations, go to analytics; otherwise go to management
      if (item.data.completedCount > 0) {
        router.push(`/analytics?person=${encodeURIComponent(item.data.email)}`);
      } else {
        // Go to first evaluation type management page
        router.push('/external-evaluations');
      }
    } else if (item.type === 'evaluation') {
      saveRecentSearch(item.data.recipientName);
      
      if (item.data.status === 'COMPLETED') {
        // Go to results page
        const resultsRouteMap: Record<string, string> = {
          'disc': '/external-evaluation-results',
          'driving-forces': '/external-driving-forces-evaluation-results',
          'eq': '/external-eq-evaluation-results',
          'dna': '/external-dna-evaluation-results',
          'acumen': '/external-acumen-evaluation-results',
          'values': '/external-values-evaluation-results',
          'stress': '/external-stress-evaluation-results',
          'technical': '/external-technical-evaluation-results'
        };
        const basePath = resultsRouteMap[item.data.typeKey] || '/external-evaluation-results';
        router.push(`${basePath}/${item.data.token}`);
      } else {
        // Go to management page for pending evaluations
        const managementRouteMap: Record<string, string> = {
          'disc': '/external-evaluations',
          'driving-forces': '/external-driving-forces-evaluations',
          'eq': '/external-eq-evaluations',
          'dna': '/external-dna-evaluations',
          'acumen': '/external-acumen-evaluations',
          'values': '/external-values-evaluations',
          'stress': '/external-stress-evaluations',
          'technical': '/external-technical-evaluations'
        };
        const basePath = managementRouteMap[item.data.typeKey] || '/external-evaluations';
        router.push(basePath);
      }
    } else if (item.type === 'action') {
      router.push(item.data.href);
    }
    setIsOpen(false);
    setQuery('');
  };

  // Handle recent search click
  const handleRecentSearch = (term: string) => {
    setQuery(term);
    performSearch(term);
  };

  // Format date using UTC to avoid hydration mismatches
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = date.getUTCDate();
      const monthIndex = date.getUTCMonth();
      const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthsEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const months = language === 'en' ? monthsEn : monthsEs;
      return `${months[monthIndex]} ${day}`;
    } catch {
      return '';
    }
  };

  const hasResults = results && (results.people.length > 0 || results.evaluations.length > 0);
  const noResults = query.length >= 2 && !isLoading && results && !hasResults;
  let currentItemIndex = -1;

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl mx-2 sm:mx-4" data-tour="global-search">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('search.placeholder')}
          className="pl-9 pr-9 sm:pl-10 sm:pr-20 h-9 sm:h-10 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        {/* Keyboard shortcut hint - solo desktop */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden md:flex items-center gap-1 text-xs text-gray-400">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 font-mono">
            <Command className="w-3 h-3 inline" />
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 font-mono">K</kbd>
        </div>
        {/* Loading indicator */}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500 animate-spin md:right-20" />
        )}
        {/* Clear button */}
        {query && !isLoading && (
          <button
            onClick={() => {
              setQuery('');
              setResults(null);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full md:right-20"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
          
          {/* Loading State */}
          {isLoading && query.length >= 2 && (
            <div className="p-6 text-center">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">{t('search.searching')}</p>
            </div>
          )}

          {/* No Results */}
          {noResults && (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{t('search.noResults')} &quot;{query}&quot;</p>
              <p className="text-xs text-gray-400 mt-1">{t('search.tryAnother')}</p>
            </div>
          )}

          {/* Results */}
          {hasResults && !isLoading && (
            <>
              {/* People Section */}
              {results.people.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {t('search.people')} ({results.people.length})
                  </div>
                  {results.people.map((person, idx) => {
                    currentItemIndex++;
                    const isSelected = selectedIndex === currentItemIndex;
                    const itemIdx = currentItemIndex;
                    
                    return (
                      <button
                        key={person.email}
                        onClick={() => handleItemSelect({ type: 'person', data: person })}
                        className={`w-full px-3 py-3 flex items-center gap-3 rounded-lg transition-all ${
                          isSelected 
                            ? 'bg-indigo-50 dark:bg-indigo-900/30' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {person.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{person.name}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500 truncate">{person.email}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex gap-1">
                            {person.completedCount > 0 && (
                              <Badge className="bg-green-100 text-green-700 text-[10px] py-0 px-1.5 hover:bg-green-100">
                                <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                                {person.completedCount}
                              </Badge>
                            )}
                            {person.pendingCount > 0 && (
                              <Badge className="bg-yellow-100 text-yellow-700 text-[10px] py-0 px-1.5 hover:bg-yellow-100">
                                <Clock className="w-2.5 h-2.5 mr-0.5" />
                                {person.pendingCount}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-0.5 justify-end max-w-[140px]">
                            {person.evaluations.slice(0, 3).map((evalType) => (
                              <span 
                                key={evalType} 
                                className="text-[9px] text-gray-400"
                              >
                                {evalType === 'Fuerzas Motivadoras' ? 'FM' : 
                                 evalType === 'Inteligencia Emocional' ? 'EQ' :
                                 evalType === 'Estrés y Resiliencia' ? 'Str' :
                                 evalType}
                                {person.evaluations.indexOf(evalType) < Math.min(2, person.evaluations.length - 1) ? ',' : ''}
                              </span>
                            ))}
                            {person.evaluations.length > 3 && (
                              <span className="text-[9px] text-gray-400">+{person.evaluations.length - 3}</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Evaluations Section */}
              {results.evaluations.length > 0 && (
                <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    {t('search.evaluations')} ({results.evaluations.length})
                  </div>
                  {results.evaluations.map((evaluation, idx) => {
                    currentItemIndex++;
                    const isSelected = selectedIndex === currentItemIndex;
                    const IconComponent = getIconComponent(evaluation.icon);
                    const colorClasses = getColorClasses(evaluation.color);
                    const itemIdx = currentItemIndex;
                    const isPending = evaluation.status === 'PENDING';
                    
                    return (
                      <button
                        key={`${evaluation.type}-${evaluation.id}`}
                        onClick={() => handleItemSelect({ type: 'evaluation', data: evaluation })}
                        className={`w-full px-3 py-3 flex items-center gap-3 rounded-lg transition-all ${
                          isSelected 
                            ? 'bg-indigo-50 dark:bg-indigo-900/30' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg ${colorClasses.bg} flex items-center justify-center relative`}>
                          <IconComponent className={`w-5 h-5 ${colorClasses.text}`} />
                          {isPending && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-gray-900 dark:text-white truncate">{evaluation.recipientName}</p>
                            <Badge className={`${colorClasses.bg} ${colorClasses.text} text-[10px] py-0 flex-shrink-0`}>
                              {evaluation.type === 'Fuerzas Motivadoras' ? 'FM' : 
                               evaluation.type === 'Inteligencia Emocional' ? 'EQ' :
                               evaluation.type === 'Estrés y Resiliencia' ? 'Estrés' :
                               evaluation.type}
                            </Badge>
                            {isPending ? (
                              <Badge className="bg-yellow-100 text-yellow-700 text-[10px] py-0 flex-shrink-0">
                                <Clock className="w-2.5 h-2.5 mr-0.5" />
                                {t('search.pending')}
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-700 text-[10px] py-0 flex-shrink-0">
                                <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                                {t('search.completed')}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                            {!isPending && evaluation.summary && evaluation.summary !== 'Completada' && (
                              <span className="truncate">{evaluation.summary}</span>
                            )}
                            <span className="flex items-center gap-1 text-xs flex-shrink-0">
                              {isPending ? <Send className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {isPending ? formatDate(evaluation.createdAt) : formatDate(evaluation.completedAt)}
                            </span>
                          </div>
                        </div>
                        {isPending ? (
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* View all in analytics */}
              <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => {
                    if (query) saveRecentSearch(query);
                    router.push('/analytics');
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 flex items-center justify-center gap-2 text-sm text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  {t('search.viewAllAnalytics')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* Default State - Quick Actions & Recent Searches */}
          {!isLoading && query.length < 2 && (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {t('search.recentSearches')}
                  </div>
                  <div className="flex flex-wrap gap-2 px-3 pb-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentSearch(term)}
                        className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  {t('search.quickActions')}
                </div>
                {QUICK_ACTIONS.map((action, idx) => {
                  const isSelected = selectedIndex === idx;
                  const ActionIcon = action.icon;
                  const colorClasses = getColorClasses(action.color);
                  
                  return (
                    <button
                      key={action.labelKey}
                      onClick={() => handleItemSelect({ type: 'action', data: action })}
                      className={`w-full px-3 py-2.5 flex items-center gap-3 rounded-lg transition-all ${
                        isSelected 
                          ? 'bg-indigo-50 dark:bg-indigo-900/30' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
                        <ActionIcon className={`w-4 h-4 ${colorClasses.text}`} />
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </button>
                  );
                })}
              </div>

              {/* Tip - solo en desktop */}
              <div className="hidden sm:block px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-[10px] font-mono shadow-sm">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-[10px] font-mono shadow-sm">↓</kbd>
                  </span>
                  {t('search.navigate')}
                  <span className="mx-1">•</span>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-[10px] font-mono shadow-sm">Enter</kbd>
                  {t('search.select')}
                  <span className="mx-1">•</span>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-[10px] font-mono shadow-sm">Esc</kbd>
                  {t('search.close')}
                </p>
              </div>
              {/* Cerrar en mobile */}
              <div className="sm:hidden px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-t border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-xs text-indigo-600 font-medium py-1"
                >
                  {t('search.closeSearch')}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
