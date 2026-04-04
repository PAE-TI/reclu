
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ComparisonData {
  evaluation: string;
  date: string;
  dominante: number;
  influyente: number;
  estable: number;
  concienzudo: number;
}

interface ComparisonChartProps {
  data: ComparisonData[];
  title?: string;
}

export default function ComparisonChart({ data, title = "Comparativa de Evaluaciones" }: ComparisonChartProps) {
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
                {entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1)}: {parseFloat(entry.value.toFixed(2))}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getAverages = () => {
    if (data.length === 0) return null;
    
    const totals = data.reduce((acc, curr) => ({
      dominante: acc.dominante + curr.dominante,
      influyente: acc.influyente + curr.influyente,
      estable: acc.estable + curr.estable,
      concienzudo: acc.concienzudo + curr.concienzudo
    }), { dominante: 0, influyente: 0, estable: 0, concienzudo: 0 });

    return {
      dominante: Math.round(totals.dominante / data.length),
      influyente: Math.round(totals.influyente / data.length),
      estable: Math.round(totals.estable / data.length),
      concienzudo: Math.round(totals.concienzudo / data.length)
    };
  };

  const averages = getAverages();

  if (data.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">No hay datos suficientes para comparar</p>
          <p className="text-sm text-gray-500 mt-2">
            Necesitas al menos 2 evaluaciones completadas
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {averages && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="text-red-700 border-red-300">
              D promedio: {parseFloat(averages.dominante.toFixed(2))}%
            </Badge>
            <Badge variant="outline" className="text-yellow-700 border-yellow-300">
              I promedio: {parseFloat(averages.influyente.toFixed(2))}%
            </Badge>
            <Badge variant="outline" className="text-green-700 border-green-300">
              S promedio: {parseFloat(averages.estable.toFixed(2))}%
            </Badge>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              C promedio: {parseFloat(averages.concienzudo.toFixed(2))}%
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-60 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ bottom: 40, left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="evaluation" 
                stroke="#6B7280"
                fontSize={10}
                angle={-35}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                domain={[0, 100]}
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="dominante" fill="#EF4444" name="Dominante" />
              <Bar dataKey="influyente" fill="#F59E0B" name="Influyente" />
              <Bar dataKey="estable" fill="#10B981" name="Estable" />
              <Bar dataKey="concienzudo" fill="#3B82F6" name="Concienzudo" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
