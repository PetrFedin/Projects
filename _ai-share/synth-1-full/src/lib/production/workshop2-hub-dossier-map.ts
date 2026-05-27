/**
 * Карта досье для хаба: dual-write с Postgres.
 *
 * - **localStorage** (`loadWorkshop2HubDossierMapLocal`) — офлайн-кэш и мгновенные % ТЗ до ответа API.
 * - **API overlay** (`mergeWorkshop2HubDossierMapFromApi`) — при `backendStatus === server` подмешивает
 *   досье из PG поверх localStorage для видимых карточек (сервер выигрывает по полям досье).
 *
 * Метаданные строк коллекции (SKU, название, категория) остаются в `Workshop2LocalStateProvider`;
 * не дублируйте правки артикула только в localStorage, если карточка уже на PG — см. commit в workspace.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { loadWorkshop2DossierFromApi } from '@/lib/production/workshop2-api-client';
import {
  loadWorkshop2Phase1DossierMap,
  workshop2Phase1DossierStorageKey,
} from '@/lib/production/workshop2-phase1-dossier-storage';
import { stampWorkshop2HubPgOverlayOnDossier } from '@/lib/production/workshop2-hub-inventory-pg-overlay';
import {
  invalidateWorkshop2HubLocalDossierCacheEntry,
  isWorkshop2PgOnlyMode,
  summarizeWorkshop2HubInventoryDriftBatch,
} from '@/lib/production/workshop2-hub-pg-only-policy';

export type Workshop2HubArticleRef = { collectionId: string; articleId: string };

export type Workshop2HubDossierMergeOutcome = {
  map: Record<string, Workshop2DossierPhase1>;
  /** Ключи storage, где API miss → показан LS read-on-miss cache. */
  lsFallbackStorageKeys: string[];
};

/** Wave O — warning chip для hub toolbar при LS read-on-miss fallback. */
export function summarizeWorkshop2HubLsReadOnMiss(input: {
  lsFallbackStorageKeys: string[];
}): { labelRu: string; hintRu: string } | null {
  const n = input.lsFallbackStorageKeys.length;
  if (n === 0) return null;
  return {
    labelRu: `LS cache · ${n}`,
    hintRu: `PostgreSQL overlay недоступен для ${n} карточек — показан localStorage read-on-miss (не PG primary).`,
  };
}

/** Локальная карта (браузер) — read-on-miss cache; при PG-only primary write запрещён через shouldWorkshop2HubSkipLocalPrimaryWrite. */
export function loadWorkshop2HubDossierMapLocal(): Record<string, Workshop2DossierPhase1> {
  return loadWorkshop2Phase1DossierMap();
}

/** Wave 4: запрет primary write в LS при PG-only (fail-closed на клиенте). */
export function shouldWorkshop2HubSkipLocalPrimaryWrite(): boolean {
  return isWorkshop2PgOnlyMode();
}

/**
 * Подмешивает досье с сервера поверх localStorage для перечисленных артикулов.
 * Вызывать при postgres ok (см. useWorkshop2BackendStatusHint).
 */
export async function mergeWorkshop2HubDossierMapFromApi(
  local: Record<string, Workshop2DossierPhase1>,
  articles: Workshop2HubArticleRef[]
): Promise<Workshop2HubDossierMergeOutcome> {
  const out = { ...local };
  const lsFallbackStorageKeys: string[] = [];
  await Promise.all(
    articles.map(async ({ collectionId, articleId }) => {
      const key = workshop2Phase1DossierStorageKey(collectionId, articleId);
      const res = await loadWorkshop2DossierFromApi(collectionId, articleId);
      if (res.ok) {
        const stamped = stampWorkshop2HubPgOverlayOnDossier(res.data.dossier, {
          collectionId,
          articleId,
          serverVersion: res.data.version,
        });
        out[key] = stamped;
        const localEntry = local[key];
        if (
          localEntry &&
          summarizeWorkshop2HubInventoryDriftBatch({
            localMap: { [key]: localEntry },
            mergedMap: { [key]: stamped },
            articles: [{ collectionId, articleId }],
          }).driftCount > 0
        ) {
          invalidateWorkshop2HubLocalDossierCacheEntry({ collectionId, articleId });
        }
      } else if (local[key]) {
        lsFallbackStorageKeys.push(key);
      }
    })
  );
  return { map: out, lsFallbackStorageKeys };
}
