'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { extractFabricSpec } from '@/lib/fashion/fabric-spec';
import { Layers } from 'lucide-react';

type Props = { product: Product };

export function ProductFabricSpecBlock({ product }: Props) {
  const spec = extractFabricSpec(product);
  if (!spec) return null;

  return (
    <Card className="mt-4 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Полотно
        </CardTitle>
        <CardDescription className="text-xs">GSM и конструкция из PIM — для tech pack и B2B-запросов.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {spec.gsm != null && (
          <p>
            <span className="text-muted-foreground">Плотность:</span>{' '}
            <strong className="font-mono">{spec.gsm} g/m²</strong>
          </p>
        )}
        {spec.construction && (
          <p>
            <span className="text-muted-foreground">Конструкция:</span> {spec.construction}
          </p>
        )}
        {spec.handfeelNote && <p className="text-xs text-muted-foreground leading-snug">{spec.handfeelNote}</p>}
      </CardContent>
    </Card>
  );
}
