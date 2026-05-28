import {
  mapWorkshop2ArticleUpdatedToPlm,
  mapWorkshop2DossierSavedToPlm,
  serializeWorkshop2PlmBridgeEvent,
} from '@/lib/production/workshop2-plm-bridge';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

describe('workshop2-plm-bridge', () => {
  it('maps dossier save to plm.dossier.saved', () => {
    const dossier = {
      updatedAt: '2026-05-19T12:00:00.000Z',
      updatedBy: 'Технолог',
      lifecycleState: 'in_progress',
      categoryBindings: [{ categoryLeafId: 'catalog-apparel-g0-l0' }],
    } as Workshop2DossierPhase1;

    const env = mapWorkshop2DossierSavedToPlm({
      collectionId: 'col-1',
      articleId: 'art-1',
      dossier,
      version: 3,
      tzOverallPctHint: 42,
    });

    expect(env.type).toBe('plm.dossier.saved');
    expect(env.payload.collectionId).toBe('col-1');
    expect(env.payload.dossierVersion).toBe(3);
    expect(env.payload.categoryLeafId).toBe('catalog-apparel-g0-l0');
    expect(env.payload.tzOverallPctHint).toBe(42);
    expect(() => JSON.parse(serializeWorkshop2PlmBridgeEvent(env))).not.toThrow();
  });

  it('maps article update', () => {
    const env = mapWorkshop2ArticleUpdatedToPlm({
      collectionId: 'c',
      articleId: 'a',
      sku: '100001',
    });
    expect(env.type).toBe('plm.article.updated');
    expect(env.payload.sku).toBe('100001');
  });
});
