
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Brain,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  Eye,
  FileText,
  Archive
} from 'lucide-react';

export default async function Evaluations() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Obtener evaluaciones del usuario
  const evaluations = await prisma.discEvaluation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      results: true,
      _count: {
        select: { responses: true },
      },
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'IN_PROGRESS': return 'bg-yellow-500';
      case 'DRAFT': return 'bg-gray-500';
      case 'ARCHIVED': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Completada';
      case 'IN_PROGRESS': return 'En Progreso';
      case 'DRAFT': return 'Borrador';
      case 'ARCHIVED': return 'Archivada';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Evaluaciones</h1>
            <p className="text-lg text-gray-600">
              Gestiona y revisa todas tus evaluaciones DISC
            </p>
          </div>
          <Link href="/evaluation/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Evaluación
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{evaluations.length}</p>
                </div>
                <Brain className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {evaluations.filter(e => e.status === 'COMPLETED').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Progreso</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {evaluations.filter(e => e.status === 'IN_PROGRESS').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Borradores</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {evaluations.filter(e => e.status === 'DRAFT').length}
                  </p>
                </div>
                <Archive className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evaluations List */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              Todas las Evaluaciones
            </CardTitle>
            <CardDescription>
              Lista completa de tus evaluaciones DISC
            </CardDescription>
          </CardHeader>
          <CardContent>
            {evaluations.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes evaluaciones</h3>
                <p className="text-gray-600 mb-6">Comienza creando tu primera evaluación DISC</p>
                <Link href="/evaluation/new">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primera Evaluación
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {evaluations.map((evaluation) => (
                  <div key={evaluation.id} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{evaluation.title}</h3>
                          <Badge
                            variant="secondary"
                            className={`text-white text-xs ${getStatusColor(evaluation.status)}`}
                          >
                            {getStatusText(evaluation.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">
                          {evaluation.description || 'Sin descripción'}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Creado: {new Date(evaluation.createdAt).toLocaleDateString('es-ES')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{evaluation._count.responses} respuestas</span>
                          </div>
                          {evaluation.completedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>Completado: {new Date(evaluation.completedAt).toLocaleDateString('es-ES')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        {evaluation.status === 'COMPLETED' && evaluation.results?.[0] && (
                          <Link href={`/results/${evaluation.id}`}>
                            <Button size="sm" variant="outline" className="bg-white">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Resultados
                            </Button>
                          </Link>
                        )}
                        
                        {evaluation.status === 'IN_PROGRESS' && (
                          <Link href={`/evaluation/${evaluation.id}/questionnaire`}>
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                              Continuar
                            </Button>
                          </Link>
                        )}
                        
                        {evaluation.status === 'DRAFT' && (
                          <Link href={`/evaluation/${evaluation.id}/questionnaire`}>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Comenzar
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
