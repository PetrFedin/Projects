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
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <TrendingUp className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Predictive Regional Demand (RU)</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase">AI Forecasting Mode</div>
      </div>

      <div className="space-y-4">
        {predictions.map((p) => (
          <div key={p.region} className="group">
            <div className="flex justify-between items-end mb-1.5">
               <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-indigo-500" />
                  <div className="text-[10px] font-black text-slate-700">{p.region}</div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-black text-slate-900">{p.predictedQty} Units</div>
                  <div className="text-[7px] font-black text-emerald-600 uppercase tracking-tighter">Index: {p.demandIndex}</div>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="flex-1">
                  <Progress value={p.demandIndex} className="h-1 bg-slate-100 fill-indigo-500" />
               </div>
               <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400">
                  <Gauge className="w-3 h-3" /> {p.confidence}%
               </div>
            </div>
            
            <div className="mt-1 flex items-center gap-1 text-[7px] font-black text-slate-400 uppercase tracking-widest">
               Factor: <span className="text-indigo-500">{p.growthFactor.replace('_', ' ')}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 h-9 bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all shadow-sm">
         Adjust regional allocation <ArrowRight className="w-3 h-3" />
      </button>
    </Card>
  );
}
