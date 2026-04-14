/**
 * Shared read-only labels + compact Tailwind for control signals (Order / Article / Sample).
 * No React — safe from lib and tests. Does not change derivation logic.
 */
import type { ControlOutput, DeadlinePressure, NextAction } from '@/lib/contracts';
import type { ControlActionOwner } from './map-next-action-to-owner';
import { mapNextActionToOwner } from './map-next-action-to-owner';

export type { ControlActionOwner } from './map-next-action-to-owner';

/** Badge shell shared by inline Order/Article indicators. */
export const CONTROL_SIGNAL_BADGE_CLASS = 'px-1.5 py-0 text-[10px] font-medium leading-tight';

/** Secondary line under primary badge for next_action hint. */
export const CONTROL_NEXT_HINT_CLASS = 'text-[11px] leading-snug text-slate-500';

export function controlDeadlineLabel(level: Exclude<DeadlinePressure, 'none'>): string {
  switch (level) {
    case 'overdue':
      return 'Просрочено';
    case 'due_today':
      return 'Сегодня';
    case 'upcoming':
      return 'Скоро';
  }
}

export function controlDeadlineBadgeClass(level: Exclude<DeadlinePressure, 'none'>): string {
  switch (level) {
    case 'overdue':
      return 'border-red-200 bg-red-50 text-red-800';
    case 'due_today':
      return 'border-amber-200 bg-amber-50 text-amber-900';
    case 'upcoming':
      return 'border-sky-200 bg-sky-50 text-sky-800';
  }
}

function controlRiskSeverityClass(risk: 'high' | 'severe'): string {
  return risk === 'severe'
    ? 'border-red-300 bg-red-100 text-red-900'
    : 'border-orange-200 bg-orange-50 text-orange-900';
}

/**
 * Risk chip only for elevated states (same threshold everywhere).
 * `status === 'critical'` maps like severe — contract has no risk=critical.
 */
export function controlRiskChipFromOutput(control: ControlOutput): {
  label: string;
  className: string;
} | null {
  if (control.risk === 'severe') {
    return { label: 'Критично', className: controlRiskSeverityClass('severe') };
  }
  if (control.risk === 'high') {
    return { label: 'Высокий риск', className: controlRiskSeverityClass('high') };
  }
  if (control.status === 'critical') {
    return { label: 'Критично', className: controlRiskSeverityClass('severe') };
  }
  return null;
}

export function controlRiskTooltipTitle(control: ControlOutput): string {
  return `Риск: ${control.risk}${control.status === 'critical' ? ' · статус: critical' : ''}`;
}

/** Table/summary row: full risk line including medium/low. */
export function controlRiskSummaryText(control: ControlOutput): string {
  const chip = controlRiskChipFromOutput(control);
  if (chip) return chip.label;
  switch (control.risk) {
    case 'medium':
      return 'Средний';
    case 'low':
      return 'Низкий';
    default:
      return '—';
  }
}

/**
 * Short next-step line; rule_id first, then action_type with entity_ref disambiguation.
 * Unknown → null (no extra noise on dense rows).
 */
export function formatControlNextActionLine(next: NextAction | null | undefined): string | null {
  if (!next) return null;
  if (next.source.kind === 'derived') {
    switch (next.source.rule_id) {
      case 'order.derive.request_payment':
        return 'Запросить оплату';
      case 'order.derive.approve_order':
        return 'Проверить заказ';
      case 'order.derive.submit_order':
        return 'Отправить заказ';
      case 'order.derive.attention_review':
        return 'Разобрать заказ';
      case 'article.derive.approve_sample':
      case 'sample.derive.approve_sample':
        return 'Утвердить сэмпл';
      case 'article.derive.complete_b2b_release':
        return 'Закрыть готовность B2B';
      case 'article.derive.complete_linesheet':
        return 'Подготовить лайншит';
      case 'commitment.derive.resolve_qc_hold':
        return 'Снять блокировку QC';
      case 'commitment.derive.confirm_capacity':
        return 'Подтвердить мощность';
      case 'commitment.derive.confirm_materials':
        return 'Подтвердить материалы';
      case 'commitment.derive.follow_up_overdue':
        return 'Проверить исполнение';
      case 'commitment.derive.confirm_commitment':
        return 'Подтвердить у партнёра';
      default:
        break;
    }
  }
  switch (next.action_type) {
    case 'REQUEST_CONFIRMATION':
      if (next.entity_ref.entity_type === 'commitment') return 'Запросить подтверждение';
      return 'Запросить оплату';
    case 'SUBMIT_APPROVAL':
      if (next.entity_ref.entity_type === 'order') return 'Проверить заказ';
      if (next.entity_ref.entity_type === 'article' || next.entity_ref.entity_type === 'sample') {
        return 'Утвердить сэмпл';
      }
      return 'Согласовать';
    case 'FOLLOW_UP_COMMITMENT':
      if (next.entity_ref.entity_type === 'commitment') return 'Проверить исполнение';
      return 'Закрыть готовность B2B';
    default:
      return null;
  }
}

/** Human label for {@link ControlActionOwner}; internal buckets are not shown in UI. */
export function formatControlActionOwnerLabel(owner: ControlActionOwner): string | null {
  switch (owner) {
    case 'product':
      return 'Продукт';
    case 'production':
      return 'Производство';
    case 'sales':
      return 'Продажи';
    case 'finance':
      return 'Финансы';
    default:
      return null;
  }
}

/**
 * Same as {@link formatControlNextActionLine} plus a secondary ownership hint when known.
 * Non-authoritative; derived only from next_action shape.
 */
