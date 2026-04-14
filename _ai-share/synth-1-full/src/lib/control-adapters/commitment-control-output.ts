/**
 * Narrow adapter: normalized execution commitment snapshot → ControlOutput.
 * Anchor is always `entity_type: 'commitment'` — linked order/article/sample ids are context only (reasons / params), not merged into entity_ref.
 *
 * Gap (explicit): no execution graph, no supplier registry, no WIP/receiving ledger — only this input bag.
 * Milestone / quoted_lead_time_days are accepted on input but not used for deadline_pressure v1 (avoid double timeline semantics).
 *
 * @see documentation/domain-model/notification-subscription.md (downstream consumers)
 * @see docs/domain-model/control-contracts.md (when available)
 */
import type {
  Blocker,
  ControlOutput,
  ControlOwnerRef,
  DeadlinePressureState,
  NextAction,
  ReadinessSummary,
  ReasonPayload,
} from '@/lib/contracts';
import { validateControlOutput, validateNextAction } from '@/lib/contracts';
import { mapOrderDeadlinePressure } from './order-control-output';
import { summarizeDerivedBlockers } from './order-control-derivations';
import {
  assertDerivationBlockerValid,
  assertDerivationNextActionValid,
} from './derivation-assertions';

export const COMMITMENT_CONTROL_ADAPTER_VERSION = 'commitment-control-output.v1.1';

export type CommitmentKind =
  | 'material_po'
  | 'production_po'
  | 'capacity_reservation'
  | 'sample_commitment'
  | 'subcontract'
  | 'other';

export type CommitmentPartyTypeInput =
  | 'factory'
  | 'supplier'
  | 'subcontractor'
  | 'internal_workshop'
  | 'unknown';

export type CommitmentStatusInput =
  | 'draft'
  | 'requested'
  | 'confirmed'
  | 'in_progress'
  | 'blocked'
  | 'qc_hold'
  | 'completed'
  | 'received'
  | 'cancelled';

export interface CommitmentControlInput {
  commitment_id: string;
  as_of: string;
  commitment_kind: CommitmentKind;
  party_type: CommitmentPartyTypeInput;
  party_id?: string;
  article_id?: string;
  sample_id?: string;
  order_id?: string;
  collection_id?: string;
  commitment_status: CommitmentStatusInput;
  quoted_lead_time_days?: number;
  committed_date_ymd?: string;
  actual_date_ymd?: string;
  milestone_date_ymd?: string;
  is_material_ready?: boolean;
  is_capacity_confirmed?: boolean;
  is_qc_blocked?: boolean;
  is_received?: boolean;
  owner?: ControlOwnerRef;
  display_label?: string;
  version?: string;
  /** undefined → derive; null → force no next_action. */
  next_action?: NextAction | null;
}

const TERMINAL_STATUSES = new Set<CommitmentStatusInput>(['completed', 'received', 'cancelled']);

const CAPACITY_RELEVANT_KINDS = new Set<CommitmentKind>([
  'production_po',
  'capacity_reservation',
  'subcontract',
]);

const MATERIAL_RELEVANT_KINDS = new Set<CommitmentKind>(['material_po']);

function ctxParams(input: CommitmentControlInput): Record<string, string> {
  const p: Record<string, string> = {
    commitment_kind: input.commitment_kind,
    commitment_status: input.commitment_status,
    party_type: input.party_type,
  };
  if (input.party_id) p.party_id = input.party_id;
  if (input.article_id) p.article_id = input.article_id;
  if (input.sample_id) p.sample_id = input.sample_id;
  if (input.order_id) p.order_id = input.order_id;
  if (input.collection_id) p.collection_id = input.collection_id;
  return p;
}

function commitmentEntityRef(input: CommitmentControlInput) {
  return {
    entity_type: 'commitment' as const,
    entity_id: input.commitment_id,
    label: input.display_label,
  };
}

function derivationSource(input: CommitmentControlInput): Blocker['source'] {
  return {
    domain: 'commitment',
    record_type: 'CommitmentControlDerivation',
    record_id: input.commitment_id,
  };
}

