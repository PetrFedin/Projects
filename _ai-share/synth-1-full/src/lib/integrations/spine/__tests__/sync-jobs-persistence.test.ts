import fs from 'fs';
import os from 'os';
import path from 'path';

import { processQueuedSyncJobs, retrySyncJob } from '../sync-jobs-worker.service';
import {
  completeSyncJob,
  enqueueSyncJob,
  getSyncJob,
  listSyncJobs,
  markSyncJobRunning,
} from '../sync-jobs-persistence.file';

describe('sync-jobs-persistence', () => {
  let tmpFile: string;

  beforeEach(() => {
    tmpFile = path.join(os.tmpdir(), `sync-jobs-test-${Date.now()}.json`);
    process.env.B2B_INTEGRATION_SYNC_JOBS_FILE = tmpFile;
  });

  afterEach(() => {
    delete process.env.B2B_INTEGRATION_SYNC_JOBS_FILE;
    try {
      fs.unlinkSync(tmpFile);
    } catch {
      /* ok */
    }
  });

  it('enqueue without outcome stays queued', () => {
    const job = enqueueSyncJob({ platform: 'joor', kind: 'orders_import' });
    expect(job.status).toBe('queued');
    expect(job.finishedAt).toBeUndefined();
  });

  it('enqueue with resultCount runs queued→running→completed', () => {
    const job = enqueueSyncJob({ platform: 'nuorder', kind: 'tracking_sync', resultCount: 2 });
    expect(job.status).toBe('completed');
    expect(job.resultCount).toBe(2);
    expect(job.startedAt).toBeTruthy();
    expect(job.finishedAt).toBeTruthy();
  });

  it('enqueue with error marks failed', () => {
    const job = enqueueSyncJob({
      platform: 'joor',
      kind: 'orders_import',
      error: 'upstream timeout',
    });
    expect(job.status).toBe('failed');
    expect(job.error).toContain('timeout');
  });

  it('retry failed job completes new queued job', () => {
    const failed = enqueueSyncJob({ platform: 'joor', kind: 'orders_import', error: 'x' });
    const retried = retrySyncJob(failed.id);
    expect(retried?.status).toBe('completed');
    expect(retried?.platform).toBe('joor');
    expect(listSyncJobs(5).length).toBeGreaterThanOrEqual(2);
  });

  it('manual lifecycle transitions', () => {
    const job = enqueueSyncJob({ platform: 'syntha', kind: 'working_order' });
    markSyncJobRunning(job.id);
    expect(getSyncJob(job.id)?.status).toBe('running');
    completeSyncJob(job.id, 1);
    expect(getSyncJob(job.id)?.status).toBe('completed');
  });

  it('processQueuedSyncJobs completes queued jobs via kind dispatch', () => {
    const job = enqueueSyncJob({ platform: 'joor', kind: 'tracking_sync' });
    expect(job.status).toBe('queued');
    const processed = processQueuedSyncJobs(5);
    const done = processed.find((j) => j.id === job.id);
    expect(done?.status).toBe('completed');
    expect(done?.resultCount).toBe(1);
  });

  it('orders_import worker returns imported order count', () => {
    const job = enqueueSyncJob({ platform: 'joor', kind: 'orders_import' });
    const processed = processQueuedSyncJobs(5);
    const done = processed.find((j) => j.id === job.id);
    expect(done?.status).toBe('completed');
    expect(typeof done?.resultCount).toBe('number');
  });
});
