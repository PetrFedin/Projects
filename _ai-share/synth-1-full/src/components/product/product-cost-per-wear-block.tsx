'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PiggyBank, Clock, Info } from 'lucide-react';
import { calculateCostPerWear } from '@/lib/fashion/cost-per-wear';

export const ProductCostPerWearBlock: React.FC<{ product: Product }> = ({ product }) => {
  const cpw = calculateCostPerWear(product);
  
  const gradeColors: Record<string, string> = {
    'high': 'bg-green-100 text-green-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'low': 'bg-red-100 text-red-700',
  };

  return (
    <Card className="p-4 border-dashed">
      <div className="flex items-center gap-2 mb-3">
        <PiggyBank className="w-4 h-4 text-blue-500" />
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Investment Value</h4>
        <Badge variant="outline" className={gradeColors[cpw.investmentGrade]}>
          {cpw.investmentGrade.toUpperCase()} GRADE
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-bold">${cpw.costPerWear.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">Cost per wear (est.)</div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-2xl font-bold">
            <Clock className="w-4 h-4" />
            {cpw.projectedWears}
          </div>
          <div className="text-xs text-muted-foreground">Expected lifecycle (wears)</div>
        </div>
      </div>

      <div className="mt-4 p-2 bg-slate-50 rounded text-[10px] flex gap-2 items-start">
        <Info className="w-3 h-3 text-slate-400 mt-0.5" />
        <span className="text-slate-500 italic">
          Calculated based on product category '{product.category}' durability benchmarks.
        </span>
      </div>
    </Card>
  );
};
