'use client';

import { ShopReplenishmentRulesPanel } from '@/components/shop/replenishment/ShopReplenishmentRulesPanel';
import { ShopReplenishmentStockAtpPanel } from '@/components/shop/replenishment/ShopReplenishmentStockAtpPanel';

type Props = {
  featureId: 'stock-atp' | 'rules';
  collectionId?: string;
  orderId?: string;
};

export function ShopReplenishmentFeaturePanel({ featureId, collectionId, orderId }: Props) {
  if (featureId === 'stock-atp') {
    return <ShopReplenishmentStockAtpPanel collectionId={collectionId} orderId={orderId} />;
  }
  return <ShopReplenishmentRulesPanel collectionId={collectionId} orderId={orderId} />;
}
