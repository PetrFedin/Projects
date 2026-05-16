import {
  effectiveTechPackAttachmentMime,
  inferMimeTypeForTechPackFile,
  mimeFromDataUrl,
  techPackAttachmentHasZipSourceBytes,
  techPackInlinePreviewKind,
} from '@/lib/production/workshop2-tech-pack-attachment-utils';
import { sanitizeTechPackZipStem } from '@/lib/production/workshop2-tech-pack-zip';

describe('workshop2-tech-pack-attachment-utils', () => {
  test('mimeFromDataUrl', () => {
    expect(mimeFromDataUrl('data:application/pdf;base64,xx')).toBe('application/pdf');
    expect(mimeFromDataUrl('data:image/png;base64,xx')).toBe('image/png');
  });

  test('inferMimeTypeForTechPackFile uses extension when type empty', () => {
    const f = new File([], 'pattern.pdf', { type: '' });
    expect(inferMimeTypeForTechPackFile(f)).toBe('application/pdf');
  });

  test('inferMimeTypeForTechPackFile prefers file.type', () => {
    const f = new File([], 'x.bin', { type: 'application/pdf' });
    expect(inferMimeTypeForTechPackFile(f)).toBe('application/pdf');
  });

  test('effectiveTechPackAttachmentMime from stored mimeType', () => {
    expect(
      effectiveTechPackAttachmentMime({
        attachmentId: '1',
        fileName: 'a',
        mimeType: 'application/pdf',
      })
    ).toBe('application/pdf');
  });

  test('techPackInlinePreviewKind pdf by extension', () => {
    expect(techPackInlinePreviewKind('', 'sheet.pdf')).toBe('pdf');
  });

  test('techPackInlinePreviewKind image by mime', () => {
    expect(techPackInlinePreviewKind('image/png', 'x')).toBe('image');
  });

  test('techPackAttachmentHasZipSourceBytes matches ZIP gate', () => {
    const id = 'a1';
    expect(
      techPackAttachmentHasZipSourceBytes(
        { attachmentId: id, fileName: 'x.pdf', previewDataUrl: 'data:application/pdf;base64,AA' },
        {}
      )
    ).toBe(true);
    expect(
      techPackAttachmentHasZipSourceBytes({ attachmentId: id, fileName: 'x.dxf', byteStorage: 'idb' }, {})
    ).toBe(true);
    expect(
      techPackAttachmentHasZipSourceBytes(
        { attachmentId: id, fileName: 'x.dxf', byteStorage: 'session' },
        { [id]: 'blob:https://example.test/x' }
      )
    ).toBe(true);
    expect(
      techPackAttachmentHasZipSourceBytes({ attachmentId: id, fileName: 'x.dxf', byteStorage: 'session' }, {})
    ).toBe(false);
  });
});

describe('sanitizeTechPackZipStem', () => {
  test('strips unsafe chars and caps length', () => {
    expect(sanitizeTechPackZipStem('  SKU#12 / x  ')).toBe('SKU-12-x');
  });
});
