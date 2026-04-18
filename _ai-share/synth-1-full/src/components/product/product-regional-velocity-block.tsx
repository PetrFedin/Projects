'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Info, Activity, Globe } from 'lucide-react';
import { getNationalVelocitySummary } from '@/lib/fashion/regional-velocity';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductRegionalVelocityBlock({ product }: { product: Product }) {
  const velocityData = getNationalVelocitySummary(product.sku);

  return (
<<<<<<< HEAD
    <Card className="my-4 border-2 border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Predictive Regional Sell-Through
          </h4>
        </div>
        <Badge variant="outline" className="border-slate-200 text-[8px] font-black uppercase">
=======
    <Card className="border-border-subtle my-4 border-2 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="text-accent-primary h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Predictive Regional Sell-Through
          </h4>
        </div>
        <Badge variant="outline" className="border-border-default text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
          AI Velocity V2
        </Badge>
      </div>

      <div className="space-y-3">
        {velocityData.map((item) => (
          <div key={item.region} className="space-y-1.5">
            <div className="flex items-center justify-between text-[9px] font-black uppercase">
<<<<<<< HEAD
              <span className="text-slate-500">{item.region}</span>
              <span className="text-indigo-600">{item.predictedSellThrough}% Forecast</span>
            </div>
            <Progress
              value={item.predictedSellThrough}
              className="h-1 bg-slate-50 fill-indigo-500"
            />
            <div className="flex items-center justify-between text-[7px] font-bold uppercase text-slate-400">
=======
              <span className="text-text-secondary">{item.region}</span>
              <span className="text-accent-primary">{item.predictedSellThrough}% Forecast</span>
            </div>
            <Progress
              value={item.predictedSellThrough}
              className="bg-bg-surface2 fill-accent-primary h-1"
            />
            <div className="text-text-muted flex items-center justify-between text-[7px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
              <span>Top Size: {item.topSizeRank[0]}</span>
              <span>Trend Factor: {item.localTrendFactor}x</span>
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      <div className="mt-4 flex items-start gap-2 rounded-lg border border-indigo-100 bg-indigo-50 p-2.5">
        <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
        <div className="text-[9px] font-medium leading-tight text-indigo-700">
=======
      <div className="bg-accent-primary/10 border-accent-primary/20 mt-4 flex items-start gap-2 rounded-lg border p-2.5">
        <Target className="text-accent-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
        <div className="text-accent-primary text-[9px] font-medium leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
          <b>Прогноз оборачиваемости:</b> Данные основаны на анализе продаж аналогичных товаров в ФО
          РФ за последние 24 месяца. Рекомендуется увеличить аллокацию в Центральный и Южный
          регионы.
        </div>
      </div>
    </Card>
  );
}
