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
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Map className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Regional Demand Heatmap</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Wholesale Pro</div>
      </div>

      <div className="space-y-4">
         {heatmap.map((h) => (
           <div key={h.region} className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group/item">
              <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${h.interestScore > 70 ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                       <Target className={`w-4 h-4 ${h.interestScore > 70 ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                       <div className="text-[11px] font-black text-slate-800 leading-tight group-hover/item:text-indigo-600 transition-colors">{h.region}</div>
                       <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Projected: {h.projectedUnits} units</div>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-[11px] font-black text-slate-800">{h.interestScore}%</div>
                    <div className="text-[7px] font-black text-slate-400 uppercase">Interest</div>
                 </div>
              </div>
              
              <Progress value={h.interestScore} className="h-1 bg-slate-50 fill-indigo-600 rounded-full" />
              
              <div className="mt-2 flex items-center gap-1">
                 <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
                 <span className="text-[7px] font-black text-emerald-600 uppercase">+{h.growthRate}% Growth</span>
              </div>
           </div>
         ))}
      </div>

      <div className="mt-4 p-3 bg-indigo-600 text-white rounded-2xl flex items-center justify-between shadow-lg shadow-indigo-100 relative overflow-hidden group/btn cursor-pointer">
         <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/btn:scale-125 transition-transform">
            <Activity className="w-12 h-12 text-white" />
         </div>
         <div className="text-[10px] font-black uppercase tracking-widest relative z-10">Export Demand Report</div>
         <ArrowUpRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
      </div>
    </Card>
  );
}
