/**
 * Server entry: real async spine handlers for sync jobs.
 */
import 'server-only';

import { dispatchSyncJobKindAsync } from './sync-jobs-handlers.server';
import {
  processQueuedSyncJobsAsync,
  retrySyncJobAsync,
  setSyncJobDispatch,
} from './sync-jobs-worker.service';

let initialized = false;

function ensureSyncJobWorkerServer(): void {
  if (initialized) return;
  setSyncJobDispatch(dispatchSyncJobKindAsync);
  initialized = true;
}

export async function processQueuedSyncJobsServer(limit = 10) {
  ensureSyncJobWorkerServer();
  return processQueuedSyncJobsAsync(limit);
}

export async function retrySyncJobServer(failedJobId: string) {
  ensureSyncJobWorkerServer();
  return retrySyncJobAsync(failedJobId);
}
