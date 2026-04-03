'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Bell, Check, CheckCheck, Trash2, ExternalLink, BarChart3, User, Clock, Coins, AlertTriangle, Wallet, Plus, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import GlobalSearch from '@/components/global-search';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/language-context';

interface HeaderProps {
  onToggleSidebar: () => void;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  evaluationType: string | null;
  evaluationToken: string | null;
  recipientName: string | null;
  recipientEmail: string | null;
  createdAt: string;
}

const EVALUATION_COLORS: Record<string, string> = {
  DISC: 'bg-blue-100 text-blue-700',
  DRIVING_FORCES: 'bg-amber-100 text-amber-700',
  EQ: 'bg-rose-100 text-rose-700',
  DNA: 'bg-teal-100 text-teal-700',
  ACUMEN: 'bg-cyan-100 text-cyan-700',
  VALUES: 'bg-violet-100 text-violet-700',
  STRESS: 'bg-orange-100 text-orange-700',
  TECHNICAL: 'bg-sky-100 text-sky-700',
};

const EVALUATION_NAMES: Record<string, string> = {
  DISC: 'DISC',
  DRIVING_FORCES: 'FM',
  EQ: 'EQ',
  DNA: 'DNA',
  ACUMEN: 'ACI',
  VALUES: 'Val',
  STRESS: 'Str',
  TECHNICAL: 'Téc',
};

