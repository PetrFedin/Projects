import type { Product } from '@/lib/types';
import type { FabricDefectScanV1 } from './types';

/** Симуляция AI-сканера дефектов ткани (Quality Control). */
export function scanFabricBatch(product: Product): FabricDefectScanV1 {
  const seed = product.id.length + product.sku.length;
  const defects = seed % 4; // 0-3 defects
  const passRate = 100 - (defects * 3);
  
  const types: FabricDefectScanV1['defectTypes'] = [];
  if (defects > 0) types.push('stain');
  if (defects > 1) types.push('thread_pull');
  if (defects > 2) types.push('color_variance');

  return {
    sku: product.sku,
    batchId: `BATCH-${product.id.slice(-4).toUpperCase()}`,
    detectedDefects: defects,
    defectTypes: types,
    passRate,
    actionRequired: passRate > 95 ? 'pass' : passRate > 90 ? 'rework' : 'quarantine',
  };
}
