'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, TrendingUp, Target, ArrowUpRight, Activity } from 'lucide-react';
import { getWholesaleRegionalHeatmap } from '@/lib/fashion/wholesale-regional-heatmap';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductWholesaleHeatmapBlock({ product }: { product: Product }) {
  const heatmap = getWholesaleRegionalHeatmap(product.sku);

  return (
    <Card className="group relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Map className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Regional Demand Heatmap
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">
          Wholesale Pro
        </div>
      </div>

      <div className="space-y-4">
        {heatmap.map((h) => (
          <div
            key={h.region}
            className="group/item relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${h.interestScore > 70 ? 'bg-indigo-100' : 'bg-slate-100'}`}
                >
                  <Target
                    className={`h-4 w-4 ${h.interestScore > 70 ? 'text-indigo-600' : 'text-slate-400'}`}
                  />
                </div>
                <div>
                  <div className="text-[11px] font-black leading-tight text-slate-800 transition-colors group-hover/item:text-indigo-600">
                    {h.region}
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                    Projected: {h.projectedUnits} units
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-black text-slate-800">{h.interestScore}%</div>
                <div className="text-[7px] font-black uppercase text-slate-400">Interest</div>
              </div>
            </div>

            <Progress
              value={h.interestScore}
              className="h-1 rounded-full bg-slate-50 fill-indigo-600"
            />

            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />
              <span className="text-[7px] font-black uppercase text-emerald-600">
                +{h.growthRate}% Growth
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="group/btn relative mt-4 flex cursor-pointer items-center justify-between overflow-hidden rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-100">
        <div className="absolute right-0 top-0 p-2 opacity-10 transition-transform group-hover/btn:scale-125">
          <Activity className="h-12 w-12 text-white" />
        </div>
        <div className="relative z-10 text-[10px] font-black uppercase tracking-widest">
          Export Demand Report
        </div>
        <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" />
      </div>
    </Card>
  );
}
