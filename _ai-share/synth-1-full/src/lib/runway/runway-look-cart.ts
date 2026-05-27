import type { Product } from '@/lib/types';

/** Размеры look-item товара для mini-picker. */
export function resolveLookProductSizes(product: Product): string[] {
  if (product.sizes?.length) {
    return product.sizes.map((s) => s.name).filter(Boolean);
  }
  const fromColors = product.availableColors?.flatMap(
    (c) => c.sizeAvailability?.map((s) => s.size) ?? []
  );
  if (fromColors?.length) {
    return [...new Set(fromColors)];
  }
  return [];
}

export function lookProductRequiresSize(product: Product): boolean {
  return resolveLookProductSizes(product).length > 0;
}

/** Первый доступный размер или One Size для аксессуаров. */
export function resolveDefaultLookSize(product: Product): string {
  const sizes = resolveLookProductSizes(product);
  return sizes[0] ?? 'One Size';
}

export interface RunwayLookCartBulkResult {
  added: number;
  failed: string[];
}

/** Уникальные slug look-items без дублей. */
export function uniqueLookItemSlugs(slugs: string[]): string[] {
  return [...new Set(slugs.map((s) => s.trim()).filter(Boolean))];
}

export async function fetchLookProductBySlug(
  slug: string,
  catalog?: Product[]
): Promise<Product | null> {
  const fromCatalog = catalog?.find((p) => p.slug === slug);
  if (fromCatalog) return fromCatalog;

  if (typeof fetch === 'undefined') return null;
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, { cache: 'force-cache' });
    if (!res.ok) return null;
    return (await res.json()) as Product;
  } catch {
    return null;
  }
}
