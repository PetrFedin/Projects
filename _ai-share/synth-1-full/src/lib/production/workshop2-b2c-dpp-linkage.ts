/**
 * Wave 8 P1 #3: связка B2C PDP ↔ досье Workshop2 по b2cProductSlug в passport.
 * Client-safe: без server-only, fs и PG. Lookup — workshop2-b2c-dpp-linkage.server.ts.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2DppExportBlock,
  type Workshop2DppExportBlock,
} from '@/lib/production/workshop2-dpp-export';
import { validateWorkshop2DppJsonLdForExport } from '@/lib/production/workshop2-dpp-jsonld-validator';

export type Workshop2B2cDppLinkageHit = {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  b2cProductSlug: string;
};

export function resolveWorkshop2B2cProductSlugFromDossier(
  dossier: Workshop2DossierPhase1
): string | null {
  const slug = dossier.passportProductionBrief?.b2cProductSlug?.trim();
  return slug || null;
}

/** B2C PDP href — тот же slug, что ShopProductDppBadge на `/products/[slug]`. */
export function buildWorkshop2B2cShopProductHref(slug: string): string {
  const trimmed = slug.trim();
  return `/products/${encodeURIComponent(trimmed)}`;
}

export function isWorkshop2DppJsonLdExportReady(dossier: Workshop2DossierPhase1): boolean {
  const validation = dossier.dppExportValidation;
  if (validation?.state === 'ready' && validation.schemaState === 'valid') return true;
  const schema = validateWorkshop2DppJsonLdForExport({
    dossier,
    collectionId: '_',
    articleId: '_',
  });
  return schema.state === 'valid';
}

export type Workshop2B2cDppApiPayload = {
  available: boolean;
  b2cProductSlug: string;
  collectionId?: string;
  articleId?: string;
  jsonLd?: Record<string, unknown>;
  exportBlock?: Workshop2DppExportBlock;
  messageRu: string;
};

export function buildWorkshop2B2cDppApiPayload(input: {
  slug: string;
  hit: Workshop2B2cDppLinkageHit | null;
}): Workshop2B2cDppApiPayload {
  const slug = input.slug.trim();
  if (!input.hit) {
    return {
      available: false,
      b2cProductSlug: slug,
      messageRu: 'DPP: нет связанного досье Workshop2 для этого slug (b2cProductSlug в паспорте).',
    };
  }
  if (!isWorkshop2DppJsonLdExportReady(input.hit.dossier)) {
    return {
      available: false,
      b2cProductSlug: slug,
      collectionId: input.hit.collectionId,
      articleId: input.hit.articleId,
      messageRu:
        'DPP: досье связано, но JSON-LD export не готов — завершите валидацию в sustainability/DPP.',
    };
  }
  const exportBlock = buildWorkshop2DppExportBlock({
    dossier: input.hit.dossier,
    collectionId: input.hit.collectionId,
    articleId: input.hit.articleId,
  });
  const jsonLd = {
    '@context': exportBlock.jsonLdContext,
    '@type': 'Product',
    identifier: exportBlock.passportId,
    name: exportBlock.articleName ?? exportBlock.articleSku ?? input.hit.articleId,
    material: exportBlock.materials.map((m) => m.name),
    additionalProperty: exportBlock.colorways?.map((c) => ({
      name: 'colorway',
      value: c.label,
    })),
  };
  return {
    available: true,
    b2cProductSlug: slug,
    collectionId: input.hit.collectionId,
    articleId: input.hit.articleId,
    jsonLd,
    exportBlock,
    messageRu: `DPP доступен из досье ${input.hit.collectionId}/${input.hit.articleId}.`,
  };
}
