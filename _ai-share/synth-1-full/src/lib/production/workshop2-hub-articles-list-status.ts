/**
 * Хаб: список артикулов — bulk handoff через API Wave 4.
 */
export type Workshop2HubArticlesListStatus = {
  visibleArticleCount: number;
  withoutDossierCount: number;
  lowTzPctCount: number;
  bulkHandoffAvailable: boolean;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2HubArticlesListStatus(input: {
  visibleArticleCount: number;
  withoutDossierCount: number;
  lowTzPctCount: number;
  tzPctThreshold?: number;
}): Workshop2HubArticlesListStatus {
  const threshold = input.tzPctThreshold ?? 70;

  let state: Workshop2HubArticlesListStatus['state'] = 'empty';
  if (input.visibleArticleCount === 0) {
    state = 'empty';
  } else if (input.withoutDossierCount > 0 || input.lowTzPctCount > 0) {
    state = 'partial';
  } else {
    state = 'ready';
  }

  let hintRu: string | undefined;
  if (state === 'empty') {
    hintRu = 'Нет артикулов в текущем фильтре — создайте карточку или смените фильтр.';
  } else if (input.withoutDossierCount > 0) {
    hintRu = `${input.withoutDossierCount} артикул(ов) без досье в кэше — откройте workspace для синхронизации.`;
  } else if (input.lowTzPctCount > 0) {
    hintRu = `${input.lowTzPctCount} артикул(ов) с ТЗ < ${threshold}% — массовый handoff заблокирован для них.`;
  } else {
    hintRu = `Показано ${input.visibleArticleCount} артикул(ов). Доступен массовый handoff gate с хаба.`;
  }

  const bulkHandoffAvailable =
    state !== 'empty' && input.withoutDossierCount === 0 && input.visibleArticleCount > 0;

  return {
    visibleArticleCount: input.visibleArticleCount,
    withoutDossierCount: input.withoutDossierCount,
    lowTzPctCount: input.lowTzPctCount,
    bulkHandoffAvailable,
    state,
    hintRu,
  };
}
