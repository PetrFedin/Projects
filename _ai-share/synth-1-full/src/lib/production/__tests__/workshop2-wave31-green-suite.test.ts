/**
 * Wave 31 — green suite smoke: 0 unit failures meta + wave31GreenSuite probe.
 */
import fs from 'node:fs';
import path from 'node:path';

import { buildWorkshop2Wave31GreenSuiteProbe } from '@/lib/production/workshop2-live-integration-probes';
import { buildWorkshop2FileStoreDemoDossier } from '@/lib/production/workshop2-file-store-demo-bootstrap';
import { buildWorkshop2Ss27UatChecklistResponse } from '@/lib/production/workshop2-ss27-uat-checklist-api';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import { buildWorkshop2Ss27MenCoat01FullTzDemoDossier } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';

describe('workshop2 wave31 — green suite smoke', () => {
  it('jest polyfills include TextEncoder (setupFiles)', () => {
    expect(typeof globalThis.TextEncoder).toBe('function');
    expect(typeof globalThis.TextDecoder).toBe('function');
    const polyfills = fs.readFileSync(path.join(process.cwd(), 'jest.polyfills.js'), 'utf8');
    expect(polyfills).toMatch(/TextEncoder/);
  });

  it('wave31GreenSuite probe passes when Wave 31 artifacts present', () => {
    const probe = buildWorkshop2Wave31GreenSuiteProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.checks.some((c) => c.id === 'wave31_green_suite_test')).toBe(true);
    expect(probe.checks.some((c) => c.id === 'ss27_uat_demo_seed_module')).toBe(true);
    expect(probe.unitTestsGreen).toBe(true);
    expect(probe.ok).toBe(true);
  });

  it('demo-ss27-01 UAT seed → showroom publish + readyForHumanSignoff with 2 dossiers', () => {
    const leaf = findHandbookLeafById('catalog-apparel-g0-l0');
    const coat = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'w31');
    const dress = buildWorkshop2FileStoreDemoDossier({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
    });
    expect(coat?.b2bIntegrationDraft?.wholesalePrice).toBeGreaterThan(0);
    const resp = buildWorkshop2Ss27UatChecklistResponse({
      dossiers: [coat, dress!],
      env: { WORKSHOP2_MARKET: 'ru' },
    });
    expect(resp.b2bAutoChecks.find((c) => c.id === 'b2b_showroom_publish_readiness')?.ok).toBe(
      true
    );
    expect(resp.readyForHumanSignoff).toBe(true);
    expect(resp.autoProgressPct).toBeGreaterThanOrEqual(80);
  });
});
