'use client';

/**
 * Мост разработка коллекции ↔ пол: только контур разработки и образца (не серия и не заказы).
 */
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  getWorkshop2DevelopmentExtraModuleLinks,
  getWorkshop2DevelopmentFloorTabLinks,
} from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { workshop2ContextToProductionFloorHubHref } from '@/lib/production/workshop2-floor-bridge';
import { WORKSHOP2_ART_PARAM, WORKSHOP2_COL_PARAM } from '@/lib/production/workshop2-url';
import { cn } from '@/lib/utils';
import { ChevronDown, Factory, Link2 } from 'lucide-react';

export type Workshop2FloorToolkitBridgeProps = {
  /**
   * Сегменты маршрута `/brand/production/workshop2/c/:collectionId/a/:articleId` —
   * приоритетнее query `w2col` / `w2art` на главной разработки коллекции.
   */
  routeCollectionId?: string;
  routeArticleLineId?: string;
  /** Компактный режим: блок свёрнут до клика (удобно на странице артикула). */
  startCollapsed?: boolean;
};

export function Workshop2FloorToolkitBridge({
  routeCollectionId,
  routeArticleLineId,
  startCollapsed = false,
}: Workshop2FloorToolkitBridgeProps) {
  const searchParams = useSearchParams();
  const w2col = (routeCollectionId ?? searchParams.get(WORKSHOP2_COL_PARAM))?.trim() || '';
  const w2art = (routeArticleLineId ?? searchParams.get(WORKSHOP2_ART_PARAM))?.trim() || '';

  const col = w2col || undefined;
  const art = w2art || undefined;

  const floorTabs = getWorkshop2DevelopmentFloorTabLinks(col, art);
  const extras = getWorkshop2DevelopmentExtraModuleLinks(col, art);

  const openFloorHref =
    col != null && col !== ''
      ? workshop2ContextToProductionFloorHubHref({ collectionId: col, articleLineId: art })
      : ROUTES.brand.production;

  const contextSummary = (() => {
    if (col && art) {
      return `Коллекция и артикул на полу — collectionId и stagesSku. Это тот же контур, что мини-шкала в списке: слева разработка и ТЗ (в т.ч. смысл gate-all-stakeholders), справа — от supply-path сэмплы и выпуск. Ниже только инструменты образца и контроля — без серии и массового выпуска.`;
    }
    if (col) {
      return `Коллекция передаётся как collectionId; откройте артикул — добавится stagesSku. Ссылки сужены под разработку и образец (слева ТЗ · справа от якоря supply-path в каталоге этапов), не под опт и партию.`;
    }
    return 'Выберите коллекцию в списке — подставится collectionId; при выборе артикула добавится контекст строки на полу, как на мини-шкале этапов коллекции.';
  })();

  const linksBlocks = (
    <div className="space-y-4">
      <RelatedModulesBlock
        title="Вкладки пола · под ТЗ и образец (без серии)"
        links={floorTabs}
        className="border-0 shadow-none"
      />
      <RelatedModulesBlock
        title="Образец, материалы, шоурум · контур сэмпла"
        links={extras}
        className="border-0 shadow-none"
      />
    </div>
  );

  if (startCollapsed) {
    return (
      <Collapsible defaultOpen={false} className="group">
        <Card
          className="border-border-subtle border bg-white shadow-sm"
          data-testid="workshop2-floor-toolkit-bridge"
        >
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className={cn(
                'hover:bg-bg-surface2/50 flex w-full items-center justify-between gap-2 rounded-lg px-4 py-3 text-left transition-colors',
                'focus-visible:ring-accent-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
              )}
            >
              <span className="text-text-primary flex min-w-0 items-center gap-2 text-sm font-semibold">
                <Factory className="text-accent-primary size-4 shrink-0" aria-hidden />
                <span className="min-w-0 truncate">Пол: ТЗ, образец, шоурум (без серии)</span>
              </span>
              <ChevronDown className="text-text-muted size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-border-subtle space-y-3 border-t px-4 pb-4 pt-1">
              <p className="text-text-muted text-[11px] leading-snug">{contextSummary}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link
                  href={openFloorHref}
                  className="text-accent-primary inline-flex items-center gap-1.5 text-[11px] font-semibold underline-offset-2 hover:underline"
                >
                  <Link2 className="size-3.5 shrink-0" aria-hidden />
                  Открыть пол с контекстом
                </Link>
                <Link
                  href={ROUTES.brand.production}
                  className="text-text-muted text-[11px] font-medium underline-offset-2 hover:text-accent-primary hover:underline"
                >
                  Пол цеха (все вкладки)
                </Link>
              </div>
              {linksBlocks}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }

  return (
    <Card
      className="border-border-subtle border bg-white shadow-sm"
      data-testid="workshop2-floor-toolkit-bridge"
    >
      <CardHeader className="pb-2 pt-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-text-primary flex items-center gap-2 text-sm font-semibold tracking-tight">
              <Factory className="text-accent-primary size-4 shrink-0" aria-hidden />
              Пол: разработка и образец
            </CardTitle>
            <CardDescription className="text-text-muted max-w-prose text-[11px] leading-snug">
              Поддерживающие инструменты на{' '}
              <Link
                href={ROUTES.brand.production}
                className="text-accent-primary font-medium underline-offset-2 hover:underline"
              >
                /brand/production
              </Link>{' '}
              — только для ТЗ, материалов под образец, эталона и контроля. Серия, партия и заказы — в полном поле и
              B2B, ниже на странице. {contextSummary}
            </CardDescription>
          </div>
          <Link
            href={openFloorHref}
            className="text-text-muted hover:text-accent-primary inline-flex items-center gap-1.5 text-[11px] font-semibold no-underline transition-colors"
          >
            <Link2 className="size-3.5 shrink-0" aria-hidden />
            Открыть пол
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-5 pt-0">{linksBlocks}</CardContent>
    </Card>
  );
}
