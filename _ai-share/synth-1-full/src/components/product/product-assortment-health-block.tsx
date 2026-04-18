'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeartPulse, Zap, Palette, Ruler, TrendingUp } from 'lucide-react';
import { analyzeAssortmentHealth } from '@/lib/fashion/assortment-health';
import { products } from '@/lib/products';
import { Progress } from '@/components/ui/progress';
import type { Product } from '@/lib/types';

export function ProductAssortmentHealthBlock({ product }: { product: Product }) {
  const health = analyzeAssortmentHealth(products, product.category);

  return (
    <Card className="my-4 border-2 border-emerald-50 bg-emerald-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-emerald-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Category Health: {product.category}
          </h4>
        </div>
        <Badge className="border-none bg-emerald-100 text-[8px] font-black uppercase text-emerald-700">
          {Math.round(
            ((health.colorBalance || 0) +
              (health.sizeAvailability || 0) +
              (health.marginHealth || 0)) /
              3
          )}
          % Score
        </Badge>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="flex justify-between text-[8px] font-black uppercase text-slate-400">
            <span>Color</span>
            <span>{health.colorBalance}%</span>
          </div>
          <Progress value={health.colorBalance} className="h-1 bg-slate-100 fill-indigo-500" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[8px] font-black uppercase text-slate-400">
            <span>Size</span>
            <span>{health.sizeAvailability}%</span>
          </div>
          <Progress value={health.sizeAvailability} className="h-1 bg-slate-100 fill-emerald-500" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[8px] font-black uppercase text-slate-400">
            <span>Margin</span>
            <span>{health.marginHealth}%</span>
          </div>
          <Progress value={health.marginHealth} className="h-1 bg-slate-100 fill-rose-500" />
        </div>
      </div>

      <div className="mt-1 space-y-1.5 border-t pt-3">
        <div className="text-[8px] font-black uppercase tracking-tight text-slate-400">
          Merchandising Insight
        </div>
        {health.recommendations.slice(0, 1).map((rec, i) => (
          <div
            key={i}
            className="flex items-start gap-1.5 text-[10px] font-bold leading-tight text-slate-600"
          >
            <Zap className="mt-0.5 h-3 w-3 shrink-0 text-yellow-500" />
            {rec}
          </div>
        ))}
      </div>
    </Card>
  );
}
