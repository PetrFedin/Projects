'use client';

import Link from 'next/link';
import { buildSupplierProcurementSession } from '@/lib/fashion/supplier-procurement-workspace';
import { buildOrderSectionCommsMessagesHref } from '@/lib/platform-core-comms-section-groups';
import { shopB2bTrackingOrderHref } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  articleId: string;
  orderId?: string;
};

/** sup-op-chain workspace · brand chat + tracking + forecast. */
export function SupOpChainWorkspacePeerStrip({ collectionId, articleId, orderId }: Props) {
  const session = buildSupplierProcurementSession({ collectionId, articleId, orderId });
  const brandChatHref =
    orderId?.trim()
      ? buildOrderSectionCommsMessagesHref({
          roleId: 'supplier',
          orderId,
          collectionId,
          sectionId: 'sup-op-chain',
          pillarId: 'order_production',
        })
      : session.entitiesHref;

  return (
    <div className={hubGadget.goldenPath} data-testid="sup-op-chain-workspace-peer-strip">
      <Link href={brandChatHref} data-testid="sup-op-chain-peer-brand-chat-link" className={hubGadget.goldenLink}>
        Brand chat
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={orderId ? shopB2bTrackingOrderHref(orderId) : session.shopTrackingHref}
        data-testid="sup-op-chain-peer-tracking-link"
        className={hubGadget.goldenLink}
      >
        Tracking
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.forecastHref} data-testid="sup-op-chain-peer-forecast-link" className={hubGadget.goldenLink}>
        Forecast
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.supplyHref} data-testid="sup-op-chain-peer-supply-link" className={hubGadget.goldenLink}>
        Supply
      </Link>
    </div>
  );
}
