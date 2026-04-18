'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ArrowRight, ArrowLeftRight, Activity, Info, MapPin } from 'lucide-react';
import { getStoreStockSwapOffers } from '@/lib/fashion/stock-swap';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductStoreStockSwapBlock({ product }: { product: Product }) {
  const swaps = getStoreStockSwapOffers(product.sku);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-orange-50 bg-orange-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <RefreshCw className="h-16 w-16 text-orange-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-orange-600">
          <RefreshCw className="h-4 w-4" />
<<<<<<< HEAD
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
=======
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Network Store-to-Store Stock Swap
          </h4>
        </div>
        <Badge className="border-none bg-orange-600 text-[8px] font-black uppercase text-white">
          Network Balance Active
        </Badge>
      </div>

      <div className="space-y-3">
<<<<<<< HEAD
        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
        <div className="text-text-muted flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
          <Activity className="h-3 w-3" /> Active Swap Requests
        </div>

        {swaps.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {swaps.map((swap) => (
              <div
                key={swap.id}
                className="rounded-xl border border-orange-100 bg-white/80 p-3 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between">
<<<<<<< HEAD
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-800">
=======
                  <div className="text-text-primary flex items-center gap-1.5 text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                    <ArrowLeftRight className="h-3.5 w-3.5 text-orange-500" />
                    {swap.quantity} Units
                  </div>
                  <Badge
                    className={cn(
                      'h-3.5 border-none text-[7px]',
                      swap.urgency === 'high' ? 'bg-rose-500' : 'bg-orange-500'
                    )}
                  >
                    {swap.urgency.toUpperCase()}
                  </Badge>
                </div>
<<<<<<< HEAD
                <div className="flex items-center gap-2 text-[8px] font-bold uppercase text-slate-500">
                  <MapPin className="h-2.5 w-2.5" /> {swap.fromStoreId.split('-')[1]}
                  <ArrowRight className="h-2.5 w-2.5 text-slate-300" />
=======
                <div className="text-text-secondary flex items-center gap-2 text-[8px] font-bold uppercase">
                  <MapPin className="h-2.5 w-2.5" /> {swap.fromStoreId.split('-')[1]}
                  <ArrowRight className="text-text-muted h-2.5 w-2.5" />
>>>>>>> recover/cabinet-wip-from-stash
                  {swap.toStoreId.split('-')[1]}
                </div>
                <div className="mt-2 text-[7px] font-black uppercase text-emerald-600">
                  Status: {swap.status.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        ) : (
<<<<<<< HEAD
          <div className="rounded-xl border-2 border-dashed border-orange-100 p-8 text-center text-[9px] font-black uppercase text-slate-400">
=======
          <div className="text-text-muted rounded-xl border-2 border-dashed border-orange-100 p-8 text-center text-[9px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
            No network rebalancing required
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        className="mt-3 flex h-8 w-full items-center justify-center gap-2 text-[8px] font-black uppercase text-orange-600 hover:bg-orange-50"
      >
        Initiate Network Rebalance <ArrowRight className="h-3 w-3" />
      </Button>

<<<<<<< HEAD
      <div className="mt-4 flex items-center justify-between border-t border-orange-100 pt-4 text-[8px] font-black uppercase text-slate-400">
=======
      <div className="text-text-muted mt-4 flex items-center justify-between border-t border-orange-100 pt-4 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
        <span>Optimizing Sell-Through Across 12 Locations</span>
        <span className="text-orange-600">AI Logistic Route Prep Ready</span>
      </div>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
