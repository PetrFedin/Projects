/**
 * Colect — лукбуки, проекты, права. Контент: фото, видео, 3D; режимы показа.
 * Структура лукбука: главы, Key Looks, добавление в заказ — при появлении API.
 * Docs: https://docs.colect.io (user/sales-app/lookbook). Публичного API нет; типы и заглушки по документации.
 */

export type ColectContentType = 'photo' | 'video' | '3d';

export type ColectDisplayMode = 'gallery' | 'presentation' | 'fullscreen' | 'grid';

/** Медиа-элемент лукбука (фото, видео, 3D по документации Colect). */
export interface ColectContentItem {
  id: string;
  type: ColectContentType;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  /** Режим показа: галерея, презентация, полноэкран, сетка. */
  displayMode?: ColectDisplayMode;
  sort?: number;
  [key: string]: unknown;
}

/** Глава лукбука (при появлении API). */
export interface ColectChapter {
  id: string;
  title?: string;
  sort?: number;
  keyLookIds?: string[];
  content?: ColectContentItem[];
  [key: string]: unknown;
}

/** Key Look — сгруппированные позиции (добавление в заказ при появлении API). */
export interface ColectKeyLook {
  id: string;
  chapterId?: string;
  name?: string;
  skus?: string[];
  imageUrl?: string;
  content?: ColectContentItem[];
  sort?: number;
  [key: string]: unknown;
}

/** Структура лукбука: главы и Key Looks. */
export interface ColectLookbookStructure {
  id: string;
  name?: string;
  chapters?: ColectChapter[];
  keyLooks?: ColectKeyLook[];
  [key: string]: unknown;
}

/** Полезная нагрузка «добавить в заказ» по Key Look (при появлении API). */
export interface ColectAddToOrderPayload {
  lookbookId: string;
  keyLookId: string;
  skus: Array<{ sku: string; quantity: number }>;
  [key: string]: unknown;
}

/** Проверка: настроена ли интеграция Colect (при появлении API — env COLECT_API_URL / COLECT_ACCESS_TOKEN). */
export function isColectConfigured(): boolean {
  if (typeof process === 'undefined') return false;
  return !!(process.env.COLECT_API_URL || process.env.COLECT_ACCESS_TOKEN);
}

/** Получить структуру лукбука (главы, Key Looks). При отсутствии API — пустая заглушка. */
export async function colectGetLookbookStructure(
  _lookbookId: string
): Promise<ColectLookbookStructure | null> {
  if (!isColectConfigured()) {
    return {
      id: _lookbookId,
      name: 'Lookbook (API not configured)',
      chapters: [],
      keyLooks: [],
    };
  }
  // TODO: когда появится API — GET /lookbooks/:id/structure или аналог
  return { id: _lookbookId, name: '', chapters: [], keyLooks: [] };
}

/** Контент лукбука (фото, видео, 3D) и режимы показа. По документации Colect. */
export async function colectGetLookbookContent(
  _lookbookId: string,
  _options?: { chapterId?: string; type?: ColectContentType }
): Promise<ColectContentItem[]> {
  if (!isColectConfigured()) return [];
  // TODO: при появлении API — GET /lookbooks/:id/content
  return [];
}

/** Добавить Key Look в заказ. При появлении API — POST в Colect или в платформу. */
export async function colectAddKeyLookToOrder(
  _payload: ColectAddToOrderPayload
): Promise<{ success: boolean; orderLineIds?: string[]; error?: string }> {
  if (!isColectConfigured()) {
    return { success: false, error: 'Colect API not configured' };
  }
  // TODO: при появлении API — вызов Colect или создание строк в B2B заказе платформы
  return { success: false, error: 'API not yet available' };
}
