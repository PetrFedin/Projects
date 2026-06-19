'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buildOrderSectionCommsMessagesHref } from '@/lib/platform-core-comms-section-groups';
import { buildSupplierOrderCommsSession } from '@/lib/b2b/supplier-order-comms';

type Props = {
  collectionId: string;
  articleId: string;
  orderId: string;
};

/** Domain-event push honesty: procurement/forecast → brand order chat + entity threads. */
export function SupplierCommsBrandPushStrip({ collectionId, articleId, orderId }: Props) {
  const session = buildSupplierOrderCommsSession({ collectionId, articleId, orderId });
  const brandChatHref = buildOrderSectionCommsMessagesHref({
    roleId: 'supplier',
    orderId,
    collectionId,
    sectionId: 'sup-cm-cabinet',
    pillarId: 'comms',
  });

  return (
    <div
      className="border-border-subtle flex flex-wrap items-center gap-2 rounded-md border bg-bg-surface2/60 px-3 py-2 text-xs"
      data-testid="sup-cm-cabinet-brand-push-strip"
    >
      <Badge variant="outline" className="text-[9px] uppercase">
        Push notify
      </Badge>
      <span className="text-text-secondary">
        SLA/forecast bump → системное сообщение в чат заказа + SSE inbox.
      </span>
      <Button size="sm" variant="outline" className="h-7 text-[10px]" asChild>
        <Link href={brandChatHref} data-testid="sup-cm-cabinet-brand-push-chat-link">
          Чат бренду
        </Link>
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px]" asChild>
        <Link href={session.entitiesHref} data-testid="sup-cm-cabinet-brand-push-entities-link">
          Entity threads
        </Link>
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px]" asChild>
        <Link href={session.supplyTabHref} data-testid="sup-cm-cabinet-brand-push-supply-link">
          MRP supply
        </Link>
      </Button>
    </div>
  );
}
