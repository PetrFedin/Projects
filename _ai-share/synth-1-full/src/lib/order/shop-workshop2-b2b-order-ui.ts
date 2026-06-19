import {
  workshop2B2bOrderStatusLabelRu,
  type Workshop2B2bOrderRecord,
} from '@/lib/production/workshop2-b2b-order-lifecycle';
import {
  isPlatformCoreEmptyChainCollection,
  PLATFORM_CORE_COLLECTION_PRESETS,
} from '@/lib/platform-core-hub-matrix';

/** Demo-магазин golden path SS27/FW27. */
export const SHOP_CORE_DEMO_BUYER_ID = 'shop1';

export type ShopB2bOrderListRow = {
  order: string;
  brand: string;
  status: string;
  amount: string;
  date: string;
  updatedAt: string;
  collectionId?: string;
  paymentStatus?: string;
};

export function workshop2B2bOrderToShopListRow(
  order: Workshop2B2bOrderRecord
): ShopB2bOrderListRow {
  return {
    order: order.id,
    brand: 'Syntha',
    status: workshop2B2bOrderStatusLabelRu(order.status),
    amount: `${order.totalRub.toLocaleString('ru-RU')} ₽`,
    date: order.createdAt.slice(0, 10),
    updatedAt: order.updatedAt?.trim() || order.createdAt,
    collectionId: order.collectionId,
    paymentStatus: undefined,
  };
}

export const SHOP_CORE_W2_COLLECTION_IDS = PLATFORM_CORE_COLLECTION_PRESETS.filter(
  (p) => p.available && !isPlatformCoreEmptyChainCollection(p.id)
).map((p) => p.id);
