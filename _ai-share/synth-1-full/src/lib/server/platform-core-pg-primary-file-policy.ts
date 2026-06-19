import 'server-only';

import { isSpineOperationalPgPrimary } from '@/lib/integrations/spine/spine-pg-hydrate-guards';
import { isWorkshop2PgOnlyMode } from '@/lib/production/workshop2-hub-pg-only-policy';
import { shouldSkipNativeJsonFileStores } from '@/lib/server/platform-core-spine-pg.server';

/** PG-primary: не писать JSON mirror для auxiliary platform-core stores (calendar tasks, section read). */
export function shouldPlatformCorePersistAuxiliaryToFile(): boolean {
  return !isSpineOperationalPgPrimary();
}

/** PG-primary: section-read keys из PG, не из file hydrate. */
export function shouldPlatformCoreReadAuxiliaryFromFile(): boolean {
  return shouldPlatformCorePersistAuxiliaryToFile();
}

/**
 * Workshop2 auxiliary JSON mirrors (dossier file store, contextual chat, b2b orders):
 * fail-closed when PG-only or spine PG-primary skips native JSON.
 */
export function shouldWorkshop2PersistAuxiliaryJsonToFile(): boolean {
  if (process.env.NODE_ENV === 'test' && process.env.WORKSHOP2_TEST_USE_PG !== '1') {
    return true;
  }
  return !isWorkshop2PgOnlyMode() && !shouldSkipNativeJsonFileStores();
}

export function shouldWorkshop2ReadAuxiliaryJsonFromFile(): boolean {
  return shouldWorkshop2PersistAuxiliaryJsonToFile();
}
