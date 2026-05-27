/** @jest-environment node */

/**
 * Wave U — panel mirror honesty, PG chips, gate checks, hub onboarding create flow.
 */

import fs from 'fs';
import path from 'path';
import { buildWorkshop2FileStoreDemoDossier } from '@/lib/production/workshop2-file-store-demo-bootstrap';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  summarizeWorkshop2AqlPgMirror,
  summarizeWorkshop2BomNodesPgMirror,
  summarizeWorkshop2ChangeRequestPgMirror,
  summarizeWorkshop2GradingApplyPgMirror,
  summarizeWorkshop2MatchmakerPgMirror,
  summarizeWorkshop2StockWmsPgMirror,
} from '@/lib/production/workshop2-operational-pg-mirror-status';
import {
  collectWorkshop2AqlSignoffGateChecks,
  summarizeWorkshop2AqlPanelDisplayFromMirror,
} from '@/lib/production/workshop2-aql-inspection-status';
import { summarizeWorkshop2GradingPanelDisplayFromMirror } from '@/lib/production/workshop2-grading-status';
import {
  collectWorkshop2BomExportGateChecks,
  summarizeWorkshop2BomNodesStatus,
  summarizeWorkshop2BomPanelDisplayFromMirror,
} from '@/lib/production/workshop2-bom-nodes-status';
import { persistWorkshop2QcAqlRecordToDossier } from '@/lib/production/workshop2-qc-aql-dossier-persist';
import { summarizeWorkshop2MatchmakerSyncUi } from '@/lib/production/workshop2-no-demo-deadends';
import {
  runWorkshop2HubOnboardingCreateFlow,
  WORKSHOP2_HUB_ONBOARDING_DEMO_ARTICLE_ID,
} from '@/lib/production/workshop2-hub-onboarding-create-flow';
import { summarizeWorkshop2ReferencesStatus } from '@/lib/production/workshop2-references-status-summary';

const ROOT = path.join(process.cwd(), 'src/components/brand/production');
const W2_COMPONENTS = path.join(process.cwd(), 'src/components/brand/production');

const WAVE_U_PANEL_FILES = [
  'Workshop2AQLInspectionPanel.tsx',
  'Workshop2GradingMatrixPanel.tsx',
  'Workshop2ProductionBomByNodesPanel.tsx',
  'workshop2-change-requests-panel.tsx',
  'workshop2-contractor-matchmaker.tsx',
  'workshop2-article-workspace-stock-panel.tsx',
];

