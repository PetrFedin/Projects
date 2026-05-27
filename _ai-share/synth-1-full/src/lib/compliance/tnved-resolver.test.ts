import { TNVEDResolver } from './tnved-resolver';

describe('TNVEDResolver', () => {
  it('should resolve TN VED codes based on material composition and category', () => {
    const resolver = new TNVEDResolver();
    const resultCotton = resolver.resolve({
      category: 'T-shirt',
      materialComposition: [{ material: 'Cotton', percentage: 100 }],
      targetCountry: 'RU',
    });

    expect(resultCotton.code).toBe('6109100000');
    expect(resultCotton.confidence).toBeGreaterThan(0.9);

    const resultPoly = resolver.resolve({
      category: 't-shirt',
      materialComposition: [
        { material: 'Polyester', percentage: 80 },
        { material: 'Elastane', percentage: 20 },
      ],
      targetCountry: 'RU',
    });

    expect(resultPoly.code).toBe('6109902000');
  });

  it('should return low confidence if composition is mixed and ambiguous', () => {
    const resolver = new TNVEDResolver();
    const result = resolver.resolve({
      category: 'Jacket',
      materialComposition: [
        { material: 'Wool', percentage: 30 },
        { material: 'Polyester', percentage: 30 },
        { material: 'Nylon', percentage: 40 },
      ],
      targetCountry: 'RU',
    });

    expect(result.code).toBe('UNKNOWN');
    expect(result.confidence).toBeLessThan(0.2);
  });
});
