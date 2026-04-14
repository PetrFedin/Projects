/**
 * @jest-environment node
 */
import type { NextAction } from '@/lib/contracts';
import { validateControlOutput } from '@/lib/contracts';
import {
  buildOrderControlOutput,
  calibrateOrderDeadlinePressure,
  mapOrderDeadlinePressure,
  orderControlInputFromB2BOrder,
  type OrderControlInput,
} from '@/lib/control-adapters/order-control-output';
import { mockB2BOrders } from '@/lib/order-data';

describe('order-control-output adapter', () => {
  const as_of = '2024-07-20T12:00:00.000Z';

  it('happy path: mock B2B order produces valid ControlOutput', () => {
    const input = orderControlInputFromB2BOrder(mockB2BOrders[1]!, as_of);
    const out = buildOrderControlOutput(input);
    expect(out.entity_ref.entity_type).toBe('order');
    expect(out.entity_ref.entity_id).toBe('B2B-0012');
    expect(out.deadline_pressure).toBeDefined();
    expect(out.blocker_summary.count).toBe(0);
    expect(validateControlOutput(out).ok).toBe(true);
  });

  it('deadline_pressure is always present (none when no valid date)', () => {
    const out = buildOrderControlOutput({
      order_id: 'X',
      commercial_status: 'Подтверждён',
      as_of,
      delivery_date: undefined,
    });
    expect(out.deadline_pressure.level).toBe('none');
  });

  it('rejects empty order_id before validation', () => {
    expect(() =>
      buildOrderControlOutput({
        order_id: '',
        commercial_status: 'Черновик',
        as_of,
      })
    ).toThrow(/order_id/);
  });

  it('no derivation signals: reserved-like order has no blockers and no next_action', () => {
    const out = buildOrderControlOutput({
      order_id: 'O1',
      commercial_status: 'Зарезервировано',
      as_of,
      delivery_date: '2024-09-15',
      payment_status: 'paid',
    });
    expect(out.blocker_summary.count).toBe(0);
    expect(out.next_action).toBeNull();
  });

  it('draft → derived submit_order when next_action omitted', () => {
    const out = buildOrderControlOutput({
      order_id: 'O-draft',
      commercial_status: 'Черновик',
      as_of,
      delivery_date: '2024-09-20',
    });
    expect(out.next_action?.source).toEqual({
      kind: 'derived',
      rule_id: 'order.derive.submit_order',
    });
    expect(out.next_action?.action_type).toBe('OTHER');
    expect(validateControlOutput(out).ok).toBe(true);
  });

  it('review (На проверке) → derived approve_order', () => {
    const out = buildOrderControlOutput({
      order_id: 'O-review',
      commercial_status: 'На проверке',
      as_of,
      delivery_date: '2024-09-01',
      payment_status: 'paid',
    });
    expect(out.next_action?.source).toEqual({
      kind: 'derived',
      rule_id: 'order.derive.approve_order',
    });
    expect(out.next_action?.action_type).toBe('SUBMIT_APPROVAL');
    expect(validateControlOutput(out).ok).toBe(true);
  });

  it('explicit next_action null skips derivation even for draft', () => {
    const out = buildOrderControlOutput({
      order_id: 'O1',
      commercial_status: 'Черновик',
      as_of,
      next_action: null,
    });
    expect(out.next_action).toBeNull();
  });

  it('overdue payment → payment blocker + request_payment next_action', () => {
    const input = orderControlInputFromB2BOrder(mockB2BOrders[2]!, as_of);
    const out = buildOrderControlOutput(input);
    expect(out.blocker_summary.count).toBeGreaterThanOrEqual(2);
    expect(out.blocker_summary.highest_severity).toBe('critical');
    expect(out.blocker_summary.top_blocker_ids.some((id) => id.includes('payment_overdue'))).toBe(
      true
    );
    expect(out.next_action?.source).toEqual({
      kind: 'derived',
      rule_id: 'order.derive.request_payment',
    });
    expect(validateControlOutput(out).ok).toBe(true);
  });

  it('missing delivery_date → readiness blocker only', () => {
    const out = buildOrderControlOutput({
      order_id: 'O-nodelivery',
      commercial_status: 'Согласован',
      as_of,
      payment_status: 'paid',
    });
    expect(out.blocker_summary.count).toBe(1);
    expect(out.blocker_summary.top_blocker_ids[0]).toContain('missing_delivery_date');
    expect(out.next_action).toBeNull();
  });

  it('embeds next_action when provided and valid', () => {
    const na: NextAction = {
      action_id: 'na-1',
      entity_ref: { entity_type: 'order', entity_id: 'O1' },
      action_type: 'SUBMIT_APPROVAL',
      reason: [{ code: 'MISSING_APPROVAL' }],
      owner: { role: 'brand_ops' },
      source: { kind: 'derived', rule_id: 'order.approval.v1' },
      status: 'open',
      explainability: { rule_id: 'order.approval.v1' },
    };
    const out = buildOrderControlOutput({
      order_id: 'O1',
      commercial_status: 'На проверке',
      as_of,
      next_action: na,
    });
    expect(out.next_action).toEqual(na);
    expect(validateControlOutput(out).ok).toBe(true);
  });

  it('throws when next_action is invalid', () => {
    const bad = {
      action_id: 'x',
      entity_ref: { entity_type: 'order' as const, entity_id: 'O1' },
      action_type: 'OTHER' as const,
      reason: [] as { code: 'MISSING_APPROVAL' }[],
      owner: { role: 'x' },
      source: { kind: 'derived' as const, rule_id: 'r' },
      status: 'open' as const,
      explainability: { rule_id: 'r' },
    } as NextAction;
    expect(() =>
      buildOrderControlOutput({
        order_id: 'O1',
        commercial_status: 'Черновик',
        as_of,
        next_action: bad,
      })
    ).toThrow(/next_action/);
  });

  it('mapOrderDeadlinePressure: overdue vs upcoming vs none (upcoming window = 3d)', () => {
    expect(mapOrderDeadlinePressure('2024-07-10', '2024-07-20T00:00:00Z').level).toBe('overdue');
    expect(mapOrderDeadlinePressure('2024-07-20', '2024-07-20T00:00:00Z').level).toBe('due_today');
    expect(mapOrderDeadlinePressure('2024-07-22', '2024-07-20T00:00:00Z').level).toBe('upcoming');
    expect(mapOrderDeadlinePressure('2024-07-25', '2024-07-20T00:00:00Z').level).toBe('none');
    expect(mapOrderDeadlinePressure('2024-09-20', '2024-07-20T00:00:00Z').level).toBe('none');
  });

  it('calibrateOrderDeadlinePressure clears pressure on shipped/delivered/invoiced', () => {
    const raw = { level: 'overdue' as const, next_deadline_at: '2020-01-01' };
    const base: OrderControlInput = {
      order_id: 'x',
      commercial_status: 'Отгружен',
      as_of: '2026-01-01T00:00:00Z',
    };
    expect(calibrateOrderDeadlinePressure(base, raw).level).toBe('none');
    expect(
      calibrateOrderDeadlinePressure({ ...base, commercial_status: 'В производстве' }, raw).level
    ).toBe('overdue');
  });

  it('Черновик without delivery_date: no missing_delivery blocker', () => {
    const out = buildOrderControlOutput({
      order_id: 'O-draft-nodelivery',
      commercial_status: 'Черновик',
      as_of,
    });
    expect(out.blocker_summary.count).toBe(0);
    expect(out.next_action?.source.rule_id).toBe('order.derive.submit_order');
  });

  it('Требует внимания → attention_review next_action', () => {
    const out = buildOrderControlOutput({
      order_id: 'O-att',
      commercial_status: 'Требует внимания',
      as_of,
      delivery_date: '2024-08-01',
      payment_status: 'paid',
    });
    expect(out.next_action?.source).toEqual({
      kind: 'derived',
      rule_id: 'order.derive.attention_review',
    });
    expect(
      out.blocker_summary.top_blocker_ids.some((id) => id.includes('requires_attention'))
    ).toBe(true);
  });
});
