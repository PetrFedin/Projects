import type { ProductionPageOrderLike } from '@/app/brand/production/production-page-build-items-for-collection';
import {
  deriveStagesArticleFacets,
  stagesArticleDisplayLabel,
} from '@/lib/production/stages-tab-facets';

/** id + подпись для flow (артикул · сезон), без маркетингового названия. */
export function buildArticleSeedsFromOrderItems(
  items: readonly ProductionPageOrderLike[]
): { id: string; label: string }[] {
  return items.map((item, idx) => {
    const id = String(item.id);
    const sku = String(item.sku ?? item.id);
    const facets = deriveStagesArticleFacets(item as Record<string, unknown>, idx);
    return { id, label: stagesArticleDisplayLabel(sku, facets.season) };
  });
}
