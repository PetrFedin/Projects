'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buildOrderSectionCommsMessagesHref } from '@/lib/platform-core-comms-section-groups';
import { buildSupplierProcurementSession } from '@/lib/fashion/supplier-procurement-workspace';

type Props = {
  collectionId: string;
  articleId: string;
  orderId: string;
};

/** Honest copy: PATCH material-request → brand order chat + domain event bump. */
export function SupplierProcurementBrandNotifyStrip({ collectionId, articleId, orderId }: Props) {
  const session = buildSupplierProcurementSession({ collectionId, articleId, orderId });
  const brandChatHref = buildOrderSectionCommsMessagesHref({
    roleId: 'supplier',
    orderId,
    collectionId,
    sectionId: 'sup-op-procurement',
    pillarId: 'order_production',
  });

  return (
    <div
      className="border-border-subtle flex flex-wrap items-center gap-2 rounded-md border bg-bg-surface2/60 px-3 py-2 text-xs"
      data-testid="sup-op-procurement-brand-push-strip"
    >
      <Badge variant="outline" className="text-[9px] uppercase">
        Brand notify
      </Badge>
      <span className="text-text-secondary">
        Подтверждение BOM → системное сообщение в чат заказа + SSE registry/chain bump.
      </span>
      <Button size="sm" variant="outline" className="h-7 text-[10px]" asChild>
        <Link href={brandChatHref} data-testid="sup-op-procurement-brand-push-chat-link">
          Чат бренду
        </Link>
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px]" asChild>
        <Link href={session.entitiesHref} data-testid="sup-op-procurement-brand-push-entities-link">
          Entity threads
        </Link>
      </Button>
    </div>
  );
}
