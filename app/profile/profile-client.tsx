'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/language-context';
import {
  Building2,
  Mail,
  Calendar,
  Shield,
  Briefcase,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Save,
  X,
  Sparkles,
  Users,
  UserCheck,
  Info,
  FileText,
  Clock,
  UserX,
  Crown
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  jobTitle: string | null;
  role: string;
  memberSince: string;
}

interface FacilitatorInfo {
  isFacilitator: boolean;
  accessLevel: string;
  jobTitle: string | null;
  assignedName: string; // Name assigned by owner when inviting
  invitedAt: Date;
  owner: {
    id: string;
    name: string;
    email: string;
    company: string | null;
  };
}

interface TeamMemberData {
  id: string;
  email: string;
  name: string;
  jobTitle: string | null;
  accessLevel: string;
  status: string;
  totalEvaluations: number;
  memberSince: string | null;
  facilitator?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    isActive: boolean;
  } | null;
}

interface ProfileClientProps {
  user: UserData;
  facilitatorInfo?: FacilitatorInfo | null;
  teamMembers?: TeamMemberData[];
}

export default function ProfileClient({ user, facilitatorInfo, teamMembers = [] }: ProfileClientProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const isFacilitator = !!facilitatorInfo;

  // Form states - facilitators can only edit their name
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    company: user.company || '',
    jobTitle: user.jobTitle || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  
  // For facilitators, show owner's company
  const displayCompany = isFacilitator ? facilitatorInfo?.owner.company : user.company;
  // For facilitators, show job title from TeamMember
  const displayJobTitle = isFacilitator ? facilitatorInfo?.jobTitle : user.jobTitle;

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t('profile.updateError'));
      }

      setSuccess(t('profile.profileUpdated'));
      setIsEditing(false);
      setTimeout(() => {
        setSuccess('');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError(t('profile.fillAllPasswordFields'));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError(t('profile.passwordMinLength'));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t('profile.passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t('profile.passwordChangeError'));
      }

      setSuccess(t('profile.passwordUpdated'));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      company: user.company || '',
      jobTitle: user.jobTitle || '',
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Facilitator Banner */}
        {isFacilitator && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800">{t('profile.facilitatorAccount')}</h3>
                <p className="text-sm text-amber-700 mt-1">
                  {t('profile.invitedBy')} <span className="font-medium">{facilitatorInfo?.owner.name}</span> ({facilitatorInfo?.owner.email})
                </p>
                {facilitatorInfo?.assignedName && (
                  <p className="text-sm text-amber-600 mt-1">
                    <span className="text-amber-500">{t('profile.assignedName')}:</span> <span className="font-medium">{facilitatorInfo.assignedName}</span>
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                    {facilitatorInfo?.accessLevel === 'FULL_ACCESS' ? t('profile.fullAccess') : t('profile.ownEvaluations')}
                  </Badge>
                  <Badge variant="outline" className="border-amber-300 text-amber-700">
                    <Building2 className="w-3 h-3 mr-1" />
                    {facilitatorInfo?.owner.company || t('profile.noCompany')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header con Avatar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar grande con iniciales */}
            <div className="relative">
              <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg ${
                isFacilitator 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              }`}>
                <span className="text-3xl font-bold text-white">{initials}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <Badge className={`${
                  isFacilitator 
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' 
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100'
                }`}>
                  {isFacilitator ? <Users className="w-3 h-3 mr-1" /> : <Shield className="w-3 h-3 mr-1" />}
                  {isFacilitator ? t('profile.facilitator') : user.role === 'ADMIN' ? t('profile.admin') : t('profile.mainUser')}
                </Badge>
              </div>
              <p className="text-gray-600 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {displayCompany || t('profile.noCompany')}
                {displayJobTitle && (
                  <span className="text-gray-400">• {displayJobTitle}</span>
                )}
              </p>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {t('profile.memberSince')} {user.memberSince}
              </p>
            </div>

            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)}
                className={isFacilitator ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'}
              >
                <Pencil className="w-4 h-4 mr-2" />
                {t('profile.editProfile')}
              </Button>
            )}
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <Card className="bg-white border-0 shadow-lg overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${isFacilitator ? 'from-amber-500 to-orange-500' : 'from-indigo-500 to-purple-500'}`} />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className={`w-5 h-5 ${isFacilitator ? 'text-amber-600' : 'text-indigo-600'}`} />
                  {t('profile.personalInfo')}
                </CardTitle>
                <CardDescription>
                  {isFacilitator ? t('profile.personalInfoDescFacilitator') : t('profile.personalInfoDescAdmin')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('profile.firstName')}</Label>
                    {isEditing ? (
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="mt-1"
                        placeholder={t('profileEdit.firstNamePlaceholder')}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 font-medium">{user.firstName || '-'}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('profile.lastName')}</Label>
                    {isEditing ? (
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="mt-1"
                        placeholder={t('profileEdit.lastNamePlaceholder')}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 font-medium">{user.lastName || '-'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {t('profile.email')}
                  </Label>
                  <p className="mt-1 text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isFacilitator 
                      ? t('profile.emailModifiedByOwner')
                      : t('profile.emailCannotBeModified')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Información de la Empresa / Organización */}
            <Card className="bg-white border-0 shadow-lg overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${isFacilitator ? 'from-orange-500 to-rose-500' : 'from-purple-500 to-pink-500'}`} />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className={`w-5 h-5 ${isFacilitator ? 'text-orange-600' : 'text-purple-600'}`} />
                  {isFacilitator ? t('profile.orgInfo') : t('profile.companyInfo')}
                </CardTitle>
                <CardDescription>
                  {isFacilitator 
                    ? t('profile.orgInfoDesc')
                    : t('profile.companyInfoDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('profile.companyName')}</Label>
                    {isEditing && !isFacilitator ? (
                      <Input
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="mt-1"
                        placeholder={t('profile.companyPlaceholder')}
                      />
                    ) : (
                      <>
                        <p className="mt-1 text-gray-900 font-medium">{displayCompany || t('profile.notSpecified')}</p>
                        {isFacilitator && (
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            {t('profile.definedByOwner')}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {t('profile.jobTitle')}
                    </Label>
                    {isEditing && !isFacilitator ? (
                      <Input
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="mt-1"
                        placeholder={t('profile.jobTitlePlaceholder')}
                      />
                    ) : (
                      <>
                        <p className="mt-1 text-gray-900">{displayJobTitle || t('profile.notSpecified')}</p>
                        {isFacilitator && (
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            {t('profile.onlyChangedByOwner')}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Facilitator-specific: Show who invited them */}
                {isFacilitator && (
                  <div className="pt-3 border-t border-gray-100">
                    <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> {t('profile.invitedByLabel')}
                    </Label>
                    <div className="mt-2 flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                        {facilitatorInfo?.owner.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{facilitatorInfo?.owner.name}</p>
                        <p className="text-sm text-gray-500">{facilitatorInfo?.owner.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Botones de edición */}
            {isEditing && (
              <div className="flex gap-3">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className={`flex-1 ${isFacilitator ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {t('profile.saveChanges')}
                </Button>
                <Button 
                  onClick={cancelEdit}
                  variant="outline"
                  disabled={loading}
                >
                  <X className="w-4 h-4 mr-2" />
                  {t('profile.cancel')}
                </Button>
              </div>
            )}

            {/* Info note for facilitators when editing */}
            {isEditing && isFacilitator && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  {t('profile.facilitatorEditNote')}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seguridad - Cambiar Contraseña */}
            <Card className="bg-white border-0 shadow-lg overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${isFacilitator ? 'from-rose-500 to-pink-500' : 'from-amber-500 to-orange-500'}`} />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lock className={`w-5 h-5 ${isFacilitator ? 'text-rose-600' : 'text-amber-600'}`} />
                  {t('profile.security')}
                </CardTitle>
                <CardDescription>
                  {t('profile.managePassword')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showPasswordSection ? (
                  <Button 
                    onClick={() => setShowPasswordSection(true)}
                    variant="outline"
                    className={`w-full ${isFacilitator ? 'border-rose-200 text-rose-700 hover:bg-rose-50' : 'border-amber-200 text-amber-700 hover:bg-amber-50'}`}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {t('profile.changePassword')}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">{t('profile.currentPassword')}</Label>
                      <div className="relative mt-1">
                        <Input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          placeholder="••••••••"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        >
                          {showPasswords.current ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">{t('profile.newPassword')}</Label>
                      <div className="relative mt-1">
                        <Input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder={t('profile.minChars')}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        >
                          {showPasswords.new ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">{t('profile.confirmPassword')}</Label>
                      <div className="relative mt-1">
                        <Input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder={t('profile.repeatPassword')}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        >
                          {showPasswords.confirm ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={handleChangePassword}
                        disabled={loading}
                        size="sm"
                        className={`flex-1 ${isFacilitator ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                      >
                        {loading ? t('profile.saving') : t('profile.update')}
                      </Button>
                      <Button 
                        onClick={() => {
                          setShowPasswordSection(false);
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          setError('');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        {t('profile.cancel')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card informativa */}
            <Card className={`border-0 shadow-lg ${
              isFacilitator 
                ? 'bg-gradient-to-br from-amber-600 to-orange-600' 
                : 'bg-gradient-to-br from-indigo-600 to-purple-600'
            }`}>
              <CardContent className="p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  {isFacilitator ? <Users className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  <h3 className="font-semibold">{isFacilitator ? t('profile.facilitatorReclu') : t('profile.recluPro')}</h3>
                </div>
                <p className={`text-sm mb-4 ${isFacilitator ? 'text-amber-100' : 'text-indigo-100'}`}>
                  {isFacilitator 
                    ? t('profile.facilitatorAccessDesc')
                    : t('profile.proAccessDesc')}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {['DISC', 'FM', 'EQ', 'DNA', 'ACI', 'Val', 'Str'].map((eval_type) => (
                    <div key={eval_type} className="text-center">
                      <div className="w-8 h-8 mx-auto rounded-lg bg-white/20 flex items-center justify-center text-xs font-medium">
                        {eval_type}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Info adicional */}
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-5">
                <h4 className="font-medium text-gray-900 mb-3">{t('profile.accountInfo')}</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('profile.userId')}</span>
                    <span className="font-mono text-xs text-gray-400">{user.id.slice(0, 8)}...</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('profile.role')}</span>
                    <span className={`font-medium ${isFacilitator ? 'text-amber-600' : 'text-indigo-600'}`}>
                      {isFacilitator ? t('profile.facilitator') : user.role === 'ADMIN' ? t('profile.admin') : t('profile.mainUser')}
                    </span>
                  </div>
                  {isFacilitator && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t('profile.accessLevel')}</span>
                        <Badge className={`${
                          facilitatorInfo?.accessLevel === 'FULL_ACCESS' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                        }`}>
                          {facilitatorInfo?.accessLevel === 'FULL_ACCESS' ? t('profile.fullAccessLevel') : t('profile.limitedAccessLevel')}
                        </Badge>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('profile.status')}</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{t('profile.active')}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Members Card - Only for owners (non-facilitators) */}
        {!isFacilitator && teamMembers.length > 0 && (
          <Card className="bg-white border-0 shadow-lg overflow-hidden mt-6">
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t('profile.myTeam')}</CardTitle>
                    <CardDescription>
                      {teamMembers.length} {teamMembers.length !== 1 ? t('profile.teamMembers') : t('profile.teamMember')}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/team')}
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  <Users className="w-4 h-4 mr-1" />
                  {t('profile.manageTeam')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Team Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-indigo-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-indigo-600">{teamMembers.length}</p>
                  <p className="text-xs text-indigo-600">{t('profile.totalMembers')}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {teamMembers.filter(m => m.status === 'ACCEPTED').length}
                  </p>
                  <p className="text-xs text-green-600">{t('profile.activeMembers')}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-amber-600">
                    {teamMembers.filter(m => m.status === 'PENDING').length}
                  </p>
                  <p className="text-xs text-amber-600">{t('profile.pendingMembers')}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {teamMembers.reduce((acc, m) => acc + m.totalEvaluations, 0)}
                  </p>
                  <p className="text-xs text-purple-600">{t('profile.evaluationsCount')}</p>
                </div>
              </div>

              {/* Team Members List */}
              <div className="space-y-3">
                {teamMembers.map((member) => {
                  const memberName = member.facilitator 
                    ? `${member.facilitator.firstName || ''} ${member.facilitator.lastName || ''}`.trim() || member.name
                    : member.name;
                  const initials = memberName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                  const isActive = member.status === 'ACCEPTED' && member.facilitator?.isActive;
                  const isPending = member.status === 'PENDING';

                  return (
                    <div 
                      key={member.id}
                      className={`p-4 rounded-lg border transition-all ${
                        isPending 
                          ? 'bg-amber-50 border-amber-200' 
                          : isActive 
                            ? 'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200'
                            : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                          isPending 
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                            : isActive
                              ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                              : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        }`}>
                          {initials}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900 truncate">{memberName}</h4>
                            {isPending && (
                              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                                <Clock className="w-3 h-3 mr-1" />
                                {t('profile.pending')}
                              </Badge>
                            )}
                            {!isPending && !isActive && (
                              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                <UserX className="w-3 h-3 mr-1" />
                                {t('profile.inactive')}
                              </Badge>
                            )}
                            {isActive && (
                              <Badge className={`${
                                member.accessLevel === 'FULL_ACCESS'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                              }`}>
                                {member.accessLevel === 'FULL_ACCESS' ? (
                                  <>
                                    <Crown className="w-3 h-3 mr-1" />
                                    {t('profile.fullAccess')}
                                  </>
                                ) : (
                                  <>
                                    <Shield className="w-3 h-3 mr-1" />
                                    {t('profile.onlyTheirEvaluations')}
                                  </>
                                )}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </span>
                            {member.jobTitle && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                {member.jobTitle}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        {isActive && (
                          <div className="text-right hidden sm:block">
                            <div className="flex items-center gap-1 text-purple-600">
                              <FileText className="w-4 h-4" />
                              <span className="font-semibold">{member.totalEvaluations}</span>
                            </div>
                            <p className="text-xs text-gray-500">{t('profile.evaluations')}</p>
                            {member.memberSince && (
                              <p className="text-xs text-gray-400 mt-1">
                                {t('profile.since')} {member.memberSince}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State for Team - Only for owners without team members */}
        {!isFacilitator && teamMembers.length === 0 && (
          <Card className="bg-white border-0 shadow-lg overflow-hidden mt-6">
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('profile.noTeamYet')}</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {t('profile.noTeamDesc')}
              </p>
              <Button 
                onClick={() => router.push('/team')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Users className="w-4 h-4 mr-2" />
                {t('profile.createMyTeam')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
