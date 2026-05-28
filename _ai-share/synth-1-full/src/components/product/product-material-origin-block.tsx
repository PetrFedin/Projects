'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { getMaterialOrigins } from '@/lib/fashion/material-origin';
import { Map, ShieldCheck, Globe } from 'lucide-react';

type Props = { product: Product };

export function ProductMaterialOriginBlock({ product }: Props) {
  const origins = getMaterialOrigins(product);
  if (origins.length === 0) return null;

  return (
    <Card className="mt-4 border-dashed bg-blue-50/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4 text-blue-600" />
          Fiber Traceability
        </CardTitle>
        <CardDescription className="text-xs">
          Происхождение волокон и сертификация материалов (DPP).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {origins.map((o, i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-4 border-b border-blue-100 pb-2 last:border-0 last:pb-0"
          >
            <div className="space-y-0.5">
              <p className="text-xs font-bold">
                {o.fiber} ({o.percentage}%)
              </p>
              <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Map className="h-3 w-3" />
                Origin: {o.country}
              </p>
            </div>
            {o.certification && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-blue-300 bg-blue-50 text-[9px] text-blue-700"
              >
                <ShieldCheck className="h-2.5 w-2.5" />
                {o.certification}
              </Badge>
            )}
          </div>
        ))}
        <p className="text-[9px] italic leading-tight text-muted-foreground">
          * Данные верифицированы в рамках Digital Product Passport.
        </p>
      </CardContent>
    </Card>
  );
}
