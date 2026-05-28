'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Quote, Star, CheckCircle2, MessageSquare, TrendingUp } from 'lucide-react';
import { getMarketplaceSentiment } from '@/lib/fashion/marketplace-sentiment';
import type { Product } from '@/lib/types';

export function ProductMarketplaceSentimentBlock({ product }: { product: Product }) {
  const sentiment = getMarketplaceSentiment(product.sku);

  return (
    <Card className="border-accent-primary/15 bg-accent-primary/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Quote className="text-accent-primary h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Quote className="text-accent-primary h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Marketplace Sentiment Mirror
          </h4>
        </div>
        <div className="flex gap-1">
          <Badge className="bg-accent-primary border-none text-[8px] font-black uppercase text-white">
            WB {sentiment.wbRating}
          </Badge>
          <Badge className="border-none bg-blue-600 text-[8px] font-black uppercase text-white">
            OZON {sentiment.ozonRating}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-text-secondary text-[11px] font-bold italic leading-tight">
          "{sentiment.summarySentiment}"
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="text-[8px] font-black uppercase tracking-tight text-emerald-600">
              Positive Signals
            </div>
            {sentiment.topPositiveTraits.map((t, i) => (
              <div
                key={i}
                className="text-text-secondary flex items-center gap-1.5 text-[9px] font-bold"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {t}
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <div className="text-[8px] font-black uppercase tracking-tight text-rose-600">
              Watch Outs
            </div>
            {sentiment.topNegativeTraits.map((t, i) => (
              <div
                key={i}
                className="text-text-secondary flex items-center gap-1.5 text-[9px] font-bold"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-rose-400" /> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-accent-primary/20 text-text-muted mt-4 flex items-center justify-between border-t pt-4 text-[8px] font-black uppercase">
        <span>Source: AI Review Aggregator</span>
        <span>{sentiment.reviewCountTotal.toLocaleString()} Reviews</span>
      </div>
    </Card>
  );
}
