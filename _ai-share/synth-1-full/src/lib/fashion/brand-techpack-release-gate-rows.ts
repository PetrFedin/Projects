import type { Product } from '@/lib/types';
import { buildWorkshop2FinalTzExportContextFromDossier } from '@/lib/production/workshop2-final-tz-spec-export';
import { buildWorkshop2TechPackExportOptions } from '@/lib/production/workshop2-techpack-export-options';
import { assessWorkshop2TechPackReleaseGate } from '@/lib/production/workshop2-techpack-release-gate';
import { buildBrandTechPackExportSession } from '@/lib/production/workshop2-techpack-export-session';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';

export type BrandTechPackReleaseGateRow = {
  sku: string;
  slug: string;
  name: string;
  articleId: string;
  sheetsReady: number;
  sheetsTotal: number;
  qtyBridged: boolean;
  ready: boolean;
  factoryPackHref: string;
  factoryDossierHref: string;
  blockersRu: string[];
};

function emptyDossier(): Workshop2DossierPhase1 {
  return { schemaVersion: 1, assignments: [] };
}

/** Один SKU / артикул → строка release gate factory pack. */
export function buildBrandTechPackReleaseGateRow(input: {
  sku: string;
  slug: string;
  name: string;
  articleId: string;
  collectionId: string;
  dossier?: Workshop2DossierPhase1 | null;
  orderId?: string;
}): BrandTechPackReleaseGateRow {
  const dossier = input.dossier ?? emptyDossier();
  const ctx = buildWorkshop2FinalTzExportContextFromDossier(dossier, {
    articleId: input.articleId,
    exportLanguage: 'ru_en',
  });
  ctx.articleSku = input.sku.trim() || ctx.articleSku;
  ctx.articleName = input.name.trim() || ctx.articleName;
  const session = buildBrandTechPackExportSession({
    articleId: input.articleId,
    collectionId: input.collectionId,
    sku: input.sku,
    orderId: input.orderId,
  });
  const exportOptions = buildWorkshop2TechPackExportOptions({
    dossier,
    articleSku: input.sku,
    articleId: input.articleId,
    collectionId: input.collectionId,
    matrixHref: session.matrixQtyHref,
  });
  const gate = assessWorkshop2TechPackReleaseGate({ dossier, ctx, exportOptions });
  return {
    sku: input.sku,
    slug: input.slug,
    name: input.name,
    articleId: input.articleId,
    sheetsReady: gate.sheetsReady,
    sheetsTotal: gate.sheetsTotal,
    qtyBridged: gate.qtyBridged,
    ready: gate.ready,
    factoryPackHref: session.dossierAssignmentHref,
    factoryDossierHref: session.factoryDossierHref,
    blockersRu: gate.blockersRu,
  };
}

export function resolveTechPackArticleIdForProduct(product: Product): string {
  return product.id?.trim() || product.slug?.trim() || product.sku?.trim() || 'article';
}

export function buildBrandTechPackReleaseGateRows(input: {
  products: Product[];
  collectionId?: string;
  resolveDossier?: (articleId: string) => Workshop2DossierPhase1 | null | undefined;
  orderId?: string;
  limit?: number;
}): BrandTechPackReleaseGateRow[] {
  const collectionId = input.collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  const slice = input.products.slice(0, input.limit ?? 24);
  return slice.map((product) => {
    const articleId = resolveTechPackArticleIdForProduct(product);
    const dossier = input.resolveDossier?.(articleId) ?? null;
    return buildBrandTechPackReleaseGateRow({
      sku: product.sku,
      slug: product.slug,
      name: product.name,
      articleId,
      collectionId,
      dossier,
      orderId: input.orderId,
    });
  });
}

export function summarizeBrandTechPackReleaseGate(rows: BrandTechPackReleaseGateRow[]): {
  total: number;
  ready: number;
  pending: number;
} {
  const ready = rows.filter((r) => r.ready).length;
  return { total: rows.length, ready, pending: rows.length - ready };
}
