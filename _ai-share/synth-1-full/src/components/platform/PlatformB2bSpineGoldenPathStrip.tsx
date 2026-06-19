'use client';

import Link from 'next/link';
import { buildPlatformB2bHubSession } from '@/lib/b2b/platform-b2b-hub';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { cn } from '@/lib/utils';

export type PlatformB2bSpineStepId =
  | 'hub'
  | 'marketroom'
  | 'partners'
  | 'shop-showroom'
  | 'matrix'
  | 'checkout'
  | 'publish';

type Props = {
  collectionId?: string;
  orderId?: string;
  activeStep?: PlatformB2bSpineStepId;
  testIdPrefix?: string;
};

const STEPS: { id: PlatformB2bSpineStepId; label: string }[] = [
  { id: 'hub', label: 'Hub' },
  { id: 'marketroom', label: 'Marketroom' },
  { id: 'partners', label: 'Partners' },
  { id: 'shop-showroom', label: 'Showroom' },
  { id: 'matrix', label: 'Matrix' },
  { id: 'checkout', label: 'Checkout' },
  { id: 'publish', label: 'Publish' },
];

export function PlatformB2bSpineGoldenPathStrip({
  collectionId,
  orderId,
  activeStep,
  testIdPrefix = 'platform-b2b-spine',
}: Props) {
  const session = buildPlatformB2bHubSession({ collectionId, orderId });

  const hrefFor = (id: PlatformB2bSpineStepId): string => {
    if (id === 'hub') return session.hubHref;
    if (id === 'marketroom') return session.marketroomShowcaseHref;
    if (id === 'partners') return session.partnersDirectoryHref;
    if (id === 'shop-showroom') return session.shopShowroomHref;
    if (id === 'matrix') return session.shopMatrixHref;
    if (id === 'checkout') return session.buyPathHref;
    return session.brandPublishHref;
  };

  return (
    <div
      className={hubGadget.goldenPath}
      data-testid={`${testIdPrefix}-golden-path-strip`}
    >
      {STEPS.map((step, index) => (
        <span key={step.id} className="contents">
          {index > 0 ? (
            <span className={hubGadget.goldenSep} aria-hidden>
              ·
            </span>
          ) : null}
          <Link
            href={hrefFor(step.id)}
            className={cn(hubGadget.goldenLink, activeStep === step.id && 'font-bold underline')}
            data-testid={`${testIdPrefix}-golden-${step.id}-link`}
          >
            {step.label}
          </Link>
        </span>
      ))}
    </div>
  );
}
