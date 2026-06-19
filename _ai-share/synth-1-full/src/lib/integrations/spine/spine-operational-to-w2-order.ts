/**
 * Map INT-* operational order detail → W2 order shape for pillar surfaces (ADR-002).
 */
import type { B2BOrderLineItem } from '@/lib/order/b2b-order-payload';
import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';
import {
  isWorkshop2B2bOrderStatus,
  type Workshop2B2bOrderStatus,
} from '@/lib/production/workshop2-b2b-order-lifecycle';
import type { Workshop2B2bOrderDetailView } from '@/hooks/use-workshop2-b2b-order-detail';
import { mapOperationalItemsToForecastLines } from './spine-production-forecast-lines';
import { mapOperationalStatusLabelRu } from './integration-ui-utils';

export type OperationalOrderLike = {
  status: string;
  items?: B2BOrderLineItem[];
  amount?: string;
  buyerId?: string;
  collectionId?: string;
};

function mapOperationalStatusToW2(status: string): Workshop2B2bOrderStatus {
  const normalized = status.trim().toLowerCase();
  if (isWorkshop2B2bOrderStatus(normalized)) return normalized;
  if (normalized === 'approved' || normalized === 'confirmed' || normalized === 'brand_confirmed') {
    return 'confirmed';
  }
  if (normalized === 'shipped' || normalized === 'delivered') return 'shipped';
  if (normalized === 'in_production' || normalized === 'production' || normalized === 'allocated') {
    return 'allocated';
  }
  return 'submitted';
}

function parseAmountRub(amount?: string): number {
  if (!amount?.trim()) return 0;
  const digits = amount.replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

/** Operational v1 order → Workshop2 detail view (procurement / linesheets / chain UI). */
export function mapOperationalOrderToW2DetailView(
  wholesaleOrderId: string,
  order: OperationalOrderLike,
  collectionFallback: string
): Workshop2B2bOrderDetailView {
  const collectionId = order.collectionId?.trim() || collectionFallback;
  const forecastLines = mapOperationalItemsToForecastLines(order.items ?? []);
  const status = mapOperationalStatusToW2(order.status);
  const now = new Date().toISOString();
  const lines = forecastLines.map((line) => ({
    articleId: line.articleId,
    collectionId,
    colorCode: '—',
    size: 'OS',
    qty: line.qty,
    wholesalePriceRub: 0,
  }));

  const record: Workshop2B2bOrderRecord = {
    id: wholesaleOrderId,
    collectionId,
    articleId: lines[0]?.articleId,
    buyerId: order.buyerId,
    status,
    tier: 'standard',
    totalRub: parseAmountRub(order.amount),
    lines,
    createdAt: now,
    updatedAt: now,
  };

  return {
    ...record,
    statusLabelRu: mapOperationalStatusLabelRu(order.status),
    buyerLabelRu: order.buyerId?.trim() || 'Оптовый партнёр',
    paymentTermsLabelRu: null,
  };
}
