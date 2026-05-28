import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import { __resetDomainEventBusDedupeForTests, eventBus } from '@/lib/order/domain-events';
import { DomainEventTypes } from '@/lib/order/domain-event-catalog';
import {
  __resetDomainEventOutboxForTests,
  dispatchDomainEventOutboxByEventId,
  enqueueDomainEventOutbox,
  getDomainEventOutboxFilePath,
  getDomainEventOutboxStats,
  processPendingDomainEventOutbox,
} from '@/lib/order/domain-event-outbox';
import type { DomainEvent } from '@/lib/production/execution-linkage';

describe('domain-event-outbox', () => {
  let outboxFile: string;
  let publishSpy: jest.SpyInstance;

  const sampleEvent = (): DomainEvent => ({
    eventId: `evt-test-${Date.now()}`,
    occurredAt: new Date().toISOString(),
    aggregateId: 'order-1',
    aggregateType: 'order',
    version: 1,
    type: DomainEventTypes.order.b2bPlatformExportResult,
    payload: {
      orderId: 'order-1',
      exportJobId: 'job-1',
      provider: 'platform' as const,
      success: true,
      status: 'accepted' as const,
    },
    dedupeKey: 'test-dedupe',
  });

  beforeEach(() => {
    __resetDomainEventBusDedupeForTests();
    __resetDomainEventOutboxForTests();
    outboxFile = path.join(
      os.tmpdir(),
      `domain-outbox-${Date.now()}-${Math.random().toString(36).slice(2)}.json`
    );
    process.env.DOMAIN_EVENT_OUTBOX_FILE = outboxFile;
    publishSpy = jest.spyOn(eventBus, 'publish').mockResolvedValue(undefined);
  });

  afterEach(async () => {
    publishSpy.mockRestore();
    delete process.env.DOMAIN_EVENT_OUTBOX_FILE;
    __resetDomainEventOutboxForTests();
    try {
      await fs.unlink(outboxFile);
    } catch {
      /* ignore */
    }
  });

  it('persists pending then dispatches and marks sent', async () => {
    const ev = sampleEvent();
    await enqueueDomainEventOutbox(ev);
    const raw = await fs.readFile(getDomainEventOutboxFilePath(), 'utf8');
    const snap = JSON.parse(raw) as { entries: Record<string, { status: string }> };
    expect(snap.entries[ev.eventId]?.status).toBe('pending');

    await dispatchDomainEventOutboxByEventId(ev.eventId);
    expect(publishSpy).toHaveBeenCalledWith(expect.objectContaining({ eventId: ev.eventId }));

    const raw2 = await fs.readFile(getDomainEventOutboxFilePath(), 'utf8');
    const snap2 = JSON.parse(raw2) as { entries: Record<string, { status: string }> };
    expect(snap2.entries[ev.eventId]?.status).toBe('sent');
  });

  it('processPendingDomainEventOutbox flushes stuck pending', async () => {
    const ev = sampleEvent();
    await enqueueDomainEventOutbox(ev);
    publishSpy.mockClear();
    const n = await processPendingDomainEventOutbox(10);
    expect(n).toBeGreaterThanOrEqual(1);
    expect(publishSpy).toHaveBeenCalled();
  });

  it('returns outbox stats snapshot', async () => {
    const ev = sampleEvent();
    await enqueueDomainEventOutbox(ev);
    const before = await getDomainEventOutboxStats();
    expect(before.total).toBeGreaterThanOrEqual(1);
    expect(before.pending).toBeGreaterThanOrEqual(1);

    await dispatchDomainEventOutboxByEventId(ev.eventId);
    const after = await getDomainEventOutboxStats();
    expect(after.pending).toBe(0);
    expect(after.sent).toBeGreaterThanOrEqual(1);
  });
});
