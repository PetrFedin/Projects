'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MapPin, BarChart3, AlertCircle, Info } from 'lucide-react';
import { getRegionalPriceLadder } from '@/lib/fashion/national-price-ladder';
import type { Product } from '@/lib/types';

export function ProductRegionalPriceLadderBlock({ product }: { product: Product }) {
  const ladder = getRegionalPriceLadder(product.sku);

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <BarChart3 className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">National Price Ladder (РФ)</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase">Retail Optimization Mode</div>
      </div>

      <div className="space-y-3">
        {ladder.map((r) => (
          <div key={r.region} className="group">
            <div className="flex justify-between items-center mb-1">
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                  <MapPin className="w-2.5 h-2.5 text-slate-400" /> {r.region}
               </div>
               <div className="text-[10px] font-black text-slate-800">
                  {r.avgRetailPrice.toLocaleString()} ₽ 
                  <span className={r.priceIndex > 100 ? "ml-1.5 text-rose-500 text-[8px]" : "ml-1.5 text-emerald-500 text-[8px]"}>
                     ({r.priceIndex > 100 ? '+' : ''}{r.priceIndex - 100}%)
                  </span>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-slate-300" style={{ width: `${(r.localCompetitorAvg / 20000) * 100}%` }} />
                  <div className="h-full bg-indigo-500" style={{ width: `${(r.avgRetailPrice / 20000) * 100}%` }} />
               </div>
               <span className="text-[8px] font-black text-slate-400 uppercase">{r.marginHealth}% Mgn</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-2.5 bg-white rounded-lg border border-slate-100 flex gap-2 items-start shadow-sm">
         <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
         <div className="text-[9px] text-slate-500 font-medium leading-tight">
            <b>Аналитика:</b> Цены в Москве выше среднего на 10%. В регионах (Урал, Сибирь) рекомендуется удерживать цену на уровне конкурентов для сохранения оборачиваемости.
         </div>
      </div>
    </Card>
  );
}
