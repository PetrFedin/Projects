'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeartPulse, TrendingUp, TrendingDown, Info, ShoppingCart, Target } from 'lucide-react';
import { getMarketplaceHealth } from '@/lib/fashion/marketplace-health';

export const ProductMarketplaceHealthBlock: React.FC<{ product: Product }> = ({ product }) => {
  const health = getMarketplaceHealth(product);

  return (
    <Card className="relative overflow-hidden border-2 border-emerald-50 bg-emerald-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <HeartPulse className="h-16 w-16 text-emerald-400" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-emerald-700">
            Marketplace Health Scorecard
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-500">
          WB / Ozon Sync OK
        </div>
      </div>

      <div className="space-y-4">
        {health.map((h, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-lg border border-emerald-100 bg-white p-3 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="h-4 border-none bg-emerald-600 text-[10px] font-black uppercase text-white">
                  {h.marketplace}
                </Badge>
<<<<<<< HEAD
                <div className="text-[10px] font-black uppercase text-slate-400">
=======
                <div className="text-text-muted text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  Buyback: {h.buybackRate}%
                </div>
              </div>
              <div
                className={`flex items-center gap-1 text-[10px] font-black uppercase ${h.buyboxStatus === 'won' ? 'text-green-600' : 'text-rose-600'}`}
              >
                {h.buyboxStatus === 'won' ? (
                  <Target className="h-3 w-3" />
                ) : (
                  <Info className="h-3 w-3" />
                )}
                Buybox {h.buyboxStatus}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
<<<<<<< HEAD
                <span className="mb-1 text-[9px] font-black uppercase text-slate-400">
                  Out of Stock Risk
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
=======
                <span className="text-text-muted mb-1 text-[9px] font-black uppercase">
                  Out of Stock Risk
                </span>
                <div className="flex items-center gap-2">
                  <div className="bg-bg-surface2 h-1 flex-1 overflow-hidden rounded-full">
>>>>>>> recover/cabinet-wip-from-stash
                    <div
                      className={`h-full ${h.outOfStockRisk > 30 ? 'bg-orange-400' : 'bg-green-400'}`}
                      style={{ width: `${h.outOfStockRisk}%` }}
                    />
                  </div>
<<<<<<< HEAD
                  <span className="text-[10px] font-black leading-none text-slate-700">
=======
                  <span className="text-text-primary text-[10px] font-black leading-none">
>>>>>>> recover/cabinet-wip-from-stash
                    {h.outOfStockRisk}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
<<<<<<< HEAD
                <span className="mb-1 text-[9px] font-black uppercase text-slate-400">
                  Rating Trend
                </span>
                <div
                  className={`flex items-center gap-1 text-xs font-black ${h.ratingTrend === 'up' ? 'text-green-600' : 'text-slate-500'}`}
=======
                <span className="text-text-muted mb-1 text-[9px] font-black uppercase">
                  Rating Trend
                </span>
                <div
                  className={`flex items-center gap-1 text-xs font-black ${h.ratingTrend === 'up' ? 'text-green-600' : 'text-text-secondary'}`}
>>>>>>> recover/cabinet-wip-from-stash
                >
                  {h.ratingTrend === 'up' ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 opacity-40" />
                  )}
                  {h.ratingTrend.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      <div className="mt-4 flex items-center gap-1.5 border-t border-emerald-50 pt-3 text-[9px] font-bold uppercase italic leading-none text-slate-400">
=======
      <div className="text-text-muted mt-4 flex items-center gap-1.5 border-t border-emerald-50 pt-3 text-[9px] font-bold uppercase italic leading-none">
>>>>>>> recover/cabinet-wip-from-stash
        <Info className="h-3 w-3" /> Aggregated Marketplace Analytics v3.2
      </div>
    </Card>
  );
};
