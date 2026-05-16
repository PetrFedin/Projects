import {
  parseSewingPatternPreviewBody,
  runSewingPatternPreview,
} from '@/lib/pattern-drafting/sewing-pattern-preview.request';

describe('sewing-pattern-preview.request', () => {
  it('rejects bad garment', () => {
    const r = parseSewingPatternPreviewBody({ garment: 'cape', measures: {}, darts: {} });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('invalid_garment');
  });

  it('builds bodice_front with measures', () => {
    const p = parseSewingPatternPreviewBody({
      garment: 'bodice_front',
      measures: { bust: 92, waist: 74, hip: 100, shoulder: 42, height: 172 },
      darts: { shoulderDart: true, bustSideDart: true, waistDart: true },
      watermark: false,
    });
    expect(p.ok).toBe(true);
    if (!p.ok) return;
    const res = runSewingPatternPreview(p.options, p.applyWatermark);
    expect(res.svg).toContain('<svg');
    expect(res.widthMm).toBeGreaterThan(0);
  });
});
