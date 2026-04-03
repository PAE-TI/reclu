'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Target,
  Briefcase,
  Search,
  Loader2,
  CheckCircle,
  X,
  Brain,
  Zap,
  Heart,
  Dna,
  Sparkles,
  Scale,
  Activity,
  Coins,
  Lock,
  Globe,
  Users,
  UserPlus,
  ChevronRight,
  Info,
  Rocket,
  FileCode,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

interface JobPosition {
  id: string;
  title: string;
  titleEn?: string;
  category: string;
  categoryName: string;
  subcategory: string;
  synonyms: string[];
}

const getEvaluationTypes = (t: (key: string) => string, language: string) => [
  { id: 'DISC', name: 'DISC', description: t('batchEval.disc.desc'), icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { id: 'DRIVING_FORCES', name: t('batchEval.drivingForces.name'), description: t('batchEval.drivingForces.desc'), icon: Zap, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'EQ', name: t('batchEval.eq.name'), description: t('batchEval.eq.desc'), icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100' },
  { id: 'DNA', name: 'DNA-25', description: t('batchEval.dna.desc'), icon: Dna, color: 'text-teal-600', bg: 'bg-teal-100' },
  { id: 'ACUMEN', name: 'Acumen', description: t('batchEval.acumen.desc'), icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'VALUES', name: t('batchEval.values.name'), description: t('batchEval.values.desc'), icon: Scale, color: 'text-violet-600', bg: 'bg-violet-100' },
  { id: 'STRESS', name: t('batchEval.stress.name'), description: t('batchEval.stress.desc'), icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 'TECHNICAL', name: language === 'es' ? 'Técnica' : 'Technical', description: language === 'es' ? 'Prueba técnica específica por cargo' : 'Position-specific technical test', icon: FileCode, color: 'text-sky-600', bg: 'bg-sky-100', isNew: true },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<JobPosition[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [creditsPerEvaluation, setCreditsPerEvaluation] = useState(2); // Default
  const searchRef = useRef<HTMLDivElement>(null);
  
  const evaluationTypes = getEvaluationTypes(t, language);

  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    jobCategory: '',
    description: '',
    evaluationTypes: ['DISC', 'DRIVING_FORCES', 'EQ'] as string[],
    isPrivate: true,
    allowTeamAddCandidates: false,
  });

  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(null);

  // Obtener configuración de créditos
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/campaigns/settings');
        if (response.ok) {
          const data = await response.json();
          setCreditsPerEvaluation(data.creditsPerEvaluation);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar cargos
  useEffect(() => {
    const searchPositions = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setSearching(true);
      try {
        const response = await fetch(`/api/campaigns/job-positions?q=${encodeURIComponent(searchQuery)}&limit=15`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.positions);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error('Error searching positions:', error);
      } finally {
        setSearching(false);
      }
    };

    const debounce = setTimeout(searchPositions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelectPosition = (position: JobPosition) => {
    setSelectedPosition(position);
    setFormData(prev => ({
      ...prev,
      jobTitle: position.title,
      jobCategory: position.id,
    }));
    setSearchQuery(position.title);
    setShowDropdown(false);
  };

  const handleClearPosition = () => {
    setSelectedPosition(null);
    setSearchQuery('');
    setFormData(prev => ({
      ...prev,
      jobTitle: '',
      jobCategory: '',
    }));
  };

  const handleEvaluationTypeToggle = (evalType: string) => {
    setFormData(prev => {
      const types = prev.evaluationTypes.includes(evalType)
        ? prev.evaluationTypes.filter(t => t !== evalType)
        : [...prev.evaluationTypes, evalType];
      return { ...prev, evaluationTypes: types };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t('campaigns.new.nameRequired'));
      return;
    }

    if (!formData.jobTitle.trim()) {
      toast.error(t('campaigns.new.jobRequired'));
      return;
    }

    if (formData.evaluationTypes.length === 0) {
      toast.error(t('campaigns.new.evalRequired'));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(t('campaigns.new.success'));
        router.push(`/campaigns/${data.campaign.id}`);
      } else {
        const error = await response.json();
        toast.error(error.error || t('campaigns.new.error'));
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error(t('campaigns.new.error'));
    } finally {
      setLoading(false);
    }
  };

  const totalCredits = formData.evaluationTypes.length * creditsPerEvaluation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header compacto estilo dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => router.back()} 
              className="w-10 h-10 rounded-xl border-gray-200 hover:bg-gray-50 flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {t('campaigns.new.title')}
                </h1>
              </div>
              <p className="text-gray-500 text-sm">
                {t('campaigns.new.subtitle')}
              </p>
            </div>
          </div>
          <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 self-start sm:self-center">
            <Rocket className="w-3 h-3 mr-1" />
            {t('campaigns.new.fullBattery')}
          </Badge>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-100 rounded-xl">
                <Target className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{t('campaigns.new.infoTitle')}</CardTitle>
                <CardDescription>{t('campaigns.new.infoDesc')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                {t('campaigns.new.campaignName')} <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder={t('campaigns.new.campaignNamePlaceholder')}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-2 h-11 bg-white border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>

            <div ref={searchRef} className="relative">
              <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
                {t('campaigns.new.jobTitle')} <span className="text-rose-500">*</span>
              </Label>
              <div className="relative mt-2">
                {selectedPosition ? (
                  <div className="flex items-center gap-3 p-4 border-2 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
                    <div className="p-2.5 bg-cyan-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{selectedPosition.title}</p>
                      <p className="text-sm text-cyan-700">{selectedPosition.categoryName} • {selectedPosition.subcategory}</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={handleClearPosition} className="hover:bg-cyan-100">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="jobTitle"
                      placeholder={t('campaigns.new.jobTitlePlaceholder')}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (!selectedPosition) {
                          setFormData(prev => ({ ...prev, jobTitle: e.target.value }));
                        }
                      }}
                      onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                      className="pl-12 h-11 bg-white border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                    {searching && (
                      <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-cyan-500" />
                    )}
                  </>
                )}

                {/* Dropdown de resultados */}
                {showDropdown && searchResults.length > 0 && !selectedPosition && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl">
                    <div className="max-h-72 overflow-y-auto overscroll-contain">
                      {searchResults.map((position, idx) => (
                        <button
                          key={position.id}
                          type="button"
                          className={`w-full px-4 py-3.5 text-left hover:bg-cyan-50 border-b last:border-b-0 transition-colors ${idx === 0 ? 'rounded-t-xl' : ''} ${idx === searchResults.length - 1 ? 'rounded-b-xl' : ''}`}
                          onClick={() => handleSelectPosition(position)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                              <Briefcase className="w-4 h-4 text-gray-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900">{position.title}</p>
                              <p className="text-sm text-gray-500 truncate">
                                {position.categoryName} • {position.subcategory}
                              </p>
                              {position.synonyms.length > 0 && (
                                <p className="text-xs text-gray-400 mt-1 truncate">
                                  {t('campaigns.new.also')} {position.synonyms.slice(0, 3).join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                {t('campaigns.new.jobTitleInfo')}
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                {t('campaigns.new.description')} <span className="text-gray-400">{t('campaigns.new.descriptionOptional')}</span>
              </Label>
              <Textarea
                id="description"
                placeholder={t('campaigns.new.descriptionPlaceholder')}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-2 bg-white border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Visibilidad y Permisos */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{t('campaigns.new.visibilityTitle')}</CardTitle>
                <CardDescription>{t('campaigns.new.visibilityDesc')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {/* Visibilidad */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">{t('campaigns.new.visibility')}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.isPrivate
                      ? 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    checked={formData.isPrivate}
                    onChange={() => setFormData(prev => ({ ...prev, isPrivate: true }))}
                    className="mt-1 accent-cyan-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${formData.isPrivate ? 'bg-cyan-100' : 'bg-gray-100'}`}>
                        <Lock className={`w-4 h-4 ${formData.isPrivate ? 'text-cyan-600' : 'text-gray-500'}`} />
                      </div>
                      <span className="font-semibold text-gray-900">{t('campaigns.new.privateLabel')}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1.5">
                      {t('campaigns.new.privateDesc')}
                    </p>
                  </div>
                </label>
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    !formData.isPrivate
                      ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    checked={!formData.isPrivate}
                    onChange={() => setFormData(prev => ({ ...prev, isPrivate: false }))}
                    className="mt-1 accent-emerald-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${!formData.isPrivate ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                        <Globe className={`w-4 h-4 ${!formData.isPrivate ? 'text-emerald-600' : 'text-gray-500'}`} />
                      </div>
                      <span className="font-semibold text-gray-900">{t('campaigns.new.publicLabel')}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1.5">
                      {t('campaigns.new.publicDesc')}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Permisos para agregar candidatos */}
            <div className="pt-2">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.allowTeamAddCandidates
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Checkbox
                  checked={formData.allowTeamAddCandidates}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowTeamAddCandidates: checked === true }))}
                  className="mt-0.5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${formData.allowTeamAddCandidates ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                      <UserPlus className={`w-4 h-4 ${formData.allowTeamAddCandidates ? 'text-emerald-600' : 'text-gray-500'}`} />
                    </div>
                    <span className="font-semibold text-gray-900">{t('campaigns.new.allowTeam')}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1.5">
                    {t('campaigns.new.allowTeamDesc')}
                  </p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Evaluación */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 rounded-xl">
                <Brain className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{t('campaigns.new.evaluationsTitle')}</CardTitle>
                <CardDescription>
                  {t('campaigns.new.evaluationsDesc').replace('{credits}', String(creditsPerEvaluation))}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {evaluationTypes.map((evalType) => {
                const Icon = evalType.icon;
                const isSelected = formData.evaluationTypes.includes(evalType.id);

                return (
                  <label
                    key={evalType.id}
                    htmlFor={`eval-${evalType.id}`}
                    className={`relative flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Checkbox
                      id={`eval-${evalType.id}`}
                      checked={isSelected}
                      onCheckedChange={() => handleEvaluationTypeToggle(evalType.id)}
                      className="data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                    />
                    <div className={`p-2 rounded-lg ${isSelected ? evalType.bg : 'bg-gray-100'}`}>
                      <Icon className={`w-5 h-5 ${isSelected ? evalType.color : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                        {evalType.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{evalType.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-cyan-600 absolute top-2 right-2" />
                    )}
                  </label>
                );
              })}
            </div>

            {/* Botones rápidos */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, evaluationTypes: evaluationTypes.map(e => e.id) }))}
                className="text-xs"
              >
                {t('campaigns.new.selectAll')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, evaluationTypes: [] }))}
                className="text-xs"
              >
                {t('campaigns.new.deselectAll')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, evaluationTypes: ['DISC', 'DRIVING_FORCES', 'EQ'] }))}
                className="text-xs"
              >
                {t('campaigns.new.basic')}
              </Button>
            </div>

            {/* Resumen de costos */}
            <div className="mt-4 p-5 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 border border-cyan-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t('campaigns.new.costPerCandidate')}</p>
                    <p className="text-sm text-gray-600">
                      {t('campaigns.new.evalsPerCandidate').replace('{credits}', String(creditsPerEvaluation)).replace('evaluación(es)', formData.evaluationTypes.length + ' ' + (formData.evaluationTypes.length !== 1 ? (t('campaigns.new.evalsPerCandidate').includes('evaluation') ? 'evaluations' : 'evaluaciones') : (t('campaigns.new.evalsPerCandidate').includes('evaluation') ? 'evaluation' : 'evaluación')))}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    {totalCredits}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">{t('campaigns.new.credits')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Info className="w-5 h-5 text-cyan-500" />
              <p className="text-sm">
                {t('campaigns.new.infoNote')}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                className="flex-1 sm:flex-none border-gray-300 hover:bg-gray-50"
              >
                {t('campaigns.new.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={loading || formData.evaluationTypes.length === 0}
                className="flex-1 sm:flex-none bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg text-white font-semibold px-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('campaigns.new.creating')}
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    {t('campaigns.new.create')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
}
