import type { StockExchangeV1 } from './types';

/** Биржа обмена остатками между B2B партнерами. */
export function getStockExchangeOffers(sku?: string): StockExchangeV1[] {
  const offers: StockExchangeV1[] = [
    {
      sku: 'SKU-101',
      type: 'excess',
      partnerId: 'P-005',
      quantity: 250,
      location: 'Novosibirsk',
      pricePerUnit: 4200,
      status: 'active',
    },
    {
      sku: 'SKU-102',
      type: 'request',
      partnerId: 'P-008',
      quantity: 100,
      location: 'Moscow',
      pricePerUnit: 4500,
      status: 'active',
    },
    {
      sku: 'SKU-205',
      type: 'excess',
      partnerId: 'P-012',
      quantity: 50,
      location: 'Krasnodar',
      pricePerUnit: 3800,
      status: 'negotiation',
    },
  ];

  return sku ? offers.filter((o) => o.sku === sku) : offers;
}

export function postToExchange(offer: Omit<StockExchangeV1, 'status'>): StockExchangeV1 {
  return { ...offer, status: 'active' };
}
