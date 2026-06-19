'use client';

import Link from 'next/link';
import type { PlatformCoreDemoContext } from '@/lib/platform-core-hub-matrix';
import { factoryMaterialsProcurementHrefForDemo } from '@/lib/platform-core-hub-matrix';
import { buildSupplierProcurementSession } from '@/lib/fashion/supplier-procurement-workspace';
import { manufacturerHandoffFeatureHref } from '@/lib/production/manufacturer-handoff-queue';
import { shopB2bTrackingOrderHref } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  demo: PlatformCoreDemoContext;
  orderId?: string;
};

/** Supplier empty CO · mfr handoff + procurement + forecast spine. */
export function SupEmptyCoPeerStrip({ demo, orderId }: Props) {
  const resolvedOrderId = orderId?.trim() || demo.demoOrderId;
  const session = buildSupplierProcurementSession({
    collectionId: demo.collectionId,
    articleId: demo.demoArticleId,
    orderId: resolvedOrderId,
    factoryId: demo.factoryId,
  });
  const mfrHandoffHref = manufacturerHandoffFeatureHref('handoff', {
    factoryId: demo.factoryId,
    collectionId: demo.collectionId,
    orderId: resolvedOrderId,
  });
  const procurementHref = factoryMaterialsProcurementHrefForDemo(
    { ...demo, demoOrderId: resolvedOrderId },
    { role: 'supplier' }
  );

  return (
    <div className={hubGadget.goldenPath} data-testid="sup-empty-co-peer-strip">
      <Link href={mfrHandoffHref} data-testid="sup-empty-co-mfr-handoff-link" className={hubGadget.goldenLink}>
        Mfr handoff
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={procurementHref} data-testid="sup-empty-co-procurement-link" className={hubGadget.goldenLink}>
        Procurement
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.forecastHref} data-testid="sup-empty-co-forecast-link" className={hubGadget.goldenLink}>
        Forecast
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={resolvedOrderId ? shopB2bTrackingOrderHref(resolvedOrderId) : session.shopTrackingHref}
        data-testid="sup-empty-co-tracking-link"
        className={hubGadget.goldenLink}
      >
        Tracking
      </Link>
    </div>
  );
}
