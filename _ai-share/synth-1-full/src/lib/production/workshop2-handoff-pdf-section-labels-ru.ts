/**
 * Wave 17 RU: канон заголовков секций handoff / TZ PDF и ZIP README (ru default).
 */
export const WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU = {
  passport: 'Паспорт',
  bom: 'BOM',
  routing: 'Маршрут',
  grading: 'Градация',
  marking: 'Маркировка',
} as const;

export type Workshop2HandoffPdfSectionKey = keyof typeof WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU;

/** Строки оглавления для cover-page handoff PDF (печать / jsPDF). */
export function buildWorkshop2HandoffPdfTocLinesRu(): string[] {
  const L = WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU;
  return [
    `1. ${L.passport}`,
    `2. ${L.bom}`,
    `3. ${L.routing}`,
    `4. ${L.grading}`,
    `5. ${L.marking}`,
  ];
}

/** Краткое описание файлов TZ bundle README (без англ. section headers). */
export function workshop2TzBundleFileLabelRu(fileKey: string): string | undefined {
  const map: Record<string, string> = {
    'routing-steps.json': `${WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU.routing} (routingSteps)`,
    'grading-table.json': `${WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU.grading} (gradingRules + sizes)`,
    'marking/gtin.txt': `${WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU.marking} · GTIN ЧЗ`,
    'dpp/passport.jsonld': `${WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU.passport} · JSON-LD DPP`,
    'tz-handoff-summary.pdf': 'Краткая PDF-сводка handoff (jsPDF)',
  };
  return map[fileKey];
}
