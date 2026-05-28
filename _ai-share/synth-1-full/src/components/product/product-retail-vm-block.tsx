'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, Info, Star, Layout, Users } from 'lucide-react';
import { getRetailPlanogram } from '@/lib/fashion/retail-planogram';

export const ProductRetailVmBlock: React.FC<{ product: Product }> = ({ product }) => {
  const p = getRetailPlanogram(product);

  return (
    <Card className="relative overflow-hidden border-2 border-stone-200 bg-stone-50/20 p-4 shadow-sm">
      <div className="absolute -right-2 -top-2 opacity-5">
        <Layout className="h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-stone-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-stone-700">
            Retail Planogram (Store Ops)
          </h4>
        </div>
        <Badge variant="outline" className="h-4 border-stone-200 bg-white text-[9px]">
          STORE: {p.storeId}
        </Badge>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <div className="mb-1.5 text-[10px] font-black uppercase leading-none text-stone-400">
            Section
          </div>
          <div className="text-xs font-bold text-stone-800">{p.section}</div>
        </div>
        <div>
          <div className="mb-1.5 text-[10px] font-black uppercase leading-none text-stone-400">
            Shelf Position
          </div>
          <div className="text-xs font-bold text-stone-800">Rank #{p.shelfPosition}</div>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-stone-100 bg-white p-3">
        <div className="mb-1.5 flex items-center gap-1 text-[10px] font-black uppercase text-stone-400">
          <Star className="h-3 w-3 text-yellow-500" /> Cross-Sell Story
        </div>
        <div className="flex gap-2">
          {p.adjacentSkus.map((sku) => (
            <Badge
              key={sku}
              variant="secondary"
              className="h-4 border border-stone-100 bg-stone-50 text-[9px]"
            >
              {sku}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="rounded bg-stone-100 p-1">
          <Info className="h-3.5 w-3.5 text-stone-500" />
        </div>
        <div className="text-[10px] italic leading-tight text-stone-600">"{p.visualMerchTip}"</div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-stone-100 pt-3 text-[9px] font-bold uppercase text-stone-400">
        <Users className="h-3 w-3" /> Staff Instruction v1.2
      </div>
    </Card>
  );
};
