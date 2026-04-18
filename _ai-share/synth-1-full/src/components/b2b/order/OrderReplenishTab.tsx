'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCcw, ShieldCheck, ShoppingCart, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { getReplenishmentRecommendations } from '@/lib/b2b/replenishment-recommendations';
import { cn } from '@/lib/utils';

export function OrderReplenishTab() {
  const recommendations = getReplenishmentRecommendations().slice(0, 6);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 gap-3 text-left lg:grid-cols-2">
        <Card className="space-y-6 rounded-xl border-none bg-white p-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-tight">
                Рекомендации к пополнению
              </h4>
<<<<<<< HEAD
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                По sell-through и остатку · Дозаказать X шт. или не дозаказывать
              </p>
            </div>
            <RefreshCcw className="animate-spin-slow h-8 w-8 text-indigo-600" />
          </div>
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <p className="text-[10px] font-bold uppercase text-slate-500">
=======
              <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                По sell-through и остатку · Дозаказать X шт. или не дозаказывать
              </p>
            </div>
            <RefreshCcw className="text-accent-primary animate-spin-slow h-8 w-8" />
          </div>
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <p className="text-text-secondary text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Нет данных. Оформите заказы — появятся подсказки.
              </p>
            ) : (
              recommendations.map((r) => (
                <div
                  key={`${r.orderId}-${r.sku}`}
                  className={cn(
                    'flex items-center justify-between rounded-2xl border p-4',
                    r.action === 'reorder'
<<<<<<< HEAD
                      ? 'border-indigo-100 bg-indigo-50/80'
                      : 'border-slate-100 bg-slate-50'
                  )}
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-xs font-black uppercase text-slate-900">
                      {r.productName}
                    </p>
                    <p className="text-[9px] font-bold uppercase text-slate-400">
=======
                      ? 'bg-accent-primary/15 border-accent-primary/20'
                      : 'bg-bg-surface2 border-border-subtle'
                  )}
                >
                  <div className="min-w-0 space-y-1">
                    <p className="text-text-primary truncate text-xs font-black uppercase">
                      {r.productName}
                    </p>
                    <p className="text-text-muted text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                      Sell-through {Math.round(r.sellThroughRate * 100)}% · Продано: {r.soldQty} ·
                      Остаток: {r.currentStock}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    {r.action === 'reorder' ? (
                      <>
                        <div className="text-right">
<<<<<<< HEAD
                          <p className="text-sm font-black text-indigo-600">
                            +{r.suggestedQty} шт.
                          </p>
                          <p className="text-[8px] font-black uppercase text-slate-400">
=======
                          <p className="text-accent-primary text-sm font-black">
                            +{r.suggestedQty} шт.
                          </p>
                          <p className="text-text-muted text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                            Дозаказать
                          </p>
                        </div>
                        <Button
<<<<<<< HEAD
                          className="h-10 rounded-xl bg-slate-900 px-6 text-[9px] font-black uppercase text-white"
=======
                          className="bg-text-primary h-10 rounded-xl px-6 text-[9px] font-black uppercase text-white"
>>>>>>> recover/cabinet-wip-from-stash
                          asChild
                        >
                          <Link href={`${ROUTES.shop.b2bMatrix}?sku=${encodeURIComponent(r.sku)}`}>
                            Apply
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
<<<<<<< HEAD
                        <Minus className="h-5 w-5 text-slate-400" />
=======
                        <Minus className="text-text-muted h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
                        <Badge variant="secondary" className="text-[8px] font-black">
                          Не дозаказывать
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <Button
<<<<<<< HEAD
            className="h-10 w-full rounded-2xl bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-100"
=======
            className="bg-accent-primary shadow-accent-primary/10 h-10 w-full rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl"
>>>>>>> recover/cabinet-wip-from-stash
            asChild
          >
            <Link href={ROUTES.shop.b2bMatrix}>
              <ShoppingCart className="mr-2 h-3.5 w-3.5" /> В матрицу заказа
            </Link>
          </Button>
        </Card>

        <div className="space-y-6">
<<<<<<< HEAD
          <Card className="rounded-xl border-none bg-slate-900 p-3 text-white shadow-xl">
            <h4 className="mb-4 text-base font-black uppercase tracking-tight">Stock Protection</h4>
            <p className="mb-8 text-sm font-medium text-slate-400">
=======
          <Card className="bg-text-primary rounded-xl border-none p-3 text-white shadow-xl">
            <h4 className="mb-4 text-base font-black uppercase tracking-tight">Stock Protection</h4>
            <p className="text-text-muted mb-8 text-sm font-medium">
>>>>>>> recover/cabinet-wip-from-stash
              Automatically reserves stock from incoming factory shipments when your local inventory
              drops below **15%** of weekly average sales.
            </p>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Auto-Reserve Active
                </span>
              </div>
              <div className="flex h-5 w-10 cursor-pointer items-center justify-end rounded-full bg-emerald-500 px-1">
                <div className="h-3.5 w-3.5 rounded-full bg-white" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
