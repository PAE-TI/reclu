'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Search,
  Eye,
  Power,
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  Calendar,
  FileText,
  Loader2,
  AlertTriangle,
  Crown,
  Settings,
  Coins,
  Plus,
  UsersRound,
  Link2,
  Briefcase,
  Code,
  FileCode,
  Trash2,
  Clock3,
  ShieldAlert,
  History,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PayPalSettingsCard } from '@/components/admin/paypal-settings';
import { CreditSalesCard } from '@/components/admin/credit-sales';

interface OwnerInfo {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
}

interface TeamMemberInfo {
  id: string;
  accessLevel: 'FULL_ACCESS' | 'OWN_EVALUATIONS';
  status: string;
  jobTitle: string;
  invitedAt: string;
  acceptedAt: string | null;
}

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  jobTitle: string | null;
  role: 'USER' | 'ADMIN' | 'FACILITATOR';
  isActive: boolean;
  credits: number;
  ownerId: string | null;
  owner: OwnerInfo | null;
  memberOf: TeamMemberInfo | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    sentExternalEvaluations: number;
    sentExternalDrivingForcesEvaluations: number;
    sentExternalEQEvaluations: number;
    sentExternalDNAEvaluations: number;
    sentExternalAcumenEvaluations: number;
    sentExternalValuesEvaluations: number;
    sentExternalStressEvaluations: number;
    teamMembers: number;
    facilitators: number;
  };
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  facilitatorUsers: number;
  mainUsers: number;
}

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  summary: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  actor: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface OwnerInfoDetail {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  credits: number;
}

interface UserDetail {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  jobTitle: string | null;
  role: 'USER' | 'ADMIN' | 'FACILITATOR';
  isActive: boolean;
  credits: number;
  ownerId: string | null;
  owner: OwnerInfoDetail | null;
  memberOf: TeamMemberInfo | null;
  createdAt: string;
  updatedAt: string;
  sentExternalEvaluations: { id: string; recipientEmail: string; recipientName: string; status: string; createdAt: string; completedAt: string | null }[];
  sentExternalDrivingForcesEvaluations: { id: string; recipientEmail: string; recipientName: string; status: string; createdAt: string; completedAt: string | null }[];
  sentExternalEQEvaluations: { id: string; recipientEmail: string; recipientName: string; status: string; createdAt: string; completedAt: string | null }[];
  sentExternalDNAEvaluations: { id: string; recipientEmail: string; recipientName: string; status: string; createdAt: string; completedAt: string | null }[];
  sentExternalAcumenEvaluations: { id: string; recipientEmail: string; recipientName: string; status: string; createdAt: string; completedAt: string | null }[];
  sentExternalValuesEvaluations: { id: string; recipientEmail: string; recipientName: string; status: string; createdAt: string; completedAt: string | null }[];
  sentExternalStressEvaluations: { id: string; recipientEmail: string; recipientName: string; status: string; createdAt: string; completedAt: string | null }[];
  _count: {
    sentExternalEvaluations: number;
    sentExternalDrivingForcesEvaluations: number;
    sentExternalEQEvaluations: number;
    sentExternalDNAEvaluations: number;
    sentExternalAcumenEvaluations: number;
    sentExternalValuesEvaluations: number;
    sentExternalStressEvaluations: number;
  };
}

