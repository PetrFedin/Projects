'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShoppingBag, Plus, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getB2BReorderSuggestions } from '@/lib/fashion/b2b-reorder-engine';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductReorderRecommendationBlock({ product }: { product: Product }) {
  const recommendations = getB2BReorderSuggestions('PARTNER-01', [product.sku]);

  return (
    <Card className="border-accent-primary bg-accent-primary group relative my-4 overflow-hidden border-2 p-4 text-white shadow-2xl">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-10 transition-transform group-hover:scale-110">
        <Sparkles className="h-16 w-16 text-white" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-accent-primary/30 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white">
            AI-Driven Reorder Suggestions
          </h4>
        </div>
        <Badge className="bg-accent-primary h-4 border-none text-[8px] font-black uppercase text-white">
          Smart Hub
        </Badge>
      </div>

      <div className="space-y-4">
        {recommendations.map((r) => (
          <div
            key={r.sku}
            className="group/item cursor-pointer rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-accent-primary flex h-8 w-8 items-center justify-center rounded-xl shadow-md">
                  <ShoppingBag className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase leading-tight tracking-tight text-white">
                    {r.sku}
                  </div>
                  <div className="text-accent-primary/40 text-[8px] font-bold uppercase tracking-wider">
                    {r.reason}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[14px] font-black text-white">+{r.suggestedQty}</div>
                <div className="text-accent-primary text-[7px] font-black uppercase leading-none">
                  Suggested
                </div>
              </div>
            </div>

            <div className="mb-3 flex items-center gap-3">
              <div className="flex-1">
                <Progress
                  value={r.confidenceScore}
                  className="h-1 rounded-full bg-white/10 fill-white"
                />
              </div>
              <span className="text-accent-primary/40 text-[8px] font-black uppercase tracking-widest">
                {r.confidenceScore}% Conf.
              </span>
            </div>

            <button className="text-accent-primary shadow-accent-primary/25 hover:bg-accent-primary/10 flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-white text-[8px] font-black uppercase shadow-lg transition-all">
              Quick Reorder <Plus className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3">
        <RefreshCw className="text-accent-primary animate-spin-slow h-4 w-4" />
        <div className="text-accent-primary/30 text-[9px] font-bold uppercase tracking-widest">
          Live Sync: Analyzing {recommendations.length} SKU dependencies...
        </div>
      </div>
    </Card>
  );
}
