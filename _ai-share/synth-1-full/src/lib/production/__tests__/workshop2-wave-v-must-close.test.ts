/** @jest-environment node */

/**
 * Wave V — URL consistency, TZ dossier PG chips, workspace tab state, DFM fail-closed,
 * integration health hub chip, predictive risk / vendor bidding hidden by default.
 */

import fs from 'fs';
import path from 'path';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2HubArticleDeepLink,
  buildWorkshop2LegacyArticleRedirectPath,
  buildWorkshop2Ss27DemoArticleLinks,
  parseWorkshop2LegacyArticlePath,
  WORKSHOP2_SS27_DEMO_ARTICLE_IDS,
} from '@/lib/production/workshop2-legacy-article-url';
import { workshop2ArticlePath } from '@/lib/production/workshop2-url';
import { parseWorkshop2DossierSection } from '@/components/brand/production/workshop2-article-workspace-ui-constants';
import { summarizeWorkshop2HubIntegrationHealthChip } from '@/lib/production/workshop2-hub-integration-health';
import {
  summarizeWorkshop2SupplierQcPgMirror,
  summarizeWorkshop2TzAssignmentPgMirror,
  summarizeWorkshop2TzConstructionPgMirror,
  summarizeWorkshop2TzGeneralPgMirror,
  summarizeWorkshop2TzTimeAndActionPgMirror,
} from '@/lib/production/workshop2-operational-pg-mirror-status';
import {
  isWorkshop2ShowHeuristicRiskEnabled,
  isWorkshop2ShowVendorBiddingEnabled,
} from '@/lib/production/workshop2-show-heuristic-risk';
import { isWorkshop2AiConfigured } from '@/lib/server/workshop2-genkit-health';

const ROOT = path.join(process.cwd(), 'src/components/brand/production');
const MIDDLEWARE = path.join(process.cwd(), 'src/middleware.ts');
const DFM_ROUTE = path.join(process.cwd(), 'src/app/api/brand/workshop2/ai/dfm-check/route.ts');

const WAVE_V_TZ_SECTION_FILES = [
  'workshop2-phase1-dossier-panel-section-body-general.tsx',
  'workshop2-phase1-dossier-panel-section-body-assignment.tsx',
  'Workshop2ConstructionCadViewerPanel.tsx',
  'Workshop2TimeAndActionPanel.tsx',
];

const WAVE_V_TZ_PG_TESTIDS: Record<string, RegExp> = {
  'workshop2-phase1-dossier-panel-section-body-general.tsx': /workshop2-tz-general-pg-chip/,
  'workshop2-phase1-dossier-panel-section-body-assignment.tsx': /workshop2-tz-assignment-pg-chip/,
  'Workshop2ConstructionCadViewerPanel.tsx': /workshop2-tz-construction-pg-chip/,
  'Workshop2TimeAndActionPanel.tsx': /workshop2-ta-milestones-pg-chip/,
};

