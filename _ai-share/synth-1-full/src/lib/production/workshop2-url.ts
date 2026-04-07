/** Параметры вкладки «Цех 2»: выбранная коллекция и артикул внутри неё. */
export const WORKSHOP2_COL_PARAM = 'w2col';
export const WORKSHOP2_ART_PARAM = 'w2art';
/** `active` | `archive` */
export const WORKSHOP2_TAB_PARAM = 'w2tab';
/** Шаг карточки артикула: `1` — досье фазы 1, `2` — атрибуты следующей фазы. */
export const WORKSHOP2_STEP_PARAM = 'w2step';
/** Секция досье при открытии вкладки ТЗ: `general` | `visuals` | `material` | `construction` (legacy URL: measurements→construction, packaging→material). */
export const WORKSHOP2_DOSSIER_SECTION_PARAM = 'w2sec';
/**
 * Режим просмотра ТЗ по роли (`full` = без параметра). См. `parseWorkshop2DossierViewParam`.
 */
export const WORKSHOP2_DOSSIER_VIEW_PARAM = 'w2view';

/**
 * Вкладка карточки артикула: обзор, ТЗ или этап маршрута. Не путать с `w2tab` списка коллекций (`active` / `archive`).
 */
export const WORKSHOP2_ARTICLE_PANE_PARAM = 'w2pane';

const W2_ARTICLE_PANE_VALUES = new Set<string>([
  'overview',
  'tz',
  'supply',
  'fit',
  'plan',
  'release',
  'qc',
  'stock',
]);

/** `null` — параметра нет или значение неизвестно. */
export function parseWorkshop2ArticlePaneParam(raw: string | null): string | null {
  if (!raw || !W2_ARTICLE_PANE_VALUES.has(raw)) return null;
  return raw;
}

/** `id` обёрток вкладок артикула — подсветка после перехода с обзора. */
export const W2_ARTICLE_SECTION_DOM = {
  supply: 'w2article-section-supply',
  planPo: 'w2article-section-plan-po',
  planNest: 'w2article-section-plan-nest',
  release: 'w2article-section-release',
  qc: 'w2article-section-qc',
  fit: 'w2article-section-fit',
  stock: 'w2article-section-stock',
} as const;

import { isWorkshop2InternalArticleCodeValid } from '@/lib/production/local-collection-inventory';
import { SKETCH_FLOOR_QUERY_PARAM } from '@/lib/production/sketch-floor-url';

/** Базовый путь раздела (совпадает с ROUTES.brand.productionWorkshop2). */
export const WORKSHOP2_BASE_PATH = '/brand/production/workshop2';

/**
 * Сегмент пути `/a/:segment`: при наличии валидного внутреннего номера — он (6 цифр), иначе стабильный id строки коллекции.
 */
export function workshop2ArticleUrlSegment(internalArticleCode: string | undefined, lineId: string): string {
  return isWorkshop2InternalArticleCodeValid(internalArticleCode) ? internalArticleCode : lineId;
}

/** Отдельная страница артикула: досье, ТЗ и будущие вкладки. */
export function workshop2ArticlePath(collectionId: string, articleId: string): string {
  return `${WORKSHOP2_BASE_PATH}/c/${encodeURIComponent(collectionId)}/a/${encodeURIComponent(articleId)}`;
}

/** Query + hash для `workshop2ArticleHref` (согласованные ключи цеха 2). */
export type Workshop2ArticleHrefQuery = {
  /** `w2view`: режим просмотра ТЗ по роли (factory, designer, …). */
  w2view?: string;
  /** Режим пола скетча — только просмотр (`sketchFloor=1`). */
  sketchFloor?: boolean;
  w2step?: '1' | '2' | '3';
  /** `w2sec`: general | visuals | material | construction (и legacy в парсере). */
  w2sec?: string;
  /** `w2pane`: вкладка карточки артикула. */
  w2pane?: string;
  /** Fragment без `#`. */
  hash?: string;
};

/** Только query-строка цеха 2 (без path/hash) — общая основа для `workshop2ArticleHref` и внешних билдеров. */
export function workshop2ArticleHrefQueryToSearchParams(query: Workshop2ArticleHrefQuery): URLSearchParams {
  const sp = new URLSearchParams();
  if (query.w2view) sp.set(WORKSHOP2_DOSSIER_VIEW_PARAM, query.w2view);
  if (query.sketchFloor) sp.set(SKETCH_FLOOR_QUERY_PARAM, '1');
  if (query.w2step) sp.set(WORKSHOP2_STEP_PARAM, query.w2step);
  if (query.w2sec) sp.set(WORKSHOP2_DOSSIER_SECTION_PARAM, query.w2sec);
  if (query.w2pane) sp.set(WORKSHOP2_ARTICLE_PANE_PARAM, query.w2pane);
  return sp;
}

/**
 * Путь страницы артикула с query и hash — одна точка для Link, шаринга и копирования ссылок.
 */
export function workshop2ArticleHref(
  collectionId: string,
  articleSegment: string,
  query?: Workshop2ArticleHrefQuery
): string {
  const path = workshop2ArticlePath(collectionId, articleSegment);
  if (!query) return path;
  const q = workshop2ArticleHrefQueryToSearchParams(query).toString();
  const base = q ? `${path}?${q}` : path;
  const h = query.hash ? query.hash.replace(/^#/, '') : '';
  return h ? `${base}#${h}` : base;
}

/** Список артикулов коллекции на главной Цеха 2. */
export function workshop2CollectionListHref(collectionId: string): string {
  return `${WORKSHOP2_BASE_PATH}?${WORKSHOP2_COL_PARAM}=${encodeURIComponent(collectionId)}`;
}
