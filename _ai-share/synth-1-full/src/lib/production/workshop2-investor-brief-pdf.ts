/**
 * Investor brief PDF — jsPDF, RU; данные из buildWorkshop2InvestorDemoBrief().
 */
import { jsPDF } from 'jspdf';
import type { Workshop2InvestorDemoBrief } from '@/lib/production/workshop2-investor-demo-brief';

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

export function buildWorkshop2InvestorBriefPdfBytes(brief: Workshop2InvestorDemoBrief): Uint8Array {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  let y = MARGIN_MM + 4;
  y = writeln(doc, brief.labelRu || 'Investor brief · Platform Core', y);
  y += 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  y = writeln(doc, `Сгенерировано: ${brief.generatedAt}`, y);
  y = writeln(
    doc,
    `Demo-ready: ${brief.investorDemoReady ? 'да' : 'нет'} · parity ${brief.parityNativePct}% · ключи ${brief.keysConfiguredCount}/${brief.keysTotal}`,
    y
  );
  y = writeln(
    doc,
    `Unit tests: ${brief.unitTests.passing ? 'green' : 'fail'} · probes w54–w58: ${brief.probes.wave54}/${brief.probes.wave55}/${brief.probes.wave56}/${brief.probes.wave57}/${brief.probes.wave58}`,
    y
  );

  if (brief.blockingGatesRu.length) {
    y += 2;
    y = writeln(doc, 'Блокеры:', y);
    for (const gate of brief.blockingGatesRu) y = writeln(doc, `• ${gate}`, y);
  }
  if (brief.warningsRu.length) {
    y += 2;
    y = writeln(doc, 'Предупреждения:', y);
    for (const w of brief.warningsRu) y = writeln(doc, `• ${w}`, y);
  }

  y += 2;
  y = writeln(doc, 'Golden paths:', y);
  for (const path of brief.demoPaths) {
    y = writeln(doc, `• ${path.labelRu} — ${path.path}`, y);
  }

  if (brief.presentationTipsRu.length) {
    y += 2;
    y = writeln(doc, 'Ключевые тезисы:', y);
    for (const tip of brief.presentationTipsRu.slice(0, 6)) y = writeln(doc, `— ${tip}`, y);
  }

  const buf = doc.output('arraybuffer');
  return new Uint8Array(buf);
}
