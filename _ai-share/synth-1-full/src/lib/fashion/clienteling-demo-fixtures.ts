import type { B2BClientelingV1, InStoreClientelingV1 } from '@/lib/fashion/types';

/** Поля B2B clienteling без `partnerId` — подставляется в `getB2BClientelingData`. */
export const B2B_CLIENTELING_DEMO_FIELDS: Omit<B2BClientelingV1, 'partnerId'> = {
  lastInteractionDate: '2026-03-25',
  preferredCategories: ['Outerwear', 'Knitwear'],
  totalLifetimeValue: 12_500_000,
  unlockedPerks: ['Priority Production Slot', 'Extended Credit Line'],
  nextSuggestedMeeting: '2026-04-15',
};

/** In-store clienteling без `clientId`. */
export const INSTORE_CLIENTELING_DEMO_FIELDS: Omit<InStoreClientelingV1, 'clientId'> = {
  styleProfile: 'Modern Minimalist',
  sizeAffinity: 'M (Regular Fit)',
  lastPurchaseCategory: 'Outerwear',
  recommendedSkus: ['SKU-101', 'SKU-405'],
};
