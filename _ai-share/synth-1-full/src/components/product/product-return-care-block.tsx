'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { buildReturnPolicyHint } from '@/lib/fashion/return-policy-hint';
import { careSymbolsForProduct } from '@/lib/fashion/care-symbols';
import { detectCareCompositionFriction } from '@/lib/fashion/care-composition-friction';
import { ROUTES } from '@/lib/routes';
import { PackageOpen, Droplets, AlertTriangle } from 'lucide-react';

type Props = { product: Product };

export function ProductReturnCareBlock({ product }: Props) {
  const hint = buildReturnPolicyHint(product);
  const care = careSymbolsForProduct(product);
  const friction = detectCareCompositionFriction(product);

  return (
    <Card className="mt-4 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <PackageOpen className="h-4 w-4" />
          Возврат и уход
        </CardTitle>
        <CardDescription className="text-xs">Демо-тексты; юридический блок подключается из CMS / OMS.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Возврат</p>
          <p className="leading-snug">{hint.summary}</p>
          {hint.daysHint != null && (
            <p className="text-xs text-muted-foreground mt-1">Окно: до {hint.daysHint} дн.</p>
          )}
          {hint.restrictions.map((r) => (
            <p key={r} className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              {r}
            </p>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Droplets className="h-3.5 w-3.5" />
              Пиктограммы
            </p>
            <Link href={ROUTES.client.careSymbols} className="text-[11px] text-primary hover:underline">
              Справочник
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {care.map((c) => (
              <Badge key={c.id} variant="secondary" className="text-[10px] font-normal">
                {c.short}: {c.label}
              </Badge>
            ))}
          </div>
        </div>
        {friction && (
          <div className="rounded-md border border-amber-500/40 bg-amber-500/5 px-3 py-2 text-xs flex gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>{friction}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
