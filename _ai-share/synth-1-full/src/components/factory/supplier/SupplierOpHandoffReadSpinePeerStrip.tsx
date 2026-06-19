'use client';

import Link from 'next/link';
import { buildSupplierProcurementSession } from '@/lib/fashion/supplier-procurement-workspace';
import { manufacturerHandoffFeatureHref } from '@/lib/production/manufacturer-handoff-queue';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  articleId: string;
  orderId?: string;
  factoryId?: string;
};

/** Handoff read strip · manufacturer queue + forecast + shop downstream. */
export function SupplierOpHandoffReadSpinePeerStrip({
  collectionId,
  articleId,
  orderId,
  factoryId,
}: Props) {
  const session = buildSupplierProcurementSession({ collectionId, articleId, orderId, factoryId });
  const mfrHandoffHref = manufacturerHandoffFeatureHref('handoff', {
    factoryId: factoryId ?? session.factoryId,
    collectionId,
    orderId,
  });

  return (
    <div className={hubGadget.goldenPath} data-testid="sup-op-handoff-read-spine-peer-strip">
      <Link href={mfrHandoffHref} data-testid="sup-op-handoff-read-mfr-queue-link" className={hubGadget.goldenLink}>
        Mfr queue
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.forecastHref} data-testid="sup-op-handoff-read-forecast-link" className={hubGadget.goldenLink}>
        Forecast
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.shopTrackingHref} data-testid="sup-op-handoff-read-tracking-link" className={hubGadget.goldenLink}>
        Tracking
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.orderTabHref} data-testid="sup-op-handoff-read-order-tab-link" className={hubGadget.goldenLink}>
        Order tab
      </Link>
    </div>
  );
}
