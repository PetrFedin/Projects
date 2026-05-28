/**
 * Мобильный инспектор: прогресс чек-листа и сохранение в PG.
 */
export type Workshop2InspectorSaveState = 'idle' | 'saving' | 'saved' | 'error';

export type Workshop2InspectorReportStatus = {
  totalItems: number;
  checkedCount: number;
  requiredDone: number;
  requiredTotal: number;
  progressPct: number;
  saveState: Workshop2InspectorSaveState;
  state: 'empty' | 'partial' | 'ready' | 'at_risk';
  hintRu?: string;
};

export function summarizeWorkshop2InspectorReportStatus(input: {
  totalItems: number;
  checkedCount: number;
  requiredDone: number;
  requiredTotal: number;
  saveState: Workshop2InspectorSaveState;
}): Workshop2InspectorReportStatus {
  const progressPct =
    input.totalItems > 0 ? Math.round((input.checkedCount / input.totalItems) * 100) : 0;

  let state: Workshop2InspectorReportStatus['state'] = 'empty';
  if (input.totalItems > 0) {
    if (input.saveState === 'error') state = 'at_risk';
    else if (input.requiredDone >= input.requiredTotal && input.requiredTotal > 0)
      state = input.saveState === 'saved' ? 'ready' : 'partial';
    else state = 'partial';
  }

  let hintRu: string | undefined;
  if (input.totalItems === 0) {
    hintRu = 'Чек-лист пуст — загрузите досье и заказ образца.';
  } else if (input.saveState === 'error') {
    hintRu =
      'PUT inspector-report не удался — проверьте очередь offline или повторите после восстановления PG.';
  } else if (input.saveState === 'saving') {
    hintRu = 'Сохранение на сервер…';
  } else if (input.requiredDone < input.requiredTotal) {
    hintRu = `Обязательных пунктов: ${input.requiredDone}/${input.requiredTotal} — завершите до отгрузки.`;
  } else if (input.saveState !== 'saved') {
    hintRu =
      'Обязательные пункты закрыты — дождитесь сохранения в PG (workshop2_inspector_reports).';
  }

  return {
    totalItems: input.totalItems,
    checkedCount: input.checkedCount,
    requiredDone: input.requiredDone,
    requiredTotal: input.requiredTotal,
    progressPct,
    saveState: input.saveState,
    state,
    hintRu,
  };
}
