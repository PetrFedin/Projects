'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { extractDesignDna } from '@/lib/fashion/design-dna';
import { Fingerprint, Info } from 'lucide-react';

type Props = { product: Product };

export function ProductDesignDnaBlock({ product }: Props) {
  const dna = extractDesignDna(product);
  
  const entries = Object.entries(dna).filter(([_, v]) => !!v);
  if (entries.length === 0) return null;

  return (
    <Card className="mt-4 border-dashed bg-violet-50/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Fingerprint className="h-4 w-4 text-violet-600" />
          Design DNA & Details
        </CardTitle>
        <CardDescription className="text-xs">
          Конструктивные особенности и детали модели из PIM.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {entries.map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">{k}</span>
              <span className="text-xs font-medium">{v}</span>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t mt-3 flex items-start gap-2">
          <Info className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[9px] text-muted-foreground italic leading-tight">
            Эти атрибуты используются для AI-подбора похожих товаров и анализа трендов.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
