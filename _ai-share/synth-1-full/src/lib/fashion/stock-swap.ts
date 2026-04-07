import type { StockSwapOfferV1 } from './types';

/** Утилита для ребалансировки стока между магазинами сети. */
export function getStoreStockSwapOffers(sku: string): StockSwapOfferV1[] {
  return [
    {
      id: 'SWAP-001',
      sku,
      fromStoreId: 'Store-Moscow-Central',
      toStoreId: 'Store-Moscow-North',
      quantity: 12,
      urgency: 'high',
      status: 'pending',
    },
    {
      id: 'SWAP-002',
      sku,
      fromStoreId: 'Store-SPB-Nevsky',
      toStoreId: 'Store-SPB-Galeria',
      quantity: 5,
      urgency: 'medium',
      status: 'in_transit',
    }
  ];
}
