import {
  inferMimeTypeForVisualRef,
  mimeFromDataUrl,
  VISUAL_REF_TAKEAWAY_LABELS,
  visualRefSameUser,
} from '../workshop2-phase1-dossier-panel-visual-ref-helpers';

describe('workshop2-phase1-dossier-panel-visual-ref-helpers', () => {
  it('mimeFromDataUrl parses data URL header', () => {
    expect(mimeFromDataUrl('data:image/png;base64,xxx')).toBe('image/png');
  });

  it('inferMimeTypeForVisualRef falls back to extension', () => {
    const f = new File([], 'x.webp', { type: '' });
    expect(inferMimeTypeForVisualRef(f)).toBe('image/webp');
  });

  it('visualRefSameUser is case-insensitive', () => {
    expect(visualRefSameUser(' Anna ', 'anna')).toBe(true);
  });

  it('VISUAL_REF_TAKEAWAY_LABELS covers all aspects', () => {
    expect(Object.keys(VISUAL_REF_TAKEAWAY_LABELS).length).toBe(7);
    expect(VISUAL_REF_TAKEAWAY_LABELS.color).toBe('Цвет');
  });
});
