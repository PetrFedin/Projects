'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { estimateResaleValue } from '@/lib/fashion/circular-resale';
import { Recycle, DollarSign, Leaf, Info } from 'lucide-react';

type Props = { product: Product };

export function ProductResaleValueBlock({ product }: Props) {
  const estimate = estimateResaleValue(product);

  return (
    <Card className="mt-4 border-emerald-500/30 bg-emerald-50/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Recycle className="h-4 w-4 text-emerald-600" />
          Circular Value & Resale
        </CardTitle>
        <CardDescription className="text-xs">
          Оценка ликвидности товара на вторичном рынке (Resale value).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Est. Resale Value</p>
            <p className="text-xl font-bold text-emerald-700">{estimate.estimatedValue.toLocaleString()} ₽</p>
          </div>
          <Badge variant="outline" className="gap-1 border-emerald-200 text-emerald-700 bg-emerald-100/50 uppercase text-[9px] font-bold">
            Demand: {estimate.demandLevel}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-100">
          <div className="space-y-1">
            <p className="text-[9px] text-muted-foreground flex items-center gap-1 uppercase font-bold">
              <Leaf className="h-2.5 w-2.5 text-emerald-600" /> Carbon Offset
            </p>
            <p className="text-xs font-bold">{estimate.carbonSavedKg} kg CO₂e</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] text-muted-foreground uppercase font-bold">Circular Grade</p>
            <p className="text-xs font-bold text-emerald-600 italic">High Durability</p>
          </div>
        </div>

        <div className="pt-2 flex items-start gap-2">
          <Info className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[9px] text-muted-foreground leading-tight italic">
            Инвестируйте в качество: бренды с высоким Resale Value сохраняют до 60% цены через год.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
