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

/** BOM×PO progress · handoff/forecast/tracking spine. */
export function SupOpBomPoChainPeerStrip({ collectionId, articleId, orderId, factoryId }: Props) {
  const session = buildSupplierProcurementSession({ collectionId, articleId, orderId, factoryId });
  const mfrQueueHref = manufacturerHandoffFeatureHref('handoff', {
    factoryId: factoryId ?? session.factoryId,
    collectionId,
    orderId,
  });

  return (
    <div className={hubGadget.goldenPath} data-testid="sup-op-bom-po-chain-peer-strip">
      <Link href={mfrQueueHref} data-testid="sup-op-bom-po-mfr-queue-link" className={hubGadget.goldenLink}>
        Mfr queue
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.forecastHref} data-testid="sup-op-bom-po-forecast-link" className={hubGadget.goldenLink}>
        Forecast
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.shopTrackingHref} data-testid="sup-op-bom-po-tracking-link" className={hubGadget.goldenLink}>
        Tracking
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.handoffHref} data-testid="sup-op-bom-po-handoff-link" className={hubGadget.goldenLink}>
        Handoff read
      </Link>
    </div>
  );
}
