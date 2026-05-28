/**
 * Сжатое превью изображения (JPEG data URL) для списка — без тянуть multi‑MB data URL.
 * PDF: первая страница через pdfjs (ленивый import).
 */
const MAX_THUMB = 200;
const THUMB_JPEG = 0.82;

export async function makeJpegThumbnailDataUrl(
  file: File,
  maxSide = MAX_THUMB
): Promise<string | undefined> {
  const t = (file.type || '').toLowerCase();
  if (!t.startsWith('image/') || t === 'image/svg+xml') return undefined;
  return new Promise((resolve) => {
    const img = new Image();
    const u = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(u);
      try {
        const w0 = img.naturalWidth;
        const h0 = img.naturalHeight;
        if (!w0 || !h0) {
          resolve(undefined);
          return;
        }
        const scale = Math.min(1, maxSide / Math.max(w0, h0));
        const w = Math.max(1, Math.round(w0 * scale));
        const h = Math.max(1, Math.round(h0 * scale));
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        if (!ctx) {
          resolve(undefined);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const d = c.toDataURL('image/jpeg', THUMB_JPEG);
        resolve(d.length < 120_000 ? d : c.toDataURL('image/jpeg', 0.65));
      } catch {
        resolve(undefined);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(u);
      resolve(undefined);
    };
    img.src = u;
  });
}

/**
 * Миниатюра первой страницы PDF (клиент). Worker — CDN unpkg, тот же major что и pdfjs-dist в package.json.
 */
export async function makePdfFirstPageJpegDataUrl(
  file: File,
  maxSide = MAX_THUMB
): Promise<string | undefined> {
  const isPdf = (file.type || '').toLowerCase().includes('pdf') || /\.pdf$/i.test(file.name);
  if (!isPdf) return undefined;
  try {
    const pdfjs = await import('pdfjs-dist');
    const v = (pdfjs as { version?: string }).version ?? '4.10.38';
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${v}/build/pdf.worker.mjs`;
    const data = new Uint8Array(await file.arrayBuffer());
    const doc = await pdfjs.getDocument({ data } as { data: Uint8Array }).promise;
    const page = await doc.getPage(1);
    const v1 = page.getViewport({ scale: 1 });
    const scale = maxSide / Math.max(v1.width, v1.height);
    const vp = page.getViewport({ scale: Math.min(scale, 1.5) });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(vp.width);
    canvas.height = Math.ceil(vp.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    await page.render({ canvasContext: ctx, viewport: vp, canvas } as any).promise;
    const d = canvas.toDataURL('image/jpeg', THUMB_JPEG);
    return d.length < 120_000 ? d : canvas.toDataURL('image/jpeg', 0.65);
  } catch {
    return undefined;
  }
}
