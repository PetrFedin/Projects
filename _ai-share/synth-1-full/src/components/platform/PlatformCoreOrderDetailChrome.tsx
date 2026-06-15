'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import type { CoreChainRoleId } from '@/lib/platform-core-hub-matrix';
import { usePlatformCoreHashScroll } from '@/hooks/use-platform-core-hash-scroll';
import { usePlatformCoreOrderDetailPillarId } from '@/hooks/use-platform-core-order-detail-pillar';
import { PlatformCoreChromeShell } from '@/components/platform/PlatformCoreChromeShell';
import { PlatformCoreContextBar } from '@/components/platform/PlatformCoreContextBar';
import { PlatformCoreRolePillarStrip } from '@/components/platform/PlatformCoreRolePillarStrip';
import { RolePillarCrossRoleLinks } from '@/components/platform/RolePillarCrossRoleLinks';
import { buildOrderSectionCommsMessagesHref } from '@/lib/platform-core-comms-section-groups';
import {
  getPlatformCoreCollectionLabel,
  getPlatformCoreDemoByOrderId,
} from '@/lib/platform-core-hub-matrix';

type Props = {
  orderId: string;
  variant: 'shop' | 'brand';
  children?: ReactNode;
};

function PlatformCoreOrderDetailChromeInner({ orderId, variant, children }: Props) {
  const highlightRole: CoreChainRoleId = variant;
  const collectionId = getPlatformCoreDemoByOrderId(orderId).collectionId;
  const entityLabel = `Оптовый заказ · ${getPlatformCoreCollectionLabel(collectionId)}`;
  const pillarId = usePlatformCoreOrderDetailPillarId();

  usePlatformCoreHashScroll(['production-handoff', 'production-dossier', 'order-production']);

  return (
    <div data-testid="platform-core-order-detail-chrome" className="space-y-3">
      <PlatformCoreContextBar
        roleId={highlightRole}
        pillarId={pillarId}
        entityLabel={entityLabel}
        orderId={orderId}
        showDemoIdStrip={false}
      />
      <PlatformCoreRolePillarStrip roleId={highlightRole} activePillarId={pillarId} />
      {children}
      <div data-testid={variant === 'shop' ? 'shop-co-detail-cross-links' : undefined}>
        <RolePillarCrossRoleLinks
          roleId={highlightRole}
          pillarId={pillarId}
          variant="compact"
        />
      </div>
      {variant === 'shop' ? (
        <div className="border-border-subtle flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-xs">
          <Link
            href={buildOrderSectionCommsMessagesHref({
              roleId: 'shop',
              orderId,
              collectionId,
              sectionId: 'shop-co-detail',
            })}
            data-testid="shop-co-detail-footer-chat-link"
            data-audit-legacy="shop-order-detail-chat-link"
            className="text-accent-primary font-medium hover:underline"
          >
            Чат по заказу
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function PlatformCoreOrderDetailChrome({ orderId, children, ...props }: Props) {
  const collectionId = getPlatformCoreDemoByOrderId(orderId).collectionId;
  return (
    <PlatformCoreChromeShell collectionId={collectionId}>
      <PlatformCoreOrderDetailChromeInner orderId={orderId} {...props}>
        {children}
      </PlatformCoreOrderDetailChromeInner>
    </PlatformCoreChromeShell>
  );
}
