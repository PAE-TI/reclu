'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/language-context';
import { 
  AlertCircle, 
  Mail, 
  Lock, 
  User, 
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  Users,
  TrendingUp,
  FileText,
  Globe
} from 'lucide-react';

export default function SignUp() {
  const { language, setLanguage, t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [requiresActivation, setRequiresActivation] = useState(false);
  const [signupEnabled, setSignupEnabled] = useState(true);
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadPublicSettings = async () => {
      try {
        const response = await fetch('/api/settings/public');
        if (response.ok) {
          const data = await response.json();
          setSignupEnabled(data.signupEnabled !== false);
          setPasswordMinLength(Number(data.passwordMinLength || 8));
        }
      } catch (error) {
        console.error('Error loading public settings:', error);
      } finally {
        setLoadingSettings(false);
      }
    };

    loadPublicSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!acceptTerms) {
      setError(t('auth.signup.errorTerms'));
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.signup.errorPasswordMatch'));
      setIsLoading(false);
      return;
    }

    if (formData.password.length < passwordMinLength) {
      setError(t('auth.signup.errorPasswordLength'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          company: formData.company,
          password: formData.password,
          language: language, // Save current UI language to user profile
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('auth.signup.errorCreate'));
      }

      setSuccess(true);
      if (data.requiresActivation) {
        setRequiresActivation(true);
      } else {
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError(error instanceof Error ? error.message : t('auth.signup.errorCreate'));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    if (requiresActivation) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
          <Card className="max-w-md w-full shadow-2xl border-0">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('auth.signup.pendingTitle')}</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-amber-800 font-medium mb-2">{t('auth.login.accountPending')}</p>
                <p className="text-amber-700 text-sm">
                  {t('auth.signup.pendingDesc')}
                </p>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                {t('auth.signup.pendingHint')}
              </p>
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  {t('auth.signup.goToLogin')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <Card className="max-w-md w-full shadow-2xl border-0">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('auth.signup.successTitle')}</h2>
            <p className="text-gray-600 mb-6">
              {t('auth.signup.successDesc')}
            </p>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 overflow-auto">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">Reclu</span>
            </Link>
          </div>

          {/* Language Selector */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-cyan-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium">{language === 'es' ? 'ES' : 'EN'}</span>
            </button>
          </div>

          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">{t('auth.signup.title')}</CardTitle>
              <CardDescription className="text-center text-gray-500">
                {t('auth.signup.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!loadingSettings && !signupEnabled && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <h4 className="font-semibold text-amber-800 mb-1">Registro deshabilitado</h4>
                  <p className="text-sm text-amber-700">
                    El administrador desactivó temporalmente el registro de nuevos usuarios.
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-3 p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      {t('auth.signup.firstName')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder={t('auth.signup.firstNamePlaceholder')}
                        className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors"
                        required
                        disabled={!signupEnabled}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      {t('auth.signup.lastName')}
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder={t('auth.signup.lastNamePlaceholder')}
                      className="h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors"
                      required
                      disabled={!signupEnabled}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    {t('auth.signup.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('auth.signup.emailPlaceholder')}
                      className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors"
                      required
                      disabled={!signupEnabled}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-gray-700">
                    {t('auth.signup.company')}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder={t('auth.signup.companyPlaceholder')}
                      className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors"
                      required
                      disabled={!signupEnabled}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      {t('auth.signup.password')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={`•••••• (${passwordMinLength}+)`}
                        className="pl-10 pr-10 h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors"
                        required
                        disabled={!signupEnabled}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      {t('auth.signup.confirmPassword')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••"
                        className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors"
                        required
                        disabled={!signupEnabled}
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    className="mt-0.5 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                      {t('auth.signup.termsLabel')}{' '}
                      <Link 
                        href="/terms" 
                        target="_blank"
                        className="font-semibold text-cyan-600 hover:text-cyan-700 underline underline-offset-2"
                      >
                        {t('auth.signup.termsLink')}
                      </Link>
                      {' '}{t('auth.signup.andThe')}{' '}
                      <Link 
                        href="/terms#privacidad" 
                        target="_blank"
                        className="font-semibold text-cyan-600 hover:text-cyan-700 underline underline-offset-2"
                      >
                        {t('auth.signup.privacyLink')}
                      </Link>
                      {' '}{t('auth.signup.ofReclu')}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      <FileText className="w-3 h-3 inline mr-1" />
                      {t('auth.signup.dataProtected')}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading || !acceptTerms || !signupEnabled}
                  className="w-full h-12 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white rounded-xl shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>{t('auth.signup.submitting')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{t('auth.signup.submit')}</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>

                  {/* Encryption Indicator */}
                  <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs text-emerald-700 font-medium">
                      {t('auth.security.encrypted')}
                    </span>
                    <div className="flex items-center gap-1 ml-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-emerald-600 font-semibold">SSL/TLS</span>
                    </div>
                  </div>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-center text-sm text-gray-600">
                  {t('auth.signup.hasAccount')}{' '}
                  <Link href="/auth/signin" className="font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">
                    {t('auth.signup.login')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-gray-400">
            {t('auth.signup.copyright')}
          </p>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
          <div className="mb-12">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Reclu</span>
            </Link>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {t('auth.signup.heroTitle')}
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-md">
            {t('auth.signup.heroSubtitle')}
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{t('auth.signup.feature1')}</h3>
                <p className="text-gray-400 text-sm">{t('auth.signup.feature1Desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{t('auth.signup.feature2')}</h3>
                <p className="text-gray-400 text-sm">{t('auth.signup.feature2Desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{t('auth.signup.feature3')}</h3>
                <p className="text-gray-400 text-sm">{t('auth.signup.feature3Desc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mb-48"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>
    </div>
  );
}
