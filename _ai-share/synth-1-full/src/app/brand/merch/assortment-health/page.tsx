'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartPulse, TrendingUp, BarChart3, ShieldCheck, Zap, Palette, Ruler } from 'lucide-react';
import { products } from '@/lib/products';
import { analyzeAssortmentHealth } from '@/lib/fashion/assortment-health';
import { Progress } from '@/components/ui/progress';
import { PageHeader, DashboardGrid } from '@/components/design-system';

export default function AssortmentHealthPage() {
  const categories = ['Outerwear', 'Top', 'Bottom', 'Accessory'];
  const healthData = categories.map((cat) => analyzeAssortmentHealth(products, cat));

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Assortment Health Scorecard"
        description="Глубокий анализ баланса коллекции: цветовая гамма, размерная сетка и маржинальность по категориям."
        actions={
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <HeartPulse className="h-5 w-5" />
          </div>
        }
      />

      <DashboardGrid cols={2} dense>
        {healthData.map((data) => (
          <Card
            key={data.category}
            className="border-border-default relative overflow-hidden border p-5 shadow-sm transition-colors hover:border-emerald-200/80"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-text-primary text-base font-semibold uppercase tracking-tight">
                {data.category}
              </h3>
              <div className="text-right">
                <div className="text-text-secondary mb-0.5 text-[10px] font-bold uppercase">
                  Health Score
                </div>
                <div className="text-2xl font-bold tabular-nums text-emerald-600">
                  {Math.round((data.colorBalance + data.sizeAvailability + data.marginHealth) / 3)}%
                </div>
              </div>
            </div>

            <div className="mb-6 space-y-4">
              <div className="space-y-1.5">
                <div className="text-text-secondary flex items-center justify-between text-[10px] font-bold uppercase">
                  <span className="flex items-center gap-1.5">
                    <Palette className="text-accent-primary h-3 w-3" /> Color Balance
                  </span>
                  <span>{data.colorBalance}%</span>
                </div>
                <Progress
                  value={data.colorBalance}
                  className="bg-bg-surface2 h-1.5"
                  indicatorClassName="bg-accent-primary"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-text-secondary flex items-center justify-between text-[10px] font-bold uppercase">
                  <span className="flex items-center gap-1.5">
                    <Ruler className="h-3 w-3 text-emerald-500" /> Size Availability
                  </span>
                  <span>{data.sizeAvailability}%</span>
                </div>
                <Progress
                  value={data.sizeAvailability}
                  className="bg-bg-surface2 h-1.5"
                  indicatorClassName="bg-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-text-secondary flex items-center justify-between text-[10px] font-bold uppercase">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-rose-500" /> Margin Health
                  </span>
                  <span>{data.marginHealth}%</span>
                </div>
                <Progress
                  value={data.marginHealth}
                  className="bg-bg-surface2 h-1.5"
                  indicatorClassName="bg-rose-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                AI Merch Recommendations
              </div>
              {data.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="border-border-subtle bg-bg-surface2/80 text-text-secondary flex items-start gap-2 rounded-lg border p-2.5 text-[11px] font-medium"
                >
                  <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  {rec}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </DashboardGrid>

      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-700 px-6 py-6 text-white shadow-sm md:flex-row md:items-center">
        <div className="pointer-events-none absolute -bottom-8 -right-8 opacity-10">
          <BarChart3 className="h-40 w-40 rotate-12" />
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15">
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-lg font-semibold uppercase tracking-tight">
            Overall Collection Health: 84%
          </h3>
          <p className="max-w-2xl text-sm font-medium leading-relaxed text-emerald-50/95">
            Ваша коллекция SS26 сбалансирована по маржинальности, однако в категории &quot;Top&quot;
            наблюдается дефицит цветовой палитры. Рекомендуется добавить 2–3 ярких акцента для
            повышения CTR в онлайн-каналах.
          </p>
        </div>
        <Button className="h-11 w-full shrink-0 bg-white px-8 text-[10px] font-bold uppercase tracking-widest text-emerald-800 hover:bg-emerald-50 md:w-auto">
          View Full Audit
        </Button>
      </div>
    </div>
  );
}
