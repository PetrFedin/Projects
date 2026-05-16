'use client';

import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import {
  isProductionFloorTab,
  productionFloorTabRequiresArticle,
  type ProductionFloorTabId,
} from '@/lib/production/floor-flow';
import { STAGES_SKU_PARAM } from '@/lib/production/stages-url';

/** Подсказка для вкладок пола, требующих выбранный артикул (`stagesSku`). */
export const BRAND_PRODUCTION_ARTICLE_CONTEXT_REQUIRED_HINT =
  'Сначала выберите артикул: вкладка «Коллекция» → в таблице кнопка «В цех · процесс».';

export function useBrandProductionFloorNavigation(args: {
  articleContextValid: boolean;
  pathname: string;
  router: { replace: (href: string, options?: { scroll?: boolean }) => void; push: (href: string) => void };
  searchParams: ReadonlyURLSearchParams;
  setTabState: Dispatch<SetStateAction<ProductionFloorTabId>>;
}) {
  const setTab = useCallback(
    (nextRaw: string) => {
      const next: ProductionFloorTabId = isProductionFloorTab(nextRaw) ? nextRaw : 'workshop';
      if (productionFloorTabRequiresArticle(next) && !args.articleContextValid) {
        args.setTabState('workshop');
        const params = new URLSearchParams(args.searchParams.toString());
        params.delete('floorTab');
        const q = params.toString();
        args.router.replace(`${args.pathname}${q ? `?${q}` : ''}`, { scroll: false });
        return;
      }
      args.setTabState(next);
      const params = new URLSearchParams(args.searchParams.toString());
      if (next === 'workshop') params.delete('floorTab');
      else params.set('floorTab', next);
      const q = params.toString();
      args.router.replace(`${args.pathname}${q ? `?${q}` : ''}`, { scroll: false });
    },
    [args.articleContextValid, args.pathname, args.router, args.searchParams, args.setTabState]
  );

  const openArticleProductionHub = useCallback(
    (articleId: string) => {
      const params = new URLSearchParams(args.searchParams.toString());
      params.set(STAGES_SKU_PARAM, articleId);
      params.set('floorTab', 'stages');
      params.set('stagesSub', 'sku');
      args.router.push(`${args.pathname}?${params.toString()}`);
    },
    [args.pathname, args.router, args.searchParams]
  );

  /** Путь + query без origin — одинаково на SSR и при гидрации (избегаем рассинхрона disabled у кнопки «Ссылка»). */
  const productionFullPageUrl = useMemo(() => {
    const q = args.searchParams.toString();
    return `${args.pathname}${q ? `?${q}` : ''}`;
  }, [args.pathname, args.searchParams]);

  return { setTab, openArticleProductionHub, productionFullPageUrl };
}
