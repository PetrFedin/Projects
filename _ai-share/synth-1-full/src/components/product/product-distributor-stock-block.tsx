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
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/5 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Truck className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Distributor Inventory Balancing
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase text-slate-400">
          National Distribution Hub
        </div>
      </div>

      <div className="space-y-3">
        {analysis.map((item) => (
          <div
            key={item.partnerId}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 truncate text-[10px] font-black text-slate-800">
                {item.partnerId}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate-500">
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
                    ? 'h-5 border-none bg-indigo-100 text-[8px] text-indigo-700'
                    : item.rebalanceSuggestion === 'transfer_out'
                      ? 'h-5 border-none bg-amber-100 text-[8px] text-amber-700'
                      : 'h-5 border-none bg-slate-100 text-[8px] text-slate-700'
                }
              >
                {item.rebalanceSuggestion.replace('_', ' ')}
              </Badge>
              <div className="mt-1 text-[8px] font-black uppercase leading-none text-slate-400">
                Target: {item.targetQty}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="group mt-4 flex cursor-pointer items-center justify-between rounded-xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-100">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <ArrowLeftRight className="h-4 w-4" />
          </div>
          <div>
            <div className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest">
              Stock Swap Proposal
            </div>
            <div className="text-[9px] font-medium text-indigo-100">
              Balance regions based on Sell-Through
            </div>
          </div>
        </div>
        <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Card>
  );
}
