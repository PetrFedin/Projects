import { assessShopMatrixInspectorFactoryPackGate } from '@/lib/production/shop-matrix-inspector-release-gate';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

describe('shop-matrix-inspector-release-gate', () => {
  it('blocks empty dossier until factory pack ready', () => {
    const dossier: Workshop2DossierPhase1 = { schemaVersion: 1, assignments: [] };
    const gate = assessShopMatrixInspectorFactoryPackGate({
      dossier,
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      articleSku: 'SKU-1',
    });
    expect(gate.ready).toBe(false);
    expect(gate.sheetsTotal).toBe(6);
    expect(gate.brandReleaseGateHref).toContain('techpack-gate');
  });
});
