'use client';

import Link from 'next/link';
import { buildPlatformB2bHubSession } from '@/lib/b2b/platform-b2b-hub';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId?: string;
};

/** Matrix entry · platform B2B + collaborative order peers. */
export function ShopScMatrixEntryCoPeerStrip({ collectionId, orderId }: Props) {
  const session = buildPlatformB2bHubSession({ collectionId, orderId });

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-sc-matrix-entry-co-peer-strip">
      <Link href={session.hubHref} data-testid="shop-sc-matrix-entry-platform-hub-link" className={hubGadget.goldenLink}>
        Platform B2B
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.collaborativeHref} data-testid="shop-sc-matrix-entry-collaborative-link" className={hubGadget.goldenLink}>
        Collaborative
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.replenishmentAtpHref} data-testid="shop-sc-matrix-entry-replenishment-link" className={hubGadget.goldenLink}>
        ATP
      </Link>
    </div>
  );
}
