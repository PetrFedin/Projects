'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Scissors, Truck, Factory, ArrowRight } from 'lucide-react';
import { getProductionLeadTime } from '@/lib/fashion/production-leadtime';
import type { Product } from '@/lib/types';

export function ProductProductionLeadTimeBlock({ product }: { product: Product }) {
  const leadTime = getProductionLeadTime(product.sku);

  return (
<<<<<<< HEAD
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/5 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Factory className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Production Lead Time Estimator
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
    <Card className="border-border-subtle bg-bg-surface2/5 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Factory className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Production Lead Time Estimator
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
          Global Sourcing Hub
        </div>
      </div>

<<<<<<< HEAD
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
        <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500" />
        <div className="text-[28px] font-black leading-none text-slate-800">
          {leadTime.totalLeadDays}
        </div>
        <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
          Total Cycle Days
        </div>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-bold text-indigo-600">
=======
      <div className="border-border-subtle relative mb-6 overflow-hidden rounded-2xl border bg-white p-4 text-center shadow-sm">
        <div className="bg-accent-primary absolute left-0 top-0 h-full w-1" />
        <div className="text-text-primary text-[28px] font-black leading-none">
          {leadTime.totalLeadDays}
        </div>
        <div className="text-text-muted mt-1 text-[9px] font-black uppercase tracking-widest">
          Total Cycle Days
        </div>
        <div className="text-accent-primary mt-2 flex items-center justify-center gap-1.5 text-[10px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            color: 'text-indigo-500',
=======
            color: 'text-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            color: 'text-slate-500',
=======
            color: 'text-text-secondary',
>>>>>>> recover/cabinet-wip-from-stash
          },
        ].map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
<<<<<<< HEAD
              className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm`}
            >
              <step.icon className={`h-4 w-4 ${step.color}`} />
            </div>
            <div className="text-[8px] font-black text-slate-800">{step.days}d</div>
            <div className="mt-0.5 text-center text-[6px] font-black uppercase text-slate-400">
=======
              className={`border-border-subtle mb-1 flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm`}
            >
              <step.icon className={`h-4 w-4 ${step.color}`} />
            </div>
            <div className="text-text-primary text-[8px] font-black">{step.days}d</div>
            <div className="text-text-muted mt-0.5 text-center text-[6px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
              {step.label}
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      <button className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 text-[9px] font-black uppercase text-slate-600 transition-colors hover:bg-slate-200">
=======
      <button className="bg-bg-surface2 hover:bg-bg-surface2 text-text-secondary mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-xl text-[9px] font-black uppercase transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
        Download Critical Path (Gantt) <ArrowRight className="h-3 w-3" />
      </button>
    </Card>
  );
}
