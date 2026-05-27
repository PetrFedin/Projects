/**
 * Wave 15: functional depth — CR gate, handoff commit, BOM sync, POM audit, export ZIP gate.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import { syncWorkshop2BomMaterialLinesFromMatAssignments } from '@/lib/production/workshop2-bom-sync-from-mat';
import { appendWorkshop2PomTemplateApplyWithAudit } from '@/lib/production/workshop2-pom-template-apply-audit';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';
import { getWorkshop2PomTemplatesForLeaf } from '@/lib/production/workshop2-reference-seeds';

const COAT_LEAF = 'catalog-apparel-g0-l0';

describe('workshop2 wave15 — #28 CR blocks sample order', () => {
  it('blocks when pending change request exists', () => {
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        changeRequests: [
          {
            id: 'cr-pending-1',
            description: 'Изменить длину рукава',
            status: 'pending',
            requestedAt: new Date().toISOString(),
          },
        ],
      },
      vaultFileCount: 2,
    });
    expect(gate.allowed).toBe(false);
    expect(gate.readiness.checks.some((c) => c.id === 'change_requests.pending')).toBe(true);
  });
});

describe('workshop2 wave15 — #45 handoff commit gate', () => {
  it('blocks without tech pack attachments', () => {
    const gate = evaluateWorkshop2FactoryHandoffCommitGate({
      dossier: emptyWorkshop2DossierPhase1(),
      categoryLeafId: COAT_LEAF,
      vaultFileCount: 2,
    });
    expect(gate.allowed).toBe(false);
    expect(gate.readiness.checks.some((c) => c.id === 'construction.tech_pack.empty')).toBe(true);
  });
});

describe('workshop2 wave15 — #36 BOM sync from mat', () => {
  it('adds material lines from mat assignment', () => {
    let dossier = emptyWorkshop2DossierPhase1();
    dossier = {
      ...dossier,
      assignments: [
        {
          assignmentId: 'a-mat',
          kind: 'canonical',
          attributeId: 'mat',
          values: [
            {
              valueId: 'v1',
              valueSource: 'free_text',
              text: 'Шерсть 80%',
              displayLabel: 'Шерсть 80%',
            },
          ],
        },
      ],
    };
    const synced = syncWorkshop2BomMaterialLinesFromMatAssignments(dossier);
    expect(synced.addedCount).toBeGreaterThan(0);
    expect(synced.dossier.bomMatSyncAt).toBeTruthy();
    expect(synced.dossier.productionModel?.materialLines?.[0]?.materialName).toContain('Шерсть');
  });
});

describe('workshop2 wave15 — #38 POM apply audit', () => {
  it('writes pomTemplateApplyLog on merge', () => {
    const tpl = getWorkshop2PomTemplatesForLeaf(COAT_LEAF)[0];
    expect(tpl).toBeDefined();
    const applied = appendWorkshop2PomTemplateApplyWithAudit({
      dossier: emptyWorkshop2DossierPhase1(),
      categoryLeafId: COAT_LEAF,
      template: tpl!,
      mode: 'merge',
    });
    expect(applied).not.toBeNull();
    expect(applied!.dossier.pomTemplateApplyLog?.[0]?.categoryLeafId).toBe(COAT_LEAF);
    expect(applied!.record.addedMeasurementCount).toBeGreaterThan(0);
  });
});

describe('workshop2 wave15 — #41/#43 export TZ bundle gate', () => {
  it('blocks empty sketch and tech pack', () => {
    const gate = evaluateWorkshop2TzExportBundleGate({
      dossier: emptyWorkshop2DossierPhase1(),
      categoryLeafId: COAT_LEAF,
    });
    expect(gate.allowed).toBe(false);
    expect(gate.checks.some((c) => c.id === 'export.sketch.empty')).toBe(true);
    expect(gate.checks.some((c) => c.id === 'export.tech_pack.empty')).toBe(true);
  });

  it('clears sketch blockers when sketch coverage is ready', () => {
    const ann = {
      id: 'ann-1',
      x: 10,
      y: 10,
      text: 'узел',
      categoryLeafId: COAT_LEAF,
      linkedAttributeId: 'body',
      linkedBomLineRef: 'LREF-1',
    };
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      categorySketchImageDataUrl: 'data:image/png;base64,abc',
      categorySketchAnnotations: [ann],
      categorySketchRevisionSnapshots: [
        {
          snapshotId: 'snap-1',
          at: new Date().toISOString(),
          by: 'test',
          revisionLabel: 'A',
          leafId: COAT_LEAF,
          annotations: [ann],
        },
      ],
      bomLineCostingHints: [{ lineRef: 'LREF-1', nodeLabel: 'body' }],
      visualReferences: [
        {
          refId: 'ref-1',
          title: 'Moodboard',
          previewDataUrl: 'data:image/png;base64,ref',
        },
      ],
      techPackAttachments: [
        {
          attachmentId: 'att-1',
          fileName: 'pack.pdf',
          mimeType: 'application/pdf',
          canonicalSource: 'object_store_verified',
          remoteObjectKey: 'k1',
          previewDataUrl: 'data:application/pdf;base64,abc',
        },
      ],
    };
    const gate = evaluateWorkshop2TzExportBundleGate({
      dossier,
      categoryLeafId: COAT_LEAF,
    });
    expect(gate.checks.some((c) => c.id === 'export.sketch.empty')).toBe(false);
    expect(gate.checks.some((c) => c.id === 'export.sketch.partial')).toBe(false);
    expect(gate.checks.some((c) => c.id === 'export.tech_pack.empty')).toBe(false);
  });
});
