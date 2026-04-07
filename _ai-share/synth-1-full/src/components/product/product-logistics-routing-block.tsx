'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Gauge, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { getLogisticsRouting } from '@/lib/fashion/logistics-routing';
import type { Product } from '@/lib/types';

export function ProductLogisticsRoutingBlock({ product }: { product: Product }) {
  const routing = getLogisticsRouting(product.sku);

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Truck className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Regional Middle-Mile Routing</h4>
        </div>
        <Badge className="bg-indigo-100 text-indigo-700 border-none uppercase text-[8px] font-black">
          {routing.routeType}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-4">
         <div className="p-3 bg-white rounded-xl border border-slate-100 flex-1">
            <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Transit Time</div>
            <div className="text-lg font-black text-slate-800 leading-none">{routing.transitDays} Days</div>
         </div>
         <div className="p-3 bg-white rounded-xl border border-slate-100 flex-1">
            <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Cost Per Unit</div>
            <div className="text-lg font-black text-slate-800 leading-none">{routing.costPerUnit} ₽</div>
         </div>
      </div>

      <div className="space-y-2 mb-4">
         <div className="flex items-center gap-2 p-2.5 bg-indigo-50/30 rounded-lg border border-indigo-100">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <div className="text-[10px] font-bold text-slate-700">
               {routing.warehouseId} <ArrowRight className="inline w-3 h-3 mx-1 text-slate-400" /> {routing.targetRegion}
            </div>
         </div>
      </div>

      <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400 tracking-tighter">
         <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Customs Cleared (EAEU)
         </div>
         <div className="text-slate-300">CO2 Impact: {routing.co2Impact}kg</div>
      </div>
    </Card>
  );
}