function isCommitmentClosed(input: CommitmentControlInput): boolean {
  if (TERMINAL_STATUSES.has(input.commitment_status)) return true;
  if (input.is_received === true) return true;
  const a = input.actual_date_ymd?.trim();
  if (a && a.length >= 10 && a[4] === '-' && a[7] === '-') return true;
  return false;
}

function qcActive(input: CommitmentControlInput): boolean {
  return input.is_qc_blocked === true || input.commitment_status === 'qc_hold';
}

function hasValidCommittedYmd(input: CommitmentControlInput): boolean {
  const d = input.committed_date_ymd?.trim();
  return !!(d && d.length >= 10 && d[4] === '-' && d[7] === '-');
}

/**
 * Unconfirmed commitments: `committed_date_ymd` is not treated as an operational promise for pressure
 * (avoids misleading overdue before confirmation).
 */
export function calibrateCommitmentDeadlineRaw(
  input: CommitmentControlInput,
  raw: DeadlinePressureState
): DeadlinePressureState {
  if (!hasValidCommittedYmd(input)) {
    return { level: 'none', next_deadline_at: undefined };
  }
  if (input.commitment_status === 'requested' || input.commitment_status === 'draft') {
    return { level: 'none', next_deadline_at: undefined };
  }
  return raw;
}

/**
 * Deadline vs `as_of` (date prefix), same upcoming window as order adapter.
 */
export function mapCommitmentDeadlinePressure(
  input: CommitmentControlInput,
  raw: DeadlinePressureState
): DeadlinePressureState {
  if (isCommitmentClosed(input)) {
    return { level: 'none', next_deadline_at: undefined };
  }
  return raw;
}

export function assertCommitmentControlInput(input: CommitmentControlInput): void {
  if (input.commitment_id == null || String(input.commitment_id).trim() === '') {
    throw new Error('CommitmentControlInput.commitment_id is required');
  }
  if (input.as_of == null || String(input.as_of).trim() === '') {
    throw new Error('CommitmentControlInput.as_of is required');
  }
}

function buildReadinessSummary(input: CommitmentControlInput): ReadinessSummary {
  const ctx = ctxParams(input);

  let confirmation: ReadinessSummary['dimensions'][0]['state'] = 'unknown';
  if (['confirmed', 'in_progress', 'completed', 'received'].includes(input.commitment_status)) {
    confirmation = 'ready';
  } else if (['requested', 'draft', 'blocked', 'qc_hold'].includes(input.commitment_status)) {
    confirmation = 'not_ready';
  }

  let material_gate: ReadinessSummary['dimensions'][0]['state'] = 'unknown';
  if (MATERIAL_RELEVANT_KINDS.has(input.commitment_kind)) {
    if (input.is_material_ready === true) material_gate = 'ready';
    else if (input.is_material_ready === false) material_gate = 'not_ready';
  }

  let capacity_gate: ReadinessSummary['dimensions'][0]['state'] = 'unknown';
  if (
    CAPACITY_RELEVANT_KINDS.has(input.commitment_kind) ||
    input.commitment_kind === 'sample_commitment'
  ) {
    if (input.is_capacity_confirmed === true) capacity_gate = 'ready';
    else if (input.is_capacity_confirmed === false) capacity_gate = 'not_ready';
  }

  let receiving_gate: ReadinessSummary['dimensions'][0]['state'] = 'unknown';
  if (input.is_received === true || input.commitment_status === 'received')
    receiving_gate = 'ready';
  else if (input.commitment_status === 'completed' && isCommitmentClosed(input))
    receiving_gate = 'ready';
  else if (input.is_received === false) receiving_gate = 'not_ready';

  const dimensions = [
    {
      key: 'confirmation',
      state: confirmation,
      gap_codes:
        confirmation === 'not_ready'
          ? [{ code: 'READINESS_GAP' as const, params: { ...ctx, dimension: 'confirmation' } }]
          : [],
    },
    {
      key: 'material_gate',
      state: material_gate,
      gap_codes:
        material_gate === 'not_ready'
          ? [{ code: 'READINESS_GAP' as const, params: { ...ctx, dimension: 'material_gate' } }]
          : [],
    },
    {
      key: 'capacity_gate',
      state: capacity_gate,
      gap_codes:
        capacity_gate === 'not_ready'
          ? [{ code: 'READINESS_GAP' as const, params: { ...ctx, dimension: 'capacity_gate' } }]
          : [],
    },
    {
      key: 'receiving_gate',
      state: receiving_gate,
      gap_codes:
        receiving_gate === 'not_ready'
          ? [{ code: 'READINESS_GAP' as const, params: { ...ctx, dimension: 'receiving_gate' } }]
          : [],
    },
  ];

  return { dimensions };
}

