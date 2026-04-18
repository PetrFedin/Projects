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
    <Card className="border-accent-primary/15 bg-accent-primary/10 relative overflow-hidden border-2 p-4 shadow-sm">
      <div className="absolute right-0 top-0 -rotate-12 p-2 opacity-5">
        <Search className="text-accent-primary h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="text-accent-primary h-4 w-4" />
          <h4 className="text-accent-primary text-xs font-bold uppercase tracking-tight">
            Marketplace Search Visibility
          </h4>
        </div>
        <div className="text-accent-primary flex items-center gap-1 text-[10px] font-black uppercase">
          Keywords Tracked: {seo.length}
        </div>
      </div>

      <div className="space-y-3">
        {seo.map((s, idx) => (
          <div
            key={idx}
            className="border-accent-primary/20 group rounded-lg border bg-white p-3 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <Badge
                variant="outline"
                className="bg-accent-primary h-4 border-none text-[10px] font-black uppercase text-white"
              >
                {s.marketplace}
              </Badge>
              <div className="text-text-muted text-[10px] font-black uppercase">
                Score: {s.visibilityScore}
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-text-muted mb-1 text-[9px] font-black uppercase leading-none">
                  Top Keyword
                </div>
                <div className="text-text-primary text-xs font-bold italic">"{s.keyword}"</div>
              </div>
              <div className="text-right">
                <div className="text-text-primary text-2xl font-black leading-none">#{s.rank}</div>
                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[9px] font-black uppercase ${s.searchTrend === 'rising' ? 'text-green-600' : 'text-text-muted'}`}
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

      <div className="border-accent-primary/20 text-text-muted mt-4 flex items-center gap-1.5 border-t pt-3 text-[9px] font-bold uppercase italic leading-none">
        <Info className="h-3 w-3" /> Search Index v4.1 • Data synced 2h ago
      </div>
    </Card>
  );
};
