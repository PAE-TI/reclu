
'use client';

import { useMemo } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, Language } from '@/contexts/language-context';

interface DISCData {
  subject: string;
  value: number;
  fullMark: 100;
  color: string;
  description: string;
}

interface DISCChartProps {
  percentileD: number;
  percentileI: number;
  percentileS: number;
  percentileC: number;
  title?: string;
  showDetails?: boolean;
  language?: Language;
}

export default function DISCChart({ 
  percentileD, 
  percentileI, 
  percentileS, 
  percentileC, 
  title,
  showDetails = true,
  language: propLanguage
}: DISCChartProps) {
  const { language: contextLanguage, t } = useLanguage();
  const language = propLanguage || contextLanguage;

  const discLabels = useMemo(() => ({
    D: { name: t('disc.d.title'), desc: t('disc.d.desc') },
    I: { name: t('disc.i.title'), desc: t('disc.i.desc') },
    S: { name: t('disc.s.title'), desc: t('disc.s.desc') },
    C: { name: t('disc.c.title'), desc: t('disc.c.desc') }
  }), [t]);

  const data: DISCData[] = useMemo(() => [
    {
      subject: discLabels.D.name,
      value: parseFloat(percentileD.toFixed(2)),
      fullMark: 100,
      color: '#EF4444',
      description: discLabels.D.desc
    },
    {
      subject: discLabels.I.name,
      value: parseFloat(percentileI.toFixed(2)),
      fullMark: 100,
      color: '#F59E0B',
      description: discLabels.I.desc
    },
    {
      subject: discLabels.S.name,
      value: parseFloat(percentileS.toFixed(2)),
      fullMark: 100,
      color: '#10B981',
      description: discLabels.S.desc
    },
    {
      subject: discLabels.C.name,
      value: parseFloat(percentileC.toFixed(2)),
      fullMark: 100,
      color: '#3B82F6',
      description: discLabels.C.desc
    }
  ], [percentileD, percentileI, percentileS, percentileC, discLabels]);

  const primaryStyle = useMemo(() => {
    const maxValue = Math.max(percentileD, percentileI, percentileS, percentileC);
    if (maxValue === percentileD) return { name: discLabels.D.name, color: '#EF4444', letter: 'D' };
    if (maxValue === percentileI) return { name: discLabels.I.name, color: '#F59E0B', letter: 'I' };
    if (maxValue === percentileS) return { name: discLabels.S.name, color: '#10B981', letter: 'S' };
    return { name: discLabels.C.name, color: '#3B82F6', letter: 'C' };
  }, [percentileD, percentileI, percentileS, percentileC, discLabels]);

  const defaultTitle = language === 'es' ? 'Perfil DISC' : 'DISC Profile';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold" style={{ color: data.color }}>
            {data.subject}: {parseFloat(data.value.toFixed(2))}%
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {data.description}
          </p>
        </div>
      );
    }
    return null;
  };

  const primaryStyleLabel = language === 'es' ? 'Estilo primario' : 'Primary style';

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">{title || defaultTitle}</CardTitle>
        {showDetails && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: primaryStyle.color }}
            >
              {primaryStyle.letter}
            </div>
            <span className="text-sm text-gray-600">
              {primaryStyleLabel}: <span className="font-semibold">{primaryStyle.name}</span>
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis 
                angle={0} 
                domain={[0, 100]} 
                tick={false}
                axisLine={false}
              />
              <Radar
                name="DISC"
                dataKey="value"
                stroke="#6366F1"
                fill="#6366F1"
                fillOpacity={0.3}
                strokeWidth={3}
                dot={{ fill: '#6366F1', strokeWidth: 2, r: 6 }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {showDetails && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.subject}</span>
                    <span className="text-sm font-bold">{parseFloat(item.value.toFixed(2))}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
