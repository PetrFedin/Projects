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
    <Card className="relative my-4 overflow-hidden border-2 border-indigo-100 bg-indigo-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
        <Star className="h-16 w-16 text-indigo-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-indigo-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Wholesale Loyalty & Rebate
          </h4>
        </div>
        <Badge className="border-none bg-indigo-600 text-[8px] font-black uppercase text-white">
          {loyalty.estimatedRebatePercent}% Active Rebate
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-500">
            <span>Next Milestone: 20M ₽</span>
            <span className="text-indigo-600">
              {Math.round((loyalty.currentTurnover / loyalty.targetForNextRebate) * 100)}%
            </span>
          </div>
          <Progress
            value={(loyalty.currentTurnover / loyalty.targetForNextRebate) * 100}
            className="h-1.5 bg-slate-100 fill-indigo-500"
          />
          <div className="flex items-center justify-between text-[8px] font-bold uppercase text-slate-400">
            <span>Turnover: {loyalty.currentTurnover.toLocaleString()} ₽</span>
            <span>
              Gap: {(loyalty.targetForNextRebate - loyalty.currentTurnover).toLocaleString()} ₽
            </span>
          </div>
        </div>

        <div className="mt-1 space-y-2 border-t border-indigo-50 pt-2">
          <div className="text-[8px] font-black uppercase tracking-tight text-slate-400">
            Active B2B Promos
          </div>
          <div className="flex flex-wrap gap-1.5">
            {loyalty.activePromos.map((promo, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="h-4 border-indigo-200 bg-white text-[7.5px] font-black uppercase text-indigo-700"
              >
                {promo}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-indigo-100 bg-indigo-50 p-2.5">
        <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
        <div className="text-[9px] font-medium leading-tight text-indigo-700">
          Этот заказ поможет достичь следующего порога ребейта. Вы сэкономите до 2.5% от общей суммы
          коллекции.
        </div>
      </div>
    </Card>
  );
}
