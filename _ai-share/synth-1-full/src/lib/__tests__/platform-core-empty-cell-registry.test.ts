import { hasEmptyCellInsightPanel } from '@/lib/platform-core-empty-cell-registry';

describe('platform-core-empty-cell-registry', () => {
  it('includes supplier collection_order and sample_collection insight panels', () => {
    expect(hasEmptyCellInsightPanel('supplier', 'collection_order')).toBe(true);
    expect(hasEmptyCellInsightPanel('supplier', 'sample_collection')).toBe(true);
  });
});
