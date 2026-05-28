import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';
import { buildSketchQrDataUrl } from '@/lib/production/sketch-qr-infra';

/** Печать А4: крупные номера, подложка при наличии, QR локально (без внешнего API). */
export async function openSketchA4Print(opts: {
  title: string;
  sku: string;
  pathLabel: string;
  imageDataUrl?: string;
  annotations: Workshop2Phase1CategorySketchAnnotation[];
  leafId: string;
  pageUrl?: string;
  /** Сцена + вид листа для подписи на печати. */
  sceneCaption?: string;
}): Promise<void> {
  const own = opts.annotations.filter((a) => a.categoryLeafId === opts.leafId);
  const qrSrc = opts.pageUrl?.trim()
    ? ((await buildSketchQrDataUrl(opts.pageUrl.trim())) ?? '')
    : '';

  const pinsHtml = own
    .map((a, idx) => {
      const cls = a.priority === 'critical' ? 'critical' : a.stage === 'qc' ? 'qc' : 'norm';
      return `<div class="pin ${cls}" style="left:${a.xPct}%;top:${a.yPct}%"><span>${idx + 1}</span></div>`;
    })
    .join('');

  const bgStyle = opts.imageDataUrl
    ? `background-image:url(${opts.imageDataUrl});background-size:contain;background-position:center;background-repeat:no-repeat;background-color:#fff;`
    : 'background:#e2e8f0;';

  const sceneMeta = opts.sceneCaption?.trim()
    ? `<div><strong>Сцена / вид</strong> ${escapeHtml(opts.sceneCaption.trim())}</div>`
    : '';

  const html = `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"/><title>${escapeHtml(opts.title)}</title>
<style>
@page { size: A4 landscape; margin: 14mm 16mm; }
body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #111827; background: #fff; font-size: 10pt; line-height: 1.35; }
.sheet { max-width: 280mm; margin: 0 auto; border-top: 3pt solid #111827; padding-top: 10pt; }
.brand-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 16pt; margin-bottom: 10pt; padding-bottom: 8pt; border-bottom: 0.5pt solid #9ca3af; }
.brand-mark { font-size: 8pt; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #374151; }
.doc-title { font-size: 13pt; font-weight: 700; letter-spacing: -0.02em; margin: 0; color: #111827; }
.meta-grid { font-size: 9pt; color: #374151; text-align: right; }
.meta-grid div { margin: 0 0 2pt; }
.board-wrap { position: relative; width: 100%; aspect-ratio: 4/3; border: 0.75pt solid #111827; overflow: hidden; background: #f3f4f6; ${bgStyle} }
.pin { position: absolute; width: 28pt; height: 28pt; margin-left: -14pt; margin-top: -14pt; border-radius: 50%; border: 1.5pt solid #fff; box-shadow: 0 1pt 3pt rgba(0,0,0,.15); display: flex; align-items: center; justify-content: center; background: #f9fafb; color: #111827; font-family: ui-monospace, "Cascadia Mono", monospace; font-weight: 700; font-size: 11pt; letter-spacing: -0.03em; }
.pin.critical { box-shadow: 0 0 0 2pt #be123c; }
.pin.qc { box-shadow: 0 0 0 2pt #b45309; }
.pin.norm { box-shadow: 0 0 0 1.5pt #6b7280; }
.qr { width: 56pt; height: 56pt; flex-shrink: 0; border: 0.5pt solid #d1d5db; padding: 2pt; }
footer { margin-top: 8pt; font-size: 8pt; color: #6b7280; word-break: break-all; border-top: 0.5pt solid #e5e7eb; padding-top: 6pt; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>
<div class="sheet">
<div class="brand-row">
  <div>
    <p class="brand-mark">Технический лист · скетч с метками</p>
    <h1 class="doc-title">${escapeHtml(opts.title)}</h1>
  </div>
  <div class="meta-grid">
    <div><strong>SKU</strong> ${escapeHtml(opts.sku)}</div>
    <div>${escapeHtml(opts.pathLabel)}</div>
    ${sceneMeta}
    ${qrSrc ? `<img class="qr" src="${escapeAttr(qrSrc)}" alt=""/>` : ''}
  </div>
</div>
<div class="board-wrap">${pinsHtml}</div>
${opts.pageUrl?.trim() ? `<footer>Электронная ссылка: ${escapeHtml(opts.pageUrl.trim())}</footer>` : ''}
</div>
<script>window.onload=function(){window.print();};</script>
</body></html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, '&#39;');
}
