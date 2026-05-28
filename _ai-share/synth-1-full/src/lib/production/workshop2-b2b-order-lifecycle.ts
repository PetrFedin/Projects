/**
 * Wave 21: единая машина состояний B2B-заказа (native JOOR/NuOrder parity, RU).
 */
export const WORKSHOP2_B2B_ORDER_STATUSES = [
  'draft',
  'submitted',
  'confirmed',
  'allocated',
  'shipped',
  'cancelled',
] as const;

export type Workshop2B2bOrderStatus = (typeof WORKSHOP2_B2B_ORDER_STATUSES)[number];

export const WORKSHOP2_B2B_ORDER_CONTEXT_TYPE = 'b2b_order';

/** Wave 23: чат переговоров по showroom-кампании. */
export const WORKSHOP2_B2B_CAMPAIGN_CONTEXT_TYPE = 'b2b_campaign';

export function workshop2B2bCampaignContextId(collectionId: string, articleId: string): string {
  return `${collectionId.trim()}::${articleId.trim()}`;
}

export function workshop2B2bOrderContextId(orderId: string): string {
  return orderId.trim();
}

const TRANSITIONS: Record<Workshop2B2bOrderStatus, Workshop2B2bOrderStatus[]> = {
  draft: ['submitted', 'cancelled'],
  submitted: ['confirmed', 'cancelled'],
  confirmed: ['allocated', 'cancelled'],
  allocated: ['shipped', 'cancelled'],
  shipped: [],
  cancelled: [],
};

export function isWorkshop2B2bOrderStatus(v: string): v is Workshop2B2bOrderStatus {
  return (WORKSHOP2_B2B_ORDER_STATUSES as readonly string[]).includes(v);
}

export function canTransitionWorkshop2B2bOrderStatus(
  from: Workshop2B2bOrderStatus,
  to: Workshop2B2bOrderStatus
): boolean {
  if (from === to) return true;
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function workshop2B2bOrderStatusLabelRu(status: Workshop2B2bOrderStatus): string {
  switch (status) {
    case 'draft':
      return 'Черновик';
    case 'submitted':
      return 'Отправлен';
    case 'confirmed':
      return 'Подтверждён';
    case 'allocated':
      return 'Резерв / аллокация';
    case 'shipped':
      return 'Отгружен';
    case 'cancelled':
      return 'Отменён';
    default:
      return status;
  }
}

export type Workshop2B2bOrderLine = {
  articleId: string;
  collectionId: string;
  colorCode: string;
  size: string;
  qty: number;
  wholesalePriceRub: number;
  moq?: number;
  /** Wave 23: заметка байера на строку → PDF счёт-оферта. */
  lineNote?: string;
  deliveryDate?: string;
};

export type Workshop2B2bPaymentTermsRu = 'prepay_100' | 'defer_30' | 'defer_60';

export type Workshop2B2bOrderRecord = {
  id: string;
  collectionId?: string;
  articleId?: string;
  buyerId?: string;
  /** Wave 32: brand scope для multi-brand cart split. */
  brandId?: string;
  repId?: string;
  status: Workshop2B2bOrderStatus;
  tier: 'standard' | 'vip' | 'prebook';
  totalRub: number;
  lines: Workshop2B2bOrderLine[];
  commissionPreview?: {
    repId: string;
    commissionRub: number;
    commissionPct: number;
  };
  /** Wave 22: желаемая дата отгрузки (ISO date). */
  requestedDeliveryDate?: string;
  /** Wave 22: условия оплаты RU. */
  paymentTermsRu?: Workshop2B2bPaymentTermsRu;
  paymentTermsDays?: number;
  createdAt: string;
  updatedAt: string;
};

export function cloneWorkshop2B2bOrderAsReorder(input: {
  source: Workshop2B2bOrderRecord;
  newId: string;
  repId?: string;
}): Workshop2B2bOrderRecord {
  const now = new Date().toISOString();
  return {
    id: input.newId,
    collectionId: input.source.collectionId,
    articleId: input.source.articleId,
    buyerId: input.source.buyerId,
    repId: input.repId ?? input.source.repId,
    status: 'draft',
    tier: input.source.tier,
    totalRub: input.source.totalRub,
    lines: input.source.lines.map((l) => ({ ...l })),
    createdAt: now,
    updatedAt: now,
  };
}

export function summarizeWorkshop2B2bOrderStatusChangeRu(input: {
  orderId: string;
  from: Workshop2B2bOrderStatus;
  to: Workshop2B2bOrderStatus;
}): string {
  return `[Система] B2B заказ ${input.orderId}: ${workshop2B2bOrderStatusLabelRu(input.from)} → ${workshop2B2bOrderStatusLabelRu(input.to)}`;
}
