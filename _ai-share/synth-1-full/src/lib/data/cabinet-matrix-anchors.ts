/**
 * Якоря для матрицы кабинетов (синхрон с `shopNavGroups` / `SHOP_B2B_HUB_GROUP_IDS` и brand).
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

/** Срез ритейл-центра для B2B-хаба в данных: розница, склад, закупка, исполнение, сервис, аналитика. */
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
