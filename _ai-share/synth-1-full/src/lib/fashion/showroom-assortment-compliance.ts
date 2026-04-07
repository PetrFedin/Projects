import type { Product } from './types';

export type ShowroomAssortmentComplianceV1 = {
  sessionId: string;
  mustHaveItems: { sku: string; ordered: boolean }[];
  categoryBalance: { category: string; targetPercent: number; currentPercent: number }[];
  overallComplianceScore: number;
};

/** Анализ сбалансированности заказа в шоуруме (Assortment Compliance). */
export function getShowroomAssortmentCompliance(sessionId: string): ShowroomAssortmentComplianceV1 {
  return {
    sessionId,
    mustHaveItems: [
      { sku: 'SKU-101', ordered: true },
      { sku: 'SKU-202', ordered: false },
      { sku: 'SKU-505', ordered: true },
    ],
    categoryBalance: [
      { category: 'Outerwear', targetPercent: 30, currentPercent: 35 },
      { category: 'Dresses', targetPercent: 40, currentPercent: 25 },
      { category: 'Accessories', targetPercent: 10, currentPercent: 15 },
    ],
    overallComplianceScore: 78,
  };
}
