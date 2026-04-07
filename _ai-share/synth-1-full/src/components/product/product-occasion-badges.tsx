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
    <div className="flex flex-wrap gap-1.5 mt-3">
      <div className="flex items-center gap-1 mr-1 text-[10px] text-muted-foreground uppercase font-semibold">
        <MapPin className="h-3 w-3" />
        Куда надеть:
      </div>
      {occasions.map(o => (
        <Badge 
          key={o} 
          variant="secondary" 
          className="text-[10px] font-normal px-2 py-0 border-primary/20 bg-primary/5"
        >
          {OCCASION_LABELS[o]}
        </Badge>
      ))}
    </div>
  );
}
