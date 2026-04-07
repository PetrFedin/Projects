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
    <Card className="p-4 border-2 border-stone-200 bg-stone-50/20 shadow-sm relative overflow-hidden">
      <div className="absolute -top-2 -right-2 opacity-5">
        <Layout className="w-16 h-16" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-stone-600" />
          <h4 className="font-bold text-xs uppercase text-stone-700 tracking-tight">Retail Planogram (Store Ops)</h4>
        </div>
        <Badge variant="outline" className="text-[9px] h-4 bg-white border-stone-200">STORE: {p.storeId}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-[10px] font-black text-stone-400 uppercase leading-none mb-1.5">Section</div>
          <div className="text-xs font-bold text-stone-800">{p.section}</div>
        </div>
        <div>
          <div className="text-[10px] font-black text-stone-400 uppercase leading-none mb-1.5">Shelf Position</div>
          <div className="text-xs font-bold text-stone-800">Rank #{p.shelfPosition}</div>
        </div>
      </div>

      <div className="p-3 bg-white rounded-lg border border-stone-100 mb-4">
        <div className="text-[10px] font-black text-stone-400 uppercase mb-1.5 flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500" /> Cross-Sell Story
        </div>
        <div className="flex gap-2">
          {p.adjacentSkus.map(sku => (
            <Badge key={sku} variant="secondary" className="text-[9px] h-4 bg-stone-50 border border-stone-100">{sku}</Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2 items-start">
        <div className="p-1 rounded bg-stone-100">
          <Info className="w-3.5 h-3.5 text-stone-500" />
        </div>
        <div className="text-[10px] text-stone-600 leading-tight italic">
          "{p.visualMerchTip}"
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-[9px] text-stone-400 font-bold uppercase">
         <Users className="w-3 h-3" /> Staff Instruction v1.2
      </div>
    </Card>
  );
};
