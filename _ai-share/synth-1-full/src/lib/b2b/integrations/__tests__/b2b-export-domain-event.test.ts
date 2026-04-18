import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import { exportOrderToProvider } from '@/lib/b2b/integrations/b2b-integration-service';
import { __resetIntegrationExportPersistenceForTests } from '@/lib/b2b/integrations/integration-export-persistence';
import {
  __resetDomainEventBusDedupeForTests,
  eventBus,
  DomainEventTypes,
} from '@/lib/order/domain-events';
import { __resetDomainEventOutboxForTests } from '@/lib/order/domain-event-outbox';

describe('B2B platform export → domain event', () => {
  let storeFile: string;
  let outboxFile: string;
  let publishSpy: jest.SpyInstance;

  beforeEach(() => {
    __resetDomainEventBusDedupeForTests();
    __resetIntegrationExportPersistenceForTests();
    __resetDomainEventOutboxForTests();
    delete process.env.INTEGRATION_EXPORT_DATABASE_URL;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    storeFile = path.join(
      os.tmpdir(),
      `b2b-export-ev-${Date.now()}-${Math.random().toString(36).slice(2)}.json`
    );
    outboxFile = path.join(
      os.tmpdir(),
      `b2b-export-outbox-${Date.now()}-${Math.random().toString(36).slice(2)}.json`
    );
    process.env.INTEGRATION_EXPORT_JOBS_FILE = storeFile;
    process.env.DOMAIN_EVENT_OUTBOX_FILE = outboxFile;
    publishSpy = jest.spyOn(eventBus, 'publish').mockResolvedValue(undefined);
  });

  afterEach(async () => {
    publishSpy.mockRestore();
    try {
      await fs.unlink(storeFile);
    } catch {
      /* ignore */
    }
    try {
      await fs.unlink(outboxFile);
    } catch {
      /* ignore */
    }
    delete process.env.INTEGRATION_EXPORT_JOBS_FILE;
    delete process.env.DOMAIN_EVENT_OUTBOX_FILE;
    delete process.env.INTEGRATION_EXPORT_DATABASE_URL;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    __resetIntegrationExportPersistenceForTests();
    __resetDomainEventOutboxForTests();
  });

  it('publishes order.b2b_platform_export_result on first export', async () => {
    await exportOrderToProvider(
      'platform',
      { orderId: 'o-domain-1' },
      { idempotencyKey: 'idem-domain-1' }
    );
    const exportEvents = publishSpy.mock.calls.filter(
      (c) => (c[0] as { type?: string }).type === DomainEventTypes.order.b2bPlatformExportResult
    );
    expect(exportEvents).toHaveLength(1);
    const ev = exportEvents[0][0] as { dedupeKey?: string; correlationId?: string };
    expect(ev.dedupeKey).toBe('b2b-platform-export:idem:idem-domain-1');
    expect(ev.correlationId).toBe('idem-domain-1');
  });

  it('does not publish again on idempotent replay', async () => {
    await exportOrderToProvider(
      'platform',
      { orderId: 'o-domain-2' },
      { idempotencyKey: 'idem-domain-2' }
    );
    publishSpy.mockClear();
    await exportOrderToProvider(
      'platform',
      { orderId: 'o-other' },
      { idempotencyKey: 'idem-domain-2' }
    );
    const exportEvents = publishSpy.mock.calls.filter(
      (c) => (c[0] as { type?: string }).type === DomainEventTypes.order.b2bPlatformExportResult
    );
    expect(exportEvents).toHaveLength(0);
  });
});
