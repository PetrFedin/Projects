/**
 * Wave 27 — green suite smoke: wave-h regression + probes import fix + wave27GreenSuite probe.
 */
import fs from 'node:fs';
import path from 'node:path';

import { buildWorkshop2Wave27GreenSuiteProbe } from '@/lib/production/workshop2-live-integration-probes';
import { summarizeWorkshop2MarketProfileRu } from '@/lib/production/workshop2-market-profile';

describe('workshop2 wave27 — green suite smoke', () => {
  it('summarizeWorkshop2MarketProfileRu is callable (probes import fix)', () => {
    const market = summarizeWorkshop2MarketProfileRu({ WORKSHOP2_MARKET: 'ru' });
    expect(market.market).toBe('ru');
  });

  it('wave-h development test file exists on disk', () => {
    const waveH = path.join(
      process.cwd(),
      'src/lib/production/__tests__/workshop2-wave-h-development.test.ts'
    );
    expect(fs.existsSync(waveH)).toBe(true);
    const src = fs.readFileSync(waveH, 'utf8');
    expect(src).toMatch(/hooks before loading early return/);
  });

  it('wave27GreenSuite probe passes when Wave 27 artifacts present', () => {
    const probe = buildWorkshop2Wave27GreenSuiteProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.checks.some((c) => c.id === 'wave_h_hooks_regression_test')).toBe(true);
    expect(probe.checks.some((c) => c.id === 'wave27_green_suite_test')).toBe(true);
    expect(probe.checks.some((c) => c.id === 'b2b_marketplace_inbound_route')).toBe(true);
    expect(probe.ok).toBe(true);
  });
});
