'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  Users,
  Plus,
  Search,
  Briefcase,
  Calendar,
  BarChart3,
  ChevronRight,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Archive,
  TrendingUp,
  Loader2,
  Lock,
  Globe,
  UserPlus,
  Trash2,
  Sparkles,
  Zap,
  Brain,
  Heart,
  Dna,
  Compass,
  Scale,
  Activity,
  FileCode,
  Star,
  Award,
  Flame,
  Trophy,
  Eye,
  LayoutGrid,
  List,
  Filter,
  ArrowUpRight,
  Lightbulb,
  PieChart,
  TrendingDown,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/contexts/language-context';

interface Campaign {
  id: string;
  name: string;
  jobTitle: string;
  jobCategory: string | null;
  description: string | null;
  campaignType: string;
  status: string;
  evaluationTypes: string[];
  isPrivate: boolean;
  allowTeamAddCandidates: boolean;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  hiredCandidateName?: string | null;
  completionNotes?: string | null;
  createdBy?: string;
  stats: {
    totalCandidates: number;
    completedCandidates: number;
    pendingCandidates: number;
    avgScore: number;
  };
}

interface Permissions {
  canCreate: boolean;
  canViewPrivate: boolean;
}

const getStatusConfig = (t: (key: string) => string): Record<string, { label: string; color: string; bgGradient: string; icon: React.ReactNode }> => ({
  DRAFT: { label: t('campaigns.status.draft'), color: 'bg-slate-100 text-slate-700 border-slate-200', bgGradient: 'from-slate-500 to-gray-600', icon: <Clock className="w-3 h-3" /> },
  ACTIVE: { label: t('campaigns.status.active'), color: 'bg-emerald-100 text-emerald-700 border-emerald-200', bgGradient: 'from-emerald-500 to-teal-600', icon: <Target className="w-3 h-3" /> },
  EVALUATING: { label: t('campaigns.status.evaluating'), color: 'bg-blue-100 text-blue-700 border-blue-200', bgGradient: 'from-blue-500 to-indigo-600', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  ANALYZING: { label: t('campaigns.status.analyzing'), color: 'bg-purple-100 text-purple-700 border-purple-200', bgGradient: 'from-purple-500 to-indigo-600', icon: <BarChart3 className="w-3 h-3" /> },
  COMPLETED: { label: t('campaigns.status.completed'), color: 'bg-teal-100 text-teal-700 border-teal-200', bgGradient: 'from-teal-500 to-emerald-600', icon: <CheckCircle className="w-3 h-3" /> },
  ARCHIVED: { label: t('campaigns.status.archived'), color: 'bg-gray-100 text-gray-600 border-gray-200', bgGradient: 'from-gray-400 to-gray-500', icon: <Archive className="w-3 h-3" /> },
});

const getCampaignTypeConfig = (language: string) => ({
  SELECTION: {
    label: language === 'es' ? 'Selección' : 'Selection',
    description: language === 'es' ? 'Proceso de reclutamiento' : 'Hiring process',
    color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  },
  INTERNAL_TEAM: {
    label: language === 'es' ? 'Equipo interno' : 'Internal team',
    description: language === 'es' ? 'Desarrollo y comparación interna' : 'Internal development',
    color: 'bg-sky-100 text-sky-700 border-sky-200',
  },
});

export default function CampaignsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const statusConfig = getStatusConfig(t);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [permissions, setPermissions] = useState<Permissions>({ canCreate: true, canViewPrivate: true });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
        if (data.permissions) {
          setPermissions(data.permissions);
        }
      } else {
        toast.error(t('campaigns.loadError'));
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error(t('campaigns.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async (campaignId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(campaignId);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success(t('campaigns.deleteSuccess'));
        setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      } else {
        const data = await response.json();
        toast.error(data.error || t('campaigns.deleteError'));
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error(t('campaigns.deleteError'));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          campaign.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const totalCandidates = campaigns.reduce((sum, c) => sum + c.stats.totalCandidates, 0);
    const completedCandidates = campaigns.reduce((sum, c) => sum + c.stats.completedCandidates, 0);
    const pendingCandidates = campaigns.reduce((sum, c) => sum + c.stats.pendingCandidates, 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE' || c.status === 'EVALUATING' || c.status === 'ANALYZING').length;
    const completedCampaigns = campaigns.filter(c => c.status === 'COMPLETED').length;
    const avgCompletionRate = totalCandidates > 0 ? Math.round((completedCandidates / totalCandidates) * 100) : 0;
    const avgScore = campaigns.filter(c => c.stats.avgScore > 0).reduce((sum, c) => sum + c.stats.avgScore, 0) / (campaigns.filter(c => c.stats.avgScore > 0).length || 1);
    
    // Campaña más activa
    const mostActiveCampaign = campaigns.reduce((prev, curr) => 
      (curr.stats.totalCandidates > (prev?.stats.totalCandidates || 0)) ? curr : prev, campaigns[0] as Campaign | undefined);
    
    return {
      totalCandidates,
      completedCandidates,
      pendingCandidates,
      activeCampaigns,
      completedCampaigns,
      avgCompletionRate,
      avgScore: Math.round(avgScore),
      totalCampaigns: campaigns.length,
      mostActiveCampaign
    };
  }, [campaigns]);

  // Icono por tipo de evaluación
  const getEvalTypeIcon = (type: string) => {
    const icons: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
      'DISC': { icon: <Brain className="w-3 h-3" />, color: 'text-indigo-600', bg: 'bg-indigo-100' },
      'DF': { icon: <Target className="w-3 h-3" />, color: 'text-purple-600', bg: 'bg-purple-100' },
      'EQ': { icon: <Heart className="w-3 h-3" />, color: 'text-rose-600', bg: 'bg-rose-100' },
      'DNA': { icon: <Dna className="w-3 h-3" />, color: 'text-teal-600', bg: 'bg-teal-100' },
      'ACUMEN': { icon: <Compass className="w-3 h-3" />, color: 'text-amber-600', bg: 'bg-amber-100' },
      'VALUES': { icon: <Scale className="w-3 h-3" />, color: 'text-violet-600', bg: 'bg-violet-100' },
      'STRESS': { icon: <Activity className="w-3 h-3" />, color: 'text-orange-600', bg: 'bg-orange-100' },
      'TECHNICAL': { icon: <FileCode className="w-3 h-3" />, color: 'text-sky-600', bg: 'bg-sky-100' },
    };
    return icons[type] || { icon: <Brain className="w-3 h-3" />, color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  // Formatear fecha UTC para evitar hidratación
  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = d.getUTCDate();
    const monthNames = language === 'es' 
      ? ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    return `${day} ${month} ${year}`;
  };

  const { language } = useLanguage();
  const campaignTypeConfig = getCampaignTypeConfig(language);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero Section - Diseño Profesional Sobrio */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-6 sm:p-8">
        {/* Efectos decorativos sutiles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-slate-700/30 to-slate-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-slate-600/20 to-slate-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Info Principal */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <Briefcase className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{t('campaigns.page.title')}</h1>
                  <p className="text-slate-400 text-sm">{language === 'es' ? 'Reclu Recruitment Suite' : 'Reclu Recruitment Suite'}</p>
                </div>
              </div>
              <p className="text-slate-300 max-w-xl text-sm sm:text-base">
                {t('campaigns.page.subtitle')}
              </p>
            </div>

            {/* Quick Stats en Hero */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.activeCampaigns}</p>
                  <p className="text-xs text-slate-400">{language === 'es' ? 'Activas' : 'Active'}</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.totalCandidates}</p>
                  <p className="text-xs text-slate-400">{language === 'es' ? 'Candidatos' : 'Candidates'}</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{stats.avgCompletionRate}%</p>
                  <p className="text-xs text-slate-400">{language === 'es' ? 'Completado' : 'Completed'}</p>
                </div>
              </div>

              {permissions.canCreate && (
                <Button
                  onClick={() => router.push('/campaigns/new')}
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all font-semibold border-0"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t('campaigns.newCampaign')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards - 5 Tarjetas Sobrias */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">{stats.totalCampaigns}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{language === 'es' ? 'Total Campañas' : 'Total Campaigns'}</p>
              </div>
              <div className="p-3 bg-slate-100 rounded-xl group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5 text-slate-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <Target className="w-3 h-3" />
              <span>{language === 'es' ? 'Procesos de selección' : 'Selection processes'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-600">{stats.activeCampaigns}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{language === 'es' ? 'Campañas Activas' : 'Active Campaigns'}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <Flame className="w-3 h-3" />
              <span>{language === 'es' ? 'En progreso' : 'In progress'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-600">{stats.totalCandidates}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{language === 'es' ? 'Candidatos' : 'Candidates'}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <UserPlus className="w-3 h-3" />
              <span>{stats.pendingCandidates} {language === 'es' ? 'pendientes' : 'pending'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-rose-600">{stats.completedCandidates}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{language === 'es' ? 'Evaluados' : 'Evaluated'}</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <Award className="w-3 h-3" />
              <span>{language === 'es' ? 'Perfiles completos' : 'Complete profiles'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">{stats.avgScore > 0 ? stats.avgScore + '%' : '-'}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{language === 'es' ? 'Score Promedio' : 'Avg Score'}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
              <BarChart3 className="w-3 h-3" />
              <span>{language === 'es' ? 'Rendimiento global' : 'Overall performance'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel de Insights y Tips - Diseño Sobrio */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Campaña Destacada */}
          {stats.mostActiveCampaign && (
            <Card className="lg:col-span-2 bg-slate-50 border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-200 rounded-xl">
                    <Trophy className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{language === 'es' ? 'Campaña Más Activa' : 'Most Active Campaign'}</h3>
                      <Badge className="bg-slate-700 text-white border-0">
                        <Star className="w-3 h-3 mr-1" />
                        Top
                      </Badge>
                    </div>
                    <p className="text-lg font-semibold text-slate-800">{stats.mostActiveCampaign.name}</p>
                    <p className="text-sm text-slate-600 mb-3">{stats.mostActiveCampaign.jobTitle}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Users className="w-4 h-4 text-slate-500" />
                        {stats.mostActiveCampaign.stats.totalCandidates} {language === 'es' ? 'candidatos' : 'candidates'}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        {stats.mostActiveCampaign.stats.completedCandidates} {language === 'es' ? 'evaluados' : 'evaluated'}
                      </span>
                      {stats.mostActiveCampaign.stats.avgScore > 0 && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <TrendingUp className="w-4 h-4" />
                          {stats.mostActiveCampaign.stats.avgScore}% score
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-700 hover:bg-slate-200"
                    onClick={() => router.push(`/campaigns/${stats.mostActiveCampaign?.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {language === 'es' ? 'Ver' : 'View'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tip del Día */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{language === 'es' ? 'Tip de Headhunter' : 'Headhunter Tip'}</h3>
                  <p className="text-sm text-gray-600">
                    {language === 'es' 
                      ? 'Combina DISC + EQ + Pruebas Técnicas para obtener un perfil 360° de tus candidatos y tomar mejores decisiones de contratación.'
                      : 'Combine DISC + EQ + Technical Tests to get a 360° profile of your candidates and make better hiring decisions.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros Modernos con View Toggle */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder={t('campaigns.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors rounded-xl"
              />
            </div>
            
            {/* Status Filter Pills */}
            <div className="flex gap-1.5 flex-wrap bg-gray-100 p-1 rounded-xl">
              {['all', 'ACTIVE', 'ANALYZING', 'COMPLETED', 'ARCHIVED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status 
                      ? 'bg-white text-indigo-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {status === 'all' ? t('campaigns.filter.all') : 
                   status === 'ACTIVE' ? t('campaigns.filter.active') :
                   status === 'ANALYZING' ? t('campaigns.filter.analyzing') :
                   status === 'COMPLETED' ? t('campaigns.filter.completed') : t('campaigns.filter.archived')}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Campañas */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-100 animate-pulse" />
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-gray-500 mt-4">{t('campaigns.loading')}</p>
          </div>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <Card className="border-dashed border-2 bg-gradient-to-br from-slate-50 to-indigo-50/30">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-12 h-12 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {campaigns.length === 0 ? t('campaigns.startFirst') : t('campaigns.noResults')}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {campaigns.length === 0
                ? t('campaigns.createFirstDesc')
                : t('campaigns.noResultsDesc')}
            </p>
            {campaigns.length === 0 && permissions.canCreate && (
              <Button 
                onClick={() => router.push('/campaigns/new')}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('campaigns.createFirst')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        /* Vista Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((campaign) => {
            const status = statusConfig[campaign.status] || statusConfig.DRAFT;
            const completionRate = campaign.stats.totalCandidates > 0
              ? Math.round((campaign.stats.completedCandidates / campaign.stats.totalCandidates) * 100)
              : 0;

            return (
              <Card
                key={campaign.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-0 shadow-lg bg-white"
                onClick={() => router.push(`/campaigns/${campaign.id}`)}
              >
                {/* Header con gradiente */}
                <div className={`p-4 bg-gradient-to-r ${status.bgGradient} text-white`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{campaign.name}</h3>
                      <p className="text-white/80 text-sm truncate">{campaign.jobTitle}</p>
                      <div className="mt-2">
                        <Badge className="border border-white/20 bg-white/15 text-white backdrop-blur-sm">
                          {campaignTypeConfig[campaign.campaignType as keyof typeof campaignTypeConfig]?.label || campaign.campaignType}
                        </Badge>
                      </div>
                    </div>
                    <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                      {status.icon}
                      <span className="ml-1">{status.label}</span>
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-indigo-50 rounded-lg">
                      <p className="text-lg font-bold text-indigo-600">{campaign.stats.totalCandidates}</p>
                      <p className="text-xs text-gray-500">{language === 'es' ? 'Candidatos' : 'Candidates'}</p>
                    </div>
                    <div className="text-center p-2 bg-emerald-50 rounded-lg">
                      <p className="text-lg font-bold text-emerald-600">{campaign.stats.completedCandidates}</p>
                      <p className="text-xs text-gray-500">{language === 'es' ? 'Evaluados' : 'Evaluated'}</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{campaign.stats.avgScore > 0 ? campaign.stats.avgScore + '%' : '-'}</p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  </div>

                  {/* Evaluation Types */}
                  {campaign.evaluationTypes && campaign.evaluationTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {campaign.evaluationTypes.map((type) => {
                        const evalIcon = getEvalTypeIcon(type);
                        return (
                          <span key={type} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${evalIcon.bg} ${evalIcon.color}`}>
                            {evalIcon.icon}
                            {type}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Progress */}
                  {campaign.stats.totalCandidates > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{language === 'es' ? 'Progreso' : 'Progress'}</span>
                        <span className="font-semibold">{completionRate}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${status.bgGradient} transition-all duration-500`}
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Hired Candidate (for COMPLETED campaigns) */}
                  {campaign.status === 'COMPLETED' && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg">
                      <Trophy className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                      <p className="text-xs text-teal-700 truncate">
                        {campaign.hiredCandidateName ? (
                          <><span className="font-medium">Contratado:</span> {campaign.hiredCandidateName}</>
                        ) : (
                          <span className="text-teal-500">Sin candidato contratado registrado</span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(campaign.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      {campaign.isPrivate ? <Lock className="w-3.5 h-3.5 text-gray-400" /> : <Globe className="w-3.5 h-3.5 text-emerald-500" />}
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Vista Lista */
        <div className="space-y-3">
          {filteredCampaigns.map((campaign) => {
            const status = statusConfig[campaign.status] || statusConfig.DRAFT;
            const completionRate = campaign.stats.totalCandidates > 0
              ? Math.round((campaign.stats.completedCandidates / campaign.stats.totalCandidates) * 100)
              : 0;

            return (
              <Card
                key={campaign.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-0 shadow-md bg-white"
                onClick={() => router.push(`/campaigns/${campaign.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Indicador de estado */}
                    <div className={`w-1.5 h-full min-h-[100px] rounded-full bg-gradient-to-b ${status.bgGradient} self-stretch`} />
                    
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {campaign.name}
                        </h3>
                        <Badge className={`${campaignTypeConfig[campaign.campaignType as keyof typeof campaignTypeConfig]?.color || 'bg-gray-100 text-gray-700 border-gray-200'} border font-medium`}>
                          {campaignTypeConfig[campaign.campaignType as keyof typeof campaignTypeConfig]?.label || campaign.campaignType}
                        </Badge>
                        <Badge className={`${status.color} flex items-center gap-1 border font-medium`}>
                          {status.icon}
                          {status.label}
                        </Badge>
                        {campaign.isPrivate ? (
                          <Badge variant="outline" className="text-gray-500 border-gray-300 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            {t('campaigns.private')}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-300 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {t('campaigns.public')}
                          </Badge>
                        )}
                        {campaign.allowTeamAddCandidates && (
                          <Badge variant="outline" className="text-blue-600 border-blue-300 flex items-center gap-1">
                            <UserPlus className="w-3 h-3" />
                            {t('campaigns.team')}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-indigo-500" />
                          <span className="font-medium">{campaign.jobTitle}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(campaign.createdAt)}
                        </span>
                        {campaign.jobCategory && (
                          <span className="flex items-center gap-1.5">
                            <Target className="w-4 h-4 text-purple-500" />
                            {campaign.jobCategory}
                          </span>
                        )}
                      </div>

                      {/* Evaluation Types */}
                      {campaign.evaluationTypes && campaign.evaluationTypes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {campaign.evaluationTypes.map((type) => {
                            const evalIcon = getEvalTypeIcon(type);
                            return (
                              <span key={type} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${evalIcon.bg} ${evalIcon.color}`}>
                                {evalIcon.icon}
                                {type}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Stats Row */}
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-indigo-100 rounded-xl">
                            <Users className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{campaign.stats.totalCandidates}</p>
                            <p className="text-xs text-gray-500">{t('campaigns.candidates')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-emerald-100 rounded-xl">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{campaign.stats.completedCandidates}</p>
                            <p className="text-xs text-gray-500">{t('campaigns.evaluated')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-amber-100 rounded-xl">
                            <Clock className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{campaign.stats.pendingCandidates}</p>
                            <p className="text-xs text-gray-500">{language === 'es' ? 'Pendientes' : 'Pending'}</p>
                          </div>
                        </div>
                        {campaign.stats.avgScore > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 rounded-xl">
                              <TrendingUp className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{campaign.stats.avgScore}%</p>
                              <p className="text-xs text-gray-500">{t('campaigns.avgScore')}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {campaign.stats.totalCandidates > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                            <span className="font-medium">{t('campaigns.progress')}</span>
                            <span className="font-bold text-indigo-600">{completionRate}%</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${status.bgGradient} transition-all duration-500`}
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {/* Hired Candidate (list view) */}
                      {campaign.status === 'COMPLETED' && (
                        <div className="flex items-center gap-2 mt-3 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg">
                          <Trophy className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                          <p className="text-xs text-teal-700 truncate">
                            {campaign.hiredCandidateName ? (
                              <><span className="font-medium">Contratado:</span> {campaign.hiredCandidateName}</>
                            ) : (
                              <span className="text-teal-500">Sin candidato contratado registrado</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all rounded-xl"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('campaigns.deleteConfirm')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('campaigns.deleteDesc').replace('{name}', campaign.name)}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>{t('campaigns.cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={(e) => handleDeleteCampaign(campaign.id, e)}
                              disabled={deletingId === campaign.id}
                            >
                              {deletingId === campaign.id ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('campaigns.deleting')}</>
                              ) : (
                                t('campaigns.delete')
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <div className="p-2 bg-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                        <ChevronRight className="w-5 h-5 text-indigo-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Footer Stats */}
      {filteredCampaigns.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 px-2">
          <span>
            {language === 'es' 
              ? `Mostrando ${filteredCampaigns.length} de ${campaigns.length} campañas`
              : `Showing ${filteredCampaigns.length} of ${campaigns.length} campaigns`}
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              {stats.activeCampaigns} {language === 'es' ? 'activas' : 'active'}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              {stats.completedCampaigns} {language === 'es' ? 'completadas' : 'completed'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
