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
    'A': 'bg-green-500',
    'B': 'bg-blue-500',
    'C': 'bg-yellow-500',
    'D': 'bg-red-500',
  };

  return (
    <Card className="p-4 border-2 border-stone-100 bg-stone-50/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Factory className="w-4 h-4 text-stone-600" />
          <h4 className="font-bold text-sm uppercase text-stone-600">Supplier Health Score</h4>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-stone-400 font-bold">GRADE</span>
          <div className={`w-6 h-6 rounded flex items-center justify-center text-white text-xs font-black ${gradeColors[s.complianceGrade]}`}>
            {s.complianceGrade}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <div className="text-[10px] font-black text-stone-400 uppercase mb-1 flex items-center gap-1">
              <Gauge className="w-3 h-3" /> Lead Time
            </div>
            <div className="text-sm font-bold text-stone-800">{s.leadTimeDays} days</div>
          </div>
          <div>
            <div className="text-[10px] font-black text-stone-400 uppercase mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Quality
            </div>
            <div className="text-sm font-bold text-stone-800">{s.qualityScore}% accuracy</div>
          </div>
        </div>
        <div className="space-y-3 pl-4 border-l border-stone-200">
          <div>
            <div className="text-[10px] font-black text-stone-400 uppercase mb-1">Supplier Name</div>
            <div className="text-xs font-semibold text-stone-600 truncate">{s.name}</div>
          </div>
          <div>
            <div className="text-[10px] font-black text-stone-400 uppercase mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Workload
            </div>
            <div className="text-xs font-bold text-stone-600">{s.activeOrders} active orders</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-2 bg-white/50 rounded-md border border-stone-200">
        <div className="text-[9px] font-black text-stone-400 uppercase mb-1">Compliance Status</div>
        <div className="flex gap-1">
          <Badge variant="outline" className="text-[8px] h-4 bg-green-50 text-green-700 border-green-100">Social Audited</Badge>
          <Badge variant="outline" className="text-[8px] h-4 bg-blue-50 text-blue-700 border-blue-100">ISO-9001</Badge>
        </div>
      </div>
    </Card>
  );
};
