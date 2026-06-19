'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { shopB2bTrackingOrderHref } from '@/lib/routes';
import { buildSupplierOrderCommsSession } from '@/lib/b2b/supplier-order-comms';

type Props = {
  collectionId: string;
  articleId: string;
  orderId: string;
};

/** Logistics peer без map overlay — shop tracking + delivery confirm entry. */
export function SupplierCalendarLogisticsPeerStrip({ collectionId, articleId, orderId }: Props) {
  const session = buildSupplierOrderCommsSession({ collectionId, articleId, orderId });

  return (
    <div
      className="border-border-subtle flex flex-wrap items-center gap-2 rounded-md border bg-bg-surface2/60 px-3 py-2 text-xs"
      data-testid="sup-cm-calendar-logistics-peer-strip"
    >
      <Badge variant="outline" className="text-[9px] uppercase">
        Logistics peer
      </Badge>
      <span className="text-text-secondary">
        ETA/map overlay P2 — сейчас peer: shop tracking + delivery confirm в comms.
      </span>
      <Button size="sm" variant="outline" className="h-7 text-[10px]" asChild>
        <Link href={shopB2bTrackingOrderHref(orderId)} data-testid="sup-cm-calendar-shop-tracking-link">
          Shop tracking
        </Link>
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px]" asChild>
        <Link href={session.messagesHref} data-testid="sup-cm-calendar-delivery-comms-link">
          Delivery comms
        </Link>
      </Button>
    </div>
  );
}
