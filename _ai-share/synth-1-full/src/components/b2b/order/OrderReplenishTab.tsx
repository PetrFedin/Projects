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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-left">
        <Card className="border-none shadow-xl bg-white p-3 rounded-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-tight">Рекомендации к пополнению</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">По sell-through и остатку · Дозаказать X шт. или не дозаказывать</p>
            </div>
            <RefreshCcw className="h-8 w-8 text-indigo-600 animate-spin-slow" />
          </div>
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <p className="text-[10px] text-slate-500 uppercase font-bold">Нет данных. Оформите заказы — появятся подсказки.</p>
            ) : (
              recommendations.map((r) => (
                <div
                  key={`${r.orderId}-${r.sku}`}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-2xl border',
                    r.action === 'reorder' ? 'bg-indigo-50/80 border-indigo-100' : 'bg-slate-50 border-slate-100'
                  )}
                >
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-black uppercase text-slate-900 truncate">{r.productName}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Sell-through {Math.round(r.sellThroughRate * 100)}% · Продано: {r.soldQty} · Остаток: {r.currentStock}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {r.action === 'reorder' ? (
                      <>
                        <div className="text-right">
                          <p className="text-sm font-black text-indigo-600">+{r.suggestedQty} шт.</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase">Дозаказать</p>
                        </div>
                        <Button className="h-10 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase px-6" asChild>
                          <Link href={`${ROUTES.shop.b2bMatrix}?sku=${encodeURIComponent(r.sku)}`}>Apply</Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Minus className="h-5 w-5 text-slate-400" />
                        <Badge variant="secondary" className="text-[8px] font-black">Не дозаказывать</Badge>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <Button className="w-full h-10 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100" asChild>
            <Link href={ROUTES.shop.b2bMatrix}><ShoppingCart className="h-3.5 w-3.5 mr-2" /> В матрицу заказа</Link>
          </Button>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-slate-900 text-white p-3 rounded-xl">
            <h4 className="text-base font-black uppercase tracking-tight mb-4">Stock Protection</h4>
            <p className="text-sm text-slate-400 font-medium mb-8">
              Automatically reserves stock from incoming factory shipments when your local inventory drops below **15%** of weekly average sales.
            </p>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Auto-Reserve Active</span>
              </div>
              <div className="h-5 w-10 bg-emerald-500 rounded-full flex items-center justify-end px-1 cursor-pointer">
                <div className="h-3.5 w-3.5 rounded-full bg-white" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
