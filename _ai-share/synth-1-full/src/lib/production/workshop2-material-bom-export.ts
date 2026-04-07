/**
 * Текстовый экспорт BOM для цеха / закупа (без API — буфер обмена и файл).
 */

export type MaterialBomExportInput = {
  sku: string;
  productName: string;
  l2Name: string;
  /** Этап мастера ТЗ (для цеха/закупа в выгрузке). */
  tzPhase?: '1' | '2' | '3';
  /** Строки основного материала из справочника (подписи). */
  matLines: string[];
  /** Состав: доли % */
  composition: { label: string; pct: number }[];
  linkedComposition: boolean;
};

export function formatMaterialBomPlainText(input: MaterialBomExportInput): string {
  const lines: string[] = [
    `SKU: ${input.sku}`,
    `Изделие: ${input.productName}`,
    `Категория (L2): ${input.l2Name}`,
    ...(input.tzPhase ? [`Этап ТЗ: ${input.tzPhase}`] : []),
    '',
    '--- Основной материал (справочник) ---',
  ];
  if (input.matLines.length === 0) lines.push('(не выбрано)');
  else input.matLines.forEach((l) => lines.push(`- ${l}`));

  lines.push('', '--- Состав ---');
  if (!input.linkedComposition) {
    lines.push('(состав не связан с mat — только строки материала выше)');
  } else if (input.composition.length === 0) {
    lines.push('(пусто)');
  } else {
    const sum = input.composition.reduce((s, r) => s + r.pct, 0);
    for (const r of input.composition) {
      lines.push(`- ${r.label}: ${r.pct}%`);
    }
    lines.push(`Итого: ${sum}%`);
  }

  lines.push('', `Экспорт из Synth-1 Workshop2 · ${new Date().toISOString()}`);
  return lines.join('\n');
}

export function formatMaterialBomTsv(input: MaterialBomExportInput): string {
  const esc = (s: string) => String(s).replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
  const rows: string[][] = [['section', 'key', 'value']];
  rows.push(['meta', 'sku', esc(input.sku)]);
  rows.push(['meta', 'product', esc(input.productName)]);
  rows.push(['meta', 'l2', esc(input.l2Name)]);
  if (input.tzPhase) rows.push(['meta', 'tz_phase', input.tzPhase]);
  input.matLines.forEach((l, i) => rows.push(['mat', `line_${i + 1}`, esc(l)]));
  if (input.linkedComposition) {
    input.composition.forEach((r, i) => {
      rows.push(['composition', `row_${i + 1}_label`, esc(r.label)]);
      rows.push(['composition', `row_${i + 1}_pct`, String(r.pct)]);
    });
  } else {
    rows.push(['composition', 'linked', '0']);
  }
  return rows.map((r) => r.join('\t')).join('\n');
}
