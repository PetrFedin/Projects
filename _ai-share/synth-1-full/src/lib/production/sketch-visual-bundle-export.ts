import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { W2SketchExportSurface } from '@/lib/production/workshop2-dossier-view-infrastructure';
import { buildSketchQrDataUrl } from '@/lib/production/sketch-qr-infra';
import { normalizeSketchSheets } from '@/lib/production/workshop2-sketch-sheets';
import { filterSketchAnnotationsForExportSurface } from '@/lib/production/workshop2-sketch-export-annotation-filter';
import {
  renderSketchBoardToPngBlob,
  type SketchBoardExportAnnotation,
} from '@/lib/production/sketch-board-png-export';

function toExportAnnotations(
  anns: Parameters<typeof filterSketchAnnotationsForExportSurface>[0],
  leafId: string,
  surface: W2SketchExportSurface
): SketchBoardExportAnnotation[] {
  const list = filterSketchAnnotationsForExportSurface(anns, leafId, surface);
  return list.map((a, index) => ({
    xPct: a.xPct,
    yPct: a.yPct,
    priority: a.priority,
    stage: a.stage,
    index,
  }));
}

function sanitizeFilePart(s: string): string {
  return s.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]+/g, '-').slice(0, 48) || 'article';
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ''));
    r.onerror = () => reject(new Error('read'));
    r.readAsDataURL(blob);
  });
}

/**
 * ZIP с PNG по общему скетчу и всем листам + PDF «паспорт визуала» (страница на доску, QR на карточку при переданном URL).
 */
