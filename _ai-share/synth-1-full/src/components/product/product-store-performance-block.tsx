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
    <Card className="p-4 border-2 border-emerald-50 bg-emerald-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <BarChart3 className="w-16 h-16 text-emerald-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <BarChart3 className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Predictive Store-Tier Analytics</h4>
        </div>
        <Badge className="bg-emerald-600 text-white text-[8px] font-black border-none uppercase">Retail Insights Active</Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div className="space-y-4">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
               <TrendingUp className="w-3 h-3" /> Sell-Through Projections
            </div>
            <div className="space-y-3">
               {perf.map(p => (
                 <div key={p.storeType} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase">
                       <span className="text-slate-500">{p.storeType}</span>
                       <span className="text-emerald-600">{p.predictedSellThrough}% ST</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${p.predictedSellThrough}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="space-y-3">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
               <Activity className="w-3 h-3" /> Retail Demographics
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
               <div className="p-3 bg-white/50 rounded-xl border border-emerald-100">
                  <Users className="w-4 h-4 text-emerald-600 mb-1 mx-auto" />
                  <div className="text-[12px] font-black text-slate-800 uppercase leading-none">{perf[0].bestSellingSize}</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Key Size</div>
               </div>
               <div className="p-3 bg-white/50 rounded-xl border border-emerald-100">
                  <Activity className="w-4 h-4 text-sky-600 mb-1 mx-auto" />
                  <div className="text-[12px] font-black text-sky-600 uppercase leading-none">{perf[0].trafficIntensity}/10</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Traffic Ind.</div>
               </div>
            </div>
            
            <div className="p-4 bg-emerald-600/5 rounded-xl border border-emerald-200 shadow-sm mt-2">
               <div className="text-[8px] font-black text-emerald-600 uppercase mb-2">Strategic Note</div>
               <p className="text-[9px] font-bold text-slate-600 leading-tight">
                  High sell-through in Corner/Mall locations indicates strong impulse-buy potential. Increase display front-load.
               </p>
            </div>
         </div>
      </div>

      <div className="mt-4 pt-4 border-t border-emerald-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Model Based on 2024-25 Retail Network Data</span>
         <span className="text-emerald-600">Real-time Benchmarking Active</span>
      </div>
    </Card>
  );
}
