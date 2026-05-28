/**
 * Wave Z — честность score_prod vs catalog wire registries.
 * Wire-тесты проверяют только наличие API/UI path; они НЕ повышают score_prod.
 */
import type { Workshop2CatalogWireEntry } from '@/lib/production/workshop2-catalog-items-1-20-wire';

/** Единственный источник score_prod для integration ceilings — depth rating, не wire CI. */
export const WORKSHOP2_SCORE_PROD_RATING_MODULE =
  'src/lib/production/workshop2-production-depth-rating.ts';

/** Wire registry — structural guard; не substitute для filled dossier depth tests. */
export const WORKSHOP2_CATALOG_WIRE_HONESTY = {
  wireTestsAffectScoreProd: false,
  wireRegistryPurpose: 'static_api_ui_path_ci_guard',
  scoreProdSourceModule: WORKSHOP2_SCORE_PROD_RATING_MODULE,
  filledDossierDepthSuite: 'workshop2-wave41-production-depth.test.ts',
} as const;

/** Wire entries не должны содержать score/rating поля — иначе риск инфляции метрик. */
export function assertWorkshop2CatalogWireEntriesAreStructuralOnly(
  entries: Workshop2CatalogWireEntry[]
): { ok: true } | { ok: false; forbiddenKeys: string[] } {
  const forbidden = ['scoreProd', 'score_prod', 'rating', 'score10', 'prodReady'];
  const found: string[] = [];
  for (const entry of entries) {
    const serialized = JSON.stringify(entry);
    for (const key of forbidden) {
      if (serialized.includes(`"${key}"`)) {
        found.push(`${entry.id}:${key}`);
      }
    }
  }
  return found.length === 0 ? { ok: true } : { ok: false, forbiddenKeys: found };
}
