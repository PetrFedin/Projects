import type { Product } from '@/lib/types';
import type { FabricWasteV1 } from './types';

/** Расчет отходов ткани (Sustainable Production Analytics). */
export function estimateFabricWaste(product: Product): FabricWasteV1 {
  const complexity = product.name.length % 5; // 0-4
  const baseWaste = 12 + complexity; // 12% - 16% waste
  const materialPerSku = product.category === 'Outerwear' ? 3.5 : 1.5;

  return {
    sku: product.sku,
    materialUsed: materialPerSku,
    estimatedWaste: baseWaste,
    cutOptimizationScore: 100 - baseWaste * 4,
    savedMaterialCo2: Math.round(materialPerSku * baseWaste * 0.1 * 10) / 10,
  };
}
