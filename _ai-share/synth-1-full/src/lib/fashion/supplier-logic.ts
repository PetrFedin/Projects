import type { SupplierMetricV1 } from './types';

/** Демо-метрики поставщиков для инфраструктуры B2B. */
export function getSupplierMetrics(): SupplierMetricV1[] {
  return [
    {
      id: 'sup-01',
      name: 'Zhejiang Knitwear Co.',
      qualityScore: 94,
      esgGrade: 'B',
      avgLeadTimeDays: 45,
      onTimeDeliveryPct: 98,
    },
    {
      id: 'sup-02',
      name: 'Vietnam Denim Works',
      qualityScore: 88,
      esgGrade: 'A',
      avgLeadTimeDays: 60,
      onTimeDeliveryPct: 92,
    },
    {
      id: 'sup-03',
      name: 'Istanbul Leather Lab',
      qualityScore: 91,
      esgGrade: 'C',
      avgLeadTimeDays: 30,
      onTimeDeliveryPct: 85,
    },
    {
      id: 'sup-04',
      name: 'Baltic Linen Factory',
      qualityScore: 96,
      esgGrade: 'A',
      avgLeadTimeDays: 25,
      onTimeDeliveryPct: 100,
    },
  ];
}
