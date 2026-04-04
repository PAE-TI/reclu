
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Header from './header';
import Sidebar from './sidebar';
import AppTour from './app-tour';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const publicRoutes = ['/auth/signin', '/auth/signup', '/', '/terms'];
const publicPrefixes = ['/evaluaciones'];

// Rutas de evaluaciones externas (sin autenticación requerida)
const externalEvaluationRoutes = [
  '/external-evaluation/',
  '/external-driving-forces-evaluation/',
  '/external-driving-forces-evaluation-results/',
  '/external-evaluation-results/',
  '/external-eq-evaluation/',
  '/team/invite/', // Team invitation (public)
  '/external-eq-evaluation-results/',
  '/external-dna-evaluation/',
  '/external-dna-evaluation-results/',
  '/external-acumen-evaluation/',
  '/external-acumen-evaluation-results/',
  '/external-values-evaluation/',
  '/external-values-evaluation-results/',
  '/external-stress-evaluation/',
  '/external-stress-evaluation-results/',
  '/external-technical-evaluation/',
  '/external-technical-evaluation-results/',
];

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Si es una ruta pública, mostrar sin sidebar
  const isPublicRoute = publicRoutes.includes(pathname) || publicPrefixes.some(prefix => pathname.startsWith(prefix));
  
  // Si es una evaluación externa con token (no la página de gestión)
  // Excluir /external-evaluations (gestión) y /external-driving-forces-evaluations (gestión)
  const isExternalEvaluationWithToken = externalEvaluationRoutes.some(route => {
    if (pathname.startsWith(route)) {
      // Verificar que no sea la ruta de gestión (sin token después de /)
      const parts = pathname.replace(route, '').split('/');
      return parts[0] && parts[0].length > 0; // Tiene un token
    }
    return false;
  });
  
  // Mostrar sin sidebar si no hay sesión o si es ruta pública o evaluación externa
  const showWithoutSidebar = !session || isPublicRoute || isExternalEvaluationWithToken;

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (showWithoutSidebar) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
          <Header onToggleSidebar={toggleSidebar} />
          
          {/* Page content */}
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
            {children}
          </main>
        </div>
      </div>
      
      {/* Tour de la aplicación */}
      <AppTour />
    </div>
  );
}
