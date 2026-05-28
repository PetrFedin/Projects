/**
 * Wave 14: functional depth — gates, lifecycle, CAD import audit, PLM retry, AQL persist, assembler.
 * @jest-environment node
 */

jest.mock('@/lib/server/workshop2-dossier-repository', () => ({
  ensureWorkshop2PgSchema: jest.fn(),
}));

jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  getWorkshop2PgPool: jest.fn(),
  isWorkshop2PostgresEnabled: jest.fn(() => false),
}));

import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { assembleWorkshop2ArticleFromTaxonomy } from '@/lib/production/workshop2-article-assembler';
import { applyVaultCadMeasuresToDossierPom } from '@/lib/production/workshop2-cad-metadata';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import {
  applyWorkshop2LifecycleTransition,
  validateWorkshop2LifecycleTransition,
} from '@/lib/production/workshop2-lifecycle-transition';
import { appendWorkshop2QcAqlInspectionToDossier } from '@/lib/production/workshop2-qc-aql-persist';
import { prefillWorkshop2AssignmentsFromRequiredMatrix } from '@/lib/production/workshop2-infopick-matrix-prefill';
import {
  clearWorkshop2PlmOutboxMemoryForTests,
  enqueueWorkshop2PlmOutbox,
  retryWorkshop2PlmOutboxFailed,
} from '@/lib/server/workshop2-plm-outbox';
import { applyWorkshop2CategoryLeafToDossier } from '@/lib/production/workshop2-dossier-category-change';
import { findHandbookLeafById } from '@/lib/production/category-catalog';

const COAT_LEAF = 'catalog-apparel-g0-l0';

describe('workshop2 wave14 — #44 sample order signoff gate', () => {
  it('blocks when TZ sections not signed', () => {
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier: emptyWorkshop2DossierPhase1(),
      vaultFileCount: 2,
      minVaultFiles: 1,
      minTzOverallPct: 0,
    });
    expect(gate.allowed).toBe(false);
    expect(gate.readiness.checks.some((c) => c.id === 'assignment.signoff.sections')).toBe(true);
  });
});

describe('workshop2 wave14 — #34 infopick prefill on assemble', () => {
  it('prefills empty required matrix slots on assemble', () => {
    const built = assembleWorkshop2ArticleFromTaxonomy({
      categoryLeafId: COAT_LEAF,
      audienceId: 'men',
    });
    expect(built).not.toBeNull();
    const direct = prefillWorkshop2AssignmentsFromRequiredMatrix(
      emptyWorkshop2DossierPhase1(),
      COAT_LEAF
    );
    expect(direct.prefilledCount).toBeGreaterThan(0);
  });
});

describe('workshop2 wave14 — #16 orphan cleanup', () => {
  it('prunes orphan canonical assignments when clearOrphans', () => {
    const leaf = findHandbookLeafById(COAT_LEAF);
    expect(leaf).toBeDefined();
    if (!leaf) return;
    let dossier = emptyWorkshop2DossierPhase1();
    dossier = {
      ...dossier,
      assignments: [
        {
          assignmentId: 'orphan-1',
          kind: 'canonical',
          attributeId: 'nonexistent_attr_xyz',
          values: [{ valueId: 'v1', valueSource: 'free_text', text: 'x', displayLabel: 'x' }],
        },
      ],
    };
    const result = applyWorkshop2CategoryLeafToDossier(dossier, leaf.leafId, {
      clearOrphans: true,
    });
    expect(result.orphans.length).toBeGreaterThan(0);
    expect(result.dossier.assignments?.some((a) => a.attributeId === 'nonexistent_attr_xyz')).toBe(
      false
    );
  });
});

describe('workshop2 wave14 — #40 CAD import audit', () => {
  it('writes cadPomImport meta on import', () => {
    const measures = [
      {
        id: 'm1',
        label: 'Длина',
        valueCm: 70,
        source: 'vault_metadata' as const,
      },
    ];
    const { dossier, imported } = applyVaultCadMeasuresToDossierPom(
      emptyWorkshop2DossierPhase1(),
      measures
    );
    expect(imported).toBe(1);
    expect(dossier.cadPomImport?.importedCellCount).toBe(1);
    expect(dossier.cadPomImport?.sizeKeys).toContain('base');
  });
});

describe('workshop2 wave14 — #78 PLM retry failed', () => {
  it('resets failed rows and processes', async () => {
    clearWorkshop2PlmOutboxMemoryForTests();
    const row = await enqueueWorkshop2PlmOutbox({
      type: 'dossier.saved',
      emittedAt: new Date().toISOString(),
      source: 'workshop2',
      payload: { collectionId: 'SS27', articleId: 'a1' },
    });
    row.status = 'failed';
    row.lastError = 'webhook_http_500';
    const result = await retryWorkshop2PlmOutboxFailed(5);
    expect(result.reset).toBe(1);
  });
});

describe('workshop2 wave14 — #19 lifecycle transition', () => {
  it('rejects invalid transition', () => {
    const t = validateWorkshop2LifecycleTransition('draft', 'accepted');
    expect(t.allowed).toBe(false);
  });

  it('appends revision on valid transition', () => {
    const d = emptyWorkshop2DossierPhase1();
    const { dossier: next } = applyWorkshop2LifecycleTransition(d, 'handoff_ready', 'tech');
    expect(next.lifecycleState).toBe('handoff_ready');
    expect((next.revisions ?? []).length).toBe(1);
  });
});

describe('workshop2 wave14 — #69 AQL persist', () => {
  it('appends qcAqlInspectionLog entry', () => {
    const { dossier, record } = appendWorkshop2QcAqlInspectionToDossier(
      emptyWorkshop2DossierPhase1(),
      {
        orderQty: 1000,
        qtySource: 'fallback',
        aqlLevel: '2.5',
        sampleSize: 80,
        criticalFound: 0,
        majorFound: 1,
        minorFound: 2,
        majorRejectLimit: 5,
        minorRejectLimit: 7,
        isFail: false,
      }
    );
    expect(dossier.qcAqlInspectionLog?.[0]?.id).toBe(record.id);
    expect(record.isFail).toBe(false);
  });
});
