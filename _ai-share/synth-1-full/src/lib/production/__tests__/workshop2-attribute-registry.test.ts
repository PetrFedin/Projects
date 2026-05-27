import {
  buildWorkshop2AttributeRegistryPayload,
  isWorkshop2AttributeLinkedToInfoPickMatrix,
  listUnresolvedInfoPickKeysForLeaf,
} from '@/lib/production/workshop2-attribute-registry';

describe('workshop2-attribute-registry', () => {
  it('links mat to info-pick matrix', () => {
    expect(isWorkshop2AttributeLinkedToInfoPickMatrix('mat')).toBe(true);
    expect(isWorkshop2AttributeLinkedToInfoPickMatrix('color')).toBe(false);
  });

  it('builds payload with aliases and leaf unresolved keys', () => {
    const payload = buildWorkshop2AttributeRegistryPayload({
      leafId: 'catalog-shoes-g0-l0',
      l1Name: 'Обувь',
      l2Name: 'Кроссовки и кеды',
      l3Name: 'Кроссовки',
    });
    expect(payload.leafId).toBe('catalog-shoes-g0-l0');
    expect(payload.aliases.shoeUpperMaterialOptions).toBe('mat');
    expect(Array.isArray(payload.unresolvedInfoPickKeys)).toBe(true);
  });

  it('listUnresolvedInfoPickKeysForLeaf returns only missing catalog attrs', () => {
    const unresolved = listUnresolvedInfoPickKeysForLeaf('Обувь', 'Кроссовки и кеды', 'Кроссовки');
    expect(unresolved.every((k) => typeof k === 'string')).toBe(true);
  });
});
