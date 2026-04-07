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
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Factory className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Factory Capacity Planning</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase">Production Scheduling</div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm mb-4 relative overflow-hidden">
         <div className="flex justify-between items-start mb-4">
            <div>
               <div className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">{cap.factoryId}</div>
               <div className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Primary Manufacturing Site</div>
            </div>
            <Activity className="w-5 h-5 text-indigo-500 animate-pulse" />
         </div>

         <div className="space-y-4">
            <div>
               <div className="flex justify-between items-end mb-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <span>Line Utilization</span>
                  <span className={cap.utilizationPercent > 85 ? 'text-rose-600' : 'text-emerald-600'}>{cap.utilizationPercent}%</span>
               </div>
               <Progress value={cap.utilizationPercent} className={`h-1.5 bg-slate-100 ${cap.utilizationPercent > 85 ? 'fill-rose-500' : 'fill-indigo-500'}`} />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <div className="text-[14px] font-black text-slate-800 leading-none">{cap.currentBookedQty.toLocaleString()}</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Units Booked</div>
               </div>
               <div className="text-right">
                  <div className="text-[14px] font-black text-slate-800 leading-none">{cap.totalMonthlyCapacity.toLocaleString()}</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Total Capacity</div>
               </div>
            </div>
         </div>
      </div>

      <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between mb-2 shadow-sm">
         <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <div>
               <div className="text-[10px] font-black text-slate-700">Next Slot Available</div>
               <div className="text-[9px] font-bold text-indigo-600">{cap.earliestAvailableSlot}</div>
            </div>
         </div>
         <button className="text-[8px] font-black uppercase text-indigo-600 hover:underline flex items-center gap-1">
            Book Slot <ArrowRight className="w-2.5 h-2.5" />
         </button>
      </div>

      {cap.utilizationPercent > 90 && (
        <div className="flex items-center gap-2 mt-2 p-2 bg-rose-50 rounded-lg border border-rose-100">
           <AlertTriangle className="w-3 h-3 text-rose-500" />
           <p className="text-[8px] font-black text-rose-700 uppercase leading-none">Capacity Alert: Critical utilization level</p>
        </div>
      )}
    </Card>
  );
}
