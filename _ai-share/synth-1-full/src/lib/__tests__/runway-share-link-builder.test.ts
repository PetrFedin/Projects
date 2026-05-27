import {
  buildRunwayEmailCampaignLink,
  buildRunwayShareLink,
  formatRunwayEmailCampaignSnippet,
} from '../runway/runway-share-link-builder';

describe('runway-share-link-builder', () => {
  it('buildRunwayShareLink — runway view + section + UTM', () => {
    const url = buildRunwayShareLink({
      productSlug: 'silk-midi-dress',
      sectionIndex: 2,
      origin: 'https://shop.test',
      utm: { source: 'email', medium: 'newsletter', campaign: 'ss26', content: 'section-2' },
    });
    const parsed = new URL(url);
    expect(parsed.pathname).toBe('/products/silk-midi-dress');
    expect(parsed.searchParams.get('view')).toBe('runway');
    expect(parsed.searchParams.get('section')).toBe('2');
    expect(parsed.searchParams.get('utm_source')).toBe('email');
    expect(parsed.searchParams.get('utm_campaign')).toBe('ss26');
  });

  it('buildRunwayEmailCampaignLink — шаблон newsletter', () => {
    const url = buildRunwayEmailCampaignLink(
      'silk-midi-dress',
      1,
      'runway-drop',
      'https://shop.test'
    );
    expect(url).toContain('utm_medium=newsletter');
    expect(url).toContain('utm_content=section-1');
  });

  it('formatRunwayEmailCampaignSnippet — plain text', () => {
    const text = formatRunwayEmailCampaignSnippet('Silk Midi', 'https://x.test');
    expect(text).toContain('Silk Midi');
    expect(text).toContain('https://x.test');
  });
});
