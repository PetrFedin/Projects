'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, ArrowLeftRight, TrendingUp, AlertCircle, BarChart3, MoveRight } from 'lucide-react';
import { getDistributorStockAnalysis } from '@/lib/fashion/distributor-rebalance';
import type { Product } from '@/lib/types';

export function ProductDistributorStockBlock({ product }: { product: Product }) {
  const analysis = getDistributorStockAnalysis(product.sku);

  return (
    <Card className="border-border-subtle bg-bg-surface2/5 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Distributor Inventory Balancing
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase">
          National Distribution Hub
        </div>
      </div>

      <div className="space-y-3">
        {analysis.map((item) => (
          <div
            key={item.partnerId}
            className="border-border-subtle flex items-center justify-between gap-4 rounded-xl border bg-white p-3 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <div className="text-text-primary mb-0.5 truncate text-[10px] font-black">
                {item.partnerId}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-[9px] font-bold">
                  Stock: {item.currentStock}
                </span>
                <span className="text-[9px] font-black text-emerald-600">
                  {item.sellThroughRate}% STR
                </span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <Badge
                className={
                  item.rebalanceSuggestion === 'transfer_in'
                    ? 'bg-accent-primary/15 text-accent-primary h-5 border-none text-[8px]'
                    : item.rebalanceSuggestion === 'transfer_out'
                      ? 'h-5 border-none bg-amber-100 text-[8px] text-amber-700'
                      : 'bg-bg-surface2 text-text-primary h-5 border-none text-[8px]'
                }
              >
                {item.rebalanceSuggestion.replace('_', ' ')}
              </Badge>
              <div className="text-text-muted mt-1 text-[8px] font-black uppercase leading-none">
                Target: {item.targetQty}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-accent-primary shadow-accent-primary/10 group mt-4 flex cursor-pointer items-center justify-between rounded-xl p-3 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <ArrowLeftRight className="h-4 w-4" />
          </div>
          <div>
            <div className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest">
              Stock Swap Proposal
            </div>
            <div className="text-accent-primary/30 text-[9px] font-medium">
              Balance regions based on Sell-Through
            </div>
          </div>
        </div>
        <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Card>
  );
}
