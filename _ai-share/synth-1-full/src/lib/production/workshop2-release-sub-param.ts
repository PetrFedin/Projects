/**
 * Подвкладки панели «Производство» (release): deep link через `w2relsub`.
 */
export const WORKSHOP2_RELEASE_SUB_PARAM = 'w2relsub';

export type Workshop2ReleaseSubTab =
  | 'route'
  | 'operations'
  | 'order'
  | 'floor'
  | 'cut'
  | 'logistics'
  | 'timeline';

const VALID = new Set<string>([
  'route',
  'operations',
  'order',
  'floor',
  'cut',
  'logistics',
  'timeline',
]);

export function parseWorkshop2ReleaseSubParam(raw: string | null): Workshop2ReleaseSubTab {
  if (raw && VALID.has(raw)) return raw as Workshop2ReleaseSubTab;
  return 'route';
}

export const WORKSHOP2_RELEASE_SUB_TAB_LABELS_RU: Record<Workshop2ReleaseSubTab, string> = {
  route: 'Маршрут',
  operations: 'Операции',
  order: 'Статус заказа',
  floor: 'Пол цеха',
  cut: 'Cut ticket',
  logistics: 'Логистика',
  timeline: 'Timeline',
};

/** Порядок вкладок для sub-nav и JSON schema. */
export const WORKSHOP2_RELEASE_SUB_TABS_ORDER: Workshop2ReleaseSubTab[] = [
  'route',
  'operations',
  'order',
  'floor',
  'cut',
  'logistics',
  'timeline',
];

/** Видимые вкладки в primary sub-nav (4-я кнопка — «Ещё»). */
export const WORKSHOP2_RELEASE_SUB_TABS_PRIMARY: Workshop2ReleaseSubTab[] = [
  'route',
  'operations',
  'order',
];

/** Подвкладки в dropdown «Ещё» (floor / cut / logistics / timeline). */
export const WORKSHOP2_RELEASE_SUB_TABS_OVERFLOW: Workshop2ReleaseSubTab[] = [
  'floor',
  'cut',
  'logistics',
  'timeline',
];

export function isWorkshop2ReleaseSubTabInOverflow(tab: Workshop2ReleaseSubTab): boolean {
  return WORKSHOP2_RELEASE_SUB_TABS_OVERFLOW.includes(tab);
}
