import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import {
  isPlatformCoreEmptyChainCollection,
  isPlatformCoreGoldenCollectionId,
  PLATFORM_CORE_DEMO_PRESETS,
} from '@/lib/platform-core-demo-context';
import {
  storageKeyForCollectionId,
  type LocalCollectionInventory,
} from '@/lib/production/local-collection-inventory';

/** Ключи articlesByCollection для SS27 / FW27 (не EMPTY27). */
export function platformCoreGoldenCollectionStorageKeys(): string[] {
  return Object.keys(PLATFORM_CORE_DEMO_PRESETS)
    .filter((id) => !isPlatformCoreEmptyChainCollection(id))
    .map((id) => storageKeyForCollectionId(id));
}

/** Убрать overlay артикулов golden-коллекций — состав только из PostgreSQL. */
export function stripPlatformCoreGoldenArticleOverlay(
  inv: LocalCollectionInventory
): LocalCollectionInventory {
  const keys = platformCoreGoldenCollectionStorageKeys();
  let changed = false;
  const articlesByCollection = { ...inv.articlesByCollection };
  for (const key of keys) {
    if (articlesByCollection[key]?.length) {
      delete articlesByCollection[key];
      changed = true;
    }
  }
  return changed ? { ...inv, articlesByCollection } : inv;
}

/** Platform Core + golden + PG: состав коллекции не пишем в localStorage. */
export function isWorkshop2PgAuthoritativeCollection(
  collectionId: string,
  pgServerAvailable: boolean
): boolean {
  return (
    isPlatformCoreMode() &&
    pgServerAvailable &&
    isPlatformCoreGoldenCollectionId(collectionId.trim())
  );
}
