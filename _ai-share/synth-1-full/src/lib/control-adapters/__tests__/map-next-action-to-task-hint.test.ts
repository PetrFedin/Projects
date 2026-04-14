import type { NextAction } from '@/lib/contracts';
import { mapNextActionToTaskHint, nextActionShortLabel } from '@/lib/control-adapters/map-next-action-to-task-hint';

describe('mapNextActionToTaskHint', () => {
  const derivedPayment: NextAction = {
    action_id: 'derived:order:B2B-0011:request_payment',
    entity_ref: { entity_type: 'order', entity_id: 'B2B-0011' },
    action_type: 'REQUEST_CONFIRMATION',
    reason: [],
    owner: { role: 'finance_ops' },
    source: { kind: 'derived', rule_id: 'order.derive.request_payment' },
    status: 'open',
    explainability: { rule_id: 'order.derive.request_payment' },
  };

  it('maps derived order next_action to a short label and provenance', () => {
    expect(nextActionShortLabel(derivedPayment)).toBe('Запросить оплату');
    const v = mapNextActionToTaskHint(derivedPayment, {
      entityDisplayLabel: 'B2B-0011 · ЦУМ',
    });
    expect(v.actionLabel).toBe('Запросить оплату');
    expect(v.anchorLabel).toBe('B2B-0011 · ЦУМ');
    expect(v.provenanceLine).toContain('order.derive.request_payment');
    expect(v.provenanceLine).toContain('производное правило');
  });

  it('uses entity ref when display label omitted', () => {
    const v = mapNextActionToTaskHint(derivedPayment);
    expect(v.anchorLabel).toBe('order B2B-0011');
  });
});
