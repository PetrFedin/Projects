/**
 * @jest-environment node
 */
import { validateControlOutput } from '@/lib/contracts';
import {
  assertCommitmentControlInput,
  buildCommitmentControlOutput,
  calibrateCommitmentDeadlineRaw,
  mapCommitmentDeadlinePressure,
} from '@/lib/control-adapters/commitment-control-output';
import { mapOrderDeadlinePressure } from '@/lib/control-adapters/order-control-output';

function base(
  over: Record<string, unknown> = {}
): Parameters<typeof buildCommitmentControlOutput>[0] {
  return {
    commitment_id: 'cmt-1',
    as_of: '2026-06-10T12:00:00.000Z',
    commitment_kind: 'other',
    party_type: 'unknown',
    commitment_status: 'confirmed',
    ...over,
  } as Parameters<typeof buildCommitmentControlOutput>[0];
}

describe('commitment-control-output', () => {
  it('happy path: confirmed commitment produces valid ControlOutput', () => {
    const out = buildCommitmentControlOutput(base());
    expect(out.entity_ref.entity_type).toBe('commitment');
    expect(out.entity_ref.entity_id).toBe('cmt-1');
    expect(out.deadline_pressure).toBeDefined();
    expect(out.deadline_pressure.level).toBe('none');
    expect(validateControlOutput(out).ok).toBe(true);
  });

  it('always provides deadline_pressure object', () => {
    const out = buildCommitmentControlOutput(
      base({
        committed_date_ymd: '2026-06-15',
        commitment_status: 'in_progress',
        commitment_kind: 'production_po',
      })
    );
    expect(out.deadline_pressure.level).not.toBeUndefined();
    expect(validateControlOutput(out).ok).toBe(true);
  });

  it('rejects empty commitment_id', () => {
    expect(() => assertCommitmentControlInput(base({ commitment_id: '' }))).toThrow(
      /commitment_id/
    );
    expect(() => buildCommitmentControlOutput(base({ commitment_id: '   ' }))).toThrow(
      /commitment_id/
    );
  });

  it('allows explicit next_action: null to skip derivation', () => {
    const out = buildCommitmentControlOutput(
      base({
        commitment_status: 'requested',
        next_action: null,
      })
    );
    expect(out.next_action).toBeNull();
    expect(validateControlOutput(out).ok).toBe(true);
  });

  it('requested → derived confirm_commitment next_action', () => {
    const out = buildCommitmentControlOutput(base({ commitment_status: 'requested' }));
    expect(out.next_action?.source).toEqual({
      kind: 'derived',
      rule_id: 'commitment.derive.confirm_commitment',
    });
    expect(out.next_action?.action_type).toBe('REQUEST_CONFIRMATION');
    expect(out.risk).toBe('low');
  });

  it('requested + stale committed_date does not create deadline pressure or overdue blocker', () => {
    const out = buildCommitmentControlOutput(
      base({
        commitment_status: 'requested',
        committed_date_ymd: '2026-01-01',
        as_of: '2026-06-10T12:00:00.000Z',
        commitment_kind: 'production_po',
        is_capacity_confirmed: true,
      })
    );
    expect(out.deadline_pressure.level).toBe('none');
    expect(out.next_action?.source.rule_id).toBe('commitment.derive.confirm_commitment');
    expect(out.blocker_summary.count).toBe(0);
  });

  it('calibrateCommitmentDeadlineRaw clears pressure for draft with a date', () => {
    const raw = mapOrderDeadlinePressure('2026-01-01', '2026-06-10T12:00:00.000Z');
    expect(raw.level).toBe('overdue');
    const input = base({
      commitment_status: 'draft',
      committed_date_ymd: '2026-01-01',
    });
    expect(calibrateCommitmentDeadlineRaw(input, raw).level).toBe('none');
  });

  it('overdue committed date → overdue pressure + follow_up next', () => {
    const out = buildCommitmentControlOutput(
      base({
        commitment_kind: 'production_po',
        commitment_status: 'in_progress',
        is_capacity_confirmed: true,
        committed_date_ymd: '2026-06-01',
        as_of: '2026-06-10T12:00:00.000Z',
      })
    );
    expect(out.deadline_pressure.level).toBe('overdue');
    expect(out.next_action?.source).toEqual({
      kind: 'derived',
      rule_id: 'commitment.derive.follow_up_overdue',
    });
    expect(out.reasons.some((r) => r.code === 'LATE_COMMITMENT')).toBe(true);
  });

  it('received / completed suppresses stale deadline pressure', () => {
    const closed = base({
      commitment_status: 'received',
      committed_date_ymd: '2026-01-01',
    });
    const raw = mapOrderDeadlinePressure('2026-01-01', '2026-06-10T12:00:00.000Z');
    expect(raw.level).toBe('overdue');
    expect(mapCommitmentDeadlinePressure(closed, raw).level).toBe('none');

    const out = buildCommitmentControlOutput({
      ...closed,
      as_of: '2026-06-10T12:00:00.000Z',
    });
    expect(out.deadline_pressure.level).toBe('none');
    expect(out.risk).toBe('low');
    expect(out.next_action).toBeNull();
  });

  it('qc_hold → blocked rollup + resolve_qc next', () => {
    const out = buildCommitmentControlOutput(
      base({
        commitment_status: 'qc_hold',
        commitment_kind: 'production_po',
        is_qc_blocked: true,
      })
    );
    expect(out.status).toBe('blocked');
    expect(out.next_action?.source).toEqual({
      kind: 'derived',
      rule_id: 'commitment.derive.resolve_qc_hold',
    });
    expect(out.blocker_summary.count).toBeGreaterThanOrEqual(1);
  });
});
