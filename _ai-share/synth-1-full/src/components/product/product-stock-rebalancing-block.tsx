'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ArrowRightLeft, TrendingUp, AlertCircle } from 'lucide-react';
import { getStockRebalancingSuggestions } from '@/lib/fashion/stock-rebalancing';
import type { Product } from '@/lib/types';

export function ProductStockRebalancingBlock({ product }: { product: Product }) {
  const suggestions = getStockRebalancingSuggestions(product.sku);

  return (
    <Card className="my-4 border-2 border-teal-50 bg-teal-50/5 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-teal-600">
          <ArrowRightLeft className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Stock Rebalancing (B2B/Inter-store)
          </h4>
        </div>
        <Badge className="animate-pulse border-none bg-teal-100 text-[8px] font-black uppercase text-teal-700">
          Auto-Suggestion
        </Badge>
      </div>

      <div className="space-y-3">
        {suggestions.map((s, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-xl border border-teal-100 bg-white p-3 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-500">
                <span className="text-slate-800">{s.fromStoreId}</span>
                <RefreshCw className="h-2.5 w-2.5 text-teal-500" />
                <span className="text-slate-800">{s.toStoreId}</span>
              </div>
              <Badge
                variant="outline"
                className={`h-3.5 text-[7px] font-black uppercase ${s.urgency === 'high' ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-500'}`}
              >
                {s.urgency} Priority
              </Badge>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-lg font-black leading-none text-slate-800">
                  {s.suggestedQty} <span className="text-[10px] text-slate-400">PCS</span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-[8px] font-bold uppercase text-teal-600">
                  <TrendingUp className="h-2.5 w-2.5" /> {s.reason.replace('_', ' ')}
                </div>
              </div>
              <button className="rounded-lg bg-teal-600 px-3 py-1.5 text-[8px] font-black uppercase text-white shadow-sm transition-colors hover:bg-teal-700">
                Execute Transfer
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
