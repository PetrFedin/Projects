/**
 * Wave 18–19 RU — API coverage probe, calendar movement, contour, WMS labels, UAT seed, stabilization (+11 tests).
 */
/** @jest-environment node */

import fs from 'node:fs';
import path from 'node:path';

import {
  buildWorkshop2BrandCalendarEventsFromSampleMovement,
  buildWorkshop2BrandCalendarEventsForArticle,
} from '@/lib/production/workshop2-brand-calendar-sync';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2Wave18RuApiCoverageProbe,
  buildWorkshop2Wave19RuStabilizationProbe,
} from '@/lib/production/workshop2-live-integration-probes';
import { buildWorkshop2Ss27MenCoat01FullTzDemoDossier } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';
import { buildWorkshop2DossierLinkedPaths } from '@/lib/production/workshop2-dossier-linked-paths';
import {
  buildWorkshop2Ss27UatChecklistResponse,
  autoCheckWorkshop2Ss27UatItems,
} from '@/lib/production/workshop2-ss27-uat-checklist-api';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import {
  buildWorkshop2Ss27RuJourneySteps,
  summarizeWorkshop2RuContourStatusLines,
} from '@/lib/production/workshop2-ru-journey-ss27';
import {
  labelWorkshop2WmsMovementKindRu,
  WORKSHOP2_WMS_MOVEMENT_KIND_LABELS_RU,
} from '@/lib/production/workshop2-internal-wms';
import { buildWorkshop2SetupConnectivityRows } from '@/lib/production/workshop2-setup-connectivity-summary';

describe('workshop2 wave18 — wave18RuApiCoverage probe', () => {
  it('reports 10/10 wave18 critical wrappers and 26/26 cumulative', () => {
    const probe = buildWorkshop2Wave18RuApiCoverageProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.wave18Total).toBe(10);
    expect(probe.wave18Wrapped).toBeGreaterThanOrEqual(10);
    expect(probe.wave19Total).toBe(8);
    expect(probe.cumulativeTotal).toBe(26);
    expect(probe.cumulativeWrapped).toBeGreaterThanOrEqual(26);
    expect(probe.checks.some((c) => c.id === 'api_error_ru_cumulative_coverage' && c.ok)).toBe(
      true
    );
  });

  it('wave18 critical route files import withWorkshop2ApiErrorRu', () => {
    const suffixes = [
      'change-requests/route.ts',
      'showroom/route.ts',
      'plm-outbox/process/route.ts',
      'purchase-orders/route.ts',
      'handoff-readiness/route.ts',
      'export-tz-bundle/route.ts',
    ];
    const root = path.join(process.cwd(), 'src/app/api/workshop2');
    const findFile = (suffix: string): string | null => {
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
      return walk(root);
    };
    for (const suffix of suffixes) {
      const file = findFile(suffix);
      expect(file).toBeTruthy();
      expect(fs.readFileSync(file!, 'utf8')).toContain('withWorkshop2ApiErrorRu');
    }
  });
});

describe('workshop2 wave18 — sample movement calendar events', () => {
  it('adds RU titles for in_transit and received', () => {
    const events = buildWorkshop2BrandCalendarEventsFromSampleMovement({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      orders: [
        {
          id: 'ord-abc-123',
          movementLog: [
            { at: '2026-05-20T10:00:00.000Z', to: 'in_transit' },
            { at: '2026-05-22T14:00:00.000Z', to: 'received' },
          ],
        },
      ],
    });
    expect(
      events.some((e) => e.sourceKind === 'sample_movement' && e.title.includes('в пути'))
    ).toBe(true);
    expect(events.some((e) => e.title.includes('Принят'))).toBe(true);
  });

  it('merges movement events in buildWorkshop2BrandCalendarEventsForArticle', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const merged = buildWorkshop2BrandCalendarEventsForArticle({
      collectionId: 'SS27',
      articleId: 'a1',
      dossier,
      sampleOrders: [{ id: 'o1', movementStatus: 'in_transit', movementLog: [] }],
    });
    expect(merged.some((e) => e.sourceKind === 'sample_movement')).toBe(true);
  });
});

describe('workshop2 wave18 — contour status lines', () => {
  it('summarizeWorkshop2RuContourStatusLines returns three RU lines', () => {
    const steps = buildWorkshop2Ss27RuJourneySteps({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier: emptyWorkshop2DossierPhase1(),
    });
    const lines = summarizeWorkshop2RuContourStatusLines({
      readyForInvestorDemo: true,
      journeySteps: steps,
      gateBlockerCount: 2,
    });
    expect(lines.investorLineRu).toMatch(/инвестор/i);
    expect(lines.journeyLineRu).toMatch(/SS27/);
    expect(lines.blockersLineRu).toMatch(/2/);
  });
});

