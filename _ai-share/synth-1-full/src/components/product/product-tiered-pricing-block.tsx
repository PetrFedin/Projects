'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, Percent, ArrowRight, Layers, ShoppingBag } from 'lucide-react';
import { getWholesaleTieredPricing } from '@/lib/fashion/tiered-pricing';
import type { Product } from '@/lib/types';

export function ProductTieredPricingBlock({ product }: { product: Product }) {
  const pricing = getWholesaleTieredPricing(product.sku);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Tag className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Wholesale Tiered Pricing
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase text-slate-400">Volume Discount Matrix</div>
      </div>

      <div className="space-y-2">
        {pricing.tiers.map((tier, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl border p-3 transition-all ${i === pricing.currentActiveTier ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg' : 'border-slate-100 bg-white text-slate-600'}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-black ${i === pricing.currentActiveTier ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}
              >
                {tier.minQty}+
              </div>
              <div>
                <div className="mb-1 text-[11px] font-black leading-none">
                  Min. {tier.minQty} units
                </div>
                <div
                  className={`text-[8px] font-bold uppercase ${i === pricing.currentActiveTier ? 'text-indigo-200' : 'text-slate-400'}`}
                >
                  Tier {i + 1} Price
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-black leading-none">
                {tier.pricePerUnit.toLocaleString()} ₽
              </div>
              {tier.discountPercent > 0 && (
                <div
                  className={`mt-1 text-[9px] font-black ${i === pricing.currentActiveTier ? 'text-emerald-300' : 'text-emerald-600'}`}
                >
                  -{tier.discountPercent}% OFF
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="group mt-4 flex cursor-pointer items-center justify-between rounded-xl bg-slate-900 p-2.5 text-white transition-all active:scale-95">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-indigo-400" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Apply to B2B Basket
          </span>
        </div>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Card>
  );
}
