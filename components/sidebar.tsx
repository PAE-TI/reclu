'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Brain, 
  LayoutDashboard,
  TrendingUp,
  Building2,
  Settings,
  LogOut,
  X,
  Target,
  Briefcase,
  Heart,
  Dna,
  Compass,
  Shield,
  Activity,
  Lock,
  BookOpen,
  ShieldCheck,
  Package,
  Users,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Code,
  FileCode,
  FileText,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/language-context';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Navegación General - keys for translation
const generalNavigation = [
  {
    translationKey: 'sidebar.general.dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    translationKey: 'sidebar.general.analytics',
    href: '/analytics',
    icon: TrendingUp,
  },
  {
    translationKey: 'sidebar.general.campaigns',
    href: '/campaigns',
    icon: Briefcase,
  },
  {
    translationKey: 'sidebar.general.team',
    href: '/team',
    icon: Users,
    ownerOnly: true,
  },
];

// Módulos del sistema - estructura para secciones colapsables
const systemModules = [
  {
    id: 'psychometric',
    translationKey: 'sidebar.modules.psychometric.title',
    icon: Sparkles,
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-200',
    items: [
      {
        translationKey: 'sidebar.evaluations.disc',
        href: '/external-evaluations',
        icon: Brain,
        colorClass: 'text-indigo-600',
        bgActiveClass: 'bg-indigo-100',
      },
      {
        translationKey: 'sidebar.evaluations.drivingForces',
        href: '/external-driving-forces-evaluations',
        icon: Target,
        colorClass: 'text-purple-600',
        bgActiveClass: 'bg-purple-100',
      },
      {
        translationKey: 'sidebar.evaluations.eq',
        href: '/external-eq-evaluations',
        icon: Heart,
        colorClass: 'text-rose-600',
        bgActiveClass: 'bg-rose-100',
      },
      {
        translationKey: 'sidebar.evaluations.dna',
        href: '/external-dna-evaluations',
        icon: Dna,
        colorClass: 'text-cyan-600',
        bgActiveClass: 'bg-cyan-100',
      },
      {
        translationKey: 'sidebar.evaluations.acumen',
        href: '/external-acumen-evaluations',
        icon: Compass,
        colorClass: 'text-amber-600',
        bgActiveClass: 'bg-amber-100',
      },
      {
        translationKey: 'sidebar.evaluations.values',
        href: '/external-values-evaluations',
        icon: Shield,
        colorClass: 'text-violet-600',
        bgActiveClass: 'bg-violet-100',
      },
      {
        translationKey: 'sidebar.evaluations.stress',
        href: '/external-stress-evaluations',
        icon: Activity,
        colorClass: 'text-orange-600',
        bgActiveClass: 'bg-orange-100',
      },
    ],
    quickActions: [
      {
        translationKey: 'sidebar.modules.psychometric.batchSend',
        href: '/batch-evaluations',
        icon: Package,
      },
    ],
  },
  {
    id: 'technical',
    translationKey: 'sidebar.modules.technical.title',
    icon: Code,
    colorClass: 'text-sky-600',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
    comingSoon: false,
    items: [
      {
        translationKey: 'sidebar.modules.technical.evaluations',
        href: '/external-technical-evaluations',
        icon: FileCode,
        colorClass: 'text-sky-600',
        bgActiveClass: 'bg-sky-100',
      },
      {
        translationKey: 'sidebar.modules.technical.templates',
        href: '/external-technical-evaluations?tab=templates',
        icon: FileText,
        colorClass: 'text-cyan-600',
        bgActiveClass: 'bg-cyan-100',
      },
    ],
    quickActions: [],
  },
];

const bottomNavigation = [
  {
    translationKey: 'sidebar.bottom.profile',
    href: '/profile',
    icon: Building2,
  },
  {
    translationKey: 'sidebar.bottom.settings',
    href: '/settings',
    icon: Settings,
  },
];