function mapCommitmentRollup(
  input: CommitmentControlInput,
  deadlineLevel: DeadlinePressureState['level']
): {
  status: ControlOutput['status'];
  risk: ControlOutput['risk'];
  reasons: ReasonPayload[];
} {
  const ctx = ctxParams(input);
  if (isCommitmentClosed(input)) {
    return {
      status: 'ok',
      risk: 'low',
      reasons: [{ code: 'UNKNOWN', params: { ...ctx, phase: 'closed' } }],
    };
  }

  if (qcActive(input)) {
    return {
      status: 'blocked',
      risk: 'severe',
      reasons: [{ code: 'COMPLIANCE_HOLD', params: { ...ctx, gate: 'qc' } }],
    };
  }

  if (input.commitment_status === 'blocked') {
    return {
      status: 'blocked',
      risk: deadlineLevel === 'overdue' ? 'severe' : 'high',
      reasons: [{ code: 'READINESS_GAP', params: { ...ctx, phase: 'blocked' } }],
    };
  }

  if (input.commitment_status === 'requested' || input.commitment_status === 'draft') {
    return {
      status: 'attention',
      risk: 'low',
      reasons: [{ code: 'READINESS_GAP', params: { ...ctx, phase: 'awaiting_confirmation' } }],
    };
  }

  if (deadlineLevel === 'overdue') {
    const severeGap = input.is_material_ready === false || input.is_capacity_confirmed === false;
    return {
      status: 'critical',
      risk: severeGap ? 'severe' : 'high',
      reasons: [{ code: 'LATE_COMMITMENT', params: { ...ctx } }],
    };
  }

  if (deadlineLevel === 'due_today' || deadlineLevel === 'upcoming') {
    return {
      status: 'attention',
      risk: 'medium',
      reasons: [
        {
          code: 'READINESS_GAP',
          params: { ...ctx, pressure: deadlineLevel, hint: 'deadline_near' },
        },
      ],
    };
  }

  return {
    status: 'ok',
    risk: 'low',
    reasons: [{ code: 'READINESS_GAP', params: { ...ctx, phase: 'on_track' } }],
  };
}

