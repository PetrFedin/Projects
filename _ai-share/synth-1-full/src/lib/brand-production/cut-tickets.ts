import type { BrandProductionState } from './types';
import { ARTICLE_LIFECYCLE_LABELS } from './types';

export type BrandProductionCutTicketStatus = 'draft' | 'ready' | 'issued' | 'in_wip';

export type BrandProductionCutTicketRow = {
  id: string;
  poId: string;
  poCode: string;
  articleId: string;
  sku: string;
  articleName: string;
  factoryName: string;
  totalQty: number;
  sizeSummary: string;
  targetCutDate?: string;
  status: BrandProductionCutTicketStatus;
  lifecycleLabel: string;
};

function sizeBreakdownSummary(breakdown: Record<string, number>): string {
  return Object.entries(breakdown)
    .filter(([, qty]) => qty > 0)
    .map(([size, qty]) => `${size}:${qty}`)
    .join(' · ');
}

function cutTicketStatusFromPo(poStatus: string): BrandProductionCutTicketStatus {
  if (poStatus === 'confirmed') return 'ready';
  if (poStatus === 'in_production') return 'in_wip';
  if (poStatus === 'completed') return 'issued';
  return 'draft';
}

/** Work packets из confirmed PO lines (Apparel Magic cut ticket pattern). */
export function buildBrandProductionCutTickets(
  state: BrandProductionState,
  collectionId?: string
): BrandProductionCutTicketRow[] {
  const cid = collectionId?.trim();
  const articlesById = new Map(state.articles.map((a) => [a.id, a]));
  const factoriesById = new Map(state.factories.map((f) => [f.id, f.name]));

  const rows: BrandProductionCutTicketRow[] = [];

  for (const po of state.purchaseOrders) {
    if (cid && po.collectionId !== cid) continue;
    if (po.status === 'draft' || po.status === 'sent') continue;

    for (const line of po.lines) {
      const article = articlesById.get(line.articleId);
      if (!article) continue;
      rows.push({
        id: `ct-${po.id}-${line.id}`,
        poId: po.id,
        poCode: po.code,
        articleId: article.id,
        sku: article.sku,
        articleName: article.name,
        factoryName: factoriesById.get(po.factoryId) ?? po.factoryId,
        totalQty: line.totalQty,
        sizeSummary: sizeBreakdownSummary(line.sizeBreakdown),
        targetCutDate: article.targetCutDate,
        status: cutTicketStatusFromPo(po.status),
        lifecycleLabel: ARTICLE_LIFECYCLE_LABELS[article.lifecycleStage],
      });
    }
  }

  return rows.sort((a, b) => a.poCode.localeCompare(b.poCode));
}

export function labelBrandProductionCutTicketStatusRu(
  status: BrandProductionCutTicketStatus
): string {
  switch (status) {
    case 'draft':
      return 'Черновик';
    case 'ready':
      return 'Готов к выпуску';
    case 'issued':
      return 'Выдан';
    case 'in_wip':
      return 'В цехе';
    default:
      return status;
  }
}
