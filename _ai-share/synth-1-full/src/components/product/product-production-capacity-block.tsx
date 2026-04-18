'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Factory, Calendar, Settings, Activity, AlertTriangle, ArrowRight } from 'lucide-react';
import { getFactoryCapacityStatus } from '@/lib/fashion/factory-capacity';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductProductionCapacityBlock({ product }: { product: Product }) {
  const cap = getFactoryCapacityStatus(product.sku);

  return (
    <Card className="border-border-subtle bg-bg-surface2/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Factory className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Factory Capacity Planning
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase">Production Scheduling</div>
      </div>

      <div className="border-border-subtle relative mb-4 overflow-hidden rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-text-primary text-[11px] font-black uppercase tracking-tighter">
              {cap.factoryId}
            </div>
            <div className="text-text-muted mt-0.5 text-[8px] font-bold uppercase">
              Primary Manufacturing Site
            </div>
          </div>
          <Activity className="text-accent-primary h-5 w-5 animate-pulse" />
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-text-secondary mb-1 flex items-end justify-between text-[9px] font-black uppercase tracking-widest">
              <span>Line Utilization</span>
              <span className={cap.utilizationPercent > 85 ? 'text-rose-600' : 'text-emerald-600'}>
                {cap.utilizationPercent}%
              </span>
            </div>
            <Progress
              value={cap.utilizationPercent}
              className={`bg-bg-surface2 h-1.5 ${cap.utilizationPercent > 85 ? 'fill-rose-500' : 'fill-accent-primary'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-text-primary text-[14px] font-black leading-none">
                {cap.currentBookedQty.toLocaleString()}
              </div>
              <div className="text-text-muted mt-1 text-[7px] font-black uppercase">
                Units Booked
              </div>
            </div>
            <div className="text-right">
              <div className="text-text-primary text-[14px] font-black leading-none">
                {cap.totalMonthlyCapacity.toLocaleString()}
              </div>
              <div className="text-text-muted mt-1 text-[7px] font-black uppercase">
                Total Capacity
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-accent-primary/10 border-accent-primary/20 mb-2 flex items-center justify-between rounded-xl border p-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Calendar className="text-accent-primary h-4 w-4" />
          <div>
            <div className="text-text-primary text-[10px] font-black">Next Slot Available</div>
            <div className="text-accent-primary text-[9px] font-bold">
              {cap.earliestAvailableSlot}
            </div>
          </div>
        </div>
        <button className="text-accent-primary flex items-center gap-1 text-[8px] font-black uppercase hover:underline">
          Book Slot <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>

      {cap.utilizationPercent > 90 && (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 p-2">
          <AlertTriangle className="h-3 w-3 text-rose-500" />
          <p className="text-[8px] font-black uppercase leading-none text-rose-700">
            Capacity Alert: Critical utilization level
          </p>
        </div>
      )}
    </Card>
  );
}
