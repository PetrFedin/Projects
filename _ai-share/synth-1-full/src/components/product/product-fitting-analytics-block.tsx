'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shirt, ShoppingBag, Timer, ArrowRightLeft } from 'lucide-react';
import { getFittingAnalytics } from '@/lib/fashion/fitting-analytics';

export const ProductFittingAnalyticsBlock: React.FC<{ product: Product }> = ({ product }) => {
  const analytics = getFittingAnalytics(product);

  return (
    <Card className="border-border-subtle bg-bg-surface2/20 relative overflow-hidden border-2 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <Shirt className="h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shirt className="text-text-secondary h-4 w-4" />
          <h4 className="text-text-primary text-xs font-bold uppercase tracking-tight">
            Fitting Room Intelligence (Offline)
          </h4>
        </div>
        <div className="text-text-muted text-[10px] font-black uppercase">
          Store Count: {analytics.length}
        </div>
      </div>

      <div className="space-y-4">
        {analytics.map((s, idx) => (
          <div key={idx} className="border-border-subtle rounded-lg border bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-text-primary text-[11px] font-black uppercase tracking-tight">
                {s.storeId}
              </span>
              <Badge
                variant="outline"
                className="bg-bg-surface2 border-border-subtle h-4 text-[9px]"
              >
                CR: {s.conversionToPurchase}%
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-text-muted text-[9px] font-black uppercase">Fittings</span>
                <span className="text-text-primary flex items-center gap-1 text-sm font-black">
                  <ShoppingBag className="text-text-muted h-3 w-3" /> {s.fittingsCount}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-text-muted text-[9px] font-black uppercase">Avg Time</span>
                <span className="text-text-primary flex items-center gap-1 text-sm font-black">
                  <Timer className="text-text-muted h-3 w-3" /> {s.avgTimeInFittingRoom}m
                </span>
              </div>
            </div>

            {s.topAlternativeSku && (
              <div className="text-text-secondary mt-2.5 flex items-center gap-1.5 border-t pt-2 text-[9px] font-bold uppercase">
                <ArrowRightLeft className="h-2.5 w-2.5" /> Alt: {s.topAlternativeSku}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-border-subtle text-text-muted mt-4 flex items-center gap-1.5 border-t pt-3 text-[9px] font-bold uppercase italic">
        Store-to-Web attribution active • Physical-to-Digital Loop v1.1
      </div>
    </Card>
  );
};
