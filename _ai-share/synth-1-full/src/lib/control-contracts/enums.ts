/**
 * Control / readiness contract enums.
 * @see docs/domain-model/control-contracts.md
 */

/** Anchor entity for ControlOutput / Blocker / NextAction */
export const CONTROL_ENTITY_TYPES = [
  'collection',
  'article',
  'sample',
  'order',
  'commitment',
  'shipment',
  'inventory_scope',
  'inventory_location',
  'sku_balance',
  'order_line',
  'support_case',
  'calendar_milestone',
] as const;
export type ControlEntityType = (typeof CONTROL_ENTITY_TYPES)[number];

export const CONTROL_STATUSES = ['ok', 'attention', 'critical', 'blocked'] as const;
export type ControlStatus = (typeof CONTROL_STATUSES)[number];

export const CONTROL_RISK_LEVELS = ['low', 'medium', 'high', 'severe'] as const;
export type ControlRiskLevel = (typeof CONTROL_RISK_LEVELS)[number];

export const BLOCKER_SEVERITIES = ['info', 'warning', 'error', 'critical'] as const;
export type BlockerSeverity = (typeof BLOCKER_SEVERITIES)[number];

export const BLOCKER_STATUSES = ['open', 'resolved', 'waived'] as const;
export type BlockerStatus = (typeof BLOCKER_STATUSES)[number];

export const NEXT_ACTION_STATUSES = ['open', 'done', 'cancelled'] as const;
export type NextActionStatus = (typeof NEXT_ACTION_STATUSES)[number];

export const READINESS_DIMENSION_STATES = ['ready', 'not_ready', 'unknown'] as const;
export type ReadinessDimensionState = (typeof READINESS_DIMENSION_STATES)[number];

export const DEADLINE_PRESSURES = ['none', 'upcoming', 'due_today', 'overdue'] as const;
export type DeadlinePressure = (typeof DEADLINE_PRESSURES)[number];

/**
 * Machine reason codes (extend as catalog grows).
 * Human copy lives in UI / i18n, not here.
 */
export const REASON_CODES = [
  'MISSING_APPROVAL',
  'LATE_COMMITMENT',
  'INVENTORY_SHORT',
  'COMPLIANCE_HOLD',
  'READINESS_GAP',
  'ORDER_PENDING_PAYMENT',
  'SAMPLE_NOT_APPROVED',
  'UNKNOWN',
] as const;
export type ReasonCode = (typeof REASON_CODES)[number];

export const BLOCKER_TYPES = [
  'MISSING_APPROVAL',
  'LATE_COMMITMENT',
  'INVENTORY_SHORT',
  'COMPLIANCE_HOLD',
  'READINESS_GAP',
  'OTHER',
] as const;
export type BlockerType = (typeof BLOCKER_TYPES)[number];

export const ACTION_TYPES = [
  'REQUEST_CONFIRMATION',
  'ESCALATE',
  'SUBMIT_APPROVAL',
  'CREATE_PO_AMENDMENT',
  'FOLLOW_UP_COMMITMENT',
  'OTHER',
] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

/**
 * Sell-facing availability snapshot for control readiness inputs.
 * Align with `SizeAvailabilityStatus` in lib/types when representing catalog PDP slice.
 * @see docs/domain-model/availability-engine.md
 */
export const AVAILABILITY_STATUSES = [
  'in_stock',
  'pre_order',
  'out_of_stock',
  'coming_soon',
] as const;
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];
