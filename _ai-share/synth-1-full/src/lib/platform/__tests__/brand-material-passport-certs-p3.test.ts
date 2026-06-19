import {
  buildBrandMaterialPassportCertRows,
  materialPassportCertsBlockRelease,
  mergeBrandMaterialPassportCertRows,
  summarizeBrandMaterialPassportCerts,
} from '@/lib/fashion/brand-material-passport-certs';
import {
  clearBrandMaterialPassportCertsMemoryForTests,
  listBrandMaterialPassportCertsServer,
  patchBrandMaterialPassportCertReadyServer,
  seedBrandMaterialPassportCertMemoryForTests,
} from '@/lib/server/brand-material-passport-certs-repository';
import { products } from '@/lib/products';

describe('brand-material-passport-certs merge', () => {
  it('overlays persisted cert_ready on catalog rows', () => {
    const catalog = buildBrandMaterialPassportCertRows(products.slice(0, 3));
    const sku = catalog[0]!.sku;
    const merged = mergeBrandMaterialPassportCertRows(
      catalog,
      new Map([
        [
          sku,
          {
            ...catalog[0]!,
            certReady: true,
            persistedReady: true,
            gapRu: 'ok',
          },
        ],
      ])
    );
    expect(merged[0]?.certReady).toBe(true);
    expect(summarizeBrandMaterialPassportCerts(merged).ready).toBeGreaterThanOrEqual(1);
  });

  it('blocks release when not all certs ready', () => {
    expect(materialPassportCertsBlockRelease({ total: 5, ready: 3 })).toBe(true);
    expect(materialPassportCertsBlockRelease({ total: 5, ready: 5 })).toBe(false);
  });
});

describe('brand-material-passport-certs-repository P3', () => {
  beforeEach(() => {
    clearBrandMaterialPassportCertsMemoryForTests();
  });

  it('seeds and persists cert ready for catalog-ready SKU', async () => {
    clearBrandMaterialPassportCertsMemoryForTests();
    const catalog = buildBrandMaterialPassportCertRows(products.slice(0, 4));
    const base = catalog[0]!;
    seedBrandMaterialPassportCertMemoryForTests('SS27', {
      ...base,
      hasComposition: true,
      hasCare: true,
      sustainabilityTags: 2,
      certReady: false,
      gapRu: 'ok',
    });

    const patched = await patchBrandMaterialPassportCertReadyServer({
      collectionId: 'SS27',
      sku: base.sku,
      certReady: true,
    });
    expect(patched.row?.certReady).toBe(true);

    const again = await listBrandMaterialPassportCertsServer({
      collectionId: 'SS27',
      limit: 12,
      seedIfEmpty: false,
    });
    expect(again.rows.find((row) => row.sku === base.sku)?.certReady).toBe(true);
  });
});
