'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Recycle, RefreshCcw, Leaf, ShoppingBag, Wind } from 'lucide-react';
import { calculateCircularity } from '@/lib/fashion/circularity-score';

export const ProductCircularityBlock: React.FC<{ product: Product }> = ({ product }) => {
  const circ = calculateCircularity(product);

  return (
    <Card className="relative overflow-hidden border-2 border-green-50 bg-green-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <Recycle className="h-16 w-16 text-green-400" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4 text-green-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-green-700">
            Garment Circularity & Resale
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-green-500">
          <Leaf className="h-3 w-3" /> Eco Score
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-text-muted mb-1 text-[10px] font-black uppercase">
            Est. Resale Value
          </div>
          <div className="text-text-primary text-2xl font-black tracking-tight">
            {circ.estimatedResaleValue.toLocaleString()} ₽
          </div>
        </div>
        <div>
          <div className="text-text-muted mb-1 text-[10px] font-black uppercase">Recyclability</div>
          <div className="text-text-primary text-2xl font-black tracking-tight">
            {circ.recyclabilityRate}%
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-lg border border-green-100 bg-white p-3 shadow-sm">
        <div className="text-text-secondary flex items-center justify-between text-[10px] font-black uppercase">
          <span>Recycled Material Content</span>
          <span className="text-green-600">{circ.recycledContent}%</span>
        </div>
        <div className="bg-bg-surface2 h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${circ.recycledContent}%` }}
          />
        </div>
      </div>

      <div className="text-text-muted mt-4 flex items-center justify-between border-t border-green-50 pt-3 text-[9px] font-bold uppercase italic">
        <span className="flex items-center gap-1.5">
          <Wind className="h-3 w-3" /> CO2 Saved: {circ.carbonSavings}kg
        </span>
        <span className="flex cursor-pointer items-center gap-1.5 text-green-600 hover:underline">
          <ShoppingBag className="h-3 w-3" /> Sell on Resale
        </span>
      </div>
    </Card>
  );
};
