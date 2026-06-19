'use client';

import Link from 'next/link';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { PLATFORM_CORE_B2B_BASE } from '@/lib/platform-core-mode-surfaces';
import { ROUTES } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
};

/** W2 publish strip · syndication + release gate chain. */
export function BrandScPublishReleasePeerStrip({ collectionId }: Props) {
  const syndicationHref = `${ROUTES.brand.launchReadiness}?${PILLAR_CAPABILITY_FEATURE_PARAM}=syndication&collection=${encodeURIComponent(collectionId)}`;
  const releaseGateHref = `${ROUTES.brand.launchReadiness}?${PILLAR_CAPABILITY_FEATURE_PARAM}=checklist&collection=${encodeURIComponent(collectionId)}`;
  const showroomPublishHref = `${ROUTES.brand.launchReadiness}?${PILLAR_CAPABILITY_FEATURE_PARAM}=showroom-publish&collection=${encodeURIComponent(collectionId)}`;
  const linesheetsHref = `/brand/linesheets?collection=${encodeURIComponent(collectionId)}`;
  const platformHubHref = `${PLATFORM_CORE_B2B_BASE}?collection=${encodeURIComponent(collectionId)}&${PILLAR_CAPABILITY_FEATURE_PARAM}=hub`;
  const matrixHref = `${ROUTES.shop.b2bMatrix}?collection=${encodeURIComponent(collectionId)}`;
  const checkoutHref = `${ROUTES.shop.b2bCheckout}?collection=${encodeURIComponent(collectionId)}`;

  return (
    <div className={hubGadget.goldenPath} data-testid="brand-sc-publish-release-peer-strip">
      <Link href={releaseGateHref} data-testid="brand-sc-publish-release-gate-link" className={hubGadget.goldenLink}>
        Checklist
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={showroomPublishHref} data-testid="brand-sc-publish-showroom-tab-link" className={hubGadget.goldenLink}>
        Showroom publish
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={syndicationHref} data-testid="brand-sc-publish-syndication-link" className={hubGadget.goldenLink}>
        Syndication
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={linesheetsHref} data-testid="brand-sc-publish-linesheets-link" className={hubGadget.goldenLink}>
        Linesheets
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={platformHubHref} data-testid="brand-sc-publish-platform-hub-link" className={hubGadget.goldenLink}>
        Platform B2B
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={matrixHref} data-testid="brand-sc-publish-shop-matrix-link" className={hubGadget.goldenLink}>
        Shop matrix
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={checkoutHref} data-testid="brand-sc-publish-shop-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
    </div>
  );
}
