'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  Target,
  Users,
  Plus,
  BarChart3,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Loader2,
  RefreshCw,
  Trash2,
  User,
  Phone,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Award,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Eye,
  Brain,
  Zap,
  Heart,
  Dna,
  Sparkles,
  Scale,
  Activity,
  Coins,
  AlertCircle,
  UserPlus,
  MoreVertical,
  Settings,
  Archive,
  Search,
  Database,
  Check,
  X,
  FileCode,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/language-context';

interface EvaluationStatus {
  status: string;
  completedAt: string | null;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  status: string;
  overallScore: number | null;
  rankPosition: number | null;
  analysisData: Record<string, unknown> | null;
  invitedAt: string;
  lastCompletedAt: string | null;
  evaluationProgress?: Record<string, EvaluationStatus>;
  completedEvaluations?: number;
  totalEvaluations?: number;
}

interface Campaign {
  id: string;
  name: string;
  jobTitle: string;
  jobCategory: string | null;
  description: string | null;
  status: string;
  evaluationTypes: string[];
  isPrivate: boolean;
  allowTeamAddCandidates: boolean;
  createdAt: string;
  candidates: Candidate[];
}

interface CampaignPermissions {
  canEdit: boolean;
  canAddCandidates: boolean;
  canDelete: boolean;
}

interface AnalysisResult {
  rankedCandidates: Array<{
    candidateId: string;
    candidateName: string;
    overallScore: number;
    fitPercentage: number;
    rankPosition: number;
    dimensionScores: Record<string, number>;
    strengths: string[];
    areasOfConcern: string[];
    recommendations: string[];
    compatibilityDetails: Array<{
      category: string;
      description: string;
      score: number;
      status: 'excellent' | 'good' | 'moderate' | 'low';
    }>;
  }>;
  summary: {
    totalCandidates: number;
    completedEvaluations: number;
    topCandidate: { name: string; score: number } | null;
    averageScore: number;
    scoreDistribution: { excellent: number; good: number; moderate: number; low: number };
    recommendationSummary: string;
  };
  analysisLanguage?: string;
}

const getStatusConfig = (t: (key: string) => string): Record<string, { label: string; color: string }> => ({
  INVITED: { label: t('campaigns.detail.invited'), color: 'bg-gray-100 text-gray-700' },
  EVALUATING: { label: t('campaigns.detail.evaluating'), color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: t('campaigns.status.completed'), color: 'bg-emerald-100 text-emerald-700' },
  WITHDRAWN: { label: t('campaigns.detail.withdrawn'), color: 'bg-red-100 text-red-700' },
});

