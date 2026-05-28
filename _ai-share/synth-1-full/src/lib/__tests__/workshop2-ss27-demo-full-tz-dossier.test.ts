/**
 * @jest-environment node
 */
import {
  isSs27FullTzDemoAutoMergeEnabled,
  mergeSs27DemoDossierIfNeeded,
} from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';

describe('workshop2-ss27-demo-full-tz-dossier', () => {
  const prev = process.env.NEXT_PUBLIC_W2_SS27_FULL_TZ_DEMO;

  afterEach(() => {
    if (prev === undefined) delete process.env.NEXT_PUBLIC_W2_SS27_FULL_TZ_DEMO;
    else process.env.NEXT_PUBLIC_W2_SS27_FULL_TZ_DEMO = prev;
  });

  it('mergeSs27DemoDossierIfNeeded returns dossier when merge enabled and stored empty', () => {
    delete process.env.NEXT_PUBLIC_W2_SS27_FULL_TZ_DEMO;
    expect(isSs27FullTzDemoAutoMergeEnabled()).toBe(true);
    const merged = mergeSs27DemoDossierIfNeeded(
      'SS27',
      { id: 'demo-ss27-01', sku: 'SS27-M-COAT-01' },
      null,
      null,
      'tester'
    );
    expect(merged).not.toBeNull();
    expect(merged?.sectionSignoffs?.general?.brand?.by).toBeTruthy();
  });

  it('mergeSs27DemoDossierIfNeeded returns null when NEXT_PUBLIC_W2_SS27_FULL_TZ_DEMO=0', () => {
    process.env.NEXT_PUBLIC_W2_SS27_FULL_TZ_DEMO = '0';
    expect(isSs27FullTzDemoAutoMergeEnabled()).toBe(false);
    const merged = mergeSs27DemoDossierIfNeeded(
      'SS27',
      { id: 'demo-ss27-01', sku: 'SS27-M-COAT-01' },
      null,
      null,
      'tester'
    );
    expect(merged).toBeNull();
  });
});
