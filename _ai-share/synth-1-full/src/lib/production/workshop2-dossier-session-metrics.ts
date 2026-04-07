/**
 * Лёгкие клиентские метрики по работе с досье (без бэкенда).
 * — sessionStorage: время первого открытия вкладки с этим артикулом в сессии
 * — localStorage: сохранения, «уходы без сохранения», однократные вехи контура (паспорт 100%, гейт визуала, готовность к образцу)
 */

const SESS_OPEN_KEY = 'synth.w2.dossierSessionOpen.v1';
const PERSIST_KEY = 'synth.w2.dossierPersistStats.v1';
const ABANDON_KEY = 'synth.w2.dossierAbandonStats.v1';
/** Первое достижение «закрытого контура» по артикулу (время фиксируется один раз). */
const CONTOUR_KEY = 'synth.w2.dossierContourMilestones.v1';

export type W2ContourMilestones = {
  passportRoutePct100At?: string;
  visualGateOpen0At?: string;
  tzSampleReadyAt?: string;
};

function safeSeg(id: string): string {
  return id.replace(/:/g, '_');
}

function articleKey(collectionId: string, articleId: string): string {
  return `${safeSeg(collectionId)}::${safeSeg(articleId)}`;
}

/** Первое открытие досье этого артикула в текущей вкладке (ms). */
export function touchW2DossierSessionOpenedAt(collectionId: string, articleId: string): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    const k = articleKey(collectionId, articleId);
    const raw = sessionStorage.getItem(SESS_OPEN_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    if (!map[k]) map[k] = Date.now();
    sessionStorage.setItem(SESS_OPEN_KEY, JSON.stringify(map));
  } catch {
    /* quota / private */
  }
}

export function getW2DossierSessionOpenedAtMs(collectionId: string, articleId: string): number | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESS_OPEN_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, number>;
    const v = map[articleKey(collectionId, articleId)];
    return typeof v === 'number' && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

type PersistStat = { successCount: number; lastSuccessAt: string };

function readPersistMap(): Record<string, PersistStat> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as unknown;
    return p && typeof p === 'object' && !Array.isArray(p) ? (p as Record<string, PersistStat>) : {};
  } catch {
    return {};
  }
}

/** После успешной записи досье в localStorage. */
export function recordW2DossierPersistSuccess(collectionId: string, articleId: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const k = articleKey(collectionId, articleId);
    const map = readPersistMap();
    const prev = map[k] ?? { successCount: 0, lastSuccessAt: '' };
    map[k] = {
      successCount: prev.successCount + 1,
      lastSuccessAt: new Date().toISOString(),
    };
    localStorage.setItem(PERSIST_KEY, JSON.stringify(map));
  } catch {
    /* quota */
  }
}

export function getW2DossierPersistStats(collectionId: string, articleId: string): PersistStat | null {
  const map = readPersistMap();
  return map[articleKey(collectionId, articleId)] ?? null;
}

function readAbandonMap(): Record<string, number> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ABANDON_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as unknown;
    return p && typeof p === 'object' && !Array.isArray(p) ? (p as Record<string, number>) : {};
  } catch {
    return {};
  }
}

/**
 * Уход со вкладки (скрытие) без ни одного успешного сохранения в этой сессии вкладки,
 * если с открытия прошло ≥ 2 мин — считаем «тупиковым» визитом для статистики.
 */
