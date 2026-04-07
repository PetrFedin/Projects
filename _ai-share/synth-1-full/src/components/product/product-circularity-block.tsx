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
    <Card className="p-4 border-2 border-green-50 bg-green-50/10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 rotate-12">
        <Recycle className="w-16 h-16 text-green-400" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RefreshCcw className="w-4 h-4 text-green-600" />
          <h4 className="font-bold text-xs uppercase text-green-700 tracking-tight">Garment Circularity & Resale</h4>
        </div>
        <div className="text-[10px] font-black text-green-500 uppercase flex items-center gap-1">
          <Leaf className="w-3 h-3" /> Eco Score
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Est. Resale Value</div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
             {circ.estimatedResaleValue.toLocaleString()} ₽
          </div>
        </div>
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Recyclability</div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
             {circ.recyclabilityRate}%
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg border border-green-100 flex flex-col gap-2 shadow-sm">
         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
            <span>Recycled Material Content</span>
            <span className="text-green-600">{circ.recycledContent}%</span>
         </div>
         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all" style={{ width: `${circ.recycledContent}%` }} />
         </div>
      </div>

      <div className="mt-4 pt-3 border-t border-green-50 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase italic">
         <span className="flex items-center gap-1.5"><Wind className="w-3 h-3" /> CO2 Saved: {circ.carbonSavings}kg</span>
         <span className="flex items-center gap-1.5 text-green-600 cursor-pointer hover:underline"><ShoppingBag className="w-3 h-3" /> Sell on Resale</span>
      </div>
    </Card>
  );
};
