'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';
import {
  Building2,
  Mail,
  Lock,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Briefcase,
  User
} from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

export default function EditProfile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    company: '',
    jobTitle: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [changePassword, setChangePassword] = useState(false);
  const [passwordMinLength, setPasswordMinLength] = useState(8);

  // Cargar datos del usuario al montar
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        company: session.user.company || '',
        jobTitle: session.user.jobTitle || '',
      }));
    }
  }, [session]);

  // Redireccionar si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings/public');
        if (response.ok) {
          const data = await response.json();
          setPasswordMinLength(Number(data.passwordMinLength || 8));
        }
      } catch (error) {
        console.error('Error loading security settings:', error);
      }
    };

    loadSettings();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('profileEdit.firstNameRequired');
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = t('profileEdit.firstNameMinLength');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('profileEdit.lastNameRequired');
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = t('profileEdit.lastNameMinLength');
    }

    if (changePassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = t('profileEdit.currentPasswordRequired');
      }

      if (!formData.newPassword) {
        newErrors.newPassword = t('profileEdit.newPasswordRequired');
      } else if (formData.newPassword.length < passwordMinLength) {
        newErrors.newPassword = t('profileEdit.newPasswordMinLength');
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = t('profileEdit.passwordsDoNotMatch');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const requestData: any = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        company: formData.company.trim(),
        jobTitle: formData.jobTitle.trim(),
      };

      if (changePassword) {
        requestData.currentPassword = formData.currentPassword;
        requestData.newPassword = formData.newPassword;
        requestData.confirmPassword = formData.confirmPassword;
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({ general: result.error || t('profileEdit.updateError') });
        return;
      }

      // Actualizar la sesión con la nueva información
      await update({
        ...session,
        user: {
          ...session?.user,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          company: result.user.company,
          jobTitle: result.user.jobTitle,
          name: result.user.name,
        },
      });

      setSuccess(true);
      setErrors({});
      
      // Limpiar campos de contraseña
      if (changePassword) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setChangePassword(false);
      }

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setErrors({ general: t('profileEdit.connectionError') });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error específico del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Limpiar error general
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('profileEdit.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('profileEdit.backToProfile')}
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('profileEdit.title')}
          </h1>
          <p className="text-gray-600">
            {t('profileEdit.subtitle')}
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {t('profileEdit.success')}
            </AlertDescription>
          </Alert>
        )}

        {/* General Error Alert */}
        {errors.general && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {errors.general}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información de la Empresa */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                {t('profileEdit.companyInfoTitle')}
              </CardTitle>
              <CardDescription>
                {t('profileEdit.companyInfoDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">{t('profile.companyName')}</Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder={t('profile.companyPlaceholder')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información del Administrador */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                {t('profileEdit.adminInfoTitle')}
              </CardTitle>
              <CardDescription>
                {t('profileEdit.adminInfoDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('profileEdit.firstName')} *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    placeholder={t('profileEdit.firstNamePlaceholder')}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('profileEdit.lastName')} *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    placeholder={t('profileEdit.lastNamePlaceholder')}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  {t('profileEdit.jobTitle')}
                </Label>
                <Input
                  id="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder={t('profileEdit.jobTitlePlaceholder')}
                />
              </div>

              {/* Email - Solo lectura */}
              <div className="space-y-2">
                <Label>
                  <Mail className="w-4 h-4 inline mr-1" />
                  {t('profileEdit.corporateEmail')}
                </Label>
                <div className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                  <span className="text-gray-700">{session?.user?.email}</span>
                  <span className="ml-2 text-xs text-gray-500">{t('profileEdit.notEditable')}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {t('profileEdit.emailSecurityNote')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cambiar Contraseña */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-indigo-600" />
                    {t('profileEdit.securityTitle')}
                  </CardTitle>
                  <CardDescription>
                    {t('profileEdit.securityDesc')}
                  </CardDescription>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setChangePassword(!changePassword);
                    if (changePassword) {
                      setFormData(prev => ({
                        ...prev,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      }));
                      setErrors(prev => ({
                        ...prev,
                        currentPassword: undefined,
                        newPassword: undefined,
                        confirmPassword: undefined
                      }));
                    }
                  }}
                >
                  {changePassword ? t('profileEdit.cancelChange') : t('profileEdit.changePassword')}
                </Button>
              </div>
            </CardHeader>
            
            {changePassword && (
              <CardContent className="space-y-4">
                <Separator className="mb-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t('profileEdit.currentPassword')} *</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      className={errors.currentPassword ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
                      placeholder={t('profileEdit.currentPasswordPlaceholder')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-red-600">{errors.currentPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('profileEdit.newPassword')} *</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className={errors.newPassword ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
                      placeholder={t('profileEdit.newPasswordPlaceholder')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-red-600">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('profileEdit.confirmNewPassword')} *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
                      placeholder={t('profileEdit.confirmPasswordPlaceholder')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('profileEdit.saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('profileEdit.saveChanges')}
                </>
              )}
            </Button>
            
            <Link href="/profile" className="flex-shrink-0">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                {t('profileEdit.cancel')}
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
