'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, MapPin, Activity } from 'lucide-react';
import { getStorePerformanceAnalytics } from '@/lib/fashion/store-performance';
import type { Product } from '@/lib/types';

export function ProductStorePerformanceBlock({ product }: { product: Product }) {
  const perf = getStorePerformanceAnalytics(product.sku);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-emerald-50 bg-emerald-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <BarChart3 className="h-16 w-16 text-emerald-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600">
          <BarChart3 className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Predictive Store-Tier Analytics
          </h4>
        </div>
        <Badge className="border-none bg-emerald-600 text-[8px] font-black uppercase text-white">
          Retail Insights Active
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="mb-1 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
            <TrendingUp className="h-3 w-3" /> Sell-Through Projections
          </div>
          <div className="space-y-3">
            {perf.map((p) => (
              <div key={p.storeType} className="space-y-1.5">
                <div className="flex items-center justify-between text-[9px] font-black uppercase">
                  <span className="text-slate-500">{p.storeType}</span>
                  <span className="text-emerald-600">{p.predictedSellThrough}% ST</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-1000"
                    style={{ width: `${p.predictedSellThrough}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="mb-1 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
            <Activity className="h-3 w-3" /> Retail Demographics
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-xl border border-emerald-100 bg-white/50 p-3">
              <Users className="mx-auto mb-1 h-4 w-4 text-emerald-600" />
              <div className="text-[12px] font-black uppercase leading-none text-slate-800">
                {perf[0].bestSellingSize}
              </div>
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">Key Size</div>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white/50 p-3">
              <Activity className="mx-auto mb-1 h-4 w-4 text-sky-600" />
              <div className="text-[12px] font-black uppercase leading-none text-sky-600">
                {perf[0].trafficIntensity}/10
              </div>
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">
                Traffic Ind.
              </div>
            </div>
          </div>

          <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-600/5 p-4 shadow-sm">
            <div className="mb-2 text-[8px] font-black uppercase text-emerald-600">
              Strategic Note
            </div>
            <p className="text-[9px] font-bold leading-tight text-slate-600">
              High sell-through in Corner/Mall locations indicates strong impulse-buy potential.
              Increase display front-load.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-emerald-100 pt-4 text-[8px] font-black uppercase text-slate-400">
        <span>Model Based on 2024-25 Retail Network Data</span>
        <span className="text-emerald-600">Real-time Benchmarking Active</span>
      </div>
    </Card>
  );
}