const evaluationResultPrefixes: Record<string, string> = {
  '/external-evaluations': '/external-evaluation-results/',
  '/external-driving-forces-evaluations': '/external-driving-forces-evaluation-results/',
  '/external-eq-evaluations': '/external-eq-evaluation-results/',
  '/external-dna-evaluations': '/external-dna-evaluation-results/',
  '/external-acumen-evaluations': '/external-acumen-evaluation-results/',
  '/external-values-evaluations': '/external-values-evaluation-results/',
  '/external-stress-evaluations': '/external-stress-evaluation-results/',
  '/external-technical-evaluations': '/external-technical-evaluation-results/',
};

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { t } = useLanguage();
  
  // Estado para controlar qué módulos están expandidos
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    psychometric: true,
    technical: false,
  });

  // Expandir automáticamente el módulo si la ruta actual está dentro de él
  useEffect(() => {
    systemModules.forEach(mod => {
      const isInModule = mod.items.some(item => pathname === item.href.split('?')[0]) ||
                        mod.quickActions?.some(action => pathname === action.href);
      if (isInModule && !expandedModules[mod.id]) {
        setExpandedModules(prev => ({ ...prev, [mod.id]: true }));
      }
    });
  }, [pathname]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  const isRouteActive = (href: string) => {
    const cleanHref = href.split('?')[0];
    if (pathname === cleanHref) {
      return true;
    }

    const resultPrefix = evaluationResultPrefixes[cleanHref];
    return resultPrefix ? pathname.startsWith(resultPrefix) : false;
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50
        transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
        w-64
      `}>
        {/* Header del Sidebar */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200 bg-white">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-sm">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">{t('sidebar.logo.title')}</div>
              <div className="text-xs text-slate-500 -mt-1">{t('sidebar.logo.subtitle')}</div>
            </div>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Empresa Info */}
        {session?.user && (
          <div className="flex-shrink-0 p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-900 truncate">
                  {session.user.company || 'Mi Empresa'}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {session.user.firstName} {session.user.lastName}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navegación Principal - Área scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {/* Sección General */}
          <nav className="space-y-1 mb-4">
            {generalNavigation.map((item) => {
              const isFacilitator = !!(session?.user as { ownerId?: string })?.ownerId;
              if ((item as { ownerOnly?: boolean }).ownerOnly && isFacilitator) {
                return null;
              }
              
              const isActive = isRouteActive(item.href);
              const tourId = item.href === '/dashboard' ? 'dashboard' : 
                            item.href === '/analytics' ? 'analytics' : 
                            item.href === '/team' ? 'team' : 
                            item.href === '/campaigns' ? 'campaigns' : undefined;
              return (
                <Link
                  key={item.translationKey}
                  href={item.href}
                  data-tour={tourId}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-slate-100 text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                  onClick={handleLinkClick}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-slate-700' : ''}`} />
                  <span className="flex-1">{t(item.translationKey)}</span>
                </Link>
              );
            })}
            
            {/* Administración - Solo visible para ADMIN */}
            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${pathname === '/admin'
                    ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100'
                  }
                `}
                onClick={handleLinkClick}
              >
                <ShieldCheck className={`w-5 h-5 ${pathname === '/admin' ? 'text-white' : 'text-slate-500'}`} />
                {t('sidebar.general.admin')}
              </Link>
            )}
          </nav>

          {/* Divisor con título */}
          <div className="px-3 mb-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {t('sidebar.modules.title')}
            </div>
          </div>

          {/* Módulos del Sistema */}
          <div className="space-y-2" data-tour="sidebar-modules">
            {systemModules.map((mod) => {
              const isExpanded = expandedModules[mod.id];
              const ModuleIcon = mod.icon;
              const hasActiveItem = mod.items.some(item => isRouteActive(item.href)) ||
                                   mod.quickActions?.some(action => isRouteActive(action.href));
              
              return (
                <div key={mod.id} className="rounded-lg overflow-hidden">
                  {/* Header del módulo */}
                  <button
                    onClick={() => !mod.comingSoon && toggleModule(mod.id)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold transition-all rounded-lg
                      ${mod.comingSoon 
                        ? 'text-slate-400 cursor-not-allowed' 
                        : hasActiveItem
                          ? `${mod.bgClass} ${mod.colorClass}`
                          : 'text-slate-700 hover:bg-slate-50'
                      }
                    `}
                    disabled={mod.comingSoon}
                  >
                    <ModuleIcon className={`w-5 h-5 ${mod.comingSoon ? 'text-slate-400' : mod.colorClass}`} />
                    <span className="flex-1 text-left">{t(mod.translationKey)}</span>
                    {mod.comingSoon ? (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-slate-300 text-slate-400">
                        {t('sidebar.badge.soon')}
                      </Badge>
                    ) : (
                      <>
                        <Badge variant="secondary" className={`text-[9px] px-1.5 py-0 h-4 ${mod.bgClass} ${mod.colorClass}`}>
                          {mod.items.length}
                        </Badge>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </>
                    )}
                  </button>

                  {/* Items del módulo (colapsables) */}
                  {isExpanded && !mod.comingSoon && (
                    <div className={`mt-1 ml-3 pl-3 border-l-2 ${mod.borderClass} space-y-0.5`}>
                      {/* Evaluaciones/Items principales */}
                      {mod.items.map((item, index) => {
                        const isActive = isRouteActive(item.href);
                        const ItemIcon = item.icon;
                        const tourId = index === 0 && mod.id === 'psychometric' ? 'sidebar-disc' : undefined;
                        const itemText = t(item.translationKey);
                        
                        return (
                          <TooltipProvider key={item.translationKey} delayDuration={400}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={item.href}
                                  data-tour={tourId}
                                  className={`
                                    flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors
                                    ${isActive
                                      ? `${item.bgActiveClass} ${item.colorClass} font-medium`
                                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }
                                  `}
                                  onClick={handleLinkClick}
                                >
                                  <ItemIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? '' : item.colorClass}`} />
                                  <span className="truncate">{itemText}</span>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="bg-slate-900 text-white border-slate-700">
                                {itemText}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                      
                      {/* Acciones rápidas del módulo */}
                      {mod.quickActions && mod.quickActions.length > 0 && (
                        <div className="pt-2 mt-2 border-t border-slate-100 space-y-0.5">
                          {mod.quickActions.map((action) => {
                            const isActive = isRouteActive(action.href);
                            const ActionIcon = action.icon;
                            const tourId = action.href === '/batch-evaluations' ? 'batch-evaluations' : undefined;
                            const actionText = t(action.translationKey);
                            
                            return (
                              <TooltipProvider key={action.translationKey} delayDuration={400}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link
                                      href={action.href}
                                      data-tour={tourId}
                                      className={`
                                        flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors
                                        ${isActive
                                          ? 'bg-slate-100 text-slate-900 font-medium'
                                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                        }
                                      `}
                                      onClick={handleLinkClick}
                                    >
                                      <ActionIcon className="w-4 h-4 flex-shrink-0" />
                                      <span className="truncate">{actionText}</span>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="bg-slate-900 text-white border-slate-700">
                                    {actionText}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navegación adicional */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            {/* Guía de Evaluaciones - Destacada */}
            <div className="mb-4">
              <Link
                href="/evaluations-guide"
                data-tour="evaluations-guide"
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all
                  ${pathname === '/evaluations-guide'
                    ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white shadow-lg'
                    : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-slate-700 hover:from-indigo-100 hover:to-purple-100 hover:shadow-md border border-indigo-200'
                  }
                `}
                onClick={handleLinkClick}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${pathname === '/evaluations-guide' ? 'bg-white/20' : 'bg-gradient-to-br from-indigo-600 to-purple-600'}`}>
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="flex-1">{t('sidebar.modules.psychometric.guide')}</span>
                <Sparkles className={`w-4 h-4 ${pathname === '/evaluations-guide' ? 'text-white/70' : 'text-slate-400'}`} />
              </Link>
            </div>

            <div className="space-y-1">
              {bottomNavigation.map((item) => {
                const isActive = isRouteActive(item.href);
                const tourId = item.href === '/settings' ? 'settings' : 
                              item.href === '/profile' ? 'profile' : undefined;
                return (
                  <Link
                    key={item.translationKey}
                    href={item.href}
                    data-tour={tourId}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-slate-100 text-slate-900 shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                    onClick={handleLinkClick}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-slate-700' : ''}`} />
                    {t(item.translationKey)}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer fijo */}
        <div className="flex-shrink-0 border-t border-slate-200 p-3 bg-slate-50">
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100"
          >
            <LogOut className="w-4 h-4 mr-3" />
            {t('sidebar.bottom.logout')}
          </Button>
        </div>
      </div>
    </>
  );
}
