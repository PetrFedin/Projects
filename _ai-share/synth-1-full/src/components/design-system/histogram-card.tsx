'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/components/design-system/chart-card';
import { cn } from '@/lib/utils';

export type HistogramDatum = { label: string; value: number };

export type HistogramCardProps = {
  title: string;
  description?: string;
  data: HistogramDatum[];
  footer?: React.ReactNode;
  className?: string;
  /** Имя поля в data после маппинга (по умолчанию label / value) */
  xKey?: string;
  yKey?: string;
};

/** Гистограмма на Recharts в едином стиле карточки. */
export function HistogramCard({
  title,
  description,
  data,
  footer,
  className,
  xKey = 'label',
  yKey = 'value',
}: HistogramCardProps) {
  const chartData = React.useMemo(
    () => data.map((d) => ({ [xKey]: d.label, [yKey]: d.value })),
    [data, xKey, yKey]
  );

  return (
    <ChartCard title={title} description={description} footer={footer} className={className}>
      <div className={cn('h-[200px] w-full min-h-[160px]')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground, #64748b)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              width={32}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground, #64748b)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(15,23,42,0.04)' }}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: '1px solid #e2e8f0',
              }}
            />
            <Bar dataKey={yKey} fill="#0369a1" radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
