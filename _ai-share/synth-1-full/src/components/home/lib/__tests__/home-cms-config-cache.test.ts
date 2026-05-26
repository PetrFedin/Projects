import { DEFAULT_HOME_CMS } from '@/data/cms.home.default';
import {
  loadHomeCmsConfig,
  prefetchHomeCmsConfig,
  resetHomeCmsConfigCache,
} from '@/components/home/lib/home-cms-config-cache';

const mockCms = { ...DEFAULT_HOME_CMS, updatedAtISO: '2026-01-01T00:00:00.000Z' };

describe('home-cms-config-cache', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    resetHomeCmsConfigCache();
    localStorage.clear();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockCms,
    });
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    resetHomeCmsConfigCache();
    localStorage.clear();
  });

  it('dedupes concurrent loadHomeCmsConfig calls', async () => {
    const [a, b] = await Promise.all([loadHomeCmsConfig(), loadHomeCmsConfig()]);
    expect(a).toEqual(mockCms);
    expect(b).toEqual(mockCms);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/home/cms', { credentials: 'same-origin' });
  });

  it('prefers localStorage override over API', async () => {
    const local = { ...mockCms, hero: { ...mockCms.hero, title: 'Local title' } };
    localStorage.setItem('syntha_cms_home_v1', JSON.stringify(local));
    const cfg = await loadHomeCmsConfig();
    expect(cfg.hero.title).toBe('Local title');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('prefetchHomeCmsConfig is idempotent', async () => {
    prefetchHomeCmsConfig();
    prefetchHomeCmsConfig();
    await loadHomeCmsConfig();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('seedHomeCmsConfigCache skips fetch until localStorage checked', async () => {
    const { seedHomeCmsConfigCache } = await import('@/components/home/lib/home-cms-config-cache');
    seedHomeCmsConfigCache(mockCms);
    const cfg = await loadHomeCmsConfig();
    expect(cfg).toEqual(mockCms);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
