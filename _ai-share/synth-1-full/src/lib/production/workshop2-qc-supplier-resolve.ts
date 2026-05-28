import type { ArticleWorkspaceBundle } from '@/lib/production/article-workspace/types';
import { getWorkshop2SuppliersSeed } from '@/lib/production/workshop2-suppliers-seed';

/** Поставщик для scorecard: первый PO с supplierId, иначе seed[0] как demo fallback. */
export function resolveWorkshop2QcSupplierId(bundle: ArticleWorkspaceBundle | null | undefined): {
  supplierId: string;
  source: 'purchase_order' | 'seed_default' | 'none';
} {
  const fromPo = bundle?.planPo?.purchaseOrders
    ?.find((p) => p.supplierId?.trim())
    ?.supplierId?.trim();
  if (fromPo) {
    return { supplierId: fromPo, source: 'purchase_order' };
  }
  const seed = getWorkshop2SuppliersSeed()[0]?.id?.trim();
  if (seed) {
    return { supplierId: seed, source: 'seed_default' };
  }
  return { supplierId: '', source: 'none' };
}