export async function exportSketchVisualBundle(opts: {
  dossier: Workshop2DossierPhase1;
  leafId: string;
  pathLabel: string;
  articleSku: string;
  articlePageUrl?: string;
  /** По умолчанию цех: все метки; merch_clean — без тех/QC на кружках. */
  exportSurface?: W2SketchExportSurface;
}): Promise<void> {
  const {
    dossier,
    leafId,
    pathLabel,
    articleSku,
    articlePageUrl,
    exportSurface = 'workshop_floor',
  } = opts;
  const zip = new JSZip();
  const sheets = normalizeSketchSheets(dossier.sketchSheets);

  const masterAnns = dossier.categorySketchAnnotations ?? [];
  const masterBlob = await renderSketchBoardToPngBlob({
    imageDataUrl: dossier.categorySketchImageDataUrl,
    annotations: toExportAnnotations(masterAnns, leafId, exportSurface),
    subtitle: `${articleSku} · Общий скетч · ${pathLabel}`,
  });
  zip.file(`01-master-${sanitizeFilePart(articleSku)}.png`, masterBlob);

  let fileIdx = 2;
  for (const sh of sheets) {
    const blob = await renderSketchBoardToPngBlob({
      imageDataUrl: sh.imageDataUrl,
      annotations: toExportAnnotations(sh.annotations, leafId, exportSurface),
      subtitle: `${articleSku} · ${sh.title ?? sh.sheetId.slice(0, 8)} · ${pathLabel}`,
    });
    zip.file(
      `${String(fileIdx).padStart(2, '0')}-sheet-${sanitizeFilePart(sh.title ?? sh.sheetId)}.png`,
      blob
    );
    fileIdx++;
  }

  const qrDataUrl = articlePageUrl?.trim()
    ? await buildSketchQrDataUrl(articlePageUrl.trim())
    : null;

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const imgW = pageW - margin * 2;
  const imgH = Math.min(pageH - margin * 2 - 14, (imgW * 3) / 4);

  const slides: { blob: Blob; caption: string }[] = [
    { blob: masterBlob, caption: `Общий скетч · ${articleSku}` },
  ];
  for (const sh of sheets) {
    const b = await renderSketchBoardToPngBlob({
      imageDataUrl: sh.imageDataUrl,
      annotations: toExportAnnotations(sh.annotations, leafId, exportSurface),
      subtitle: `${articleSku} · ${sh.title ?? 'лист'}`,
    });
    slides.push({
      blob: b,
      caption: `Лист: ${sh.title ?? sh.sheetId.slice(0, 8)} · ${articleSku}`,
    });
  }

  for (let i = 0; i < slides.length; i++) {
    if (i > 0) pdf.addPage();
    const { blob, caption } = slides[i]!;
    const dataUrl = await blobToDataUrl(blob);
    pdf.setFontSize(9);
    pdf.text(caption.slice(0, 100), margin, margin + 4);
    pdf.addImage(dataUrl, 'PNG', margin, margin + 8, imgW, imgH);
    if (qrDataUrl) {
      pdf.addImage(qrDataUrl, 'PNG', pageW - margin - 22, margin, 20, 20);
    } else if (articlePageUrl?.trim() && i === 0) {
      pdf.setFontSize(7);
      pdf.text(articlePageUrl.trim().slice(0, 90), margin, pageH - margin);
    }
  }

  const pdfBlob = pdf.output('blob');
  zip.file(`passport-vizual-${sanitizeFilePart(articleSku)}.pdf`, pdfBlob);

  const out = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(out);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sketch-bundle-${sanitizeFilePart(articleSku)}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Один PDF «паспорт визуала» (все доски подряд) без ZIP — быстрый handoff в переписку.
 */
export async function exportTzHandoffPdfOnly(opts: {
  dossier: Workshop2DossierPhase1;
  leafId: string;
  pathLabel: string;
  articleSku: string;
  articlePageUrl?: string;
  exportSurface?: W2SketchExportSurface;
}): Promise<void> {
  const {
    dossier,
    leafId,
    pathLabel,
    articleSku,
    articlePageUrl,
    exportSurface = 'workshop_floor',
  } = opts;
  const sheets = normalizeSketchSheets(dossier.sketchSheets);
  const masterAnns = dossier.categorySketchAnnotations ?? [];

  const masterBlob = await renderSketchBoardToPngBlob({
    imageDataUrl: dossier.categorySketchImageDataUrl,
    annotations: toExportAnnotations(masterAnns, leafId, exportSurface),
    subtitle: `${articleSku} · Общий скетч · ${pathLabel}`,
  });

  const slides: { blob: Blob; caption: string }[] = [
    { blob: masterBlob, caption: `Общий скетч · ${articleSku} · ${pathLabel}` },
  ];
  for (const sh of sheets) {
    const b = await renderSketchBoardToPngBlob({
      imageDataUrl: sh.imageDataUrl,
      annotations: toExportAnnotations(sh.annotations, leafId, exportSurface),
      subtitle: `${articleSku} · ${sh.title ?? 'лист'}`,
    });
    slides.push({
      blob: b,
      caption: `Лист: ${sh.title ?? sh.sheetId.slice(0, 8)} · ${articleSku}`,
    });
  }

  const qrDataUrl = articlePageUrl?.trim()
    ? await buildSketchQrDataUrl(articlePageUrl.trim())
    : null;

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const imgW = pageW - margin * 2;
  const imgH = Math.min(pageH - margin * 2 - 14, (imgW * 3) / 4);

  for (let i = 0; i < slides.length; i++) {
    if (i > 0) pdf.addPage();
    const { blob, caption } = slides[i]!;
    const dataUrl = await blobToDataUrl(blob);
    pdf.setFontSize(9);
    pdf.text(caption.slice(0, 120), margin, margin + 4);
    pdf.addImage(dataUrl, 'PNG', margin, margin + 8, imgW, imgH);
    if (qrDataUrl) {
      pdf.addImage(qrDataUrl, 'PNG', pageW - margin - 22, margin, 20, 20);
    } else if (articlePageUrl?.trim() && i === 0) {
      pdf.setFontSize(7);
      pdf.text(articlePageUrl.trim().slice(0, 90), margin, pageH - margin);
    }
  }

  pdf.save(`tz-handoff-vizual-${sanitizeFilePart(articleSku)}.pdf`);
}
