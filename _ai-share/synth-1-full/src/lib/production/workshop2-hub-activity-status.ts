/**
 * Журнал хаба: local + PG server events merge.
 */
import type { Workshop2ActivityEntry } from '@/lib/production/workshop2-activity-log';

export type Workshop2HubActivityStatus = {
  totalCount: number;
  serverCount: number;
  localCount: number;
  state: 'local_only' | 'merged' | 'empty';
  hintRu?: string;
};

export function summarizeWorkshop2HubActivityStatus(
  entries: Workshop2ActivityEntry[]
): Workshop2HubActivityStatus {
  const serverCount = entries.filter((e) => e.id.startsWith('srv-')).length;
  const localCount = entries.length - serverCount;

  let state: Workshop2HubActivityStatus['state'] = 'empty';
  if (entries.length === 0) {
    state = 'empty';
  } else if (serverCount > 0) {
    state = 'merged';
  } else {
    state = 'local_only';
  }

  let hintRu: string | undefined;
  if (state === 'empty') {
    hintRu = 'Журнал пуст — действия появятся при сохранении досье и sample-order.';
  } else if (state === 'local_only') {
    hintRu = `${localCount} событий только в браузере — PG audit недоступен или не загружен.`;
  } else {
    hintRu = `${entries.length} событий: ${serverCount} из PG audit + ${localCount} local.`;
  }

  return {
    totalCount: entries.length,
    serverCount,
    localCount,
    state,
    hintRu,
  };
}

/** Сокращает длинный detailRu журнала — truncate + «ещё N» (§4.14). */
export function formatWorkshop2HubActivityDetailRu(
  text: string,
  maxVisible = 96
): { visible: string; extraCount: number } {
  const trimmed = text.trim();
  const segments = trimmed.split(/\s*[·,]\s*/).filter(Boolean);
  if (segments.length > 2) {
    const visible = segments.slice(0, 2).join(' · ');
    return { visible, extraCount: segments.length - 2 };
  }
  if (trimmed.length <= maxVisible) {
    return { visible: trimmed, extraCount: 0 };
  }
  return { visible: `${trimmed.slice(0, maxVisible)}…`, extraCount: 0 };
}
