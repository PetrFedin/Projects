import type { Product } from '@/lib/types';
import { loadRunwayProduct } from '@/lib/runway/RunwayExperienceService';

/**
 * @deprecated Используйте loadRunwayProduct — тот же merge patches/overrides.
 * Оставлен для backward-compat импортов.
 */
export async function fetchRunwayProductBySlug(slug: string): Promise<Product | null> {
  return loadRunwayProduct(slug);
}

export { loadRunwayProduct };
