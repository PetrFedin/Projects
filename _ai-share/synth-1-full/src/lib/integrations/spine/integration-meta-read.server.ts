/**
 * Integration meta read-model: PG-primary → PG SoT, else file mirror.
 */
import 'server-only';

import type { OperationalOrderIntegration } from './integration-external-ref.schema';
import { getIntegrationMetaForOrder } from './integration-meta-persistence.file';
import { getIntegrationMetaFromPg } from './spine-operational-persistence.pg';
import {
  ensureSpineOperationalStoreReady,
  isSpineOperationalPgEnabled,
} from './spine-operational-store';
import { isSpineOperationalPgPrimary } from './spine-pg-hydrate-guards';

export async function getIntegrationMetaForOperationalUi(
  wholesaleOrderId: string
): Promise<OperationalOrderIntegration | undefined> {
  const id = wholesaleOrderId.trim();
  if (!id) return undefined;
  if (isSpineOperationalPgPrimary() && isSpineOperationalPgEnabled()) {
    await ensureSpineOperationalStoreReady(['meta']);
    const fromPg = await getIntegrationMetaFromPg(id);
    if (fromPg) return fromPg;
  }
  return getIntegrationMetaForOrder(id);
}
