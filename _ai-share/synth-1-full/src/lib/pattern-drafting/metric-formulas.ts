import { clamp } from '@/lib/pattern-drafting/sewing-units';

/**
 * Справка: варианты, близкие к учебникам (Aldrich, Русская школа) — сглаживание для стабильности.
 * Не претендуем на индивидуальные таблицы мастерской.
 */
export function frontWaistLineLengthMm(bustMm: number, bodyHeightMm?: number): number {
  if (bodyHeightMm && bodyHeightMm > 0) {
    // Доля роста + смещение: типично 38–50 см
    return clamp(bodyHeightMm * 0.25 + 30, 360, 520);
  }
  // От обхвата: запас, если нет роста
  return clamp(bustMm * 0.5 + 80, 380, 500);
}

/** Глубина проймы от линии плеча до уровня груди (мм) — вариант B/5 + 1.2 см. */
export function armholeDepthMm(bustMm: number): number {
  return clamp(bustMm / 5 + 12, 170, 300);
}

/** «Ширина к спинке 1/2» для горловины/плеча (мм) — вспомогательная. */
export function backWidthHalfMm(bustMm: number, easeBustMm: number): number {
  return (bustMm + easeBustMm) / 8;
}

/**
 * Суммарный «недобор талии» на четвертинке полотна (для дартов),
 * дарт и бок убирают (груди → талия), см — без припуска на вытачку.
 */
export function quarterWaistSuppressionMm(
  bustMm: number,
  waistMm: number,
  easeBustMm: number,
  easeWaistMm: number
): number {
  const wb = (bustMm + easeBustMm) / 4;
  const ww = (waistMm + easeWaistMm) / 4;
  return Math.max(0, wb - ww);
}

/** Длина дуги проймы (мм) — грубая оценка по прямоуг. и глубине. */
export function estimateArmholeCurveLengthMm(shoulderX: number, underarm: { x: number; y: number }): number {
  const dx = Math.max(0, underarm.x - shoulderX);
  const dy = underarm.y;
  return 1.12 * (Math.PI * 0.5) * Math.hypot(dx, dy);
}

export function defaultEaseCm(): { bust: number; waist: number; hip: number } {
  return { bust: 4, waist: 2, hip: 3 };
}

export function formatMm(valueMm: number): string {
  return (valueMm / 10).toFixed(1) + ' см';
}
