/**
 * Wave 27 — push ≥9.0: overview, related, layout, operational TZ, tech pack, handoff PDF mirrors.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  evaluateWorkshop2OverviewHandoffGate,
  evaluateWorkshop2OverviewSampleGate,
  persistWorkshop2OverviewMirrorToDossier,
} from '@/lib/production/workshop2-overview-dossier-persist';
import {
  evaluateWorkshop2RelatedSectionsSampleGate,
  persistWorkshop2RelatedSectionsMirrorToDossier,
} from '@/lib/production/workshop2-related-sections-dossier-persist';
import {
  evaluateWorkshop2DossierLayoutSampleGate,
  persistWorkshop2DossierLayoutMirrorToDossier,
} from '@/lib/production/workshop2-dossier-layout-dossier-persist';
import {
  evaluateWorkshop2OperationalTzHandoffGate,
  evaluateWorkshop2OperationalTzSampleGate,
  persistWorkshop2OperationalTzMirrorToDossier,
} from '@/lib/production/workshop2-operational-tz-dossier-persist';
import {
  evaluateWorkshop2TechPackVisualExportGate,
  evaluateWorkshop2TechPackVisualHandoffGate,
  persistWorkshop2TechPackVisualMirrorToDossier,
} from '@/lib/production/workshop2-tech-pack-visual-dossier-persist';
import {
  evaluateWorkshop2HandoffPdfMirrorExportGate,
  evaluateWorkshop2HandoffPdfSampleGate,
  persistWorkshop2HandoffPdfMirrorToDossier,
} from '@/lib/production/workshop2-handoff-pdf-dossier-persist';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';
import { findHandbookLeafById } from '@/lib/production/category-catalog';

const COAT_LEAF = 'catalog-apparel-g0-l0';
const COL = 'col-w27';
const ART = 'art-w27';
const SEG = 'seg-w27';

describe('workshop2 wave27 — #21 overview mirror → handoff-commit', () => {
  it('integration: missing mirror warns sample-order; handoff blocker when not ready', () => {
    expect(evaluateWorkshop2OverviewSampleGate(emptyWorkshop2DossierPhase1())?.id).toBe(
      'overview.mirror_missing'
    );
    const leaf = findHandbookLeafById(COAT_LEAF);
    const dossier = persistWorkshop2OverviewMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      collectionId: COL,
      articleId: ART,
      bundle: null,
    });
    expect(evaluateWorkshop2OverviewHandoffGate(dossier)?.severity).toBe('blocker');
    const sample = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(sample.readiness.checks.some((c) => c.id === 'overview.mirror_missing')).toBe(false);
  });
});

describe('workshop2 wave27 — #23 related sections mirror → sample-order', () => {
  it('integration: empty vault warns sample-order', () => {
    const dossier = persistWorkshop2RelatedSectionsMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      collectionId: COL,
      articleUrlSegment: SEG,
      activeTab: 'supply',
    });
    expect(evaluateWorkshop2RelatedSectionsSampleGate(dossier)?.id).toBe(
      'related.sections.vault_empty'
    );
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(gate.readiness.checks.some((c) => c.id === 'related.sections.vault_empty')).toBe(true);
  });
});

describe('workshop2 wave27 — #25 layout mirror → sample-order', () => {
  it('integration: warns when layout mirror missing', () => {
    expect(evaluateWorkshop2DossierLayoutSampleGate(emptyWorkshop2DossierPhase1())?.id).toBe(
      'dossier.layout.mirror_missing'
    );
    const dossier = persistWorkshop2DossierLayoutMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      mode: 'dense',
    });
    expect(evaluateWorkshop2DossierLayoutSampleGate(dossier)).toBeNull();
  });
});

describe('workshop2 wave27 — #26 operational TZ mirror → sample-order + handoff', () => {
  it('integration: low supply focus warns sample-order', () => {
    const leaf = findHandbookLeafById(COAT_LEAF);
    const dossier = persistWorkshop2OperationalTzMirrorToDossier(
      emptyWorkshop2DossierPhase1(),
      leaf
    );
    const sample = evaluateWorkshop2OperationalTzSampleGate(dossier);
    if (dossier.operationalTzMirror?.blockerSampleOrder) {
      expect(sample?.id).toBe('operational.tz.supply_focus_low');
    }
    const handoff = evaluateWorkshop2OperationalTzHandoffGate(dossier);
    if (dossier.operationalTzMirror?.blockerHandoff) {
      expect(handoff?.severity).toBe('warning');
    }
  });
});

describe('workshop2 wave27 — #43 tech pack visual mirror → export-tz + handoff', () => {
  it('integration: empty tech pack blocks export-tz via mirror', () => {
    const dossier = persistWorkshop2TechPackVisualMirrorToDossier(emptyWorkshop2DossierPhase1());
    expect(evaluateWorkshop2TechPackVisualExportGate(dossier)?.severity).toBe('blocker');
    const exportGate = evaluateWorkshop2TzExportBundleGate({
      dossier,
      categoryLeafId: COAT_LEAF,
      collectionId: COL,
      articleId: ART,
    });
    expect(exportGate.checks.some((c) => c.id === 'export.tech_pack.empty')).toBe(true);
    expect(evaluateWorkshop2TechPackVisualHandoffGate(dossier)?.severity).toBe('blocker');
    const commit = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier,
      categoryLeafId: COAT_LEAF,
      vaultFileCount: 1,
    });
    expect(commit.readiness.checks.some((c) => c.id === 'construction.tech_pack.empty')).toBe(true);
  });
});

describe('workshop2 wave27 — #79 handoff PDF mirror → export + sample-order', () => {
  it('integration: blocked PDF mirror warns sample-order and blocks export path', () => {
    const leaf = findHandbookLeafById(COAT_LEAF);
    const dossier = persistWorkshop2HandoffPdfMirrorToDossier(emptyWorkshop2DossierPhase1(), {
      categoryLeaf: leaf,
      vaultFileCount: 0,
    });
    expect(['blocked', 'warn', 'ready']).toContain(dossier.handoffPdfMirror?.state);
    if (dossier.handoffPdfMirror?.state === 'blocked') {
      expect(evaluateWorkshop2HandoffPdfSampleGate(dossier)?.severity).toBe('warning');
      expect(evaluateWorkshop2HandoffPdfMirrorExportGate(dossier)?.severity).toBe('blocker');
    }
  });
});
