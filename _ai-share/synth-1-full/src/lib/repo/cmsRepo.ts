import { DEFAULT_HOME_CMS, CmsHomeConfig } from '@/data/cms.home.default';

const LS_KEY = 'syntha_cms_home_v1';

export interface CmsRepo {
  getHome(): Promise<CmsHomeConfig>;
  saveHome(cfg: CmsHomeConfig): Promise<CmsHomeConfig>;
  resetHome(): Promise<CmsHomeConfig>;
}

export class MockCmsRepo implements CmsRepo {
  async getHome(): Promise<CmsHomeConfig> {
    if (typeof window === 'undefined') {
      // SSR fallback
      return DEFAULT_HOME_CMS;
    }
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_HOME_CMS;
    try {
      return JSON.parse(raw) as CmsHomeConfig;
    } catch {
      return DEFAULT_HOME_CMS;
    }
  }

  async saveHome(cfg: CmsHomeConfig): Promise<CmsHomeConfig> {
    const next: CmsHomeConfig = { ...cfg, updatedAtISO: new Date().toISOString() };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    }
    return next;
  }

  async resetHome(): Promise<CmsHomeConfig> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LS_KEY);
    }
    return DEFAULT_HOME_CMS;
  }
}
