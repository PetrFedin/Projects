'use client';

import Link from 'next/link';
import { buildShopCollaborativeOrderSession } from '@/lib/b2b/shop-collaborative-order';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { cn } from '@/lib/utils';

export type ShopCollaborativeGoldenPathStepId =
  | 'session'
  | 'approvals'
  | 'comms'
  | 'matrix'
  | 'working-order'
  | 'tracking';

type Props = {
  orderId?: string;
  collectionId?: string;
  activeStep?: ShopCollaborativeGoldenPathStepId;
};

const STEPS: { id: ShopCollaborativeGoldenPathStepId; label: string }[] = [
  { id: 'session', label: 'Session' },
  { id: 'approvals', label: 'Approvals' },
  { id: 'comms', label: 'Comms' },
  { id: 'matrix', label: 'Matrix' },
  { id: 'working-order', label: 'Working order' },
  { id: 'tracking', label: 'Tracking' },
];

export function ShopCollaborativeOrderGoldenPathStrip({
  orderId,
  collectionId,
  activeStep,
}: Props) {
  const session = buildShopCollaborativeOrderSession({ orderId, collectionId });

  const hrefFor = (id: ShopCollaborativeGoldenPathStepId): string => {
    if (id === 'session') return session.sessionHref;
    if (id === 'approvals') return session.approvalsHref;
    if (id === 'comms') return session.commsHref;
    if (id === 'matrix') return session.matrixHref;
    if (id === 'working-order') return session.workingOrderHref;
    return session.trackingHref;
  };

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-collaborative-order-golden-path-strip">
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
            data-testid={`shop-collaborative-golden-${step.id}-link`}
          >
            {step.label}
          </Link>
        </span>
      ))}
    </div>
  );
}

export function shopCollaborativeGoldenPathStepFromFeature(
  featureId: string | null | undefined
): ShopCollaborativeGoldenPathStepId | undefined {
  if (featureId === 'session') return 'session';
  if (featureId === 'approvals') return 'approvals';
  if (featureId === 'comms') return 'comms';
  return undefined;
}
