'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface ResultSummaryCardProps {
  accentClassName: string;
  icon: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  right?: ReactNode;
}

export function ResultSummaryCard({
  accentClassName,
  icon,
  title,
  subtitle,
  right,
}: ResultSummaryCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-xl">
      <div className={`${accentClassName} p-6 text-white`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20">
              {icon}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold leading-tight">{title}</h1>
              <div className="mt-1 text-sm text-white/80">
                {subtitle}
              </div>
            </div>
          </div>

          {right && (
            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
              {right}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
