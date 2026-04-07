/**
 * Локальная история действий в Цехе 2 (localStorage), без API.
 */

const STORAGE_KEY = 'synth.brand.workshop2ActivityLog.v1';
const MAX_ENTRIES = 250;

export type Workshop2ActivityEntry = {
  id: string;
  at: string;
  /** Короткая строка для списка в UI. */
  line: string;
  /** Кто выполнил действие (email / имя), если известно. */
  actor?: string;
  /** Привязка к артикулу (новые записи); старые записи без полей. */
  collectionId?: string;
  articleId?: string;
};

export type Workshop2ArticleHistoryRow = {
  id: string;
  at: string;
  /** Откуда событие: журнал, досье, инвентарь. */
  scope: string;
  summary: string;
  actor?: string;
};

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function loadWorkshop2Activity(): Workshop2ActivityEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw) as { v?: number; entries?: Workshop2ActivityEntry[] };
    if (p?.v !== 1 || !Array.isArray(p.entries)) return [];
    return p.entries
      .filter(
        (e) => e && typeof e.id === 'string' && typeof e.line === 'string' && typeof e.at === 'string'
      )
      .map((e) => {
        const rec = e as Record<string, unknown>;
        const collectionId = typeof rec.collectionId === 'string' ? rec.collectionId : undefined;
        const articleId = typeof rec.articleId === 'string' ? rec.articleId : undefined;
        return {
          ...e,
          ...(collectionId ? { collectionId } : {}),
          ...(articleId ? { articleId } : {}),
        } as Workshop2ActivityEntry;
      });
  } catch {
    return [];
  }
}

function save(entries: Workshop2ActivityEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, entries }));
  } catch {
    /* quota */
  }
}

/** Добавить запись (новые сверху). */
export function appendWorkshop2Activity(line: string, actor?: string): void {
  const at = new Date().toISOString();
  const a = actor?.trim();
  const entry: Workshop2ActivityEntry = { id: newId(), at, line, ...(a ? { actor: a } : {}) };
  const prev = loadWorkshop2Activity();
  save([entry, ...prev].slice(0, MAX_ENTRIES));
}

/** Запись в журнале, привязанная к артикулу (для истории на карточке SKU). */
export function appendWorkshop2ArticleActivity(
  collectionId: string,
  articleId: string,
  line: string,
  actor?: string
): void {
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) return;
  const at = new Date().toISOString();
  const a = actor?.trim();
  const entry: Workshop2ActivityEntry = {
    id: newId(),
    at,
    line,
    collectionId: cid,
    articleId: aid,
    ...(a ? { actor: a } : {}),
  };
  const prev = loadWorkshop2Activity();
  save([entry, ...prev].slice(0, MAX_ENTRIES));
}

function activityMatchesArticle(
  e: Workshop2ActivityEntry,
  collectionId: string,
  articleId: string,
  articleSku?: string
): boolean {
  const cid = collectionId.trim();
  const aid = articleId.trim();
  const sku = articleSku?.trim();
  if (e.articleId === aid && (!e.collectionId || e.collectionId === cid)) return true;
  if (sku && e.line.includes(sku) && (e.line.includes('артикул') || e.line.includes('SKU'))) return true;
  return false;
}

/** Записи журнала по артикулу (строгая привязка + эвристика для старых строк). */
export function loadWorkshop2ArticleActivity(
  collectionId: string,
  articleId: string,
  articleSku?: string
): Workshop2ActivityEntry[] {
  return loadWorkshop2Activity().filter((e) => activityMatchesArticle(e, collectionId, articleId, articleSku));
}

/**
 * Сводная история для паспорта артикула: журнал + снимки по ТЗ и строке коллекции.
 */
export function buildWorkshop2ArticleProductionHistory(args: {
  collectionId: string;
  articleId: string;
  articleSku: string;
  dossierUpdatedAt?: string;
  dossierUpdatedBy?: string;
  inventoryAddedAt?: string;
  inventoryUpdatedAt?: string;
  inventoryActor?: string;
}): Workshop2ArticleHistoryRow[] {
  const rows: Workshop2ArticleHistoryRow[] = [];
  const log = loadWorkshop2ArticleActivity(args.collectionId, args.articleId, args.articleSku);
  for (const e of log) {
    rows.push({
      id: `log-${e.id}`,
      at: e.at,
      scope: 'Журнал Цеха 2',
      summary: e.line,
      actor: e.actor,
    });
  }

  if (args.dossierUpdatedAt) {
    rows.push({
      id: `dossier-${args.dossierUpdatedAt}`,
      at: args.dossierUpdatedAt,
      scope: 'ТЗ · досье (фаза 1)',
      summary: 'Сохранение досье и атрибутов артикула',
      actor: args.dossierUpdatedBy,
    });
  }

  if (args.inventoryAddedAt) {
    rows.push({
      id: `inv-add-${args.inventoryAddedAt}`,
      at: args.inventoryAddedAt,
      scope: 'Коллекция · строка',
      summary: 'Артикул добавлен в состав коллекции в Цехе 2',
      actor: args.inventoryActor,
    });
  }

  if (args.inventoryUpdatedAt && args.inventoryUpdatedAt !== args.inventoryAddedAt) {
    rows.push({
      id: `inv-upd-${args.inventoryUpdatedAt}`,
      at: args.inventoryUpdatedAt,
      scope: 'Коллекция · строка',
      summary: 'Обновлены метаданные строки (комментарий, вложения, категория и т.д.)',
      actor: args.inventoryActor,
    });
  }

  rows.sort((a, b) => b.at.localeCompare(a.at));
  return rows;
}

export function clearWorkshop2Activity(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* */
  }
}
