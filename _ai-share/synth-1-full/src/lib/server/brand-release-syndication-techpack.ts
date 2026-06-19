import type { Product } from '@/lib/types';
import {
  buildBrandReleaseSyndicationRows,
  techPackGateMapFromReleaseRows,
} from '@/lib/fashion/brand-release-syndication';
import {
  buildBrandTechPackReleaseGateRows,
  resolveTechPackArticleIdForProduct,
} from '@/lib/fashion/brand-techpack-release-gate-rows';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** Server-side syndication rows with PG/file dossier tech pack gate. */
export async function buildBrandReleaseSyndicationRowsWithServerTechPack(input: {
  products: Product[];
  collectionId: string;
  limit?: number;
}) {
  const slice = input.products.slice(0, input.limit ?? 48);
  const dossierByArticle = new Map<string, Workshop2DossierPhase1 | null>();
  await Promise.all(
    slice.map(async (product) => {
      const articleId = resolveTechPackArticleIdForProduct(product);
      const record = await getWorkshop2ServerDossierRecord(input.collectionId, articleId);
      dossierByArticle.set(articleId, record?.dossier ?? null);
    })
  );
  const techPackRows = buildBrandTechPackReleaseGateRows({
    products: slice,
    collectionId: input.collectionId,
    resolveDossier: (articleId) => dossierByArticle.get(articleId) ?? null,
  });
  return buildBrandReleaseSyndicationRows(slice, {
    techPackBySku: techPackGateMapFromReleaseRows(techPackRows),
  });
}
