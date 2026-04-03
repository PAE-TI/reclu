
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  FileText,
  Download,
  Share2,
  Printer,
  Mail,
  Clock,
  Construction
} from 'lucide-react';

export default async function Reports() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportes DISC</h1>
            <p className="text-lg text-gray-600">
              Genera y gestiona reportes profesionales de tus evaluaciones
            </p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Construction className="w-10 h-10 text-yellow-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Módulo de Reportes en Desarrollo
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Estamos trabajando en un sistema completo de generación de reportes que incluirá 
              exportación a PDF, reportes personalizables y análisis avanzados.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Reportes PDF</h3>
                <p className="text-sm text-gray-600">
                  Genera reportes profesionales en formato PDF con interpretaciones detalladas
                </p>
              </Card>

              <Card className="p-6 border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Compartir Resultados</h3>
                <p className="text-sm text-gray-600">
                  Comparte reportes de forma segura con coaches, equipos o supervisores
                </p>
              </Card>

              <Card className="p-6 border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Printer className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Formatos Múltiples</h3>
                <p className="text-sm text-gray-600">
                  Exporta en PDF, Word, PowerPoint y otros formatos profesionales
                </p>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  Volver al Dashboard
                </Button>
              </Link>
              <Link href="/evaluations">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  Ver Mis Evaluaciones
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Próximamente
              </CardTitle>
              <CardDescription>
                Funciones que estarán disponibles pronto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <Download className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">Exportación PDF</h4>
                  <p className="text-sm text-gray-600">Reportes profesionales listos para imprimir</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">Envío por Email</h4>
                  <p className="text-sm text-gray-600">Comparte reportes directamente por email</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">Plantillas Personalizadas</h4>
                  <p className="text-sm text-gray-600">Crea plantillas de reporte personalizadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>¿Necesitas un reporte ahora?</CardTitle>
              <CardDescription>
                Mientras tanto, puedes ver tus resultados en pantalla
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Aunque el módulo de reportes está en desarrollo, puedes revisar todos tus 
                resultados DISC en la sección de evaluaciones y tomar capturas de pantalla 
                para uso inmediato.
              </p>
              
              <div className="space-y-3">
                <Link href="/evaluations">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Ver Mis Resultados
                  </Button>
                </Link>
                
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    Ir al Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
