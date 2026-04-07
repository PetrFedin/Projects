'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Target, Award, ArrowRight } from 'lucide-react';
import { getStaffCommissionScheme } from '@/lib/fashion/staff-commissions';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductStaffCommissionBlock({ product }: { product: Product }) {
  const scheme = getStaffCommissionScheme(product.sku);

  return (
    <Card className="p-4 border-2 border-emerald-50 bg-emerald-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Coins className="w-16 h-16 text-emerald-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <Coins className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Retail Staff Incentive Scheme</h4>
        </div>
        <Badge className="bg-emerald-600 text-white text-[8px] font-black border-none uppercase">Type: {scheme.incentiveType}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-4">
            <div className="p-3 bg-white/80 rounded-xl border border-emerald-100 shadow-sm">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Base Commission</div>
               <div className="text-xl font-black text-slate-800">{scheme.baseCommissionPercent}%</div>
               {scheme.bonusAmountRub > 0 && (
                 <div className="text-[9px] font-black text-emerald-600 uppercase mt-1">
                    + {scheme.bonusAmountRub} ₽ Focus Bonus
                 </div>
               )}
            </div>
            
            <div className="space-y-1.5">
               <div className="flex justify-between text-[8px] font-black uppercase text-slate-400">
                  <span>Target Progress</span>
                  <span>{scheme.currentQuantity} / {scheme.targetQuantity}</span>
               </div>
               <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(scheme.currentQuantity / scheme.targetQuantity) * 100}%` }} />
               </div>
            </div>
         </div>

         <div className="p-4 bg-emerald-600/5 rounded-xl border border-emerald-100 flex flex-col justify-center text-center">
            <Target className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-[9px] font-bold text-slate-600 leading-tight">
               "Focus SKU for SS26. High incentive for floor staff to drive volume and VM compliance."
            </p>
            <Button variant="link" className="text-[8px] font-black uppercase text-emerald-600 h-auto p-0 mt-2">
               View Full Incentive PDF
            </Button>
         </div>
      </div>

      <div className="mt-4 pt-4 border-t border-emerald-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Eligible for all franchise partners</span>
         <span className="text-emerald-600">Real-time Payout Active</span>
      </div>
    </Card>
  );
}
