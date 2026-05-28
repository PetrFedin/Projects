/**
 * Wave 30 — PG staging, PG-only verify, UAT auto %, live-harness, wave30Priority (+10 tests).
 */
import fs from 'node:fs';
import path from 'node:path';

import { findHandbookLeafById } from '@/lib/production/category-catalog';
import { buildWorkshop2Ss27MenCoat01FullTzDemoDossier } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';
import {
  buildWorkshop2Ss27B2bUatAutoChecks,
  buildWorkshop2Ss27UatChecklistResponse,
  computeWorkshop2Ss27UatAutoProgressPct,
} from '@/lib/production/workshop2-ss27-uat-checklist-api';
import {
  buildWorkshop2StagingLiveHarness,
  buildWorkshop2StagingLiveHarnessPrioritizedActions,
  buildWorkshop2Wave30PriorityProbe,
} from '@/lib/production/workshop2-live-integration-probes';
import { summarizeWorkshop2HubPgOnlyBanner } from '@/lib/production/workshop2-hub-pg-only-policy';

const root = process.cwd();
const LEAF = findHandbookLeafById('catalog-apparel-g0-l0-m-outerwear-l2-coats-l3-parka');

describe('wave30 — pg staging up script', () => {
  it('glob migrations 007+ and CI exit codes', () => {
    const script = path.join(root, 'scripts/workshop2-pg-staging-up.mjs');
    const src = fs.readFileSync(script, 'utf8');
    expect(src).toMatch(/listWorkshop2StagingMigrations/);
    expect(src).toMatch(/process\.exit\(2\)/);
    expect(src).toMatch(/process\.exit\(3\)/);
    expect(src).toMatch(/demo-ss27/);
  });

  it('pg-only-verify script exists with PG_ONLY gate', () => {
    const script = path.join(root, 'scripts/workshop2-pg-only-verify.mjs');
    expect(fs.existsSync(script)).toBe(true);
    const src = fs.readFileSync(script, 'utf8');
    expect(src).toMatch(/WORKSHOP2_PG_ONLY/);
    expect(src).toMatch(/hub-summary/);
    expect(src).toMatch(/phase1-dossier/);
  });
});

describe('wave30 — ss27 UAT automation', () => {
  it('b2b auto checks include cart, showroom, threads', () => {
    const leaf = LEAF ?? null;
    const dossier = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'w30');
    const checks = buildWorkshop2Ss27B2bUatAutoChecks({ dossiers: [dossier] });
    expect(checks.map((c) => c.id)).toEqual([
      'b2b_cart_api',
      'b2b_showroom_publish_readiness',
      'b2b_threads_merge',
    ]);
    expect(checks.find((c) => c.id === 'b2b_cart_api')?.ok).toBe(true);
    expect(checks.find((c) => c.id === 'b2b_threads_merge')?.ok).toBe(true);
  });

  it('checklist response exposes autoProgressPct and readyForHumanSignoff', () => {
    const leaf = LEAF ?? null;
    const dossier = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'w30');
    const resp = buildWorkshop2Ss27UatChecklistResponse({
      dossiers: [dossier],
      env: { WORKSHOP2_MARKET: 'ru' },
    });
    expect(typeof resp.autoProgressPct).toBe('number');
    expect(resp.autoProgressPct).toBeGreaterThan(0);
    expect(Array.isArray(resp.b2bAutoChecks)).toBe(true);
    expect(Array.isArray(resp.remainingManualSteps)).toBe(true);
    expect(typeof resp.readyForHumanSignoff).toBe('boolean');
  });

  it('computeWorkshop2Ss27UatAutoProgressPct blends items and b2b checks', () => {
    const pct = computeWorkshop2Ss27UatAutoProgressPct({
      items: [
        {
          id: 'a',
          step: 1,
          titleRu: 'a',
          passCriteriaRu: '',
          status: 'auto_pass',
          autoChecked: true,
        },
        {
          id: 'b',
          step: 2,
          titleRu: 'b',
          passCriteriaRu: '',
          status: 'manual',
          autoChecked: false,
        },
      ],
      b2bAutoChecks: [
        { id: 'x', labelRu: 'x', ok: true, noteRu: '' },
        { id: 'y', labelRu: 'y', ok: false, noteRu: '' },
      ],
    });
    expect(pct).toBeGreaterThan(0);
    expect(pct).toBeLessThanOrEqual(100);
  });
});

describe('wave30 — live-harness prioritized actions', () => {
  it('returns up to 3 missing env actions', () => {
    const harness = buildWorkshop2StagingLiveHarness({
      NODE_ENV: 'development',
      WORKSHOP2_EDO_PROVIDER: 'kontur',
    });
    expect(harness.prioritizedActions.length).toBeGreaterThan(0);
    expect(harness.prioritizedActions.length).toBeLessThanOrEqual(3);
    expect(harness.prioritizedActions[0]?.envKey).toMatch(/^WORKSHOP2_/);
  });

  it('buildWorkshop2StagingLiveHarnessPrioritizedActions respects limit', () => {
    const actions = buildWorkshop2StagingLiveHarnessPrioritizedActions(
      [
        {
          id: 'edo',
          labelRu: 'ЭДО',
          ready: false,
          missingEnvKeys: ['A', 'B', 'C', 'D'],
          hintRu: '',
        },
      ],
      2
    );
    expect(actions).toHaveLength(2);
  });
});

describe('wave30 — hub PG_ONLY + UI artifacts', () => {
  it('hub PG_ONLY banner without postgres links setup', () => {
    const banner = summarizeWorkshop2HubPgOnlyBanner({
      backendStatus: 'local_only',
      pgOnlyMode: true,
      postgresConfigured: false,
    });
    expect(banner?.setupHref).toBe('/brand/production/workshop2/setup');
  });

  it('UAT checklist panel component exists', () => {
    expect(
      fs.existsSync(
        path.join(root, 'src/components/brand/production/Workshop2Ss27UatChecklistPanel.tsx')
      )
    ).toBe(true);
  });

  it('wave30Priority probe passes when artifacts present', () => {
    const probe = buildWorkshop2Wave30PriorityProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.wave30Priority).toBeGreaterThanOrEqual(6);
    expect(probe.ok).toBe(true);
    expect(probe.checks.some((c) => c.id === 'ss27_uat_b2b_auto_checks')).toBe(true);
  });
});
