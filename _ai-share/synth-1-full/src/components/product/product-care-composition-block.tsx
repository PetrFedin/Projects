'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Product } from '@/lib/types';
import { parseComposition } from '@/lib/fashion/parse-composition';
import { careSymbolsForProduct } from '@/lib/fashion/care-symbols';
import { detectCareCompositionFriction } from '@/lib/fashion/care-composition-friction';
import { AlertTriangle, Shirt } from 'lucide-react';

type Props = { product: Product };

export function ProductCareCompositionBlock({ product }: Props) {
  const parts = parseComposition(product);
  const care = careSymbolsForProduct(product);
  const hasExplicitCare =
    (Array.isArray(product.attributes?.care) && product.attributes!.care.length > 0) ||
    (typeof product.attributes?.care === 'string' && product.attributes!.care.trim().length > 0);

  if (!parts.length && !hasExplicitCare) return null;

  const friction = detectCareCompositionFriction(product);

  return (
    <Card className="mt-4 border-dashed bg-muted/15">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shirt className="h-4 w-4" />
          Состав и уход
        </CardTitle>
        <CardDescription className="text-xs">
          Структурированные данные для DPP, маркетплейсов и будущего API состава (GS1 / PIM).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {friction && (
          <Alert variant="destructive" className="py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-xs">Несогласованность состава и ухода</AlertTitle>
            <AlertDescription className="text-xs">{friction}</AlertDescription>
          </Alert>
        )}
        {parts.length > 0 && (
          <div className="space-y-3">
            {parts.map((p) => (
              <div key={p.material} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{p.material}</span>
                  {p.percentage != null && <span className="text-muted-foreground">{p.percentage}%</span>}
                </div>
                {p.percentage != null && <Progress value={p.percentage} className="h-1" />}
              </div>
            ))}
          </div>
        )}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Пиктограммы ухода{!hasExplicitCare && parts.length ? ' (типовые для демо)' : ''}
          </p>
          <div className="flex flex-wrap gap-2">
            {care.map((c) => (
              <span
                key={c.id}
                title={c.label}
                className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border bg-background px-2 text-[11px] font-mono"
              >
                {c.short}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
