import { newUuid } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-mutations';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type {
  Workshop2DossierPhase1,
  Workshop2TzActionLogEntry,
  Workshop2TzActionLogPayload,
} from '@/lib/production/workshop2-dossier-phase1.types';

export const TZ_ACTION_LOG_MAX = 400;

export function normTzActorLabel(s: string): string {
  return s.trim().toLowerCase();
}

export function canRevokeTzSignoff(
  actorLabel: string,
  revokerLabels: readonly string[]
): boolean {
  const a = normTzActorLabel(actorLabel);
  if (!a) return false;
  return revokerLabels.some((r) => normTzActorLabel(r) === a);
}

export function pushTzActionLog(
  dossier: Workshop2DossierPhase1,
  by: string,
  action: Workshop2TzActionLogPayload
): Workshop2DossierPhase1 {
  const entry: Workshop2TzActionLogEntry = {
    entryId: newUuid(),
    at: new Date().toISOString(),
    by: by.slice(0, 200),
    action,
  };
  const prev = dossier.tzActionLog ?? [];
  const next = [...prev, entry];
  const overflow = next.length - TZ_ACTION_LOG_MAX;
  if (overflow > 0) next.splice(0, overflow);
  return { ...dossier, tzActionLog: next };
}

export function formatTzLogTimestamp(at: string): string {
  try {
    return new Date(at).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return at;
  }
}

export function formatTzActionLogDetailRu(
  e: Workshop2TzActionLogEntry,
  sectionLabelById: Record<DossierSection, string>
): {
  when: string;
  author: string;
  text: string;
} {
  const when = formatTzLogTimestamp(e.at);
  const author = e.by;
  if (e.action.type === 'dossier_edit') {
    const parts = e.action.summaries.filter(Boolean);
    const text =
      parts.length > 0 ? `Изменения данных: ${parts.join('; ')}` : 'Изменения данных (сохранение)';
    return { when, author, text };
  }
  if (e.action.type === 'sketch_labels_snapshot') {
    const lab = e.action.label?.trim() ? ` «${e.action.label.trim()}»` : '';
    return {
      when,
      author,
      text: `Снимок меток скетча${lab}: общий ${e.action.masterPins}, по листам ${e.action.sheetPinsTotal}`,
    };
  }
  if (e.action.type === 'sketch_labels_restore') {
    const lab = e.action.label?.trim() ? ` «${e.action.label.trim()}»` : '';
    const whenSnap = formatTzLogTimestamp(e.action.snapshotAt);
    return {
      when,
      author,
      text: `Восстановление меток из снимка${lab} (снимок от ${whenSnap})`,
    };
  }
  if (e.action.type === 'tz_global_signoff') {
    const who =
      e.action.role === 'designer'
        ? '«Цифровая подпись дизайнера»'
        : e.action.role === 'technologist'
          ? '«Цифровая подпись технолога»'
          : '«Цифровая подпись менеджера»';
    const verb = e.action.set ? 'проставлено' : 'снято';
    return { when, author, text: `${who} — ${verb}` };
  }
  if (e.action.type === 'tz_extra_signoff') {
    const verb = e.action.set ? 'проставлено' : 'снято';
    return {
      when,
      author,
      text: `Цифровая подпись ТЗ, роль «${e.action.roleTitle}» (${e.action.rowId}) — ${verb}`,
    };
  }
  if (e.action.type === 'section_signoff') {
    const sec = sectionLabelById[e.action.section];
    const side = e.action.role === 'brand' ? 'бренд' : 'технолог';
    const verb = e.action.set ? 'подтверждение' : 'снятие подтверждения';
    const org = e.action.signerOrganization?.trim();
    const orgBit = org ? ` · ${org}` : '';
    return { when, author, text: `Секция «${sec}», ${side}${orgBit} — ${verb}` };
  }
  if (e.action.type === 'tech_pack_integrity') {
    return { when, author, text: e.action.summary };
  }
  if (e.action.type === 'tech_pack_handoff') {
    return { when, author, text: e.action.detail };
  }
  if (e.action.type === 'tech_pack_factory_response') {
    return { when, author, text: e.action.detail };
  }
  if (e.action.type === 'final_tz_spec_export') {
    const fmt = e.action.format === 'pdf' ? 'печать/PDF' : 'HTML';
    return {
      when,
      author,
      text: `Итоговое ТЗ (${fmt}), снимок данных: ${e.action.dossierUpdatedAtSnapshot || '—'}`,
    };
  }
  return { when, author, text: 'Событие ТЗ' };
}
