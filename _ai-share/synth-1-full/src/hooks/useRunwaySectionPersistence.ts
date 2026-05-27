'use client';

import {
  RUNWAY_COMPARE_HINT_STORAGE_KEY,
  RUNWAY_GUIDED_TOUR_STORAGE_KEY,
  RUNWAY_ONBOARDING_STORAGE_KEY,
  RUNWAY_SECTION_SESSION_PREFIX,
} from '@/lib/scroll-switcher-constants';

/** Последняя секция runway для товара — sessionStorage (возврат к варианту в сессии). */
export function getRunwayStoredSection(productSlug: string): number | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(`${RUNWAY_SECTION_SESSION_PREFIX}${productSlug}`);
    if (raw == null) return null;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function setRunwayStoredSection(productSlug: string, sectionIndex: number): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(`${RUNWAY_SECTION_SESSION_PREFIX}${productSlug}`, String(sectionIndex));
  } catch {
    /* quota / private mode */
  }
}

export function isRunwayOnboardingDismissed(): boolean {
  if (typeof localStorage === 'undefined') return true;
  try {
    return localStorage.getItem(RUNWAY_ONBOARDING_STORAGE_KEY) === '1';
  } catch {
    return true;
  }
}

export function dismissRunwayOnboarding(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(RUNWAY_ONBOARDING_STORAGE_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function isRunwayCompareHintDismissed(): boolean {
  if (typeof localStorage === 'undefined') return true;
  try {
    return localStorage.getItem(RUNWAY_COMPARE_HINT_STORAGE_KEY) === '1';
  } catch {
    return true;
  }
}

export function dismissRunwayCompareHint(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(RUNWAY_COMPARE_HINT_STORAGE_KEY, '1');
  } catch {
    /* ignore */
  }
}

/** Скрыть все подсказки первого визита — wheel/thumb/scroll не блокируют UI. */
export function dismissAllRunwayOnboardingHints(): void {
  dismissRunwayCompareHint();
  dismissRunwayOnboarding();
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(RUNWAY_GUIDED_TOUR_STORAGE_KEY, '1');
  } catch {
    /* ignore */
  }
}
