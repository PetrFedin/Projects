'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';

/** Wave 23: chip «B2B: N заказов · ₽X» в header W2 workspace. */
export function Workshop2B2bWorkspaceHeaderChip({
  collectionId,
  articleId,
}: {
  collectionId: string;
  articleId: string;
}) {
  const [labelRu, setLabelRu] = useState<string | null>(null);

  useEffect(() => {
    void fetch(`/api/shop/b2b/cart/lines?articleId=${encodeURIComponent(articleId)}`)
      .then((r) => r.json())
      .then((json: { ok?: boolean; labelRu?: string; orderCount?: number }) => {
        if (json.ok && (json.orderCount ?? 0) > 0) setLabelRu(json.labelRu ?? null);
        else setLabelRu(null);
      })
      .catch(() => setLabelRu(null));
  }, [collectionId, articleId]);

  if (!labelRu) return null;

  return (
    <Badge
      variant="secondary"
      className="text-[10px] font-semibold"
      data-testid="workshop2-b2b-header-chip"
    >
      <Link href={ROUTES.shop.b2bOrders ?? '/shop/b2b/orders'} className="hover:underline">
        {labelRu}
      </Link>
    </Badge>
  );
}