const getEvaluationIcons = (t: (key: string) => string, language: string): Record<string, { icon: typeof Brain; color: string; label: string }> => ({
  DISC: { icon: Brain, color: 'text-blue-600', label: 'DISC' },
  DRIVING_FORCES: { icon: Zap, color: 'text-amber-600', label: t('batchEval.drivingForces.name') },
  EQ: { icon: Heart, color: 'text-rose-600', label: 'EQ' },
  DNA: { icon: Dna, color: 'text-teal-600', label: 'DNA-25' },
  ACUMEN: { icon: Sparkles, color: 'text-purple-600', label: 'Acumen' },
  VALUES: { icon: Scale, color: 'text-violet-600', label: t('batchEval.values.name') },
  STRESS: { icon: Activity, color: 'text-orange-600', label: t('batchEval.stress.name') },
  TECHNICAL: { icon: FileCode, color: 'text-sky-600', label: language === 'es' ? 'Técnica' : 'Technical' },
});

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { t, language } = useLanguage();
  const campaignId = params.id as string;

  const statusConfig = getStatusConfig(t);
  const evaluationIcons = getEvaluationIcons(t, language);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
  const [creditsPerEvaluation, setCreditsPerEvaluation] = useState(2);
  const [permissions, setPermissions] = useState<CampaignPermissions>({ canEdit: true, canAddCandidates: true, canDelete: true });

  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Lista de candidatos a enviar
  const [candidatesList, setCandidatesList] = useState<Array<{ name: string; email: string; phone: string }>>([]);
  const [sendingCandidates, setSendingCandidates] = useState(false);
  const [sendResults, setSendResults] = useState<{
    summary: { total: number; success: number; duplicates: number; errors: number; totalEmailsSent: number; totalCreditsUsed: number };
    candidates: Array<{ name: string; email: string; status: string; message?: string; emailsSent?: number }>;
  } | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // State for searching existing evaluations
  const [addMode, setAddMode] = useState<'manual' | 'existing'>('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    email: string;
    name: string;
    evaluations: Array<{ type: string; completedAt: string; token: string }>;
    completedCount: number;
    requiredCount: number;
    hasAllRequired: boolean;
    missingTypes: string[];
  }>>([]);
  const [selectedPeople, setSelectedPeople] = useState<Set<string>>(new Set());
  const [searching, setSearching] = useState(false);
  const [addingFromExisting, setAddingFromExisting] = useState(false);

  useEffect(() => {
    fetchCampaign();
    fetchSettings();
  }, [campaignId]);

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

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data.campaign);
        if (data.permissions) {
          setPermissions(data.permissions);
        }
      } else if (response.status === 403) {
        toast.error(t('campaigns.detail.permissionDenied'));
        router.push('/campaigns');
      } else {
        toast.error(t('campaigns.detail.notFound'));
        router.push('/campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
      toast.error(t('campaigns.detail.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data);
        await fetchCampaign(); // Refresh campaign data
        toast.success(t('campaigns.detail.analysisComplete'));
      } else {
        toast.error(t('campaigns.detail.errorAnalyzing'));
      }
    } catch (error) {
      console.error('Error analyzing:', error);
      toast.error(t('campaigns.detail.errorAnalyzing'));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddToList = () => {
    if (!newCandidate.name.trim() || !newCandidate.email.trim()) {
      toast.error(t('campaigns.detail.nameEmailRequired'));
      return;
    }

    // Verificar duplicado en la lista actual
    const emailLower = newCandidate.email.toLowerCase().trim();
    if (candidatesList.some(c => c.email.toLowerCase() === emailLower)) {
      toast.error(t('campaigns.detail.emailAlreadyInList'));
      return;
    }

    setCandidatesList(prev => [...prev, {
      name: newCandidate.name.trim(),
      email: emailLower,
      phone: newCandidate.phone.trim(),
    }]);
    setNewCandidate({ name: '', email: '', phone: '' });
  };

  const handleRemoveFromList = (index: number) => {
    setCandidatesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendCandidates = async () => {
    if (candidatesList.length === 0) {
      toast.error(t('campaigns.detail.addAtLeastOne'));
      return;
    }

    setSendingCandidates(true);
    setSendResults(null);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/candidates/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidates: candidatesList }),
      });

      const data = await response.json();

      if (response.ok) {
        setSendResults(data);
        await fetchCampaign();
        window.dispatchEvent(new CustomEvent('credits-updated'));
        
        if (data.summary.success > 0) {
          toast.success(`${data.summary.success} ${t('campaigns.detail.candidateAdded')}`);
        }
      } else {
        toast.error(data.error || t('campaigns.detail.errorAdding'));
      }
    } catch (error) {
      console.error('Error sending candidates:', error);
      toast.error(t('campaigns.detail.errorAdding'));
    } finally {
      setSendingCandidates(false);
    }
  };

  const resetAddDialog = () => {
    setShowAddCandidate(false);
    setNewCandidate({ name: '', email: '', phone: '' });
    setCandidatesList([]);
    setSendResults(null);
    // Reset search state
    setAddMode('manual');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedPeople(new Set());
  };

  // Search existing evaluations
  const handleSearchEvaluations = async (query?: string) => {
    const searchTerm = query !== undefined ? query : searchQuery;
    setSearching(true);
    try {
      const response = await fetch(
        `/api/campaigns/search-evaluations?campaignId=${campaignId}&q=${encodeURIComponent(searchTerm)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.people || []);
      } else {
        toast.error(t('campaigns.detail.errorAnalyzing'));
      }
    } catch (error) {
      console.error('Error searching evaluations:', error);
      toast.error(t('campaigns.detail.errorAnalyzing'));
    } finally {
      setSearching(false);
    }
  };

  // Toggle person selection
  const togglePersonSelection = (email: string) => {
    const newSelected = new Set(selectedPeople);
    if (newSelected.has(email)) {
      newSelected.delete(email);
    } else {
      newSelected.add(email);
    }
    setSelectedPeople(newSelected);
  };

  // Select/deselect all
  const toggleSelectAll = () => {
    if (selectedPeople.size === searchResults.length) {
      setSelectedPeople(new Set());
    } else {
      setSelectedPeople(new Set(searchResults.map(p => p.email)));
    }
  };

  // Add selected people from existing evaluations
  const handleAddFromExisting = async () => {
    if (selectedPeople.size === 0) {
      toast.error(t('campaigns.detail.selectAtLeastOne'));
      return;
    }

    setAddingFromExisting(true);
    try {
      const peopleToAdd = searchResults
        .filter(p => selectedPeople.has(p.email))
        .map(p => ({
          email: p.email,
          name: p.name,
          evaluations: p.evaluations.map(e => ({ type: e.type, token: e.token })),
        }));

      const response = await fetch(`/api/campaigns/${campaignId}/candidates/from-evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ people: peopleToAdd }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`${data.summary.success} ${t('campaigns.detail.candidateAdded')}`);
        if (data.summary.duplicates > 0) {
          toast(`${data.summary.duplicates} ${t('campaigns.detail.alreadyInCampaign')}`, { icon: '⚠️' });
        }
        resetAddDialog();
        await fetchCampaign();
      } else {
        const data = await response.json();
        toast.error(data.error || t('campaigns.detail.errorAdding'));
      }
    } catch (error) {
      console.error('Error adding from existing:', error);
      toast.error(t('campaigns.detail.errorAdding'));
    } finally {
      setAddingFromExisting(false);
    }
  };

  // Calculate credits needed for missing evaluations
  const getCreditsNeededForSelected = () => {
    let total = 0;
    for (const email of selectedPeople) {
      const person = searchResults.find(p => p.email === email);
      if (person) {
        total += person.missingTypes.length * creditsPerEvaluation;
      }
    }
    return total;
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/candidates/${candidateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(t('campaigns.detail.candidateRemoved'));
        await fetchCampaign();
      } else {
        toast.error(t('campaigns.detail.errorDeleting'));
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error(t('campaigns.detail.errorDeleting'));
    }
  };

  const handleDeleteCampaign = async () => {
    setDeletingCampaign(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(t('campaigns.deleteSuccess'));
        router.push('/campaigns');
      } else {
        const data = await response.json();
        toast.error(data.error || t('campaigns.deleteError'));
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error(t('campaigns.deleteError'));
    } finally {
      setDeletingCampaign(false);
      setShowDeleteDialog(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-100';
    if (score >= 65) return 'bg-blue-100';
    if (score >= 50) return 'bg-amber-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  const completedCandidates = campaign.candidates.filter(c => c.status === 'COMPLETED').length;
  const completionRate = campaign.candidates.length > 0
    ? Math.round((completedCandidates / campaign.candidates.length) * 100)
    : 0;

  const totalCreditsPerCandidate = campaign.evaluationTypes.length * creditsPerEvaluation;

  const statusLabels: Record<string, string> = {
    DRAFT: t('campaigns.status.draft'),
    ACTIVE: t('campaigns.status.active'),
    EVALUATING: t('campaigns.status.evaluating'),
    ANALYZING: t('campaigns.status.analyzing'),
    COMPLETED: t('campaigns.status.completed'),
    ARCHIVED: t('campaigns.status.archived'),
  };

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
    ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    EVALUATING: 'bg-blue-100 text-blue-700 border-blue-200',
    ANALYZING: 'bg-purple-100 text-purple-700 border-purple-200',
    COMPLETED: 'bg-teal-100 text-teal-700 border-teal-200',
    ARCHIVED: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-0 space-y-6">
      {/* Header Moderno */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 sm:p-8">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative">
          {/* Back button and Title */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push('/campaigns')} 
                className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="text-white">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold">{campaign.name}</h1>
                  <Badge className={`${statusColors[campaign.status] || statusColors.DRAFT} border`}>
                    {statusLabels[campaign.status] || campaign.status}
                  </Badge>
                </div>
                <p className="text-white/80 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {campaign.jobTitle}
                  {campaign.description && (
                    <span className="hidden sm:inline">• {campaign.description}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Actions Menu */}
            {permissions.canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('campaigns.detail.deleteCampaign')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
          {/* Agregar Candidatos Dialog Unificado */}
          {permissions.canAddCandidates && (
          <Dialog open={showAddCandidate} onOpenChange={(open) => { if (!open) resetAddDialog(); else setShowAddCandidate(true); }}>
            <DialogTrigger asChild>
              <Button className="bg-white text-indigo-700 hover:bg-white/90 shadow-md font-semibold">
                <UserPlus className="w-4 h-4 mr-2" />
                {t('campaigns.detail.addCandidates')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                  {t('campaigns.detail.addCandidates')}
                </DialogTitle>
                <DialogDescription>
                  {t('campaigns.detail.addCandidatesDesc')}
                </DialogDescription>
              </DialogHeader>

              {!sendResults ? (
                <div className="space-y-4 mt-2">
                  {/* Tabs para modo de agregar */}
                  <Tabs value={addMode} onValueChange={(v) => {
                    setAddMode(v as 'manual' | 'existing');
                    // Auto-cargar personas con evaluaciones cuando se cambia al tab "existing"
                    if (v === 'existing' && searchResults.length === 0 && !searching) {
                      handleSearchEvaluations('');
                    }
                  }} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="manual" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        {t('campaigns.detail.newCandidate')}
                      </TabsTrigger>
                      <TabsTrigger value="existing" className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        {t('campaigns.detail.fromEvaluations')}
                      </TabsTrigger>
                    </TabsList>

                    {/* Tab: Nuevo Candidato Manual */}
                    <TabsContent value="manual" className="space-y-4">
                      {/* Formulario para agregar */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <Label htmlFor="candidateName" className="text-gray-700 text-sm">{t('campaigns.detail.fullName')} *</Label>
                          <Input
                            id="candidateName"
                            placeholder="Juan Carlos Pérez"
                            value={newCandidate.name}
                            onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1"
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddToList(); } }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="candidateEmail" className="text-gray-700 text-sm">{t('campaigns.detail.email')} *</Label>
                          <Input
                            id="candidateEmail"
                            type="email"
                            placeholder="email@ejemplo.com"
                            value={newCandidate.email}
                            onChange={(e) => setNewCandidate(prev => ({ ...prev, email: e.target.value }))}
                            className="mt-1"
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddToList(); } }}
                          />
                        </div>
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Label htmlFor="candidatePhone" className="text-gray-700 text-sm">{t('campaigns.detail.phone')}</Label>
                            <Input
                              id="candidatePhone"
                              placeholder="+57 300 123 4567"
                              value={newCandidate.phone}
                              onChange={(e) => setNewCandidate(prev => ({ ...prev, phone: e.target.value }))}
                              className="mt-1"
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddToList(); } }}
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={handleAddToList}
                            className="bg-emerald-600 hover:bg-emerald-700 h-10 px-3"
                            disabled={!newCandidate.name.trim() || !newCandidate.email.trim()}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Lista de candidatos agregados */}
                      {candidatesList.length > 0 && (
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-3 py-2 border-b flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              {t('campaigns.detail.candidatesToSend')} ({candidatesList.length})
                            </span>
                            {candidatesList.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                                onClick={() => setCandidatesList([])}
                              >
                                {t('campaigns.detail.clearAll')}
                              </Button>
                            )}
                          </div>
                          <div className="max-h-[180px] overflow-y-auto">
                            {candidatesList.map((c, i) => (
                              <div key={i} className="flex items-center justify-between px-3 py-2 border-b last:border-b-0 hover:bg-gray-50">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{c.email}</p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 flex-shrink-0"
                                  onClick={() => handleRemoveFromList(i)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {candidatesList.length === 0 && (
                        <div className="text-center py-6 border border-dashed rounded-lg bg-gray-50">
                          <Users className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">{t('campaigns.detail.addCandidatesForm')}</p>
                          <p className="text-xs text-gray-400 mt-1">{t('campaigns.detail.pressEnter')}</p>
                        </div>
                      )}

                      {/* Costo */}
                      <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Coins className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">{t('campaigns.detail.totalCost')}</p>
                            <p className="text-xs text-gray-500">
                              {t('campaigns.detail.candidatesX').replace('{credits}', String(totalCreditsPerCandidate)).replace('candidatos', candidatesList.length + ' ' + t('campaigns.candidates').toLowerCase())}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-indigo-700">
                              {candidatesList.length * totalCreditsPerCandidate}
                            </p>
                            <p className="text-xs text-gray-500">{t('campaigns.new.credits')}</p>
                          </div>
                        </div>
                      </div>

                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={resetAddDialog}>
                          {t('campaigns.cancel')}
                        </Button>
                        <Button 
                          onClick={handleSendCandidates}
                          disabled={sendingCandidates || candidatesList.length === 0}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                          {sendingCandidates ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('campaigns.detail.sendingEvals')}</>
                          ) : (
                            <><Mail className="w-4 h-4 mr-2" /> {t('campaigns.detail.sendEvaluations')}</>
                          )}
                        </Button>
                      </DialogFooter>
                    </TabsContent>

                    {/* Tab: Desde Evaluaciones Existentes */}
                    <TabsContent value="existing" className="space-y-4">
                      {/* Buscador */}
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder={t('campaigns.detail.searchByNameOrEmail')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearchEvaluations(); }}
                            className="pl-9"
                          />
                        </div>
                        <Button
                          onClick={() => handleSearchEvaluations()}
                          disabled={searching}
                          variant="outline"
                        >
                          {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        </Button>
                      </div>

                      {/* Info de evaluaciones de la campaña */}
                      {campaign && (
                        <div className="flex flex-wrap gap-1.5 items-center text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="font-medium">Evaluaciones de la campaña:</span>
                          {campaign.evaluationTypes.map((type) => {
                            const config = evaluationIcons[type];
                            const Icon = config?.icon || Brain;
                            return (
                              <Badge key={type} variant="outline" className="text-xs py-0 px-1.5">
                                <Icon className={`w-3 h-3 mr-1 ${config?.color || 'text-gray-500'}`} />
                                {config?.label || type}
                              </Badge>
                            );
                          })}
                        </div>
                      )}

                      {/* Resultados de búsqueda */}
                      {searchResults.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-3 py-2 border-b flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="selectAll"
                                checked={selectedPeople.size === searchResults.length && searchResults.length > 0}
                                onCheckedChange={toggleSelectAll}
                              />
                              <label htmlFor="selectAll" className="text-sm font-medium text-gray-700 cursor-pointer">
                                {selectedPeople.size > 0 ? `${selectedPeople.size} ${t('campaigns.detail.selected')}` : t('campaigns.detail.selectAll')}
                              </label>
                            </div>
                            <span className="text-xs text-gray-500">{searchResults.length}</span>
                          </div>
                          <div className="max-h-[280px] overflow-y-auto divide-y">
                            {searchResults.map((person) => (
                              <div
                                key={person.email}
                                className={`flex items-start gap-3 px-3 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                                  selectedPeople.has(person.email) ? 'bg-indigo-50/50' : ''
                                }`}
                                onClick={() => togglePersonSelection(person.email)}
                              >
                                <Checkbox
                                  checked={selectedPeople.has(person.email)}
                                  onCheckedChange={() => togglePersonSelection(person.email)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-gray-900 truncate">{person.name}</p>
                                    {person.hasAllRequired && (
                                      <Badge className="bg-emerald-100 text-emerald-700 text-xs py-0">{t('campaigns.status.completed')}</Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 truncate">{person.email}</p>
                                  {/* Evaluaciones completadas */}
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {campaign?.evaluationTypes.map((type) => {
                                      const hasEval = person.evaluations.some(e => e.type === type);
                                      const config = evaluationIcons[type];
                                      const Icon = config?.icon || Brain;
                                      return (
                                        <div
                                          key={type}
                                          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs ${
                                            hasEval
                                              ? 'bg-emerald-100 text-emerald-700'
                                              : 'bg-gray-100 text-gray-400'
                                          }`}
                                          title={hasEval ? `${config?.label || type} completado` : `${config?.label || type} pendiente`}
                                        >
                                          {hasEval ? (
                                            <Check className="w-3 h-3" />
                                          ) : (
                                            <X className="w-3 h-3" />
                                          )}
                                          <Icon className="w-3 h-3" />
                                        </div>
                                      );
                                    })}
                                  </div>
                                  {person.missingTypes.length > 0 && (
                                    <p className="text-xs text-amber-600 mt-1">
                                      {t('campaigns.detail.missing')} {person.missingTypes.length}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-lg font-bold text-indigo-600">{person.completedCount}/{person.requiredCount}</p>
                                  <p className="text-xs text-gray-500">{t('campaigns.detail.completedEvals')}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : searching ? (
                        <div className="text-center py-8">
                          <Loader2 className="w-8 h-8 mx-auto text-indigo-400 animate-spin mb-2" />
                          <p className="text-sm text-gray-500">{t('campaigns.detail.searching')}</p>
                        </div>
                      ) : searchQuery.trim() !== '' ? (
                        <div className="text-center py-8 border border-dashed rounded-lg bg-amber-50 border-amber-200">
                          <Search className="w-8 h-8 mx-auto text-amber-400 mb-2" />
                          <p className="text-sm text-amber-700">{t('campaigns.noResults')}: "{searchQuery}"</p>
                        </div>
                      ) : (
                        <div className="text-center py-8 border border-dashed rounded-lg bg-gray-50">
                          <Database className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">{t('campaigns.detail.noEvaluationsFound')}</p>
                          <p className="text-xs text-gray-400 mt-1">{t('campaigns.detail.noEvaluationsFoundDesc')}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => handleSearchEvaluations('')}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {t('campaigns.detail.search')}
                          </Button>
                        </div>
                      )}

                      {/* Resumen de selección y costo */}
                      {selectedPeople.size > 0 && (
                        <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <Coins className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-700">
                                {selectedPeople.size} {t('campaigns.detail.selected')}
                              </p>
                              <p className="text-xs text-gray-500">
                                {t('campaigns.detail.creditsForMissing')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-emerald-700">
                                {getCreditsNeededForSelected()}
                              </p>
                              <p className="text-xs text-gray-500">{t('campaigns.new.credits')}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={resetAddDialog}>
                          {t('campaigns.cancel')}
                        </Button>
                        <Button
                          onClick={handleAddFromExisting}
                          disabled={addingFromExisting || selectedPeople.size === 0}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                        >
                          {addingFromExisting ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('campaigns.detail.adding')}</>
                          ) : (
                            <><UserPlus className="w-4 h-4 mr-2" /> {t('campaigns.detail.addSelected')} {selectedPeople.size > 0 ? `(${selectedPeople.size})` : ''}</>
                          )}
                        </Button>
                      </DialogFooter>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="space-y-4 mt-2">
                  {/* Resumen de resultados */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-2xl font-bold text-emerald-700">{sendResults.summary.success}</p>
                      <p className="text-xs text-emerald-600">{t('batchEval.results.added')}</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-2xl font-bold text-amber-700">{sendResults.summary.duplicates}</p>
                      <p className="text-xs text-amber-600">{t('batchEval.results.duplicates')}</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-2xl font-bold text-red-700">{sendResults.summary.errors}</p>
                      <p className="text-xs text-red-600">{t('batchEval.results.errors')}</p>
                    </div>
                  </div>

                  {sendResults.summary.success > 0 && (
                    <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-indigo-700">
                          <Mail className="w-4 h-4 inline mr-2" />
                          {sendResults.summary.totalEmailsSent} {t('batchEval.results.emailsSent')}
                        </span>
                        <span className="text-sm font-semibold text-indigo-700">
                          <Coins className="w-4 h-4 inline mr-1" />
                          {sendResults.summary.totalCreditsUsed} {t('campaigns.new.credits')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Detalle de resultados */}
                  <div className="max-h-[200px] overflow-y-auto space-y-1">
                    {sendResults.candidates.map((c, i) => (
                      <div key={i} className={`flex items-center justify-between text-sm p-2 rounded ${
                        c.status === 'success' ? 'bg-emerald-50' :
                        c.status === 'duplicate' ? 'bg-amber-50' : 'bg-red-50'
                      }`}>
                        <span className="truncate flex-1">{c.name} ({c.email})</span>
                        {c.status === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                        {c.status === 'duplicate' && <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                        {c.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                      </div>
                    ))}
                  </div>

                  <DialogFooter>
                    <Button onClick={resetAddDialog} className="w-full">
                      {t('batchEval.results.close')}
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={analyzing || campaign.candidates.length === 0}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 font-semibold"
            variant="outline"
          >
            {analyzing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('campaigns.detail.analyzingCandidates')}</>
            ) : (
              <><BarChart3 className="w-4 h-4 mr-2" /> {t('campaigns.detail.analyzeResults')}</>
            )}
          </Button>
          </div>
        </div>
      </div>

      {/* Delete Campaign Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('campaigns.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('campaigns.deleteDesc').replace('{name}', campaign.name)} ({campaign.candidates.length} {t('campaigns.candidates').toLowerCase()})
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingCampaign}>{t('campaigns.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteCampaign}
              disabled={deletingCampaign}
            >
              {deletingCampaign ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('campaigns.deleting')}</>
              ) : (
                t('campaigns.detail.deleteCampaign')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stats Cards Mejoradas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
          <CardContent className="relative p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80 font-medium">{t('campaigns.candidates')}</p>
                <p className="text-3xl font-bold mt-1">{campaign.candidates.length}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600" />
          <CardContent className="relative p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80 font-medium">{t('campaigns.status.completed')}</p>
                <p className="text-3xl font-bold mt-1">{completedCandidates}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600" />
          <CardContent className="relative p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80 font-medium">{t('batchEval.pending')}</p>
                <p className="text-3xl font-bold mt-1">{campaign.candidates.length - completedCandidates}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600" />
          <CardContent className="relative p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80 font-medium">{t('campaigns.progress')}</p>
                <p className="text-3xl font-bold mt-1">{completionRate}%</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evaluaciones configuradas */}
      <Card className="border-indigo-100">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2 flex-shrink-0">
              <Target className="w-4 h-4 text-indigo-600" />
              {t('batchEval.evalsPerPerson')}:
            </span>
            <div className="flex flex-wrap gap-2 flex-1">
              {campaign.evaluationTypes.map((type) => {
                const config = evaluationIcons[type] || { icon: Brain, color: 'text-gray-600', label: type };
                const Icon = config.icon;
                return (
                  <Badge key={type} variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 bg-white">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <span className="font-medium">{config.label}</span>
                  </Badge>
                );
              })}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-200">
              <Coins className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-700">{totalCreditsPerCandidate} créditos/candidato</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis de Resultados */}
      {analysisResult && analysisResult.summary.completedEvaluations > 0 && (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              {t('campaigns.detail.summary')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Warning when analysis was done in different language */}
            {analysisResult.analysisLanguage && analysisResult.analysisLanguage !== language && (
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700">{t('campaigns.detail.analysisInOtherLanguage')}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
                  {t('campaigns.detail.reanalyze')}
                </Button>
              </div>
            )}
            <p className="text-gray-700">{analysisResult.summary.recommendationSummary}</p>
            
            {analysisResult.summary.topCandidate && (
              <div className="flex items-center gap-4 p-4 bg-white/80 rounded-lg">
                <Award className="w-10 h-10 text-amber-500" />
                <div>
                  <p className="text-sm text-gray-500">{t('campaigns.detail.topCandidate')}</p>
                  <p className="text-lg font-bold text-gray-900">{analysisResult.summary.topCandidate.name}</p>
                  <p className={`text-2xl font-bold ${getScoreColor(analysisResult.summary.topCandidate.score)}`}>
                    {analysisResult.summary.topCandidate.score}%
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-emerald-100 rounded-lg">
                <p className="text-2xl font-bold text-emerald-700">{analysisResult.summary.scoreDistribution.excellent}</p>
                <p className="text-xs text-emerald-600">{t('campaigns.detail.excellentFit')} (≥80)</p>
              </div>
              <div className="text-center p-3 bg-blue-100 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{analysisResult.summary.scoreDistribution.good}</p>
                <p className="text-xs text-blue-600">{t('campaigns.detail.goodFit')} (65-79)</p>
              </div>
              <div className="text-center p-3 bg-amber-100 rounded-lg">
                <p className="text-2xl font-bold text-amber-700">{analysisResult.summary.scoreDistribution.moderate}</p>
                <p className="text-xs text-amber-600">{t('campaigns.detail.moderateFit')} (50-64)</p>
              </div>
              <div className="text-center p-3 bg-red-100 rounded-lg">
                <p className="text-2xl font-bold text-red-700">{analysisResult.summary.scoreDistribution.low}</p>
                <p className="text-xs text-red-600">{t('campaigns.detail.lowFit')} (&lt;50)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Candidatos */}
      <Card>
        <CardHeader>
          <CardTitle>{t('campaigns.candidates')} ({campaign.candidates.length})</CardTitle>
          <CardDescription>{t('campaigns.detail.candidatesList')}</CardDescription>
        </CardHeader>
        <CardContent>
          {campaign.candidates.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">{t('campaigns.detail.noCandidates')}</p>
              <Button className="mt-4" onClick={() => setShowAddCandidate(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('campaigns.detail.addCandidates')}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {campaign.candidates.map((candidate, index) => {
                const status = statusConfig[candidate.status] || statusConfig.INVITED;
                const analysis = analysisResult?.rankedCandidates.find(c => c.candidateId === candidate.id);
                const isExpanded = expandedCandidate === candidate.id;

                return (
                  <div
                    key={candidate.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpandedCandidate(isExpanded ? null : candidate.id)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Ranking Position */}
                        {candidate.rankPosition ? (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                            candidate.rankPosition === 1 ? 'bg-amber-100 text-amber-700' :
                            candidate.rankPosition === 2 ? 'bg-gray-200 text-gray-700' :
                            candidate.rankPosition === 3 ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            #{candidate.rankPosition}
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{candidate.name}</p>
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                          <p className="text-sm text-gray-500">{candidate.email}</p>
                          
                          {/* Evaluation Progress */}
                          {candidate.evaluationProgress && (
                            <div className="flex items-center gap-2 mt-2">
                              {campaign.evaluationTypes.map((evalType) => {
                                const evalStatus = candidate.evaluationProgress?.[evalType];
                                const isCompleted = evalStatus?.status === 'COMPLETED';
                                const evalLabels: Record<string, string> = {
                                  'DISC': 'D',
                                  'DRIVING_FORCES': 'DF',
                                  'EQ': 'EQ',
                                  'DNA': 'DNA',
                                  'ACUMEN': 'ACI',
                                  'VALUES': 'V',
                                  'STRESS': 'S',
                                };
                                return (
                                  <div
                                    key={evalType}
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                                      isCompleted
                                        ? 'bg-green-100 text-green-700 border border-green-300'
                                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                                    }`}
                                    title={`${evalType}: ${isCompleted ? 'Completada' : 'Pendiente'}`}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle className="w-4 h-4" />
                                    ) : (
                                      evalLabels[evalType] || evalType.charAt(0)
                                    )}
                                  </div>
                                );
                              })}
                              <span className="text-xs text-gray-500 ml-1">
                                {candidate.completedEvaluations || 0}/{candidate.totalEvaluations || 0}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Score */}
                        {candidate.overallScore !== null && (
                          <div className={`px-4 py-2 rounded-lg ${getScoreBg(candidate.overallScore)}`}>
                            <p className="text-xs text-gray-500">Score</p>
                            <p className={`text-xl font-bold ${getScoreColor(candidate.overallScore)}`}>
                              {candidate.overallScore}%
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('campaigns.detail.removeCandidate')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('campaigns.detail.removeCandidateDesc')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('campaigns.cancel')}</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDeleteCandidate(candidate.id)}
                                >
                                  {t('campaigns.detail.remove')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Analysis */}
                    {isExpanded && analysis && (
                      <div className="border-t bg-gray-50 p-4 space-y-4">
                        {/* Dimension Scores */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">{t('campaigns.detail.ranking')}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {analysis.compatibilityDetails.map((detail) => (
                              <div key={detail.category} className="bg-white p-3 rounded-lg border">
                                <p className="text-xs text-gray-500">{detail.category}</p>
                                <p className={`text-lg font-bold ${getScoreColor(detail.score)}`}>
                                  {Math.round(detail.score)}%
                                </p>
                                <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${
                                      detail.status === 'excellent' ? 'bg-emerald-500' :
                                      detail.status === 'good' ? 'bg-blue-500' :
                                      detail.status === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${detail.score}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Strengths & Concerns */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {analysis.strengths.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-emerald-700 flex items-center gap-1 mb-2">
                                <TrendingUp className="w-4 h-4" />
                                {t('campaigns.detail.strengths')}
                              </h4>
                              <ul className="space-y-1">
                                {analysis.strengths.slice(0, 4).map((s, i) => (
                                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {analysis.areasOfConcern.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-amber-700 flex items-center gap-1 mb-2">
                                <AlertTriangle className="w-4 h-4" />
                                {t('campaigns.detail.concerns')}
                              </h4>
                              <ul className="space-y-1">
                                {analysis.areasOfConcern.slice(0, 4).map((a, i) => (
                                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                    {a}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Recommendations */}
                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-indigo-700 mb-2">{t('campaigns.detail.recommendations')}</h4>
                          <ul className="space-y-1">
                            {analysis.recommendations.map((r, i) => (
                              <li key={i} className="text-sm text-indigo-600">• {r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Expanded but no analysis */}
                    {isExpanded && !analysis && (
                      <div className="border-t bg-gray-50 p-4 text-center">
                        <p className="text-gray-500 text-sm">
                          {candidate.status === 'COMPLETED' 
                            ? t('campaigns.detail.noCandidatesDesc')
                            : t('campaigns.detail.noCandidatesDesc')
                          }
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  );
}
