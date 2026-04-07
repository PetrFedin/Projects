'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Scissors, Truck, Factory, ArrowRight } from 'lucide-react';
import { getProductionLeadTime } from '@/lib/fashion/production-leadtime.ts';
import type { Product } from '@/lib/types';

export function ProductProductionLeadTimeBlock({ product }: { product: Product }) {
  const leadTime = getProductionLeadTime(product.sku);

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/5 shadow-sm my-4 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Factory className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Production Lead Time Estimator</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Sourcing Hub</div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
         <div className="text-[28px] font-black text-slate-800 leading-none">{leadTime.totalLeadDays}</div>
         <div className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">Total Cycle Days</div>
         <div className="mt-2 text-[10px] font-bold text-indigo-600 flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Est. Launch: {leadTime.estimatedDeliveryDate}
         </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
         {[
           { icon: Scissors, label: 'Samples', days: leadTime.samplingDays, color: 'text-amber-500' },
           { icon: Clock, label: 'Raw Mat', days: leadTime.rawMaterialLeadDays, color: 'text-indigo-500' },
           { icon: Factory, label: 'Prod', days: leadTime.productionDays, color: 'text-emerald-500' },
           { icon: Truck, label: 'Logistics', days: leadTime.logisticsDays, color: 'text-slate-500' },
         ].map((step, i) => (
           <div key={i} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-1`}>
                 <step.icon className={`w-4 h-4 ${step.color}`} />
              </div>
              <div className="text-[8px] font-black text-slate-800">{step.days}d</div>
              <div className="text-[6px] font-black text-slate-400 uppercase text-center mt-0.5">{step.label}</div>
           </div>
         ))}
      </div>

      <button className="w-full mt-2 h-9 bg-slate-100 hover:bg-slate-200 rounded-xl text-[9px] font-black uppercase text-slate-600 flex items-center justify-center gap-2 transition-colors">
         Download Critical Path (Gantt) <ArrowRight className="w-3 h-3" />
      </button>
    </Card>
  );
}
