'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { deriveSustainabilityBreakdown } from '@/lib/fashion/sustainability-score';
import { ROUTES } from '@/lib/routes';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = { product: Product; className?: string };

const tierStyle: Record<string, string> = {
  high: 'border-emerald-200 bg-emerald-50/60',
  mid: 'border-amber-200 bg-amber-50/50',
  low: 'border-border-default bg-muted/40',
  unknown: 'border-dashed border-muted bg-muted/20',
};

export function ProductSustainabilityStrip({ product, className }: Props) {
  const b = deriveSustainabilityBreakdown(product);
  if (b.score === 0 && (product.sustainability?.length ?? 0) === 0) return null;

  return (
    <div className={cn('mt-3 rounded-lg border p-3 text-sm', tierStyle[b.tier], className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Leaf
          className={cn(
            'h-4 w-4',
            b.tier === 'high' ? 'text-emerald-600' : 'text-muted-foreground'
          )}
        />
        <span className="font-medium">Устойчивость (эвристика)</span>
        <Badge variant="secondary" className="font-mono text-xs">
          {b.score}/100
        </Badge>
        <Badge variant="outline" className="text-[10px] capitalize">
          {b.tier}
        </Badge>
        <Link
          href={ROUTES.client.sustainabilityExplorer}
          className="ml-auto text-[11px] text-muted-foreground underline hover:text-foreground"
        >
          Все товары по eco-сигналам
        </Link>
      </div>
      <p className="mt-2 text-xs leading-snug text-muted-foreground">{b.summary}</p>
    </div>
  );
}
