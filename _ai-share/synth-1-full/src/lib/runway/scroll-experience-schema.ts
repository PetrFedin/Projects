import { z } from 'zod';
import {
  DEFAULT_SCROLL_SWITCHER_COLORS,
  DEFAULT_SCROLL_SWITCHER_LABELS,
} from '@/lib/scroll-switcher-constants';
import type { ScrollExperienceConfig } from '@/lib/types';

/** Zod-схема v3 — typed features + defaults. */
const featuresSchema = z
  .object({
    autoTour: z.boolean().optional(),
    comparePeek: z.boolean().optional(),
    kenBurns: z.boolean().optional(),
    searchHoverPreview: z.boolean().optional(),
    stickyBar: z.boolean().optional(),
    socialProof: z.boolean().optional(),
    entryCta: z.boolean().optional(),
    priceDeltaHighlight: z.boolean().optional(),
    kioskMode: z.boolean().optional(),
  })
  .optional();

const defaultsSchema = z
  .object({
    sectionColors: z.array(z.string()).optional(),
    sectionLabels: z.array(z.string()).optional(),
  })
  .optional();

/** Принимает v2 (flat flags) и v3 (nested features). */
export const scrollExperienceRawSchema = z
  .object({
    version: z.union([z.literal(2), z.literal(3)]).optional(),
    features: featuresSchema,
    defaults: defaultsSchema,
    featuredProductSlug: z.string().optional(),
    brandFeatured: z.record(z.string()).optional(),
    defaultSectionColors: z.array(z.string()).optional(),
    defaultSectionLabels: z.array(z.string()).optional(),
    enableCatalogBadge: z.boolean().optional(),
    enableQuickViewEntry: z.boolean().optional(),
    showSocialProof: z.boolean().optional(),
    showCampaignTagline: z.boolean().optional(),
    enableKenBurns: z.boolean().optional(),
    enableComparePeek: z.boolean().optional(),
    enableSearchHoverPreview: z.boolean().optional(),
    enableInvestorBanner: z.boolean().optional(),
    investorBannerMessage: z.string().optional(),
    enableScrollSpring: z.boolean().optional(),
    enableAutoTour: z.boolean().optional(),
    enableUserOptions: z.boolean().optional(),
    enableStickyBar: z.boolean().optional(),
    enableEntryCta: z.boolean().optional(),
    enablePriceDeltaHighlight: z.boolean().optional(),
    enableKioskMode: z.boolean().optional(),
    investorDemoDoc: z.string().optional(),
    demoEntryPath: z.string().optional(),
    brandRunwayEnabled: z.record(z.boolean()).optional(),
    /** @deprecated use analyticsWebhookUrl */
    webhookUrl: z.string().optional(),
    analyticsWebhookUrl: z.string().optional(),
    videoCdnBaseUrl: z.string().optional(),
    /** Per-brand CDN override (приоритет над videoCdnBaseUrl). */
    brandVideoCdnBaseUrl: z.record(z.string()).optional(),
    /** Опциональный signed query для CDN (override env RUNWAY_VIDEO_CDN_SIGNED_QUERY). */
    videoCdnSignedQuery: z.string().optional(),
    abTestRunwayDefault: z.boolean().optional(),
    abTestFlagshipSlugs: z.array(z.string()).max(10).optional(),
    layout: z.enum(['minimal', 'full']).optional(),
    heroProductSlugs: z.array(z.string()).max(10).optional(),
    heroScrollVideoSlugs: z.array(z.string()).max(10).optional(),
    runwayBadgeHeroOnly: z.boolean().optional(),
    /** Главная: compact — постер + точки цветов; interactive — полный switcher. */
    featuredMode: z.enum(['interactive', 'compact']).optional(),
    /** Shimmer на бейдже каталога (выкл. в minimal). */
    badgeShimmer: z.boolean().optional(),
  })
  .passthrough();

export type ScrollExperienceRaw = z.infer<typeof scrollExperienceRawSchema>;

