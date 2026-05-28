import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import {
  __resetIntegrationExportPersistenceForTests,
  enqueuePlatformExport,
  retryPlatformExport,
} from '@/lib/b2b/integrations/integration-export-persistence';

describe('integration-export-persistence', () => {
  let storeFile: string;

  beforeEach(async () => {
    __resetIntegrationExportPersistenceForTests();
    delete process.env.INTEGRATION_EXPORT_DATABASE_URL;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    storeFile = path.join(
      os.tmpdir(),
      `integration-export-${Date.now()}-${Math.random().toString(36).slice(2)}.json`
    );
    process.env.INTEGRATION_EXPORT_JOBS_FILE = storeFile;
  });

  afterEach(async () => {
    try {
      await fs.unlink(storeFile);
    } catch {
      /* ignore */
    }
    delete process.env.INTEGRATION_EXPORT_JOBS_FILE;
    delete process.env.INTEGRATION_EXPORT_DATABASE_URL;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    __resetIntegrationExportPersistenceForTests();
  });

  it('returns same job for repeated idempotency key', async () => {
    const a = await enqueuePlatformExport({ orderId: 'ord-1', idempotencyKey: 'idem-a' });
    const b = await enqueuePlatformExport({ orderId: 'ord-999', idempotencyKey: 'idem-a' });
    expect(a.exportJobId).toBe(b.exportJobId);
    expect(b.success).toBe(true);
    const raw = await fs.readFile(storeFile, 'utf8');
    const data = JSON.parse(raw) as { jobs: Record<string, unknown> };
    expect(Object.keys(data.jobs)).toContain(a.exportJobId);
  });

  it('retry flips simulated rejection to acceptance', async () => {
    const { exportJobId } = await enqueuePlatformExport({
      orderId: 'ord-2',
      simulateReject: true,
    });
    const r = await retryPlatformExport(exportJobId, { simulateReject: false });
    expect(r.success).toBe(true);
    expect(r.status).toBe('accepted');
  });
});
