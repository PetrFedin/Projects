import type { StoreVipFittingV1 } from './types';

/** Управление VIP-примерками и записями в магазин (Clienteling). */
export function getStoreVipFittings(storeId: string = 'STORE-MSK-MAIN'): StoreVipFittingV1[] {
  return [
    {
      appointmentId: 'APP-VIP-001',
      clientId: 'PETROVA-ELENA',
      storeId,
      timeSlot: '2026-04-01 14:00',
      stylistId: 'STYLIST-ANNA',
      preSelectedSkus: ['SKU-101', 'SKU-505'],
      status: 'active',
    },
    {
      appointmentId: 'APP-VIP-002',
      clientId: 'IVANOV-IGOR',
      storeId,
      timeSlot: '2026-04-01 16:30',
      stylistId: 'STYLIST-MAX',
      preSelectedSkus: ['SKU-202'],
      status: 'scheduled',
    }
  ];
}
