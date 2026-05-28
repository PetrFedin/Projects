/**
 * Control layer DTO shapes — contracts only, no aggregation logic.
 * @see docs/domain-model/control-contracts.md
 */

import type {
  ActionType,
  AvailabilityStatus,
  BlockerSeverity,
  BlockerStatus,
  BlockerType,
  ControlRiskLevel,
  ControlStatus,
  DeadlinePressure,
  NextActionStatus,
  ReadinessDimensionState,
  ReasonCode,
} from './enums';
import type { CommitmentRef, EntityRef } from './refs';

export interface ReasonPayload {
  code: ReasonCode;
  params?: Record<string, string>;
}

export interface BlockerSource {
  domain: string;
  record_type: string;
  record_id?: string;
  event_id?: string;
}

export interface ControlOwnerRef {
  role: string;
  user_id?: string;
}

export interface BlockerExplanation {
  codes: ReasonPayload[];
  params?: Record<string, string>;
}

export interface ResolutionCondition {
  type: string;
  predicate_ref: string;
}

export interface Blocker {
  blocker_id: string;
  entity_ref: EntityRef;
  commitment_ref?: CommitmentRef;
  blocker_type: BlockerType;
  severity: BlockerSeverity;
  source: BlockerSource;
  explanation: BlockerExplanation;
  owner: ControlOwnerRef;
  created_at: string;
  updated_at: string;
  resolution_condition: ResolutionCondition;
  status: BlockerStatus;
}

export type NextActionSource =
  | { kind: 'derived'; rule_id: string }
  | { kind: 'assigned'; assigned_by: string; assigned_at: string };

export interface NextActionExplainability {
  rule_id: string;
  inputs_hash?: string;
}

export interface NextAction {
  action_id: string;
  entity_ref: EntityRef;
  commitment_ref?: CommitmentRef;
  action_type: ActionType;
  reason: ReasonPayload[];
  owner: ControlOwnerRef;
  due_at?: string;
  source: NextActionSource;
  status: NextActionStatus;
  explainability: NextActionExplainability | string;
}

export interface ReadinessDimensionSummary {
  key: string;
  state: ReadinessDimensionState;
  gap_codes: ReasonPayload[];
}

export interface ReadinessSummary {
  dimensions: ReadinessDimensionSummary[];
  /** 0–1 rollup; optional summary only, not upstream truth */
  rollup_score?: number;
}

export interface BlockerSummary {
  count: number;
  highest_severity: BlockerSeverity;
  top_blocker_ids: string[];
}

export interface DeadlinePressureState {
  level: DeadlinePressure;
  next_deadline_at?: string;
}

import { ControlReasonCode } from '@/lib/control/reason-codes';

export type ControlSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ControlAction {
  id: string;
  type: 'manual' | 'automated';
  label: string;
  ownerRole: string;
  deadline?: string;
  /** Обоснование действия (Explainability) */
  reasonCode: ControlReasonCode;
  sourceEntityId: string;
}

export interface ControlOutput {
  /** [Phase 2] Новые поля */
  entityId?: string;
  entityType?: 'order' | 'article' | 'commitment' | 'collection' | 'sample' | 'inventory';
  readinessScore?: number; // 0-100
  blockers?: Array<{
    code: ControlReasonCode | any;
    message: string;
    refEntityId?: string;
  }>;
  nextAction?: ControlAction;
  links?: {
    dossierUrl?: string;
    techPackUrl?: string;
    orderUrl?: string;
  };
  risks?: Array<{
    code: ControlReasonCode | any;
    message: string;
    severity: ControlSeverity;
    explainedBy?: string;
  }>;

  /** [Legacy/Contracts] Старые поля для совместимости */
  entity_ref: EntityRef;
  commitment_ref?: CommitmentRef;
  status: ControlStatus | 'healthy' | 'at_risk' | 'blocked' | any;
  risk: ControlRiskLevel | any;
  blocker_summary: BlockerSummary;
  readiness_summary: ReadinessSummary;
  deadline_pressure: DeadlinePressureState;
  next_action: NextAction | null;
  owner?: ControlOwnerRef;
  reasons: ReasonPayload[];
  as_of: string;
  version: string | number | any;
  metadata?: {
    asOf: string;
    version: number;
    commitmentId?: string;
  };
}

/** Optional sell-facing input slice for readiness (control inputs), not ControlOutput itself */
export interface AvailabilityReadinessInput {
  status: AvailabilityStatus;
  channel?: string;
}
