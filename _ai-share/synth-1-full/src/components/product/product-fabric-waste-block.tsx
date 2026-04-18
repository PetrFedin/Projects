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
    <Card className="border-2 border-green-50 bg-green-50/10 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="h-4 w-4 text-green-600" />
          <h4 className="text-sm font-bold uppercase text-green-600">Cutting Room Analytics</h4>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-green-500">
          <Wind className="h-3 w-3" /> Waste Estimate
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-black text-green-800">{waste.estimatedWaste}%</div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase text-slate-400">Optimization</div>
            <div className="text-sm font-bold text-slate-700">{waste.cutOptimizationScore}/100</div>
          </div>
        </div>
        <Progress
          value={waste.cutOptimizationScore}
          className="h-1.5 bg-green-100 fill-green-500"
        />

        <div className="flex gap-2 rounded border border-green-200 bg-green-100 p-2 text-[10px] text-green-800">
          <Recycle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            <b>Save {waste.savedMaterialCo2}kg CO2</b> by increasing optimization to 95%. Current
            pattern complexity is {product.name.length % 5}.
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1 text-[9px] font-bold uppercase italic text-slate-400">
          <Info className="h-2.5 w-2.5" /> Source: Factory Cutting Logs v4.1
        </div>
      </div>
    </Card>
  );
};
