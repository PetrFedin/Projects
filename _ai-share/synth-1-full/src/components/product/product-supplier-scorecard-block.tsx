'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Factory, ShieldCheck, Gauge, TrendingUp } from 'lucide-react';
import { getSupplierPerformance } from '@/lib/fashion/supplier-scorecard';

export const ProductSupplierScorecardBlock: React.FC<{ product: Product }> = ({ product }) => {
  const s = getSupplierPerformance(product);

  const gradeColors: Record<string, string> = {
    A: 'bg-green-500',
    B: 'bg-blue-500',
    C: 'bg-yellow-500',
    D: 'bg-red-500',
  };

  return (
    <Card className="border-2 border-stone-100 bg-stone-50/20 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Factory className="h-4 w-4 text-stone-600" />
          <h4 className="text-sm font-bold uppercase text-stone-600">Supplier Health Score</h4>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-stone-400">GRADE</span>
          <div
            className={`flex h-6 w-6 items-center justify-center rounded text-xs font-black text-white ${gradeColors[s.complianceGrade]}`}
          >
            {s.complianceGrade}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase text-stone-400">
              <Gauge className="h-3 w-3" /> Lead Time
            </div>
            <div className="text-sm font-bold text-stone-800">{s.leadTimeDays} days</div>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase text-stone-400">
              <ShieldCheck className="h-3 w-3" /> Quality
            </div>
            <div className="text-sm font-bold text-stone-800">{s.qualityScore}% accuracy</div>
          </div>
        </div>
        <div className="space-y-3 border-l border-stone-200 pl-4">
          <div>
            <div className="mb-1 text-[10px] font-black uppercase text-stone-400">
              Supplier Name
            </div>
            <div className="truncate text-xs font-semibold text-stone-600">{s.name}</div>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase text-stone-400">
              <TrendingUp className="h-3 w-3" /> Workload
            </div>
            <div className="text-xs font-bold text-stone-600">{s.activeOrders} active orders</div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-stone-200 bg-white/50 p-2">
        <div className="mb-1 text-[9px] font-black uppercase text-stone-400">Compliance Status</div>
        <div className="flex gap-1">
          <Badge
            variant="outline"
            className="h-4 border-green-100 bg-green-50 text-[8px] text-green-700"
          >
            Social Audited
          </Badge>
          <Badge
            variant="outline"
            className="h-4 border-blue-100 bg-blue-50 text-[8px] text-blue-700"
          >
            ISO-9001
          </Badge>
        </div>
      </div>
    </Card>
  );
};
