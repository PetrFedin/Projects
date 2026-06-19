import {
  shouldPlatformCorePersistAuxiliaryToFile,
  shouldPlatformCoreReadAuxiliaryFromFile,
  shouldWorkshop2PersistAuxiliaryJsonToFile,
  shouldWorkshop2ReadAuxiliaryJsonFromFile,
} from '@/lib/server/platform-core-pg-primary-file-policy';

jest.mock('@/lib/integrations/spine/spine-pg-hydrate-guards', () => ({
  isSpineOperationalPgPrimary: jest.fn(),
}));

jest.mock('@/lib/production/workshop2-hub-pg-only-policy', () => ({
  isWorkshop2PgOnlyMode: jest.fn(),
}));

jest.mock('@/lib/server/platform-core-spine-pg.server', () => ({
  shouldSkipNativeJsonFileStores: jest.fn(),
}));

import { isSpineOperationalPgPrimary } from '@/lib/integrations/spine/spine-pg-hydrate-guards';
import { isWorkshop2PgOnlyMode } from '@/lib/production/workshop2-hub-pg-only-policy';
import { shouldSkipNativeJsonFileStores } from '@/lib/server/platform-core-spine-pg.server';

const mockPgPrimary = isSpineOperationalPgPrimary as jest.Mock;
const mockW2PgOnly = isWorkshop2PgOnlyMode as jest.Mock;
const mockSkipJson = shouldSkipNativeJsonFileStores as jest.Mock;

describe('platform-core-pg-primary-file-policy', () => {
  afterEach(() => {
    mockPgPrimary.mockReset();
    mockW2PgOnly.mockReset();
    mockSkipJson.mockReset();
    delete process.env.WORKSHOP2_TEST_USE_PG;
  });

  it('allows file persist when PG is not primary', () => {
    mockPgPrimary.mockReturnValue(false);
    expect(shouldPlatformCorePersistAuxiliaryToFile()).toBe(true);
    expect(shouldPlatformCoreReadAuxiliaryFromFile()).toBe(true);
  });

  it('skips file persist/read when PG is primary', () => {
    mockPgPrimary.mockReturnValue(true);
    expect(shouldPlatformCorePersistAuxiliaryToFile()).toBe(false);
    expect(shouldPlatformCoreReadAuxiliaryFromFile()).toBe(false);
  });

  it('allows workshop2 JSON mirrors in test env (file fallback for unit tests)', () => {
    expect(shouldWorkshop2PersistAuxiliaryJsonToFile()).toBe(true);
  });

  it('blocks workshop2 JSON mirrors when pg-only or spine skips native JSON (runtime)', () => {
    process.env.WORKSHOP2_TEST_USE_PG = '1';
    mockW2PgOnly.mockReturnValue(true);
    mockSkipJson.mockReturnValue(false);
    expect(shouldWorkshop2PersistAuxiliaryJsonToFile()).toBe(false);

    mockW2PgOnly.mockReturnValue(false);
    mockSkipJson.mockReturnValue(true);
    expect(shouldWorkshop2PersistAuxiliaryJsonToFile()).toBe(false);
  });
});
