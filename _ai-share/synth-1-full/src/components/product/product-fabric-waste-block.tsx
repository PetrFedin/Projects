'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Scissors, Recycle, Info, Wind } from 'lucide-react';
import { estimateFabricWaste } from '@/lib/fashion/fabric-waste';
import { Progress } from '@/components/ui/progress';

export const ProductFabricWasteBlock: React.FC<{ product: Product }> = ({ product }) => {
  const waste = estimateFabricWaste(product);
  
  return (
    <Card className="p-4 border-2 border-green-50 bg-green-50/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-green-600" />
          <h4 className="font-bold text-sm uppercase text-green-600">Cutting Room Analytics</h4>
        </div>
        <div className="text-[10px] font-black text-green-500 flex items-center gap-1 uppercase">
          <Wind className="w-3 h-3" /> Waste Estimate
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-black text-green-800">{waste.estimatedWaste}%</div>
          <div className="text-right">
            <div className="text-[10px] font-black text-slate-400 uppercase">Optimization</div>
            <div className="text-sm font-bold text-slate-700">{waste.cutOptimizationScore}/100</div>
          </div>
        </div>
        <Progress value={waste.cutOptimizationScore} className="h-1.5 bg-green-100 fill-green-500" />

        <div className="p-2 bg-green-100 rounded text-[10px] text-green-800 flex gap-2 border border-green-200">
          <Recycle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>
            <b>Save {waste.savedMaterialCo2}kg CO2</b> by increasing optimization to 95%. Current pattern complexity is {product.name.length % 5}.
          </span>
        </div>

        <div className="mt-2 text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1 italic">
          <Info className="w-2.5 h-2.5" /> Source: Factory Cutting Logs v4.1
        </div>
      </div>
    </Card>
  );
};
