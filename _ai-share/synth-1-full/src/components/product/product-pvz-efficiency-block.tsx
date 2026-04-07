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
    <Card className="p-4 border-2 border-orange-50 bg-orange-50/10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 rotate-45">
        <MapPin className="w-12 h-12 text-orange-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-orange-600" />
          <h4 className="font-bold text-xs uppercase text-orange-700 tracking-tight">PVZ Fitting Efficiency</h4>
        </div>
        <div className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-1">
           Marketplace Logistics
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-black text-slate-800">{e.pvzTryOnRate}%</div>
          <div className="text-[10px] font-black text-slate-400 uppercase leading-none">PVZ Try-on Rate</div>
        </div>
        <div>
          <div className="text-2xl font-black text-rose-600">{e.pvzReturnRate}%</div>
          <div className="text-[10px] font-black text-slate-400 uppercase leading-none">Instant Return</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg border border-orange-100 flex flex-col gap-2 shadow-sm">
         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
            <span className="flex items-center gap-1.5"><Timer className="w-3 h-3" /> Avg. Time at PVZ</span>
            <span className="text-slate-700">{e.avgStayAtPvz} min</span>
         </div>
         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
            <span className="flex items-center gap-1.5"><AlertTriangle className="w-3 h-3 text-rose-500" /> Logistic Loss</span>
            <span className="text-rose-600">{e.logisticLossPerUnit} ₽ / unit</span>
         </div>
      </div>

      <div className="mt-4 pt-3 border-t border-orange-100 text-[9px] text-slate-400 font-bold uppercase italic flex justify-between items-center">
         <span>Data: WB/Ozon PVZ Aggregator</span>
         <span className="text-orange-600">Risk: {e.pvzReturnRate > 30 ? 'High' : 'Optimal'}</span>
      </div>
    </Card>
  );
};
