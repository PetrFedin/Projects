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
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/5 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Factory className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Production Lead Time Estimator
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">
          Global Sourcing Hub
        </div>
      </div>

      <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
        <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500" />
        <div className="text-[28px] font-black leading-none text-slate-800">
          {leadTime.totalLeadDays}
        </div>
        <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
          Total Cycle Days
        </div>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-bold text-indigo-600">
          <Calendar className="h-3.5 w-3.5" /> Est. Launch: {leadTime.estimatedDeliveryDate}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        {[
          {
            icon: Scissors,
            label: 'Samples',
            days: leadTime.samplingDays,
            color: 'text-amber-500',
          },
          {
            icon: Clock,
            label: 'Raw Mat',
            days: leadTime.rawMaterialLeadDays,
            color: 'text-indigo-500',
          },
          {
            icon: Factory,
            label: 'Prod',
            days: leadTime.productionDays,
            color: 'text-emerald-500',
          },
          {
            icon: Truck,
            label: 'Logistics',
            days: leadTime.logisticsDays,
            color: 'text-slate-500',
          },
        ].map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm`}
            >
              <step.icon className={`h-4 w-4 ${step.color}`} />
            </div>
            <div className="text-[8px] font-black text-slate-800">{step.days}d</div>
            <div className="mt-0.5 text-center text-[6px] font-black uppercase text-slate-400">
              {step.label}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 text-[9px] font-black uppercase text-slate-600 transition-colors hover:bg-slate-200">
        Download Critical Path (Gantt) <ArrowRight className="h-3 w-3" />
      </button>
    </Card>
  );
}
