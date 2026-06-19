'use client';

import Link from 'next/link';
import {
  factoryHandoffQueueHrefForDemo,
  factoryMaterialsProcurementHrefForDemo,
} from '@/lib/platform-core-hub-matrix';
import type { PlatformCoreDemoContext } from '@/lib/platform-core-hub-matrix';
import { shopB2bTrackingOrderHref } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  demo: PlatformCoreDemoContext;
  orderId?: string;
};

/** Mfr materials procurement — BOM×PO + WMS + handoff/tracking peers. */
export function ManufacturerMaterialsBomPoPeerStrip({ demo, orderId }: Props) {
  const oid = orderId?.trim() || demo.demoOrderId;
  const demoWithOrder = { ...demo, demoOrderId: oid };
  const procurementHref = factoryMaterialsProcurementHrefForDemo(demoWithOrder, {
    role: 'manufacturer',
  });
  const handoffHref = factoryHandoffQueueHrefForDemo(demoWithOrder);

  return (
    <div
      className={hubGadget.goldenPath}
      data-testid="mfr-op-materials-bom-po-peer-strip"
    >
      <Link
        href={procurementHref}
        data-testid="mfr-op-materials-procurement-link"
        className={hubGadget.goldenLink}
      >
        Закупка BOM×PO
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={handoffHref}
        data-testid="mfr-op-materials-handoff-queue-link"
        className={hubGadget.goldenLink}
      >
        Очередь PO
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={shopB2bTrackingOrderHref(oid)}
        data-testid="mfr-op-materials-shop-tracking-link"
        className={hubGadget.goldenLink}
      >
        Shop tracking
      </Link>
    </div>
  );
}
