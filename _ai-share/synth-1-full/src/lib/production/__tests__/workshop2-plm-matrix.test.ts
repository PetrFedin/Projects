import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2HandoffReadiness } from '@/lib/production/workshop2-handoff-readiness';
import {
  workshop2SampleOrderStatusToFloorTab,
  workshop2ContextToProductionFloorFromSampleOrder,
} from '@/lib/production/workshop2-floor-bridge';
import { buildWorkshop2RelatedSectionLinks } from '@/lib/production/workshop2-related-sections';
import { buildWorkshop2DocumentsIndex } from '@/lib/production/workshop2-documents-index';
import { validateSampleIntakeForCollection } from '@/lib/production/workshop2-sample-intake-gate';
import { workshop2SampleMovementStatusToFloorTab } from '@/lib/production/workshop2-floor-bridge';
import { workshop2MobileInspectorHref } from '@/lib/production/workshop2-mobile-inspector-checklist';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  extractCadMeasuresFromVaultMetadata,
  mergeCadMeasureLists,
} from '@/lib/production/workshop2-cad-metadata';
import {
  buildWorkshop2RoutingStepsFromDossier,
  syncWorkshop2RoutingStepsOnDossier,
} from '@/lib/production/workshop2-routing-steps';
import {
  normalizeWorkshop2NestingRequest,
  patchWorkshop2NestingRequest,
} from '@/lib/production/workshop2-nesting-request';
import { rollupSampleEconomicsFromBomCosting } from '@/lib/production/workshop2-sample-economics';
import { buildWorkshop2TzExportBundleZip } from '@/lib/server/workshop2-tz-export-bundle';
import JSZip from 'jszip';

jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
}));

jest.mock('@/lib/server/workshop2-dossier-repository', () => ({
  ensureWorkshop2PgSchema: jest.fn(),
}));

import {
  clearWorkshop2SampleOrdersMemoryForTests,
  createWorkshop2SampleOrder,
  updateWorkshop2SampleOrder,
} from '@/lib/server/workshop2-sample-order-repository';