describe('workshop2 wave18 — WMS movement kind labels RU', () => {
  it('maps reserve/release/grn to Russian', () => {
    expect(labelWorkshop2WmsMovementKindRu('reserve')).toBe(
      WORKSHOP2_WMS_MOVEMENT_KIND_LABELS_RU.reserve
    );
    expect(labelWorkshop2WmsMovementKindRu('release')).toMatch(/Снятие/);
    expect(labelWorkshop2WmsMovementKindRu('receipt')).toMatch(/GRN/);
  });
});

describe('workshop2 wave19 — demo-ss27-01 UAT seed', () => {
  it('increases auto_pass count vs empty dossier', () => {
    const leaf = findHandbookLeafById('catalog-apparel-g0-l0');
    const demo = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'test');
    const empty = emptyWorkshop2DossierPhase1();
    const demoResp = buildWorkshop2Ss27UatChecklistResponse({
      dossiers: [demo],
      env: { WORKSHOP2_MARKET: 'ru' },
    });
    const emptyResp = buildWorkshop2Ss27UatChecklistResponse({
      dossiers: [empty],
      env: { WORKSHOP2_MARKET: 'ru' },
    });
    expect(demoResp.autoPassed).toBeGreaterThan(emptyResp.autoPassed);
    expect(demoResp.autoPassed).toBeGreaterThanOrEqual(8);
    expect(demo.hubCollectionRollupMirror?.sampleOrderCount).toBeGreaterThan(0);
    expect(demo.taMilestones?.length).toBeGreaterThan(0);
  });

  it('auto-passes steps 4, 9, 12, 13 on demo dossier', () => {
    const leaf = findHandbookLeafById('catalog-apparel-g0-l0');
    const demo = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'test');
    const items = autoCheckWorkshop2Ss27UatItems({
      items: [
        {
          id: 's4',
          step: 4,
          titleRu: 'Chrome',
          passCriteriaRu: '',
          status: 'manual',
          autoChecked: false,
        },
        {
          id: 's9',
          step: 9,
          titleRu: 'Sample',
          passCriteriaRu: '',
          status: 'manual',
          autoChecked: false,
        },
        {
          id: 's12',
          step: 12,
          titleRu: 'GTIN',
          passCriteriaRu: '',
          status: 'manual',
          autoChecked: false,
        },
        {
          id: 's13',
          step: 13,
          titleRu: 'EDO',
          passCriteriaRu: '',
          status: 'manual',
          autoChecked: false,
        },
      ],
      dossiers: [demo],
      env: { WORKSHOP2_MARKET: 'ru' },
    });
    expect(items.find((i) => i.step === 4)?.status).toBe('auto_pass');
    expect(items.find((i) => i.step === 9)?.status).toBe('auto_pass');
    expect(items.find((i) => i.step === 12)?.status).toBe('auto_pass');
    expect(items.find((i) => i.step === 13)?.status).toBe('auto_pass');
  });
});

describe('workshop2 wave19 — linkedPaths quick actions', () => {
  it('exposes ruCompliancePack, calendar, floor', () => {
    const paths = buildWorkshop2DossierLinkedPaths({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier: emptyWorkshop2DossierPhase1(),
    });
    expect(paths.ruCompliancePack).toMatch(/compliance-pack\.zip/);
    expect(paths.calendar).toMatch(/calendar/);
    expect(paths.floor).toMatch(/production/);
  });
});

describe('workshop2 wave19 — wave19RuStabilization probe', () => {
  it('reports 8/8 wave19 API wrappers', () => {
    const probe = buildWorkshop2Wave19RuStabilizationProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.wave19Total).toBe(8);
    expect(probe.wave19Wrapped).toBeGreaterThanOrEqual(8);
    expect(probe.checks.every((c) => c.ok)).toBe(true);
  });

  it('.env.ru.example exists at repo root', () => {
    const p = path.join(process.cwd(), '.env.ru.example');
    expect(fs.existsSync(p)).toBe(true);
    const raw = fs.readFileSync(p, 'utf8');
    expect(raw).toMatch(/WORKSHOP2_MARKET=ru/);
  });
});

describe('workshop2 wave18 — setup connectivity uses wave18RuApiCoverage', () => {
  it('buildWorkshop2SetupConnectivityRows shows cumulative API count', async () => {
    const built = await buildWorkshop2SetupConnectivityRows({
      probes: {
        ok: true,
        market: 'ru',
        wave18RuApiCoverage: {
          cumulativeWrapped: 26,
          cumulativeTotal: 26,
          checks: [{ id: 'api_error_ru_cumulative_coverage', ok: true }],
        },
      },
      readiness: { readyForInvestorDemo: true },
      uat: { autoPassed: 12, manualRemaining: 0, items: new Array(12).fill({}) },
    });
    expect(built.rows[0]?.detailRu).toMatch(/26\/26/);
  });
});
