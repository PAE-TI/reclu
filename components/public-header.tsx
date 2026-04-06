'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import {
  Sparkles,
  Target,
  Flame,
  Heart,
  Dna,
  Compass,
  Shield,
  Activity,
  ChevronDown,
  Clock,
  Menu,
  X,
  Briefcase,
  Globe,
  FileCode
} from 'lucide-react';

const colorClasses: Record<string, { bg: string; text: string; hover: string }> = {
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hover: 'hover:bg-indigo-50' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-50' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', hover: 'hover:bg-rose-50' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', hover: 'hover:bg-teal-50' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', hover: 'hover:bg-amber-50' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600', hover: 'hover:bg-violet-50' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-50' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-600', hover: 'hover:bg-sky-50' }
};

export default function PublicHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileEvaluationsOpen, setIsMobileEvaluationsOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const evaluations = [
    { slug: 'disc', nameKey: 'eval.disc.name', descKey: 'eval.disc.desc', durationKey: 'eval.disc.duration', icon: Target, color: 'indigo' },
    { slug: 'fuerzas-motivadoras', nameKey: 'eval.df.name', descKey: 'eval.df.desc', durationKey: 'eval.df.duration', icon: Flame, color: 'purple' },
    { slug: 'inteligencia-emocional', nameKey: 'eval.eq.name', descKey: 'eval.eq.desc', durationKey: 'eval.eq.duration', icon: Heart, color: 'rose' },
    { slug: 'dna-25', nameKey: 'eval.dna.name', descKey: 'eval.dna.desc', durationKey: 'eval.dna.duration', icon: Dna, color: 'teal' },
    { slug: 'acumen', nameKey: 'eval.aci.name', descKey: 'eval.aci.desc', durationKey: 'eval.aci.duration', icon: Compass, color: 'amber' },
    { slug: 'valores-integridad', nameKey: 'eval.values.name', descKey: 'eval.values.desc', durationKey: 'eval.values.duration', icon: Shield, color: 'violet' },
    { slug: 'estres-resiliencia', nameKey: 'eval.stress.name', descKey: 'eval.stress.desc', durationKey: 'eval.stress.duration', icon: Activity, color: 'orange' },
    { slug: 'pruebas-tecnicas', nameKey: 'eval.technical.name', descKey: 'eval.technical.desc', durationKey: 'eval.technical.duration', icon: FileCode, color: 'sky', isNew: true }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isEvaluacionesActive = pathname.startsWith('/evaluaciones');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Reclu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Evaluaciones Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isEvaluacionesActive ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {t('header.evaluations')}
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-2">
                    <Link
                      href="/evaluaciones"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{language === 'es' ? 'Ver Todas las Evaluaciones' : 'View All Assessments'}</p>
                        <p className="text-xs text-gray-500">{language === 'es' ? 'Explora las 8 evaluaciones científicas' : 'Explore all 8 scientific assessments'}</p>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-100" />
                  
                  <div className="p-2 grid grid-cols-2 gap-1">
                    {evaluations.map((evaluation) => {
                      const IconComponent = evaluation.icon;
                      const colors = colorClasses[evaluation.color];
                      const evalWithNew = evaluation as typeof evaluation & { isNew?: boolean };
                      return (
                        <Link
                          key={evaluation.slug}
                          href={`/evaluaciones/${evaluation.slug}`}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${colors.hover} transition-all group relative`}
                        >
                          {evalWithNew.isNew && (
                            <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                              {language === 'es' ? 'NUEVO' : 'NEW'}
                            </span>
                          )}
                          <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <IconComponent className={`w-4 h-4 ${colors.text}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{t(evaluation.nameKey)}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {t(evaluation.durationKey)}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <a 
              href="/#campanas" 
              className="flex items-center gap-1.5 text-gray-600 hover:text-cyan-600 transition-colors text-sm font-medium"
            >
              <Briefcase className="w-4 h-4" />
              {t('header.campaigns')}
            </a>
            <a href="/#beneficios" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium">{t('header.benefits')}</a>
            <a href="/#faq" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium">{t('header.faq')}</a>
          </div>

          {/* Auth Buttons & Language Selector */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
              >
                <Globe className="w-4 h-4" />
                {language.toUpperCase()}
                <ChevronDown className={`w-3 h-3 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLangDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden min-w-[100px]">
                  <button
                    onClick={() => { setLanguage('es'); setIsLangDropdownOpen(false); }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 ${language === 'es' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'}`}
                  >
                    <span className="text-base">🇪🇸</span> Español
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setIsLangDropdownOpen(false); }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 ${language === 'en' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'}`}
                  >
                    <span className="text-base">🇺🇸</span> English
                  </button>
                </div>
              )}
            </div>

            <Link href="/auth/signin">
              <Button variant="ghost" className="text-gray-700 hover:text-indigo-600">{t('header.login')}</Button>
            </Link>
            <Link href="/mis-resultados">
              <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                {language === 'es' ? 'Ver mis resultados' : 'View my results'}
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25">
                {t('header.startFree')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-indigo-600"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-2">
            {/* Language Selector Mobile */}
            <div className="flex items-center justify-center gap-2 pb-3 border-b border-gray-100">
              <button
                onClick={() => setLanguage('es')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${language === 'es' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span>🇪🇸</span> ES
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${language === 'en' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span>🇺🇸</span> EN
              </button>
            </div>
            
            {/* Evaluaciones - Desplegable */}
            <div className="px-4">
              <button
                onClick={() => setIsMobileEvaluationsOpen(!isMobileEvaluationsOpen)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEvaluacionesActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{t('header.evaluations')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileEvaluationsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isMobileEvaluationsOpen && (
                <div className="mt-2 ml-2 pl-2 border-l-2 border-indigo-100 space-y-1">
                  <Link
                    href="/evaluaciones"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900">{language === 'es' ? 'Ver Todas' : 'View All'}</span>
                      <p className="text-xs text-gray-500">{language === 'es' ? '8 evaluaciones científicas' : '8 scientific assessments'}</p>
                    </div>
                  </Link>
                  
                  {evaluations.map((evaluation) => {
                    const IconComponent = evaluation.icon;
                    const colors = colorClasses[evaluation.color];
                    return (
                      <Link
                        key={evaluation.slug}
                        href={`/evaluaciones/${evaluation.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-7 h-7 ${colors.bg} rounded-md flex items-center justify-center`}>
                          <IconComponent className={`w-3.5 h-3.5 ${colors.text}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{t(evaluation.nameKey)}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <a
              href="/#campanas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-600"
            >
              <Briefcase className="w-4 h-4" />
              {t('header.campaigns')}
            </a>

            <a
              href="/#beneficios"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              {t('header.benefits')}
            </a>

            <a
              href="/#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              {t('header.faq')}
            </a>

            <div className="pt-4 border-t border-gray-100 space-y-2">
              <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">{t('header.login')}</Button>
              </Link>
              <Link href="/mis-resultados" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  {language === 'es' ? 'Ver mis resultados' : 'View my results'}
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">{t('header.startFree')}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
