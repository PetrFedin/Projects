/**
 * Краткий PDF-сводка TZ handoff bundle — jsPDF, RU.
 */
import { jsPDF } from 'jspdf';

const MARGIN_MM = 14;
const LINE_MM = 5.5;
const PAGE_BOTTOM_MM = 285;

function writeln(doc: jsPDF, text: string, y: number): number {
  const lines = doc.splitTextToSize(text, 210 - MARGIN_MM * 2);
  for (const line of lines) {
    if (y > PAGE_BOTTOM_MM) {
      doc.addPage();
      y = MARGIN_MM + 6;
    }
    doc.text(line, MARGIN_MM, y);
    y += LINE_MM;
  }
  return y;
}

export type Workshop2TzHandoffSummaryPdfInput = {
  collectionId: string;
  articleId: string;
  articleSku?: string;
  articleName?: string;
  version: number;
  updatedAt: string;
  tzOverallPct?: number;
  preflightScore?: number;
  tocLines: string[];
  blockingGatesRu?: string[];
};

export function buildWorkshop2TzHandoffSummaryPdfBytes(
  input: Workshop2TzHandoffSummaryPdfInput
): Uint8Array {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  let y = MARGIN_MM + 4;
  const title = input.articleName?.trim() || input.articleSku?.trim() || input.articleId;
  y = writeln(doc, `ТЗ · handoff summary · ${title}`, y);
  y += 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  y = writeln(doc, `Коллекция: ${input.collectionId} · артикул: ${input.articleId}`, y);
  y = writeln(doc, `Версия досье: v${input.version} · обновлено: ${input.updatedAt}`, y);
  if (input.tzOverallPct != null) {
    y = writeln(
      doc,
      `Готовность ТЗ: ${input.tzOverallPct}% · preflight ${input.preflightScore ?? 0}%`,
      y
    );
  }

  if (input.blockingGatesRu?.length) {
    y += 2;
    y = writeln(doc, 'Блокеры экспорта:', y);
    for (const gate of input.blockingGatesRu.slice(0, 8)) {
      y = writeln(doc, `• ${gate}`, y);
    }
  }

  y += 2;
  y = writeln(doc, 'Содержание ZIP-пакета:', y);
  for (const line of input.tocLines) {
    y = writeln(doc, `— ${line}`, y);
  }

  y += 2;
  y = writeln(
    doc,
    'Полные данные: dossier.json, readiness.json, routing-steps.json, vault/manifest.json.',
    y
  );

  const buf = doc.output('arraybuffer');
  return new Uint8Array(buf);
}
