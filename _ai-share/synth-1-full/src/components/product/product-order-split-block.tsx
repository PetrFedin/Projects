'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, LayoutGrid, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { getB2BOrderSplit } from '@/lib/fashion/order-splitting';
import type { Product } from '@/lib/types';

export function ProductOrderSplitBlock({ product }: { product: Product }) {
  const split = getB2BOrderSplit(product.sku, 150);

  return (
    <Card className="border-border-subtle bg-bg-surface2/5 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Ship-to-Store Splitter
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase">Multi-Store Order</div>
      </div>

      <div className="border-border-subtle mb-4 rounded-xl border bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-text-primary text-[11px] font-black uppercase tracking-tighter">
            Total Allocation: {split.totalQty} Units
          </div>
          <Badge className="bg-accent-primary/15 text-accent-primary h-4 border-none text-[8px] font-black">
            ACTIVE SPLIT
          </Badge>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        {split.splits.map((s, i) => (
          <div
            key={i}
            className="border-border-subtle hover:border-accent-primary/20 group flex items-center justify-between rounded-lg border bg-white p-2.5 shadow-sm transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="text-text-muted group-hover:text-accent-primary h-3.5 w-3.5 transition-colors" />
              <div className="text-text-primary text-[10px] font-bold">{s.storeId}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-text-primary text-[11px] font-black">{s.qty} units</div>
              {s.status === 'confirmed' ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Clock className="h-3.5 w-3.5 text-amber-400" />
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="bg-text-primary hover:bg-text-primary/90 flex h-8 w-full items-center justify-center gap-2 rounded-lg text-[8px] font-black uppercase text-white shadow-md transition-all">
        Modify Distributions <ArrowRight className="h-3 w-3" />
      </button>
    </Card>
  );
}
