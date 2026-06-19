import {
  isSpineOperationalPgPrimary,
  shouldSpinePersistImportedOrdersToFile,
  shouldApplyPgSnapshot,
} from '@/lib/integrations/spine/spine-pg-hydrate-guards';

describe('spine-pg-hydrate-guards', () => {
  const env = process.env;

  afterEach(() => {
    process.env = env;
  });

  it('shouldApplyPgSnapshot keeps file when PG empty and not primary', () => {
    delete process.env.SPINE_OPERATIONAL_PG_PRIMARY;
    expect(shouldApplyPgSnapshot(0, 3)).toBe(false);
    expect(shouldApplyPgSnapshot(0, 0)).toBe(true);
    expect(shouldApplyPgSnapshot(2, 3)).toBe(true);
  });

  it('shouldApplyPgSnapshot always applies when PG-primary', () => {
    process.env.SPINE_OPERATIONAL_PG_PRIMARY = '1';
    process.env.WORKSHOP2_DATABASE_URL = 'postgresql://x';
    expect(isSpineOperationalPgPrimary()).toBe(true);
    expect(shouldApplyPgSnapshot(0, 5)).toBe(true);
    expect(shouldSpinePersistImportedOrdersToFile()).toBe(false);
  });
});
