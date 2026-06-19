/**
 * Wave 21: единая модель B2B кампании (showroom + linesheet) из W2 dossier/campaign.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2ShowroomLinesheetPayload,
  type Workshop2ShowroomLinesheetPayload,
} from '@/lib/production/workshop2-showroom-linesheet-payload';
import type { Workshop2ShowroomCampaign } from '@/lib/server/workshop2-showroom-repository';
import {
  buildWorkshop2B2bLinesheetVersionLabel,
  resolveWorkshop2B2bBestWholesalePriceRub,
  type Workshop2B2bQtyPriceBreak,
} from '@/lib/production/workshop2-b2b-wave23-parity';
import { resolveWorkshop2B2bArticleHeroImageUrl } from '@/lib/production/workshop2-b2b-article-hero-image';

export type Workshop2B2bBuyerTier = 'standard' | 'vip' | 'prebook';

export type Workshop2B2bCampaign = {
  collectionId: string;
  articleId: string;
  campaignName: string;
  /** Wave 23: «Early Bird v2» и supersedes. */
  versionLabel?: string;
  published: boolean;
  tier: Workshop2B2bBuyerTier;
  articleIds: string[];
  linesheet: Workshop2ShowroomLinesheetPayload;
  heroImageUrl?: string;
};

export function isWorkshop2B2bBuyerTier(v: string): v is Workshop2B2bBuyerTier {
  return v === 'standard' || v === 'vip' || v === 'prebook';
}

export function buyerTierCanSeeCampaign(input: {
  buyerTier: Workshop2B2bBuyerTier;
  campaignTier: Workshop2B2bBuyerTier;
}): boolean {
  const rank: Record<Workshop2B2bBuyerTier, number> = { standard: 0, prebook: 1, vip: 2 };
  return rank[input.buyerTier] >= rank[input.campaignTier];
}

export function syncWorkshop2CampaignArticleIdsFromDossier(
  dossier: Workshop2DossierPhase1,
  articleId: string
): string[] {
  const payload = buildWorkshop2ShowroomLinesheetPayload({
    collectionId: dossier.b2bIntegrationDraft?.campaignId ?? '',
    articleId,
    dossier,
  });
  const ids = new Set<string>([articleId]);
  for (const cw of payload.colorways) {
    if (cw.code) ids.add(`${articleId}-${cw.code}`);
  }
  return [...ids];
}

export function buildWorkshop2B2bCampaign(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  campaign?: Workshop2ShowroomCampaign | null;
  tier?: Workshop2B2bBuyerTier;
  articleIds?: string[];
}): Workshop2B2bCampaign {
  const linesheet = buildWorkshop2ShowroomLinesheetPayload({
    collectionId: input.collectionId,
    articleId: input.articleId,
    dossier: input.dossier,
    campaign: input.campaign ?? null,
  });
  const tier =
    input.tier ??
    (input.campaign?.visibilityTier && isWorkshop2B2bBuyerTier(input.campaign.visibilityTier)
      ? input.campaign.visibilityTier
      : 'standard');
  const heroImageUrl = resolveWorkshop2B2bArticleHeroImageUrl(input.dossier);
  return {
    collectionId: input.collectionId,
    articleId: input.articleId,
    campaignName: linesheet.campaignName ?? `${input.collectionId} · ${input.articleId}`,
    versionLabel: buildWorkshop2B2bLinesheetVersionLabel({
      campaignName: linesheet.campaignName,
      version: linesheet.version,
      supersedesId: linesheet.supersedesId,
    }),
    published: linesheet.published,
    tier,
    articleIds:
      input.articleIds ??
      syncWorkshop2CampaignArticleIdsFromDossier(input.dossier, input.articleId),
    linesheet,
    heroImageUrl,
  };
}

export type Workshop2B2bMatrixCell = {
  colorCode: string;
  colorLabel: string;
  size: string;
  moq: number;
  wholesalePriceRub: number;
  /** Wave 23: лучшая цена с учётом qtyBreaks при totalQty > 0. */
  bestPriceRub?: number;
  qty: number;
};

export type Workshop2B2bCatalogMatrix = {
  collectionId: string;
  articleId: string;
  currency: 'RUB';
  sizes: string[];
  colorways: Array<{ code: string; label: string }>;
  cells: Workshop2B2bMatrixCell[];
  preorderWindowRu?: Workshop2ShowroomLinesheetPayload['preorderWindowRu'];
};

