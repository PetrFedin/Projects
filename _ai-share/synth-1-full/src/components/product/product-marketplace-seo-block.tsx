'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, TrendingDown, Target, Info } from 'lucide-react';
import { getMarketplaceSeo } from '@/lib/fashion/marketplace-seo';

export const ProductMarketplaceSeoBlock: React.FC<{ product: Product }> = ({ product }) => {
  const seo = getMarketplaceSeo(product);

  return (
    <Card className="relative overflow-hidden border-2 border-purple-50 bg-purple-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 -rotate-12 p-2 opacity-5">
        <Search className="h-16 w-16 text-purple-400" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-purple-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-purple-700">
            Marketplace Search Visibility
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-purple-500">
          Keywords Tracked: {seo.length}
        </div>
      </div>

      <div className="space-y-3">
        {seo.map((s, idx) => (
          <div
            key={idx}
            className="group rounded-lg border border-purple-100 bg-white p-3 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <Badge
                variant="outline"
                className="h-4 border-none bg-purple-600 text-[10px] font-black uppercase text-white"
              >
                {s.marketplace}
              </Badge>
              <div className="text-[10px] font-black uppercase text-slate-400">
                Score: {s.visibilityScore}
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="mb-1 text-[9px] font-black uppercase leading-none text-slate-400">
                  Top Keyword
                </div>
                <div className="text-xs font-bold italic text-slate-700">"{s.keyword}"</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black leading-none text-slate-800">#{s.rank}</div>
                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[9px] font-black uppercase ${s.searchTrend === 'rising' ? 'text-green-600' : 'text-slate-400'}`}
                >
                  {s.searchTrend === 'rising' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3 opacity-40" />
                  )}
                  Trend {s.searchTrend}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-1.5 border-t border-purple-100 pt-3 text-[9px] font-bold uppercase italic leading-none text-slate-400">
        <Info className="h-3 w-3" /> Индекс поиска v4.1 • синхронизация 2 ч назад
      </div>
    </Card>
  );
};