describe('workshop2 wave-u must-close', () => {
  it('operational panels wire PG mirror chips', () => {
    const expectations: Record<string, RegExp> = {
      'Workshop2AQLInspectionPanel.tsx': /workshop2-aql-pg-chip/,
      'Workshop2GradingMatrixPanel.tsx': /workshop2-grading-pg-chip/,
      'Workshop2ProductionBomByNodesPanel.tsx': /workshop2-bom-pg-chip/,
      'workshop2-change-requests-panel.tsx': /workshop2-cr-pg-chip/,
      'workshop2-contractor-matchmaker.tsx': /workshop2-matchmaker-pg-chip/,
      'workshop2-article-workspace-stock-panel.tsx': /workshop2-stock-wms-pg-chip/,
    };
    for (const file of WAVE_U_PANEL_FILES) {
      const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
      expect(src).toMatch(/Workshop2OperationalPgMirrorChip/);
      expect(src).toMatch(expectations[file]!);
    }
  });

  it('AQL panel wires sign-off gate checks block', () => {
    const src = fs.readFileSync(path.join(ROOT, 'Workshop2AQLInspectionPanel.tsx'), 'utf8');
    expect(src).toMatch(/workshop2-aql-signoff-gate-checks/);
    expect(src).toMatch(/collectWorkshop2AqlSignoffGateChecks/);
  });

  it('BOM panel wires export gate checks + removes fake availability', () => {
    const src = fs.readFileSync(path.join(ROOT, 'Workshop2ProductionBomByNodesPanel.tsx'), 'utf8');
    expect(src).toMatch(/workshop2-bom-export-gate-checks/);
    expect(src).toMatch(/collectWorkshop2BomExportGateChecks/);
    expect(src).not.toMatch(/В наличии/);
    expect(src).not.toMatch(/Под заказ/);
  });

  it('AQL mirror status overrides live when dossier mirror present', () => {
    let dossier = emptyWorkshop2DossierPhase1();
    dossier = persistWorkshop2QcAqlRecordToDossier(dossier, {
      orderQty: 500,
      qtySource: 'sample_order',
      aqlLevel: '2.5',
      sampleSize: 50,
      criticalFound: 0,
      majorFound: 0,
      minorFound: 0,
      majorRejectLimit: 5,
      minorRejectLimit: 7,
      isFail: false,
    });
    const display = summarizeWorkshop2AqlPanelDisplayFromMirror({
      dossier,
      live: {
        batchCount: 0,
        orderQty: 1000,
        qtySource: 'fallback',
        sampleSize: 80,
        isFail: true,
        state: 'fail',
      },
    });
    expect(display.state).toBe('ready');
    expect(display.orderQty).toBe(500);
    expect(summarizeWorkshop2AqlPgMirror(dossier).tone).toBe('emerald');
  });

  it('grading panel display uses mirror blockers not demo sizes only', () => {
    const dossier = {
      ...buildWorkshop2FileStoreDemoDossier({
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
      })!,
      gradingApplyMirror: {
        mirroredAt: '2026-05-23T00:00:00.000Z',
        ruleCount: 0,
        sizeCount: 6,
        hasApplyLog: false,
        state: 'partial',
        blockerExport: true,
        hintRu: 'Шкала задана, apply log отсутствует.',
      },
    };
    const display = summarizeWorkshop2GradingPanelDisplayFromMirror({
      dossier,
      live: {
        ruleCount: 0,
        sizeCount: 6,
        frozenRuleCount: 0,
        hasSampleScale: true,
        measurementPointCount: 4,
        state: 'empty',
      },
    });
    expect(display.mirrorBlockers.length).toBeGreaterThan(0);
    expect(summarizeWorkshop2GradingApplyPgMirror(dossier).tone).toBe('amber');
  });

  it('BOM readiness from mirror counts + export gate checks', () => {
    const dossier = buildWorkshop2FileStoreDemoDossier({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
    })!;
    const live = summarizeWorkshop2BomPanelDisplayFromMirror({
      dossier: { ...dossier, bomNodesMirror: undefined },
      live: summarizeWorkshop2BomNodesStatus(dossier),
    });
    expect(live.state).toBe('partial');
    const checks = collectWorkshop2BomExportGateChecks(dossier);
    expect(checks.some((c) => c.id === 'bom.nodes.mirror_missing')).toBe(true);
    expect(summarizeWorkshop2BomNodesPgMirror(dossier).tone).toBe('slate');
  });

  it('change request mirror chip fail-closed without mirror', () => {
    const chip = summarizeWorkshop2ChangeRequestPgMirror(emptyWorkshop2DossierPhase1());
    expect(chip.label).toMatch(/не в PG/i);
  });

  it('matchmaker sync only emerald when mirror exists', () => {
    const withoutMirror = summarizeWorkshop2MatchmakerSyncUi({
      hasMatchmakerResult: true,
      hasMatchmakerMirror: false,
      lastRunAt: '2026-05-23T00:00:00.000Z',
    });
    expect(withoutMirror.mirrorInPg).toBe(false);
    expect(withoutMirror.tone).toBe('amber');

    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      matchmakerResult: { syncedAt: '2026-05-23T00:00:00.000Z', raw: {} },
      matchmakerMirror: {
        mirroredAt: '2026-05-23T00:00:00.000Z',
        recommendedContractorId: 'partner-1',
      },
    };
    expect(summarizeWorkshop2MatchmakerPgMirror(dossier).tone).toBe('emerald');
  });

  it('stock WMS reserve chip fail-closed when API blocked', () => {
    const chip = summarizeWorkshop2StockWmsPgMirror({
      dossier: emptyWorkshop2DossierPhase1(),
      wmsFailClosed: true,
    });
    expect(chip.label).toMatch(/fail-closed/i);
  });

  it('hub onboarding create flow produces demo-ss27-04 on file-store', () => {
    const flow = runWorkshop2HubOnboardingCreateFlow({
      inventory: {
        v: 1,
        articlesByCollection: { SS27: [] },
        userCollections: [],
        archivedUserCollections: [],
        collectionCovers: {},
        archivedSystemCollectionIds: [],
      },
      collectionId: 'SS27',
      role: 'technologist',
      createdBy: 'wave-u',
    });
    expect(flow.ok).toBe(true);
    expect(flow.onboardingDone).toBe(true);
    expect(
      flow.inventory?.articlesByCollection.SS27?.some(
        (l) => l.id === WORKSHOP2_HUB_ONBOARDING_DEMO_ARTICLE_ID
      )
    ).toBe(true);
  });

  it('references static summary loads when PG disabled', () => {
    const summary = summarizeWorkshop2ReferencesStatus({
      postgres: 'disabled',
      directories: {
        colors: 'static',
        tnved: 'static',
        materials: 'static',
        pomTemplates: 'static',
      },
    });
    expect(summary.pgReady).toBe(false);
    expect(summary.blockerRu).toMatch(/WORKSHOP2_DATABASE_URL/);
  });

  it('workshop2 components avoid console.error (Wave U hygiene)', () => {
    const files = fs
      .readdirSync(W2_COMPONENTS)
      .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))
      .map((f) => path.join(W2_COMPONENTS, f));
    for (const file of files) {
      const src = fs.readFileSync(file, 'utf8');
      if (src.includes('// AI scan optional')) continue;
      expect(src).not.toMatch(/console\.error\s*\(/);
    }
  });

  it('AQL sign-off blocked on live fail', () => {
    const checks = collectWorkshop2AqlSignoffGateChecks({
      dossier: emptyWorkshop2DossierPhase1(),
      isFail: true,
    });
    expect(checks.some((c) => c.id === 'qc.aql.live_fail')).toBe(true);
  });
});
