/**
 * Zod-схемы для POST /api/runway/* — валидация тела запроса.
 */
import { z } from 'zod';

const scrollExperienceEventNames = z.enum([
  'scroll_experience_view',
  'scroll_experience_section_change',
  'scroll_experience_add_to_cart',
  'scroll_experience_share',
  'scroll_experience_wishlist_toggle',
  'runway_ab_cohort_assigned',
  'runway_lcp_hero',
  'error',
]);

const scrollExperienceInteractionTypes = z.enum(['wheel', 'thumb', 'keyboard', 'url', 'touch']);

export const runwayAnalyticsEventSchema = z
  .object({
    event: scrollExperienceEventNames,
    productSlug: z.string().min(1).max(200),
    productId: z.string().max(200).optional(),
    brand: z.string().max(200).optional(),
    sectionIndex: z.number().int().min(0).max(99).optional(),
    sectionId: z.string().max(200).optional(),
    sectionLabel: z.string().max(500).optional(),
    price: z.number().finite().optional(),
    hasVideo: z.boolean().optional(),
    interactionType: scrollExperienceInteractionTypes.optional(),
    source: z.string().max(200).optional(),
    surface: z.string().max(100).optional(),
    abCohort: z.enum(['runway-first', 'standard-first']).optional(),
    msSinceNavigation: z.number().int().nonnegative().optional(),
    connectionType: z.string().max(50).optional(),
    message: z.string().max(500).optional(),
    timestamp: z.number().int().positive(),
  })
  .strict();

export const runwayAnalyticsPostBodySchema = z
  .object({
    events: z.array(runwayAnalyticsEventSchema).min(1).max(100),
  })
  .strict();

export type RunwayAnalyticsPostBody = z.infer<typeof runwayAnalyticsPostBodySchema>;

export const runwayOverridePatchSchema = z
  .object({
    brandName: z.string().min(1).max(200),
    slug: z.string().min(1).max(200),
    patch: z.record(z.unknown()),
  })
  .strict();

export const runwayOverrideReplaceSchema = z
  .object({
    replace: z.record(z.record(z.unknown())),
  })
  .strict();

/** Per-brand CDN base URL → persisted in scroll-experience.json brandVideoCdnBaseUrl. */
export const runwayBrandCdnPatchSchema = z
  .object({
    brandCdn: z
      .object({
        brandName: z.string().min(1).max(200),
        /** Empty string removes the brand override. */
        videoCdnBaseUrl: z.string().max(500),
      })
      .strict(),
  })
  .strict();

export const runwayOverridesPostBodySchema = z.union([
  runwayOverrideReplaceSchema,
  runwayOverridePatchSchema,
  runwayBrandCdnPatchSchema,
]);

export type RunwayOverridesPostBody = z.infer<typeof runwayOverridesPostBodySchema>;

const runwayLookItemSchema = z
  .object({
    name: z.string().min(1).max(200),
    price: z.number().finite().nonnegative(),
    imageUrl: z.string().min(1).max(500),
    slug: z.string().min(1).max(200),
  })
  .strict();

const runwaySectionSchema = z
  .object({
    id: z.string().min(1).max(200),
    label: z.string().min(1).max(200),
    color: z.string().min(1).max(50),
    material: z.string().max(500).optional(),
    dimensions: z.string().max(500).optional(),
    thumbImageUrl: z.string().max(500).optional(),
    sectionImageUrl: z.string().max(500).optional(),
    sectionVideoUrl: z.string().max(500).optional(),
    colorName: z.string().max(200).optional(),
    variantSku: z.string().max(200).optional(),
    price: z.number().finite().optional(),
    sectionStory: z.string().max(2000).optional(),
    sectionAiTip: z.string().max(2000).optional(),
    sectionLookItems: z.array(runwayLookItemSchema).optional(),
  })
  .passthrough();

export const runwayProductConfigSchema = z
  .object({
    displayMode: z.enum(['scroll-video', 'standard']).optional(),
    featuredScrollExperience: z.boolean().optional(),
    scrollVideoUrl: z.string().max(500).optional(),
    scrollSwitcherSections: z.array(runwaySectionSchema).optional(),
  })
  .strict();

export const runwayProductConfigPostBodySchema = z
  .object({
    brandName: z.string().min(1).max(200),
    slug: z.string().min(1).max(200),
    config: runwayProductConfigSchema,
    persistTo: z.enum(['overrides', 'patch', 'both']).optional(),
  })
  .strict();

export type RunwayProductConfigPostBody = z.infer<typeof runwayProductConfigPostBodySchema>;

export const runwayBrandCdnPostBodySchema = z
  .object({
    brandName: z.string().min(1).max(200),
    /** Пустая строка или null — удалить override для бренда. */
    videoCdnBaseUrl: z.string().max(500).nullable().optional(),
  })
  .strict();

export type RunwayBrandCdnPostBody = z.infer<typeof runwayBrandCdnPostBodySchema>;

export const runwayUploadPresignPostBodySchema = z
  .object({
    brandSlug: z.string().min(1).max(80),
    /** Required for section path videos/sections/{slug}-{n}.mp4 */
    productSlug: z.string().min(1).max(120).optional(),
    /** Omit with productSlug for hero → videos/{slug}-hero.mp4 */
    sectionIndex: z.number().int().min(0).max(98).optional(),
    filename: z.string().max(200).optional(),
    contentType: z.string().max(100).optional(),
    contentLength: z
      .number()
      .int()
      .positive()
      .max(50 * 1024 * 1024)
      .optional(),
  })
  .strict();

export type RunwayUploadPresignPostBody = z.infer<typeof runwayUploadPresignPostBodySchema>;

/** Формат ошибки Zod для JSON-ответа API. */
export function formatZodError(error: z.ZodError): { message: string; issues: z.ZodIssue[] } {
  return {
    message: 'Validation failed',
    issues: error.issues,
  };
}
