'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Undo2, Timer, AlertTriangle } from 'lucide-react';
import { getPvzEfficiency } from '@/lib/fashion/pvz-efficiency';

export const ProductPvzEfficiencyBlock: React.FC<{ product: Product }> = ({ product }) => {
  const e = getPvzEfficiency(product);

  return (
    <Card className="relative overflow-hidden border-2 border-orange-50 bg-orange-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-45 p-2 opacity-5">
        <MapPin className="h-12 w-12 text-orange-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-orange-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-orange-700">
            PVZ Fitting Efficiency
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-orange-500">
          Marketplace Logistics
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
<<<<<<< HEAD
          <div className="text-2xl font-black text-slate-800">{e.pvzTryOnRate}%</div>
          <div className="text-[10px] font-black uppercase leading-none text-slate-400">
=======
          <div className="text-text-primary text-2xl font-black">{e.pvzTryOnRate}%</div>
          <div className="text-text-muted text-[10px] font-black uppercase leading-none">
>>>>>>> recover/cabinet-wip-from-stash
            PVZ Try-on Rate
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-rose-600">{e.pvzReturnRate}%</div>
<<<<<<< HEAD
          <div className="text-[10px] font-black uppercase leading-none text-slate-400">
=======
          <div className="text-text-muted text-[10px] font-black uppercase leading-none">
>>>>>>> recover/cabinet-wip-from-stash
            Instant Return
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-lg border border-orange-100 bg-white p-3 shadow-sm">
<<<<<<< HEAD
        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
          <span className="flex items-center gap-1.5">
            <Timer className="h-3 w-3" /> Avg. Time at PVZ
          </span>
          <span className="text-slate-700">{e.avgStayAtPvz} min</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
=======
        <div className="text-text-secondary flex items-center justify-between text-[10px] font-black uppercase">
          <span className="flex items-center gap-1.5">
            <Timer className="h-3 w-3" /> Avg. Time at PVZ
          </span>
          <span className="text-text-primary">{e.avgStayAtPvz} min</span>
        </div>
        <div className="text-text-secondary flex items-center justify-between text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3 text-rose-500" /> Logistic Loss
          </span>
          <span className="text-rose-600">{e.logisticLossPerUnit} ₽ / unit</span>
        </div>
      </div>

<<<<<<< HEAD
      <div className="mt-4 flex items-center justify-between border-t border-orange-100 pt-3 text-[9px] font-bold uppercase italic text-slate-400">
=======
      <div className="text-text-muted mt-4 flex items-center justify-between border-t border-orange-100 pt-3 text-[9px] font-bold uppercase italic">
>>>>>>> recover/cabinet-wip-from-stash
        <span>Data: WB/Ozon PVZ Aggregator</span>
        <span className="text-orange-600">Risk: {e.pvzReturnRate > 30 ? 'High' : 'Optimal'}</span>
      </div>
    </Card>
  );
};
