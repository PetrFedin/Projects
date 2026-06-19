import type { SupplySnapshot } from '@/lib/production/article-workspace/types';

export type Workshop2RiskFormulaInput = {
  key: string;
  labelRu: string;
  value: string;
};

export type SupplyRiskPrediction = {
  predictedDays: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  rationale: string;
  risks: string[];
  inputsUsed?: string[];
  formulaInputs?: Workshop2RiskFormulaInput[];
};

/** MVP: прогноз рисков из BOM и сроков поставки (эвристика, не ML). */
export function computeSupplyRiskPrediction(lines: SupplySnapshot['lines']): SupplyRiskPrediction {
  if (lines.length === 0) {
    return {
      predictedDays: 21,
      riskLevel: 'High',
      rationale: 'BOM пуст — невозможно спланировать закупку под сэмпл.',
      risks: [
        'Загрузите материалы из ТЗ или добавьте строки вручную',
        'Без BOM нельзя подтвердить сроки для календаря T&A',
      ],
      inputsUsed: ['BOM: 0 строк'],
      formulaInputs: [
        { key: 'bom_lines', labelRu: 'Строк BOM', value: '0' },
        { key: 'predicted_days', labelRu: 'Прогноз (дн.)', value: '21 (константа пустого BOM)' },
      ],
    };
  }

  const risks: string[] = [];
  const longLead = lines.filter((l) => (l.leadTimeDays ?? 0) > 14);
  const drafts = lines.filter((l) => l.status === 'draft');
  const noQty = lines.filter((l) => !l.qty || l.qty <= 0);

  for (const l of longLead.slice(0, 3)) {
    risks.push(`Долгий срок поставки (${l.leadTimeDays} дн.): ${l.label}`);
  }
  if (drafts.length > 0) {
    risks.push(`${drafts.length} поз. BOM ещё в черновике — уточните поставщика`);
  }
  if (noQty.length > 0) {
    risks.push(
      `Не задано количество: ${noQty
        .map((l) => l.label)
        .slice(0, 2)
        .join(', ')}`
    );
  }
  if (risks.length === 0) {
    risks.push('Критичных отклонений по BOM не выявлено');
  }

  const maxLead = Math.max(0, ...lines.map((l) => l.leadTimeDays ?? 0));
  const predictedDays = maxLead > 0 ? maxLead + 5 : 12;

  let riskLevel: SupplyRiskPrediction['riskLevel'] = 'Low';
  if (longLead.length > 0 || drafts.length === lines.length) riskLevel = 'Medium';
  if (lines.length === 0 || longLead.length >= 2) riskLevel = 'High';

  const rationale =
    longLead.length > 0
      ? `Учтён максимальный lead time ${maxLead} дн. и буфер на раскрой/пошив.`
      : drafts.length > 0
        ? 'Есть неподтверждённые позиции BOM — заложен запас по срокам.'
        : 'Сроки закупки в пределах нормы для сэмпла.';

  const inputsUsed = [
    `BOM: ${lines.length} строк`,
    `max lead time: ${maxLead} дн.`,
    `долгий срок (>14 д): ${longLead.length}`,
    `черновики: ${drafts.length}`,
    `без количества: ${noQty.length}`,
  ];

  const formulaInputs: Workshop2RiskFormulaInput[] = [
    { key: 'bom_lines', labelRu: 'Строк BOM', value: String(lines.length) },
    { key: 'max_lead_days', labelRu: 'Макс. lead time (дн.)', value: String(maxLead) },
    { key: 'buffer_days', labelRu: 'Буфер на раскрой/пошив (дн.)', value: '5' },
    {
      key: 'predicted_days',
      labelRu: 'Прогноз срока (дн.)',
      value: maxLead > 0 ? `${maxLead} + 5 = ${predictedDays}` : `12 (нет lead time)`,
    },
    { key: 'long_lead_count', labelRu: 'Позиций с lead > 14 дн.', value: String(longLead.length) },
    { key: 'draft_lines', labelRu: 'Черновики BOM', value: String(drafts.length) },
    { key: 'missing_qty', labelRu: 'Без количества', value: String(noQty.length) },
  ];

  return {
    predictedDays,
    riskLevel,
    rationale,
    risks: risks.slice(0, 5),
    inputsUsed,
    formulaInputs,
  };
}

/** MVP: оценка КПМ из параметров раскладки (детерминированно). */
export function computeNestingEfficiencyPct(input: {
  layers?: number;
  length?: number;
  poQuantity?: number;
  artifactIndex?: number;
}): number {
  const layers = Math.max(1, input.layers ?? 1);
  const length = Math.max(0, input.length ?? 0);
  const po = Math.max(0, input.poQuantity ?? 0);
  const idx = input.artifactIndex ?? 0;
  let score = 78 + Math.min(8, layers * 2) + Math.min(4, Math.floor(length / 2));
  score += Math.min(3, Math.floor(po / 200));
  score -= (idx % 3) * 2;
  return Math.min(94, Math.max(72, score));
}
