'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import MessagesPage from '@/components/user/messages/MessagesPage';
import { PlatformCoreCommsWorkspaceExtras } from '@/components/platform/PlatformCoreCommsWorkspaceExtras';
import { PlatformCoreListChrome } from '@/components/platform/PlatformCoreListChrome';
import { CommsNotificationCenterStrip } from '@/components/platform/CommsNotificationCenterStrip';
import { usePlatformCoreCommsThreadsSource } from '@/hooks/use-platform-core-comms-threads-source';
import { useShopCoreBuyerId } from '@/hooks/use-shop-core-buyer-id';
import { useSpineActiveWholesaleOrderId } from '@/hooks/use-spine-active-wholesale-order-id';
import { usePlatformCoreDemoContext } from '@/components/platform/usePlatformCoreChainOverview';
import {
  isPlatformCoreEmptyChainCollection,
  resolvePageCollectionId,
} from '@/lib/platform-core-hub-matrix';
import { resolvePlatformCoreCabinetOrderId } from '@/lib/platform-core-spine-active-order-fallback';
import { ROUTES } from '@/lib/routes';
import { PLATFORM_CORE_MESSAGES_UNAVAILABLE_RU } from '@/lib/platform-core-user-messages';

function ShopMessagesNotificationStrip() {
  const searchParams = useSearchParams();
  const collectionId = resolvePageCollectionId({ collection: searchParams.get('collection') });
  const demo = usePlatformCoreDemoContext();
  const { buyerId } = useShopCoreBuyerId();
  const emptyChain = isPlatformCoreEmptyChainCollection(collectionId);
  const orderFromUrl =
    searchParams.get('order')?.trim() ||
    searchParams.get('orderId')?.trim() ||
    searchParams.get('wholesaleOrderId')?.trim() ||
    '';
  const w2Fallback = demo.demoOrderId.startsWith('__') ? '' : demo.demoOrderId;
  const { activeOrderId } = useSpineActiveWholesaleOrderId({
    fallbackOrderId: w2Fallback,
    collectionId,
    resolveFrom: ['w2_registry', 'allocation', 'operational'],
    actorRole: 'shop',
    buyerId,
    enabled: !emptyChain,
  });
  const orderId = resolvePlatformCoreCabinetOrderId(orderFromUrl || activeOrderId, demo.demoOrderId);

  if (emptyChain || !orderId) return null;

  return (
    <div className="mb-3" data-testid="shop-cm-workspace-notification-bar">
      <CommsNotificationCenterStrip
        variant="shop"
        collectionId={collectionId}
        orderId={orderId}
        orderScoped
      />
    </div>
  );
}

function ShopMessagesCoreContent() {
  const source = usePlatformCoreCommsThreadsSource('/api/shop/messages/threads');
  const searchParams = useSearchParams();
  const collectionId = resolvePageCollectionId({ collection: searchParams.get('collection') });

  if (source === 'loading') {
    return <div className="text-text-secondary p-6 text-sm">Загрузка сообщений…</div>;
  }

  if (source === 'memory') {
    return (
      <div
        className="mx-0 rounded-lg border border-amber-200 bg-amber-50/90 p-6 text-sm text-amber-950"
        data-testid="shop-messages-core-fail-closed"
        role="alert"
      >
        <p className="font-semibold">Сообщения недоступны</p>
        <p className="text-text-secondary mt-1">{PLATFORM_CORE_MESSAGES_UNAVAILABLE_RU}</p>
        <p className="mt-3">
          <Link
            href={`${ROUTES.shop.b2bOrders}?collection=${encodeURIComponent(collectionId)}`}
            className="text-accent-primary underline"
          >
            Перейти в реестр заказов →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <ShopMessagesNotificationStrip />
      </Suspense>
      <MessagesPage initialRole="shop" slimCore />
    </>
  );
}

export function ShopMessagesCorePage() {
  return (
    <CabinetPageContent maxWidth="5xl" className="space-y-4 px-4 py-6 pb-24 sm:px-6">
      <PlatformCoreListChrome highlightRole="shop" pillarId="comms">
        <PlatformCoreCommsWorkspaceExtras variant="shop" />
        <Suspense
          fallback={<div className="text-text-secondary p-6 text-sm">Загрузка сообщений…</div>}
        >
          <ShopMessagesCoreContent />
        </Suspense>
      </PlatformCoreListChrome>
    </CabinetPageContent>
  );
}
