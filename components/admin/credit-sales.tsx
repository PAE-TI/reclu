'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ShoppingCart,
  Loader2,
  DollarSign,
  CreditCard,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Receipt
} from 'lucide-react';

interface Purchase {
  id: string;
  userId: string;
  creditAmount: number;
  priceUSD: number;
  pricePerCredit: number;
  paypalOrderId: string | null;
  paypalPayerEmail: string | null;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  invoiceNumber: string | null;
  completedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
  };
}

interface Stats {
  totalRevenue: number;
  totalCredits: number;
  totalSales: number;
}

export function CreditSalesCard() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSales();
  }, [statusFilter, page]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter })
      });
      
      const response = await fetch(`/api/admin/credit-sales?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPurchases(data.purchases);
        setStats(data.stats);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: Purchase['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Completado</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" /> Pendiente</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" /> Fallido</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-gray-100 text-gray-700"><AlertCircle className="w-3 h-3 mr-1" /> Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="mb-8 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-600" />
            <span className="text-purple-900">Ventas de Créditos</span>
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="failed">Fallidos</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Ingresos Totales</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">${stats.totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-500">USD</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm font-medium">Créditos Vendidos</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{stats.totalCredits.toLocaleString('es-ES')}</p>
              <p className="text-xs text-gray-500">créditos</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Ventas Completadas</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{stats.totalSales}</p>
              <p className="text-xs text-gray-500">transacciones</p>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay ventas registradas</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-purple-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Fecha</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Usuario</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Créditos</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Monto</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-600">Estado</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Factura</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className="border-b border-purple-100 hover:bg-white/50">
                      <td className="py-3 px-2">
                        <span className="text-gray-900">{formatDate(purchase.createdAt)}</span>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {purchase.user.firstName || purchase.user.lastName 
                              ? `${purchase.user.firstName || ''} ${purchase.user.lastName || ''}`.trim()
                              : purchase.user.email
                            }
                          </p>
                          <p className="text-xs text-gray-500">{purchase.user.email}</p>
                          {purchase.user.company && (
                            <p className="text-xs text-purple-600">{purchase.user.company}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="font-semibold text-gray-900">{purchase.creditAmount.toLocaleString('es-ES')}</span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="font-semibold text-green-700">${purchase.priceUSD.toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        {getStatusBadge(purchase.status)}
                      </td>
                      <td className="py-3 px-2">
                        {purchase.invoiceNumber ? (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Receipt className="w-3 h-3" />
                            <span className="text-xs font-mono">{purchase.invoiceNumber}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-100">
                <p className="text-sm text-gray-600">
                  Página {page} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
