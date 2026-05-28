/**
 * Block C — inspector offline PUT queue (#68).
 */
import {
  enqueueWorkshop2InspectorOfflinePut,
  flushWorkshop2InspectorOfflineQueue,
  resetWorkshop2InspectorOfflineQueueForTests,
  shouldEnqueueWorkshop2InspectorOffline,
  workshop2InspectorOfflineQueueDepth,
} from '@/lib/production/workshop2-inspector-offline-queue';

describe('workshop2 wave-c2 — inspector offline queue', () => {
  beforeEach(() => {
    resetWorkshop2InspectorOfflineQueueForTests();
  });

  it('enqueues and flushes to PG PUT', async () => {
    enqueueWorkshop2InspectorOfflinePut({
      collectionId: 'SS27',
      articleId: 'demo-01',
      sampleOrderId: 'ord-1',
      checkedItemIds: ['a', 'b'],
    });
    expect(workshop2InspectorOfflineQueueDepth()).toBe(1);

    const result = await flushWorkshop2InspectorOfflineQueue({
      save: async () => ({
        ok: true,
        report: {
          sampleOrderId: 'ord-1',
          collectionId: 'SS27',
          articleId: 'demo-01',
          checkedItemIds: ['a', 'b'],
          updatedAt: '2026-05-21T12:00:00.000Z',
        },
      }),
    });
    expect(result.flushed).toBe(1);
    expect(workshop2InspectorOfflineQueueDepth()).toBe(0);
  });

  it('shouldEnqueue on 503 / offline', () => {
    expect(shouldEnqueueWorkshop2InspectorOffline({ online: false, saveOk: false })).toBe(true);
    expect(
      shouldEnqueueWorkshop2InspectorOffline({ online: true, saveOk: false, status: 503 })
    ).toBe(true);
    expect(shouldEnqueueWorkshop2InspectorOffline({ online: true, saveOk: true })).toBe(false);
  });

  it('retries increment attempts until max', async () => {
    enqueueWorkshop2InspectorOfflinePut({
      collectionId: 'C',
      articleId: 'A',
      sampleOrderId: 'O',
      checkedItemIds: ['x'],
    });
    await flushWorkshop2InspectorOfflineQueue({
      save: async () => ({ ok: false, status: 503 }),
    });
    expect(workshop2InspectorOfflineQueueDepth()).toBe(1);
  });
});
