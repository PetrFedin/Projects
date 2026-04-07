'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudSun, Thermometer, Wind, TrendingUp, Compass, AlertCircle } from 'lucide-react';
import { getWeatherDemandCorrelation } from '@/lib/fashion/weather-demand';
import type { Product } from '@/lib/types';

export function ProductWeatherDemandBlock({ product }: { product: Product }) {
  const regions = ['Central Russia', 'Siberia (Novosibirsk)', 'South (Krasnodar)', 'North-West (SPB)'];
  const activeRegion = regions[0];
  const correlation = getWeatherDemandCorrelation(product.sku, activeRegion);

  return (
    <Card className="p-4 border-2 border-sky-50 bg-sky-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <CloudSun className="w-16 h-16 text-sky-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sky-600">
          <CloudSun className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Regional Weather-Demand Nexus</h4>
        </div>
        <Badge className="bg-sky-600 text-white text-[8px] font-black border-none uppercase">Central RU (June 26)</Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="flex flex-col items-center p-3 bg-white/50 rounded-xl border border-sky-100 min-w-[70px]">
                  <Thermometer className="w-5 h-5 text-sky-600 mb-1" />
                  <div className="text-[12px] font-black text-slate-800 uppercase leading-none">{correlation.idealTempRange}</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Ideal Range</div>
               </div>
               <div className="flex flex-col items-center p-3 bg-white/50 rounded-xl border border-sky-100 min-w-[70px]">
                  <TrendingUp className="w-5 h-5 text-emerald-600 mb-1" />
                  <div className="text-[12px] font-black text-emerald-600 uppercase leading-none">+{Math.round((correlation.demandShiftFactor - 1) * 100)}%</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Demand Shift</div>
               </div>
            </div>
            
            <div className="p-3 bg-white/80 rounded-xl border border-sky-200 shadow-sm relative">
               <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-3.5 h-3.5 text-sky-600" />
                  <span className="text-[9px] font-black uppercase text-slate-700">AI Recommendation</span>
               </div>
               <p className="text-[10px] font-bold text-slate-600 leading-tight">
                  {correlation.recommendation}
               </p>
            </div>
         </div>

         <div className="space-y-3">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
               <Compass className="w-3 h-3" /> Sensitivity Map
            </div>
            <div className="space-y-2">
               {regions.map(reg => {
                 const regCorr = getWeatherDemandCorrelation(product.sku, reg);
                 return (
                   <div key={reg} className="space-y-1">
                      <div className="flex justify-between text-[8px] font-black uppercase text-slate-500">
                         <span>{reg}</span>
                         <span>{regCorr.temperatureSensitivity}/10 Sens.</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-sky-400" style={{ width: `${regCorr.temperatureSensitivity * 10}%` }} />
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>
      </div>

      <div className="mt-4 pt-4 border-t border-sky-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Powered by RU Weather Forecast APIs</span>
         <span className="text-sky-600">Predictive Modeling Active</span>
      </div>
    </Card>
  );
}
