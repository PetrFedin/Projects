import {
  WORKSHOP2_FIT3D_PLACEHOLDER_GLB,
  resolveWorkshop2Fit3dModel,
  workshop2VaultGlbPublicUrl,
} from '@/lib/production/workshop2-fit-3d-model-resolve';

describe('workshop2-fit-3d-model-resolve', () => {
  const prevNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = prevNodeEnv;
    delete process.env.NEXT_PUBLIC_W2_FIT3D_ENABLE;
  });

  it('uses placeholder in development when no cad id', () => {
    process.env.NODE_ENV = 'development';
    const r = resolveWorkshop2Fit3dModel({});
    expect(r.isPlaceholder).toBe(true);
    expect(r.modelUrl).toBe(WORKSHOP2_FIT3D_PLACEHOLDER_GLB);
    expect(r.hintRu).toMatch(/placeholder/i);
  });

  it('blocks placeholder in production without vault cad', () => {
    process.env.NODE_ENV = 'production';
    const r = resolveWorkshop2Fit3dModel({});
    expect(r.isPlaceholder).toBe(true);
    expect(r.placeholderBlockedInProd).toBe(true);
    expect(r.viewerEnabled).toBe(false);
    expect(r.modelUrl).toBe('');
  });

  it('builds vault URL for cad document id', () => {
    const url = workshop2VaultGlbPublicUrl({
      collectionId: 'SS27',
      articleId: 'demo-1',
      vaultDocumentId: 'cad-doc-1',
    });
    expect(url).toContain('/api/workshop2/articles/SS27/demo-1/vault/cad-doc-1/file');
    const r = resolveWorkshop2Fit3dModel({
      cadVersionId: 'cad-doc-1',
      collectionId: 'SS27',
      articleId: 'demo-1',
    });
    expect(r.isPlaceholder).toBe(false);
    expect(r.modelUrl).toBe(url);
  });

  it('accepts direct .glb path', () => {
    const r = resolveWorkshop2Fit3dModel({ cadVersionId: '/models/custom.glb' });
    expect(r.isPlaceholder).toBe(false);
    expect(r.modelUrl).toBe('/models/custom.glb');
  });
});
