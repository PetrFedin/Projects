import type { LocalCourierDispatchV1 } from './types';

/** Управление локальной доставкой (Последняя миля RU). */
export function getLocalCourierStatus(orderId: string): LocalCourierDispatchV1 {
  const seedRaw = orderId.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = orderId.length * 43;

  const services: LocalCourierDispatchV1['courierService'][] = [
    'CDEK',
    'Boxberry',
    'LocalStoreCourier',
  ];
  const statuses: LocalCourierDispatchV1['status'][] = ['dispatched', 'collected', 'delivered'];

  const arrival = new Date();
  arrival.setHours(arrival.getHours() + (seed % 24));

  return {
    orderId,
    courierService: services[seed % services.length],
    status: statuses[seed % statuses.length],
    currentHub: `MSK-HUB-${seed % 5}`,
    estimatedArrival: arrival.toISOString(),
    trackingLink: `https://track.courier.ru/${orderId}`,
  };
}
