jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
}));

jest.mock('@/lib/server/workshop2-dossier-repository', () => ({
  ensureWorkshop2PgSchema: jest.fn(),
}));

import {
  clearWorkshop2SampleOrdersMemoryForTests,
  createWorkshop2SampleOrder,
  listWorkshop2SampleOrders,
  updateWorkshop2SampleOrder,
} from '@/lib/server/workshop2-sample-order-repository';
import {
  clearWorkshop2PlmOutboxMemoryForTests,
  enqueueWorkshop2PlmOutbox,
  countWorkshop2PlmOutboxPending,
} from '@/lib/server/workshop2-plm-outbox';
import { mapWorkshop2DossierSavedToPlm } from '@/lib/production/workshop2-plm-bridge';
import {
  clearWorkshop2MaterialRequisitionsMemoryForTests,
  createWorkshop2MaterialRequisition,
} from '@/lib/server/workshop2-material-requisition-repository';
import { assembleWorkshop2ArticleFromTaxonomy } from '@/lib/production/workshop2-article-assembler';

describe('workshop2-sprint17', () => {
  beforeEach(() => {
    clearWorkshop2SampleOrdersMemoryForTests();
    clearWorkshop2PlmOutboxMemoryForTests();
    clearWorkshop2MaterialRequisitionsMemoryForTests();
  });

  it('creates and updates sample order in memory store', async () => {
    const created = await createWorkshop2SampleOrder({
      collectionId: 'SS27',
      articleId: 'sku-1',
      contractorId: 'factory-a',
      dueDate: '2026-06-01',
      sizes: { M: 2 },
      quantity: 2,
    });
    expect(created.status).toBe('draft');
    const list = await listWorkshop2SampleOrders({
      collectionId: 'SS27',
      articleId: 'sku-1',
    });
    expect(list).toHaveLength(1);
    const updated = await updateWorkshop2SampleOrder({
      id: created.id,
      collectionId: 'SS27',
      articleId: 'sku-1',
      status: 'sent',
    });
    expect(updated?.status).toBe('sent');
  });

  it('assembler output is stable for hub dossier PUT payload shape', () => {
    const built = assembleWorkshop2ArticleFromTaxonomy({
      categoryLeafId: 'catalog-apparel-g0-l0',
      audienceId: 'men',
      isUnisex: false,
    });
    expect(built).not.toBeNull();
    expect(built!.dossier.assignments.length).toBeGreaterThan(0);
    expect(built!.dossier.categoryBindings?.[0]?.categoryLeafId).toBe('catalog-apparel-g0-l0');
  });

  it('creates material requisition from BOM line ref', async () => {
    const req = await createWorkshop2MaterialRequisition({
      collectionId: 'SS27',
      articleId: 'coat-01',
      bomLineRef: 'mat-abc',
      materialLabel: 'Шерсть 90',
      quantity: 1.2,
      unit: 'm',
    });
    expect(req.id).toBeTruthy();
    expect(req.materialLabel).toBe('Шерсть 90');
  });

  it('enqueues PLM outbox event', async () => {
    const env = mapWorkshop2DossierSavedToPlm({
      collectionId: 'SS27',
      articleId: 'a1',
      dossier: { schemaVersion: 1, assignments: [] },
      version: 1,
    });
    await enqueueWorkshop2PlmOutbox(env);
    const pending = await countWorkshop2PlmOutboxPending();
    expect(pending).toBeGreaterThanOrEqual(1);
  });
});