export default function AdminPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'USER' | 'ADMIN' | 'FACILITATOR'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [toggling, setToggling] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [defaultUserActive, setDefaultUserActive] = useState(true);
  const [defaultCredits, setDefaultCredits] = useState(100);
  const [creditsPerEvaluation, setCreditsPerEvaluation] = useState(2);
  const [signupEnabled, setSignupEnabled] = useState(true);
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [loginMaxAttempts, setLoginMaxAttempts] = useState(5);
  const [loginLockoutMinutes, setLoginLockoutMinutes] = useState(15);
  const [technicalEvaluationExpiryDays, setTechnicalEvaluationExpiryDays] = useState(30);
  const [allowExternalPdfExport, setAllowExternalPdfExport] = useState(true);
  const [auditRetentionDays, setAuditRetentionDays] = useState(180);
  const [savingSettings, setSavingSettings] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(true);
  
  // Recharge dialog
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
  const [userToRecharge, setUserToRecharge] = useState<User | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState(50);
  const [recharging, setRecharging] = useState(false);
  
  const itemsPerPage = 10;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    fetchUsers();
    fetchSettings();
    fetchAuditLogs();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setDefaultUserActive(data.settings.defaultUserActive === 'true');
        setDefaultCredits(parseInt(data.settings.defaultCredits || '100'));
        setCreditsPerEvaluation(parseInt(data.settings.creditsPerEvaluation || '2'));
        setSignupEnabled(data.settings.signupEnabled !== 'false');
        setPasswordMinLength(parseInt(data.settings.passwordMinLength || '8'));
        setLoginMaxAttempts(parseInt(data.settings.loginMaxAttempts || '5'));
        setLoginLockoutMinutes(parseInt(data.settings.loginLockoutMinutes || '15'));
        setTechnicalEvaluationExpiryDays(parseInt(data.settings.technicalEvaluationExpiryDays || '30'));
        setAllowExternalPdfExport(data.settings.allowExternalPdfExport !== 'false');
        setAuditRetentionDays(parseInt(data.settings.auditRetentionDays || '180'));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSetting = async (key: string, value: string, successMessage: string) => {
    setSavingSettings(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      
      if (!response.ok) throw new Error('Error al actualizar');
      toast.success(successMessage);
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Error al actualizar la configuración');
    } finally {
      setSavingSettings(false);
    }
  };

  const updateDefaultUserActive = async (value: boolean) => {
    setDefaultUserActive(value);
    await updateSetting('defaultUserActive', String(value), 
      value ? 'Usuarios activos automáticamente' : 'Usuarios requieren activación');
  };

  const updateDefaultCredits = async (value: number) => {
    setDefaultCredits(value);
    await updateSetting('defaultCredits', String(value), `Créditos iniciales: ${value}`);
  };

  const updateCreditsPerEvaluation = async (value: number) => {
    setCreditsPerEvaluation(value);
    await updateSetting('creditsPerEvaluation', String(value), `Créditos por evaluación: ${value}`);
  };

  const updateSignupEnabled = async (value: boolean) => {
    setSignupEnabled(value);
    await updateSetting(
      'signupEnabled',
      String(value),
      value ? 'Registro habilitado' : 'Registro deshabilitado'
    );
  };

  const updatePasswordMinLength = async (value: number) => {
    setPasswordMinLength(value);
    await updateSetting('passwordMinLength', String(value), `Longitud mínima de contraseña: ${value}`);
  };

  const updateLoginMaxAttempts = async (value: number) => {
    setLoginMaxAttempts(value);
    await updateSetting('loginMaxAttempts', String(value), `Intentos máximos: ${value}`);
  };

  const updateLoginLockoutMinutes = async (value: number) => {
    setLoginLockoutMinutes(value);
    await updateSetting('loginLockoutMinutes', String(value), `Bloqueo por ${value} min`);
  };

  const updateTechnicalEvaluationExpiryDays = async (value: number) => {
    setTechnicalEvaluationExpiryDays(value);
    await updateSetting('technicalEvaluationExpiryDays', String(value), `Vigencia técnica: ${value} días`);
  };

  const updateAllowExternalPdfExport = async (value: boolean) => {
    setAllowExternalPdfExport(value);
    await updateSetting(
      'allowExternalPdfExport',
      String(value),
      value ? 'Exportación PDF habilitada' : 'Exportación PDF deshabilitada'
    );
  };

  const updateAuditRetentionDays = async (value: number) => {
    setAuditRetentionDays(value);
    await updateSetting('auditRetentionDays', String(value), `Retención de auditoría: ${value} días`);
  };

  const rechargeCredits = async () => {
    if (!userToRecharge || rechargeAmount <= 0) return;
    setRecharging(true);
    try {
      const response = await fetch('/api/admin/credits/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userToRecharge.id, amount: rechargeAmount })
      });
      if (!response.ok) throw new Error('Error');
      const data = await response.json();
      
      // Actualizar inmediatamente el usuario en la lista local
      setUsers(prevUsers => prevUsers.map(u => 
        u.id === userToRecharge.id ? { ...u, credits: data.newBalance } : u
      ));
      
      toast.success(`${rechargeAmount} créditos agregados a ${userToRecharge.firstName || userToRecharge.email}. Nuevo balance: ${data.newBalance}`);
    } catch (error) {
      toast.error('Error al recargar créditos');
    } finally {
      setRecharging(false);
      setRechargeDialogOpen(false);
      setUserToRecharge(null);
      setRechargeAmount(50);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        if (response.status === 403) {
          toast.error('No tienes permisos de administrador');
          router.push('/dashboard');
          return;
        }
        throw new Error('Error al cargar usuarios');
      }
      const data = await response.json();
      setUsers(data.users);
      setStats(data.stats);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/admin/audit?limit=8');
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setAuditLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoadingAudit(false);
    }
  };

  const fetchUserDetail = async (userId: string) => {
    setLoadingDetail(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (!response.ok) throw new Error('Error al cargar detalles');
      const data = await response.json();
      setSelectedUser(data.user);
      setDetailDialogOpen(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar detalles del usuario');
    } finally {
      setLoadingDetail(false);
    }
  };

  const toggleUserStatus = async () => {
    if (!userToToggle) return;
    
    setToggling(true);
    try {
      const response = await fetch(`/api/admin/users/${userToToggle.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !userToToggle.isActive })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al actualizar');
      }
      
      toast.success(`Usuario ${!userToToggle.isActive ? 'activado' : 'desactivado'} correctamente`);
      fetchUsers();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar usuario');
    } finally {
      setToggling(false);
      setToggleDialogOpen(false);
      setUserToToggle(null);
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al eliminar');
      }
      toast.success(`Usuario ${userToDelete.firstName || userToDelete.email} eliminado correctamente`);
      fetchUsers();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar usuario');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const changeUserRole = async (userId: string, newRole: 'USER' | 'ADMIN' | 'FACILITATOR') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al actualizar');
      }
      
      toast.success('Rol actualizado correctamente');
      fetchUsers();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar rol');
    }
  };

  // Filtrado
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.company?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTotalEvaluations = (user: User) => {
    return (
      user._count.sentExternalEvaluations +
      user._count.sentExternalDrivingForcesEvaluations +
      user._count.sentExternalEQEvaluations +
      user._count.sentExternalDNAEvaluations +
      user._count.sentExternalAcumenEvaluations +
      user._count.sentExternalValuesEvaluations +
      user._count.sentExternalStressEvaluations
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        </div>
        <p className="text-gray-600">Gestiona los usuarios registrados en la plataforma</p>
      </div>

      <Tabs defaultValue="overview" className="w-full mb-8">
        <TabsList className="mb-6 flex w-full flex-wrap justify-start gap-2 bg-transparent p-0 h-auto">
          <TabsTrigger value="overview" className="rounded-xl border border-slate-200 bg-white px-4 py-2 data-[state=active]:border-indigo-300 data-[state=active]:bg-indigo-50">
            Resumen
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-xl border border-slate-200 bg-white px-4 py-2 data-[state=active]:border-indigo-300 data-[state=active]:bg-indigo-50">
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl border border-slate-200 bg-white px-4 py-2 data-[state=active]:border-indigo-300 data-[state=active]:bg-indigo-50">
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-xl border border-slate-200 bg-white px-4 py-2 data-[state=active]:border-indigo-300 data-[state=active]:bg-indigo-50">
            Créditos y pagos
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-xl border border-slate-200 bg-white px-4 py-2 data-[state=active]:border-indigo-300 data-[state=active]:bg-indigo-50">
            Auditoría
          </TabsTrigger>
          <TabsTrigger value="technical" className="rounded-xl border border-slate-200 bg-white px-4 py-2 data-[state=active]:border-indigo-300 data-[state=active]:bg-indigo-50">
            Pruebas técnicas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-700">{stats.totalUsers}</p>
                      <p className="text-xs text-blue-600">Total Usuarios</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-indigo-700">{stats.mainUsers}</p>
                      <p className="text-xs text-indigo-600">Principales</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <UsersRound className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-700">{stats.facilitatorUsers}</p>
                      <p className="text-xs text-amber-600">Facilitadores</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <UserCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-700">{stats.activeUsers}</p>
                      <p className="text-xs text-green-600">Activos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <UserX className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-700">{stats.inactiveUsers}</p>
                      <p className="text-xs text-red-600">Inactivos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Crown className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-700">{stats.adminUsers}</p>
                      <p className="text-xs text-purple-600">Admins</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-600" />
                <span className="text-slate-900">Estado general</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Registro</p>
                <p className="font-semibold text-slate-900">{signupEnabled ? 'Habilitado' : 'Deshabilitado'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Password min.</p>
                <p className="font-semibold text-slate-900">{passwordMinLength} caracteres</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Pruebas técnicas</p>
                <p className="font-semibold text-slate-900">{technicalEvaluationExpiryDays} días de vigencia</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">PDF externo</p>
                <p className="font-semibold text-slate-900">{allowExternalPdfExport ? 'Habilitado' : 'Deshabilitado'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* Filters */}
          <Card className="mb-0">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre, email o empresa..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value: 'all' | 'active' | 'inactive') => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={roleFilter}
                  onValueChange={(value: 'all' | 'USER' | 'ADMIN' | 'FACILITATOR') => {
                    setRoleFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    <SelectItem value="USER">Usuario</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="FACILITATOR">Facilitador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Usuarios Registrados
                </CardTitle>
                <Badge variant="outline" className="bg-white">
                  {filteredUsers.length} usuarios
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Table Header - Desktop */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-3">Usuario</div>
                <div className="col-span-3">Organización</div>
                <div className="col-span-2">Tipo / Rol</div>
                <div className="col-span-1">Estado</div>
                <div className="col-span-1">Créditos</div>
                <div className="col-span-1">Eval.</div>
                <div className="col-span-1 text-right">Acciones</div>
              </div>

              {/* User Cards */}
              <div className="divide-y divide-gray-100">
                {paginatedUsers.map((user) => {
                  const isFacilitator = user.ownerId !== null;
                  const ownerName = user.owner 
                    ? (user.owner.firstName && user.owner.lastName 
                        ? `${user.owner.firstName} ${user.owner.lastName}` 
                        : user.owner.email)
                    : null;
                  const ownerCompany = user.owner?.company || 'Sin empresa';
                  
                  return (
                    <div 
                      key={user.id} 
                      className={`lg:grid lg:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50/80 transition-colors ${
                        isFacilitator ? 'bg-gradient-to-r from-amber-50/40 to-transparent' : ''
                      }`}
                    >
                      {/* Usuario Column */}
                      <div className="col-span-3 flex items-center gap-3 mb-3 lg:mb-0">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-semibold relative shadow-sm ${
                          user.role === 'ADMIN' 
                            ? 'bg-gradient-to-br from-purple-500 to-violet-600' 
                            : isFacilitator 
                              ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                              : 'bg-gradient-to-br from-indigo-500 to-blue-600'
                        }`}>
                          {user.firstName?.[0] || user.email[0].toUpperCase()}
                          {user.role === 'ADMIN' && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center ring-2 ring-white">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {isFacilitator && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center ring-2 ring-white">
                              <Link2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 truncate">
                            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Sin nombre'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Organización Column - Redesigned */}
                      <div className="col-span-3 mb-3 lg:mb-0">
                        {isFacilitator ? (
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-200/60">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 bg-amber-100 rounded-md">
                                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                              </div>
                              <span className="font-semibold text-amber-800 text-sm truncate">{ownerCompany}</span>
                            </div>
                            <div className="space-y-1.5 pl-1">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-gray-500 w-16">Invitó:</span>
                                <span className="font-medium text-gray-700 truncate">{ownerName}</span>
                              </div>
                              {user.memberOf && (
                                <>
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-500 w-16">Cargo:</span>
                                    <span className="text-gray-700 truncate">{user.memberOf.jobTitle}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs pt-1">
                                    <Badge 
                                      className={`text-[10px] px-2 py-0.5 ${
                                        user.memberOf.accessLevel === 'FULL_ACCESS' 
                                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                          : 'bg-gray-100 text-gray-600 border-gray-200'
                                      }`}
                                    >
                                      {user.memberOf.accessLevel === 'FULL_ACCESS' ? '✓ Acceso completo' : '○ Solo sus evaluaciones'}
                                    </Badge>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200/60">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 bg-indigo-100 rounded-md">
                                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                              </div>
                              <span className="font-semibold text-gray-800 text-sm truncate">
                                {user.company || 'Sin empresa'}
                              </span>
                            </div>
                            {user._count.facilitators > 0 && (
                              <div className="flex items-center gap-2 pl-1">
                                <Badge className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-700 border-indigo-200">
                                  <UsersRound className="w-3 h-3 mr-1" />
                                  {user._count.facilitators} facilitador{user._count.facilitators > 1 ? 'es' : ''}
                                </Badge>
                              </div>
                            )}
                            {user._count.facilitators === 0 && (
                              <p className="text-xs text-gray-400 pl-1">Usuario principal</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Tipo/Rol Column */}
                      <div className="col-span-2 flex items-center mb-3 lg:mb-0">
                        {isFacilitator ? (
                          <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200 hover:from-amber-100 hover:to-orange-100">
                            <UsersRound className="w-3 h-3 mr-1.5" />
                            Facilitador
                          </Badge>
                        ) : (
                          <Select
                            value={user.role}
                            onValueChange={(value: 'USER' | 'ADMIN' | 'FACILITATOR') => changeUserRole(user.id, value)}
                            disabled={user.email === session?.user?.email}
                          >
                            <SelectTrigger className="w-28 h-8 text-xs bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USER">Usuario</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      {/* Estado Column */}
                      <div className="col-span-1 flex items-center mb-3 lg:mb-0">
                        <Badge 
                          className={`${
                            user.isActive 
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                              : 'bg-red-100 text-red-700 border-red-200'
                          }`}
                        >
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>

                      {/* Créditos Column */}
                      <div className="col-span-1 flex items-center gap-1 mb-3 lg:mb-0">
                        {isFacilitator ? (
                          <span className="text-xs text-gray-400 italic">Usa del dueño</span>
                        ) : (
                          <>
                            <Badge 
                              variant="outline" 
                              className={`${
                                user.credits > 0 
                                  ? 'border-amber-300 bg-amber-50 text-amber-700' 
                                  : 'border-red-300 bg-red-50 text-red-700'
                              }`}
                            >
                              <Coins className="w-3 h-3 mr-1" />
                              {user.credits}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setUserToRecharge(user);
                                setRechargeDialogOpen(true);
                              }}
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-6 w-6 p-0"
                              title="Recargar créditos"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Evaluaciones Column */}
                      <div className="col-span-1 flex items-center mb-3 lg:mb-0">
                        <span className="text-gray-700 font-semibold">{getTotalEvaluations(user)}</span>
                      </div>

                      {/* Acciones Column */}
                      <div className="col-span-1 flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchUserDetail(user.id)}
                          disabled={loadingDetail}
                          className="h-8 w-8 p-0 hover:bg-indigo-50"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4 text-indigo-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setUserToToggle(user);
                            setToggleDialogOpen(true);
                          }}
                          disabled={user.email === session?.user?.email}
                          className={`h-8 w-8 p-0 ${
                            user.isActive 
                              ? 'text-red-500 hover:text-red-700 hover:bg-red-50' 
                              : 'text-green-500 hover:text-green-700 hover:bg-green-50'
                          }`}
                          title={user.isActive ? 'Desactivar' : 'Activar'}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setUserToDelete(user);
                            setDeleteDialogOpen(true);
                          }}
                          disabled={user.email === session?.user?.email}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <p className="text-sm text-gray-600">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} de {filteredUsers.length}
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
                  {currentPage} de {totalPages}
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

        <TabsContent value="security" className="space-y-6">
          <Card className="mb-0 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-600" />
                <span className="text-amber-900">Registro y acceso</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-amber-200 bg-white/70 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Permitir nuevos registros</h4>
                      <p className="text-sm text-gray-600">
                        {signupEnabled
                          ? 'Los usuarios pueden crear una cuenta desde la página pública.'
                          : 'El registro público está deshabilitado temporalmente.'
                        }
                      </p>
                    </div>
                    <Switch
                      checked={signupEnabled}
                      onCheckedChange={updateSignupEnabled}
                      disabled={savingSettings}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-white/70 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Activación automática de nuevos usuarios</h4>
                      <p className="text-sm text-gray-600">
                        {defaultUserActive
                          ? 'Los nuevos usuarios pueden acceder inmediatamente después de registrarse.'
                          : 'Los nuevos usuarios deben ser activados manualmente por un administrador antes de poder acceder.'
                        }
                      </p>
                    </div>
                    <Switch
                      checked={defaultUserActive}
                      onCheckedChange={updateDefaultUserActive}
                      disabled={savingSettings}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-0 border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-600" />
                <span className="text-rose-900">Seguridad de la plataforma</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-rose-200 bg-white/75 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Longitud mínima de contraseña</h4>
                      <p className="text-sm text-gray-600 mb-3">Se aplica a nuevos registros y cambios de contraseña.</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="8"
                          max="64"
                          value={passwordMinLength}
                          onChange={(e) => setPasswordMinLength(Math.max(8, parseInt(e.target.value) || 8))}
                          className="w-24 text-center font-semibold"
                          disabled={savingSettings}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updatePasswordMinLength(passwordMinLength)}
                          disabled={savingSettings}
                          className="border-rose-300 text-rose-700 hover:bg-rose-100"
                        >
                          {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-white/75 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Intentos fallidos de acceso</h4>
                      <p className="text-sm text-gray-600 mb-3">Bloquea temporalmente la cuenta cuando supera el límite.</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          value={loginMaxAttempts}
                          onChange={(e) => setLoginMaxAttempts(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-24 text-center font-semibold"
                          disabled={savingSettings}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateLoginMaxAttempts(loginMaxAttempts)}
                          disabled={savingSettings}
                          className="border-rose-300 text-rose-700 hover:bg-rose-100"
                        >
                          {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-white/75 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Tiempo de bloqueo</h4>
                      <p className="text-sm text-gray-600 mb-3">Tiempo en minutos antes de permitir nuevos intentos.</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="1440"
                          value={loginLockoutMinutes}
                          onChange={(e) => setLoginLockoutMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-24 text-center font-semibold"
                          disabled={savingSettings}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateLoginLockoutMinutes(loginLockoutMinutes)}
                          disabled={savingSettings}
                          className="border-rose-300 text-rose-700 hover:bg-rose-100"
                        >
                          {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-white/75 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Vigencia de pruebas técnicas</h4>
                      <p className="text-sm text-gray-600 mb-3">Tiempo por defecto para que una evaluación técnica siga disponible.</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="365"
                          value={technicalEvaluationExpiryDays}
                          onChange={(e) => setTechnicalEvaluationExpiryDays(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-24 text-center font-semibold"
                          disabled={savingSettings}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTechnicalEvaluationExpiryDays(technicalEvaluationExpiryDays)}
                          disabled={savingSettings}
                          className="border-rose-300 text-rose-700 hover:bg-rose-100"
                        >
                          {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-white/75 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Exportación PDF externa</h4>
                      <p className="text-sm text-gray-600">
                        Permite descargar reportes PDF desde resultados de pruebas externas y técnicas.
                      </p>
                    </div>
                    <Switch
                      checked={allowExternalPdfExport}
                      onCheckedChange={updateAllowExternalPdfExport}
                      disabled={savingSettings}
                      className="data-[state=checked]:bg-rose-500"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-white/75 p-5 xl:col-span-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Retención de auditoría</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Días sugeridos para conservar eventos y registros críticos de seguridad.
                      </p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="7"
                          max="3650"
                          value={auditRetentionDays}
                          onChange={(e) => setAuditRetentionDays(Math.max(7, parseInt(e.target.value) || 7))}
                          className="w-28 text-center font-semibold"
                          disabled={savingSettings}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAuditRetentionDays(auditRetentionDays)}
                          disabled={savingSettings}
                          className="border-rose-300 text-rose-700 hover:bg-rose-100"
                        >
                          {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="mb-0 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-900">Configuración de Créditos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Créditos iniciales para nuevos usuarios</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Cantidad de créditos que recibe automáticamente un usuario al registrarse.
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={defaultCredits}
                      onChange={(e) => setDefaultCredits(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-24 text-center font-semibold"
                      disabled={savingSettings}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateDefaultCredits(defaultCredits)}
                      disabled={savingSettings}
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                    >
                      {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Créditos por evaluación enviada</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Cantidad de créditos que se descuentan al enviar una evaluación (cualquier tipo).
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={creditsPerEvaluation}
                      onChange={(e) => setCreditsPerEvaluation(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 text-center font-semibold"
                      disabled={savingSettings}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCreditsPerEvaluation(creditsPerEvaluation)}
                      disabled={savingSettings}
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                    >
                      {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <PayPalSettingsCard />
          <CreditSalesCard />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card className="mb-0 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-slate-600" />
                <span className="text-slate-900">Auditoría reciente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAudit ? (
                <div className="flex items-center gap-2 text-slate-500 py-6">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Cargando eventos de auditoría...</span>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-5 text-sm text-slate-600">
                  Aún no hay eventos de auditoría registrados.
                </div>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                              {log.action}
                            </Badge>
                            <span className="text-sm font-medium text-slate-900">{log.summary}</span>
                          </div>
                          <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                            <span>{log.actor.name || log.actor.email}</span>
                            <span>{log.entityType}{log.entityId ? ` · ${log.entityId}` : ''}</span>
                            <span>{formatDate(log.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock3 className="w-3.5 h-3.5" />
                        <span>{new Date(log.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <Card className="overflow-hidden border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-sm">
            <CardContent className="p-6">
              <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-700">
                    <Code className="w-3.5 h-3.5" />
                    Pruebas técnicas
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-900">
                    Banco de preguntas, cargos y plantillas en un solo centro
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    Administra preguntas, revisa cobertura por cargo y entra a las plantillas técnicas desde una vista más limpia, rápida y fácil de operar.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button onClick={() => router.push('/admin/technical-questions?tab=overview')} className="bg-sky-600 hover:bg-sky-700">
                      <FileCode className="w-4 h-4 mr-2" />
                      Abrir panel técnico
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/admin/technical-questions?tab=questions')}>
                      Banco de preguntas
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/admin/technical-questions?tab=templates')}>
                      Plantillas
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600">Crear</p>
                    <p className="mt-2 text-sm text-slate-700">Nueva pregunta técnica con soporte bilingüe.</p>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600">Cobertura</p>
                    <p className="mt-2 text-sm text-slate-700">Revisa cargos cubiertos y nivel de dificultad.</p>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600">Plantillas</p>
                    <p className="mt-2 text-sm text-slate-700">Sets reutilizables para enviar pruebas más rápido.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                    selectedUser.role === 'ADMIN' ? 'bg-purple-500' : selectedUser.role === 'FACILITATOR' ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}>
                    {selectedUser.firstName?.[0] || selectedUser.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg">
                      {selectedUser.firstName && selectedUser.lastName ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'Sin nombre'}
                    </p>
                    <p className="text-sm font-normal text-gray-500">{selectedUser.email}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Facilitator Info Banner */}
                {selectedUser.ownerId && selectedUser.owner && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <UsersRound className="w-5 h-5 text-amber-600" />
                      <span className="font-medium text-amber-800">Este usuario es un Facilitador</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-500" />
                        <span className="text-gray-600">Empresa:</span>
                        <span className="font-medium text-amber-700">{selectedUser.owner.company || 'No especificada'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-amber-500" />
                        <span className="text-gray-600">Invitado por:</span>
                        <span className="font-medium text-amber-700">
                          {selectedUser.owner.firstName && selectedUser.owner.lastName 
                            ? `${selectedUser.owner.firstName} ${selectedUser.owner.lastName}`
                            : selectedUser.owner.email}
                        </span>
                      </div>
                      {selectedUser.memberOf && (
                        <>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-amber-500" />
                            <span className="text-gray-600">Cargo:</span>
                            <span className="font-medium">{selectedUser.memberOf.jobTitle}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-amber-500" />
                            <span className="text-gray-600">Nivel de acceso:</span>
                            <Badge variant="outline" className="border-amber-300 text-amber-700">
                              {selectedUser.memberOf.accessLevel === 'FULL_ACCESS' ? 'Acceso completo' : 'Solo sus evaluaciones'}
                            </Badge>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Info básica */}
                <div className="grid grid-cols-2 gap-4">
                  {!selectedUser.ownerId && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Empresa:</span>
                      <span className="font-medium">{selectedUser.company || 'No especificada'}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Tipo:</span>
                    <Badge variant="outline">
                      {selectedUser.ownerId ? 'Facilitador' : selectedUser.role === 'ADMIN' ? 'Administrador' : 'Usuario Principal'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Registro:</span>
                    <span className="font-medium">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Power className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Estado:</span>
                    <Badge className={selectedUser.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {selectedUser.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>

                {/* Créditos del usuario - Solo para usuarios principales */}
                {selectedUser.ownerId ? (
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Coins className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Créditos del facilitador</p>
                        <p className="text-gray-700">
                          Los facilitadores usan los créditos del usuario principal.
                          <span className="font-medium text-amber-700 ml-1">
                            Balance del dueño: {selectedUser.owner?.credits || 0} créditos
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Coins className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-amber-700">Balance de Créditos</p>
                          <p className="text-2xl font-bold text-amber-900">{selectedUser.credits || 0}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setDetailDialogOpen(false);
                          setUserToRecharge(users.find(u => u.id === selectedUser.id) || null);
                          setRechargeDialogOpen(true);
                        }}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Recargar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Resumen de evaluaciones */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Resumen de Evaluaciones Enviadas
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-blue-50 p-2 rounded-lg text-center">
                      <p className="text-lg font-bold text-blue-700">{selectedUser._count.sentExternalEvaluations}</p>
                      <p className="text-xs text-blue-600">DISC</p>
                    </div>
                    <div className="bg-amber-50 p-2 rounded-lg text-center">
                      <p className="text-lg font-bold text-amber-700">{selectedUser._count.sentExternalDrivingForcesEvaluations}</p>
                      <p className="text-xs text-amber-600">FM</p>
                    </div>
                    <div className="bg-rose-50 p-2 rounded-lg text-center">
                      <p className="text-lg font-bold text-rose-700">{selectedUser._count.sentExternalEQEvaluations}</p>
                      <p className="text-xs text-rose-600">EQ</p>
                    </div>
                    <div className="bg-teal-50 p-2 rounded-lg text-center">
                      <p className="text-lg font-bold text-teal-700">{selectedUser._count.sentExternalDNAEvaluations}</p>
                      <p className="text-xs text-teal-600">DNA</p>
                    </div>
                    <div className="bg-cyan-50 p-2 rounded-lg text-center">
                      <p className="text-lg font-bold text-cyan-700">{selectedUser._count.sentExternalAcumenEvaluations}</p>
                      <p className="text-xs text-cyan-600">ACI</p>
                    </div>
                    <div className="bg-violet-50 p-2 rounded-lg text-center">
                      <p className="text-lg font-bold text-violet-700">{selectedUser._count.sentExternalValuesEvaluations}</p>
                      <p className="text-xs text-violet-600">Valores</p>
                    </div>
                    <div className="bg-orange-50 p-2 rounded-lg text-center">
                      <p className="text-lg font-bold text-orange-700">{selectedUser._count.sentExternalStressEvaluations}</p>
                      <p className="text-xs text-orange-600">Estrés</p>
                    </div>
                    <div className="bg-indigo-50 p-2 rounded-lg text-center">
                      <p className="text-lg font-bold text-indigo-700">
                        {selectedUser._count.sentExternalEvaluations +
                         selectedUser._count.sentExternalDrivingForcesEvaluations +
                         selectedUser._count.sentExternalEQEvaluations +
                         selectedUser._count.sentExternalDNAEvaluations +
                         selectedUser._count.sentExternalAcumenEvaluations +
                         selectedUser._count.sentExternalValuesEvaluations +
                         selectedUser._count.sentExternalStressEvaluations}
                      </p>
                      <p className="text-xs text-indigo-600">Total</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Toggle Status Dialog */}
      <Dialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className={userToToggle?.isActive ? 'text-red-500' : 'text-green-500'} />
              {userToToggle?.isActive ? 'Desactivar Usuario' : 'Activar Usuario'}
            </DialogTitle>
            <DialogDescription>
              {userToToggle?.isActive
                ? `¿Estás seguro de desactivar a ${userToToggle?.firstName || userToToggle?.email}? El usuario no podrá acceder a la plataforma.`
                : `¿Estás seguro de activar a ${userToToggle?.firstName || userToToggle?.email}? El usuario podrá acceder nuevamente a la plataforma.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToggleDialogOpen(false)} disabled={toggling}>
              Cancelar
            </Button>
            <Button
              onClick={toggleUserStatus}
              disabled={toggling}
              className={userToToggle?.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {toggling ? <Loader2 className="w-4 h-4 animate-spin" /> : (userToToggle?.isActive ? 'Desactivar' : 'Activar')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="text-red-500" />
              Eliminar Usuario
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <p>
                  ¿Estás seguro de que deseas eliminar a <strong>{userToDelete?.firstName ? `${userToDelete.firstName} ${userToDelete.lastName || ''}`.trim() : userToDelete?.email}</strong>?
                </p>
                <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong>Esta acción no se puede deshacer.</strong> Se eliminarán permanentemente el usuario y <strong>todas las evaluaciones que ha enviado</strong>, notificaciones y datos relacionados.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Cancelar
            </Button>
            <Button
              onClick={deleteUser}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Eliminar Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recharge Credits Dialog */}
      <Dialog open={rechargeDialogOpen} onOpenChange={setRechargeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coins className="text-amber-500" />
              Recargar Créditos
            </DialogTitle>
            <DialogDescription>
              Agrega créditos a {userToRecharge?.firstName || userToRecharge?.email}. 
              Balance actual: <span className="font-semibold text-amber-600">{userToRecharge?.credits || 0} créditos</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad de créditos a agregar
            </label>
            <Input
              type="number"
              min="1"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(Math.max(1, parseInt(e.target.value) || 0))}
              className="text-center text-lg font-semibold"
            />
            <div className="flex gap-2 mt-3">
              {[10, 25, 50, 100, 200].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setRechargeAmount(amount)}
                  className={`flex-1 ${rechargeAmount === amount ? 'border-amber-400 bg-amber-50 text-amber-700' : ''}`}
                >
                  +{amount}
                </Button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Nuevo balance: <span className="font-semibold text-green-600">{(userToRecharge?.credits || 0) + rechargeAmount} créditos</span>
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setRechargeDialogOpen(false);
                setUserToRecharge(null);
                setRechargeAmount(50);
              }} 
              disabled={recharging}
            >
              Cancelar
            </Button>
            <Button
              onClick={rechargeCredits}
              disabled={recharging || rechargeAmount <= 0}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {recharging ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Agregar {rechargeAmount} créditos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
