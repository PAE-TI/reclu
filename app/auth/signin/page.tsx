'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
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
  Sparkles,
  Brain,
  Heart,
  ArrowRight,
  Eye,
  EyeOff,
  FileText,
  Compass,
  Dna,
  Target,
  Scale,
  Activity,
  Globe,
  FileCode,
  ShieldCheck
} from 'lucide-react';

export default function SignIn() {
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInactiveUser, setIsInactiveUser] = useState(false);
  const [isLockedUser, setIsLockedUser] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsInactiveUser(false);
    setIsLockedUser(false);

    if (!acceptTerms) {
      setError(t('auth.login.errorTerms'));
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'INACTIVE_USER' || result.error.includes('INACTIVE_USER')) {
          setIsInactiveUser(true);
        } else if (result.error === 'ACCOUNT_LOCKED' || result.error.includes('ACCOUNT_LOCKED')) {
          setIsLockedUser(true);
        } else {
          setError(t('auth.login.errorCredentials'));
        }
      } else {
        const session = await getSession();
        if (session) {
          // The user's saved language preference will be loaded from their profile
          // via the LanguageProvider's initialLanguage prop - no need to override it
          router.push('/dashboard');
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Error during signin:', error);
      setError(t('auth.login.errorInternal'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
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
            {t('auth.login.welcomeBack')}
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-md">
            {t('auth.login.welcomeDesc')}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t('auth.eval.disc')}</h3>
                <p className="text-gray-400 text-xs">{t('auth.eval.discDesc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t('auth.eval.df')}</h3>
                <p className="text-gray-400 text-xs">{t('auth.eval.dfDesc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t('auth.eval.eq')}</h3>
                <p className="text-gray-400 text-xs">{t('auth.eval.eqDesc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Dna className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t('auth.eval.dna')}</h3>
                <p className="text-gray-400 text-xs">{t('auth.eval.dnaDesc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t('auth.eval.aci')}</h3>
                <p className="text-gray-400 text-xs">{t('auth.eval.aciDesc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t('auth.eval.values')}</h3>
                <p className="text-gray-400 text-xs">{t('auth.eval.valuesDesc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t('auth.eval.stress')}</h3>
                <p className="text-gray-400 text-xs">{t('auth.eval.stressDesc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-xl p-3 border border-cyan-500/30">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t('auth.eval.technical')}</h3>
                <p className="text-cyan-300/70 text-xs">{t('auth.eval.technicalDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mb-48"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
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
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">{t('auth.login.title')}</CardTitle>
              <CardDescription className="text-center text-gray-500">
                {t('auth.login.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {isInactiveUser && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-amber-800">{t('auth.login.accountPending')}</h4>
                        <p className="text-sm text-amber-700">
                          {t('auth.login.accountPendingDesc')}
                        </p>
                        <p className="text-xs text-amber-600 mt-2">
                          {t('auth.login.accountPendingHint')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isLockedUser && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-rose-100 rounded-lg flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-rose-600" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-rose-800">Cuenta bloqueada temporalmente</h4>
                        <p className="text-sm text-rose-700">
                          Se detectaron demasiados intentos fallidos. Intenta de nuevo más tarde o contacta a un administrador.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {error && !isInactiveUser && !isLockedUser && (
                  <div className="flex items-center gap-3 p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    {t('auth.login.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.login.emailPlaceholder')}
                      className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    {t('auth.login.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-12 pr-12 h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
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
                      {t('auth.login.termsLabel')}{' '}
                      <Link 
                        href="/terms" 
                        target="_blank"
                        className="font-semibold text-cyan-600 hover:text-cyan-700 underline underline-offset-2"
                      >
                        {t('auth.login.termsLink')}
                      </Link>
                      {' '}{t('auth.login.ofReclu')}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      <FileText className="w-3 h-3 inline mr-1" />
                      {t('auth.login.dataProtected')}
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !acceptTerms}
                  className="w-full h-12 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white rounded-xl shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{t('auth.login.submitting')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{t('auth.login.submit')}</span>
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
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-center text-sm text-gray-600">
                  {t('auth.login.noAccount')}{' '}
                  <Link href="/auth/signup" className="font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">
                    {t('auth.login.signupFree')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center space-y-2">
            <Link href="/terms" className="text-xs text-gray-500 hover:text-cyan-600 transition-colors">
              {t('auth.login.termsFooter')}
            </Link>
            <p className="text-xs text-gray-400">
              {t('auth.login.copyright')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
