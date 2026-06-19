import { mergePxmMediaIntoPublishedArticles } from '../pxm-media-overlay';
import { upsertCentricPxmMedia } from '../centric-pxm-media-persistence.file';
import { enqueueAllocationForOrder, computeOpenToSellForSku } from '../aims360-allocation.service';
import { getAllocationQueue } from '../allocation-queue-persistence.file';

describe('pxm-media-overlay', () => {
  it('overlays PXM hero on published articles', () => {
    upsertCentricPxmMedia({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      centricStyleId: 'CENTRIC-demo',
      heroUrl: 'https://example.com/pxm-hero.jpg',
      assets: [{ assetId: 'a1', url: 'https://example.com/pxm-hero.jpg', kind: 'hero' }],
      importedAt: new Date().toISOString(),
    });
    const merged = mergePxmMediaIntoPublishedArticles([
      {
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        name: 'Coat',
        wholesalePriceRub: 1000,
        heroImageUrl: '/old.jpg',
      },
    ]);
    expect(merged[0]?.heroImageUrl).toBe('https://example.com/pxm-hero.jpg');
    expect(merged[0]?.pxmSource).toBe(true);
  });
});

describe('aims360-allocation', () => {
  it('enqueues allocation and exposes OTS', () => {
    const rec = enqueueAllocationForOrder({
      wholesaleOrderId: 'INT-JOOR-TEST-ALLOC',
      collectionId: 'SS27',
      lines: [{ productId: 'SS27-M-COAT-01', quantity: 10, size: 'M' }],
    });
    expect(rec.status).toBe('queued');
    expect(getAllocationQueue('INT-JOOR-TEST-ALLOC')?.lines[0]?.sku).toBe('SS27-M-COAT-01');
    expect(computeOpenToSellForSku('SS27-M-COAT-01')).toBe(580);
  });
});