export default function Header({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRefMobile = useRef<HTMLDivElement>(null);
  
  const dateLocale = language === 'es' ? es : enUS;

  // Fetch credits
  const fetchCredits = async () => {
    try {
      const res = await fetch('/api/credits');
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?limit=15');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchNotifications();
    fetchCredits();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchCredits();
    }, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Listen for credits-updated event to refresh immediately
  useEffect(() => {
    const handleCreditsUpdated = () => {
      fetchCredits();
    };
    window.addEventListener('credits-updated', handleCreditsUpdated);
    return () => window.removeEventListener('credits-updated', handleCreditsUpdated);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      const isOutsideDesktop = langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node);
      const isOutsideMobile = langDropdownRefMobile.current && !langDropdownRefMobile.current.contains(event.target as Node);
      // Only close if click is outside BOTH dropdowns (or the one that's visible)
      if ((langDropdownRef.current || langDropdownRefMobile.current) && isOutsideDesktop && isOutsideMobile) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark single as read
  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
    setLoading(false);
  };

  // Delete notification
  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      const wasUnread = notifications.find(n => n.id === id)?.read === false;
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Navigate to analytics with person selected
  const goToAnalytics = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Manejar notificaciones de créditos
    if (notification.type === 'CREDIT_RECHARGE' || notification.type === 'CREDITS_ZERO' || notification.type === 'CREDITS_LOW') {
      router.push('/settings');
      setIsOpen(false);
      return;
    }
    
    if (notification.recipientEmail) {
      router.push(`/analytics?person=${encodeURIComponent(notification.recipientEmail)}`);
    } else {
      router.push('/analytics');
    }
    setIsOpen(false);
  };

  // Obtener icono y color para notificaciones de créditos
  const getCreditNotificationIcon = (type: string) => {
    switch (type) {
      case 'CREDIT_RECHARGE':
        return { icon: Wallet, bgColor: 'bg-green-100', textColor: 'text-green-700' };
      case 'CREDITS_ZERO':
        return { icon: AlertTriangle, bgColor: 'bg-red-100', textColor: 'text-red-700' };
      case 'CREDITS_LOW':
        return { icon: AlertTriangle, bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' };
      default:
        return null;
    }
  };

  // Translate notification title and message based on type
  const translateNotification = (notification: Notification): { title: string; message: string } => {
    const evalName = notification.evaluationType ? t(`notification.evalName.${notification.evaluationType}`) : '';
    
    switch (notification.type) {
      case 'EVALUATION_COMPLETED':
        return {
          title: t('notification.eval.completed.title').replace('{evalName}', evalName),
          message: t('notification.eval.completed.message')
            .replace('{name}', notification.recipientName || '')
            .replace('{evalName}', evalName),
        };
      case 'CREDIT_RECHARGE':
        // Extract numbers from original message
        const rechargeMatch = notification.message.match(/(\d+)/g);
        const amount = rechargeMatch?.[0] || '0';
        const balance = rechargeMatch?.[1] || '0';
        return {
          title: t('notification.credits.recharge.title'),
          message: t('notification.credits.recharge.message')
            .replace('{amount}', amount)
            .replace('{balance}', balance),
        };
      case 'CREDITS_ZERO':
        return {
          title: t('notification.credits.zero.title'),
          message: t('notification.credits.zero.message'),
        };
      case 'CREDITS_LOW':
        const lowMatch = notification.message.match(/(\d+)/);
        const credits = lowMatch?.[1] || '0';
        return {
          title: t('notification.credits.low.title'),
          message: t('notification.credits.low.message').replace('{credits}', credits),
        };
      default:
        return { title: notification.title, message: notification.message };
    }
  };

  // Notifications dropdown content (shared between mobile and desktop)
  const NotificationsDropdown = () => (
    <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
      {/* Header del dropdown */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('appHeader.notifications')}</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
              {unreadCount} {unreadCount !== 1 ? t('appHeader.notifications.news') : t('appHeader.notifications.new')}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            {t('appHeader.notifications.markAll')}
          </button>
        )}
      </div>

      {/* Lista de notificaciones */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">{t('appHeader.notifications.empty')}</p>
            <p className="text-xs text-gray-400 mt-1">{t('appHeader.notifications.emptyDesc')}</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const translated = translateNotification(notification);
            return (
              <div
                key={notification.id}
                onClick={() => goToAnalytics(notification)}
                className={`px-4 py-3 border-b border-gray-50 dark:border-gray-800 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  !notification.read ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Indicador de tipo */}
                  <div className="flex-shrink-0 mt-0.5">
                    {(() => {
                      const creditIcon = getCreditNotificationIcon(notification.type);
                      if (creditIcon) {
                        const IconComponent = creditIcon.icon;
                        return (
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${creditIcon.bgColor} ${creditIcon.textColor}`}>
                            <IconComponent className="w-4 h-4" />
                          </span>
                        );
                      }
                      if (notification.evaluationType) {
                        return (
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${EVALUATION_COLORS[notification.evaluationType] || 'bg-gray-100 text-gray-700'}`}>
                            {EVALUATION_NAMES[notification.evaluationType] || '?'}
                          </span>
                        );
                      }
                      return (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500">
                          <Bell className="w-4 h-4" />
                        </span>
                      );
                    })()}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium truncate ${
                        !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {translated.title}
                      </p>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full"></span>
                      )}
                    </div>
                    
                    {notification.recipientName && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {notification.recipientName}
                        </span>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {translated.message}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: dateLocale,
                        })}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {notification.type === 'CREDIT_RECHARGE' || notification.type === 'CREDITS_ZERO' || notification.type === 'CREDITS_LOW' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              goToAnalytics(notification);
                            }}
                            className="p-1 text-green-500 hover:text-green-700 hover:bg-green-100 rounded transition-colors"
                            title={t('appHeader.notifications.goToSettings')}
                          >
                            <Coins className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              goToAnalytics(notification);
                            }}
                            className="p-1 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 rounded transition-colors"
                            title={t('appHeader.notifications.viewAnalysis')}
                          >
                            <BarChart3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded transition-colors"
                            title={t('appHeader.notifications.markRead')}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => deleteNotification(notification.id, e)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                          title={t('appHeader.notifications.delete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={() => {
              router.push('/analytics');
              setIsOpen(false);
            }}
            className="flex items-center justify-center gap-2 w-full text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            {t('appHeader.notifications.viewFullPanel')}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800">
      {/* Desktop Layout - Single row */}
      <div className="hidden lg:flex items-center justify-between h-16 px-6">
        {/* Buscador Global - Desktop */}
        <GlobalSearch />

        {/* Acciones del Header - Desktop */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
              title={t('appHeader.language')}
            >
              <Globe className="w-4 h-4" />
              {language.toUpperCase()}
              <ChevronDown className={`w-3 h-3 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLangDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden min-w-[100px] z-50">
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
          
          {/* Créditos */}
          {credits !== null && (
            <div className="flex items-center" data-tour="credits">
              <button
                onClick={() => router.push('/settings')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border border-amber-200 rounded-l-full transition-all"
                title={t('appHeader.viewHistory')}
              >
                <Coins className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700">{credits}</span>
              </button>
              <button
                onClick={() => router.push('/credits/purchase')}
                className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-r-full -ml-px transition-all"
                title={t('appHeader.buyCredits')}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Notificaciones Desktop */}
          <div className="relative" ref={dropdownRef} data-tour="notifications">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full px-1">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">
                  {unreadCount > 0 
                    ? `${unreadCount} ${unreadCount === 1 ? t('appHeader.notifications.new') : t('appHeader.notifications.news')} ${t('appHeader.notifications').toLowerCase()}`
                    : t('appHeader.notifications.empty')
                  }
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {isOpen && <NotificationsDropdown />}
          </div>
        </div>
      </div>

      {/* Mobile Layout - Two rows for prominent search */}
      <div className="lg:hidden">
        {/* Row 1: Menu, Logo, Actions */}
        <div className="flex items-center justify-between h-14 px-3">
          {/* Menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2"
            data-tour="sidebar-toggle"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Logo/Brand center */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MotivaIQ
            </span>
          </div>

          {/* Right actions - compact */}
          <div className="flex items-center gap-1">
            {/* Language - compact icon */}
            <div className="relative" ref={langDropdownRefMobile}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('appHeader.language')}
              >
                <Globe className="w-4 h-4" />
              </button>
              
              {isLangDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden min-w-[100px] z-50">
                  <button
                    onClick={() => { setLanguage('es'); setIsLangDropdownOpen(false); }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 ${language === 'es' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'}`}
                  >
                    <span className="text-base">🇪🇸</span> ES
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setIsLangDropdownOpen(false); }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 ${language === 'en' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'}`}
                  >
                    <span className="text-base">🇺🇸</span> EN
                  </button>
                </div>
              )}
            </div>

            {/* Credits - compact with add button */}
            {credits !== null && (
              <div className="flex items-center" data-tour="credits">
                <button
                  onClick={() => router.push('/settings')}
                  className="flex items-center gap-1 px-2 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-l-full transition-all"
                  title={t('appHeader.viewHistory')}
                >
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700">{credits}</span>
                </button>
                <button
                  onClick={() => router.push('/credits/purchase')}
                  className="flex items-center justify-center w-6 h-7 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-r-full -ml-px transition-all"
                  title={t('appHeader.buyCredits')}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Notifications - Mobile */}
            <div className="relative" ref={dropdownRef} data-tour="notifications">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative p-2"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full px-0.5">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">
                    {unreadCount > 0 
                      ? `${unreadCount} ${unreadCount === 1 ? t('appHeader.notifications.new') : t('appHeader.notifications.news')}`
                      : t('appHeader.notifications.empty')
                    }
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {isOpen && <NotificationsDropdown />}
            </div>
          </div>
        </div>

        {/* Row 2: Prominent Search Bar - Full width */}
        <div className="px-3 pb-3">
          <GlobalSearch />
        </div>
      </div>
    </header>
  );
}
