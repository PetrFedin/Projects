/**
 * Якоря для матрицы кабинетов.
 * Shop: ссылки собираются из `shopNavGroups`, оставляя только группы из `SHOP_B2B_HUB_GROUP_IDS`
 * (ритейл `retail-ops`, ядро опта `partners` → `pim` → `b2b` → `logistics`, `shop-b2b-extended`, `analytics`).
 * Brand: все группы `brandNavGroups` (дедуп по href).
 */
import { shopNavGroups, SHOP_B2B_HUB_GROUP_IDS } from '@/lib/data/shop-navigation-normalized';
import { brandNavGroups } from '@/lib/data/brand-navigation';

export type CabinetMatrixAnchor = { label: string; href: string };

function dedupeByHref(anchors: CabinetMatrixAnchor[]): CabinetMatrixAnchor[] {
  const seen = new Set<string>();
  const out: CabinetMatrixAnchor[] = [];
  for (const a of anchors) {
    const h = a.href.trim();
    if (!h || seen.has(h)) continue;
    seen.add(h);
    out.push({ label: a.label, href: h });
  }
  return out;
}

/**
 * Срез хаба `/shop/b2b/*` для матрицы кабинетов: те же группы, что и горизонтальный хаб
 * (`SHOP_B2B_HUB_GROUP_IDS`), не только четыре столпа `SHOP_B2B_NAV_GROUP_IDS`.
 */
export function buildShopCabinetAnchors(): CabinetMatrixAnchor[] {
  const allowed = new Set<string>(SHOP_B2B_HUB_GROUP_IDS as readonly string[]);
  const raw: CabinetMatrixAnchor[] = [];
  for (const g of shopNavGroups) {
    if (!allowed.has(g.id)) continue;
    for (const link of g.links) {
      const href = typeof link.href === 'string' ? link.href : '';
      if (!href) continue;
      raw.push({ label: link.label, href });
    }
  }
  return dedupeByHref(raw);
}

/** Все верхнеуровневые пункты brandNavGroups (без quickActions — они дублируют href). */
export function buildBrandCabinetAnchors(): CabinetMatrixAnchor[] {
  const raw: CabinetMatrixAnchor[] = [];
  for (const g of brandNavGroups) {
    for (const link of g.links) {
      const href = typeof link.href === 'string' ? link.href : '';
      if (!href) continue;
      raw.push({ label: link.label, href });
    }
  }
  return dedupeByHref(raw);
}
