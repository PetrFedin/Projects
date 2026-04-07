import type { RawMaterialBookingV1 } from './types';

/** Бронирование сырья (ткани, фурнитуры) под конкретный SKU / заказ. */
export function getRawMaterialBooking(sku: string): RawMaterialBookingV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 13;

  const qty = 500 + (seed % 1000);
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);

  return {
    bookingId: `MAT-RSV-${seed}`,
    sku,
    fabricId: `FAB-LINEN-${seed % 5 === 0 ? 'WHITE' : 'NATURAL'}`,
    reservedQtyMeters: qty,
    supplierId: 'SUPP-IVANOVO-01',
    expiryDate: expiry.toISOString().split('T')[0],
    status: seed % 7 === 0 ? 'converted_to_po' : 'reserved',
  };
}
