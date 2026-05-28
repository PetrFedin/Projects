'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { extractProductIdentifiers } from '@/lib/fashion/product-identifiers';
import { Hash } from 'lucide-react';

type Props = { product: Product };

export function ProductIdentifiersBlock({ product }: Props) {
  const fields = extractProductIdentifiers(product);
  if (!fields.length) return null;

  return (
    <Card className="mt-4 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Hash className="h-4 w-4" />
          Идентификаторы
        </CardTitle>
        <CardDescription className="text-xs">
          GTIN, ТН ВЭД, HS — выгрузка на МП и таможню.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className="rounded-md border bg-muted/30 px-2 py-1.5">
              <dt className="text-[10px] uppercase text-muted-foreground">{f.label}</dt>
              <dd className="mt-0.5 break-all font-mono">{f.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
