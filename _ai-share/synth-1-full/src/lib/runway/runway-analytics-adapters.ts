/**
 * Опциональные GA4 + PostHog адаптеры для runway scroll analytics.
 * Дополняют dataLayer, localStorage и POST /api/runway/analytics — не заменяют их.
 * Внешние системы получают короткие имена: runway_view, runway_section_change, runway_add_to_cart.
 */
import type {
  ScrollExperienceEventName,
  ScrollExperienceEventPayload,
} from '@/lib/scroll-experience-analytics';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

/** Маппинг внутренних событий → production GA4/PostHog naming. */
export const RUNWAY_EXTERNAL_EVENT_NAMES: Partial<Record<ScrollExperienceEventName, string>> = {
  scroll_experience_view: 'runway_view',
  scroll_experience_section_change: 'runway_section_change',
  scroll_experience_add_to_cart: 'runway_add_to_cart',
  scroll_experience_share: 'runway_share',
  scroll_experience_wishlist_toggle: 'runway_wishlist_toggle',
  runway_ab_cohort_assigned: 'runway_ab_cohort_assigned',
  runway_lcp_hero: 'runway_lcp_hero',
};

export function resolveRunwayExternalEventName(event: ScrollExperienceEventName): string {
  return RUNWAY_EXTERNAL_EVENT_NAMES[event] ?? event;
}

function ga4Enabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim());
}

function posthogEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim());
}

function buildAdapterPayload(
  event: ScrollExperienceEventName,
  payload: ScrollExperienceEventPayload
): Record<string, unknown> {
  return {
    event_category: 'runway_scroll',
    product_slug: payload.productSlug,
    product_id: payload.productId,
    brand: payload.brand,
    section_index: payload.sectionIndex,
    section_id: payload.sectionId,
    section_label: payload.sectionLabel,
    price: payload.price,
    has_video: payload.hasVideo,
    interaction_type: payload.interactionType,
    source: payload.source,
    surface: payload.surface,
    ab_cohort: payload.abCohort,
    ms_since_navigation: payload.msSinceNavigation,
    connection_type: payload.connectionType,
    runway_event: event,
    runway_event_external: resolveRunwayExternalEventName(event),
  };
}

/** Зеркалирование scroll analytics в gtag (GA4) при NEXT_PUBLIC_GA4_MEASUREMENT_ID. */
export function mirrorScrollAnalyticsToGa4(
  event: ScrollExperienceEventName,
  payload: ScrollExperienceEventPayload
): void {
  if (typeof window === 'undefined' || !ga4Enabled()) return;
  if (typeof window.gtag !== 'function') return;

  const externalName = resolveRunwayExternalEventName(event);
  window.gtag('event', externalName, buildAdapterPayload(event, payload));
}

/** Зеркалирование scroll analytics в PostHog при NEXT_PUBLIC_POSTHOG_KEY. */
export function mirrorScrollAnalyticsToPosthog(
  event: ScrollExperienceEventName,
  payload: ScrollExperienceEventPayload
): void {
  if (typeof window === 'undefined' || !posthogEnabled()) return;
  if (!window.posthog?.capture) return;

  const externalName = resolveRunwayExternalEventName(event);
  window.posthog.capture(externalName, buildAdapterPayload(event, payload));
}

/** Все активные внешние адаптеры (additive). */
export function mirrorScrollAnalyticsToAdapters(
  event: ScrollExperienceEventName,
  payload: ScrollExperienceEventPayload
): void {
  mirrorScrollAnalyticsToGa4(event, payload);
  mirrorScrollAnalyticsToPosthog(event, payload);
}

/** Для тестов и runbook — какие адаптеры включены по env. */
export function resolveRunwayAnalyticsAdapterStatus(): {
  ga4: boolean;
  posthog: boolean;
} {
  return {
    ga4: ga4Enabled(),
    posthog: posthogEnabled(),
  };
}
