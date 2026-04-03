
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendData {
  date: string;
  dominante: number;
  influyente: number;
  estable: number;
  concienzudo: number;
  evaluationTitle?: string;
}

interface TrendAnalysisProps {
  data: TrendData[];
}

export default function TrendAnalysis({ data }: TrendAnalysisProps) {
  const getTrend = (current: number, previous: number) => {
    if (!previous) return 'neutral';
    const diff = current - previous;
    if (Math.abs(diff) < 5) return 'neutral';
    return diff > 0 ? 'up' : 'down';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">
                {entry.name}: {parseFloat(entry.value.toFixed(2))}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];

  const trends = latestData && previousData ? {
    dominante: getTrend(latestData.dominante, previousData.dominante),
    influyente: getTrend(latestData.influyente, previousData.influyente),
    estable: getTrend(latestData.estable, previousData.estable),
    concienzudo: getTrend(latestData.concienzudo, previousData.concienzudo)
  } : null;

  if (data.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">No hay suficientes datos para mostrar tendencias</p>
          <p className="text-sm text-gray-500 mt-2">
            Completa más evaluaciones para ver la evolución de tu perfil
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Evolución del Perfil DISC</CardTitle>
        {trends && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {Object.entries(trends).map(([key, trend]) => (
              <div key={key} className="flex items-center gap-1">
                <Badge variant="outline" className={`${getTrendColor(trend)} border-current`}>
                  {getTrendIcon(trend)}
                  <span className="ml-1 capitalize text-xs">
                    {key.charAt(0).toUpperCase()}
                  </span>
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]}
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="dominante"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                name="Dominante"
              />
              <Line
                type="monotone"
                dataKey="influyente"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                name="Influyente"
              />
              <Line
                type="monotone"
                dataKey="estable"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                name="Estable"
              />
              <Line
                type="monotone"
                dataKey="concienzudo"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                name="Concienzudo"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Análisis de cambios */}
        {trends && latestData && previousData && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Cambios recientes:</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(trends).map(([key, trend]) => {
                const current = latestData[key as keyof typeof latestData] as number;
                const previous = previousData[key as keyof typeof previousData] as number;
                const change = current - previous;
                
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{key}:</span>
                    <div className={`flex items-center gap-1 ${getTrendColor(trend)}`}>
                      {getTrendIcon(trend)}
                      <span className="text-sm font-semibold">
                        {change > 0 ? '+' : ''}{change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
