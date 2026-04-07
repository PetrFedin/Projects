import type { Product } from '@/lib/types';
import type { SupplierMetricV1 } from './types';

/** Метрики эффективности поставщика (Supply Chain Analytics). */
export function getSupplierPerformance(product: Product): SupplierMetricV1 {
  const name = product.attributes?.originCountry === 'Italy' ? 'Milano Fabrics Ltd.' : 'Asian Assembly Hub';
  const supplierId = `SUP-${product.id.slice(0, 4).toUpperCase()}`;

  // Демо-данные на основе характеристик продукта
  const leadTime = 30 + (product.price % 60);
  const qScore = 85 + (product.name.length % 14);
  const orders = 1 + (product.sku.length % 5);

  return {
    supplierId,
    name,
    leadTimeDays: leadTime,
    qualityScore: Math.min(qScore, 100),
    complianceGrade: qScore > 95 ? 'A' : qScore > 90 ? 'B' : 'C',
    activeOrders: orders,
  };
}
