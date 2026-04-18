'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MapPin, Gauge, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import { getRegionalDemandPrediction } from '@/lib/fashion/regional-demand';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductRegionalDemandBlock({ product }: { product: Product }) {
  const predictions = getRegionalDemandPrediction(product.sku);

  return (
<<<<<<< HEAD
    <Card className="my-4 border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <TrendingUp className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Predictive Regional Demand (RU)
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase text-slate-400">AI Forecasting Mode</div>
=======
    <Card className="border-border-subtle bg-bg-surface2/10 my-4 border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Predictive Regional Demand (RU)
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase">AI Forecasting Mode</div>
>>>>>>> recover/cabinet-wip-from-stash
      </div>

      <div className="space-y-4">
        {predictions.map((p) => (
          <div key={p.region} className="group">
            <div className="mb-1.5 flex items-end justify-between">
              <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                <MapPin className="h-3 w-3 text-indigo-500" />
                <div className="text-[10px] font-black text-slate-700">{p.region}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-900">{p.predictedQty} Units</div>
=======
                <MapPin className="text-accent-primary h-3 w-3" />
                <div className="text-text-primary text-[10px] font-black">{p.region}</div>
              </div>
              <div className="text-right">
                <div className="text-text-primary text-[10px] font-black">
                  {p.predictedQty} Units
                </div>
>>>>>>> recover/cabinet-wip-from-stash
                <div className="text-[7px] font-black uppercase tracking-tighter text-emerald-600">
                  Index: {p.demandIndex}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
<<<<<<< HEAD
                <Progress value={p.demandIndex} className="h-1 bg-slate-100 fill-indigo-500" />
              </div>
              <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400">
=======
                <Progress
                  value={p.demandIndex}
                  className="bg-bg-surface2 fill-accent-primary h-1"
                />
              </div>
              <div className="text-text-muted flex items-center gap-1 text-[8px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                <Gauge className="h-3 w-3" /> {p.confidence}%
              </div>
            </div>

<<<<<<< HEAD
            <div className="mt-1 flex items-center gap-1 text-[7px] font-black uppercase tracking-widest text-slate-400">
              Factor: <span className="text-indigo-500">{p.growthFactor.replace('_', ' ')}</span>
=======
            <div className="text-text-muted mt-1 flex items-center gap-1 text-[7px] font-black uppercase tracking-widest">
              Factor:{' '}
              <span className="text-accent-primary">{p.growthFactor.replace('_', ' ')}</span>
>>>>>>> recover/cabinet-wip-from-stash
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      <button className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-white text-[9px] font-black uppercase text-indigo-600 shadow-sm transition-all hover:bg-indigo-50">
=======
      <button className="border-accent-primary/20 text-accent-primary hover:bg-accent-primary/10 mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-xl border bg-white text-[9px] font-black uppercase shadow-sm transition-all">
>>>>>>> recover/cabinet-wip-from-stash
        Adjust regional allocation <ArrowRight className="h-3 w-3" />
      </button>
    </Card>
  );
}
