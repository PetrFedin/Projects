import {
  collectWorkshop2B2bCartMoqViolations,
  collectWorkshop2B2bOrderLineMoqViolations,
} from '@/lib/production/workshop2-b2b-wave23-parity';

describe('workshop2 b2b MOQ checkout gate', () => {
  it('collects cart MOQ violations', () => {
    const violations = collectWorkshop2B2bCartMoqViolations({
      lines: [
        {
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          colorCode: 'BLK',
          size: 'M',
          qty: 2,
          wholesalePriceRub: 1000,
          moq: 6,
        },
      ],
    });
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain('MOQ 6');
  });

  it('allows qty at or above MOQ', () => {
    expect(
      collectWorkshop2B2bOrderLineMoqViolations([
        {
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          colorCode: 'BLK',
          size: 'M',
          qty: 6,
          wholesalePriceRub: 1000,
          moq: 6,
        },
      ])
    ).toHaveLength(0);
  });
});
