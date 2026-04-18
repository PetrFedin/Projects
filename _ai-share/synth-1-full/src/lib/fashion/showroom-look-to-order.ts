import type { ShowroomLookToOrderV1 } from './types';

/** Интеграция образов шоурума с оптовыми заказами (Look-to-Order). */
export function convertLookToOrder(lookId: string, skus: string[]): ShowroomLookToOrderV1 {
  return {
    lookId,
    skus,
    totalWholesaleValue: skus.length * 12500, // Demo calculation
    conversionStatus: 'converted_to_order',
    targetStoreId: 'STORE-MOSCOW-01',
  };
}

export function getDraftLooksForPartner(partnerId: string): ShowroomLookToOrderV1[] {
  return [
    {
      lookId: 'L-SS26-01',
      skus: ['SKU-101', 'SKU-202', 'SKU-303'],
      totalWholesaleValue: 37500,
      conversionStatus: 'draft',
    },
  ];
}
