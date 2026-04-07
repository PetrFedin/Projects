'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, ExternalLink, Activity, Info, TrendingDown, Clock, Package } from 'lucide-react';
import { getOptimizedLogisticsRoutes } from '@/lib/fashion/logistics-optimizer';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductLogisticsOptimizerBlock({ product }: { product: Product }) {
  const routes = getOptimizedLogisticsRoutes('Moscow', 'Novosibirsk', 50);

  return (
    <Card className="p-4 border-2 border-emerald-50 bg-emerald-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Truck className="w-16 h-16 text-emerald-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <Truck className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">AI B2B Logistics Route Optimizer (RU Delivery)</h4>
        </div>
        <Badge className="bg-emerald-600 text-white text-[8px] font-black border-none uppercase">Central RU → Novosibirsk</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-3">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
               <Activity className="w-3 h-3" /> Carrier Options
            </div>
            {routes.map(r => (
              <div key={r.id} className="p-2.5 bg-white/80 rounded-xl border border-emerald-200 shadow-sm flex justify-between items-center group cursor-pointer hover:bg-white transition-colors">
                 <div>
                    <div className="text-[10px] font-black uppercase text-slate-800">{r.carrier}</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">{r.estDays} Days • {r.costRub.toLocaleString()} ₽</div>
                 </div>
                 <Badge className="bg-emerald-600/20 text-emerald-600 border-none text-[8px] h-3.5">{r.reliabilityScore}% REL</Badge>
              </div>
            ))}
         </div>

         <div className="space-y-3">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
               <TrendingDown className="w-3 h-3" /> Delivery Efficiency
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
               <div className="p-3 bg-white/50 rounded-xl border border-emerald-100">
                  <Clock className="w-4 h-4 text-emerald-600 mb-1 mx-auto" />
                  <div className="text-[12px] font-black text-slate-800">3-4 D.</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Avg. TAT</div>
               </div>
               <div className="p-3 bg-white/50 rounded-xl border border-emerald-100">
                  <Package className="w-4 h-4 text-sky-600 mb-1 mx-auto" />
                  <div className="text-[12px] font-black text-sky-600">-12%</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Consolidation</div>
               </div>
            </div>
            
            <div className="p-3 bg-white/80 rounded-xl border border-emerald-200 shadow-sm mt-2">
               <div className="flex items-center gap-2 mb-2">
                  <Info className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[9px] font-black uppercase text-slate-700">AI Insights</span>
               </div>
               <p className="text-[9px] font-bold text-slate-600 leading-tight italic">
                  "Peak logistics congestion in Novosibirsk. PEK route recommended for bulk non-urgent shipments."
               </p>
            </div>
         </div>
      </div>

      <div className="mt-4 pt-4 border-t border-emerald-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Integrated with RU Carrier APIs</span>
         <span className="text-emerald-600 flex items-center gap-1">
            Track All Shipments <ExternalLink className="w-3 h-3" />
         </span>
      </div>
    </Card>
  );
}
