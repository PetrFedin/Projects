'use client';

import dynamic from 'next/dynamic';
import { PlatformCoreOrderDetailChrome } from '@/components/platform/PlatformCoreOrderDetailChrome';
import { useWorkshop2B2bOrderDetail } from '@/hooks/use-workshop2-b2b-order-detail';

const PlatformCoreB2bOrderDetailFacts = dynamic(
  () =>
    import('@/components/platform/PlatformCoreB2bOrderDetailFacts').then((m) => ({
      default: m.PlatformCoreB2bOrderDetailFacts,
    })),
  {
    ssr: false,
    loading: () => (
      <p className="text-text-muted text-sm" data-testid="platform-core-order-detail-facts-loading">
        Загрузка карточки заказа…
      </p>
    ),
  }
);

import { useShopOrderDetailLegacyPillarRedirect } from '@/hooks/use-shop-order-detail-legacy-pillar-redirect';

type Props = {
  orderId: string;
};

export function ShopB2bOrderDetailCorePage({ orderId }: Props) {
  useShopOrderDetailLegacyPillarRedirect(orderId);
  useWorkshop2B2bOrderDetail(orderId, true);

  return (
    <div className="pb-24" data-testid="shop-b2b-order-detail-core">
      <PlatformCoreOrderDetailChrome orderId={orderId} variant="shop">
        <PlatformCoreB2bOrderDetailFacts orderId={orderId} variant="shop" />
      </PlatformCoreOrderDetailChrome>
    </div>
  );
}
