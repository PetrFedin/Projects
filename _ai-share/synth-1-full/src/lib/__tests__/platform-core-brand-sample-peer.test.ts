import {
  brandDevelopmentSamplePeerHref,
  brandDevelopmentSamplePeerLabelLong,
  brandDevelopmentSamplePeerLabelShort,
} from '@/lib/platform-core-brand-sample-peer';

describe('platform-core-brand-sample-peer', () => {
  it('draft sample → W2 plan pane, not factory queue', () => {
    const href = brandDevelopmentSamplePeerHref('SS27', 'ART-1', { sampleStatus: 'draft' });
    expect(href).toContain('/brand/production/workshop2/c/SS27/a/ART-1');
    expect(href).toContain('w2pane=sample');
    expect(href).not.toContain('/factory/production');
    expect(brandDevelopmentSamplePeerLabelShort({ sampleStatus: 'draft' })).toBe('Образец в цех');
  });

  it('sent sample → factory dossier read-only peer', () => {
    const href = brandDevelopmentSamplePeerHref('SS27', 'ART-1', { sampleStatus: 'sent' });
    expect(href).toBe('/factory/production/dossier/ART-1?collection=SS27');
    expect(brandDevelopmentSamplePeerLabelLong({ sampleStatus: 'in_progress' })).toBe(
      'Статус образца в цехе →'
    );
  });
});
