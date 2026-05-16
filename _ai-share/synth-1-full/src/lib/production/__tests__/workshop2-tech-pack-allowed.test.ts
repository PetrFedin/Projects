import {
  inferTechPackSourceKind,
  isTechPackFileAllowedForUpload,
} from '@/lib/production/workshop2-tech-pack-allowed';

describe('isTechPackFileAllowedForUpload', () => {
  test('blocks dangerous extension', () => {
    const f = new File([], 'setup.exe', { type: 'application/octet-stream' });
    const r = isTechPackFileAllowedForUpload(f);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/exe/i);
  });

  test('allows PDF by extension', () => {
    const f = new File([], 'sheet.pdf', { type: 'application/pdf' });
    expect(isTechPackFileAllowedForUpload(f)).toEqual({ ok: true });
  });

  test('allows STEP by fashion CAD rule', () => {
    const f = new File([], 'part.stp', { type: 'application/octet-stream' });
    expect(isTechPackFileAllowedForUpload(f)).toEqual({ ok: true });
  });

  test('rejects MIME outside allowlist', () => {
    const f = new File([], 'x.bin', { type: 'video/mp4' });
    const r = isTechPackFileAllowedForUpload(f);
    expect(r.ok).toBe(false);
  });
});

describe('inferTechPackSourceKind', () => {
  test('pdf', () => {
    expect(inferTechPackSourceKind('a.PDF', undefined)).toBe('pdf');
  });
  test('image', () => {
    expect(inferTechPackSourceKind('x.png', 'image/png')).toBe('image');
  });
  test('archive', () => {
    expect(inferTechPackSourceKind('a.aama', undefined)).toBe('archive');
  });
  test('cad', () => {
    expect(inferTechPackSourceKind('c.dxf', undefined)).toBe('cad');
  });
});
