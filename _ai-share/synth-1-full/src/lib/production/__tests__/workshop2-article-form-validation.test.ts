/**
 * @jest-environment node
 */
import { validateWorkshop2ArticleForm } from '@/lib/production/workshop2-article-form-validation';

describe('workshop2-article-form-validation apparel audience', () => {
  it('forbids other audience for footwear leaf', () => {
    const r = validateWorkshop2ArticleForm({
      mode: 'new',
      sku: 'SS27-U-SNK-03',
      name: 'Кроссовки',
      audienceId: 'other',
      isUnisex: true,
      resolvedLeafId: 'catalog-shoes-g0-l0',
    });
    expect(r.canSubmit).toBe(false);
    expect(r.errors.some((e) => e.includes('Остальное'))).toBe(true);
  });

  it('allows men + unisex for footwear', () => {
    const r = validateWorkshop2ArticleForm({
      mode: 'new',
      sku: 'SS27-U-SNK-03',
      name: 'Кроссовки',
      audienceId: 'men',
      isUnisex: true,
      resolvedLeafId: 'catalog-shoes-g0-l0',
    });
    expect(r.canSubmit).toBe(true);
    expect(r.errors).toHaveLength(0);
  });

  it('allows other for non-apparel category', () => {
    const r = validateWorkshop2ArticleForm({
      mode: 'new',
      sku: 'SS27-X-GAD-01',
      name: 'Гаджет',
      audienceId: 'other',
      isUnisex: false,
      resolvedLeafId: 'catalog-home-g0-l0',
    });
    expect(r.errors.some((e) => e.includes('Остальное'))).toBe(false);
  });
});