export const SCROLL_EXPERIENCE_V3_DEFAULTS: ScrollExperienceConfig = {
  version: 3,
  featuredProductSlug: 'silk-midi-dress',
  brandFeatured: {
    'Nordic Wool': 'silk-midi-dress',
  },
  defaultSectionColors: [...DEFAULT_SCROLL_SWITCHER_COLORS],
  defaultSectionLabels: [...DEFAULT_SCROLL_SWITCHER_LABELS],
  defaults: {
    sectionColors: [...DEFAULT_SCROLL_SWITCHER_COLORS],
    sectionLabels: [...DEFAULT_SCROLL_SWITCHER_LABELS],
  },
  features: {
    autoTour: false,
    comparePeek: false,
    kenBurns: true,
    searchHoverPreview: false,
    stickyBar: true,
    socialProof: false,
    entryCta: true,
    priceDeltaHighlight: false,
    kioskMode: false,
  },
  enableCatalogBadge: true,
  enableQuickViewEntry: true,
  showSocialProof: false,
  showCampaignTagline: false,
  enableKenBurns: true,
  enableComparePeek: false,
  enableScrollSpring: true,
  enableAutoTour: false,
  enableUserOptions: false,
  layout: 'minimal',
  heroProductSlugs: ['silk-midi-dress', 'cashmere-crewneck-sweater'],
  abTestFlagshipSlugs: ['silk-midi-dress'],
  runwayBadgeHeroOnly: true,
  featuredMode: 'compact',
  badgeShimmer: false,
  abTestRunwayDefault: false,
  brandRunwayEnabled: {},
};

function pickFeature(
  raw: ScrollExperienceRaw,
  key: keyof NonNullable<ScrollExperienceConfig['features']>,
  legacyKey?: keyof ScrollExperienceRaw
): boolean {
  const fromFeatures = raw.features?.[key];
  if (fromFeatures != null) return fromFeatures;
  if (legacyKey && raw[legacyKey] != null) return Boolean(raw[legacyKey]);
  return Boolean(SCROLL_EXPERIENCE_V3_DEFAULTS.features?.[key]);
}

