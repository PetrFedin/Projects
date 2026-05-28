/**
 * Чистые функции scroll-switcher — velocity, snap, easing, auto-tour.
 * Вынесены для unit-тестов и переиспользования в useScrollVideoProgress.
 */

/** easeOutCubic — мягкое замедление к цели (spring-like без внешней lib). */
export function easeOutCubic(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return 1 - (1 - clamped) ** 3;
}

/** Линейный lerp с опциональным easeOutCubic на шаге. */
export function lerpToward(
  current: number,
  target: number,
  factor: number,
  useEaseOut = false
): number {
  const delta = target - current;
  const step = useEaseOut ? delta * easeOutCubic(factor) : delta * factor;
  return current + step;
}

/** Множитель чувствительности колеса от величины deltaY (быстрее крутишь — быстрее scrub). */
export function velocityScrollMultiplier(deltaYMagnitude: number): number {
  const normalized = Math.min(Math.abs(deltaYMagnitude) / 120, 1);
  return 1 + normalized * 1.6;
}

/** Прогресс delta с учётом velocity multiplier. */
export function applyVelocityDelta(
  baseDelta: number,
  deltaYMagnitude: number,
  maxVelocity: number
): number {
  const scaled = baseDelta * velocityScrollMultiplier(deltaYMagnitude);
  return Math.max(-maxVelocity, Math.min(maxVelocity, scaled));
}

/** Середина секции в нормализованном прогрессе 0–1. */
export function sectionMidpoint(index: number, sectionCount: number): number {
  if (sectionCount <= 0) return 0;
  return (index + 0.5) / sectionCount;
}

/** Ближайшая середина секции для snap после остановки колеса. */
export function resolveSnapTargetProgress(progress: number, sectionCount: number): number {
  if (sectionCount <= 0) return 0;
  const rawIndex = progress * sectionCount;
  const nearest = Math.round(rawIndex - 0.5);
  const clamped = Math.min(sectionCount - 1, Math.max(0, nearest));
  return sectionMidpoint(clamped, sectionCount);
}

/** Локальный прогресс внутри активной секции (0–1) для кольцевого индикатора. */
export function sectionLocalProgress(progress: number, sectionCount: number): number {
  if (sectionCount <= 0) return 0;
  const local = progress * sectionCount - Math.floor(progress * sectionCount);
  return Math.min(1, Math.max(0, local));
}

export type AutoTourPhase = 'idle' | 'running' | 'paused' | 'complete';

export interface AutoTourState {
  phase: AutoTourPhase;
  /** Текущая целевая секция (0-based). */
  targetSection: number;
  /** Накопленное время тура (мс). */
  elapsedMs: number;
}

export const AUTO_TOUR_DEFAULT_DURATION_MS = 8000;

/** Длительность одной секции при равномерном туре. */
export function autoTourSectionDurationMs(
  sectionCount: number,
  totalDurationMs = AUTO_TOUR_DEFAULT_DURATION_MS
): number {
  if (sectionCount <= 0) return totalDurationMs;
  return totalDurationMs / sectionCount;
}

/**
 * State machine автопоказа для investor demo.
 * Каждые sectionDurationMs переключает targetSection; по завершении — complete.
 */
export function advanceAutoTour(
  state: AutoTourState,
  deltaMs: number,
  sectionCount: number,
  totalDurationMs = AUTO_TOUR_DEFAULT_DURATION_MS
): AutoTourState {
  if (state.phase !== 'running' || sectionCount <= 0) return state;

  const elapsedMs = state.elapsedMs + deltaMs;
  const sectionDuration = autoTourSectionDurationMs(sectionCount, totalDurationMs);
  const targetSection = Math.min(sectionCount - 1, Math.floor(elapsedMs / sectionDuration));

  if (elapsedMs >= totalDurationMs) {
    return {
      phase: 'complete',
      targetSection: sectionCount - 1,
      elapsedMs: totalDurationMs,
    };
  }

  return { phase: 'running', targetSection, elapsedMs };
}

/** Старт тура с первой секции. */
export function startAutoTour(): AutoTourState {
  return { phase: 'running', targetSection: 0, elapsedMs: 0 };
}

/** Сброс тура. */
export function resetAutoTour(): AutoTourState {
  return { phase: 'idle', targetSection: 0, elapsedMs: 0 };
}
