const KEY = 'synth.sewingPattern.leaf.v1';
const INTENT_KEY = 'synth.sewingPattern.intent.v1';

export type SewingPatternLeafV1 = { leafId: string };

/** Мерки + категория для сценария «на заказ» / будущей привязки к заказу. */
export type SewingPatternIntentV1 = {
  v: 1;
  handbookLeafId: string;
  pathLabel: string;
  isApparelSewing: boolean;
  measures: { bust: string; waist: string; hip: string; shoulder: string; height: string };
  updatedAt: string;
};

/**
 * Канон для клиента/заказа: один `leafId` из category-handbook (аудитория `catalog`), как в бренд-MES.
 */
export function readStoredSewingLeafId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Partial<SewingPatternLeafV1>;
    return typeof o.leafId === 'string' && o.leafId.length > 0 ? o.leafId : null;
  } catch {
    return null;
  }
}

export function writeStoredSewingLeafId(leafId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ leafId } satisfies SewingPatternLeafV1));
  } catch {
    // quota / private mode
  }
}

export function writeSewingPatternIntentV1(payload: SewingPatternIntentV1): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(INTENT_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function readSewingPatternIntentV1(): SewingPatternIntentV1 | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(INTENT_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Partial<SewingPatternIntentV1>;
    if (o.v !== 1 || typeof o.handbookLeafId !== 'string' || !o.handbookLeafId) return null;
    return o as SewingPatternIntentV1;
  } catch {
    return null;
  }
}
