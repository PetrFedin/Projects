/**
 * Sprint residuals §4.14–4.20 — activity truncate, hub dedup, PanelChrome adoption, §4.15–4.19.
 */
import fs from 'fs';
import path from 'path';
import { formatWorkshop2HubActivityDetailRu } from '@/lib/production/workshop2-hub-activity-status';
import { summarizeWorkshop2HubPgOnlyBanner } from '@/lib/production/workshop2-hub-pg-only-policy';
import {
  formatWorkshop2BomNodesReadinessChip,
  summarizeWorkshop2BomNodesStatus,
} from '@/lib/production/workshop2-bom-nodes-status';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  isWorkshop2ShowHeuristicRiskEnabled,
  isWorkshop2ShowVendorBiddingEnabled,
} from '@/lib/production/workshop2-show-heuristic-risk';
import { shouldRenderWorkshop2DataModeBadgeInPanel } from '@/lib/production/workshop2-no-demo-deadends';
import { W2_DOSSIER_PERSIST_LABEL } from '@/components/brand/production/Workshop2DossierPersistButton';

const ROOT = path.join(process.cwd(), 'src/components/brand/production');

function readPanelSource(name: string): string {
  return fs.readFileSync(path.join(ROOT, name), 'utf8');
}

describe('workshop2 wave-c2 — ux residuals', () => {
  it('formatWorkshop2HubActivityDetailRu truncates long merged journal hint', () => {
    const long =
      'событие A · событие B · событие C · событие D · событие E · событие F · событие G';
    const { visible, extraCount } = formatWorkshop2HubActivityDetailRu(long);
    expect(extraCount).toBeGreaterThan(0);
    expect(visible).not.toBe(long);
  });

  it('hub PG-only banner skips offline duplicate (BackendStatusBanner owns entry)', () => {
    expect(summarizeWorkshop2HubPgOnlyBanner({ backendStatus: 'offline' })).toBeNull();
  });

  it('Logistics / Factory ERP / Movement panels use Workshop2OperationalPanelChrome', () => {
    for (const file of [
      'Workshop2LogisticsPanel.tsx',
      'Workshop2FactoryERPIntegrationPanel.tsx',
      'Workshop2SampleGoodsMovementPanel.tsx',
    ]) {
      const src = readPanelSource(file);
      expect(src).toMatch(/Workshop2OperationalPanelChrome/);
      expect(src).toMatch(/Workshop2OperationalPanelShell/);
    }
  });

  it('B2B panel uses collapsible CeilingIntegrationBlock instead of duplicate LiveIntegration banner', () => {
    const src = readPanelSource('Workshop2B2BIntegrationPanel.tsx');
    expect(src).toMatch(/Workshop2CeilingIntegrationBlock/);
    expect(src).not.toMatch(/Workshop2LiveIntegrationRequiredBanner/);
  });

  it('Logistics mirror uses unified DossierPersistButton label', () => {
    const src = readPanelSource('Workshop2LogisticsPanel.tsx');
    expect(src).toMatch(/Workshop2DossierPersistButton/);
    expect(src).not.toMatch(/Логистика → PG/);
  });

  describe('§4.15–4.19 UX residuals', () => {
    it('§4.15 BOM readiness chip keeps counters in tooltip only', () => {
      const status = summarizeWorkshop2BomNodesStatus({
        ...emptyWorkshop2DossierPhase1(),
        productionModel: {
          nodes: [{ id: 'n1', label: 'Корпус' }],
          materialLines: [
            {
              id: 'm1',
              nodeId: 'n1',
              materialName: 'Хлопок',
              composition: '100% cotton',
              yieldPerUnit: 1.2,
              unitCost: 10,
            },
          ],
          trimLines: [],
        },
      });
      const chip = formatWorkshop2BomNodesReadinessChip(status);
      expect(chip.readiness).not.toMatch(/Узлов:/);
      expect(chip.readinessTitle).toContain(`Узлов: ${status.nodeCount}`);
      expect(chip.readinessTitle).toContain(`мат.: ${status.materialLineCount}`);
    });

    it('§4.16 grading panel uses MetaChips blockers instead of duplicate amber banner', () => {
      const src = readPanelSource('Workshop2GradingMatrixPanel.tsx');
      expect(src).toMatch(/readinessTitle:/);
      expect(src).toMatch(/blockers:/);
      expect(src).not.toMatch(/Смена линейки размеров не применена/);
    });

    it('§4.17 PredictiveRisk gated by env flag in T&A section', () => {
      expect(isWorkshop2ShowHeuristicRiskEnabled({})).toBe(false);
      const src = fs.readFileSync(
        path.join(ROOT, 'workshop2-phase1-dossier-panel-section-body-time-and-action.tsx'),
        'utf8'
      );
      expect(src).toMatch(/isWorkshop2ShowHeuristicRiskEnabled/);
      expect(src).toMatch(/showHeuristicRisk \?/);
    });

    it('§4.18 VendorBidding hidden unless WORKSHOP2_SHOW_VENDOR_BIDDING', () => {
      expect(isWorkshop2ShowVendorBiddingEnabled({})).toBe(false);
      const src = readPanelSource('Workshop2VendorBiddingPanel.tsx');
      expect(src).toMatch(/isWorkshop2ShowVendorBiddingEnabled/);
    });

    it('§4.19 dataMode badge only in workspace header', () => {
      expect(shouldRenderWorkshop2DataModeBadgeInPanel()).toBe(false);
      const workspace = fs.readFileSync(path.join(ROOT, 'Workshop2ArticleWorkspace.tsx'), 'utf8');
      expect(workspace).toMatch(/Workshop2WorkspaceHeaderDataModeBadge/);
      const chrome = fs.readFileSync(
        path.join(ROOT, 'workshop2-operational-panel-chrome.tsx'),
        'utf8'
      );
      expect(chrome).toMatch(/shouldRenderWorkshop2DataModeBadgeInPanel/);
    });
  });

  const corePersistScopes = [
    'Workshop2ArticleWorkspace.tsx',
    'Workshop2ArticleOperationalTzRibbon.tsx',
    'workshop2-phase1-dossier-panel-section-body-construction.tsx',
    'workshop2-phase1-dossier-panel-construction-cad-block.tsx',
    'Workshop2ConstructionCadViewerPanel.tsx',
    'workshop2-phase1-dossier-panel-section-body-general-design-visual.tsx',
    'Workshop2OverviewKpiStrip.tsx',
    'Workshop2ArticleRelatedSectionsStrip.tsx',
    'Workshop2ArticleSamplePanel.tsx',
    'workshop2-contractor-matchmaker.tsx',
    'Workshop2SustainabilityPanel.tsx',
    'workshop2-change-requests-panel.tsx',
    'supplier-qc-scorecard.tsx',
    'Workshop2SmartRoutingPanel.tsx',
    'workshop2-handoff-status-banners.tsx',
  ];

  it.each(corePersistScopes)(
    '%s mirror buttons use DossierPersistButton without user-facing → PG label',
    (file) => {
      const src = readPanelSource(file);
      expect(src).toMatch(/Workshop2DossierPersistButton/);
      expect(src).not.toMatch(/>\s*\{[^}]*→ PG[^}]*\}/);
      expect(src).not.toMatch(/>\s*['"`][^'"`]*→ PG/);
    }
  );

  it('assignment handoff persist delegated to collapsible banner (no inline → PG)', () => {
    const assignment = readPanelSource(
      'workshop2-phase1-dossier-panel-section-body-assignment.tsx'
    );
    expect(assignment).toMatch(/Workshop2AssignmentHandoffStatusCollapsible/);
    expect(assignment).not.toMatch(/>\s*\{[^}]*→ PG[^}]*\}/);
    const handoff = readPanelSource('workshop2-handoff-status-banners.tsx');
    expect(handoff).toMatch(/Workshop2DossierPersistButton/);
  });

  it('unified persist label contract', () => {
    expect(W2_DOSSIER_PERSIST_LABEL).toBe('Сохранить в досье');
  });
});
