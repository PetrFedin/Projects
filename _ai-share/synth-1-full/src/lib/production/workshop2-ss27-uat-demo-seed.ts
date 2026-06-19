/**
 * Wave 31 — финализация demo-ss27-01 для UAT auto + showroom publish gate.
 * Вызывается из buildWorkshop2Ss27MenCoat01FullTzDemoDossier после базового ТЗ.
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { persistWorkshop2AssignmentSignoffMirrorToDossier } from '@/lib/production/workshop2-assignment-signoff-dossier-persist';
import { persistWorkshop2CategoryMergeMirrorToDossier } from '@/lib/production/workshop2-category-merge-dossier-persist';
import { persistWorkshop2OverviewSnapshotToDossier } from '@/lib/production/workshop2-overview-dossier-persist';
import { persistWorkshop2VisualReferencesMirrorToDossier } from '@/lib/production/workshop2-visual-references-dossier-persist';
import { persistWorkshop2PlanPoBundleSnapshotToDossier } from '@/lib/production/workshop2-plan-po-bundle-persist';
import { persistWorkshop2SupplyBundleMirrorToDossier } from '@/lib/production/workshop2-supply-bundle-dossier-persist';
import { persistWorkshop2QcPanelMirrorToDossier } from '@/lib/production/workshop2-qc-panel-dossier-persist';
import { persistWorkshop2InfopickMatrixMirrorToDossier } from '@/lib/production/workshop2-infopick-matrix-dossier-persist';

const SIGN_AT = '2026-04-04T10:00:00.000Z';
const DEMO_GTIN = '04601234567890';

function hasColorAssignment(dossier: Workshop2DossierPhase1): boolean {
  return (dossier.assignments ?? []).some(
    (a) =>
      a.kind === 'canonical' &&
      (a.attributeId === 'color' || a.attributeId === 'primaryColorFamilyOptions') &&
      (a.values?.length ?? 0) > 0
  );
}

/** Демо-путь UAT: полные подписи 4 секций + B2B draft для showroom gate. */
export function applyWorkshop2Ss27UatDemoSeed(
  dossier: Workshop2DossierPhase1,
  leaf: HandbookCategoryLeaf | null
): Workshop2DossierPhase1 {
  const leafId = leaf?.leafId ?? 'catalog-apparel-g0-l0';
  const sign = (by: string) => ({ by, at: SIGN_AT, signatureDigest: `demo-${by}` });
  const now = dossier.updatedAt ?? new Date().toISOString();

  let d: Workshop2DossierPhase1 = {
    ...dossier,
    sku: 'SS27-M-COAT-01',
    categoryBindings: [{ categoryLeafId: leafId }],
    passportSewingPlanNote: dossier.passportProductionBrief?.sewingRegionPlanNote,
    passportProductionBrief: {
      ...dossier.passportProductionBrief,
      b2cProductSlug: dossier.passportProductionBrief?.b2cProductSlug ?? 'ss27-m-coat-01',
      markingRequired: dossier.passportProductionBrief?.markingRequired ?? true,
      gtin: dossier.passportProductionBrief?.gtin ?? DEMO_GTIN,
    },
    assignments: hasColorAssignment(dossier)
      ? dossier.assignments
      : [
          ...(dossier.assignments ?? []),
          {
            assignmentId: 'ss27-uat-color',
            kind: 'canonical' as const,
            attributeId: 'primaryColorFamilyOptions',
            values: [
              {
                valueId: 'ss27-uat-color-v1',
                valueSource: 'free_text' as const,
                displayLabel: 'Чёрный',
                text: 'Чёрный',
              },
            ],
          },
        ],
    edoSignoffMirror: dossier.edoSignoffMirror ?? {
      mirroredAt: now,
      provider: 'mock',
      edoStatus: 'signed',
      requestId: 'mock-edo-ss27-staging',
      signedAt: now,
      blockerHandoff: false,
      statusLabelRu: 'Подписано',
      hintRu: 'ЭП Gold Sample (mock, staging UAT РФ).',
    },
    markingHonestSignMirror: dossier.markingHonestSignMirror ?? {
      mirroredAt: now,
      markingRequired: true,
      gtin: DEMO_GTIN,
      markingOrderId: 'mark-journal-SS27-demo-ss27-01-staging',
      status: 'journal_only',
      journalOnly: true,
      hintRu: 'Маркировка: journal-only для демо SS27 (без ЦРПТ ACK).',
    },
    sampleWorkflow: dossier.sampleWorkflow ?? {
      activeSampleOrderId: 'demo-ss27-01-sample-staging',
      floorStatusLabel: 'synced',
      lastSyncedAt: now,
    },
    hubCollectionRollupMirror: dossier.hubCollectionRollupMirror ?? {
      mirroredAt: now,
      collectionId: 'SS27',
      postgres: 'ok',
      metricsSource: 'pg_primary',
      serverRollupEnabled: true,
      dossierCount: 3,
      articleCount: 3,
      sampleOrderCount: 1,
      blockerSampleOrder: false,
      blockerHandoff: false,
      hintRu: 'SS27 demo rollup — UAT auto-check sample gate.',
    },
    showroomB2bMirror: dossier.showroomB2bMirror ?? {
      mirroredAt: now,
      publishMode: 'pg_journal',
      pgPublished: true,
      campaignName: 'SS27 Syntha Lab',
      lastPublishAt: now,
      publishJournalCount: 1,
      liveWebhookConfigured: false,
      liveWebhookAckSimulated: false,
      hintRu: 'Демо: витрина готова к publish (journal_only, без fake ACK).',
    },
    vaultDocuments: dossier.vaultDocuments ?? [
      {
        id: 'ss27-demo-vault-compliance',
        type: 'certificate',
        title: 'Декларация соответствия (демо)',
      },
    ],
    b2bIntegrationDraft: {
      wholesalePrice: '42000',
      msrp: '89000',
      moq: '120',
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      campaignId: 'ss27-syntha-lab',
    },
    sectionSignoffs: {
      general: {
        brand: sign('Виктория Белова'),
        tech: sign('Артём Новиков'),
      },
      visuals: {
        brand: sign('Виктория Белова'),
        tech: sign('Артём Новиков'),
      },
      material: {
        brand: sign('Виктория Белова'),
        tech: sign('Артём Новиков'),
      },
      construction: {
        brand: sign('Виктория Белова'),
        tech: sign('Артём Новиков'),
      },
      assignment: {
        brand: sign('Мария (Продакшн)'),
        tech: sign('Артём Новиков'),
      },
    },
    productionModel: {
      version: 1,
      nodes: [{ id: 'n-body', kind: 'body' as const, label: 'Корпус' }],
      materialLines: [
        {
          id: 'm-wool',
          nodeId: 'n-body',
          role: 'main' as const,
          materialName: 'Шерсть 90%',
          compositionText: '90% wool',
          yieldPerUnit: 2.1,
          unitCostNet: 1200,
        },
        {
          id: 'm-lining',
          nodeId: 'n-body',
          role: 'lining' as const,
          materialName: 'Подклад вискоза',
          compositionText: '100% viscose',
          yieldPerUnit: 1.4,
          unitCostNet: 320,
        },
      ],
      trimLines: [],
      operations: [],
      measurements: [],
    },
    supplyBundleMirror: undefined,
    qcPanelMirror: undefined,
  };

  d = persistWorkshop2CategoryMergeMirrorToDossier(d, {
    categoryLeafId: leafId,
    mergeDiff: {
      hasChanges: false,
      orphanFilledAttributeIds: [],
      warningsRu: [],
    },
  });
  d = persistWorkshop2InfopickMatrixMirrorToDossier(d, leafId);
  d = persistWorkshop2VisualReferencesMirrorToDossier(d);
  d = persistWorkshop2PlanPoBundleSnapshotToDossier(d, {
    purchaseOrders: [
      {
        id: 'po-ss27-demo-1',
        label: 'Drop 1 · Иваново',
        qty: 120,
        status: 'open',
        supplierId: 'sup-demo-ivanovo',
      },
    ],
  });
  d = persistWorkshop2SupplyBundleMirrorToDossier(d, {
    supplyBomSyncAt: dossier.updatedAt,
    plannedPoQty: 120,
  });
  d = persistWorkshop2QcPanelMirrorToDossier(d, {
    batchCount: 1,
    pendingBatchCount: 0,
    failedBatchCount: 0,
    hasSampleOrder: true,
    hasInspectorLink: true,
    supplierId: 'sup-demo-ivanovo',
    supplierSource: 'purchase_order',
    purchaseOrderCount: 1,
    poConfirmedCount: 1,
    activeSampleOrderId:
      dossier.sampleWorkflow?.activeSampleOrderId ?? 'demo-ss27-01-sample-staging',
  });
  d = persistWorkshop2AssignmentSignoffMirrorToDossier(d);
  d = persistWorkshop2OverviewSnapshotToDossier(d, {
    collectionId: 'SS27',
    articleId: 'demo-ss27-01',
  });

  return d;
}

export function isWorkshop2Ss27UatDemoSeedDossier(
  dossier: Workshop2DossierPhase1 | null | undefined
): boolean {
  if (!dossier) return false;
  return (
    dossier.sku === 'SS27-M-COAT-01' &&
    Boolean(dossier.showroomB2bMirror?.pgPublished) &&
    Boolean(dossier.b2bIntegrationDraft?.wholesalePrice)
  );
}
