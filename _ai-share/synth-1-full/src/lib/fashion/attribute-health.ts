import type { Product } from '@/lib/types';
import { parseComposition } from './parse-composition';
import type { AttributeHealthRow } from './types';

function hasExplicitCare(p: Product): boolean {
  const c = p.attributes?.care;
  if (Array.isArray(c) && c.length) return true;
  if (typeof c === 'string' && c.trim()) return true;
  return false;
}

/** Полнота fashion-атрибутов для мерча и выгрузок (локально, до API PIM). */
export function assessProductAttributeHealth(p: Product): AttributeHealthRow {
  const gaps: string[] = [];
  let ok = 0;

  const checks = [
    { pass: !!p.sku?.trim(), gap: 'sku' },
    { pass: !!p.slug?.trim(), gap: 'slug' },
    { pass: (p.images?.length ?? 0) > 0, gap: 'images' },
    { pass: !!p.color?.trim(), gap: 'color' },
    { pass: !!p.season?.trim(), gap: 'season' },
    { pass: parseComposition(p).length > 0 || !!p.material?.trim(), gap: 'composition' },
    { pass: (p.sustainability?.length ?? 0) > 0, gap: 'sustainability_tags' },
    { pass: hasExplicitCare(p), gap: 'care_explicit' },
  ] as const;

  for (const c of checks) {
    if (c.pass) ok += 1;
    else gaps.push(c.gap);
  }

  const completeness = Math.round((ok / checks.length) * 100);
  return { sku: p.sku, slug: p.slug, name: p.name, completeness, gaps };
}

export function buildAttributeHealthRows(products: Product[]): AttributeHealthRow[] {
  return products.map(assessProductAttributeHealth);
}

export function attributeHealthToCsv(rows: AttributeHealthRow[]): string {
  const header = ['sku', 'slug', 'completeness', 'gaps'];
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push([r.sku, r.slug, String(r.completeness), `"${r.gaps.join('|')}"`].join(','));
  }
  return lines.join('\n');
}
