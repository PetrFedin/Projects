/**
 * Public API barrel для runway — импорт из @/lib/runway.
 */
export { RunwayExperienceService } from './RunwayExperienceService';
export {
  RunwayProductRepository,
  loadRunwayProductCatalog,
  resetRunwayProductRepository,
} from './RunwayProductRepository';
export { fetchRunwayProductBySlug, loadRunwayProduct } from './fetch-runway-product';
export {
  loadRunwayExperience,
  loadRunwayProducts,
  loadScrollExperienceConfig,
  resetRunwayExperienceCache,
} from './RunwayExperienceService';
export {
  aggregateRunwayAnalytics,
  aggregateRunwayAnalyticsFromEvents,
  mergeRunwayAnalyticsEvents,
  type RunwayAnalyticsDashboard,
  type RunwayFunnelStep,
  type RunwaySectionPopularityRow,
} from './runway-analytics-aggregation';
export {
  t,
  setRunwayLocale,
  getRunwayLocale,
  listRunwayI18nKeys,
  verifyRunwayI18nParity,
  type RunwayI18nKey,
  type RunwayLocale,
} from './runway-i18n';
export {
  buildRunwayShareCardViewModel,
  formatRunwayShareCardPlainText,
  type RunwayShareCardViewModel,
} from './runway-share-card';
export {
  buildRunwayShareLink,
  buildRunwayEmailCampaignLink,
  formatRunwayEmailCampaignSnippet,
  type RunwayShareLinkOptions,
} from './runway-share-link-builder';
export { parseCompareParam, resolveKioskMode, clampCompareIndices } from './runway-mode-utils';
export {
  normalizeScrollExperienceConfig,
  resolveAnalyticsWebhookUrl,
  validateScrollExperienceRaw,
  scrollExperienceRawSchema,
  SCROLL_EXPERIENCE_V3_DEFAULTS,
} from './scroll-experience-schema';
export {
  filterRunwayAnalyticsEventsByDateRange,
  paginateRunwayAnalyticsEvents,
  parseRunwayAnalyticsDateParam,
  resolveRunwayAnalyticsQueryFromUrl,
  runwayAnalyticsPresetRange,
  RUNWAY_ANALYTICS_DEFAULT_PAGE_SIZE,
  type RunwayAnalyticsDateRange,
  type RunwayAnalyticsEventsPage,
  type RunwayAnalyticsQueryParams,
} from './runway-analytics-query';
export { buildRunwayThemeStyle, resolveRunwayTheme, runwayThemeClassName } from './runway-theme';
export { resolveRunwayDataSource } from './runway-data-source';