function deriveCommitmentBlockers(
  input: CommitmentControlInput,
  deadlineLevel: DeadlinePressureState['level']
): Blocker[] {
  if (isCommitmentClosed(input)) return [];

  const ref = commitmentEntityRef(input);
  const src = derivationSource(input);
  const ts = input.as_of;
  const out: Blocker[] = [];

  if (qcActive(input)) {
    const b: Blocker = {
      blocker_id: `derived:commitment:${input.commitment_id}:qc_hold`,
      entity_ref: ref,
      blocker_type: 'COMPLIANCE_HOLD',
      severity: 'critical',
      source: src,
      explanation: {
        codes: [{ code: 'COMPLIANCE_HOLD', params: { gate: 'qc' } }],
      },
      owner: { role: input.owner?.role ?? 'brand_ops', user_id: input.owner?.user_id },
      created_at: ts,
      updated_at: ts,
      resolution_condition: {
        type: 'qc_cleared',
        predicate_ref: 'rule.commitment.qc.not_blocked',
      },
      status: 'open',
    };
    assertDerivationBlockerValid(b, 'deriveCommitmentBlockers.qc_hold');
    out.push(b);
  }

  if (
    deadlineLevel === 'overdue' &&
    input.commitment_status !== 'requested' &&
    input.commitment_status !== 'draft'
  ) {
    const b: Blocker = {
      blocker_id: `derived:commitment:${input.commitment_id}:overdue`,
      entity_ref: ref,
      blocker_type: 'LATE_COMMITMENT',
      severity: 'error',
      source: src,
      explanation: { codes: [{ code: 'LATE_COMMITMENT', params: ctxParams(input) }] },
      owner: { role: input.owner?.role ?? 'brand_ops', user_id: input.owner?.user_id },
      created_at: ts,
      updated_at: ts,
      resolution_condition: {
        type: 'commitment_date_met_or_revised',
        predicate_ref: 'rule.commitment.date.current',
      },
      status: 'open',
    };
    assertDerivationBlockerValid(b, 'deriveCommitmentBlockers.overdue');
    out.push(b);
  }

  if (input.commitment_status === 'blocked' && !qcActive(input)) {
    const b: Blocker = {
      blocker_id: `derived:commitment:${input.commitment_id}:blocked`,
      entity_ref: ref,
      blocker_type: 'READINESS_GAP',
      severity: 'error',
      source: src,
      explanation: { codes: [{ code: 'READINESS_GAP', params: { phase: 'blocked' } }] },
      owner: { role: input.owner?.role ?? 'brand_ops', user_id: input.owner?.user_id },
      created_at: ts,
      updated_at: ts,
      resolution_condition: {
        type: 'blocker_cleared',
        predicate_ref: 'rule.commitment.not_blocked',
      },
      status: 'open',
    };
    assertDerivationBlockerValid(b, 'deriveCommitmentBlockers.blocked');
    out.push(b);
  }

  return out;
}

function deriveCommitmentNextAction(
  input: CommitmentControlInput,
  deadlineLevel: DeadlinePressureState['level']
): NextAction | null {
  if (isCommitmentClosed(input)) return null;

  const ref = commitmentEntityRef(input);
  const owner: ControlOwnerRef = {
    role: input.owner?.role ?? 'brand_ops',
    user_id: input.owner?.user_id,
  };

  if (qcActive(input)) {
    const a: NextAction = {
      action_id: `derived:commitment:${input.commitment_id}:resolve_qc`,
      entity_ref: ref,
      action_type: 'FOLLOW_UP_COMMITMENT',
      reason: [{ code: 'COMPLIANCE_HOLD', params: { gate: 'qc' } }],
      owner,
      source: { kind: 'derived', rule_id: 'commitment.derive.resolve_qc_hold' },
      status: 'open',
      explainability: { rule_id: 'commitment.derive.resolve_qc_hold' },
    };
    assertDerivationNextActionValid(a, 'deriveCommitmentNextAction.qc');
    return a;
  }

  if (CAPACITY_RELEVANT_KINDS.has(input.commitment_kind) && input.is_capacity_confirmed === false) {
    const a: NextAction = {
      action_id: `derived:commitment:${input.commitment_id}:confirm_capacity`,
      entity_ref: ref,
      action_type: 'REQUEST_CONFIRMATION',
      reason: [{ code: 'READINESS_GAP', params: { dimension: 'capacity' } }],
      owner,
      source: { kind: 'derived', rule_id: 'commitment.derive.confirm_capacity' },
      status: 'open',
      explainability: { rule_id: 'commitment.derive.confirm_capacity' },
    };
    assertDerivationNextActionValid(a, 'deriveCommitmentNextAction.capacity');
    return a;
  }

  if (MATERIAL_RELEVANT_KINDS.has(input.commitment_kind) && input.is_material_ready === false) {
    const a: NextAction = {
      action_id: `derived:commitment:${input.commitment_id}:confirm_materials`,
      entity_ref: ref,
      action_type: 'REQUEST_CONFIRMATION',
      reason: [{ code: 'READINESS_GAP', params: { dimension: 'material' } }],
      owner,
      source: { kind: 'derived', rule_id: 'commitment.derive.confirm_materials' },
      status: 'open',
      explainability: { rule_id: 'commitment.derive.confirm_materials' },
    };
    assertDerivationNextActionValid(a, 'deriveCommitmentNextAction.material');
    return a;
  }

  if (input.commitment_status === 'requested' || input.commitment_status === 'draft') {
    const a: NextAction = {
      action_id: `derived:commitment:${input.commitment_id}:confirm_commitment`,
      entity_ref: ref,
      action_type: 'REQUEST_CONFIRMATION',
      reason: [{ code: 'READINESS_GAP', params: { phase: 'confirm_commitment' } }],
      owner,
      source: { kind: 'derived', rule_id: 'commitment.derive.confirm_commitment' },
      status: 'open',
      explainability: { rule_id: 'commitment.derive.confirm_commitment' },
    };
    assertDerivationNextActionValid(a, 'deriveCommitmentNextAction.confirm');
    return a;
  }

  if (deadlineLevel === 'overdue') {
    const a: NextAction = {
      action_id: `derived:commitment:${input.commitment_id}:follow_up_overdue`,
      entity_ref: ref,
      action_type: 'FOLLOW_UP_COMMITMENT',
      reason: [{ code: 'LATE_COMMITMENT', params: {} }],
      owner,
      source: { kind: 'derived', rule_id: 'commitment.derive.follow_up_overdue' },
      status: 'open',
      explainability: { rule_id: 'commitment.derive.follow_up_overdue' },
    };
    assertDerivationNextActionValid(a, 'deriveCommitmentNextAction.overdue');
    return a;
  }

  return null;
}

