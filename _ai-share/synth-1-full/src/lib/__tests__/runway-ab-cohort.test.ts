import {
  resolveAbTestEnabledForProduct,
  resolveDefaultPdpMediaView,
  resolveRunwayAbCohort,
} from '../runway/runway-ab-cohort';

describe('runway-ab-cohort — silk-midi-dress flagship', () => {
  it('abTestFlagshipSlugs включает A/B только для silk-midi-dress', () => {
    expect(
      resolveAbTestEnabledForProduct({
        abTestRunwayDefault: false,
        abTestFlagshipSlugs: ['silk-midi-dress'],
        productSlug: 'silk-midi-dress',
      })
    ).toBe(true);
    expect(
      resolveAbTestEnabledForProduct({
        abTestRunwayDefault: false,
        abTestFlagshipSlugs: ['silk-midi-dress'],
        productSlug: 'cashmere-crewneck-sweater',
      })
    ).toBe(false);
  });

  it('resolveDefaultPdpMediaView для silk-midi-dress — cohort runway|standard', () => {
    const visitorKey = 'silk-flagship-ab-visitor-42';
    const cohort = resolveRunwayAbCohort(visitorKey);
    const view = resolveDefaultPdpMediaView({
      hasScrollVideoMode: true,
      abTestRunwayDefault: false,
      abTestFlagshipSlugs: ['silk-midi-dress'],
      productSlug: 'silk-midi-dress',
      urlView: null,
      visitorKey,
    });
    expect(['runway', 'standard']).toContain(view);
    if (cohort === 'runway-first') expect(view).toBe('runway');
    if (cohort === 'standard-first') expect(view).toBe('standard');
  });

  it('non-flagship SKU без A/B — runway по умолчанию', () => {
    expect(
      resolveDefaultPdpMediaView({
        hasScrollVideoMode: true,
        abTestFlagshipSlugs: ['silk-midi-dress'],
        productSlug: 'other-product',
        urlView: null,
      })
    ).toBe('runway');
  });
});
