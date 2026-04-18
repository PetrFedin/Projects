'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRightLeft,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Package,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { getStockExchangeOffers } from '@/lib/fashion/stock-exchange';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductStockExchangeBlock({ product }: { product: Product }) {
  const offers = getStockExchangeOffers(product.sku);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-orange-50 bg-orange-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <ArrowRightLeft className="h-16 w-16 text-orange-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-orange-600">
          <ArrowRightLeft className="h-4 w-4" />
<<<<<<< HEAD
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
=======
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            B2B Stock Exchange (Secondary Market)
          </h4>
        </div>
        <Badge className="border-none bg-orange-600 text-[8px] font-black uppercase text-white">
          Secondary Market Active
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="space-y-3">
<<<<<<< HEAD
            <div className="mb-1 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
            <div className="text-text-muted mb-1 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <Activity className="h-3 w-3" /> External Liquidity
            </div>
            {offers.length > 0 ? (
              <div className="space-y-2">
                {offers.map((off, i) => (
                  <div
                    key={i}
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-orange-200 bg-white/80 p-2.5 shadow-sm transition-colors hover:bg-white"
                  >
                    <div>
                      <div className={off.type === 'excess' ? 'text-emerald-600' : 'text-rose-600'}>
                        <span className="text-[10px] font-black uppercase">
                          {off.type === 'excess' ? 'Partner Surplus' : 'Partner Seek'}
                        </span>
                      </div>
<<<<<<< HEAD
                      <div className="mt-0.5 text-[9px] font-bold uppercase text-slate-500">
=======
                      <div className="text-text-secondary mt-0.5 text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                        {off.quantity} Units @ {off.location}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-orange-400 opacity-0 group-hover:opacity-100"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
<<<<<<< HEAD
              <div className="rounded-xl border-2 border-dashed border-orange-200 p-8 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">
=======
              <div className="text-text-muted rounded-xl border-2 border-dashed border-orange-200 p-8 text-center text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                No active offers
              </div>
            )}
          </div>
          <Button className="h-8 w-full bg-orange-600 text-[9px] font-black uppercase tracking-widest text-white shadow-lg hover:bg-orange-700">
            List My Surplus
          </Button>
        </div>

        <div className="space-y-3">
<<<<<<< HEAD
          <div className="mb-1 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
          <div className="text-text-muted mb-1 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            <TrendingUp className="h-3 w-3" /> Liquidity Metrics
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center rounded-xl border border-orange-100 bg-white/50 p-3">
              <Package className="mb-1 h-4 w-4 text-orange-600" />
<<<<<<< HEAD
              <div className="text-[14px] font-black leading-none text-slate-800">420</div>
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">
=======
              <div className="text-text-primary text-[14px] font-black leading-none">420</div>
              <div className="text-text-muted mt-1 text-[7px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Avail. Units
              </div>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-orange-100 bg-white/50 p-3">
              <DollarSign className="mb-1 h-4 w-4 text-emerald-600" />
              <div className="text-[14px] font-black leading-none text-emerald-600">4.2k</div>
<<<<<<< HEAD
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">Avg. Bid</div>
=======
              <div className="text-text-muted mt-1 text-[7px] font-black uppercase">Avg. Bid</div>
>>>>>>> recover/cabinet-wip-from-stash
            </div>
          </div>

          <div className="mt-2 rounded-xl border border-orange-200 bg-orange-600/5 p-4 shadow-sm">
            <div className="mb-2 text-[8px] font-black uppercase text-orange-600">
              Market Insights
            </div>
<<<<<<< HEAD
            <p className="text-[9px] font-bold leading-tight text-slate-600">
=======
            <p className="text-text-secondary text-[9px] font-bold leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
              Demand for {product.name} in Novosibirsk is peaking. Secondary resale price is 8%
              above pre-order MSRP.
            </p>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <div className="mt-4 flex items-center justify-between border-t border-orange-100 pt-4 text-[8px] font-black uppercase text-slate-400">
=======
      <div className="text-text-muted mt-4 flex items-center justify-between border-t border-orange-100 pt-4 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
        <span>B2B Peer-to-Peer Stock Swapping</span>
        <span className="text-orange-600">Trading Fee: 1.5%</span>
      </div>
    </Card>
  );
}
