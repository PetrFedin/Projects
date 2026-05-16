import type { B2BOrder } from '@/lib/types';

/** Стабильный id для строки справочника партнёров (совпадает с форматом в API). */
export function b2bOrderShopPartnerId(shop: string): string {
  const slug = slugForPartnerIdSegment(shop);
  return `b2b-order-shop:${slug}`;
}

function slugForPartnerIdSegment(shop: string): string {
  const s = shop
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9а-яё_.-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96);
  return s.length > 0 ? s : 'shop';
}

/**
 * Уникальные ритейлеры из operational B2B — как дополнительные строки в том же контракте, что
 * `GET /api/brand/sewing-plan-reference` → `partners[]`.
 */
export function partnerRowsFromB2bOrderShops(
  orders: readonly Pick<B2BOrder, 'shop'>[]
): { id: string; label: string }[] {
  const seen = new Set<string>();
  const out: { id: string; label: string }[] = [];
  for (const o of orders) {
    const shop = (o.shop ?? '').trim();
    if (!shop) continue;
    const id = b2bOrderShopPartnerId(shop);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id, label: `B2B · ${shop}` });
  }
  out.sort((a, b) => a.label.localeCompare(b.label, 'ru'));
  return out;
}
