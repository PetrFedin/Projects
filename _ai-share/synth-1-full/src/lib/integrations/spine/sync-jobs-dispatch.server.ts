/**
 * @deprecated Count-only dispatch — use sync-jobs-handlers.server.ts (real upstream/import).
 * Kept for file-mirror introspection in diagnostics.
 */
import 'server-only';

import type { IntegrationSyncJob } from './sync-jobs-persistence.file';
import { listImportedOrdersForPlatform } from './imported-orders-persistence.file';
import { listAllocationQueue } from './allocation-queue-persistence.file';
import { listVendorPoRecords } from './vendor-po-persistence.file';
import { listCentricRfqRecords } from './centric-rfq-persistence.file';
import { listOrderTrackingShipments } from './order-tracking-persistence.file';
import { listProductionWipRecords } from './production-wip-persistence.file';
import type { SyncJobDispatchOutcome } from './sync-jobs-worker.service';

export type { SyncJobDispatchOutcome };

/** Legacy mirror counts — prefer dispatchSyncJobKindAsync. */
export function dispatchSyncJobKindServer(job: IntegrationSyncJob): SyncJobDispatchOutcome {
  try {
    switch (job.kind) {
      case 'orders_import':
        return { resultCount: listImportedOrdersForPlatform(job.platform).length };
      case 'tracking_sync':
        return {
          resultCount: listOrderTrackingShipments().filter(
            (s) => s.platform === job.platform || job.platform === 'syntha'
          ).length,
        };
      case 'vendor_po_import':
      case 'vendor_po_ack':
        return { resultCount: listVendorPoRecords().length };
      case 'rfq_ack':
        return { resultCount: listCentricRfqRecords().length };
      case 'allocation_sync':
        return { resultCount: listAllocationQueue(100).length };
      case 'wip_sync':
        return { resultCount: listProductionWipRecords().length };
      default:
        return { resultCount: 0 };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}
