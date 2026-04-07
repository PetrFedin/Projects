import type { Product } from '@/lib/types';

export type CompositionPart = { material: string; percentage?: number };

export function parseComposition(product: Product): CompositionPart[] {
  const c = product.composition;
  if (!c && product.material?.trim()) {
    return [{ material: product.material.trim() }];
  }
  if (!c) return [];
  if (typeof c === 'string') {
    return c
      .split(/[,;]|(?=\d+%)/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((chunk) => {
        const m = chunk.match(/^(.+?)\s*(\d{1,3})\s*%?\s*$/);
        if (m) return { material: m[1].trim(), percentage: Number(m[2]) };
        return { material: chunk };
      });
  }
  return c.map((x) => ({ material: x.material, percentage: x.percentage }));
}

export function compositionToPlainText(parts: CompositionPart[]): string {
  if (!parts.length) return '';
  return parts
    .map((p) => (p.percentage != null ? `${p.material} ${p.percentage}%` : p.material))
    .join(', ');
}
