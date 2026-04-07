'use client';

import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { buildPackRuleRow } from '@/lib/fashion/pack-rules-rollup';
import { Package } from 'lucide-react';

type Props = { product: Product };

export function ProductB2BMerchStrip({ product }: Props) {
  const r = buildPackRuleRow(product);
  const has =
    r.moq != null ||
    r.casePack != null ||
    r.leadWeeks != null ||
    r.incoterm.trim().length > 0 ||
    r.shipFrom.trim().length > 0;
  if (!has) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 text-xs">
      <Package className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground font-medium">B2B / закупка:</span>
      {r.moq != null && (
        <Badge variant="outline" className="font-mono text-[10px]">
          MOQ {r.moq}
        </Badge>
      )}
      {r.casePack != null && (
        <Badge variant="outline" className="font-mono text-[10px]">
          короб {r.casePack}
        </Badge>
      )}
      {r.leadWeeks != null && (
        <Badge variant="outline" className="font-mono text-[10px]">
          lead {r.leadWeeks} нед.
        </Badge>
      )}
      {r.incoterm && (
        <Badge variant="secondary" className="text-[10px]">
          {r.incoterm}
        </Badge>
      )}
      {r.shipFrom && <span className="text-muted-foreground">из {r.shipFrom}</span>}
    </div>
  );
}
