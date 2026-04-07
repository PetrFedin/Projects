'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { getLongevityTips } from '@/lib/fashion/care-longevity';
import { ShieldPlus, Sparkles, Clock, Info } from 'lucide-react';

type Props = { product: Product };

export function ProductLongevityBlock({ product }: Props) {
  const tips = getLongevityTips(product);
  if (tips.length === 0) return null;

  return (
    <Card className="mt-4 border-dashed bg-emerald-50/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShieldPlus className="h-4 w-4 text-emerald-600" />
          Care & Longevity
        </CardTitle>
        <CardDescription className="text-xs">
          Как продлить срок службы этого изделия.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-3 border-b border-emerald-100 pb-2 last:border-0 last:pb-0">
            <div className="mt-0.5 rounded-full bg-emerald-100 p-1">
              <Sparkles className="h-2.5 w-2.5 text-emerald-700" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-emerald-900">{tip.action}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{tip.impact}</p>
              <div className="flex items-center gap-1 text-[9px] text-emerald-700 font-medium pt-0.5">
                <Clock className="h-2.5 w-2.5" />
                <span>+ {tip.estYearsAdded} years of life</span>
              </div>
            </div>
          </div>
        ))}
        <div className="pt-2 flex items-start gap-2 border-t border-emerald-100 mt-1">
          <Info className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[9px] text-muted-foreground italic leading-tight uppercase font-bold tracking-tighter">
            Slow Fashion: Reduce, Reuse, Repair.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
