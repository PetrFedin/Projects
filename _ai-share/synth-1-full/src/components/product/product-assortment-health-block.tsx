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
    <Card className="p-4 border-2 border-emerald-50 bg-emerald-50/10 shadow-sm my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-emerald-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Category Health: {product.category}</h4>
        </div>
        <Badge className="bg-emerald-100 text-emerald-700 text-[8px] font-black border-none uppercase">
          {Math.round(((health.colorBalance || 0) + (health.sizeAvailability || 0) + (health.marginHealth || 0)) / 3)}% Score
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
             <span>Color</span>
             <span>{health.colorBalance}%</span>
          </div>
          <Progress value={health.colorBalance} className="h-1 bg-slate-100 fill-indigo-500" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
             <span>Size</span>
             <span>{health.sizeAvailability}%</span>
          </div>
          <Progress value={health.sizeAvailability} className="h-1 bg-slate-100 fill-emerald-500" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
             <span>Margin</span>
             <span>{health.marginHealth}%</span>
          </div>
          <Progress value={health.marginHealth} className="h-1 bg-slate-100 fill-rose-500" />
        </div>
      </div>

      <div className="space-y-1.5 border-t pt-3 mt-1">
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-tight">Merchandising Insight</div>
        {health.recommendations.slice(0, 1).map((rec, i) => (
          <div key={i} className="text-[10px] font-bold text-slate-600 flex gap-1.5 items-start leading-tight">
            <Zap className="w-3 h-3 text-yellow-500 shrink-0 mt-0.5" />
            {rec}
          </div>
        ))}
      </div>
    </Card>
  );
}
