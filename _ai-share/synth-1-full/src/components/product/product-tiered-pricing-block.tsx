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
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Tag className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Wholesale Tiered Pricing</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase">Volume Discount Matrix</div>
      </div>

      <div className="space-y-2">
         {pricing.tiers.map((tier, i) => (
           <div key={i} className={`p-3 rounded-xl border flex items-center justify-between transition-all ${i === pricing.currentActiveTier ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600'}`}>
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${i === pricing.currentActiveTier ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                    {tier.minQty}+
                 </div>
                 <div>
                    <div className="text-[11px] font-black leading-none mb-1">Min. {tier.minQty} units</div>
                    <div className={`text-[8px] font-bold uppercase ${i === pricing.currentActiveTier ? 'text-indigo-200' : 'text-slate-400'}`}>Tier {i+1} Price</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-[14px] font-black leading-none">{tier.pricePerUnit.toLocaleString()} ₽</div>
                 {tier.discountPercent > 0 && (
                    <div className={`text-[9px] font-black mt-1 ${i === pricing.currentActiveTier ? 'text-emerald-300' : 'text-emerald-600'}`}>
                       -{tier.discountPercent}% OFF
                    </div>
                 )}
              </div>
           </div>
         ))}
      </div>

      <div className="mt-4 p-2.5 bg-slate-900 rounded-xl text-white flex items-center justify-between group cursor-pointer active:scale-95 transition-all">
         <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
            <span className="text-[9px] font-black uppercase tracking-widest">Apply to B2B Basket</span>
         </div>
         <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Card>
  );
}