/** Нормализация v2 flat → v3 typed config (non-breaking). */
export function normalizeScrollExperienceConfig(
  raw: unknown,
  fallback: ScrollExperienceConfig = SCROLL_EXPERIENCE_V3_DEFAULTS
): ScrollExperienceConfig {
  const parsed = scrollExperienceRawSchema.safeParse(raw);
  if (!parsed.success) return fallback;

  const data = parsed.data;
  const sectionColors = data.defaults?.sectionColors ??
    data.defaultSectionColors ??
    fallback.defaultSectionColors ?? [...DEFAULT_SCROLL_SWITCHER_COLORS];
  const sectionLabels = data.defaults?.sectionLabels ??
    data.defaultSectionLabels ??
    fallback.defaultSectionLabels ?? [...DEFAULT_SCROLL_SWITCHER_LABELS];

  const features: NonNullable<ScrollExperienceConfig['features']> = {
    autoTour: pickFeature(data, 'autoTour', 'enableAutoTour'),
    comparePeek: pickFeature(data, 'comparePeek', 'enableComparePeek'),
    kenBurns: pickFeature(data, 'kenBurns', 'enableKenBurns'),
    searchHoverPreview: pickFeature(data, 'searchHoverPreview', 'enableSearchHoverPreview'),
    stickyBar: pickFeature(data, 'stickyBar', 'enableStickyBar'),
    socialProof: pickFeature(data, 'socialProof', 'showSocialProof'),
    entryCta: pickFeature(data, 'entryCta', 'enableEntryCta'),
    priceDeltaHighlight: pickFeature(data, 'priceDeltaHighlight', 'enablePriceDeltaHighlight'),
    kioskMode: pickFeature(data, 'kioskMode', 'enableKioskMode'),
  };

  const heroSlugs = data.heroProductSlugs ?? data.heroScrollVideoSlugs ?? fallback.heroProductSlugs;

  return {
    ...fallback,
    ...data,
    version: data.version === 2 ? 2 : 3,
    featuredProductSlug: data.featuredProductSlug ?? fallback.featuredProductSlug,
    brandFeatured: { ...fallback.brandFeatured, ...data.brandFeatured },
    defaultSectionColors: sectionColors,
    defaultSectionLabels: sectionLabels,
    defaults: { sectionColors, sectionLabels },
    features,
    enableCatalogBadge: data.enableCatalogBadge ?? fallback.enableCatalogBadge,
    enableQuickViewEntry: data.enableQuickViewEntry ?? fallback.enableQuickViewEntry,
    showSocialProof: features.socialProof,
    showCampaignTagline: data.showCampaignTagline ?? fallback.showCampaignTagline,
    enableKenBurns: features.kenBurns,
    enableComparePeek: features.comparePeek,
    enableSearchHoverPreview: features.searchHoverPreview,
    enableInvestorBanner: data.enableInvestorBanner ?? fallback.enableInvestorBanner,
    investorBannerMessage: data.investorBannerMessage ?? fallback.investorBannerMessage,
    enableScrollSpring: data.enableScrollSpring ?? fallback.enableScrollSpring,
    enableAutoTour: features.autoTour,
    enableUserOptions: data.enableUserOptions ?? fallback.enableUserOptions,
    enableStickyBar: features.stickyBar,
    enableEntryCta: features.entryCta,
    enablePriceDeltaHighlight: features.priceDeltaHighlight,
    enableKioskMode: features.kioskMode ?? data.enableKioskMode ?? fallback.enableKioskMode,
    investorDemoDoc: data.investorDemoDoc ?? fallback.investorDemoDoc,
    demoEntryPath: data.demoEntryPath ?? fallback.demoEntryPath,
    brandRunwayEnabled: { ...fallback.brandRunwayEnabled, ...data.brandRunwayEnabled },
    webhookUrl: data.analyticsWebhookUrl ?? data.webhookUrl ?? fallback.webhookUrl,
    analyticsWebhookUrl:
      data.analyticsWebhookUrl ?? data.webhookUrl ?? fallback.analyticsWebhookUrl,
    videoCdnBaseUrl: data.videoCdnBaseUrl ?? fallback.videoCdnBaseUrl,
    brandVideoCdnBaseUrl: {
      ...fallback.brandVideoCdnBaseUrl,
      ...data.brandVideoCdnBaseUrl,
    },
    videoCdnSignedQuery: data.videoCdnSignedQuery ?? fallback.videoCdnSignedQuery,
    abTestRunwayDefault: data.abTestRunwayDefault ?? fallback.abTestRunwayDefault,
    abTestFlagshipSlugs: data.abTestFlagshipSlugs ?? fallback.abTestFlagshipSlugs,
    layout: data.layout ?? fallback.layout ?? 'minimal',
    heroProductSlugs: heroSlugs,
    runwayBadgeHeroOnly: data.runwayBadgeHeroOnly ?? fallback.runwayBadgeHeroOnly,
    featuredMode: data.featuredMode ?? fallback.featuredMode ?? 'compact',
    badgeShimmer: data.badgeShimmer ?? fallback.badgeShimmer ?? false,
  };
}

/**
 * Production env overrides — не хардкодить A/B и signed query в JSON.
 * RUNWAY_AB_TEST_ENABLED=1 → глобальный A/B (abTestRunwayDefault effective true).
 * RUNWAY_VIDEO_CDN_SIGNED_QUERY → cache bust / signed CDN URLs.
 */
export function applyRunwayProductionEnvOverrides(
  config: ScrollExperienceConfig
): ScrollExperienceConfig {
  const abFromEnv = process.env.RUNWAY_AB_TEST_ENABLED === '1';
  const signedQuery =
    process.env.RUNWAY_VIDEO_CDN_SIGNED_QUERY?.trim() || config.videoCdnSignedQuery;

  return {
    ...config,
    /** Глобальный A/B только через env — JSON не включает prod A/B напрямую. */
    abTestRunwayDefault: abFromEnv,
    videoCdnSignedQuery: signedQuery || undefined,
  };
}

/** URL для fire-and-forget POST analytics batch (env → analyticsWebhookUrl → webhookUrl). */
export function resolveAnalyticsWebhookUrl(
  config: Pick<ScrollExperienceConfig, 'analyticsWebhookUrl' | 'webhookUrl'>
): string | undefined {
  const fromEnv = process.env.RUNWAY_ANALYTICS_WEBHOOK_URL?.trim();
  if (fromEnv) return fromEnv;
  const url = config.analyticsWebhookUrl?.trim() || config.webhookUrl?.trim();
  return url || undefined;
}

/** Валидация JSON — возвращает ошибки Zod (для CI / dev). */
export function validateScrollExperienceRaw(raw: unknown): string[] {
  const result = scrollExperienceRawSchema.safeParse(raw);
  if (result.success) return [];
  return result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
}
