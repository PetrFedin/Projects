/**
 * URL / config helpers для opt-in режимов runway (kiosk, compare).
 */

/** Парсит ?compare=0,2 → индексы секций или null при ошибке. */
export function parseCompareParam(param: string | null | undefined): [number, number] | null {
  if (!param?.trim()) return null;
  const parts = param.split(',').map((s) => s.trim());
  if (parts.length !== 2) return null;
  const left = Number(parts[0]);
  const right = Number(parts[1]);
  if (!Number.isInteger(left) || !Number.isInteger(right) || left < 0 || right < 0) {
    return null;
  }
  if (left === right) return null;
  return [left, right];
}

/** ?kiosk=1 */
export function parseKioskFromUrl(kioskParam: string | null | undefined): boolean {
  return kioskParam === '1' || kioskParam === 'true';
}

export interface KioskModeInput {
  kioskParam?: string | null;
  enableKioskMode?: boolean;
}

/** Kiosk активен через URL или scroll-experience.json. */
export function resolveKioskMode(input: KioskModeInput): boolean {
  if (parseKioskFromUrl(input.kioskParam)) return true;
  return Boolean(input.enableKioskMode);
}

/** ?autoadvance=30 → интервал kiosk auto-tour в мс (секунды в URL). */
export function parseKioskAutoadvanceMs(
  autoadvanceParam: string | null | undefined,
  fallbackMs: number
): number {
  if (!autoadvanceParam?.trim()) return fallbackMs;
  const seconds = Number(autoadvanceParam);
  if (!Number.isFinite(seconds) || seconds <= 0) return fallbackMs;
  return Math.round(seconds * 1000);
}

/** Нормализует compare-индексы под количество секций. */
export function clampCompareIndices(
  pair: [number, number],
  sectionCount: number
): [number, number] | null {
  if (sectionCount < 2) return null;
  const max = sectionCount - 1;
  const left = Math.min(Math.max(0, pair[0]), max);
  const right = Math.min(Math.max(0, pair[1]), max);
  if (left === right) return null;
  return [left, right];
}
