'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { extractAlterationOffer } from '@/lib/fashion/alterations-metadata';
import { Scissors } from 'lucide-react';

type Props = { product: Product };

export function ProductAlterationsBlock({ product }: Props) {
  const o = extractAlterationOffer(product);
  if (!o) return null;

  return (
    <Card className="mt-4 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Scissors className="h-4 w-4" />
          Подгонка / ателье
        </CardTitle>
        <CardDescription className="text-xs">
          Данные из PIM; в проде — запись в заказ и SLA мастерской.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {o.available && (
          <p className="text-xs font-medium text-emerald-700">
            Доступна подгонка у партнёра бренда
          </p>
        )}
        {o.services.length > 0 && (
          <ul className="list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
            {o.services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
        {o.note && <p className="text-xs leading-snug text-muted-foreground">{o.note}</p>}
      </CardContent>
    </Card>
  );
}
