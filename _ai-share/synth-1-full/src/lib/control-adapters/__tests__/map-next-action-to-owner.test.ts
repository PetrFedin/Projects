import type { NextAction } from '@/lib/contracts';
import { mapNextActionToOwner } from '@/lib/control-adapters/map-next-action-to-owner';

function na(
  partial: Partial<NextAction> & Pick<NextAction, 'entity_ref' | 'action_type'>
): NextAction {
  return {
    action_id: 't',
    reason: [{ code: 'UNKNOWN', params: {} }],
    owner: { role: 'brand_ops' },
    source: { kind: 'derived', rule_id: 'x' },
    status: 'open',
    explainability: { rule_id: 'x' },
    ...partial,
  } as NextAction;
}

describe('mapNextActionToOwner', () => {
  it('maps order rule_ids', () => {
    const base = {
      entity_ref: { entity_type: 'order' as const, entity_id: 'o1' },
      action_type: 'OTHER' as const,
    };
    expect(
      mapNextActionToOwner(
        na({ ...base, source: { kind: 'derived', rule_id: 'order.derive.request_payment' } })
      )
    ).toBe('finance');
    expect(
      mapNextActionToOwner(
        na({ ...base, source: { kind: 'derived', rule_id: 'order.derive.submit_order' } })
      )
    ).toBe('sales');
    expect(
      mapNextActionToOwner(
        na({ ...base, source: { kind: 'derived', rule_id: 'order.derive.approve_order' } })
      )
    ).toBe('sales');
    expect(
      mapNextActionToOwner(
        na({ ...base, source: { kind: 'derived', rule_id: 'order.derive.attention_review' } })
      )
    ).toBe('sales');
  });

  it('maps commitment rule_ids to production', () => {
    const base = {
      entity_ref: { entity_type: 'commitment' as const, entity_id: 'c1' },
      action_type: 'FOLLOW_UP_COMMITMENT' as const,
    };
    for (const rule_id of [
      'commitment.derive.follow_up_overdue',
      'commitment.derive.confirm_commitment',
      'commitment.derive.confirm_materials',
      'commitment.derive.confirm_capacity',
      'commitment.derive.resolve_qc_hold',
    ] as const) {
      expect(mapNextActionToOwner(na({ ...base, source: { kind: 'derived', rule_id } }))).toBe(
        'production'
      );
    }
  });

  it('maps article and sample approve to product', () => {
    expect(
      mapNextActionToOwner(
        na({
          entity_ref: { entity_type: 'article', entity_id: 'a1' },
          action_type: 'SUBMIT_APPROVAL',
          source: { kind: 'derived', rule_id: 'article.derive.approve_sample' },
        })
      )
    ).toBe('product');
    expect(
      mapNextActionToOwner(
        na({
          entity_ref: { entity_type: 'sample', entity_id: 's1' },
          action_type: 'SUBMIT_APPROVAL',
          source: { kind: 'derived', rule_id: 'sample.derive.approve_sample' },
        })
      )
    ).toBe('product');
  });

  it('returns unknown for ambiguous derived rule_id', () => {
    expect(
      mapNextActionToOwner(
        na({
          entity_ref: { entity_type: 'order', entity_id: 'o1' },
          action_type: 'OTHER',
          source: { kind: 'derived', rule_id: 'order.approval.v1' },
        })
      )
    ).toBe('unknown');
  });

  it('falls back by action_type when rule_id unknown', () => {
    expect(
      mapNextActionToOwner(
        na({
          entity_ref: { entity_type: 'order', entity_id: 'o1' },
          action_type: 'SUBMIT_APPROVAL',
          source: { kind: 'derived', rule_id: 'unknown' },
        })
      )
    ).toBe('sales');
  });

  it('returns unknown for null and assigned source', () => {
    expect(mapNextActionToOwner(null)).toBe('unknown');
    expect(
      mapNextActionToOwner(
        na({
          entity_ref: { entity_type: 'order', entity_id: 'o1' },
          action_type: 'OTHER',
          source: { kind: 'assigned', assigned_by: 'u1', assigned_at: '2026-01-01' },
        })
      )
    ).toBe('unknown');
  });
});
