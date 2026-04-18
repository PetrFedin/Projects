'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { formatDropCountdown, parseProductDrop } from '@/lib/fashion/drop-schedule';
import { Clock } from 'lucide-react';

type Props = { product: Product };

export function ProductDropCountdown({ product }: Props) {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const drop = parseProductDrop(product);

  useEffect(() => {
    if (!drop) return;
    const t = setInterval(() => setNowMs(Date.now()), 30000);
    return () => clearInterval(t);
  }, [drop]);

  if (!drop) return null;

  const text = formatDropCountdown(drop.at, nowMs);
  if (text === 'Уже доступно') return null;

  return (
    <Badge variant="secondary" className="mt-2 gap-1 text-xs font-normal">
      <Clock className="h-3 w-3" />
      {drop.label}: {text}
    </Badge>
  );
}
