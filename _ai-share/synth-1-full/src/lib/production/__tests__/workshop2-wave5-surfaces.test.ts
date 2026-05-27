import { buildWorkshop2SupplierQcScorecardFromPurchaseOrders } from '@/lib/production/workshop2-supplier-qc-scorecard';
import { buildWorkshop2SetupHealthRows } from '@/lib/production/workshop2-setup-health-summary';
import { summarizeWorkshop2ReferencesStatus } from '@/lib/production/workshop2-references-status-summary';
import { resolveWorkshop2QcSupplierId } from '@/lib/production/workshop2-qc-supplier-resolve';
import { validateWorkshop2ArticleForm } from '@/lib/production/workshop2-article-form-validation';
describe('workshop2 wave5 — supplier QC scorecard', () => {
  it('aggregates PO by supplier without mock batches', () => {
    const card = buildWorkshop2SupplierQcScorecardFromPurchaseOrders('sup-a', [
      {
        id: '1',
        collectionId: 'SS27',
        articleId: 'a1',
        supplierId: 'sup-a',
        qty: 10,
        status: 'synced',
        payload: {},
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '2',
        collectionId: 'SS27',
        articleId: 'a1',
        supplierId: 'sup-a',
        qty: 5,
        status: 'error',
        payload: { defectType: 'Пятно' },
        createdAt: '',
        updatedAt: '',
      },
    ]);
    expect(card.source).toBe('purchase_orders');
    expect(card.totalBatches).toBe(2);
    expect(card.passed).toBe(1);
    expect(card.failed).toBe(1);
    expect(card.defectTypes[0]?.name).toBe('Пятно');
  });
});

describe('workshop2 wave5 — setup health', () => {
  it('lists postgres and pg counts', () => {
    const rows = buildWorkshop2SetupHealthRows({
      healthOk: true,
      postgres: 'ok',
      storeMode: 'server_postgres',
      vaultS3: 'configured',
      genkit: 'off',
      redis: 'off',
      pgCounts: {
        collections: 1,
        articles: 2,
        dossiers: 2,
        events: 5,
        sampleOrders: 0,
      },
    });
    expect(rows.some((r) => r.id === 'pg-counts')).toBe(true);
    expect(rows.find((r) => r.id === 'postgres')?.status).toBe('ok');
  });
});

describe('workshop2 wave5 — references status', () => {
  it('counts static vs postgres directories', () => {
    const s = summarizeWorkshop2ReferencesStatus({
      postgres: 'ok',
      directories: { colors: 'postgres', materials: 'postgres', pom: 'static' },
    });
    expect(s.pgReady).toBe(true);
    expect(s.postgresDirectoryCount).toBe(2);
    expect(s.staticDirectoryCount).toBe(1);
  });
});

describe('workshop2 wave5 — QC supplier resolve', () => {
  it('prefers PO supplierId over seed', () => {
    const r = resolveWorkshop2QcSupplierId({
      planPo: {
        purchaseOrders: [{ id: 'po1', supplierId: 'factory-x', status: 'draft', qty: 1 }],
      },
    } as never);
    expect(r.source).toBe('purchase_order');
    expect(r.supplierId).toBe('factory-x');
  });
});

describe('workshop2 wave5 — article form SKU duplicate', () => {
  it('blocks submit when skuDuplicateBlocked', () => {
    const r = validateWorkshop2ArticleForm({
      mode: 'new',
      sku: 'SS27-M-COAT-01',
      name: 'Пальто',
      audienceId: 'men',
      resolvedLeafId: 'catalog-apparel-g0-l0',
      skuDuplicateBlocked: true,
      skuDuplicateMessageRu: 'SKU уже в PG',
    });
    expect(r.canSubmit).toBe(false);
    expect(r.errors.some((e) => e.includes('SKU'))).toBe(true);
  });
});
