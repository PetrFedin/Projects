import type { BrandCrmSegmentObject } from '@/lib/b2b/brand-crm-segment-object';
import { shopCoreBuyerLabelRu } from '@/lib/order/shop-core-buyer-context';

/** Default brand CRM segment per demo buyer (greenfield shop2 → retail). */
export const SHOP_BUYER_DEFAULT_SEGMENT_KEY: Readonly<Record<string, string>> = {
  shop1: 'wholesale',
  shop2: 'retail',
};

export type ShopBuyerCrmProfile = {
  buyerId: string;
  buyerLabelRu: string;
  segmentKey: string;
  segmentNameRu: string;
  priceTier: string;
  netTermDays: number;
  firstOrderDiscountPct?: number;
  vatExempt: boolean;
  onboardingNoteRu?: string;
  assignedAt: string;
};

export function resolveShopBuyerDefaultSegmentKey(buyerId: string): string {
  return SHOP_BUYER_DEFAULT_SEGMENT_KEY[buyerId.trim()] ?? 'retail';
}

export function buildShopBuyerCrmProfile(input: {
  buyerId: string;
  segment: BrandCrmSegmentObject;
  onboardingNoteRu?: string;
  assignedAt?: string;
}): ShopBuyerCrmProfile {
  const buyerId = input.buyerId.trim();
  return {
    buyerId,
    buyerLabelRu: shopCoreBuyerLabelRu(buyerId),
    segmentKey: input.segment.segmentKey,
    segmentNameRu: input.segment.nameRu,
    priceTier: input.segment.defaultPriceTier,
    netTermDays: input.segment.defaultNetTermDays,
    firstOrderDiscountPct: input.segment.firstOrderDiscountPct,
    vatExempt: input.segment.vatExempt,
    onboardingNoteRu: input.onboardingNoteRu,
    assignedAt: input.assignedAt ?? new Date().toISOString(),
  };
}
