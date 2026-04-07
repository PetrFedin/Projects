import type { InStoreClientelingV1 } from './types';

/** Инструменты персонального обслуживания (Clienteling) в магазине. */
export function getClientStyleProfile(clientId: string): InStoreClientelingV1 {
  return {
    clientId,
    styleProfile: 'Modern Minimalist',
    sizeAffinity: 'M (Regular Fit)',
    lastPurchaseCategory: 'Outerwear',
    recommendedSkus: ['SKU-101', 'SKU-405'],
  };
}
