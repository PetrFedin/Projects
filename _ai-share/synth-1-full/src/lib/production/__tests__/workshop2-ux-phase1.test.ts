/**
 * Phase 1A UX — snapshot href builders + chip/meta render helpers (gates unchanged).
 */
import { summarizeWorkshop2DocumentsIndexStatus } from '@/lib/production/workshop2-documents-index-status';
import { summarizeWorkshop2HubArticlesListStatus } from '@/lib/production/workshop2-hub-articles-list-status';
import { summarizeWorkshop2HubFilterStatus } from '@/lib/production/workshop2-hub-filter-status';
import { summarizeWorkshop2MainTabStripStatus } from '@/lib/production/workshop2-main-tab-strip-status';
import { summarizeWorkshop2SupplyBundleStatus } from '@/lib/production/workshop2-supply-bundle-status';
import { summarizeWorkshop2TaMilestonesStatus } from '@/lib/production/workshop2-ta-milestones-status';
import { summarizeWorkshop2TzExportBundleStatus } from '@/lib/production/workshop2-tz-export-bundle-status';
import { summarizeWorkshop2VaultPanelStatus } from '@/lib/production/workshop2-vault-panel-status';
import { summarizeWorkshop2WorkspaceHandoffChecklistStatus } from '@/lib/production/workshop2-workspace-handoff-checklist-status';
import { summarizeWorkshop2WorkspaceHeaderPulseStatus } from '@/lib/production/workshop2-workspace-header-pulse-status';
import { summarizeWorkshop2FitSessionsStatus } from '@/lib/production/workshop2-fit-sessions-status';
import { summarizeWorkshop2SampleOrderStatus } from '@/lib/production/workshop2-sample-order-status';
import { summarizeWorkshop2GoldSampleStatus } from '@/lib/production/workshop2-gold-sample-status';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { getWorkshop2ReadinessSnapshot } from '@/lib/production/workshop2-readiness-snapshot';
import {
  buildWorkshop2CreateArticleSubmitTooltip,
  buildWorkshop2FitPanelMeta,
  buildWorkshop2HubToolbarChips,
  buildWorkshop2SamplePanelMeta,
  buildWorkshop2SupplyPanelMeta,
  buildWorkshop2UxPhase1ArticleHrefs,
  buildWorkshop2VaultPanelChips,
  buildWorkshop2WorkspaceStatusChips,
  mapBannerToneToChipTone,
  serializeWorkshop2UxChipsForSnapshot,
  shouldWorkspaceStatusCollapseDefault,
} from '@/lib/production/workshop2-ux-phase1-helpers';

describe('workshop2 ux phase1 — href builders', () => {
  it('buildWorkshop2UxPhase1ArticleHrefs snapshot', () => {
    expect(buildWorkshop2UxPhase1ArticleHrefs('SS27', '000042')).toMatchInlineSnapshot(`
{
  "fitPane": "/brand/production/workshop2/c/SS27/a/000042?w2pane=fit",
  "fitSection": "/brand/production/workshop2/c/SS27/a/000042?w2pane=fit#w2article-section-fit",
  "hubList": "/brand/production/workshop2?w2col=SS27",
  "supplyPane": "/brand/production/workshop2/c/SS27/a/000042?w2pane=supply",
  "vaultUpload": "/brand/production/workshop2/c/SS27/a/000042",
}
`);
  });
});

