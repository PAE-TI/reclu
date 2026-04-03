'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import {
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
  Building2,
  Coins,
  Package,
  ClipboardList,
  Eye,
  MessageSquare,
  UserPlus,
  BookOpen,
  Target,
  Brain,
  Rocket,
  Search,
  Briefcase
} from 'lucide-react';

interface TourStepConfig {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  target?: string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
}

const tourStepConfigs: TourStepConfig[] = [
  {
    id: 'welcome',
    titleKey: 'tour.welcome.title',
    descriptionKey: 'tour.welcome.description',
    icon: <Sparkles className="w-8 h-8 text-indigo-500" />,
    position: 'center',
    highlight: true
  },
  {
    id: 'global-search',
    titleKey: 'tour.globalSearch.title',
    descriptionKey: 'tour.globalSearch.description',
    icon: <Search className="w-8 h-8 text-indigo-600" />,
    target: '[data-tour="global-search"]',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'send-evaluations',
    titleKey: 'tour.sendEvaluations.title',
    descriptionKey: 'tour.sendEvaluations.description',
    icon: <Package className="w-8 h-8 text-indigo-600" />,
    target: '[data-tour="batch-evaluations"]',
    position: 'right',
    highlight: true
  },
  {
    id: 'modules',
    titleKey: 'tour.modules.title',
    descriptionKey: 'tour.modules.description',
    icon: <Brain className="w-8 h-8 text-purple-500" />,
    target: '[data-tour="sidebar-modules"]',
    position: 'right'
  },
  {
    id: 'manage-evaluations',
    titleKey: 'tour.manageEvaluations.title',
    descriptionKey: 'tour.manageEvaluations.description',
    icon: <ClipboardList className="w-8 h-8 text-emerald-500" />,
    target: '[data-tour="sidebar-disc"]',
    position: 'right'
  },
  {
    id: 'view-results',
    titleKey: 'tour.viewResults.title',
    descriptionKey: 'tour.viewResults.description',
    icon: <Eye className="w-8 h-8 text-blue-500" />,
    position: 'center'
  },
  {
    id: 'advanced-analytics',
    titleKey: 'tour.advancedAnalytics.title',
    descriptionKey: 'tour.advancedAnalytics.description',
    icon: <BarChart3 className="w-8 h-8 text-amber-500" />,
    target: '[data-tour="analytics"]',
    position: 'right',
    highlight: true
  },
  {
    id: 'campaigns',
    titleKey: 'tour.campaigns.title',
    descriptionKey: 'tour.campaigns.description',
    icon: <Briefcase className="w-8 h-8 text-cyan-500" />,
    target: '[data-tour="campaigns"]',
    position: 'right',
    highlight: true
  },
  {
    id: 'campaigns-features',
    titleKey: 'tour.campaignsFeatures.title',
    descriptionKey: 'tour.campaignsFeatures.description',
    icon: <Target className="w-8 h-8 text-teal-500" />,
    position: 'center'
  },
  {
    id: 'notes',
    titleKey: 'tour.notes.title',
    descriptionKey: 'tour.notes.description',
    icon: <MessageSquare className="w-8 h-8 text-rose-500" />,
    position: 'center'
  },
  {
    id: 'credits',
    titleKey: 'tour.credits.title',
    descriptionKey: 'tour.credits.description',
    icon: <Coins className="w-8 h-8 text-amber-500" />,
    target: '[data-tour="credits"]',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'team',
    titleKey: 'tour.team.title',
    descriptionKey: 'tour.team.description',
    icon: <UserPlus className="w-8 h-8 text-violet-500" />,
    target: '[data-tour="team"]',
    position: 'right'
  },
  {
    id: 'guide',
    titleKey: 'tour.guide.title',
    descriptionKey: 'tour.guide.description',
    icon: <BookOpen className="w-8 h-8 text-teal-500" />,
    position: 'center'
  },
  {
    id: 'notifications',
    titleKey: 'tour.notifications.title',
    descriptionKey: 'tour.notifications.description',
    icon: <Bell className="w-8 h-8 text-rose-500" />,
    target: '[data-tour="notifications"]',
    position: 'bottom'
  },
  {
    id: 'profile',
    titleKey: 'tour.profile.title',
    descriptionKey: 'tour.profile.description',
    icon: <Building2 className="w-8 h-8 text-indigo-500" />,
    target: '[data-tour="profile"]',
    position: 'bottom'
  },
  {
    id: 'settings',
    titleKey: 'tour.settings.title',
    descriptionKey: 'tour.settings.description',
    icon: <Settings className="w-8 h-8 text-gray-500" />,
    target: '[data-tour="settings"]',
    position: 'right'
  },
  {
    id: 'finish',
    titleKey: 'tour.finish.title',
    descriptionKey: 'tour.finish.description',
    icon: <Rocket className="w-8 h-8 text-green-500" />,
    position: 'center',
    highlight: true
  }
];

const TOUR_STORAGE_KEY = 'motivaiq_tour_completed';
const TOUR_DONT_SHOW_KEY = 'motivaiq_tour_dont_show';

