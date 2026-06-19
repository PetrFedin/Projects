/**
 * Wave 15 RU — compliance pack, supplier cycle, factory QC loop (+8 tests).
 */
jest.mock('@/lib/production/workshop2-composition-label-pdf-export', () => ({
  buildCompositionLabelDraftPdfBuffer: jest.fn(() => Buffer.from('%PDF-stub')),
  downloadCompositionLabelDraftPdf: jest.fn(),
}));

jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
}));

jest.mock('@/lib/server/workshop2-dossier-repository', () => ({
  ensureWorkshop2PgSchema: jest.fn(),
}));

import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2RuCompliancePackZip,
  isWorkshop2DppComplianceExportReady,
} from '@/lib/server/workshop2-ru-compliance-pack';
import {
  applyWorkshop2MaterialRequisitionStatusToDossier,
  clearWorkshop2MaterialRequisitionsMemoryForTests,
  areWorkshop2MaterialRequisitionsConfirmedForArticles,
  createWorkshop2MaterialRequisition,
  patchWorkshop2MaterialRequisitionSupplierStatus,
} from '@/lib/server/workshop2-material-requisition-repository';
import { syncWorkshop2InspectorReportMirrorAfterPut } from '@/lib/production/workshop2-inspector-report-dossier-persist';
import { buildWorkshop2ShowroomLinesheetPayload } from '@/lib/production/workshop2-showroom-linesheet-payload';
import {
  buildWorkshop2Wave15RuComplianceCycleProbe,
  buildWorkshop2WaveRuSummary,
} from '@/lib/production/workshop2-live-integration-probes';
import { summarizeWorkshop2InspectorPgMirror } from '@/lib/production/workshop2-operational-pg-mirror-status';
import { isWorkshop2DomainEventType } from '@/lib/production/workshop2-domain-event-types';

describe('workshop2 wave15 — compliance pack zip', () => {
  it('bundles marking csv and gtin when passport has gtin', async () => {
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.passportProductionBrief = { gtin: '4601234567890' };
    const { buffer, manifest } = await buildWorkshop2RuCompliancePackZip({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier,
      version: 1,
      updatedAt: new Date().toISOString(),
    });
    expect(buffer.length).toBeGreaterThan(100);
    expect(manifest).toEqual(
      expect.arrayContaining(['marking/honest-sign.csv', 'marking/gtin.txt'])
    );
  });

  it('includes dpp json-ld when b2c slug ready', async () => {
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.passportProductionBrief = { b2cProductSlug: 'coat-ss27' };
    expect(isWorkshop2DppComplianceExportReady(dossier)).toBe(true);
    const { manifest } = await buildWorkshop2RuCompliancePackZip({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier,
      version: 1,
      updatedAt: new Date().toISOString(),
    });
    expect(manifest).toEqual(expect.arrayContaining(['dpp/passport.jsonld']));
  });
});

describe('workshop2 wave15 — supplier material request cycle', () => {
  beforeEach(() => clearWorkshop2MaterialRequisitionsMemoryForTests());

  it('areWorkshop2MaterialRequisitionsConfirmedForArticles requires all line articles', async () => {
    await createWorkshop2MaterialRequisition({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      materialLabel: 'Shell',
    });
    const partial = await areWorkshop2MaterialRequisitionsConfirmedForArticles({
      collectionId: 'SS27',
      articleIds: ['demo-ss27-01', 'demo-ss27-02'],
    });
    expect(partial.allConfirmed).toBe(false);
    expect(partial.confirmedArticleIds).toEqual([]);

    const created = await createWorkshop2MaterialRequisition({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      materialLabel: 'Lining',
    });
    await patchWorkshop2MaterialRequisitionSupplierStatus({
      id: created.id,
      status: 'confirmed',
    });
    const one = await areWorkshop2MaterialRequisitionsConfirmedForArticles({
      collectionId: 'SS27',
      articleIds: ['demo-ss27-01'],
    });
    expect(one.allConfirmed).toBe(true);
    expect(one.confirmedArticleIds).toEqual(['demo-ss27-01']);
  });

  it('patches supplier status to supplier_confirmed', async () => {
    const created = await createWorkshop2MaterialRequisition({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      bomLineRef: 'mat-1',
      materialLabel: 'Shell fabric',
    });
    const patched = await patchWorkshop2MaterialRequisitionSupplierStatus({
      id: created.id,
      status: 'confirmed',
      note: 'В наличии',
    });
    expect(patched?.status).toBe('supplier_confirmed');
  });

  it('mirrors requisition status into dossier bomRequisitionByLineRef', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.bomRequisitionByLineRef = {
      'mat-1': { id: 'req-1', status: 'draft', at: '2026-01-01T00:00:00.000Z' },
    };
    const next = applyWorkshop2MaterialRequisitionStatusToDossier({
      dossier,
      requisition: {
        id: 'req-1',
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        bomLineRef: 'mat-1',
        status: 'supplier_rejected',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    });
    expect(next.bomRequisitionByLineRef?.['mat-1']?.status).toBe('supplier_rejected');
  });
});

describe('workshop2 wave15 — factory QC mirror loop', () => {
  it('syncs inspectorReportMirror after PUT shape', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const next = syncWorkshop2InspectorReportMirrorAfterPut({
      dossier,
      report: {
        sampleOrderId: 'ord-qc-1',
        checkedItemIds: ['visual_sketch'],
        updatedAt: new Date().toISOString(),
      },
    });
    expect(next.inspectorReportMirror?.pgSynced).toBe(true);
    expect(next.inspectorReportMirror?.sampleOrderId).toBe('ord-qc-1');
  });

  it('factory queue qc badge reads inspector mirror', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.inspectorReportMirror = {
      mirroredAt: new Date().toISOString(),
      sampleOrderId: 'ord-1',
      totalItems: 5,
      checkedCount: 3,
      requiredDone: 2,
      requiredTotal: 3,
      pgSynced: true,
      offlineOnly: false,
      reportState: 'in_progress',
      blockerSampleOrder: false,
      blockerHandoff: true,
    };
    const chip = summarizeWorkshop2InspectorPgMirror(dossier);
    expect(chip.label).toMatch(/Инспектор: PG/);
  });
});

describe('workshop2 wave15 — linesheet preorderWindowRu + probes', () => {
  it('adds preorderWindowRu from b2bIntegrationDraft dates', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    dossier.b2bIntegrationDraft = { startDate: '2026-06-01', endDate: '2026-08-31' };
    const payload = buildWorkshop2ShowroomLinesheetPayload({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier,
    });
    expect(payload.preorderWindowRu?.startDate).toBe('2026-06-01');
    expect(payload.preorderWindowRu?.labelRu).toMatch(/Предзаказ/);
  });

  it('waveRuSummary aggregates RU waves without breaking legacy keys', () => {
    const summary = buildWorkshop2WaveRuSummary({ WORKSHOP2_MARKET: 'ru' });
    expect(summary.waves.length).toBeGreaterThanOrEqual(6);
    expect(summary.totalChecks).toBeGreaterThan(summary.totalOk - 1);
  });

  it('wave15 probe exposes compliance cycle checks', () => {
    const probe = buildWorkshop2Wave15RuComplianceCycleProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.checks.length).toBeGreaterThanOrEqual(8);
    expect(probe.checks.some((c) => c.id === 'compliance_pack_zip_api')).toBe(true);
  });

  it('registers supply.material_request.updated domain event type', () => {
    expect(isWorkshop2DomainEventType('supply.material_request.updated')).toBe(true);
    expect(isWorkshop2DomainEventType('qc.inspector_report.saved')).toBe(true);
  });
});
