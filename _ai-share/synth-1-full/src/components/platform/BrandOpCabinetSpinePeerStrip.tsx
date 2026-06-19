'use client';

import Link from 'next/link';
import { buildBrandProductionHandoffSession } from '@/lib/brand-production/brand-production-handoff';
import { brandB2bOrdersProductionRegistryHref } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  orderId: string;
  collectionId: string;
};

/** Brand OP cabinet compact · handoff + QC + tracking + inventory peers. */
export function BrandOpCabinetSpinePeerStrip({ orderId, collectionId }: Props) {
  const session = buildBrandProductionHandoffSession({ orderId, collectionId });

  return (
    <div className={hubGadget.goldenPath} data-testid="brand-op-cabinet-spine-peer-strip">
      <Link href={session.handoffTabHref} data-testid="brand-op-cabinet-handoff-link" className={hubGadget.goldenLink}>
        Handoff
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.qcGateTabHref} data-testid="brand-op-cabinet-qc-gate-link" className={hubGadget.goldenLink}>
        QC gate
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.shopTrackingHref} data-testid="brand-op-cabinet-shop-tracking-link" className={hubGadget.goldenLink}>
        Shop tracking
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.manufacturerOrderCommsHref} data-testid="brand-op-cabinet-mfr-comms-link" className={hubGadget.goldenLink}>
        Factory comms
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={brandB2bOrdersProductionRegistryHref(orderId)}
        data-testid="brand-op-cabinet-production-registry-link"
        className={hubGadget.goldenLink}
      >
        OP registry
      </Link>
    </div>
  );
}
