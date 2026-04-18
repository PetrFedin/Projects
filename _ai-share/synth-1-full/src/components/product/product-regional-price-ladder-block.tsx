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
    <Card className="border-border-subtle bg-bg-surface2/10 my-4 border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            National Price Ladder (РФ)
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase">
          Retail Optimization Mode
        </div>
      </div>

      <div className="space-y-3">
        {ladder.map((r) => (
          <div key={r.region} className="group">
            <div className="mb-1 flex items-center justify-between">
              <div className="text-text-primary flex items-center gap-1.5 text-[10px] font-bold">
                <MapPin className="text-text-muted h-2.5 w-2.5" /> {r.region}
              </div>
              <div className="text-text-primary text-[10px] font-black">
                {r.avgRetailPrice.toLocaleString()} ₽
                <span
                  className={
                    r.priceIndex > 100
                      ? 'ml-1.5 text-[8px] text-rose-500'
                      : 'ml-1.5 text-[8px] text-emerald-500'
                  }
                >
                  ({r.priceIndex > 100 ? '+' : ''}
                  {r.priceIndex - 100}%)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-bg-surface2 flex h-1.5 flex-1 overflow-hidden rounded-full">
                <div
                  className="bg-border-default h-full"
                  style={{ width: `${(r.localCompetitorAvg / 20000) * 100}%` }}
                />
                <div
                  className="bg-accent-primary h-full"
                  style={{ width: `${(r.avgRetailPrice / 20000) * 100}%` }}
                />
              </div>
              <span className="text-text-muted text-[8px] font-black uppercase">
                {r.marginHealth}% Mgn
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-border-subtle mt-4 flex items-start gap-2 rounded-lg border bg-white p-2.5 shadow-sm">
        <Info className="text-accent-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
        <div className="text-text-secondary text-[9px] font-medium leading-tight">
          <b>Аналитика:</b> Цены в Москве выше среднего на 10%. В регионах (Урал, Сибирь)
          рекомендуется удерживать цену на уровне конкурентов для сохранения оборачиваемости.
        </div>
      </div>
    </Card>
  );
}
