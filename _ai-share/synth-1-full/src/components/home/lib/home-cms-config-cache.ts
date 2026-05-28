import type { CmsHomeConfig } from '@/data/cms.home.default';
import { DEFAULT_HOME_CMS } from '@/data/cms.home.default';

const LS_KEY = 'syntha_cms_home_v1';

let cachedCms: CmsHomeConfig | undefined;
let inflight: Promise<CmsHomeConfig> | null = null;

function readLocalStorageOverride(): CmsHomeConfig | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CmsHomeConfig;
  } catch {
    return null;
  }
}

/** Server baseline через API — быстрее, чем синхронный repo на cold client. */
async function fetchServerBaseline(): Promise<CmsHomeConfig> {
  const res = await fetch('/api/home/cms', { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`home cms api ${res.status}`);
  return (await res.json()) as CmsHomeConfig;
}

/** Singleton load — dedupe между prefetch и useHomeCmsConfig. */
export async function loadHomeCmsConfig(): Promise<CmsHomeConfig> {
  if (cachedCms !== undefined) return cachedCms;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const local = readLocalStorageOverride();
      if (local) {
        cachedCms = local;
        return cachedCms;
      }

      if (typeof window !== 'undefined') {
        cachedCms = await fetchServerBaseline();
        return cachedCms;
      }

      cachedCms = DEFAULT_HOME_CMS;
      return cachedCms;
    } catch (error) {
      console.warn('Failed to load home CMS config:', error);
      cachedCms = DEFAULT_HOME_CMS;
      return cachedCms;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

/** Warmup из shell — пока грузятся lazy mid-fold chunks. Skip if RSC seed уже в cache. */
export function prefetchHomeCmsConfig(): void {
  if (typeof window === 'undefined') return;
  if (cachedCms !== undefined || inflight) return;
  void loadHomeCmsConfig();
}

/** Только для тестов / dev reset. */
export function resetHomeCmsConfigCache(): void {
  cachedCms = undefined;
  inflight = null;
}

/** RSC baseline — instant first paint до client fetch / localStorage. */
export function seedHomeCmsConfigCache(baseline: CmsHomeConfig): void {
  if (cachedCms === undefined && !inflight) {
    cachedCms = baseline;
  }
}

/** Sync read — guard prefetch / shell warmup when RSC уже прогрел cache. */
export function readHomeCmsConfigCache(): CmsHomeConfig | undefined {
  return cachedCms;
}