/** Wave 29: сумма matrix cells (moq × bestPrice) для карточек linesheet. */
export function sumWorkshop2B2bMatrixTotalRub(matrix: Workshop2B2bCatalogMatrix): number {
  if (!matrix.cells.length) return 0;
  return matrix.cells.reduce((sum, cell) => {
    const price = cell.bestPriceRub ?? cell.wholesalePriceRub;
    const qty = Math.max(cell.moq, 1);
    return sum + price * qty;
  }, 0);
}

export function buildWorkshop2B2bCatalogMatrix(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  campaign?: Workshop2ShowroomCampaign | null;
}): Workshop2B2bCatalogMatrix {
  const linesheet = buildWorkshop2ShowroomLinesheetPayload({
    collectionId: input.collectionId,
    articleId: input.articleId,
    dossier: input.dossier,
    campaign: input.campaign ?? null,
  });
  const moq = Math.max(1, Math.round(linesheet.moq ?? 1));
  const wholesale = Math.round(linesheet.wholesalePrice ?? 0);
  const qtyBreaks: Workshop2B2bQtyPriceBreak[] | undefined = linesheet.qtyBreaks;
  const cells: Workshop2B2bMatrixCell[] = [];
  for (const cw of linesheet.colorways) {
    for (const size of linesheet.sizes) {
      cells.push({
        colorCode: cw.code,
        colorLabel: cw.label,
        size,
        moq,
        wholesalePriceRub: wholesale,
        bestPriceRub: qtyBreaks?.length
          ? resolveWorkshop2B2bBestWholesalePriceRub({
              totalQty: moq,
              basePriceRub: wholesale,
              qtyBreaks,
            })
          : wholesale,
        qty: 0,
      });
    }
  }
  return {
    collectionId: input.collectionId,
    articleId: input.articleId,
    currency: 'RUB',
    sizes: linesheet.sizes,
    colorways: linesheet.colorways.map((c) => ({ code: c.code, label: c.label })),
    cells,
    preorderWindowRu: linesheet.preorderWindowRu,
  };
}

export type Workshop2B2bCalendarEvent = {
  id: string;
  collectionId: string;
  articleId?: string;
  /** Оптовый заказ — привязка события к чату `b2b_order`. */
  b2bOrderId?: string;
  source: 'b2b';
  title: string;
  startAt: string;
  endAt: string;
  kind: 'delivery_window' | 'market_date' | 'preorder_window';
};

export function buildWorkshop2B2bCalendarEventsForCollection(input: {
  collectionId: string;
  campaigns: Workshop2B2bCampaign[];
}): Workshop2B2bCalendarEvent[] {
  const out: Workshop2B2bCalendarEvent[] = [];
  for (const c of input.campaigns) {
    const w = c.linesheet.preorderWindowRu;
    if (w?.startDate) {
      out.push({
        id: `b2b-preorder-${c.collectionId}-${c.articleId}-start`,
        collectionId: c.collectionId,
        articleId: c.articleId,
        source: 'b2b',
        title: `Предзаказ: ${c.campaignName}`,
        startAt: `${w.startDate}T09:00:00.000Z`,
        endAt: `${w.startDate}T18:00:00.000Z`,
        kind: 'preorder_window',
      });
    }
    if (w?.endDate) {
      out.push({
        id: `b2b-delivery-${c.collectionId}-${c.articleId}-end`,
        collectionId: c.collectionId,
        articleId: c.articleId,
        source: 'b2b',
        title: `Окно поставки: ${c.campaignName}`,
        startAt: `${w.endDate}T09:00:00.000Z`,
        endAt: `${w.endDate}T18:00:00.000Z`,
        kind: 'delivery_window',
      });
    }
    if (c.linesheet.windowStart) {
      out.push({
        id: `b2b-market-${c.collectionId}-${c.articleId}`,
        collectionId: c.collectionId,
        articleId: c.articleId,
        source: 'b2b',
        title: `Маркет: ${c.campaignName}`,
        startAt: `${c.linesheet.windowStart}T10:00:00.000Z`,
        endAt: `${c.linesheet.windowEnd ?? c.linesheet.windowStart}T17:00:00.000Z`,
        kind: 'market_date',
      });
    }
  }
  return out;
}
