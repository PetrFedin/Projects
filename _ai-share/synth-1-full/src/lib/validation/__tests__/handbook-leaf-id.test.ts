import { isValidHandbookCatalogLeafId, resolveOrRejectHandbookCatalogLeafId } from '@/lib/validation/handbook-leaf-id';

describe('handbook-leaf-id validation', () => {
  it('принимает известный leaf из снимка', () => {
    expect(isValidHandbookCatalogLeafId('catalog-apparel-g0-l0')).toBe(true);
  });

  it('отклоняет мусор', () => {
    expect(isValidHandbookCatalogLeafId('not-a-real-leaf')).toBe(false);
    expect(isValidHandbookCatalogLeafId('')).toBe(false);
  });

  it('мигрирует устаревший id по алиасу таксономии (как localStorage после смены справочника)', () => {
    const r = resolveOrRejectHandbookCatalogLeafId('catalog-apparel-outerwear-palto');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.canonicalId).toBe('catalog-apparel-g0-l0');
      expect(r.leaf.l3Name).toMatch(/пальто/i);
    }
  });
});
