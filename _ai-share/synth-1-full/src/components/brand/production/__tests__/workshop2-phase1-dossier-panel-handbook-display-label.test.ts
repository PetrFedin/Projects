import { resolvedHandbookDisplayLabel } from '../workshop2-phase1-dossier-panel-handbook-display-label';

jest.mock('@/lib/production/attribute-catalog', () => ({
  getAttributeById: jest.fn(() => undefined),
}));

describe('resolvedHandbookDisplayLabel', () => {
  it('returns em dash when parameterId missing and no stored label', () => {
    expect(resolvedHandbookDisplayLabel('season', undefined, undefined)).toBe('—');
    expect(resolvedHandbookDisplayLabel('season', undefined, '   ')).toBe('—');
  });

  it('returns stored when parameterId missing but stored present', () => {
    expect(resolvedHandbookDisplayLabel('season', undefined, '  x  ')).toBe('x');
  });

  it('falls back to parameterId when no catalog and no stored', () => {
    expect(resolvedHandbookDisplayLabel(undefined, 'pid-1', '')).toBe('pid-1');
  });

  it('returns trimmed stored when no catalog match for generic id', () => {
    expect(resolvedHandbookDisplayLabel('other', 'p', '  saved  ')).toBe('saved');
  });
});
