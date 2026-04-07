import type { Product } from '@/lib/types';
import type { DeliveryRateV1 } from './types';

/** Расчет тарифов и сроков доставки по РФ. */
export function calculateLocalDelivery(city: string = 'Москва'): DeliveryRateV1[] {
  const isMoscow = city === 'Москва' || city === 'Moscow';

  return [
    { service: 'CDEK', city, price: isMoscow ? 350 : 550, days: isMoscow ? '1-2' : '3-5', type: 'pickup' },
    { service: 'Boxberry', city, price: isMoscow ? 290 : 490, days: isMoscow ? '2-3' : '4-6', type: 'pickup' },
    { service: 'Russian Post', city, price: isMoscow ? 150 : 350, days: isMoscow ? '3-5' : '7-10', type: 'pickup' },
    { service: 'CDEK', city, price: isMoscow ? 500 : 800, days: isMoscow ? '1' : '2-4', type: 'courier' },
  ];
}
