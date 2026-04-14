import {
  getOperationalOrderNoteAuditLog,
  upsertOperationalNoteWithIdempotency,
} from '@/lib/order/v1/order-operational-annotations-store';

describe('order operational annotations store', () => {
  it('records audit on write and idempotent replay', () => {
    const key = `k-${Date.now()}`;
    upsertOperationalNoteWithIdempotency({
      orderId: 'B2B-0013',
      note: 'first',
      idempotencyKey: key,
    });
    upsertOperationalNoteWithIdempotency({
      orderId: 'B2B-0013',
      note: 'ignored',
      idempotencyKey: key,
    });
    const log = getOperationalOrderNoteAuditLog();
    expect(log.length).toBeGreaterThanOrEqual(2);
    const lastTwo = log.slice(-2);
    expect(lastTwo[0].replayed).toBe(false);
    expect(lastTwo[1].replayed).toBe(true);
  });
});
