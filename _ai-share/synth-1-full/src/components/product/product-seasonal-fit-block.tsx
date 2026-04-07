'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Shirt, Info, Sparkles, Wind } from 'lucide-react';
import { analyzeSeasonalFit } from '@/lib/fashion/seasonal-fit-analysis';

export const ProductSeasonalFitBlock: React.FC<{ product: Product }> = ({ product }) => {
  const analysis = analyzeSeasonalFit(product);
  
  return (
    <Card className="p-4 border-2 border-sky-50 bg-sky-50/10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 -rotate-12">
        <Thermometer className="w-16 h-16 text-sky-400" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shirt className="w-4 h-4 text-sky-600" />
          <h4 className="font-bold text-xs uppercase text-sky-700 tracking-tight">Seasonal Material Fit (RU)</h4>
        </div>
        <div className="text-[10px] font-black text-sky-500 uppercase flex items-center gap-1">
          <Wind className="w-3 h-3" /> GSM Analysis
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
           <div className="text-2xl font-black text-slate-800 leading-none">{analysis.fitScore}%</div>
           <div className="text-[10px] font-black text-slate-400 uppercase leading-none mt-1">Season Match</div>
        </div>
        <div className="text-right">
           <div className="text-xs font-black text-sky-700">{analysis.recommendedTempRange}</div>
           <div className="text-[10px] font-black text-slate-400 uppercase leading-none mt-1">Optimal Range</div>
        </div>
      </div>

      <div className="p-3 bg-white rounded-lg border border-sky-100 flex gap-3 items-start shadow-sm">
         <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
         <div className="text-[11px] font-medium text-sky-800 leading-tight">
            {analysis.advice} Material density: {analysis.materialGsm} GSM.
         </div>
      </div>

      <div className="mt-4 pt-3 border-t border-sky-100 flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase italic">
         <Info className="w-3 h-3" /> Fabric Density vs RF Regional Climate v1.4
      </div>
    </Card>
  );
};