export function formatControlNextActionLineWithOwner(
  next: NextAction | null | undefined
): string | null {
  const line = formatControlNextActionLine(next);
  if (!line) return null;
  const label = formatControlActionOwnerLabel(mapNextActionToOwner(next));
  return label ? `${line} · ${label}` : line;
}

/**
 * Single place for UI + pilot dump: explicit next line, else order quiet hint when the row still surfaces.
 * @see buildPilotDumpPresentation
 */
export function formatControlPresentationNextLine(control: ControlOutput): string | null {
  return (
    formatControlNextActionLine(control.next_action) ??
    formatControlOrderQuietNextHint(control) ??
    formatControlCommitmentQuietNextHint(control)
  );
}

/** Same as {@link formatControlPresentationNextLine} with owner suffix when derived next maps to a bucket. */
export function formatControlPresentationNextLineWithOwner(control: ControlOutput): string | null {
  const withOwner = formatControlNextActionLineWithOwner(control.next_action);
  if (withOwner) return withOwner;
  return formatControlOrderQuietNextHint(control) ?? formatControlCommitmentQuietNextHint(control);
}

export function controlDeadlineTooltipTitle(
  nextDeadlineAt: string | undefined
): string | undefined {
  return nextDeadlineAt ? `Срок: ${nextDeadlineAt}` : undefined;
}

/** Same visibility rule as inline indicators + control-center row filter. */
export function controlSignalSurfaceVisible(control: ControlOutput): boolean {
  if (control.deadline_pressure.level !== 'none') return true;
  if (controlRiskChipFromOutput(control) != null) return true;
  if (formatControlNextActionLine(control.next_action) != null) return true;
  return false;
}

/**
 * Pilot dump / briefs: order has visible pressure or risk chip but no derived next_action —
 * explicit line so rows do not look like a silent adapter bug.
 */
export function formatControlOrderQuietNextHint(control: ControlOutput): string | null {
  if (control.entity_ref.entity_type !== 'order') return null;
  if (control.next_action != null) return null;
  if (!controlSignalSurfaceVisible(control)) return null;
  return 'Нет автоматического next · мониторинг';
}

/**
 * Same idea as {@link formatControlOrderQuietNextHint} for commitment rows (dump / brief / execution hint).
 */
export function formatControlCommitmentQuietNextHint(control: ControlOutput): string | null {
  if (control.entity_ref.entity_type !== 'commitment') return null;
  if (control.next_action != null) return null;
  if (!controlSignalSurfaceVisible(control)) return null;
  return 'Нет автоматического next · мониторинг';
}

function isDerivedArticleApproveSampleRule(n: ControlOutput['next_action']): boolean {
  return (
    n != null && n.source.kind === 'derived' && n.source.rule_id === 'article.derive.approve_sample'
  );
}

function isDerivedSampleApproveSampleRule(n: ControlOutput['next_action']): boolean {
  return (
    n != null && n.source.kind === 'derived' && n.source.rule_id === 'sample.derive.approve_sample'
  );
}

/**
 * When the linked article already carries approve-sample, sample UI/dump shows a pointer (article = primary).
 */
export function formatSampleNextLineDelegatedToArticle(
  sampleControl: ControlOutput,
  linkedArticleControl: ControlOutput | null | undefined,
  linkedArticleId: string | undefined
): string | null {
  const aid = linkedArticleId?.trim();
  if (
    aid &&
    linkedArticleControl &&
    isDerivedArticleApproveSampleRule(linkedArticleControl.next_action) &&
    isDerivedSampleApproveSampleRule(sampleControl.next_action)
  ) {
    return `См. артикул · ${aid}`;
  }
  return formatControlNextActionLine(sampleControl.next_action);
}

/**
 * Commitment-only surfaces (control-center block, operations hint): stricter than
 * {@link controlSignalSurfaceVisible}. Hides soft rows where only “Скоро” + medium risk
 * fire with no elevated chip and no next_action — reduces calendar noise.
 */
export function commitmentOperationalCueVisible(control: ControlOutput): boolean {
  if (!controlSignalSurfaceVisible(control)) return false;
  if (
    control.deadline_pressure.level === 'upcoming' &&
    control.risk === 'medium' &&
    controlRiskChipFromOutput(control) == null &&
    control.next_action == null
  ) {
    return false;
  }
  return true;
}

/** Enterprise table row / focus list: same priority as control-center order block (sorting only). */
export function controlPresentationPriorityScore(control: ControlOutput): number {
  let s = 0;
  switch (control.deadline_pressure.level) {
    case 'overdue':
      s += 100;
      break;
    case 'due_today':
      s += 60;
      break;
    case 'upcoming':
      s += 25;
      break;
    default:
      break;
  }
  if (control.risk === 'severe' || control.status === 'critical') s += 80;
  else if (control.risk === 'high') s += 45;
  else if (control.risk === 'medium') s += 15;
  if (control.next_action) s += 12;
  else if (formatControlOrderQuietNextHint(control)) s += 4;
  return s;
}

/** Plain-text risk column (NuORDER-style hex); no badges. */
export function controlRiskRowTextClass(control: ControlOutput): string {
  if (control.risk === 'severe' || control.status === 'critical')
    return 'font-medium text-[#D92D20]';
  if (control.risk === 'high') return 'font-medium text-[#D92D20]';
  if (control.risk === 'medium') return 'font-medium text-[#F79009]';
  if (control.risk === 'low') return 'font-medium text-[#12B76A]';
  return 'text-slate-400';
}

/** Plain-text deadline column. */
export function controlDeadlineRowTextClass(
  level: ControlOutput['deadline_pressure']['level']
): string {
  if (level === 'overdue') return 'font-medium text-[#D92D20]';
  if (level === 'due_today' || level === 'upcoming') return 'font-medium text-[#F79009]';
  return 'text-slate-400';
}
