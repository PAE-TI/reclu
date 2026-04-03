'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  UserPlus,
  Mail,
  Copy,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Building2,
  Briefcase,
  Shield,
  Eye,
  Send,
  Loader2,
  Edit,
  MoreVertical,
  Sparkles,
  FileText,
  TrendingUp,
  UsersRound
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/language-context';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  jobTitle: string;
  accessLevel: 'FULL_ACCESS' | 'OWN_EVALUATIONS';
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  inviteToken: string;
  invitedAt: string;
  acceptedAt: string | null;
  lastActiveAt: string | null;
  facilitator: {
    id: string;
    email: string;
    name: string;
    lastActiveAt: string | null;
  } | null;
  stats: {
    evaluationsSent: number;
  };
}

export default function TeamPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const { t } = useLanguage();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    accessLevel: 'OWN_EVALUATIONS'
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchTeamMembers();
  }, [session, status, router]);

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data.teamMembers || []);
        setCompany(data.company || '');
      }
    } catch (error) {
      console.error('Error fetching team:', error);
      toast.error(t('team.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!formData.name || !formData.email || !formData.jobTitle) {
      toast.error(t('team.allFieldsRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t('team.inviteSent'));
        setInviteDialogOpen(false);
        setFormData({ name: '', email: '', jobTitle: '', accessLevel: 'OWN_EVALUATIONS' });
        fetchTeamMembers();
      } else {
        toast.error(data.error || t('team.inviteError'));
      }
    } catch (error) {
      console.error('Error inviting member:', error);
      toast.error(t('team.inviteError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendInvite = async (memberId: string) => {
    try {
      const res = await fetch(`/api/team/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend' })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t('team.inviteResent'));
        fetchTeamMembers();
      } else {
        toast.error(data.error || t('team.resendError'));
      }
    } catch (error) {
      console.error('Error resending invite:', error);
      toast.error(t('team.resendError'));
    }
  };

  const handleCopyLink = async (token: string) => {
    const link = `${window.location.origin}/team/invite/${token}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success(t('team.linkCopied'));
    } catch (error) {
      toast.error(t('team.copyError'));
    }
  };

  const handleUpdateMember = async () => {
    if (!selectedMember) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/team/${selectedMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedMember.name,
          jobTitle: selectedMember.jobTitle,
          accessLevel: selectedMember.accessLevel
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t('team.memberUpdated'));
        setEditDialogOpen(false);
        setSelectedMember(null);
        fetchTeamMembers();
      } else {
        toast.error(data.error || t('team.updateError'));
      }
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error(t('team.updateError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const res = await fetch(`/api/team/${memberId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t('team.memberRemoved'));
        fetchTeamMembers();
      } else {
        toast.error(data.error || t('team.removeError'));
      }
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error(t('team.removeError'));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" />{t('team.statusActive')}</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />{t('team.statusPending')}</Badge>;
      case 'EXPIRED':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200"><AlertCircle className="w-3 h-3 mr-1" />{t('team.statusExpired')}</Badge>;
      case 'REVOKED':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />{t('team.statusRevoked')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAccessLevelBadge = (level: string) => {
    if (level === 'FULL_ACCESS') {
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200"><Eye className="w-3 h-3 mr-1" />{t('team.fullAccessShort')}</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Shield className="w-3 h-3 mr-1" />{t('team.ownEvaluations')}</Badge>;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const activeMembers = teamMembers.filter(m => m.status === 'ACCEPTED');
  const pendingMembers = teamMembers.filter(m => m.status === 'PENDING');
  const totalEvaluationsSent = teamMembers.reduce((acc, m) => acc + (m.stats?.evaluationsSent || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Hero Section - Diseño Profesional Sobrio */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-6 mb-6 shadow-xl">
          {/* Efectos decorativos sutiles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-slate-700/30 to-slate-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-slate-600/20 to-slate-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <UsersRound className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-white">
                    {t('team.title')}
                  </h1>
                  <p className="text-slate-400 text-xs">Reclu Team Management</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm lg:text-base max-w-xl">
                {t('team.description')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-lg border-0">
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t('team.inviteFacilitator')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <UserPlus className="w-5 h-5 text-indigo-600" />
                      </div>
                      {t('team.inviteNewFacilitator')}
                    </DialogTitle>
                    <DialogDescription>
                      {t('team.inviteDescription')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">{t('team.fullName')}</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('team.namePlaceholder')}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">{t('team.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t('team.emailPlaceholder')}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="jobTitle">{t('team.jobTitle')}</Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        placeholder={t('team.jobTitlePlaceholder')}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="accessLevel">{t('team.accessLevel')}</Label>
                      <Select
                        value={formData.accessLevel}
                        onValueChange={(value) => setFormData({ ...formData, accessLevel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OWN_EVALUATIONS">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-blue-600" />
                              <span>{t('team.ownEvaluations')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="FULL_ACCESS">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-purple-600" />
                              <span>{t('team.fullAccess')}</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        {formData.accessLevel === 'FULL_ACCESS' 
                          ? t('team.fullAccessDescription')
                          : t('team.ownEvaluationsDescription')
                        }
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                      {t('team.cancel')}
                    </Button>
                    <Button onClick={handleInvite} disabled={submitting} className="bg-slate-900 hover:bg-slate-800">
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('team.sending')}</>
                      ) : (
                        <><Send className="w-4 h-4 mr-2" />{t('team.sendInvitation')}</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats Cards - Diseño Sobrio */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t('team.activeMembers')}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{activeMembers.length}</p>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-xl">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t('team.pending')}</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{pendingMembers.length}</p>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-xl">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t('team.evaluationsSent')}</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{totalEvaluationsSent}</p>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t('team.yourCompany')}</p>
                  <p className="text-sm font-bold text-slate-900 truncate max-w-[120px] mt-1">{company || t('team.noCompany')}</p>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-xl">
                  <Building2 className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members List */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Users className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900">{t('team.teamMembers')}</CardTitle>
                  <CardDescription className="text-slate-500">
                    {t('team.teamMembersDescription')}
                  </CardDescription>
                </div>
              </div>
              {teamMembers.length > 0 && (
                <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                  {teamMembers.filter(m => m.status !== 'REVOKED').length} {t('team.members')}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {teamMembers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('team.noMembers')}</h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                  {t('team.noMembersDescription')}
                </p>
                <Button 
                  onClick={() => setInviteDialogOpen(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('team.inviteFacilitator')}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {teamMembers.filter(m => m.status !== 'REVOKED').map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-all gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                        member.status === 'ACCEPTED' 
                          ? 'bg-slate-800' 
                          : 'bg-amber-500'
                      }`}>
                        <span className="text-lg font-bold text-white">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">{member.name}</p>
                          {getStatusBadge(member.status)}
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" /> {member.email}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400" /> {member.jobTitle}
                        </p>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          {getAccessLevelBadge(member.accessLevel)}
                          {member.status === 'ACCEPTED' && (
                            <Badge variant="outline" className="text-xs bg-white border-emerald-200 text-emerald-700">
                              <FileText className="w-3 h-3 mr-1" />
                              {member.stats.evaluationsSent} {t('team.evaluations')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
                      {member.status === 'PENDING' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(member.inviteToken)}
                            className="bg-white hover:bg-gray-50"
                          >
                            <Copy className="w-4 h-4 mr-1" /> {t('team.copy')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendInvite(member.id)}
                            className="bg-white hover:bg-gray-50"
                          >
                            <RefreshCw className="w-4 h-4 mr-1" /> {t('team.resend')}
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMember(member);
                          setEditDialogOpen(true);
                        }}
                        className="bg-white hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-white text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                              {t('team.removeMember')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {member.status === 'ACCEPTED' 
                                ? t('team.removeMemberActiveDescription').replace('{name}', member.name)
                                : t('team.removeMemberPendingDescription').replace('{name}', member.name)
                              }
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('team.cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveMember(member.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {t('team.delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Member Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Edit className="w-5 h-5 text-indigo-600" />
                </div>
                {t('team.editMember')}
              </DialogTitle>
              <DialogDescription>
                {t('team.editMemberDescription')}
              </DialogDescription>
            </DialogHeader>
            {selectedMember && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">{t('team.fullName')}</Label>
                  <Input
                    id="edit-name"
                    value={selectedMember.name}
                    onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">{t('team.email')}</Label>
                  <Input
                    id="edit-email"
                    value={selectedMember.email}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500">{t('team.emailNotEditable')}</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-jobTitle">{t('team.jobTitle')}</Label>
                  <Input
                    id="edit-jobTitle"
                    value={selectedMember.jobTitle}
                    onChange={(e) => setSelectedMember({ ...selectedMember, jobTitle: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-accessLevel">{t('team.accessLevel')}</Label>
                  <Select
                    value={selectedMember.accessLevel}
                    onValueChange={(value: 'FULL_ACCESS' | 'OWN_EVALUATIONS') => 
                      setSelectedMember({ ...selectedMember, accessLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWN_EVALUATIONS">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span>{t('team.ownEvaluations')}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FULL_ACCESS">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-purple-600" />
                          <span>{t('team.fullAccessShort')}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                {t('team.cancel')}
              </Button>
              <Button onClick={handleUpdateMember} disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700">
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('team.saving')}</>
                ) : (
                  t('team.saveChanges')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
