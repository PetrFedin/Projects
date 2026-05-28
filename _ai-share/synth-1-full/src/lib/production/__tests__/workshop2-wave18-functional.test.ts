/**
 * Wave 18 — lowest-score functional depth (fail-closed integrations, gates, persist).
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  evaluateWorkshop2FactoryErpSyncClaimGate,
  sanitizeWorkshop2FactoryErpSyncClaim,
} from '@/lib/production/workshop2-factory-erp-sync-gate';
import { shouldApplyWorkshop2RemoteDossierUpdate } from '@/lib/production/workshop2-realtime-merge-policy';
import {
  buildWorkshop2DppExportValidationRecord,
  evaluateWorkshop2DppExportGate,
} from '@/lib/production/workshop2-dpp-export-gate';
import {
  copyWorkshop2NestingSnapshotToDossier,
  evaluateWorkshop2NestingExportGate,
} from '@/lib/production/workshop2-nesting-export-gate';
import {
  buildWorkshop2Fit3dReadinessRecord,
  evaluateWorkshop2Fit3dReadinessGate,
} from '@/lib/production/workshop2-fit3d-readiness-gate';
import { evaluateWorkshop2ShowroomPublishGate } from '@/lib/production/workshop2-showroom-publish-gate';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';

describe('workshop2 wave18 — #66 factory ERP fail-closed', () => {
  it('downgrades synced without erpOrderId', () => {
    const sanitized = sanitizeWorkshop2FactoryErpSyncClaim({
      syncStatus: 'synced',
      erpOrderId: '',
      baseUrlConfigured: true,
    });
    expect(sanitized.syncStatus).toBe('configured');
    expect(sanitized.lastError).toBe('erp_missing_order_id');
  });

  it('warns when ERP not configured', () => {
    const check = evaluateWorkshop2FactoryErpSyncClaimGate({ syncStatus: 'not_configured' });
    expect(check?.id).toBe('factory.erp.not_configured');
  });
});

describe('workshop2 wave18 — #20 realtime merge policy', () => {
  it('skips merge when form focused', () => {
    expect(
      shouldApplyWorkshop2RemoteDossierUpdate({
        localVersion: 1,
        remoteVersion: 2,
        formFocused: true,
      }).apply
    ).toBe(false);
  });

  it('applies when remote is newer', () => {
    expect(
      shouldApplyWorkshop2RemoteDossierUpdate({
        localVersion: 1,
        remoteVersion: 2,
        formFocused: false,
      }).apply
    ).toBe(true);
  });
});

describe('workshop2 wave18 — #50 DPP export gate', () => {
  it('blocks empty composition in TZ bundle gate', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const check = evaluateWorkshop2DppExportGate({
      dossier,
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(check?.id).toBe('dpp.composition.missing');
    const gate = evaluateWorkshop2TzExportBundleGate({
      dossier,
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(gate.allowed).toBe(false);
    expect(gate.checks.some((c) => c.id === 'dpp.composition.missing')).toBe(true);
  });

  it('records ready when BOM present', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      productionModel: {
        version: 1 as const,
        materialLines: [
          {
            id: 'm1',
            materialName: 'Shell',
            percentage: 100,
            yieldPerUnit: 1,
          },
        ],
        trimLines: [],
        nodes: [],
        operations: [],
        measurements: [],
      },
    };
    const record = buildWorkshop2DppExportValidationRecord({
      dossier,
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(record.state).toBe('ready');
  });
});

describe('workshop2 wave18 — #63 nesting export gate', () => {
  it('requires fabric width when sample order active', () => {
    const check = evaluateWorkshop2NestingExportGate({
      hasActiveSampleOrder: true,
      nesting: { notes: 'test' },
    });
    expect(check?.id).toBe('export.nesting.fabric_width');
  });

  it('copies snapshot to dossier', () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const next = copyWorkshop2NestingSnapshotToDossier(dossier, {
      fabricWidthCm: 150,
      efficiencyPct: 80,
    });
    expect(next.nestingRequestSnapshot?.fabricWidthCm).toBe(150);
    expect(next.nestingSnapshotPersistedAt).toBeTruthy();
  });
});

describe('workshop2 wave18 — #55 Fit3D readiness', () => {
  it('warns when cad missing in production without vault', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    delete process.env.NEXT_PUBLIC_W2_FIT3D_ENABLE;
    const check = evaluateWorkshop2Fit3dReadinessGate({
      cadVersionId: null,
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(check?.id).toBe('fit3d.placeholder.blocked_prod');
    process.env.NODE_ENV = prev;
  });

  it('builds readiness record', () => {
    const record = buildWorkshop2Fit3dReadinessRecord({
      dossier: emptyWorkshop2DossierPhase1(),
      cadVersionId: 'vault-doc-1',
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(record.state).toBe('vault');
  });
});

describe('workshop2 wave18 — #62 showroom publish gate', () => {
  it('blocks publish without MOQ', () => {
    const gate = evaluateWorkshop2ShowroomPublishGate({
      published: true,
      wholesalePrice: 45,
      msrp: 110,
      moq: 0,
      windowStart: '2026-06-01',
      windowEnd: '2026-06-30',
    });
    expect(gate.allowed).toBe(false);
    expect(gate.checks.some((c) => c.id === 'showroom.moq.invalid')).toBe(true);
  });
});
