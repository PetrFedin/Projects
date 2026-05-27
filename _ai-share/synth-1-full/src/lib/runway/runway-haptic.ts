/**
 * Тактильная отдача при смене секции runway на touch-устройствах.
 * Opt-in через navigator.vibrate — без fallback на fake feedback.
 */

const RUNWAY_SECTION_HAPTIC_MS = 10;

/** Короткий импульс при смене секции (mobile pull/drag). */
export function triggerRunwaySectionHaptic(): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(RUNWAY_SECTION_HAPTIC_MS);
  } catch {
    /* ignore unsupported vibrate */
  }
}
