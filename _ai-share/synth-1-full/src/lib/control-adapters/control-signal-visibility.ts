/**
 * Minimal subscription / preference layer: visibility decisions downstream of ControlOutput.
 * No delivery — prefs from caller and/or **`control-layer/control-signal-ui-prefs`** (localStorage + same-tab event).
 *
 * @see documentation/domain-model/notification-subscription.md
 */
import type {
  ControlEntityType,
  ControlOutput,
  ControlRiskLevel,
  EntityRef,
  ReasonCode,
} from '@/lib/contracts';
import { controlRiskChipFromOutput } from './control-signal-present';

const RISK_RANK: Record<ControlRiskLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
  severe: 3,
};

/** v0 preference bag — empty object = no filtering (current product behavior). */
export interface ControlSignalPreference {
  followEntityTypes?: ControlEntityType[];
  /** When only elevated risk drives the signal, require at least this level. */
  minRiskLevel?: 'medium' | 'high' | 'severe';
  mutedEntityRefs?: Array<{ entity_type: ControlEntityType; entity_id: string }>;
  mutedReasonCodes?: ReasonCode[];
  /** Requires `context.isEntityOwned`; if missing, treated as not applied (fail open). */
  ownedOnly?: boolean;
}

/**
 * v0 list-level “mute all order control augmentations”: `followEntityTypes` excludes `order`,
 * so every `ControlOutput` with `entity_ref.entity_type === 'order'` fails the follow filter.
 * UI may pass this from React state or from **`readBrandControlSignalUiPrefs()`** — still **visibility-only**,
 * not domain persistence and does not mutate `ControlOutput`.
 */
export const LIST_SUPPRESS_ORDER_CONTROL_SIGNALS: ControlSignalPreference = {
  followEntityTypes: ['article'],
};

/** v0: same pattern as orders — `followEntityTypes` without `article` suppresses article snapshots. */
export const LIST_SUPPRESS_ARTICLE_CONTROL_SIGNALS: ControlSignalPreference = {
  followEntityTypes: ['order'],
};

export interface ControlSignalVisibilityContext {
  isEntityOwned?: (ref: EntityRef) => boolean;
}

export interface ControlSignalVisibilityDecision {
  /** When false, hide control augmentations (chips + next line); primary entity UI unchanged. */
  surface: boolean;
  /** Why surface was turned off (debug / future UI). */
  suppressReason?:
    | 'muted_entity'
    | 'muted_reason'
    | 'entity_type'
    | 'risk_threshold'
    | 'owned_only';
}

function effectiveRiskRank(control: ControlOutput): number {
  const r = (RISK_RANK as any)[control.risk] ?? 0;
  if (control.status === 'critical') return Math.max(r, (RISK_RANK as any).severe);
  return r;
}

function minRiskRank(level: NonNullable<ControlSignalPreference['minRiskLevel']>): number {
  return RISK_RANK[level];
}

/**
 * True if this snapshot has at least one subscription-relevant facet (post-calibration semantics).
 */
export function isNotifyableControlCandidate(output: ControlOutput): boolean {
  if (controlRiskChipFromOutput(output) != null) return true;
  if (output.deadline_pressure.level !== 'none') return true;
  if (output.blocker_summary.count > 0) return true;
  if (output.next_action != null) return true;
  return false;
}

/** Risk-only candidate: no deadline / next / blockers; chip is the only driver. */
function riskOnlyCandidate(output: ControlOutput): boolean {
  const chip = controlRiskChipFromOutput(output);
  if (chip == null) return false;
  if (output.deadline_pressure.level !== 'none') return false;
  if (output.next_action != null) return false;
  if (output.blocker_summary.count > 0) return false;
  return true;
}

/**
 * Full decision object for consumers that need a reason code.
 */
export function resolveControlSignalVisibility(
  output: ControlOutput,
  preference: ControlSignalPreference = {},
  context?: ControlSignalVisibilityContext
): ControlSignalVisibilityDecision {
  if (!isNotifyableControlCandidate(output)) {
    return { surface: true };
  }

  const { mutedEntityRefs, mutedReasonCodes, followEntityTypes, minRiskLevel, ownedOnly } =
    preference;

  if (
    mutedEntityRefs?.some(
      (m) =>
        m.entity_type === output.entity_ref.entity_type &&
        m.entity_id === output.entity_ref.entity_id
    )
  ) {
    return { surface: false, suppressReason: 'muted_entity' };
  }

  if (
    mutedReasonCodes != null &&
    mutedReasonCodes.length > 0 &&
    output.reasons.some((r) => mutedReasonCodes.includes(r.code))
  ) {
    return { surface: false, suppressReason: 'muted_reason' };
  }

  if (
    followEntityTypes != null &&
    followEntityTypes.length > 0 &&
    !followEntityTypes.includes(output.entity_ref.entity_type)
  ) {
    return { surface: false, suppressReason: 'entity_type' };
  }

  if (
    minRiskLevel != null &&
    riskOnlyCandidate(output) &&
    effectiveRiskRank(output) < minRiskRank(minRiskLevel)
  ) {
    return { surface: false, suppressReason: 'risk_threshold' };
  }

  if (ownedOnly === true) {
    if (context?.isEntityOwned == null) {
      /* fail open */
    } else if (!context.isEntityOwned(output.entity_ref)) {
      return { surface: false, suppressReason: 'owned_only' };
    }
  }

  return { surface: true };
}

/** Convenience: should we show control augmentations for this output? */
export function shouldSurfaceControlSignal(
  output: ControlOutput,
  preference: ControlSignalPreference = {},
  context?: ControlSignalVisibilityContext
): boolean {
  return resolveControlSignalVisibility(output, preference, context).surface;
}
