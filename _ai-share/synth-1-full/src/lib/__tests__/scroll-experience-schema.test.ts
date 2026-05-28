import {
  normalizeScrollExperienceConfig,
  SCROLL_EXPERIENCE_V3_DEFAULTS,
  validateScrollExperienceRaw,
} from '../runway/scroll-experience-schema';

describe('scroll-experience-schema v3', () => {
  it('normalizeScrollExperienceConfig — v3 features из nested object', () => {
    const config = normalizeScrollExperienceConfig({
      version: 3,
      features: {
        autoTour: true,
        comparePeek: true,
        kenBurns: false,
        searchHoverPreview: true,
        socialProof: true,
      },
    });

    expect(config.version).toBe(3);
    expect(config.features?.autoTour).toBe(true);
    expect(config.enableAutoTour).toBe(true);
    expect(config.enableComparePeek).toBe(true);
    expect(config.enableKenBurns).toBe(false);
    expect(config.enableSearchHoverPreview).toBe(true);
    expect(config.showSocialProof).toBe(true);
  });

  it('normalizeScrollExperienceConfig — v2 flat flags мигрируют в features', () => {
    const config = normalizeScrollExperienceConfig({
      enableAutoTour: true,
      enableComparePeek: false,
      showSocialProof: true,
      enableKenBurns: true,
    });

    expect(config.features?.autoTour).toBe(true);
    expect(config.features?.comparePeek).toBe(false);
    expect(config.features?.socialProof).toBe(true);
    expect(config.features?.kenBurns).toBe(true);
  });

  it('normalizeScrollExperienceConfig — defaults.sectionColors из legacy полей', () => {
    const config = normalizeScrollExperienceConfig({
      defaultSectionColors: ['#111', '#222', '#333'],
      defaultSectionLabels: ['A', 'B', 'C'],
    });

    expect(config.defaults?.sectionColors).toEqual(['#111', '#222', '#333']);
    expect(config.defaultSectionLabels).toEqual(['A', 'B', 'C']);
  });

  it('normalizeScrollExperienceConfig — invalid JSON → fallback', () => {
    const config = normalizeScrollExperienceConfig(null);
    expect(config.featuredProductSlug).toBe(SCROLL_EXPERIENCE_V3_DEFAULTS.featuredProductSlug);
  });

  it('validateScrollExperienceRaw — пустой объект без ошибок', () => {
    expect(validateScrollExperienceRaw({})).toEqual([]);
  });

  it('enableUserOptions сохраняется при normalize', () => {
    const config = normalizeScrollExperienceConfig({ enableUserOptions: true });
    expect(config.enableUserOptions).toBe(true);
  });

  it('videoCdnBaseUrl и abTestRunwayDefault сохраняются при normalize', () => {
    const config = normalizeScrollExperienceConfig({
      videoCdnBaseUrl: 'https://cdn.test',
      abTestRunwayDefault: true,
    });
    expect(config.videoCdnBaseUrl).toBe('https://cdn.test');
    expect(config.abTestRunwayDefault).toBe(true);
  });

  it('layout, heroProductSlugs и runwayBadgeHeroOnly сохраняются при normalize', () => {
    const config = normalizeScrollExperienceConfig({
      layout: 'minimal',
      heroProductSlugs: ['silk-midi-dress', 'cashmere-crewneck-sweater'],
      runwayBadgeHeroOnly: true,
    });
    expect(config.layout).toBe('minimal');
    expect(config.heroProductSlugs).toEqual(['silk-midi-dress', 'cashmere-crewneck-sweater']);
    expect(config.runwayBadgeHeroOnly).toBe(true);
  });

  it('heroScrollVideoSlugs alias maps to heroProductSlugs', () => {
    const config = normalizeScrollExperienceConfig({
      heroScrollVideoSlugs: ['hero-a', 'hero-b'],
    });
    expect(config.heroProductSlugs).toEqual(['hero-a', 'hero-b']);
  });

  it('abTestFlagshipSlugs сохраняется при normalize', () => {
    const config = normalizeScrollExperienceConfig({
      abTestFlagshipSlugs: ['silk-midi-dress'],
    });
    expect(config.abTestFlagshipSlugs).toEqual(['silk-midi-dress']);
  });

  it('featuredMode и badgeShimmer сохраняются при normalize', () => {
    const config = normalizeScrollExperienceConfig({
      featuredMode: 'compact',
      badgeShimmer: false,
    });
    expect(config.featuredMode).toBe('compact');
    expect(config.badgeShimmer).toBe(false);
  });
});
