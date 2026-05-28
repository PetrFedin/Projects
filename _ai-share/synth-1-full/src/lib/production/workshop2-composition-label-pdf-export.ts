import { jsPDF } from 'jspdf';
import type { Workshop2CompositionLabelSpec } from '@/lib/production/workshop2-dossier-phase1.types';
import { compositionLabelPdfLineStepMm } from '@/lib/production/workshop2-composition-label-typography-style';

function parseMm(v: string | undefined, fallback: number): number {
  const n = Number(
    String(v ?? '')
      .replace(',', '.')
      .trim()
  );
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function imageFormatFromDataUrl(dataUrl: string): 'PNG' | 'JPEG' | null {
  if (dataUrl.includes('image/jpeg') || dataUrl.includes('image/jpg')) return 'JPEG';
  if (dataUrl.includes('image/png')) return 'PNG';
  return null;
}

function buildCompositionLabelDraftPdfDoc(opts: {
  spec: Workshop2CompositionLabelSpec;
  lines: string[];
}): jsPDF {
  const s = opts.spec;
  const wMm = parseMm(s.labelWidthMm, 30);
  const hMm = parseMm(s.labelHeightMm, 70);
  const doc = new jsPDF({
    unit: 'mm',
    format: [wMm, hMm],
    orientation: 'portrait',
  });
  const pageW = wMm;
  const pageH = hMm;
  const margin = 1.8;
  let y = margin;
  const logo = (s.compositionLabelLogoDataUrl ?? '').trim();
  if (logo.startsWith('data:image')) {
    try {
      const fmt = imageFormatFromDataUrl(logo);
      if (fmt) {
        const logoH = Math.min(8, pageH * 0.12);
        const logoW = Math.min(pageW - 2 * margin, logoH * 3);
        doc.addImage(logo, fmt, margin, y, logoW, logoH);
        y += logoH + 1.2;
      }
    } catch {
      y += 0.5;
    }
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  const usableW = pageW - 2 * margin;
  const lineStep = compositionLabelPdfLineStepMm(s);
  for (const raw of opts.lines) {
    const line = raw.replace(/\s+/g, ' ').trim();
    if (!line) continue;
    if (y > pageH - margin - 2) break;
    const parts = doc.splitTextToSize(line, usableW);
    doc.text(parts, margin, y + lineStep * 0.35);
    y += parts.length * lineStep;
  }
  return doc;
}

/** Серверный/zip экспорт: PDF-буфер без download в браузере. */
export function buildCompositionLabelDraftPdfBuffer(opts: {
  spec: Workshop2CompositionLabelSpec;
  lines: string[];
  fileBase: string;
}): Buffer {
  const doc = buildCompositionLabelDraftPdfDoc({ spec: opts.spec, lines: opts.lines });
  const arrayBuffer = doc.output('arraybuffer') as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}

/**
 * Черновик бирки в PDF с физическими мм (для типографии / согласования).
 * Вектор текста; растровый логотип — если data URL читается движком.
 */
export function downloadCompositionLabelDraftPdf(opts: {
  spec: Workshop2CompositionLabelSpec;
  lines: string[];
  fileBase: string;
}): void {
  const doc = buildCompositionLabelDraftPdfDoc({ spec: opts.spec, lines: opts.lines });
  const safe = opts.fileBase.replace(/[^\wа-яА-ЯёЁ.-]+/g, '-').slice(0, 56) || 'composition-label';
  doc.save(`${safe}-label-draft.pdf`);
}
