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
        <CardTitle className="flex items-center gap-2 text-sm">
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
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Est. Resale Value
            </p>
            <p className="text-xl font-bold text-emerald-700">
              {estimate.estimatedValue.toLocaleString()} ₽
            </p>
          </div>
          <Badge
            variant="outline"
            className="gap-1 border-emerald-200 bg-emerald-100/50 text-[9px] font-bold uppercase text-emerald-700"
          >
            Demand: {estimate.demandLevel}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-emerald-100 pt-2">
          <div className="space-y-1">
            <p className="flex items-center gap-1 text-[9px] font-bold uppercase text-muted-foreground">
              <Leaf className="h-2.5 w-2.5 text-emerald-600" /> Carbon Offset
            </p>
            <p className="text-xs font-bold">{estimate.carbonSavedKg} kg CO₂e</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-bold uppercase text-muted-foreground">Circular Grade</p>
            <p className="text-xs font-bold italic text-emerald-600">High Durability</p>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-2">
          <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
          <p className="text-[9px] italic leading-tight text-muted-foreground">
            Инвестируйте в качество: бренды с высоким Resale Value сохраняют до 60% цены через год.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
