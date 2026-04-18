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
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <BarChart className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Wholesale Allocation (B2B Matrix)
          </h4>
        </div>
        <Badge
          className={
            allocation.allocationStatus === 'open'
              ? 'border-none bg-emerald-100 text-[8px] uppercase text-emerald-700'
              : 'border-none bg-rose-100 text-[8px] uppercase text-rose-700'
          }
        >
          {allocation.allocationStatus}
        </Badge>
      </div>

      <div className="mb-4 space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between text-[9px] font-bold uppercase text-slate-500">
            <span>Capacity Allocated</span>
            <span>
              {Math.round((allocation.allocatedQty / allocation.totalAvailableQty) * 100)}%
            </span>
          </div>
          <Progress
            value={(allocation.allocatedQty / allocation.totalAvailableQty) * 100}
            className="h-1.5 bg-slate-100 fill-indigo-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-slate-100 bg-white p-2 text-center">
            <div className="text-xs font-black text-slate-800">{allocation.remainingQty}</div>
            <div className="text-[7px] font-black uppercase text-slate-400">Available</div>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-2 text-center">
            <div className="text-xs font-black text-indigo-700">
              {allocation.reservedForTopTierQty}
            </div>
            <div className="text-[7px] font-black uppercase text-indigo-400">A-Tier Reserved</div>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-2 text-center">
            <div className="text-xs font-black text-slate-400">{allocation.totalAvailableQty}</div>
            <div className="text-[7px] font-black uppercase text-slate-400">Total Capacity</div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-100 bg-amber-50/50 p-3 shadow-sm">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
        <p className="text-[9px] font-bold leading-tight text-amber-700">
          Бронирование на {allocation.reservedForTopTierQty} единиц доступно только для VIP-байеров.
          Остаток для общего пула: {allocation.remainingQty}.
        </p>
      </div>
    </Card>
  );
}
