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
    <Card className="relative overflow-hidden border-2 border-sky-50 bg-sky-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 -rotate-12 p-2 opacity-5">
        <Thermometer className="h-16 w-16 text-sky-400" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shirt className="h-4 w-4 text-sky-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-sky-700">
            Seasonal Material Fit (RU)
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-sky-500">
          <Wind className="h-3 w-3" /> GSM Analysis
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
<<<<<<< HEAD
          <div className="text-2xl font-black leading-none text-slate-800">
            {analysis.fitScore}%
          </div>
          <div className="mt-1 text-[10px] font-black uppercase leading-none text-slate-400">
=======
          <div className="text-text-primary text-2xl font-black leading-none">
            {analysis.fitScore}%
          </div>
          <div className="text-text-muted mt-1 text-[10px] font-black uppercase leading-none">
>>>>>>> recover/cabinet-wip-from-stash
            Season Match
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-black text-sky-700">{analysis.recommendedTempRange}</div>
<<<<<<< HEAD
          <div className="mt-1 text-[10px] font-black uppercase leading-none text-slate-400">
=======
          <div className="text-text-muted mt-1 text-[10px] font-black uppercase leading-none">
>>>>>>> recover/cabinet-wip-from-stash
            Optimal Range
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-sky-100 bg-white p-3 shadow-sm">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
        <div className="text-[11px] font-medium leading-tight text-sky-800">
          {analysis.advice} Material density: {analysis.materialGsm} GSM.
        </div>
      </div>

<<<<<<< HEAD
      <div className="mt-4 flex items-center gap-2 border-t border-sky-100 pt-3 text-[9px] font-bold uppercase italic text-slate-400">
=======
      <div className="text-text-muted mt-4 flex items-center gap-2 border-t border-sky-100 pt-3 text-[9px] font-bold uppercase italic">
>>>>>>> recover/cabinet-wip-from-stash
        <Info className="h-3 w-3" /> Fabric Density vs RF Regional Climate v1.4
      </div>
    </Card>
  );
};
