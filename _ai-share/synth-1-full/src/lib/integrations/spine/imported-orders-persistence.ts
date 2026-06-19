/**
 * Facade: file store + PG mirror/hydrate for INT-* wholesale orders (ADR-002).
 */
import 'server-only';

export type {
  ImportedOperationalOrderRecord,
  ImportedOrdersFileV1,
} from './imported-orders-persistence.file';

export {
  findImportedOrderByExternalKey,
  getImportedLineItems,
  getImportedOrderRecord,
  getImportedOrderExternalKey,
  getImportedOrdersFilePath,
  listImportedOrdersAsB2B,
  listImportedOrdersForPlatform,
  patchImportedOrderFields,
  patchImportedOrderStatus,
  upsertImportedOrder,
} from './imported-orders-persistence.file';

export {
  ensureSpineImportedOrdersStoreReady,
  ensureSpineOperationalStoreReady,
  isSpineOperationalPgEnabled,
} from './spine-operational-store';

export { isSpineImportedOrdersPgEnabled } from './imported-orders-persistence.pg';
