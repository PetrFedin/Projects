import type { Product } from '@/lib/types';
import type { SubstituteCandidate } from './types';

function toCandidate(p: Product, reason: string): SubstituteCandidate {
  return {
    productId: String(p.id),
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    color: p.color,
    reason,
  };
}

/** Замены при OOS: тот же бренд + категория, другой цвет; иначе та же категория. */
export function findSubstituteCandidates(anchor: Product, catalog: Product[], limit = 8): SubstituteCandidate[] {
  const out: SubstituteCandidate[] = [];
  const seen = new Set<string>([String(anchor.id)]);

  const sameBrandCat = catalog.filter(
    (p) => p.id !== anchor.id && p.brand === anchor.brand && p.category === anchor.category && p.images?.length,
  );
  for (const p of sameBrandCat) {
    if (out.length >= limit) break;
    if (seen.has(String(p.id))) continue;
    if (p.color !== anchor.color) {
      seen.add(String(p.id));
      out.push(toCandidate(p, 'Тот же бренд и категория, другой цвет'));
    }
  }
  for (const p of sameBrandCat) {
    if (out.length >= limit) break;
    if (seen.has(String(p.id))) continue;
    seen.add(String(p.id));
    out.push(toCandidate(p, 'Тот же бренд и линейка'));
  }

  if (out.length < limit) {
    for (const p of catalog) {
      if (out.length >= limit) break;
      if (!p.images?.length) continue;
      if (seen.has(String(p.id))) continue;
      if (p.category === anchor.category) {
        seen.add(String(p.id));
        out.push(toCandidate(p, 'Та же категория'));
      }
    }
  }

  return out.slice(0, limit);
}