describe('workshop2-plm-matrix wiring', () => {
  beforeEach(() => {
    clearWorkshop2SampleOrdersMemoryForTests();
  });

  it('exports sample-order gate aligned with handoff-readiness', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const readiness = evaluateWorkshop2HandoffReadiness({
      dossier,
      vaultFileCount: 0,
    });
    const gate = evaluateWorkshop2SampleOrderGate({ dossier, vaultFileCount: 0 });
    expect(gate.allowed).toBe(readiness.ready);
    expect(gate.readiness.checks.some((c) => c.id === 'vault.files.min')).toBe(true);
  });

  it('sample-order requires handoff (blockers when vault empty)', () => {
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier: emptyWorkshop2DossierPhase1(),
      vaultFileCount: 0,
      minTzOverallPct: 70,
    });
    expect(gate.allowed).toBe(false);
  });

  it('maps sample order status to production floor tab', () => {
    expect(workshop2SampleOrderStatusToFloorTab('approved')).toBe('gold-sample');
    expect(workshop2SampleOrderStatusToFloorTab('in_progress')).toBe('operations');
    const href = workshop2ContextToProductionFloorFromSampleOrder(
      { collectionId: 'SS27', articleLineId: 'demo-ss27-02' },
      'received'
    );
    expect(href).toContain('collectionId=SS27');
    expect(href).toContain('floorTab=quality');
  });

  it('builds related section links without empty list', () => {
    const links = buildWorkshop2RelatedSectionLinks({
      collectionId: 'SS27',
      articleUrlSegment: 'demo-ss27-02',
      activeTab: 'fit',
    });
    expect(links.length).toBeGreaterThan(3);
    expect(links.some((l) => l.id === 'bom')).toBe(true);
  });

  it('documents index includes vault and export-tz-bundle', () => {
    const idx = buildWorkshop2DocumentsIndex({
      collectionId: 'SS27',
      articleUrlSegment: 'demo-ss27-02',
    });
    expect(idx.some((e) => e.id === 'tz-bundle')).toBe(true);
    expect(idx.some((e) => e.href.includes('export-tz-bundle'))).toBe(true);
  });

  it('maps movement status to floor tab and inspector href', () => {
    expect(workshop2SampleMovementStatusToFloorTab('in_transit')).toBe('operations');
    const href = workshop2MobileInspectorHref({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      orderId: 'ord-1',
    });
    expect(href).toContain('inspector/ord-1');
  });

  it('sample intake validates gold sample and compliance', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      sampleProductionChainMode: 'rf_sewn' as const,
      sampleIntakeRelease: {
        sewnInRussiaConfirmed: true,
        countryOfOriginActual: 'РФ',
        finalTnvedCode: '6201',
        eanOrBatchCode: '4600000000000',
        markingTraceabilityNote: 'ЧЗ',
        technicalRegulationRef: 'ТР ТС',
        okpd2Note: '14.13',
      },
    };
    const fail = validateSampleIntakeForCollection(dossier);
    expect(fail.ok).toBe(false);
    expect(fail.missing.some((m) => m.includes('эталон'))).toBe(true);
  });

  it('related sections include cad, measurements, nesting, vault', () => {
    const links = buildWorkshop2RelatedSectionLinks({
      collectionId: 'SS27',
      articleUrlSegment: 'demo-ss27-02',
      activeTab: 'plan',
    });
    expect(links.some((l) => l.id === 'cad')).toBe(true);
    expect(links.some((l) => l.id === 'measurements')).toBe(true);
    expect(links.some((l) => l.id === 'nesting')).toBe(true);
    expect(links.some((l) => l.id === 'vault')).toBe(true);
    expect(links.some((l) => l.id === 'bom')).toBe(true);
  });

  it('extracts CAD measures from vault metadata (post-ingest viewer data)', () => {
    const measures = extractCadMeasuresFromVaultMetadata({
      kind: 'cad',
      measures: [{ label: 'Длина рукава', valueCm: 62.5 }],
    });
    expect(measures).toHaveLength(1);
    expect(measures[0]?.label).toBe('Длина рукава');
    expect(measures[0]?.source).toBe('vault_metadata');
  });

  it('builds routingSteps from smart routing and syncs on dossier', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      smartRoutingSequence: [
        { id: '1', category: 'Монтаж', name: 'Сшить бок', equipment: 'Оверлок', sash: 3 },
      ],
      sewingPlan: { partnerLabel: 'Factory A', regionCode: 'RU-MOW' },
    };
    const steps = buildWorkshop2RoutingStepsFromDossier(dossier);
    expect(steps).toHaveLength(1);
    expect(steps[0]?.source).toBe('smart_routing');
    expect(steps[0]?.partnerLabel).toBe('Factory A');
    const synced = syncWorkshop2RoutingStepsOnDossier(dossier);
    expect(synced.routingSteps).toHaveLength(1);
  });

  it('persists nestingRequest on sample order (memory store)', async () => {
    const order = await createWorkshop2SampleOrder({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      nestingRequest: { fabricWidthCm: 150, efficiencyPct: 82 },
    });
    expect(order.nestingRequest.fabricWidthCm).toBe(150);
    const patched = await updateWorkshop2SampleOrder({
      id: order.id,
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      nestingRequest: patchWorkshop2NestingRequest(order.nestingRequest, { efficiencyPct: 88 }),
    });
    expect(patched?.nestingRequest.efficiencyPct).toBe(88);
    expect(normalizeWorkshop2NestingRequest({ efficiencyPct: 150 }).efficiencyPct).toBe(100);
  });

  it('rolls up sample economics from BOM costing + target FOB', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      passportProductionBrief: { targetFob: 25 },
      productionModel: {
        version: 1 as const,
        nodes: [],
        materialLines: [
          {
            id: 'm1',
            nodeId: 'n1',
            materialName: 'Хлопок',
            yieldPerUnit: 1.5,
            unitCostNet: 4,
          },
        ],
        trimLines: [],
        operations: [],
        measurements: [],
      },
    };
    const draft = rollupSampleEconomicsFromBomCosting(dossier);
    expect(draft.lines.some((l) => l.sourceHint === 'tz_bom_reference')).toBe(true);
    expect(draft.bomRollup?.estimatedFob).toBe(6);
    expect(draft.bomRollup?.targetFob).toBe(25);
  });

  it('TZ export bundle includes routing-steps.json when routingSteps present', async () => {
    const dossier = syncWorkshop2RoutingStepsOnDossier({
      ...emptyWorkshop2DossierPhase1(),
      smartRoutingSequence: [
        { id: '1', category: 'Отделка', name: 'ВТО', equipment: 'Стол', sash: 2 },
      ],
    });
    const { buffer } = await buildWorkshop2TzExportBundleZip({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      dossier,
      version: 1,
      updatedAt: '2026-05-19T12:00:00.000Z',
    });
    const zip = await JSZip.loadAsync(buffer);
    const routingJson = await zip.file('routing-steps.json')?.async('string');
    expect(routingJson).toBeTruthy();
    expect(routingJson).toContain('ВТО');
  });
});
