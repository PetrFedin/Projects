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
    <Card className="relative my-4 overflow-hidden border-2 border-emerald-50 bg-emerald-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Coins className="h-16 w-16 text-emerald-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600">
          <Coins className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Retail Staff Incentive Scheme
          </h4>
        </div>
        <Badge className="border-none bg-emerald-600 text-[8px] font-black uppercase text-white">
          Type: {scheme.incentiveType}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-100 bg-white/80 p-3 shadow-sm">
            <div className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
              Base Commission
            </div>
            <div className="text-text-primary text-xl font-black">
              {scheme.baseCommissionPercent}%
            </div>
            {scheme.bonusAmountRub > 0 && (
              <div className="mt-1 text-[9px] font-black uppercase text-emerald-600">
                + {scheme.bonusAmountRub} ₽ Focus Bonus
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="text-text-muted flex justify-between text-[8px] font-black uppercase">
              <span>Target Progress</span>
              <span>
                {scheme.currentQuantity} / {scheme.targetQuantity}
              </span>
            </div>
            <div className="bg-bg-surface2 h-1.5 overflow-hidden rounded-full">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${(scheme.currentQuantity / scheme.targetQuantity) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-emerald-100 bg-emerald-600/5 p-4 text-center">
          <Target className="mx-auto mb-2 h-5 w-5 text-emerald-400" />
          <p className="text-text-secondary text-[9px] font-bold leading-tight">
            "Focus SKU for SS26. High incentive for floor staff to drive volume and VM compliance."
          </p>
          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-[8px] font-black uppercase text-emerald-600"
          >
            View Full Incentive PDF
          </Button>
        </div>
      </div>

      <div className="text-text-muted mt-4 flex items-center justify-between border-t border-emerald-100 pt-4 text-[8px] font-black uppercase">
        <span>Eligible for all franchise partners</span>
        <span className="text-emerald-600">Real-time Payout Active</span>
      </div>
    </Card>
  );
}
