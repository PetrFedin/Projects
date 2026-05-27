/**
 * A/B cohort для default PDP view на scroll-video товарах.
 * Детерминированный hash от visitorId → localStorage `runway-ab-cohort`.
 * Глобальный A/B включается только через RUNWAY_AB_TEST_ENABLED=1 (см. applyRunwayProductionEnvOverrides).
 */

import { trackScrollExperienceEvent } from '@/lib/scroll-experience-analytics';

export const RUNWAY_AB_COHORT_KEY = 'runway-ab-cohort';
export const RUNWAY_VISITOR_ID_KEY = 'syntha-visitor-id';

export type RunwayAbCohort = 'runway-first' | 'standard-first';

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Стабильный ключ посетителя (session-scoped через localStorage). */
export function getOrCreateRunwayVisitorId(): string {
  if (typeof window === 'undefined') return 'ssr';
  try {
    const existing = window.localStorage.getItem(RUNWAY_VISITOR_ID_KEY);
    if (existing) return existing;
    const id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    window.localStorage.setItem(RUNWAY_VISITOR_ID_KEY, id);
    return id;
  } catch {
    return `ephemeral_${Date.now()}`;
  }
}

/** Назначить или прочитать cohort (50/50 runway-first vs standard-first). */
export function resolveRunwayAbCohort(visitorKey?: string): RunwayAbCohort {
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(RUNWAY_AB_COHORT_KEY);
      if (stored === 'runway-first' || stored === 'standard-first') return stored;
    } catch {
      /* quota */
    }
  }

  const key = visitorKey ?? getOrCreateRunwayVisitorId();
  const cohort: RunwayAbCohort = hashString(key) % 2 === 0 ? 'runway-first' : 'standard-first';

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(RUNWAY_AB_COHORT_KEY, cohort);
    } catch {
      /* quota */
    }
  }

  return cohort;
}

/** Default вкладка PDP без явного ?view= в URL. */
export function resolveAbTestEnabledForProduct(options: {
  abTestRunwayDefault?: boolean;
  abTestFlagshipSlugs?: string[];
  productSlug?: string;
}): boolean {
  if (options.abTestFlagshipSlugs?.length && options.productSlug) {
    return options.abTestFlagshipSlugs.includes(options.productSlug);
  }
  return Boolean(options.abTestRunwayDefault);
}

/** Default вкладка PDP без явного ?view= в URL. */
export function resolveDefaultPdpMediaView(options: {
  hasScrollVideoMode: boolean;
  abTestRunwayDefault?: boolean;
  abTestFlagshipSlugs?: string[];
  productSlug?: string;
  urlView?: string | null;
  visitorKey?: string;
}): 'standard' | 'runway' {
  if (!options.hasScrollVideoMode) return 'standard';
  if (options.urlView === 'runway') return 'runway';
  if (options.urlView === 'standard') return 'standard';

  const abEnabled = resolveAbTestEnabledForProduct(options);

  if (abEnabled) {
    return resolveRunwayAbCohort(options.visitorKey) === 'runway-first' ? 'runway' : 'standard';
  }

  return 'runway';
}

/** Назначить cohort и один раз отправить runway_ab_cohort_assigned в analytics. */
export function assignRunwayAbCohortWithTracking(options: {
  productSlug: string;
  brand?: string;
  visitorKey?: string;
}): RunwayAbCohort {
  let wasStored = false;
  if (typeof window !== 'undefined') {
    try {
      wasStored = Boolean(window.localStorage.getItem(RUNWAY_AB_COHORT_KEY));
    } catch {
      /* quota */
    }
  }

  const cohort = resolveRunwayAbCohort(options.visitorKey);

  if (!wasStored && typeof window !== 'undefined') {
    trackScrollExperienceEvent('runway_ab_cohort_assigned', {
      productSlug: options.productSlug,
      brand: options.brand,
      abCohort: cohort,
      source: cohort,
      surface: 'pdp-ab',
    });
  }

  return cohort;
}
