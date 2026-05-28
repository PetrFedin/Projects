import type { B2BReservationV1 } from './types';

/** Управление резервами товаров для B2B партнеров. */
export function getPartnerReservations(partnerId: string): B2BReservationV1[] {
  return [
    {
      id: 'RES-001',
      partnerId,
      sku: 'SKU-101',
      quantity: 500,
      expiryDate: '2026-05-01',
      status: 'active',
    },
    {
      id: 'RES-002',
      partnerId,
      sku: 'SKU-301',
      quantity: 150,
      expiryDate: '2026-04-10',
      status: 'active',
    },
  ];
}

export function createReservation(
  partnerId: string,
  sku: string,
  quantity: number
): B2BReservationV1 {
  return {
    id: `RES-${Math.floor(Math.random() * 10000)}`,
    partnerId,
    sku,
    quantity,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
  };
}
