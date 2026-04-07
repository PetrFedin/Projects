'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { calculateSizeAffinity } from '@/lib/fashion/size-affinity';
import { ArrowRightLeft, CheckCircle2 } from 'lucide-react';

type Props = { product: Product };

export function ProductSizeAffinityBlock({ product }: Props) {
  // Демо: предполагаем базовый размер M
  const affinities = calculateSizeAffinity(product.brand, 'M');

  return (
    <Card className="mt-4 border-dashed bg-muted/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4" />
          Size Affinity Matrix
        </CardTitle>
        <CardDescription className="text-xs">
          Ваш размер {product.brand} в сравнении с другими брендами Syntha.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {affinities.map(a => (
          <div key={a.brand} className="flex items-center justify-between py-1.5 border-b last:border-0 border-muted">
            <span className="text-[11px] font-medium">{a.brand}</span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground font-mono">{a.affinityScore}% match</span>
              <Badge variant="secondary" className="text-[10px] font-bold min-w-[32px] justify-center">
                {a.recommendedSize}
              </Badge>
            </div>
          </div>
        ))}
        <p className="text-[9px] text-muted-foreground italic leading-tight pt-1">
          * На основе 12.4к кросс-покупок и данных о возвратах.
        </p>
      </CardContent>
    </Card>
  );
}
