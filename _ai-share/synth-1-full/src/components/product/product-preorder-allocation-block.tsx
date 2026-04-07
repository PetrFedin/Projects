'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Lock, Users, AlertCircle, Info } from 'lucide-react';
import { getPreOrderAllocation } from '@/lib/fashion/preorder-allocation';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductPreOrderAllocationBlock({ product }: { product: Product }) {
  const allocation = getPreOrderAllocation(product.sku);

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <BarChart className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Wholesale Allocation (B2B Matrix)</h4>
        </div>
        <Badge className={allocation.allocationStatus === 'open' ? "bg-emerald-100 text-emerald-700 border-none uppercase text-[8px]" : "bg-rose-100 text-rose-700 border-none uppercase text-[8px]"}>
          {allocation.allocationStatus}
        </Badge>
      </div>

      <div className="space-y-4 mb-4">
         <div>
            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase mb-1">
               <span>Capacity Allocated</span>
               <span>{Math.round((allocation.allocatedQty / allocation.totalAvailableQty) * 100)}%</span>
            </div>
            <Progress value={(allocation.allocatedQty / allocation.totalAvailableQty) * 100} className="h-1.5 bg-slate-100 fill-indigo-500" />
         </div>

         <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-white rounded-lg border border-slate-100 text-center">
               <div className="text-xs font-black text-slate-800">{allocation.remainingQty}</div>
               <div className="text-[7px] font-black text-slate-400 uppercase">Available</div>
            </div>
            <div className="p-2 bg-indigo-50/50 rounded-lg border border-indigo-100 text-center">
               <div className="text-xs font-black text-indigo-700">{allocation.reservedForTopTierQty}</div>
               <div className="text-[7px] font-black text-indigo-400 uppercase">A-Tier Reserved</div>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
               <div className="text-xs font-black text-slate-400">{allocation.totalAvailableQty}</div>
               <div className="text-[7px] font-black text-slate-400 uppercase">Total Capacity</div>
            </div>
         </div>
      </div>

      <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 flex items-start gap-2.5 shadow-sm">
         <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
         <p className="text-[9px] text-amber-700 font-bold leading-tight">
            Бронирование на {allocation.reservedForTopTierQty} единиц доступно только для VIP-байеров. Остаток для общего пула: {allocation.remainingQty}.
         </p>
      </div>
    </Card>
  );
}
