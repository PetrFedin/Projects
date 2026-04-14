/**
 * Read-only presentation hint: who typically acts on this next_action.
 * Not assignment, not RBAC, not persisted — derived from rule_id / narrow action_type fallback only.
 */
import type { NextAction } from '@/lib/contracts';

export type ControlActionOwner = 'product' | 'production' | 'sales' | 'finance' | 'unknown';

export function mapNextActionToOwner(next: NextAction | null | undefined): ControlActionOwner {
  if (!next) return 'unknown';

  if (next.source.kind === 'derived') {
    switch (next.source.rule_id) {
      case 'order.derive.request_payment':
        return 'finance';
      case 'order.derive.submit_order':
        return 'sales';
      case 'order.derive.approve_order':
        return 'sales';
      case 'order.derive.attention_review':
        return 'sales';

      case 'commitment.derive.follow_up_overdue':
      case 'commitment.derive.confirm_commitment':
      case 'commitment.derive.confirm_materials':
      case 'commitment.derive.confirm_capacity':
      case 'commitment.derive.resolve_qc_hold':
        return 'production';

      case 'article.derive.approve_sample':
      case 'article.derive.complete_b2b_release':
      case 'article.derive.complete_linesheet':
      case 'sample.derive.approve_sample':
        return 'product';

      default:
        break;
    }
  }

  switch (next.action_type) {
    case 'REQUEST_CONFIRMATION':
      if (next.entity_ref.entity_type === 'commitment') return 'production';
      if (next.entity_ref.entity_type === 'order') return 'finance';
      return 'unknown';
    case 'SUBMIT_APPROVAL':
      if (next.entity_ref.entity_type === 'order') return 'sales';
      if (next.entity_ref.entity_type === 'article' || next.entity_ref.entity_type === 'sample') {
        return 'product';
      }
      return 'unknown';
    case 'FOLLOW_UP_COMMITMENT':
      if (next.entity_ref.entity_type === 'commitment') return 'production';
      if (next.entity_ref.entity_type === 'article') return 'product';
      return 'unknown';
    default:
      return 'unknown';
  }
}
