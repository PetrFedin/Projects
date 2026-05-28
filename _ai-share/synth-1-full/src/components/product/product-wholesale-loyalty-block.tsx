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
    <Card className="border-accent-primary/20 bg-accent-primary/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
        <Star className="text-accent-primary h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="text-accent-primary h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Wholesale Loyalty & Rebate
          </h4>
        </div>
        <Badge className="bg-accent-primary border-none text-[8px] font-black uppercase text-white">
          {loyalty.estimatedRebatePercent}% Active Rebate
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="text-text-secondary flex items-center justify-between text-[9px] font-black uppercase">
            <span>Next Milestone: 20M ₽</span>
            <span className="text-accent-primary">
              {Math.round((loyalty.currentTurnover / loyalty.targetForNextRebate) * 100)}%
            </span>
          </div>
          <Progress
            value={(loyalty.currentTurnover / loyalty.targetForNextRebate) * 100}
            className="bg-bg-surface2 fill-accent-primary h-1.5"
          />
          <div className="text-text-muted flex items-center justify-between text-[8px] font-bold uppercase">
            <span>Turnover: {loyalty.currentTurnover.toLocaleString()} ₽</span>
            <span>
              Gap: {(loyalty.targetForNextRebate - loyalty.currentTurnover).toLocaleString()} ₽
            </span>
          </div>
        </div>

        <div className="border-accent-primary/15 mt-1 space-y-2 border-t pt-2">
          <div className="text-text-muted text-[8px] font-black uppercase tracking-tight">
            Active B2B Promos
          </div>
          <div className="flex flex-wrap gap-1.5">
            {loyalty.activePromos.map((promo, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="border-accent-primary/30 text-accent-primary h-4 bg-white text-[7.5px] font-black uppercase"
              >
                {promo}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-accent-primary/10 border-accent-primary/20 mt-4 flex items-start gap-2 rounded-lg border p-2.5">
        <Zap className="text-accent-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
        <div className="text-accent-primary text-[9px] font-medium leading-tight">
          Этот заказ поможет достичь следующего порога ребейта. Вы сэкономите до 2.5% от общей суммы
          коллекции.
        </div>
      </div>
    </Card>
  );
}
