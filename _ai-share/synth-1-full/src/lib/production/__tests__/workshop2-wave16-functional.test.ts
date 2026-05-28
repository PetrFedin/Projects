/**
 * Wave 16: functional depth — operational TZ sync, handoff PDF gate, lab dip, supply BOM sync,
 * assembly commit gate, grading apply audit.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { evaluateWorkshop2OperationalTzSyncGate } from '@/lib/production/workshop2-operational-tz-sync-gate';
import { evaluateWorkshop2HandoffPdfExportGate } from '@/lib/production/workshop2-handoff-pdf-export-gate';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { syncWorkshop2SupplyLinesFromDossierBom } from '@/lib/production/workshop2-supply-sync-from-bom';
import {
  buildWorkshop2ArticleAssemblyPreview,
  type Workshop2ArticleAssemblerInput,
} from '@/lib/production/workshop2-article-assembler';
import { evaluateWorkshop2AssemblyPreviewCommitGate } from '@/lib/production/workshop2-assembly-preview-commit-gate';
import { appendWorkshop2SmartGradingWithAudit } from '@/lib/production/workshop2-grading-apply-audit';
import { findHandbookLeafById } from '@/lib/production/category-catalog';

const COAT_LEAF = 'catalog-apparel-g0-l0';

describe('workshop2 wave16 — #26 operational TZ sync gate', () => {
  it('blocks sync when dossier missing', () => {
    const gate = evaluateWorkshop2OperationalTzSyncGate({
      tab: 'supply',
      dossier: null,
      leaf: findHandbookLeafById(COAT_LEAF),
    });
    expect(gate.allowed).toBe(false);
  });
});

describe('workshop2 wave16 — #79 handoff PDF export gate', () => {
  it('blocks empty sketch dossier', () => {
    const gate = evaluateWorkshop2HandoffPdfExportGate({
      dossier: emptyWorkshop2DossierPhase1(),
      categoryLeaf: findHandbookLeafById(COAT_LEAF),
    });
    expect(gate.allowed).toBe(false);
    expect(gate.state).toBe('blocked');
    expect(gate.checks.some((c) => c.messageRu.includes('скетча'))).toBe(true);
  });
});

describe('workshop2 wave16 — #52 lab dip blocks sample order', () => {
  it('blocks when colorway without approved lab dip', () => {
    let dossier = emptyWorkshop2DossierPhase1();
    dossier = {
      ...dossier,
      assignments: [
        {
          assignmentId: 'a-color',
          kind: 'canonical',
          attributeId: 'color',
          values: [
            {
              valueId: 'v1',
              valueSource: 'free_text',
              text: 'Navy',
              displayLabel: 'Navy',
            },
          ],
        },
      ],
      colorLabDipStatuses: { NAV: 'pending' },
    };
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: COAT_LEAF,
      vaultFileCount: 2,
    });
    expect(gate.allowed).toBe(false);
    expect(gate.readiness.checks.some((c) => c.id === 'supply.lab_dip.not_approved')).toBe(true);
  });
});

describe('workshop2 wave16 — #46 supply sync from BOM', () => {
  it('adds supply lines from dossier BOM', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      productionModel: {
        version: 1 as const,
        nodes: [{ id: 'body', label: 'Корпус', status: 'draft' as const }],
        materialLines: [
          {
            id: 'ml-1',
            nodeId: 'body',
            materialName: 'Хлопок',
            role: 'main' as const,
            isPrimary: true,
          },
        ],
        trimLines: [],
        measurements: [],
      },
    };
    const synced = syncWorkshop2SupplyLinesFromDossierBom({ dossier, supply: { lines: [] } });
    expect(synced.addedCount).toBe(1);
    expect(synced.supplyBomSyncAt).toBeTruthy();
    expect(synced.supply.lines[0]?.label).toContain('Хлопок');
  });
});

describe('workshop2 wave16 — #13 assembly preview commit gate', () => {
  it('blocks forbidden audience for apparel', () => {
    const leaf = findHandbookLeafById(COAT_LEAF);
    expect(leaf).toBeDefined();
    const input: Workshop2ArticleAssemblerInput = {
      categoryLeafId: COAT_LEAF,
      audienceId: 'other',
      isUnisex: false,
      sku: 'TEST-001',
      name: 'Test',
    };
    const preview = buildWorkshop2ArticleAssemblyPreview(input, leaf!);
    const gate = evaluateWorkshop2AssemblyPreviewCommitGate(preview);
    expect(gate.allowed).toBe(false);
    expect(gate.checkId).toBe('assembly.audience.forbidden');
  });
});

describe('workshop2 wave16 — #39 grading apply audit', () => {
  it('writes gradingApplyLog on smart grading', () => {
    const leaf = findHandbookLeafById(COAT_LEAF);
    const applied = appendWorkshop2SmartGradingWithAudit({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        sampleSizeScaleId: 'men-apparel-eu',
        gradingSizes: ['48', '50', '52'],
        assignments: [
          {
            assignmentId: 'a-sb',
            kind: 'canonical',
            attributeId: 'sampleBaseSize',
            values: [
              {
                valueId: 'v1',
                valueSource: 'handbook_parameter',
                parameterId: 'p:50',
                displayLabel: '50',
              },
            ],
          },
        ],
        productionModel: {
          nodes: [{ id: 'body', label: 'Корпус' }],
          measurements: [
            {
              id: 'mp-chest',
              pointName: 'Грудь',
              baseValue: 100,
              tolerancePlus: 1,
              toleranceMinus: 1,
            },
          ],
          materialLines: [],
          trimLines: [],
        },
      },
      categoryLeaf: leaf ?? null,
      sizes: ['48', '50', '52'],
      baseSizeLabel: '50',
      measurementPoints: [{ id: 'mp-chest', pointName: 'Грудь', dimKey: 'chest' }],
    });
    expect(applied).not.toBeNull();
    expect(applied!.dossier.gradingApplyLog?.[0]?.appliedFrom).toBeTruthy();
    expect(applied!.record.ruleCount).toBeGreaterThan(0);
  });
});
