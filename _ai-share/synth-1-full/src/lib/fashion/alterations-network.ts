import type { Product } from '@/lib/types';
import type { AlterationServiceV1 } from './types';

/** Поиск ближайших ателье для подгонки изделия (Premium Service). */
export function getAlterationServices(product: Product): AlterationServiceV1[] {
  return [
    {
      atelierName: 'Atelier Premium Moscow',
      distanceKm: 1.2,
      availableServices: ['hem', 'waist', 'sleeves'],
      estimatedPrice: 1500,
      bookingUrl: '#',
    },
    {
      atelierName: 'Tailor Lab SPB',
      distanceKm: 2.5,
      availableServices: ['taper', 'hem'],
      estimatedPrice: 1200,
      bookingUrl: '#',
    }
  ];
}
