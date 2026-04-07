'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, TrendingUp, Info, Zap, Globe, Users } from 'lucide-react';
import { getRegionalDemandData, getRegionRecommendation } from '@/lib/fashion/regional-demand';
import { Progress } from '@/components/ui/progress';

export default function RegionalDemandPage() {
  const demandData = getRegionalDemandData();
  
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 rounded-lg shadow-sm">
            <Map className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 tracking-tighter uppercase">Regional Demand Heatmap (RF)</h1>
        </div>
        <p className="text-muted-foreground font-medium max-w-2xl">
           Анализ потребительского спроса по федеральным округам РФ. Используется для оптимизации распределения стока и планирования региональных маркетинговых кампаний.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-6">
           {demandData.map((item) => (
             <Card key={item.region} className="p-6 border-2 border-slate-50 hover:border-indigo-100 transition-all shadow-md">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                         <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{item.region}</h3>
                         <Badge variant="outline" className={cn("text-[9px] font-black uppercase", item.growthRate > 15 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100')}>
                            +{item.growthRate}% Growth
                         </Badge>
                      </div>

                      <div className="space-y-4">
                         <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                               <span>Market Demand Score</span>
                               <span>{item.demandScore}/100</span>
                            </div>
                            <Progress value={item.demandScore} className="h-2 bg-slate-100 fill-indigo-500" />
                         </div>

                         <div className="flex flex-wrap gap-2">
                            {item.topCategories.map(cat => (
                              <Badge key={cat} variant="secondary" className="bg-slate-100 text-slate-600 text-[9px] font-black uppercase border-none">
                                 {cat}
                              </Badge>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="w-full md:w-64 space-y-3 pt-2">
                      <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                         <div className="text-[9px] font-black text-indigo-400 uppercase mb-2 flex items-center gap-1.5">
                            <Zap className="w-3 h-3" /> AI Strategy
                         </div>
                         <p className="text-[11px] font-bold text-indigo-900 leading-tight">
                            {getRegionRecommendation(item.region)}
                         </p>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase px-1">
                         <span className="text-slate-400">Saturation</span>
                         <span className={cn(item.competitorSaturation === 'high' ? 'text-rose-500' : 'text-emerald-500')}>
                            {item.competitorSaturation}
                         </span>
                      </div>
                   </div>
                </div>
             </Card>
           ))}
        </div>

        <div className="space-y-6">
           <Card className="p-6 bg-slate-900 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <Globe className="w-32 h-32" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                 <Users className="w-5 h-5 text-indigo-400" /> National Overview
              </h3>
              <div className="space-y-6 relative z-10">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                       <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Demand</div>
                       <div className="text-2xl font-black">76%</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                       <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Avg Growth</div>
                       <div className="text-2xl font-black text-emerald-400">+11.4%</div>
                    </div>
                 </div>
                 <div className="p-4 bg-indigo-600 rounded-xl shadow-lg">
                    <h4 className="text-[10px] font-black uppercase mb-2">Primary Trend (RF)</h4>
                    <p className="text-sm font-bold leading-tight">
                       Усиление спроса на "Quiet Luxury" в мегаполисах и запрос на технологичную верхнюю одежду в северных регионах.
                    </p>
                 </div>
              </div>
           </Card>

           <Card className="p-6 border-2 border-slate-100 bg-white shadow-md">
              <h3 className="font-black text-sm uppercase text-slate-800 mb-6">Regional Sync Status</h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs font-bold text-slate-600 uppercase">WB/Ozon API: Operational</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs font-bold text-slate-600 uppercase">Internal POS: Synced</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <span className="text-xs font-bold text-slate-600 uppercase">Logistics Data: 4h Lag</span>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
