/**
 * Wave 26 — staging live-harness API + advanced credit scoring (+6 unit tests).
 */
import fs from 'node:fs';
import path from 'node:path';

import {
  buildWorkshop2StagingLiveHarness,
  buildWorkshop2Wave26RuE2eReadyProbe,
  isWorkshop2StagingLiveHarnessAllowed,
} from '@/lib/production/workshop2-live-integration-probes';
import {
  buildWorkshop2B2bCreditScoreRows,
  computeWorkshop2B2bCreditScore,
} from '@/lib/production/workshop2-b2b-credit-scoring';
import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';

describe('workshop2 wave26 — staging live-harness', () => {
  it('allowed in development NODE_ENV', () => {
    expect(isWorkshop2StagingLiveHarnessAllowed({ NODE_ENV: 'development' })).toBe(true);
  });

  it('allowed when STAGING=true', () => {
    expect(isWorkshop2StagingLiveHarnessAllowed({ NODE_ENV: 'production', STAGING: 'true' })).toBe(
      true
    );
  });

  it('lists missing env keys for EDO/MES/ERP when unconfigured', () => {
    const harness = buildWorkshop2StagingLiveHarness({
      NODE_ENV: 'development',
      WORKSHOP2_EDO_PROVIDER: 'kontur',
    });
    expect(harness.items.some((i) => i.id === 'edo' && !i.ready)).toBe(true);
    expect(harness.items.some((i) => i.id === 'mes' && !i.ready)).toBe(true);
    expect(harness.allReady).toBe(false);
    expect(harness.summaryRu).toMatch(/Не хватает/);
    expect(harness.prioritizedActions.length).toBeGreaterThan(0);
  });

  it('mock EDO counts as ready without live URL', () => {
    const harness = buildWorkshop2StagingLiveHarness({
      NODE_ENV: 'development',
      WORKSHOP2_EDO_PROVIDER: 'mock',
      WORKSHOP2_FLOOR_MES_URL: 'http://127.0.0.1:4010/floor/sample-status',
      WORKSHOP2_FACTORY_ERP_BASE_URL: 'https://erp.example.test',
      WORKSHOP2_MARKING_API_URL: 'https://marking.example.test',
    });
    const edo = harness.items.find((i) => i.id === 'edo');
    expect(edo?.ready).toBe(true);
    expect(edo?.missingEnvKeys).toEqual([]);
  });

  it('live-harness route file exists', () => {
    const route = path.join(process.cwd(), 'src/app/api/workshop2/staging/live-harness/route.ts');
    expect(fs.existsSync(route)).toBe(true);
  });
});

describe('workshop2 wave26 — advanced credit scoring', () => {
  const baseAccount = {
    territoryId: 'RU-MOW',
    creditLimitRub: 1_000_000,
    openOrdersRub: 900_000,
    customerName: 'Demo Retail MOW',
  };

  it('high utilization + hold lowers score below 50', () => {
    const result = computeWorkshop2B2bCreditScore({
      account: baseAccount,
      territoryOrders: [] as Workshop2B2bOrderRecord[],
    });
    expect(result.onHold).toBe(true);
    expect(result.score).toBeLessThan(50);
    expect(result.suggestedLimitRub).toBeLessThan(baseAccount.creditLimitRub);
  });

  it('buildWorkshop2B2bCreditScoreRows returns buyer rows with suggested limit', () => {
    const rows = buildWorkshop2B2bCreditScoreRows({
      territories: [
        {
          ...baseAccount,
          labelRu: 'Москва и МО',
          openOrdersRub: 200_000,
        },
      ],
      orders: [],
    });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.buyerName).toBe('Demo Retail MOW');
    expect(rows[0]?.territoryId).toBe('RU-MOW');
    expect(rows[0]?.score).toBeGreaterThanOrEqual(0);
    expect(rows[0]?.score).toBeLessThanOrEqual(100);
    expect(rows[0]?.suggestedLimitRub).toBeGreaterThan(0);
  });
});

describe('workshop2 wave26 — wave26RuE2eReady probe', () => {
  it('probe ok when Wave 26 artifacts on disk', () => {
    const probe = buildWorkshop2Wave26RuE2eReadyProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.checks.some((c) => c.id === 'e2e_ru_full_path_spec')).toBe(true);
    expect(probe.checks.some((c) => c.id === 'b2b_advanced_credit_scoring')).toBe(true);
    expect(probe.ok).toBe(true);
  });
});
