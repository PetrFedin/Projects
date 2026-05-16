import type { Workshop2Phase1TechPackAttachment } from '@/lib/production/workshop2-dossier-phase1.types';
import { buildWorkshop2TechPackZipBlob } from '@/lib/production/workshop2-tech-pack-zip';

describe('buildWorkshop2TechPackZipBlob', () => {
  const origFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith('data:')) {
        return {
          ok: true,
          blob: async () => new Blob([new Uint8Array([1, 2, 3])], { type: 'application/octet-stream' }),
        } as Response;
      }
      throw new Error(`unexpected fetch url: ${url}`);
    }) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = origFetch;
  });

  test('includes data URL attachment', async () => {
    const attachments: Workshop2Phase1TechPackAttachment[] = [
      {
        attachmentId: 'id1',
        fileName: 'one.pdf',
        mimeType: 'application/pdf',
        byteStorage: 'dataurl',
        previewDataUrl: 'data:application/pdf;base64,AA==',
      },
    ];
    const r = await buildWorkshop2TechPackZipBlob({
      attachments,
      sessionBlobById: {},
    });
    expect(r.included).toBe(1);
    expect(r.skippedByFilter).toBe(0);
    expect(r.blob).toBeInstanceOf(Blob);
  });

  test('reads session blob URL', async () => {
    const attachments: Workshop2Phase1TechPackAttachment[] = [
      {
        attachmentId: 'id1',
        fileName: 'two.pdf',
        mimeType: 'application/pdf',
        byteStorage: 'session',
      },
    ];
    const r = await buildWorkshop2TechPackZipBlob({
      attachments,
      sessionBlobById: { id1: 'data:application/pdf;base64,AA==' },
    });
    expect(r.included).toBe(1);
  });

  test('uses getIdbBlob for idb storage', async () => {
    const attachments: Workshop2Phase1TechPackAttachment[] = [
      {
        attachmentId: 'idb1',
        fileName: 'cad.dxf',
        byteStorage: 'idb',
      },
    ];
    const r = await buildWorkshop2TechPackZipBlob({
      attachments,
      sessionBlobById: {},
      getIdbBlob: async (id) => (id === 'idb1' ? new Blob(['x']) : undefined),
    });
    expect(r.included).toBe(1);
  });

  test('excludeZipExtensions skips nested zips', async () => {
    const attachments: Workshop2Phase1TechPackAttachment[] = [
      {
        attachmentId: 'a',
        fileName: 'nested.zip',
        byteStorage: 'dataurl',
        previewDataUrl: 'data:application/zip;base64,AA==',
      },
      {
        attachmentId: 'b',
        fileName: 'ok.pdf',
        byteStorage: 'dataurl',
        previewDataUrl: 'data:application/pdf;base64,AA==',
      },
    ];
    const r = await buildWorkshop2TechPackZipBlob({
      attachments,
      sessionBlobById: {},
      excludeZipExtensions: true,
    });
    expect(r.included).toBe(1);
    expect(r.skippedByFilter).toBe(1);
  });

  test('throws all_filtered when every row filtered', async () => {
    const attachments: Workshop2Phase1TechPackAttachment[] = [
      { attachmentId: 'x', fileName: 'a.pdf', byteStorage: 'dataurl', previewDataUrl: 'data:application/pdf;base64,AA==' },
    ];
    await expect(
      buildWorkshop2TechPackZipBlob({
        attachments,
        sessionBlobById: {},
        includeAttachment: () => false,
      })
    ).rejects.toMatchObject({ name: 'TechPackZipError', message: 'all_filtered' });
  });

  test('throws all_filtered when only zip and excludeZipExtensions', async () => {
    const attachments: Workshop2Phase1TechPackAttachment[] = [
      { attachmentId: 'z', fileName: 'only.zip', byteStorage: 'dataurl', previewDataUrl: 'data:application/zip;base64,AA==' },
    ];
    await expect(
      buildWorkshop2TechPackZipBlob({
        attachments,
        sessionBlobById: {},
        excludeZipExtensions: true,
      })
    ).rejects.toMatchObject({ name: 'TechPackZipError', message: 'all_filtered' });
  });

  test('throws no_bytes when no retrievable bytes', async () => {
    const attachments: Workshop2Phase1TechPackAttachment[] = [
      { attachmentId: 'n', fileName: 'missing.pdf', byteStorage: 'session' },
    ];
    await expect(
      buildWorkshop2TechPackZipBlob({ attachments, sessionBlobById: {} })
    ).rejects.toMatchObject({ name: 'TechPackZipError', message: 'no_bytes' });
  });
});
