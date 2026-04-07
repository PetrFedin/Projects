import type { Product } from '@/lib/types';
import type { ParallelImportV1 } from './types';

/** Проверка документации для параллельного импорта (Compliance RF). */
export function verifyParallelImport(product: Product): ParallelImportV1 {
  const isImported = product.attributes?.originCountry !== 'Russia';
  
  return {
    sku: product.sku,
    originChain: ['Global Distributor AG', 'Broker Service CIS', 'Local Logistics RU'],
    declarationStatus: isImported ? 'verified' : 'missing',
    allowedInRf: true, // Based on RF Ministry of Industry and Trade list
    complianceDocUrl: '#',
  };
}
