/**
 * @jest-environment node
 */
import type { Blocker, ControlOutput, NextAction } from '@/lib/control-contracts/contracts';
import {
  validateBlocker,
  validateControlOutput,
  validateEntityRef,
  validateNextAction,
  validateOperationalInteractionContext,
} from '@/lib/control-contracts/index';

const orderRef = { entity_type: 'order' as const, entity_id: 'o1' };

const baseBlocker = (): Blocker => ({
  blocker_id: 'b1',
  entity_ref: orderRef,
  blocker_type: 'MISSING_APPROVAL',
  severity: 'warning',
  source: { domain: 'order', record_type: 'Order' },
  explanation: { codes: [{ code: 'MISSING_APPROVAL' }] },
  owner: { role: 'brand_ops' },
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  resolution_condition: { type: 'approval_granted', predicate_ref: 'rule.order.approval' },
  status: 'open',
});

const baseNextAction = (): NextAction => ({
  action_id: 'a1',
  entity_ref: orderRef,
  action_type: 'SUBMIT_APPROVAL',
  reason: [{ code: 'MISSING_APPROVAL' }],
  owner: { role: 'brand_ops' },
  source: { kind: 'derived', rule_id: 'r1' },
  status: 'open',
  explainability: { rule_id: 'r1' },
});

const baseControlOutput = (): ControlOutput => ({
  entity_ref: orderRef,
  status: 'attention',
  risk: 'medium',
  blocker_summary: { count: 1, highest_severity: 'warning', top_blocker_ids: ['b1'] },
  readiness_summary: {
    dimensions: [
      { key: 'commercial', state: 'not_ready', gap_codes: [{ code: 'MISSING_APPROVAL' }] },
    ],
  },
  deadline_pressure: { level: 'upcoming' },
  next_action: null,
  reasons: [{ code: 'READINESS_GAP' }],
  as_of: '2026-01-01T00:00:00Z',
  version: 'v1',
});

describe('control-contracts validation', () => {
  it('validateEntityRef rejects empty entity_id', () => {
    const r = validateEntityRef({ entity_type: 'article', entity_id: '' });
    expect(r.ok).toBe(false);
  });

  it('validateBlocker requires entity_ref and source', () => {
    const b = { ...baseBlocker(), source: { domain: '', record_type: 'Order' } };
    expect(validateBlocker(b).ok).toBe(false);
    const noRef = { ...baseBlocker() } as Record<string, unknown>;
    delete noRef.entity_ref;
    expect(validateBlocker(noRef as unknown as Blocker).ok).toBe(false);
  });

  it('validateNextAction requires entity_ref, source, owner', () => {
    const a = { ...baseNextAction(), owner: { role: '' } };
    expect(validateNextAction(a).ok).toBe(false);
    const noSource = { ...baseNextAction() } as Record<string, unknown>;
    delete noSource.source;
    expect(validateNextAction(noSource as unknown as NextAction).ok).toBe(false);
  });

  it('validateControlOutput accepts minimal valid snapshot', () => {
    expect(validateControlOutput(baseControlOutput()).ok).toBe(true);
  });

  it('validateControlOutput requires deadline_pressure', () => {
    const o = { ...baseControlOutput() } as Record<string, unknown>;
    delete o.deadline_pressure;
    expect(validateControlOutput(o as unknown as ControlOutput).ok).toBe(false);
  });

  it('validateOperationalInteractionContext requires an anchor', () => {
    expect(validateOperationalInteractionContext({}).ok).toBe(false);
    expect(
      validateOperationalInteractionContext({
        entity_ref: orderRef,
      }).ok
    ).toBe(true);
  });
});
