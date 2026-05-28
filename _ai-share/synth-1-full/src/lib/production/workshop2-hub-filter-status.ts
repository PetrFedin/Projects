/**
 * Статус фильтров хаба: базовые + readiness/gold/sample (волна 13).
 */
import type { Workshop2HubFilterAdvanced } from '@/lib/production/workshop2-hub-filter';

export type Workshop2HubFilterStatus = {
  totalCount: number;
  visibleCount: number;
  advancedActive: boolean;
  state: 'empty' | 'filtered' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2HubFilterStatus(input: {
  totalCount: number;
  visibleCount: number;
  advanced?: Workshop2HubFilterAdvanced;
}): Workshop2HubFilterStatus {
  const advancedActive = Boolean(
    (input.advanced?.minTzPct ?? 0) > 0 ||
    input.advanced?.goldApprovedOnly ||
    input.advanced?.hasSampleOrderOnly
  );

  let state: Workshop2HubFilterStatus['state'] = 'ready';
  if (input.totalCount === 0) {
    state = 'empty';
  } else if (input.visibleCount < input.totalCount || advancedActive) {
    state = 'filtered';
  }

  let hintRu: string | undefined;
  if (state === 'empty') {
    hintRu = 'Нет артикулов в текущем scope.';
  } else if (advancedActive) {
    const parts: string[] = [];
    if ((input.advanced?.minTzPct ?? 0) > 0) {
      parts.push(`ТЗ ≥ ${input.advanced!.minTzPct}%`);
    }
    if (input.advanced?.goldApprovedOnly) parts.push('только gold approved');
    if (input.advanced?.hasSampleOrderOnly) parts.push('с sample-order');
    hintRu = `Фильтр: ${input.visibleCount}/${input.totalCount} · ${parts.join(', ')}.`;
  } else if (input.visibleCount < input.totalCount) {
    hintRu = `Показано ${input.visibleCount} из ${input.totalCount} после поиска/категорий/тегов.`;
  } else {
    hintRu = `Все ${input.totalCount} артикулов в фильтре; сохранённые пресеты — roadmap.`;
  }

  return {
    totalCount: input.totalCount,
    visibleCount: input.visibleCount,
    advancedActive,
    state,
    hintRu,
  };
}