export function recordW2DossierAbandonIfNoSaveYet(collectionId: string, articleId: string): void {
  if (typeof localStorage === 'undefined') return;
  const opened = getW2DossierSessionOpenedAtMs(collectionId, articleId);
  if (!opened || Date.now() - opened < 120_000) return;
  const st = getW2DossierPersistStats(collectionId, articleId);
  if (st && st.successCount > 0) return;
  try {
    const k = articleKey(collectionId, articleId);
    const map = readAbandonMap();
    map[k] = (map[k] ?? 0) + 1;
    localStorage.setItem(ABANDON_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function getW2DossierAbandonCount(collectionId: string, articleId: string): number {
  return readAbandonMap()[articleKey(collectionId, articleId)] ?? 0;
}

function readContourMap(): Record<string, W2ContourMilestones> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CONTOUR_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as unknown;
    return p && typeof p === 'object' && !Array.isArray(p) ? (p as Record<string, W2ContourMilestones>) : {};
  } catch {
    return {};
  }
}

export function getW2ContourMilestones(collectionId: string, articleId: string): W2ContourMilestones {
  return readContourMap()[articleKey(collectionId, articleId)] ?? {};
}

function writeContourMilestones(k: string, next: W2ContourMilestones): boolean {
  if (typeof localStorage === 'undefined') return false;
  try {
    const map = readContourMap();
    map[k] = next;
    localStorage.setItem(CONTOUR_KEY, JSON.stringify(map));
    return true;
  } catch {
    return false;
  }
}

/** Первый раз паспорт для маршрута достиг 100%. */
export function maybeRecordW2PassportRoute100(
  collectionId: string,
  articleId: string,
  combinedPct: number
): boolean {
  if (combinedPct < 100) return false;
  const k = articleKey(collectionId, articleId);
  const cur = getW2ContourMilestones(collectionId, articleId);
  if (cur.passportRoutePct100At) return false;
  return writeContourMilestones(k, { ...cur, passportRoutePct100At: new Date().toISOString() });
}

/** Первый раз гейт визуала/скетча без открытых пунктов. */
export function maybeRecordW2VisualGateCleared(
  collectionId: string,
  articleId: string,
  openGateCount: number
): boolean {
  if (openGateCount > 0) return false;
  const k = articleKey(collectionId, articleId);
  const cur = getW2ContourMilestones(collectionId, articleId);
  if (cur.visualGateOpen0At) return false;
  return writeContourMilestones(k, { ...cur, visualGateOpen0At: new Date().toISOString() });
}

/** Первый раз выполнены условия «готово к передаче в образец». */
export function maybeRecordW2TzSampleReady(
  collectionId: string,
  articleId: string,
  ready: boolean
): boolean {
  if (!ready) return false;
  const k = articleKey(collectionId, articleId);
  const cur = getW2ContourMilestones(collectionId, articleId);
  if (cur.tzSampleReadyAt) return false;
  return writeContourMilestones(k, { ...cur, tzSampleReadyAt: new Date().toISOString() });
}

function formatMilestoneDelta(openedMs: number | null, atIso: string | undefined, label: string): string | null {
  if (!openedMs || !atIso) return null;
  const at = Date.parse(atIso);
  if (!Number.isFinite(at)) return null;
  const min = Math.max(0, Math.floor((at - openedMs) / 60_000));
  return `${label}: ~${min} мин от открытия вкладки`;
}

/** Строка для подвала панели ТЗ (локально в браузере). */
export function formatW2DossierMetricsFooterLine(
  collectionId: string,
  articleId: string,
  nowMs: number = Date.now()
): string | null {
  const opened = getW2DossierSessionOpenedAtMs(collectionId, articleId);
  const persist = getW2DossierPersistStats(collectionId, articleId);
  const abandon = getW2DossierAbandonCount(collectionId, articleId);
  const contour = getW2ContourMilestones(collectionId, articleId);
  if (!opened && !persist && !Object.keys(contour).length) return null;
  const parts: string[] = [];
  if (opened) {
    const min = Math.max(0, Math.floor((nowMs - opened) / 60_000));
    parts.push(`вкладка с артикулом: ~${min} мин`);
  }
  if (persist) {
    parts.push(`сохранений в браузер: ${persist.successCount}`);
    if (persist.lastSuccessAt) {
      try {
        parts.push(`последн.: ${new Date(persist.lastSuccessAt).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}`);
      } catch {
        parts.push('последн.: —');
      }
    }
  }
  if (abandon > 0) {
    parts.push(`уходов без сохранения (всего): ${abandon}`);
  }
  const m1 = formatMilestoneDelta(opened, contour.passportRoutePct100At, 'паспорт маршрута 100%');
  if (m1) parts.push(m1);
  const m2 = formatMilestoneDelta(opened, contour.visualGateOpen0At, 'визуал: гейт закрыт');
  if (m2) parts.push(m2);
  const m3 = formatMilestoneDelta(opened, contour.tzSampleReadyAt, 'готовность к образцу');
  if (m3) parts.push(m3);
  return parts.length ? `Метрики (локально): ${parts.join(' · ')}` : null;
}
