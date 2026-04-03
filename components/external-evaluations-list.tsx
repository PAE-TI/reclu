
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Eye,
  Search,
  RefreshCw,
  Mail
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface ExternalEvaluation {
  id: string;
  title: string;
  recipientName: string;
  recipientEmail: string;
  status: string;
  effectiveStatus: string;
  createdAt: string;
  completedAt?: string;
  token: string;
  isExpired: boolean;
  timeUntilExpiry: {
    hours: number;
    minutes: number;
    expired: boolean;
  };
  hasResponses: boolean;
  isCompleted: boolean;
}

export default function ExternalEvaluationsList() {
  const [evaluations, setEvaluations] = useState<ExternalEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/external-evaluations');
      const data = await response.json();
      
      if (response.ok) {
        setEvaluations(data.evaluations);
      } else {
        toast.error('Error al cargar las evaluaciones');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const handleCopyLink = async (token: string) => {
    const link = `${window.location.origin}/external-evaluation/${token}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Enlace copiado al portapapeles');
    } catch (error) {
      toast.error('Error al copiar el enlace');
    }
  };

  const getStatusInfo = (evaluation: ExternalEvaluation) => {
    if (evaluation.isCompleted) {
      return {
        label: 'Completada',
        color: 'bg-green-500',
        icon: CheckCircle,
        textColor: 'text-green-700'
      };
    } else if (evaluation.isExpired) {
      return {
        label: 'Expirada',
        color: 'bg-red-500',
        icon: AlertTriangle,
        textColor: 'text-red-700'
      };
    } else {
      return {
        label: 'Pendiente',
        color: 'bg-yellow-500',
        icon: Clock,
        textColor: 'text-yellow-700'
      };
    }
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = 
      evaluation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'pending' && !evaluation.isCompleted && !evaluation.isExpired) ||
      (statusFilter === 'completed' && evaluation.isCompleted) ||
      (statusFilter === 'expired' && evaluation.isExpired);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Cargando evaluaciones...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por título, nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Todas
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
          >
            Pendientes
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('completed')}
          >
            Completadas
          </Button>
          <Button
            variant={statusFilter === 'expired' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('expired')}
          >
            Expiradas
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchEvaluations}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Lista de evaluaciones */}
      {filteredEvaluations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {evaluations.length === 0 ? 'No hay evaluaciones enviadas' : 'No se encontraron evaluaciones'}
            </h3>
            <p className="text-gray-600 mb-6">
              {evaluations.length === 0 
                ? 'Envía tu primera evaluación externa usando la pestaña "Enviar Evaluación"'
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredEvaluations.map((evaluation) => {
            const statusInfo = getStatusInfo(evaluation);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={evaluation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {evaluation.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={`text-white text-xs ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">Evaluado:</span> {evaluation.recipientName}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {evaluation.recipientEmail}
                        </div>
                        <div>
                          <span className="font-medium">Enviada:</span>{' '}
                          {new Date(evaluation.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        {evaluation.completedAt && (
                          <div>
                            <span className="font-medium">Completada:</span>{' '}
                            {new Date(evaluation.completedAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        )}
                      </div>

                      {!evaluation.isCompleted && !evaluation.isExpired && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2 text-blue-800 text-sm">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">
                              Tiempo restante: {evaluation.timeUntilExpiry.hours}h {evaluation.timeUntilExpiry.minutes}m
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {evaluation.isCompleted ? (
                        <Link href={`/external-evaluation-results/${evaluation.token}`}>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver Resultados
                          </Button>
                        </Link>
                      ) : !evaluation.isExpired ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyLink(evaluation.token)}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copiar Enlace
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Expirado
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Estadísticas */}
      {evaluations.length > 0 && (
        <Card className="bg-gray-50">
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Resumen</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {evaluations.length}
                </div>
                <div className="text-sm text-gray-600">Total Enviadas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {evaluations.filter(e => e.isCompleted).length}
                </div>
                <div className="text-sm text-gray-600">Completadas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {evaluations.filter(e => !e.isCompleted && !e.isExpired).length}
                </div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {evaluations.filter(e => e.isExpired).length}
                </div>
                <div className="text-sm text-gray-600">Expiradas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
