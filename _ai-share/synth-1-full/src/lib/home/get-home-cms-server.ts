import { DEFAULT_HOME_CMS, type CmsHomeConfig } from '@/data/cms.home.default';

/** Server-side baseline CMS (без localStorage). Единый источник для RSC/API. */
export function getHomeCmsServerBaseline(): CmsHomeConfig {
  return DEFAULT_HOME_CMS;
}
