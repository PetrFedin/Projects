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
    high: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-red-100 text-red-700',
  };

  return (
    <Card className="border-dashed p-4">
      <div className="mb-3 flex items-center gap-2">
        <PiggyBank className="h-4 w-4 text-blue-500" />
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Investment Value
        </h4>
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
            <Clock className="h-4 w-4" />
            {cpw.projectedWears}
          </div>
          <div className="text-xs text-muted-foreground">Expected lifecycle (wears)</div>
        </div>
      </div>

      <div className="bg-bg-surface2 mt-4 flex items-start gap-2 rounded p-2 text-[10px]">
        <Info className="text-text-muted mt-0.5 h-3 w-3" />
        <span className="text-text-secondary italic">
          Calculated based on product category '{product.category}' durability benchmarks.
        </span>
      </div>
    </Card>
  );
};
