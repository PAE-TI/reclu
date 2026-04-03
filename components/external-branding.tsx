'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Shield, 
  Award, 
  Users, 
  ArrowRight,
  Globe,
  Brain
} from 'lucide-react';
import { Language, translations } from '@/contexts/language-context';

interface BrandingHeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  evaluationType?: string;
  evaluationIcon?: React.ReactNode;
  evaluationColor?: string;
}

export function BrandingHeader({ 
  language, 
  setLanguage, 
  evaluationType = 'DISC',
  evaluationIcon,
  evaluationColor = 'indigo'
}: BrandingHeaderProps) {
  const t = (key: string) => translations[language][key as keyof typeof translations['es']] || key;
  
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MotivaIQ
              </h1>
              <p className="text-xs text-gray-500">{t('ext.platform')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'es' ? 'ES' : 'EN'}</span>
            </button>
            {/* Evaluation Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-${evaluationColor}-100`}>
              {evaluationIcon || <Brain className={`w-4 h-4 text-${evaluationColor}-600`} />}
              <span className={`text-sm font-medium text-${evaluationColor}-600`}>{evaluationType}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

interface BrandingFooterProps {
  language: Language;
  showCTA?: boolean;
}

export function BrandingFooter({ language, showCTA = true }: BrandingFooterProps) {
  const t = (key: string) => translations[language][key as keyof typeof translations['es']] || key;
  
  return (
    <footer className="mt-auto">
      {showCTA && (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              {t('ext.interestedInTeam')}
            </h3>
            <p className="text-indigo-100 mb-4 text-sm">
              {t('ext.discoverPotential')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
              >
                {t('ext.knowMotivaiq')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-white/20 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
              >
                {t('ext.createFreeAccount')}
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="bg-gray-900 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm">{t('ext.confidentialData')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">{t('ext.certifiedMethod')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm">{t('ext.plusEvaluations')}</span>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-semibold">MotivaIQ</span>
              </div>
              <p className="text-gray-500 text-sm text-center">
                © 2025 MotivaIQ. {t('ext.platformDesc')}
              </p>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('ext.terms')}
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('ext.home')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
