'use client';

import Link from 'next/link';
import { buildShopB2bPartnersSession } from '@/lib/b2b/shop-b2b-partners-workspace';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { cn } from '@/lib/utils';

export type ShopB2bPartnersGoldenPathStepId =
  | 'roster'
  | 'discover'
  | 'rep'
  | 'showroom'
  | 'matrix'
  | 'tracking';

type Props = {
  collectionId?: string;
  orderId?: string;
  activeStep?: ShopB2bPartnersGoldenPathStepId;
};

const STEPS: { id: ShopB2bPartnersGoldenPathStepId; label: string }[] = [
  { id: 'roster', label: 'Roster' },
  { id: 'discover', label: 'Discover' },
  { id: 'rep', label: 'Rep' },
  { id: 'showroom', label: 'Showroom' },
  { id: 'matrix', label: 'Matrix' },
  { id: 'tracking', label: 'Tracking' },
];

export function ShopB2bPartnersGoldenPathStrip({ collectionId, orderId, activeStep }: Props) {
  const session = buildShopB2bPartnersSession({ collectionId, orderId });

  const hrefFor = (id: ShopB2bPartnersGoldenPathStepId): string => {
    if (id === 'roster') return session.rosterHref;
    if (id === 'discover') return session.discoverPageHref;
    if (id === 'rep') return session.repHref;
    if (id === 'showroom') return session.shopShowroomHref;
    if (id === 'matrix') return session.shopMatrixHref;
    return session.orderCommsHref;
  };

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-b2b-partners-golden-path-strip">
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
            data-testid={`shop-b2b-partners-golden-${step.id}-link`}
          >
            {step.label}
          </Link>
        </span>
      ))}
    </div>
  );
}

export function shopB2bPartnersGoldenPathStepFromFeature(
  featureId: string | null | undefined
): ShopB2bPartnersGoldenPathStepId | undefined {
  if (featureId === 'roster') return 'roster';
  if (featureId === 'discover') return 'discover';
  if (featureId === 'rep') return 'rep';
  return undefined;
}
