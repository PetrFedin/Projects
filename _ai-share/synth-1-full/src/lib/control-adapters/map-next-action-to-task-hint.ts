import type { NextAction } from '@/lib/contracts';
import { formatControlNextActionLine } from './control-signal-present';

/**
 * Read-only view model: maps ControlOutput.next_action into task-adjacent copy
 * without implying a persisted task or shared identity with Kanban rows.
 */
export interface NextActionTaskHintView {
  /** Short user-facing line (same semantics as narrow order control surfaces). */
  actionLabel: string;
  /** Anchor: order label, or entity_type + entity_id. */
  anchorLabel: string;
  /** How this relates to the task layer — always explicit. */
  provenanceLine: string;
}

/**
 * Task-adjacent copy: same wording as inline indicators when known; soft fallback for hints only.
 */
export function nextActionShortLabel(next: NextAction): string {
  return formatControlNextActionLine(next) ?? 'Следующий шаг (control-layer)';
}

function provenanceLine(next: NextAction): string {
  if (next.source.kind === 'derived') {
    return `Слой контроля · производное правило · ${next.source.rule_id}`;
  }
  return `Слой контроля · назначено · ${next.source.assigned_by}`;
}

/**
 * Pure mapper: NextAction → hint rows for task-adjacent UI. No I/O, no task ids as Kanban ids.
 */
export function mapNextActionToTaskHint(
  next: NextAction,
  options?: { entityDisplayLabel?: string }
): NextActionTaskHintView {
  const anchorLabel =
    options?.entityDisplayLabel?.trim() ||
    `${next.entity_ref.entity_type} ${next.entity_ref.entity_id}`;

  return {
    actionLabel: nextActionShortLabel(next),
    anchorLabel,
    provenanceLine: provenanceLine(next),
  };
}
