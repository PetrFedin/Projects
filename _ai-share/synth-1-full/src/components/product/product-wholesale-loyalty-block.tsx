'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Info, Zap, Gift } from 'lucide-react';
import { getWholesaleLoyalty } from '@/lib/fashion/wholesale-loyalty';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductWholesaleLoyaltyBlock({ product }: { product: Product }) {
  const loyalty = getWholesaleLoyalty('P-001');

  return (
    <Card className="p-4 border-2 border-indigo-100 bg-indigo-50/10 shadow-sm my-4 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
         <Star className="w-16 h-16 text-indigo-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-indigo-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Wholesale Loyalty & Rebate</h4>
        </div>
        <Badge className="bg-indigo-600 text-white border-none text-[8px] font-black uppercase">
          {loyalty.estimatedRebatePercent}% Active Rebate
        </Badge>
      </div>

      <div className="space-y-4">
         <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase">
               <span>Next Milestone: 20M ₽</span>
               <span className="text-indigo-600">{Math.round((loyalty.currentTurnover / loyalty.targetForNextRebate) * 100)}%</span>
            </div>
            <Progress value={(loyalty.currentTurnover / loyalty.targetForNextRebate) * 100} className="h-1.5 bg-slate-100 fill-indigo-500" />
            <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase">
               <span>Turnover: {loyalty.currentTurnover.toLocaleString()} ₽</span>
               <span>Gap: {(loyalty.targetForNextRebate - loyalty.currentTurnover).toLocaleString()} ₽</span>
            </div>
         </div>

         <div className="space-y-2 pt-2 border-t border-indigo-50 mt-1">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-tight">Active B2B Promos</div>
            <div className="flex flex-wrap gap-1.5">
               {loyalty.activePromos.map((promo, idx) => (
                 <Badge key={idx} variant="outline" className="text-[7.5px] font-black uppercase border-indigo-200 bg-white text-indigo-700 h-4">
                    {promo}
                 </Badge>
               ))}
            </div>
         </div>
      </div>

      <div className="mt-4 p-2.5 bg-indigo-50 rounded-lg border border-indigo-100 flex gap-2 items-start">
         <Zap className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
         <div className="text-[9px] text-indigo-700 font-medium leading-tight">
            Этот заказ поможет достичь следующего порога ребейта. Вы сэкономите до 2.5% от общей суммы коллекции.
         </div>
      </div>
    </Card>
  );
}
