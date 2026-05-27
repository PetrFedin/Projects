jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
}));

jest.mock('@/lib/server/workshop2-dossier-repository', () => ({
  ensureWorkshop2PgSchema: jest.fn(),
}));

import { evaluateWorkshop2HandoffReadiness } from '@/lib/production/workshop2-handoff-readiness';
import { mergeWorkshop2DossierWithServerWinsPolicy } from '@/lib/production/workshop2-dossier-version-merge-policy';
import { getWorkshop2VaultS3ProdBanner } from '@/lib/production/workshop2-vault-prod-banner';
import { isWorkshop2SmartRoutingDemoAllowed } from '@/lib/production/workshop2-smart-routing-demo';
import { readWorkshop2PomOnCreatePolicyDefault } from '@/lib/production/workshop2-pom-create-policy';
import { applyWorkshop2ChangeRequestDecision } from '@/lib/production/workshop2-change-request-workflow';
import { resolveWorkshop2PurchaseOrderErpDisplayStatus } from '@/lib/production/workshop2-purchase-order-erp-display';
import { resolveWorkshop2FloorSampleSync } from '@/lib/production/workshop2-floor-sample-sync';
import { syncMovementOnSampleOrderStatusChange } from '@/lib/production/workshop2-sample-order-movement-auto';
import { applyWorkshop2FactoryHandoffAck } from '@/lib/production/workshop2-factory-handoff-ack';
import {
  resolveWorkshop2UpdatedBy,
  workshop2RequiresJwtActorForPut,
} from '@/lib/server/workshop2-api-context';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  clearWorkshop2SampleOrdersMemoryForTests,
  createWorkshop2SampleOrder,
  updateWorkshop2SampleOrder,
} from '@/lib/server/workshop2-sample-order-repository';

describe('workshop2 critical path to sample (8.x → 9.0)', () => {
  beforeEach(() => {
    clearWorkshop2SampleOrdersMemoryForTests();
    delete process.env.WORKSHOP2_POM_ON_CREATE_DEFAULT;
    delete process.env.WORKSHOP2_SMART_ROUTING_DEMO;
    process.env.NODE_ENV = 'test';
  });

  it('handoff readiness exposes score10 when gate passes', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      categoryBindings: [{ categoryLeafId: 'catalog-apparel-g0-l0' }],
      sampleBasePerSizeDimensions: { M: { Длина: '100' } },
    };
    const r = evaluateWorkshop2HandoffReadiness({
      dossier,
      categoryLeafId: 'catalog-apparel-g0-l0',
      vaultFileCount: 2,
      minTzOverallPct: 0,
    });
    expect(r.ready).toBe(true);
    expect(r.score10).toBeGreaterThanOrEqual(9);
  });

  it('PUT dossier actor prefers JWT session over body in production', () => {
    const req = {
      headers: {
        get: (name: string) => (name === 'x-w2-updated-by' ? 'spoofed' : null),
      },
    } as unknown as import('next/server').NextRequest;
    expect(
      resolveWorkshop2UpdatedBy(req, 'body-user', {
        actorId: 'jwt-user',
        actorLabel: 'JWT User',
        roles: ['production:edit'],
      })
    ).toBe('JWT User');
    process.env.NODE_ENV = 'production';
    expect(workshop2RequiresJwtActorForPut()).toBe(true);
    process.env.NODE_ENV = 'test';
  });

  it('version conflict merge uses server-wins on critical fields', () => {
    const server = {
      ...emptyWorkshop2DossierPhase1(),
      goldSampleStatus: 'approved' as const,
      lifecycleState: 'handoff_ready' as const,
    };
    const local = {
      ...emptyWorkshop2DossierPhase1(),
      goldSampleStatus: 'pending' as const,
      lifecycleState: 'draft' as const,
    };
    const merged = mergeWorkshop2DossierWithServerWinsPolicy(server, local);
    expect(merged.goldSampleStatus).toBe('approved');
    expect(merged.lifecycleState).toBe('handoff_ready');
  });

  it('vault S3 prod banner when not configured', () => {
    const banner = getWorkshop2VaultS3ProdBanner({
      nodeEnv: 'production',
      s3Configured: false,
    });
    expect(banner.show).toBe(true);
    expect(banner.code).toBe('vault_s3_not_configured');
  });

  it('movement auto-appends log on sample order status change', async () => {
    const order = await createWorkshop2SampleOrder({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      status: 'draft',
    });
    const updated = await updateWorkshop2SampleOrder({
      id: order.id,
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      status: 'sent',
    });
    expect(updated?.movementStatus).toBe('in_transit');
    expect(updated?.movementLog.some((e) => e.reason === 'order_status_change')).toBe(true);

    const sync = syncMovementOnSampleOrderStatusChange({
      previousStatus: 'sent',
      nextStatus: 'received',
      previousMovement: 'in_transit',
      movementLog: updated!.movementLog,
    });
    expect(sync.movementStatus).toBe('received');
  });

  it('smart routing demo off in production by default', () => {
    expect(
      isWorkshop2SmartRoutingDemoAllowed({ NODE_ENV: 'production' } as NodeJS.ProcessEnv)
    ).toBe(false);
    expect(
      isWorkshop2SmartRoutingDemoAllowed({
        NODE_ENV: 'production',
        WORKSHOP2_SMART_ROUTING_DEMO: '1',
      } as NodeJS.ProcessEnv)
    ).toBe(true);
  });

  it('CR approve workflow updates status', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      changeRequests: [
        {
          id: 'cr-1',
          description: 'Change zipper',
          status: 'pending',
          createdAt: '2026-05-19T00:00:00.000Z',
        },
      ],
    };
    const applied = applyWorkshop2ChangeRequestDecision({
      dossier,
      changeRequestId: 'cr-1',
      decision: 'approved',
      decidedBy: 'Tech Lead',
    });
    expect(applied?.changeRequest?.status).toBe('approved');
  });

  it('PO ERP display shows external id when synced', () => {
    const d = resolveWorkshop2PurchaseOrderErpDisplayStatus({
      status: 'synced',
      erpExternalId: 'ERP-PO-99',
      erpConfigured: true,
    });
    expect(d.code).toBe('synced');
    expect(d.erpExternalId).toBe('ERP-PO-99');
  });

  it('floor tab maps to sample order status', () => {
    const r = resolveWorkshop2FloorSampleSync({ floorTab: 'gold-sample' });
    expect(r.orderStatus).toBe('approved');
  });

  it('factory handoff ack stamps factoryReceivedAt', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      techPackFactoryHandoffs: [
        {
          handoffId: 'h1',
          createdAt: '2026-05-19T00:00:00.000Z',
          createdBy: 'brand',
          brandDispatchedAt: '2026-05-19T01:00:00.000Z',
          brandDispatchedBy: 'Brand',
          channel: 'portal',
          status: 'sent',
          attachmentIds: ['a1'],
        },
      ],
    };
    const applied = applyWorkshop2FactoryHandoffAck({
      dossier,
      handoffId: 'h1',
      receivedAt: '2026-05-19T02:00:00.000Z',
      receivedBy: 'Factory QC',
    });
    expect(applied?.handoff?.factoryReceivedAt).toBe('2026-05-19T02:00:00.000Z');
  });

  it('POM on create policy reads env default', () => {
    process.env.WORKSHOP2_POM_ON_CREATE_DEFAULT = 'true';
    expect(readWorkshop2PomOnCreatePolicyDefault()).toBe(true);
  });
});
