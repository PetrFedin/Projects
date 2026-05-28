/**
 * Internal WMS MVP: reserve, deficit warning gate, no MoySklad blocker.
 */
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2InternalWmsMirror,
  evaluateWorkshop2InternalWmsReserveSnapshotHandoffGate,
  evaluateWorkshop2StockWmsDeficitReserveGate,
  isWorkshop2InternalWmsEnabled,
  persistWorkshop2InternalWmsToDossier,
} from '@/lib/production/workshop2-internal-wms';
import { evaluateWorkshop2StockWmsLedgerGate } from '@/lib/production/workshop2-stock-wms-ledger-persist';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import {
  hasWorkshop2WmsReserveForSampleOrder,
  recordWorkshop2WmsMovement,
  resetWorkshop2WmsMemoryForTests,
  upsertWorkshop2WmsItem,
} from '@/lib/server/workshop2-wms-repository';
import {
  releaseWorkshop2WmsOnMovementReceived,
  reserveWorkshop2WmsForSampleOrder,
} from '@/lib/server/workshop2-internal-wms-server';
import { buildWorkshop2StockWmsLedgerFromBundle } from '@/lib/production/workshop2-stock-wms-ledger-persist';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';

describe('workshop2 internal WMS MVP', () => {
  const prevEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.WORKSHOP2_DATABASE_URL;
    delete process.env.WORKSHOP2_DOSSIER_DATABASE_URL;
    delete process.env.DATABASE_URL;
    resetWorkshop2WmsMemoryForTests();
  });

  afterEach(() => {
    process.env = { ...prevEnv };
    resetWorkshop2WmsMemoryForTests();
  });

  it('probe: enabled by default when PG URL present', () => {
    expect(
      isWorkshop2InternalWmsEnabled({
        WORKSHOP2_DATABASE_URL: 'postgres://localhost/w2',
      })
    ).toBe(true);
    expect(
      isWorkshop2InternalWmsEnabled({
        WORKSHOP2_INTERNAL_WMS: 'false',
        WORKSHOP2_DATABASE_URL: 'postgres://localhost/w2',
      })
    ).toBe(false);
  });

  it('probe: explicit true enables in-memory path for tests', () => {
    expect(isWorkshop2InternalWmsEnabled({ WORKSHOP2_INTERNAL_WMS: 'true' })).toBe(true);
  });

  it('deficit reserve is warning only, not sample-order blocker', () => {
    const mirror = buildWorkshop2InternalWmsMirror({
      balances: [
        {
          itemId: 'i1',
          sku: 'line-1',
          label: 'Хлопок',
          unit: 'м',
          locationCode: 'WORKSHOP2-WH',
          qtyOnHand: 0,
          qtyReserved: 2,
          qtyAvailable: -2,
        },
      ],
      movementCount: 1,
      reserveDeficitCount: 1,
      pgBacked: true,
    });
    const dossier = persistWorkshop2InternalWmsToDossier(emptyWorkshop2DossierPhase1(), {
      mirror,
    });
    const check = evaluateWorkshop2StockWmsDeficitReserveGate({ dossier });
    expect(check?.id).toBe('stock.wms.deficit_reserve');
    expect(check?.severity).toBe('warning');

    const ledgerCheck = evaluateWorkshop2StockWmsLedgerGate({ dossier });
    expect(ledgerCheck?.id).toBe('stock.wms.deficit_reserve');

    const gate = evaluateWorkshop2SampleOrderGate({
      dossier,
      categoryLeafId: 'leaf-1',
      vaultFileCount: 5,
    });
    const deficit = gate.readiness.checks.find((c) => c.id === 'stock.wms.deficit_reserve');
    expect(deficit?.severity).toBe('warning');
    expect(gate.readiness.checks.some((c) => c.id.includes('moysklad'))).toBe(false);
  });

  it('reserve: soft reserve in memory store increases qty_reserved', async () => {
    process.env.WORKSHOP2_INTERNAL_WMS = 'true';

    const dossier = emptyWorkshop2DossierPhase1();
    const model = ensureWorkshop2ProductionModel(dossier);
    model.materialLines.push({
      id: 'mat-test',
      nodeId: 'body',
      role: 'main',
      materialName: 'Тестовый хлопок SS27',
      yieldPerUnit: 3,
      yieldUnit: 'м',
      isPrimary: true,
    });
    dossier.productionModel = model;

    const result = await reserveWorkshop2WmsForSampleOrder({
      collectionId: 'SS27',
      articleId: 'art-wms-1',
      dossier,
      actor: 'test',
      sampleOrderId: 'so-1',
    });

    expect(result.ok).toBe(true);
    expect(result.reservedLines).toBeGreaterThan(0);
    expect(result.deficitLineCount).toBeGreaterThan(0);
    expect(result.movements.some((m) => m.kind === 'reserve' && m.qty > 0)).toBe(true);
    expect(result.balances.some((b) => b.qtyReserved > 0)).toBe(true);
    expect(result.mirror.wmsSyncStatus).toBe('memory_fallback');
  });

  it('persist: internal_pg mirror replaces draft_local on stockWmsLedger', () => {
    const mirror = buildWorkshop2InternalWmsMirror({
      balances: [],
      movementCount: 2,
      reserveDeficitCount: 0,
      pgBacked: true,
    });
    const dossier = persistWorkshop2InternalWmsToDossier(emptyWorkshop2DossierPhase1(), {
      mirror,
    });
    expect(dossier.stockWmsLedger?.wmsSyncStatus).toBe('internal_pg');
    const ledgerOnly = buildWorkshop2StockWmsLedgerFromBundle({
      dossier,
      stock: { movements: [], onHandNote: '' },
    });
    expect(ledgerOnly.wmsSyncStatus).toBe('internal_pg');
  });

  it('handoff: warns when factory handoff started without WMS mirror', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      factoryHandoffBundleMirror: {
        mirroredAt: new Date().toISOString(),
        totalHandoffs: 1,
        completedHandoffs: 0,
        pendingAckCount: 0,
        bundleState: 'draft',
        blockerHandoffCommit: false,
      },
    };
    process.env.WORKSHOP2_INTERNAL_WMS = 'true';
    const check = evaluateWorkshop2InternalWmsReserveSnapshotHandoffGate({ dossier });
    expect(check?.id).toBe('stock.wms.reserve_snapshot_missing');
    expect(check?.severity).toBe('warning');
  });

  it('reserve: idempotent for same sampleOrderId', async () => {
    process.env.WORKSHOP2_INTERNAL_WMS = 'true';
    const dossier = emptyWorkshop2DossierPhase1();
    const model = ensureWorkshop2ProductionModel(dossier);
    model.materialLines.push({
      id: 'mat-idem',
      nodeId: 'body',
      role: 'main',
      materialName: 'Идемпотентный материал',
      yieldPerUnit: 2,
      yieldUnit: 'м',
      isPrimary: true,
    });
    dossier.productionModel = model;

    const first = await reserveWorkshop2WmsForSampleOrder({
      collectionId: 'SS27',
      articleId: 'art-idem',
      dossier,
      sampleOrderId: 'so-idem-1',
    });
    expect(first.ok).toBe(true);
    expect(
      await hasWorkshop2WmsReserveForSampleOrder({
        collectionId: 'SS27',
        articleId: 'art-idem',
        sampleOrderId: 'so-idem-1',
      })
    ).toBe(true);

    const second = await reserveWorkshop2WmsForSampleOrder({
      collectionId: 'SS27',
      articleId: 'art-idem',
      dossier,
      sampleOrderId: 'so-idem-1',
    });
    expect(second.reason).toBe('idempotent_reserve_skip');
    expect(second.movements).toHaveLength(0);
  });

  it('release: idempotent on movement received for sample order', async () => {
    process.env.WORKSHOP2_INTERNAL_WMS = 'true';
    const item = await upsertWorkshop2WmsItem({
      collectionId: 'SS27',
      sku: 'rel-sku',
      label: 'Release test',
      unit: 'шт',
    });
    await recordWorkshop2WmsMovement({
      collectionId: 'SS27',
      articleId: 'art-rel',
      kind: 'reserve',
      qty: 3,
      itemId: item.id,
      actor: 'test',
      note: 'sample-order:so-rel-1',
    });

    const first = await releaseWorkshop2WmsOnMovementReceived({
      collectionId: 'SS27',
      articleId: 'art-rel',
      sampleOrderId: 'so-rel-1',
    });
    expect(first.ok).toBe(true);
    expect(first.releasedLines).toBeGreaterThan(0);

    const second = await releaseWorkshop2WmsOnMovementReceived({
      collectionId: 'SS27',
      articleId: 'art-rel',
      sampleOrderId: 'so-rel-1',
    });
    expect(second.releasedLines).toBe(0);
    expect(second.movements).toHaveLength(0);
  });

  it('probe: disabled when PG off and flag not forced', () => {
    delete process.env.WORKSHOP2_INTERNAL_WMS;
    expect(isWorkshop2InternalWmsEnabled({})).toBe(false);
  });

  it('movement: receipt then reserve uses available qty', async () => {
    process.env.WORKSHOP2_INTERNAL_WMS = 'true';

    const item = await upsertWorkshop2WmsItem({
      collectionId: 'SS27',
      sku: 'sku-1',
      label: 'Нитки',
      unit: 'шт',
    });
    await recordWorkshop2WmsMovement({
      collectionId: 'SS27',
      articleId: 'art-1',
      kind: 'receipt',
      qty: 10,
      itemId: item.id,
      actor: 'test',
    });
    const { balance } = await recordWorkshop2WmsMovement({
      collectionId: 'SS27',
      articleId: 'art-1',
      kind: 'reserve',
      qty: 4,
      itemId: item.id,
      actor: 'test',
    });
    expect(balance.qtyOnHand).toBe(10);
    expect(balance.qtyReserved).toBe(4);
    expect(balance.qtyAvailable).toBe(6);
  });
});
