'use client';

import Link from 'next/link';
import { brandProductionOpsFeatureHref } from '@/lib/brand-production/brand-production-handoff';
import {
  brandB2bOrderHandoffContextHref,
  brandB2bOrderHref,
  shopB2bTrackingOrderHref,
} from '@/lib/routes';
import { factoryHandoffQueueHrefForDemo } from '@/lib/platform-core-hub-matrix';
import type { PlatformCoreDemoContext } from '@/lib/platform-core-hub-matrix';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  demo: PlatformCoreDemoContext;
  contextOrderId?: string;
};

/** Brand OP registry — production filters + QC/handoff/tracking peers. */
export function BrandOpRegistryProductionStrip({ demo, contextOrderId }: Props) {
  const orderId = contextOrderId?.trim() || demo.demoOrderId;
  const handoffQueueHref = factoryHandoffQueueHrefForDemo({ ...demo, demoOrderId: orderId });

  return (
    <div
      className={hubGadget.goldenPath + ' mb-3'}
      data-testid="brand-op-registry-production-peer-strip"
    >
      {orderId ? (
        <>
          <Link
            href={brandB2bOrderHref(orderId)}
            data-testid="brand-op-registry-order-link"
            className={hubGadget.goldenLink}
          >
            Карточка
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
          <Link
            href={brandB2bOrderHandoffContextHref(orderId)}
            data-testid="brand-op-registry-handoff-link"
            className={hubGadget.goldenLink}
          >
            Handoff
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
          <Link
            href={brandProductionOpsFeatureHref(orderId, 'qc-gate')}
            data-testid="brand-op-registry-qc-gate-link"
            className={hubGadget.goldenLink}
          >
            QC gate
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
          <Link
            href={brandProductionOpsFeatureHref(orderId, 'cut-ticket')}
            data-testid="brand-op-registry-cut-ticket-link"
            className={hubGadget.goldenLink}
          >
            Cut ticket
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
          <Link
            href={shopB2bTrackingOrderHref(orderId)}
            data-testid="brand-op-registry-shop-tracking-link"
            className={hubGadget.goldenLink}
          >
            Shop tracking
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
        </>
      ) : null}
      <Link
        href={handoffQueueHref}
        data-testid="brand-op-registry-factory-queue-link"
        className={hubGadget.goldenLink}
      >
        Очередь цеха
      </Link>
    </div>
  );
}
