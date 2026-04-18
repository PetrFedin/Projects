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
    <Card className="my-4 border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <TrendingUp className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Predictive Regional Demand (RU)
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase text-slate-400">AI Forecasting Mode</div>
      </div>

      <div className="space-y-4">
        {predictions.map((p) => (
          <div key={p.region} className="group">
            <div className="mb-1.5 flex items-end justify-between">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-indigo-500" />
                <div className="text-[10px] font-black text-slate-700">{p.region}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-900">{p.predictedQty} Units</div>
                <div className="text-[7px] font-black uppercase tracking-tighter text-emerald-600">
                  Index: {p.demandIndex}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Progress value={p.demandIndex} className="h-1 bg-slate-100 fill-indigo-500" />
              </div>
              <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400">
                <Gauge className="h-3 w-3" /> {p.confidence}%
              </div>
            </div>

            <div className="mt-1 flex items-center gap-1 text-[7px] font-black uppercase tracking-widest text-slate-400">
              Factor: <span className="text-indigo-500">{p.growthFactor.replace('_', ' ')}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-white text-[9px] font-black uppercase text-indigo-600 shadow-sm transition-all hover:bg-indigo-50">
        Adjust regional allocation <ArrowRight className="h-3 w-3" />
      </button>
    </Card>
  );
}
