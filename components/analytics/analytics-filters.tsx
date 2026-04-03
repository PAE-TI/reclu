'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Filter, RotateCcw, Brain, Target, Sparkles, CalendarRange, X } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface AnalyticsFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  discCount: number;
  dfCount: number;
  hasIntegrated: boolean;
}

export interface FilterState {
  timeRange: string;
  customDateStart: string | null;
  customDateEnd: string | null;
  evaluationType: string;
  assessmentType: 'all' | 'disc' | 'driving-forces' | 'integrated';
  sortBy: string;
  showTrends: boolean;
}

export default function AnalyticsFilters({ 
  onFiltersChange, 
  discCount, 
  dfCount,
  hasIntegrated 
}: AnalyticsFiltersProps) {
  const { t, language } = useLanguage();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    timeRange: 'all',
    customDateStart: null,
    customDateEnd: null,
    evaluationType: 'all',
    assessmentType: 'all',
    sortBy: 'date-desc',
    showTrends: true
  });

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    // If changing timeRange to a preset, clear custom dates
    if (key === 'timeRange' && value !== 'custom') {
      setFilters(prev => ({ ...prev, [key]: value, customDateStart: null, customDateEnd: null }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleCustomDateChange = (startDate: string | null, endDate: string | null) => {
    setFilters(prev => ({
      ...prev,
      timeRange: 'custom',
      customDateStart: startDate,
      customDateEnd: endDate
    }));
  };

  const clearCustomDates = () => {
    setFilters(prev => ({
      ...prev,
      timeRange: 'all',
      customDateStart: null,
      customDateEnd: null
    }));
    setIsDatePickerOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      timeRange: 'all',
      customDateStart: null,
      customDateEnd: null,
      evaluationType: 'all',
      assessmentType: 'all',
      sortBy: 'date-desc',
      showTrends: true
    });
    setIsDatePickerOpen(false);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== 'all' && value !== 'date-desc' && value !== true && value !== null
  ).length;

  // Format date for display
  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
      <CardContent className="p-6">
        {/* Tabs de Tipo de Evaluación */}
        <div className="mb-6">
          <Tabs 
            value={filters.assessmentType} 
            onValueChange={(value) => handleFilterChange('assessmentType', value)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="all" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Todo</span>
                <Badge variant="secondary" className="ml-1 bg-gray-200">
                  {discCount + dfCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="disc" className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">DISC</span>
                <Badge variant="secondary" className="ml-1">
                  {discCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="driving-forces" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">FM</span>
                <Badge variant="secondary" className="ml-1">
                  {dfCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="integrated" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-100 data-[state=active]:to-purple-100"
                disabled={!hasIntegrated}
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Integrado</span>
                {hasIntegrated && (
                  <Badge className="ml-1 bg-green-100 text-green-700">✓</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filtros Adicionales */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Filtros Adicionales</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {activeFiltersCount} activo{activeFiltersCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-gray-600 hover:text-gray-900"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Rango de Tiempo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t('analytics.filters.timeRange')}
            </label>
            <div className="flex gap-2">
              <Select
                value={filters.timeRange === 'custom' ? 'custom' : filters.timeRange}
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setIsDatePickerOpen(true);
                  } else {
                    handleFilterChange('timeRange', value);
                  }
                }}
              >
                <SelectTrigger className="flex-1">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={t('analytics.filters.selectPeriod')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('analytics.filters.allTime')}</SelectItem>
                  <SelectItem value="last-month">{t('analytics.filters.lastMonth')}</SelectItem>
                  <SelectItem value="last-3-months">{t('analytics.filters.last3Months')}</SelectItem>
                  <SelectItem value="last-6-months">{t('analytics.filters.last6Months')}</SelectItem>
                  <SelectItem value="last-year">{t('analytics.filters.lastYear')}</SelectItem>
                  <SelectItem value="custom">{t('analytics.filters.custom')}</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Custom Date Range Picker */}
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant={filters.timeRange === 'custom' ? 'default' : 'outline'} 
                    size="icon"
                    className={filters.timeRange === 'custom' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  >
                    <CalendarRange className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-gray-900">{t('analytics.filters.customRange')}</h4>
                      {(filters.customDateStart || filters.customDateEnd) && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearCustomDates}
                          className="h-6 px-2 text-xs text-gray-500 hover:text-red-600"
                        >
                          <X className="w-3 h-3 mr-1" />
                          {t('analytics.filters.clear')}
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600">{t('analytics.filters.startDate')}</label>
                        <Input
                          type="date"
                          value={filters.customDateStart || ''}
                          onChange={(e) => handleCustomDateChange(e.target.value || null, filters.customDateEnd)}
                          max={filters.customDateEnd || undefined}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600">{t('analytics.filters.endDate')}</label>
                        <Input
                          type="date"
                          value={filters.customDateEnd || ''}
                          onChange={(e) => handleCustomDateChange(filters.customDateStart, e.target.value || null)}
                          min={filters.customDateStart || undefined}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    
                    {filters.customDateStart && filters.customDateEnd && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          {t('analytics.filters.showing')}: {formatDateDisplay(filters.customDateStart)} - {formatDateDisplay(filters.customDateEnd)}
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => setIsDatePickerOpen(false)}
                      disabled={!filters.customDateStart || !filters.customDateEnd}
                    >
                      {t('analytics.filters.apply')}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Show custom date range badge */}
            {filters.timeRange === 'custom' && filters.customDateStart && filters.customDateEnd && (
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-700">
                  {formatDateDisplay(filters.customDateStart)} → {formatDateDisplay(filters.customDateEnd)}
                </Badge>
              </div>
            )}
          </div>

          {/* Origen de Evaluación */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Origen</label>
            <Select
              value={filters.evaluationType}
              onValueChange={(value) => handleFilterChange('evaluationType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los orígenes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las evaluaciones</SelectItem>
                <SelectItem value="internal">Mis evaluaciones personales</SelectItem>
                <SelectItem value="external">Evaluaciones enviadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ordenar por */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ordenar por</label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Más reciente</SelectItem>
                <SelectItem value="date-asc">Más antiguo</SelectItem>
                {filters.assessmentType !== 'driving-forces' && (
                  <>
                    <SelectItem value="score-d-desc">Mayor Dominante</SelectItem>
                    <SelectItem value="score-i-desc">Mayor Influyente</SelectItem>
                    <SelectItem value="score-s-desc">Mayor Estable</SelectItem>
                    <SelectItem value="score-c-desc">Mayor Concienzudo</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Mostrar Tendencias */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Análisis</label>
            <div className="flex flex-col gap-2">
              <Button
                variant={filters.showTrends ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('showTrends', !filters.showTrends)}
                className="justify-start"
              >
                {filters.showTrends ? '✓' : '○'} Mostrar Tendencias
              </Button>
            </div>
          </div>
        </div>

        {/* Resumen de datos */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {filters.assessmentType === 'disc' && `Mostrando ${discCount} evaluación(es) DISC`}
              {filters.assessmentType === 'driving-forces' && `Mostrando ${dfCount} evaluación(es) de Fuerzas Motivadoras`}
              {filters.assessmentType === 'integrated' && 'Mostrando análisis integrado DISC + Fuerzas Motivadoras'}
              {filters.assessmentType === 'all' && `Mostrando ${discCount + dfCount} evaluación(es) total(es)`}
            </span>
            <div className="flex items-center gap-2">
              {filters.timeRange !== 'all' && (
                <Badge variant="outline" className="text-xs">
                  {filters.timeRange === 'last-month' && 'Último mes'}
                  {filters.timeRange === 'last-3-months' && 'Últimos 3 meses'}
                  {filters.timeRange === 'last-6-months' && 'Últimos 6 meses'}
                  {filters.timeRange === 'last-year' && 'Último año'}
                </Badge>
              )}
              {filters.evaluationType !== 'all' && (
                <Badge variant="outline" className="text-xs">
                  {filters.evaluationType === 'internal' && 'Personales'}
                  {filters.evaluationType === 'external' && 'Enviadas'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
