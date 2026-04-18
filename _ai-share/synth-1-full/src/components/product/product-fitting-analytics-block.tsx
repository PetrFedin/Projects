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
<<<<<<< HEAD
    <Card className="relative overflow-hidden border-2 border-slate-100 bg-slate-50/20 p-4 shadow-sm">
=======
    <Card className="border-border-subtle bg-bg-surface2/20 relative overflow-hidden border-2 p-4 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <Shirt className="h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
<<<<<<< HEAD
          <Shirt className="h-4 w-4 text-slate-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-slate-700">
            Fitting Room Intelligence (Offline)
          </h4>
        </div>
        <div className="text-[10px] font-black uppercase text-slate-400">
=======
          <Shirt className="text-text-secondary h-4 w-4" />
          <h4 className="text-text-primary text-xs font-bold uppercase tracking-tight">
            Fitting Room Intelligence (Offline)
          </h4>
        </div>
        <div className="text-text-muted text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
          Store Count: {analytics.length}
        </div>
      </div>

      <div className="space-y-4">
        {analytics.map((s, idx) => (
<<<<<<< HEAD
          <div key={idx} className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-tight text-slate-800">
                {s.storeId}
              </span>
              <Badge variant="outline" className="h-4 border-slate-100 bg-slate-50 text-[9px]">
=======
          <div key={idx} className="border-border-subtle rounded-lg border bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-text-primary text-[11px] font-black uppercase tracking-tight">
                {s.storeId}
              </span>
              <Badge
                variant="outline"
                className="bg-bg-surface2 border-border-subtle h-4 text-[9px]"
              >
>>>>>>> recover/cabinet-wip-from-stash
                CR: {s.conversionToPurchase}%
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
<<<<<<< HEAD
                <span className="text-[9px] font-black uppercase text-slate-400">Fittings</span>
                <span className="flex items-center gap-1 text-sm font-black text-slate-700">
                  <ShoppingBag className="h-3 w-3 text-slate-400" /> {s.fittingsCount}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-slate-400">Avg Time</span>
                <span className="flex items-center gap-1 text-sm font-black text-slate-700">
                  <Timer className="h-3 w-3 text-slate-400" /> {s.avgTimeInFittingRoom}m
=======
                <span className="text-text-muted text-[9px] font-black uppercase">Fittings</span>
                <span className="text-text-primary flex items-center gap-1 text-sm font-black">
                  <ShoppingBag className="text-text-muted h-3 w-3" /> {s.fittingsCount}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-text-muted text-[9px] font-black uppercase">Avg Time</span>
                <span className="text-text-primary flex items-center gap-1 text-sm font-black">
                  <Timer className="text-text-muted h-3 w-3" /> {s.avgTimeInFittingRoom}m
>>>>>>> recover/cabinet-wip-from-stash
                </span>
              </div>
            </div>

            {s.topAlternativeSku && (
<<<<<<< HEAD
              <div className="mt-2.5 flex items-center gap-1.5 border-t pt-2 text-[9px] font-bold uppercase text-slate-500">
=======
              <div className="text-text-secondary mt-2.5 flex items-center gap-1.5 border-t pt-2 text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                <ArrowRightLeft className="h-2.5 w-2.5" /> Alt: {s.topAlternativeSku}
              </div>
            )}
          </div>
        ))}
      </div>

<<<<<<< HEAD
      <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[9px] font-bold uppercase italic text-slate-400">
=======
      <div className="border-border-subtle text-text-muted mt-4 flex items-center gap-1.5 border-t pt-3 text-[9px] font-bold uppercase italic">
>>>>>>> recover/cabinet-wip-from-stash
        Store-to-Web attribution active • Physical-to-Digital Loop v1.1
      </div>
    </Card>
  );
};