describe('workshop2 wave-v must-close', () => {
  it('legacy article paths redirect to /c/{collection}/a/{articleId}', () => {
    const legacy = '/brand/production/workshop2/SS27/demo-ss27-01';
    const match = parseWorkshop2LegacyArticlePath(legacy);
    expect(match).toEqual({ collectionId: 'SS27', articleId: 'demo-ss27-01' });
    expect(buildWorkshop2LegacyArticleRedirectPath(match!, '?w2pane=tz')).toBe(
      `${workshop2ArticlePath('SS27', 'demo-ss27-01')}?w2pane=tz`
    );
    expect(
      parseWorkshop2LegacyArticlePath(workshop2ArticlePath('SS27', 'demo-ss27-01'))
    ).toBeNull();
    expect(parseWorkshop2LegacyArticlePath('/brand/production/workshop2/c/SS27/a/x')).toBeNull();
    expect(
      parseWorkshop2LegacyArticlePath('/brand/production/workshop2/references/foo')
    ).toBeNull();

    const mw = fs.readFileSync(MIDDLEWARE, 'utf8');
    expect(mw).toMatch(/parseWorkshop2LegacyArticlePath/);
    expect(mw).toMatch(/buildWorkshop2LegacyArticleRedirectPath/);
  });

  it('hub demo links use canonical /c/SS27/a/demo-ss27-0X', () => {
    const links = buildWorkshop2Ss27DemoArticleLinks({ w2pane: 'tz', w2sec: 'general' });
    expect(links).toHaveLength(WORKSHOP2_SS27_DEMO_ARTICLE_IDS.length);
    for (const { articleId, href } of links) {
      expect(href).toContain(`/c/SS27/a/${articleId}`);
      expect(href).not.toMatch(/\/workshop2\/SS27\//);
      expect(href).toMatch(/w2pane=tz/);
    }
    expect(buildWorkshop2HubArticleDeepLink('SS27', 'demo-ss27-04')).toBe(
      workshop2ArticlePath('SS27', 'demo-ss27-04')
    );
  });

  it('w2sec=assignment deep link parses to assignment dossier section', () => {
    expect(parseWorkshop2DossierSection('assignment')).toBe('assignment');
    expect(parseWorkshop2DossierSection('time-and-action')).toBeNull();
    expect(parseWorkshop2DossierSection('visuals')).toBe('visuals');

    const ws = fs.readFileSync(path.join(ROOT, 'Workshop2ArticleWorkspace.tsx'), 'utf8');
    expect(ws).toMatch(/parseWorkshop2DossierSection\(w2secParam\)/);
    expect(ws).not.toMatch(/useState\(.*mainTab/);
    expect(ws).toMatch(/syncMainTabToUrl/);
  });

  it('TZ dossier sections wire PG mirror chips + persist toast helpers', () => {
    for (const file of WAVE_V_TZ_SECTION_FILES) {
      const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
      expect(src).toMatch(/Workshop2OperationalPgMirrorChip/);
      expect(src).toMatch(WAVE_V_TZ_PG_TESTIDS[file]!);
    }
    const general = fs.readFileSync(
      path.join(ROOT, 'workshop2-phase1-dossier-panel-section-body-general.tsx'),
      'utf8'
    );
    expect(general).toMatch(/formatWorkshop2PersistToastTitle/);
    const assignment = fs.readFileSync(
      path.join(ROOT, 'workshop2-phase1-dossier-panel-section-body-assignment.tsx'),
      'utf8'
    );
    expect(assignment).toMatch(/Workshop2AssignmentHandoffStatusCollapsible/);
  });

  it('TZ PG mirror summarizers fail-closed without mirror', () => {
    const empty = emptyWorkshop2DossierPhase1();
    expect(summarizeWorkshop2TzGeneralPgMirror(empty).tone).toBe('slate');
    expect(summarizeWorkshop2TzAssignmentPgMirror(empty).tone).toBe('slate');
    expect(summarizeWorkshop2TzConstructionPgMirror(empty).tone).toBe('slate');
    expect(summarizeWorkshop2TzTimeAndActionPgMirror(empty).tone).toBe('slate');
    expect(summarizeWorkshop2SupplierQcPgMirror(empty).tone).toBe('slate');
  });

  it('supplier QC scorecard wires PG chip + honest persist toast', () => {
    const src = fs.readFileSync(path.join(ROOT, 'supplier-qc-scorecard.tsx'), 'utf8');
    expect(src).toMatch(/workshop2-supplier-qc-pg-chip/);
    expect(src).toMatch(/formatWorkshop2PersistToastTitle/);
    expect(src).toMatch(/summarizeWorkshop2SupplierQcPgMirror/);
  });

  it('DFM check fail-closed without Genkit env (no silent pass)', () => {
    const route = fs.readFileSync(DFM_ROUTE, 'utf8');
    expect(route).toMatch(/isWorkshop2AiConfigured\(\)/);
    expect(route).toMatch(/503/);
    expect(route).not.toMatch(/NODE_ENV === 'production'/);

    const panel = fs.readFileSync(path.join(ROOT, 'workshop2-dfm-check-panel.tsx'), 'utf8');
    expect(panel).toMatch(/setResult\(null\)/);
    expect(panel).toMatch(/canWorkshop2UseAiDemoFallback/);
    expect(panel).toMatch(/isWorkshop2AiConfigured/);

    if (!isWorkshop2AiConfigured()) {
      expect(String(process.env.WORKSHOP2_DEMO_MODE ?? '')).not.toMatch(/^(1|true)$/i);
      expect(String(process.env.NEXT_PUBLIC_WORKSHOP2_DEMO_MODE ?? '')).not.toMatch(/^(1|true)$/i);
    }
  });

  it('predictive risk and vendor bidding hidden by default in prod paths', () => {
    expect(isWorkshop2ShowHeuristicRiskEnabled({})).toBe(false);
    expect(isWorkshop2ShowVendorBiddingEnabled({})).toBe(false);

    const taSection = fs.readFileSync(
      path.join(ROOT, 'workshop2-phase1-dossier-panel-section-body-time-and-action.tsx'),
      'utf8'
    );
    expect(taSection).toMatch(/isWorkshop2ShowHeuristicRiskEnabled/);

    const vendor = fs.readFileSync(path.join(ROOT, 'Workshop2VendorBiddingPanel.tsx'), 'utf8');
    expect(vendor).toMatch(/isWorkshop2ShowVendorBiddingEnabled/);
    expect(vendor).toMatch(/return null/);
  });

  it('hub toolbar shows readyForInvestorDemo from integration probes honestly', () => {
    const hub = fs.readFileSync(path.join(ROOT, 'Workshop2ArticleFlatHub.tsx'), 'utf8');
    expect(hub).toMatch(/fetchWorkshop2LiveIntegrationProbes/);
    expect(hub).toMatch(/summarizeWorkshop2HubIntegrationHealthChip/);

    expect(
      summarizeWorkshop2HubIntegrationHealthChip({
        readyForInvestorDemo: true,
        stagingContractMode: false,
        probeFlags: {},
      })?.label
    ).toMatch(/ready/i);

    expect(
      summarizeWorkshop2HubIntegrationHealthChip({
        readyForInvestorDemo: false,
        stagingContractMode: false,
        probeFlags: {},
      })?.tone
    ).toBe('amber');

    expect(summarizeWorkshop2HubIntegrationHealthChip(null)?.label).toMatch(/offline/i);
  });
});
