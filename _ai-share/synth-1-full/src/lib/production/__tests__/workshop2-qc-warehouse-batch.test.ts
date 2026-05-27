jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
}));

jest.mock('@/lib/server/workshop2-dossier-repository', () => ({
  ensureWorkshop2PgSchema: jest.fn(),
}));

import {
  transitionWorkshop2SampleGoodsMovement,
  workshop2MovementStatusToSampleOrderStatus,
  workshop2SampleOrderStatusToMovementStatus,
  getNextWorkshop2SampleMovementStatus,
} from '@/lib/production/workshop2-sample-goods-movement';
import {
  buildWorkshop2DppExportBlock,
  buildWorkshop2DppJsonLdStub,
} from '@/lib/production/workshop2-dpp-export';
import {
  buildWorkshop2MobileInspectorChecklist,
  workshop2MobileInspectorHref,
} from '@/lib/production/workshop2-mobile-inspector-checklist';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { buildWorkshop2TzExportBundleZip } from '@/lib/server/workshop2-tz-export-bundle';
import {
  advanceWorkshop2SampleOrderMovement,
  clearWorkshop2SampleOrdersMemoryForTests,
  createWorkshop2SampleOrder,
} from '@/lib/server/workshop2-sample-order-repository';

describe('workshop2 QC / warehouse / DPP batch', () => {
  beforeEach(() => {
    clearWorkshop2SampleOrdersMemoryForTests();
  });

  it('goods movement transitions created → in_transit → received', () => {
    expect(getNextWorkshop2SampleMovementStatus('created')).toBe('in_transit');
    expect(getNextWorkshop2SampleMovementStatus('in_transit')).toBe('received');
    expect(getNextWorkshop2SampleMovementStatus('received')).toBeNull();

    const t1 = transitionWorkshop2SampleGoodsMovement({
      current: 'created',
      target: 'in_transit',
    });
    expect(t1.ok).toBe(true);
    if (t1.ok) expect(t1.orderStatus).toBe('in_progress');

    const dossier = emptyWorkshop2DossierPhase1();
    const blocked = transitionWorkshop2SampleGoodsMovement({
      current: 'in_transit',
      target: 'received',
      dossier,
      strictIntakeOnReceived: true,
    });
    expect(blocked.ok).toBe(false);
  });

  it('maps sample order status ↔ movement status', () => {
    expect(workshop2SampleOrderStatusToMovementStatus('in_progress')).toBe('in_transit');
    expect(workshop2MovementStatusToSampleOrderStatus('received')).toBe('received');
  });

  it('builds DPP export block and JSON-LD from dossier BOM', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      productionModel: {
        version: 1 as const,
        nodes: [],
        materialLines: [
          {
            id: 'm1',
            nodeId: 'n1',
            role: 'shell' as const,
            materialName: 'Органический хлопок',
            percentage: 95,
            compositionText: 'GOTS',
            consumption: 1.2,
          },
        ],
        trimLines: [],
        operations: [],
        measurements: [],
      },
      compositionLabelSpec: {
        brandFaceLines: 'Syntha Lab',
        technologistNotes: 'Стирка 30°C',
      },
    };
    const block = buildWorkshop2DppExportBlock({
      dossier,
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      articleSku: 'SKU-1',
    });
    expect(block.passportId).toBeTruthy();
    expect(block.materials.length).toBeGreaterThan(0);
    expect(block.compositionText).toContain('95%');
    expect(block.registryStub.status).toBe('draft_export');
    const jsonLd = buildWorkshop2DppJsonLdStub(block);
    expect(jsonLd['@type']).toBe('Product');
    expect(jsonLd.identifier).toBe(block.passportId);
    expect(jsonLd.material).toContain('хлопок');
  });

  it('dpp export enriches colorway and tnved from dossier assignments', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      assignments: [
        {
          kind: 'canonical' as const,
          attributeId: 'customsTnvedPreliminaryCode',
          values: [{ displayLabel: '6109.10.0000' }],
        },
        {
          kind: 'canonical' as const,
          attributeId: 'color',
          values: [{ displayLabel: 'Navy' }],
        },
      ],
      productionModel: {
        version: 1 as const,
        nodes: [],
        materialLines: [
          {
            id: 'm1',
            nodeId: 'n1',
            role: 'shell' as const,
            materialName: 'Хлопок',
            percentage: 100,
          },
        ],
        trimLines: [],
        operations: [],
        measurements: [],
      },
    };
    const block = buildWorkshop2DppExportBlock({
      dossier,
      collectionId: 'SS27',
      articleId: 'a1',
    });
    expect(block.customsTnvedCode).toBe('6109.10.0000');
    expect(block.colorways?.length).toBeGreaterThan(0);
  });

  it('includes dpp files in tz export zip', async () => {
    const dossier = emptyWorkshop2DossierPhase1();
    const { buffer } = await buildWorkshop2TzExportBundleZip({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      dossier,
      version: 1,
      updatedAt: '2026-05-19T12:00:00.000Z',
    });
    expect(buffer.length).toBeGreaterThan(200);
  });

  it('mobile inspector checklist links order id', () => {
    const href = workshop2MobileInspectorHref({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      orderId: 'order-abc-123',
    });
    expect(href).toContain('/brand/production/workshop2/inspector/');
    expect(href).toContain('c=SS27');
    const items = buildWorkshop2MobileInspectorChecklist({
      dossier: emptyWorkshop2DossierPhase1(),
      sampleOrderId: 'order-abc-123',
      orderQty: 3,
    });
    expect(items.some((i) => i.id === 'order_linked' && i.done)).toBe(true);
  });

  it('persists movement on sample order (memory store)', async () => {
    const order = await createWorkshop2SampleOrder({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      quantity: 2,
    });
    expect(order.movementStatus).toBe('created');

    const mid = await advanceWorkshop2SampleOrderMovement({
      id: order.id,
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      target: 'in_transit',
    });
    expect(mid?.movementStatus).toBe('in_transit');
    expect(mid?.status).toBe('in_progress');
    expect(mid?.movementLog.length).toBe(1);
  });
});
