/** @jest-environment node */

import {
  parseWorkshop2RepOfflineQueuePayload,
  resolveWorkshop2RepOfflineConflict,
} from '@/lib/production/workshop2-rep-offline-conflict';

describe('workshop2-rep-offline-conflict (Wave 59 starter)', () => {
  it('replay local when no server line', () => {
    const r = resolveWorkshop2RepOfflineConflict({
      localQty: 3,
      localCreatedAt: '2026-05-29T10:00:00.000Z',
      serverLine: null,
    });
    expect(r.action).toBe('replay_local');
  });

  it('server-wins when server newer and qty differs', () => {
    const r = resolveWorkshop2RepOfflineConflict({
      localQty: 5,
      localCreatedAt: '2026-05-29T10:00:00.000Z',
      serverLine: {
        skuId: 'sku-1',
        qty: 2,
        updatedAt: '2026-05-29T11:00:00.000Z',
      },
    });
    expect(r.action).toBe('drop_local_server_wins');
    if (r.action === 'drop_local_server_wins') expect(r.serverQty).toBe(2);
  });

  it('replay local when local newer', () => {
    const r = resolveWorkshop2RepOfflineConflict({
      localQty: 5,
      localCreatedAt: '2026-05-29T12:00:00.000Z',
      serverLine: {
        skuId: 'sku-1',
        qty: 2,
        updatedAt: '2026-05-29T11:00:00.000Z',
      },
    });
    expect(r.action).toBe('replay_local');
  });

  it('drop local when qty matches (idempotent)', () => {
    const r = resolveWorkshop2RepOfflineConflict({
      localQty: 4,
      localCreatedAt: '2026-05-29T10:00:00.000Z',
      serverLine: {
        skuId: 'sku-1',
        qty: 4,
        updatedAt: '2026-05-29T09:00:00.000Z',
      },
    });
    expect(r.action).toBe('drop_local_server_wins');
  });

  it('parseWorkshop2RepOfflineQueuePayload extracts sku/qty', () => {
    expect(parseWorkshop2RepOfflineQueuePayload({ skuId: 'A', qty: 2, size: 'M' })).toEqual({
      skuId: 'A',
      size: 'M',
      qty: 2,
    });
    expect(parseWorkshop2RepOfflineQueuePayload({ skuId: '', qty: 1 })).toBeNull();
  });
});
