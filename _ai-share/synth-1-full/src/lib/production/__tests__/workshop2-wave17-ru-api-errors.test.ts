/**
 * Wave 17 RU — API route wrapper, connectivity summary, B2B neutral order (+6 tests).
 */
/** @jest-environment node */

import fs from 'node:fs';
import path from 'node:path';

import {
  withWorkshop2ApiErrorRu,
  buildWorkshop2ApiRouteRuErrorBody,
} from '@/lib/production/workshop2-api-route-ru';
import { buildWorkshop2ErrorRuBody } from '@/lib/production/workshop2-api-error-ru';
import { buildWorkshop2SetupConnectivityRows } from '@/lib/production/workshop2-setup-connectivity-summary';
import { summarizeWorkshop2B2bExternalOrderNeutralRu } from '@/lib/production/workshop2-b2b-marketplace-inbound';
import {
  buildWorkshop2Wave17RuApiErrorsProbe,
  buildWorkshop2Wave17RuStabilizationProbe,
} from '@/lib/production/workshop2-live-integration-probes';

describe('workshop2 wave17 — withWorkshop2ApiErrorRu wrapper', () => {
  it('buildWorkshop2ApiRouteRuErrorBody returns unified JSON on thrown Error', () => {
    const body = buildWorkshop2ApiRouteRuErrorBody(new Error('PG timeout'));
    expect(body.ok).toBe(false);
    expect(body.code).toBe('internal_error');
    expect(String(body.messageRu)).toMatch(/PG timeout/);
    expect(body.error).toBe('internal_error');
  });

  it('withWorkshop2ApiErrorRu is a function wrapper', () => {
    const wrapped = withWorkshop2ApiErrorRu(
      async () => new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    expect(typeof wrapped).toBe('function');
  });
});

describe('workshop2 wave17 — high-traffic routes wrapped', () => {
  const suffixes = [
    'bulk-handoff/route.ts',
    'bulk-showroom-publish/route.ts',
    'calendar-sync/route.ts',
    'vendor-bids/route.ts',
    'fit-comments/route.ts',
    'marking/register-order/route.ts',
    'export-1c/route.ts',
    'rf-logistics-docs/route.ts',
  ];

  it.each(suffixes)('%s imports withWorkshop2ApiErrorRu', (suffix) => {
    const root = path.join(process.cwd(), 'src/app/api/workshop2');
    const walk = (dir: string): string | null => {
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          const hit = walk(p);
          if (hit) return hit;
        } else if (p.replace(/\\/g, '/').endsWith(suffix)) return p;
      }
      return null;
    };
    const file = walk(root);
    expect(file).toBeTruthy();
    const src = fs.readFileSync(file!, 'utf8');
    expect(src).toContain('withWorkshop2ApiErrorRu');
    expect(src).toContain('jsonWorkshop2ErrorRu');
  });
});

describe('workshop2 wave17 — setup connectivity summary', () => {
  it('buildWorkshop2SetupConnectivityRows aggregates three APIs', async () => {
    const built = await buildWorkshop2SetupConnectivityRows({
      probes: {
        ok: true,
        market: 'ru',
        wave17RuApiErrors: { checks: [{ id: 'api_error_ru_high_traffic_wrapper', ok: true }] },
      },
      readiness: { readyForInvestorDemo: true, stagingNoteRu: 'staging honest' },
      uat: { autoPassed: 12, manualRemaining: 0, items: new Array(12).fill({}) },
    });
    expect(built.rows.some((r) => r.id === 'integration_probes' && r.status === 'ok')).toBe(true);
    expect(built.rows.some((r) => r.id === 'investor_readiness')).toBe(true);
    expect(built.rows.some((r) => r.id === 'ss27_uat' && r.status === 'ok')).toBe(true);
    expect(built.summaryRu).toMatch(/Связность/);
  });
});

describe('workshop2 wave17 — B2B external order neutral RU', () => {
  it('hides JOOR branding label when market=ru', () => {
    const s = summarizeWorkshop2B2bExternalOrderNeutralRu({
      externalOrderId: 'ORD-991',
      provider: 'joor',
      market: 'ru',
    });
    expect(s?.labelRu).toBe('Внешний заказ: ORD-991');
    expect(s?.labelRu).not.toMatch(/JOOR/);
  });
});

describe('workshop2 wave17 — wave17RuApiErrors probe', () => {
  it('probe reports 8/8 high-traffic wrappers', () => {
    const probe = buildWorkshop2Wave17RuApiErrorsProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.highTrafficTotal).toBe(8);
    expect(probe.highTrafficWrapped).toBeGreaterThanOrEqual(8);
    expect(probe.checks.some((c) => c.id === 'api_error_ru_high_traffic_wrapper' && c.ok)).toBe(
      true
    );
  });

  it('stabilization probe includes setup connectivity check', () => {
    const probe = buildWorkshop2Wave17RuStabilizationProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.checks.some((c) => c.id === 'setup_connectivity_check_button')).toBe(true);
  });

  it('buildWorkshop2ErrorRuBody exposes code-compatible error field', () => {
    const body = buildWorkshop2ErrorRuBody('dossier_not_found');
    expect(body.messageRu).toMatch(/Досье/);
    expect(body.error).toBe('dossier_not_found');
  });
});
