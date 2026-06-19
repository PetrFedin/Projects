'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { usePlatformCoreDemoContext } from '@/components/platform/usePlatformCoreChainOverview';
import { usePillarSnapshot } from '@/hooks/use-pillar-snapshot';
import { pickOrderProductionSnapshot } from '@/lib/platform-core-pillar-snapshot.types';
import {
  factoryHandoffQueueHrefForDemo,
  getPlatformCoreDemo,
} from '@/lib/platform-core-hub-matrix';
import { resolvePlatformCoreCabinetOrderId } from '@/lib/platform-core-spine-active-order-fallback';
import { useSpineActiveWholesaleOrderId } from '@/hooks/use-spine-active-wholesale-order-id';
import {
  factoryMessagesB2bOrderContextHref,
  factoryProductionOrdersOrderContextHref,
  factoryMessagesRoleHref,
} from '@/lib/routes';

type Props = {
  compact?: boolean;
};

/** Comms hub — unified PO inbox beyond queue snippet max 3. */
export function ManufacturerUnifiedPoInboxStrip({ compact = false }: Props) {
  const demo = usePlatformCoreDemoContext();
  const { collectionId, factoryId, demoOrderId: fallbackOrderId } = demo;
  const w2Fallback = fallbackOrderId.startsWith('__') ? '' : fallbackOrderId;

  const { activeOrderId: orderId } = useSpineActiveWholesaleOrderId({
    fallbackOrderId: w2Fallback,
    collectionId,
    resolveFrom: ['w2_registry', 'handoff', 'allocation'],
    factoryId,
  });

  const cabinetOrderId = resolvePlatformCoreCabinetOrderId(
    orderId,
    getPlatformCoreDemo(collectionId).demoOrderId
  );

  const { snapshot } = usePillarSnapshot({
    collectionId,
    pillarId: 'order_production',
    roleId: 'manufacturer',
    pillarVariant: 'manufacturer',
    wholesaleOrderId: orderId || undefined,
    factoryId,
  });

  const op = pickOrderProductionSnapshot(snapshot);
  const handoffItems = op?.handoffItems ?? [];
  const queueCount = handoffItems.length;
  const handoffQueueHref = factoryHandoffQueueHrefForDemo({ ...demo, demoOrderId: cabinetOrderId });
  const inboxHref = factoryMessagesRoleHref('manufacturer');

  if (queueCount === 0) return null;

  return (
    <div
      className="border-border-subtle flex flex-wrap items-center gap-2 rounded-md border bg-indigo-50/40 px-3 py-2 text-xs"
      data-testid="mfr-cm-unified-po-inbox-strip"
    >
      <Badge variant="outline" className="text-[9px] uppercase">
        PO inbox
      </Badge>
      <span className="text-text-secondary">
        {queueCount} в очереди{compact ? '' : ' — все PO в comms и prod-orders'}.
      </span>
      <Link
        href={handoffQueueHref}
        data-testid="mfr-cm-unified-po-handoff-queue-link"
        className="text-accent-primary font-medium hover:underline"
      >
        Очередь ({queueCount}) →
      </Link>
      {queueCount > 3 ? (
        <Link
          href={factoryProductionOrdersOrderContextHref(cabinetOrderId, { factoryId })}
          data-testid="mfr-cm-unified-po-all-orders-link"
          className="text-accent-primary font-medium hover:underline"
        >
          Все PO →
        </Link>
      ) : null}
      <Link
        href={factoryMessagesB2bOrderContextHref(cabinetOrderId, { role: 'manufacturer' })}
        data-testid="mfr-cm-unified-po-order-chat-link"
        className="text-accent-primary font-medium hover:underline"
      >
        Чат PO
      </Link>
      <Link
        href={inboxHref}
        data-testid="mfr-cm-unified-po-inbox-more"
        className="text-accent-primary font-medium hover:underline"
      >
        Все треды →
      </Link>
    </div>
  );
}