export default function AppTour() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  // Memoized translated tour steps
  const tourSteps = useMemo(() => {
    return tourStepConfigs.map(config => ({
      ...config,
      title: t(config.titleKey),
      description: t(config.descriptionKey)
    }));
  }, [t]);

  useEffect(() => {
    setMounted(true);
    
    // Check if tour should auto-start
    const dontShow = localStorage.getItem(TOUR_DONT_SHOW_KEY);
    const completed = sessionStorage.getItem(TOUR_STORAGE_KEY);
    
    if (!dontShow && !completed) {
      // Small delay to let the page render
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateHighlight = useCallback(() => {
    const stepConfig = tourStepConfigs[currentStep];
    if (stepConfig.target) {
      // Si el target está en el sidebar, intentar abrir el sidebar primero (en mobile)
      const isSidebarTarget = stepConfig.target.includes('sidebar') || 
                              stepConfig.target.includes('campaigns') || 
                              stepConfig.target.includes('team') ||
                              stepConfig.target.includes('analytics') ||
                              stepConfig.target.includes('settings');
      
      if (isSidebarTarget && typeof window !== 'undefined' && window.innerWidth < 1024) {
        // Buscar el botón de toggle del sidebar y hacer clic si el sidebar está cerrado
        const sidebarToggle = document.querySelector('[data-tour="sidebar-toggle"]');
        const sidebar = document.querySelector('.fixed.left-0.h-full');
        if (sidebarToggle && sidebar && sidebar.classList.contains('-translate-x-full')) {
          (sidebarToggle as HTMLElement).click();
          // Esperar a que el sidebar se abra
          setTimeout(() => {
            const element = document.querySelector(stepConfig.target!);
            if (element) {
              const rect = element.getBoundingClientRect();
              setHighlightRect(rect);
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              setHighlightRect(null);
            }
          }, 350);
          return;
        }
      }
      
      const element = document.querySelector(stepConfig.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightRect(rect);
        // Scroll element into view if needed
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setHighlightRect(null);
      }
    } else {
      setHighlightRect(null);
    }
  }, [currentStep]);

  useEffect(() => {
    if (isOpen) {
      updateHighlight();
      window.addEventListener('resize', updateHighlight);
      return () => window.removeEventListener('resize', updateHighlight);
    }
  }, [isOpen, currentStep, updateHighlight]);

  const handleNext = () => {
    if (currentStep < tourStepConfigs.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep(0);
    sessionStorage.setItem(TOUR_STORAGE_KEY, 'true');
    
    if (dontShowAgain) {
      localStorage.setItem(TOUR_DONT_SHOW_KEY, 'true');
    }
  };

  const handleStartTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const step = tourSteps[currentStep];
  const stepConfig = tourStepConfigs[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourStepConfigs.length - 1;

  // Tooltip SIEMPRE centrado en la pantalla
  const getTooltipStyle = (): React.CSSProperties => {
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  };

  if (!mounted) return null;

  // Format step text with placeholders
  const formatStepText = (template: string) => {
    return template
      .replace('{current}', String(currentStep + 1))
      .replace('{total}', String(tourStepConfigs.length));
  };

  const tourOverlay = isOpen ? (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Highlight cutout - solo mostrar si hay elemento target */}
      {highlightRect && stepConfig.target && (
        <div
          className="absolute border-4 border-indigo-500 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none transition-all duration-300"
          style={{
            top: highlightRect.top - 8,
            left: highlightRect.left - 8,
            width: highlightRect.width + 16,
            height: highlightRect.height + 16,
          }}
        >
          <div className="absolute inset-0 border-2 border-white/30 rounded-lg animate-pulse" />
        </div>
      )}

      {/* Tooltip Card */}
      <div
        className="w-[90vw] max-w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
        style={getTooltipStyle()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium">{t('tour.title')}</p>
              <p className="text-white text-sm font-semibold">
                {formatStepText(t('tour.step'))}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tourStepConfigs.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Badge de paso importante */}
          {stepConfig.highlight && (
            <div className="mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                <Sparkles className="w-3 h-3" />
                {t('tour.importantStep')}
              </span>
            </div>
          )}
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
              stepConfig.highlight 
                ? 'bg-gradient-to-br from-amber-100 to-yellow-100 ring-2 ring-amber-300' 
                : 'bg-gradient-to-br from-indigo-50 to-purple-50'
            }`}>
              {stepConfig.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-1.5 mb-4">
            {tourStepConfigs.map((s, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? (s.highlight ? 'bg-amber-500 w-6' : 'bg-indigo-600 w-6')
                    : index < currentStep 
                      ? (tourStepConfigs[index].highlight ? 'bg-amber-300' : 'bg-indigo-300')
                      : (tourStepConfigs[index].highlight ? 'bg-amber-200' : 'bg-gray-200')
                } ${tourStepConfigs[index].highlight ? 'w-3' : 'w-2'}`}
              />
            ))}
          </div>

          {/* Don't show again checkbox */}
          {isLastStep && (
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600">{t('tour.dontShowAgain')}</span>
            </label>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={isFirstStep}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t('tour.previous')}
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {isLastStep ? t('tour.finish') : t('tour.next')}
            {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={handleStartTour}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/40 group"
        aria-label={t('tour.helpButtonAria')}
      >
        <HelpCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-10 right-0 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {t('tour.helpButton')}
        </span>
      </button>

      {/* Tour Overlay */}
      {tourOverlay}
    </>
  );
}