describe('workshop2 ux phase1 — chip render helpers', () => {
  it('mapBannerToneToChipTone', () => {
    expect(mapBannerToneToChipTone('emerald')).toBe('emerald');
    expect(mapBannerToneToChipTone(undefined)).toBe('neutral');
  });

  it('shouldWorkspaceStatusCollapseDefault when all green', () => {
    const tabStrip = summarizeWorkshop2MainTabStripStatus({
      role: 'brand',
      visibleTabIds: ['tz', 'supply', 'fit', 'plan', 'release', 'qc', 'stock', 'vault'],
    });
    const snapshot = getWorkshop2ReadinessSnapshot({
      dossier: emptyWorkshop2DossierPhase1(),
      categoryLeafId: 'catalog-apparel-g0-l0',
    });
    const pulse = summarizeWorkshop2WorkspaceHeaderPulseStatus(snapshot);
    const handoff = summarizeWorkshop2WorkspaceHandoffChecklistStatus({
      dossier: emptyWorkshop2DossierPhase1(),
      vaultFileCount: 2,
    });
    expect(shouldWorkspaceStatusCollapseDefault({ tabStrip, pulse, handoff })).toBe(
      handoff.state === 'ready' && pulse.state === 'ready'
    );
  });

  it('buildWorkshop2WorkspaceStatusChips snapshot', () => {
    const tabStrip = summarizeWorkshop2MainTabStripStatus({
      role: 'designer',
      visibleTabIds: ['tz', 'fit'],
    });
    const pulse = summarizeWorkshop2WorkspaceHeaderPulseStatus(null);
    const chips = buildWorkshop2WorkspaceStatusChips({ tabStrip, pulse, handoff: null });
    expect(serializeWorkshop2UxChipsForSnapshot(chips)).toMatchSnapshot();
  });

  it('buildWorkshop2VaultPanelChips snapshot', () => {
    const vault = summarizeWorkshop2VaultPanelStatus({
      backendMode: 'server',
      vaultDocuments: [],
      s3Configured: true,
    });
    const index = summarizeWorkshop2DocumentsIndexStatus({
      collectionId: 'SS27',
      articleUrlSegment: '000042',
      vaultDocuments: [],
    });
    const tzBundle = summarizeWorkshop2TzExportBundleStatus({
      dossier: emptyWorkshop2DossierPhase1(),
      vaultDocuments: [],
    });
    expect(
      serializeWorkshop2UxChipsForSnapshot(
        buildWorkshop2VaultPanelChips({ vault, index, tzBundle })
      )
    ).toMatchSnapshot();
  });

  it('buildWorkshop2HubToolbarChips snapshot', () => {
    const list = summarizeWorkshop2HubArticlesListStatus({
      visibleArticleCount: 12,
      withoutDossierCount: 1,
      lowTzPctCount: 2,
    });
    const filter = summarizeWorkshop2HubFilterStatus({
      totalCount: 20,
      visibleCount: 8,
      advanced: { minTzPct: 70, goldApprovedOnly: false },
    });
    expect(
      serializeWorkshop2UxChipsForSnapshot(buildWorkshop2HubToolbarChips({ list, filter }))
    ).toMatchSnapshot();
  });

  it('buildWorkshop2SupplyPanelMeta snapshot', () => {
    const supply = summarizeWorkshop2SupplyBundleStatus({
      dossier: emptyWorkshop2DossierPhase1(),
      supply: { lines: [], updatedAt: undefined },
    });
    const ta = summarizeWorkshop2TaMilestonesStatus({
      dossier: emptyWorkshop2DossierPhase1(),
      surface: 'supply',
    });
    expect(
      buildWorkshop2SupplyPanelMeta({
        supply,
        ta,
        labDip: null,
        blockers: ['BOM пуст'],
      })
    ).toMatchSnapshot();
  });

  it('buildWorkshop2FitPanelMeta snapshot', () => {
    const fitSessions = summarizeWorkshop2FitSessionsStatus({ sessions: [] });
    expect(
      buildWorkshop2FitPanelMeta({
        fitSessions,
        fit3dHintRu: 'CAD не привязан',
        fit3dIntegrationRu: 'Fit3D: настройте URL',
      })
    ).toMatchSnapshot();
  });

  it('buildWorkshop2SamplePanelMeta snapshot', () => {
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier: emptyWorkshop2DossierPhase1(),
      vaultFileCount: 0,
      minTzOverallPct: 0,
    });
    const order = summarizeWorkshop2SampleOrderStatus({
      handoffInput: {
        dossier: emptyWorkshop2DossierPhase1(),
        vaultFileCount: 0,
        minTzOverallPct: 0,
      },
      activeOrderCount: 0,
      pgBacked: true,
      gateFromApi: gate,
    });
    const gold = summarizeWorkshop2GoldSampleStatus({
      gold: { status: 'pending' },
      hasActiveSampleOrder: false,
    });
    expect(buildWorkshop2SamplePanelMeta({ order, gold })).toMatchSnapshot();
  });

  it('buildWorkshop2CreateArticleSubmitTooltip', () => {
    expect(
      buildWorkshop2CreateArticleSubmitTooltip({
        canSubmit: false,
        formHintRu: 'Укажите название',
        assemblyHintRu: 'Выберите категорию',
      })
    ).toBe('Укажите название · Выберите категорию');
    expect(
      buildWorkshop2CreateArticleSubmitTooltip({
        canSubmit: true,
        attachError: 'Файл слишком большой',
      })
    ).toBe('Файл слишком большой');
  });
});
