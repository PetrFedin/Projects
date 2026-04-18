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
    <Card className="border-border-subtle bg-bg-surface2/5 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Factory className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Production Lead Time Estimator
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase tracking-widest">
          Global Sourcing Hub
        </div>
      </div>

      <div className="border-border-subtle relative mb-6 overflow-hidden rounded-2xl border bg-white p-4 text-center shadow-sm">
        <div className="bg-accent-primary absolute left-0 top-0 h-full w-1" />
        <div className="text-text-primary text-[28px] font-black leading-none">
          {leadTime.totalLeadDays}
        </div>
        <div className="text-text-muted mt-1 text-[9px] font-black uppercase tracking-widest">
          Total Cycle Days
        </div>
        <div className="text-accent-primary mt-2 flex items-center justify-center gap-1.5 text-[10px] font-bold">
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
            color: 'text-accent-primary',
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
            color: 'text-text-secondary',
          },
        ].map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`border-border-subtle mb-1 flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm`}
            >
              <step.icon className={`h-4 w-4 ${step.color}`} />
            </div>
            <div className="text-text-primary text-[8px] font-black">{step.days}d</div>
            <div className="text-text-muted mt-0.5 text-center text-[6px] font-black uppercase">
              {step.label}
            </div>
          </div>
        ))}
      </div>

      <button className="bg-bg-surface2 hover:bg-bg-surface2 text-text-secondary mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-xl text-[9px] font-black uppercase transition-colors">
        Download Critical Path (Gantt) <ArrowRight className="h-3 w-3" />
      </button>
    </Card>
  );
}
