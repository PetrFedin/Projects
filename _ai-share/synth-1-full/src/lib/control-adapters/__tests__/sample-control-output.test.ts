import {
  assertSampleControlInput,
  buildSampleControlOutput,
  mapSampleDeadlinePressure,
} from '@/lib/control-adapters/sample-control-output';
import type { NextAction } from '@/lib/contracts';

const asOf = '2026-04-09T12:00:00.000Z';

describe('sample-control-output adapter', () => {
  it('happy path: approved → valid ControlOutput, sample anchor', () => {
    const out = buildSampleControlOutput({
      sample_id: 'smp-1',
      workflow_status: 'approved',
      as_of: asOf,
      display_label: 'Gold · FW26-JKT',
    });
    expect(out.entity_ref.entity_type).toBe('sample');
    expect(out.entity_ref.entity_id).toBe('smp-1');
    expect(out.status).toBe('ok');
    expect(out.risk).toBe('low');
    expect(out.next_action).toBeNull();
    expect(out.deadline_pressure.level).toBe('none');
    expect(out.readiness_summary.dimensions[0]?.state).toBe('ready');
  });

  it('deadline_pressure is always present (none without due date)', () => {
    const dp = mapSampleDeadlinePressure(undefined, asOf);
    expect(dp.level).toBe('none');
    const out = buildSampleControlOutput({
      sample_id: 'smp-2',
      workflow_status: 'pending',
      as_of: asOf,
    });
    expect(out.deadline_pressure).toBeDefined();
    expect(out.deadline_pressure.level).toBe('none');
  });

  it('rejects empty sample_id', () => {
    expect(() =>
      assertSampleControlInput({
        sample_id: '  ',
        workflow_status: 'pending',
        as_of: asOf,
      })
    ).toThrow(/sample_id/);
  });

  it('allows explicit next_action: null (no derivation)', () => {
    const out = buildSampleControlOutput({
      sample_id: 'smp-3',
      workflow_status: 'in_review',
      as_of: asOf,
      next_action: null,
    });
    expect(out.next_action).toBeNull();
  });

  it('in_review → derived approve_sample next_action + readiness not_ready', () => {
    const out = buildSampleControlOutput({
      sample_id: 'smp-4',
      workflow_status: 'in_review',
      article_id: 'art-2',
      as_of: asOf,
    });
    expect(out.next_action?.source).toEqual({
      kind: 'derived',
      rule_id: 'sample.derive.approve_sample',
    });
    expect(out.next_action?.entity_ref.entity_type).toBe('sample');
    expect(out.readiness_summary.dimensions[0]?.state).toBe('not_ready');
    expect(out.blocker_summary.count).toBeGreaterThanOrEqual(1);
  });

  it('deadline edge: pending with past due → overdue pressure + LATE_COMMITMENT blocker', () => {
    const out = buildSampleControlOutput({
      sample_id: 'smp-5',
      workflow_status: 'pending',
      due_at_ymd: '2026-04-01',
      as_of: asOf,
    });
    expect(out.deadline_pressure.level).toBe('overdue');
    expect(out.blocker_summary.top_blocker_ids.some((id) => id.includes('due_overdue'))).toBe(true);
  });

  it('embeds explicit next_action when valid', () => {
    const na: NextAction = {
      action_id: 'custom:sample:smp-6',
      entity_ref: { entity_type: 'sample', entity_id: 'smp-6' },
      action_type: 'OTHER',
      reason: [{ code: 'UNKNOWN', params: { x: 'y' } }],
      owner: { role: 'brand_ops' },
      source: { kind: 'assigned', assigned_by: 'u1', assigned_at: asOf },
      status: 'open',
      explainability: 'manual',
    };
    const out = buildSampleControlOutput({
      sample_id: 'smp-6',
      workflow_status: 'approved',
      as_of: asOf,
      next_action: na,
    });
    expect(out.next_action).toEqual(na);
  });
});