/**
 * Build ControlOutput for one commitment anchor. Throws if contract validation fails.
 */
export function buildCommitmentControlOutput(input: CommitmentControlInput): ControlOutput {
  assertCommitmentControlInput(input);

  const d = input.committed_date_ymd?.trim();
  const rawDeadline = mapOrderDeadlinePressure(
    d && d.length >= 10 && d[4] === '-' && d[7] === '-' ? d : undefined,
    input.as_of
  );
  const calibratedRaw = calibrateCommitmentDeadlineRaw(input, rawDeadline);
  const deadline_pressure = mapCommitmentDeadlinePressure(input, calibratedRaw);

  const { status, risk, reasons } = mapCommitmentRollup(input, deadline_pressure.level);
  const readiness_summary = buildReadinessSummary(input);
  const derivedBlockers = deriveCommitmentBlockers(input, deadline_pressure.level);
  const blocker_summary = summarizeDerivedBlockers(derivedBlockers);

  let next: NextAction | null = null;
  if (input.next_action !== undefined) {
    if (input.next_action !== null) {
      const nv = validateNextAction(input.next_action);
      if (!nv.ok) throw new Error(`Invalid next_action: ${nv.errors.join('; ')}`);
      next = input.next_action;
    }
  } else {
    next = deriveCommitmentNextAction(input, deadline_pressure.level);
    if (next != null) {
      const nv = validateNextAction(next);
      if (!nv.ok) throw new Error(`Invalid derived next_action: ${nv.errors.join('; ')}`);
    }
  }

  const output: ControlOutput = {
    entity_ref: commitmentEntityRef(input),
    status,
    risk,
    blocker_summary,
    readiness_summary,
    deadline_pressure,
    next_action: next,
    owner: input.owner,
    reasons,
    as_of: input.as_of,
    version:
      input.version ??
      `${COMMITMENT_CONTROL_ADAPTER_VERSION}:${input.as_of.slice(0, 10)}:${input.commitment_id}`,
  };

  const v = validateControlOutput(output);
  if (!v.ok) throw new Error(`ControlOutput validation failed: ${v.errors.join('; ')}`);
  return output;
}
