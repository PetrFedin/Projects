/**
 * Полоса вкладок: фиксированный порядок, фильтр по роли (без drag-reorder).
 */
import { W2_ARTICLE_MAIN_TAB_STRIP } from '@/lib/production/workshop-article-main-tab-labels';

export type Workshop2MainTabStripStatus = {
  role: string;
  visibleTabCount: number;
  totalTabCount: number;
  orderConfigurable: false;
  hiddenTabIds: string[];
  state: 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2MainTabStripStatus(input: {
  role: string;
  visibleTabIds: string[];
}): Workshop2MainTabStripStatus {
  const allIds = W2_ARTICLE_MAIN_TAB_STRIP.map((t) => t.id);
  const hiddenTabIds = allIds.filter((id) => !input.visibleTabIds.includes(id));

  let hintRu: string | undefined;
  if (hiddenTabIds.length > 0) {
    hintRu = `Роль «${input.role}»: скрыто ${hiddenTabIds.length} вкладок; порядок фиксирован (настройка по роли — roadmap).`;
  } else {
    hintRu = 'Все вкладки доступны; порядок ТЗ→…→Документы фиксирован в конфиге.';
  }

  return {
    role: input.role,
    visibleTabCount: input.visibleTabIds.length,
    totalTabCount: allIds.length,
    orderConfigurable: false,
    hiddenTabIds,
    state: 'ready',
    hintRu,
  };
}
