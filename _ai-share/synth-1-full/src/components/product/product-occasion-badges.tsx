'use client';

import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { getProductOccasions, OCCASION_LABELS } from '@/lib/fashion/occasion-tagging';
import { MapPin } from 'lucide-react';

type Props = { product: Product };

export function ProductOccasionBadges({ product }: Props) {
  const occasions = getProductOccasions(product);
  if (occasions.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      <div className="mr-1 flex items-center gap-1 text-[10px] font-semibold uppercase text-muted-foreground">
        <MapPin className="h-3 w-3" />
        Куда надеть:
      </div>
      {occasions.map((o) => (
        <Badge
          key={o}
          variant="secondary"
          className="border-primary/20 bg-primary/5 px-2 py-0 text-[10px] font-normal"
        >
          {OCCASION_LABELS[o]}
        </Badge>
      ))}
    </div>
  );
}
