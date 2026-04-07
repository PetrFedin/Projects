/**
 * JOOR integration constants — delivery windows, MOQ defaults.
 */
import type { B2BDeliveryWindow } from '@/lib/order/b2b-order-payload';

export const JOOR_DELIVERY_WINDOWS: B2BDeliveryWindow[] = [
  { id: 'drop1', label: 'SS26 Drop 1', startShipDate: '2026-01-15', completeShipDate: '2026-01-31', cancelDate: '2026-01-10' },
  { id: 'drop2', label: 'SS26 Drop 2', startShipDate: '2026-02-15', completeShipDate: '2026-02-28', cancelDate: '2026-02-10' },
];

export function getMoqForProduct(_productId: string): number {
  return 1;
}
