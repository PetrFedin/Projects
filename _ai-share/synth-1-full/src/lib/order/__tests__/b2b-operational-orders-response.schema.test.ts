import { listB2BOrdersForOperationalUi } from '@/lib/order/b2b-orders-list-read-model';
import {
  operationalOrdersListSuccessSchema,
  operationalOrderDetailSuccessSchema,
  parseOperationalOrderErrorEnvelope,
} from '@/lib/order/b2b-operational-orders-response.schema';

describe('b2b-operational-orders-response.schema', () => {
  it('accepts list envelope built from operational read-model (payment overlay)', () => {
    const meta = { requestId: 't-1', mode: 'demo' as const };
    const probe = { ok: true as const, data: { orders: listB2BOrdersForOperationalUi() }, meta };
    expect(operationalOrdersListSuccessSchema.safeParse(probe).success).toBe(true);
  });

  it('accepts detail envelope for operational list row', () => {
    const meta = { requestId: 't-2', mode: 'demo' as const };
    const order = listB2BOrdersForOperationalUi().find((o) => o.order === 'B2B-0013')!;
    const probe = { ok: true as const, data: { order }, meta };
    expect(operationalOrderDetailSuccessSchema.safeParse(probe).success).toBe(true);
  });

  it('rejects list envelope when orders is not an array', () => {
    const meta = { requestId: 't-3', mode: 'demo' as const };
    const probe = { ok: true as const, data: { orders: {} }, meta };
    expect(operationalOrdersListSuccessSchema.safeParse(probe).success).toBe(false);
  });

  it('rejects detail envelope when order row is incomplete', () => {
    const meta = { requestId: 't-4', mode: 'demo' as const };
    const probe = {
      ok: true as const,
      data: { order: { order: 'X', status: 'ok' } },
      meta,
    };
    expect(operationalOrderDetailSuccessSchema.safeParse(probe).success).toBe(false);
  });

  it('parses jsonError envelope (NOT_FOUND)', () => {
    const meta = { requestId: 't-5', mode: 'prod' as const };
    const raw = {
      ok: false as const,
      error: { code: 'NOT_FOUND', message: 'missing' },
      meta,
    };
    const parsed = parseOperationalOrderErrorEnvelope(raw);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.error.code).toBe('NOT_FOUND');
    }
  });
});
