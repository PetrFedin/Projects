'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Rollup = {
  collectionRiskLevel: 'Low' | 'Medium' | 'High';
  avgSupplyScore: number;
  totalBlockedGates: number;
  hintRu: string;
};

export function Workshop2AssortmentRiskChip({
  collectionId,
  className,
}: {
  collectionId: string;
  className?: string;
}) {
  const [rollup, setRollup] = useState<Rollup | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch(
      `/api/workshop2/collections/${encodeURIComponent(collectionId)}/assortment-risk`
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.rollup) setRollup(data.rollup as Rollup);
      })
      .catch(() => {
        if (!cancelled) setRollup(null);
      });
    return () => {
      cancelled = true;
    };
  }, [collectionId]);

  if (!rollup) return null;

  const variant =
    rollup.collectionRiskLevel === 'High'
      ? 'destructive'
      : rollup.collectionRiskLevel === 'Medium'
        ? 'secondary'
        : 'outline';

  return (
    <Badge
      variant={variant}
      className={cn('text-[10px] font-medium', className)}
      title={rollup.hintRu}
      data-testid="workshop2-assortment-risk-chip"
    >
      Риск ассортимента · {rollup.avgSupplyScore}/100
      {rollup.totalBlockedGates > 0 ? ` · gates ${rollup.totalBlockedGates}` : ''}
    </Badge>
  );
}
