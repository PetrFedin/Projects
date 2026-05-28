import { shouldShowRunwayStickyBar } from '../runway-sticky-visibility';

describe('runway sticky bar visibility', () => {
  it('скрыт, если runway не включён', () => {
    expect(
      shouldShowRunwayStickyBar({
        enabled: false,
        switcherBottom: 0,
        detailsTop: 400,
        viewportHeight: 800,
      })
    ).toBe(false);
  });

  it('виден после прокрутки мимо switcher к блоку details', () => {
    expect(
      shouldShowRunwayStickyBar({
        enabled: true,
        switcherBottom: 40,
        detailsTop: 500,
        viewportHeight: 900,
      })
    ).toBe(true);
  });

  it('скрыт, пока switcher ещё в viewport', () => {
    expect(
      shouldShowRunwayStickyBar({
        enabled: true,
        switcherBottom: 200,
        detailsTop: 500,
        viewportHeight: 900,
      })
    ).toBe(false);
  });
});
