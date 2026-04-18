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
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Factory className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Factory Capacity Planning
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase text-slate-400">Production Scheduling</div>
      </div>

      <div className="relative mb-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-[11px] font-black uppercase tracking-tighter text-slate-800">
              {cap.factoryId}
            </div>
            <div className="mt-0.5 text-[8px] font-bold uppercase text-slate-400">
              Primary Manufacturing Site
            </div>
          </div>
          <Activity className="h-5 w-5 animate-pulse text-indigo-500" />
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-end justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
              <span>Line Utilization</span>
              <span className={cap.utilizationPercent > 85 ? 'text-rose-600' : 'text-emerald-600'}>
                {cap.utilizationPercent}%
              </span>
            </div>
            <Progress
              value={cap.utilizationPercent}
              className={`h-1.5 bg-slate-100 ${cap.utilizationPercent > 85 ? 'fill-rose-500' : 'fill-indigo-500'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[14px] font-black leading-none text-slate-800">
                {cap.currentBookedQty.toLocaleString()}
              </div>
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">
                Units Booked
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-black leading-none text-slate-800">
                {cap.totalMonthlyCapacity.toLocaleString()}
              </div>
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">
                Total Capacity
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Calendar className="h-4 w-4 text-indigo-500" />
          <div>
            <div className="text-[10px] font-black text-slate-700">Next Slot Available</div>
            <div className="text-[9px] font-bold text-indigo-600">{cap.earliestAvailableSlot}</div>
          </div>
        </div>
        <button className="flex items-center gap-1 text-[8px] font-black uppercase text-indigo-600 hover:underline">
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
