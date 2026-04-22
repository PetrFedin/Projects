import type { Product } from '@/lib/types';
import type { MaterialOriginV1 } from './types';
import { parseComposition } from './parse-composition';

/** Извлечение происхождения волокон (Traceability/DPP). */
export function getMaterialOrigins(product: Product): MaterialOriginV1[] {
  const comp = parseComposition(product);
  const a = product.attributes ?? {};
  
  // Демо-логика: сопоставление состава и стран из атрибутов PIM
  return comp.map(c => {
    const mat = c.material.toLowerCase();
    let country = 'Unknown';
    let certification = undefined;

    if (mat.includes('cotton')) {
      country = a.cottonOrigin || 'India';
      if (mat.includes('organic')) certification = 'GOTS Certified';
    } else if (mat.includes('wool')) {
      country = a.woolOrigin || 'Australia';
      certification = 'RWS (Responsible Wool)';
    } else if (mat.includes('linen')) {
      country = a.linenOrigin || 'France';
      certification = 'European Flax';
    } else if (mat.includes('polyester')) {
      country = a.polyesterOrigin || 'China';
      if (mat.includes('recycled')) certification = 'GRS (Global Recycled Standard)';
    }

    return {
      fiber: c.material,
      percentage: c.percentage ?? 0,
      country,
      certification,
    };
  });
}
