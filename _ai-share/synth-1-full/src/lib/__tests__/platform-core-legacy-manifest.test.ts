import {
  PLATFORM_CORE_LEGACY_PAGE_SPLITS,
  platformCoreLegacyManifestStats,
} from '@/lib/platform-core-legacy-manifest';
import { getPlatformCoreCollectionLabel } from '@/lib/platform-core-demo-context';

describe('platform-core-legacy-manifest', () => {
  it('инвентарь page-split legacy ≥ 50 файлов', () => {
    expect(PLATFORM_CORE_LEGACY_PAGE_SPLITS.length).toBeGreaterThanOrEqual(50);
    const stats = platformCoreLegacyManifestStats();
    expect(stats.pageSplitCount).toBe(PLATFORM_CORE_LEGACY_PAGE_SPLITS.length);
    expect(stats.total).toBeGreaterThanOrEqual(56);
  });
});

describe('getPlatformCoreCollectionLabel', () => {
  it('бизнес-подписи без кодов сезонов в UI', () => {
    expect(getPlatformCoreCollectionLabel('SS27')).toBe('Весна–лето 2027');
    expect(getPlatformCoreCollectionLabel('FW27')).toBe('Осень–зима 2027');
    expect(getPlatformCoreCollectionLabel('EMPTY27')).toBe('Пустая коллекция (без данных)');
  });
});
