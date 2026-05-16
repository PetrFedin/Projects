'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CollectionArticle } from '@/app/brand/production/production-page-types';
import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import { ROUTES } from '@/lib/routes';
import {
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  FileText,
  Package,
  Truck,
} from 'lucide-react';

export function BrandProductionWorkshopArticlesCardTable(props: {
  collectionQuery: string;
  totalCollectionArticles: number;
  displayedArticles: readonly CollectionArticle[];
  dropLabelById: Record<string, string>;
  onOpenArticleProductionHub: (articleId: string) => void;
  onResetArticleFilters: () => void;
}) {
  const {
    collectionQuery,
    totalCollectionArticles,
    displayedArticles,
    dropLabelById,
    onOpenArticleProductionHub,
    onResetArticleFilters,
  } = props;

  return (
    <>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-border-subtle text-text-secondary border-b text-[10px] font-bold uppercase tracking-widest">
            <th className="pb-2 pr-4">Артикул</th>
            <th className="pb-2 pr-4">Сезон</th>
            <th className="min-w-[7rem] pb-2 pr-3">Производство</th>
            <th className="pb-2 pr-3">Дроп</th>
            <th className="pb-2 pr-4">Этап</th>
            <th className="pb-2 pr-4">Прогноз</th>
            <th className="pb-2 pr-2 text-center">Tech Pack</th>
            <th className="pb-2 pr-2 text-center">Сэмплы</th>
            <th className="pb-2 pr-2 text-center">PO</th>
            <th className="pb-2 pr-2 text-center">QC</th>
            <th className="pb-2 pr-2 text-center">Готово</th>
            <th className="min-w-[7.5rem] pb-2">В цех</th>
            <th className="pb-2">Ещё</th>
          </tr>
        </thead>
        <tbody>
          {displayedArticles.map((art) => {
            const step = COLLECTION_STEPS.find((s) => s.id === art.currentStageId);
            const dropLabel = art.deliveryWindowId
              ? (dropLabelById[art.deliveryWindowId] ?? art.deliveryWindowId)
              : '—';
            const ganttHref = `${ROUTES.brand.productionGantt}${collectionQuery}${collectionQuery ? '&' : '?'}sku=${encodeURIComponent(art.sku || art.id)}`;
            const readyMadeHref = `${ROUTES.brand.productionReadyMade}${collectionQuery}${collectionQuery ? '&' : '?'}sku=${encodeURIComponent(art.sku || art.id)}`;
            return (
              <tr
                key={art.id}
                className="border-border-subtle hover:bg-bg-surface2/80 border-b transition-colors"
              >
                <td className="py-3 pr-4">
                  <span className="text-text-primary font-mono text-[11px] font-bold">{art.sku}</span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-text-primary text-[11px] font-medium">{art.season}</span>
                </td>
                <td className="py-3 pr-3 align-top">
                  <span className="text-text-primary block max-w-[9rem] text-[10px] leading-snug">
                    {art.productionSiteLabel}
                  </span>
                </td>
                <td className="py-3 pr-3">
                  <span className="text-text-secondary text-[10px]">
                    {dropLabel.replace(/^Drop \d+: /, '')}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <Badge variant="outline" className="border-border-default text-[9px]">
                    {step?.title ?? art.currentStageId}
                  </Badge>
                </td>
                <td className="text-text-primary py-3 pr-4 text-[11px]">
                  {art.forecastQty.toLocaleString('ru-RU')} шт · {(art.forecastRevenue / 1000).toFixed(0)}k ₽
                </td>
                <td className="py-3 pr-2 text-center">
                  {art.techPackDone ? (
                    <CheckCircle2 className="inline h-4 w-4 text-emerald-600" />
                  ) : (
                    <CircleDot className="inline h-4 w-4 text-amber-500" />
                  )}
                </td>
                <td className="py-3 pr-2 text-center">
                  {art.samplesDone ? (
                    <CheckCircle2 className="inline h-4 w-4 text-emerald-600" />
                  ) : (
                    <CircleDot className="inline h-4 w-4 text-amber-500" />
                  )}
                </td>
                <td className="py-3 pr-2 text-center">
                  {art.poDone ? (
                    <CheckCircle2 className="inline h-4 w-4 text-emerald-600" />
                  ) : (
                    <CircleDot className="inline h-4 w-4 text-amber-500" />
                  )}
                </td>
                <td className="py-3 pr-2 text-center">
                  {art.qcDone ? (
                    <CheckCircle2 className="inline h-4 w-4 text-emerald-600" />
                  ) : (
                    <CircleDot className="inline h-4 w-4 text-amber-500" />
                  )}
                </td>
                <td className="py-3 pr-2 text-center">
                  {art.ready ? (
                    <CheckCircle2 className="inline h-4 w-4 text-emerald-600" />
                  ) : (
                    <CircleDot className="text-text-muted inline h-4 w-4" />
                  )}
                </td>
                <td className="py-3 pr-2 align-middle">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="bg-text-primary hover:bg-text-primary/90 h-7 px-2 text-[9px] font-black uppercase tracking-tight"
                    title="Открыть этапы и модули цеха только для этого артикула"
                    onClick={() => onOpenArticleProductionHub(art.id)}
                  >
                    В цех · процесс
                  </Button>
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[9px]"
                      title="Tech Pack"
                    >
                      <Link href={`/brand/production/tech-pack/${art.sku || art.id}${collectionQuery}`}>
                        <FileText className="h-3 w-3" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[9px]"
                      title="Сэмплы"
                    >
                      <Link
                        href={`${ROUTES.brand.productionGoldSample}${collectionQuery}&sku=${encodeURIComponent(art.sku || art.id)}`}
                      >
                        <Package className="h-3 w-3" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="h-6 px-2 text-[9px]" title="PO">
                      <Link href={ganttHref}>
                        <ClipboardCheck className="h-3 w-3" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[9px]"
                      title="Готовый товар"
                    >
                      <Link href={readyMadeHref}>
                        <Truck className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {totalCollectionArticles === 0 ? (
        <div className="text-text-secondary py-12 text-center text-sm">
          Нет артикулов в текущей коллекции. Выберите сезон выше или добавьте артикулы из раздела
          Продукты.
          <Button variant="outline" size="sm" className="ml-2 mt-3" asChild>
            <Link href={ROUTES.brand.products}>Перейти в Продукты</Link>
          </Button>
        </div>
      ) : null}
      {totalCollectionArticles > 0 && displayedArticles.length === 0 ? (
        <div className="text-text-secondary py-8 text-center text-sm">
          По фильтрам ничего не найдено. Сбросьте поиск или «Требуют внимания».
          <Button variant="outline" size="sm" className="ml-2 mt-3" onClick={onResetArticleFilters}>
            Сбросить фильтры
          </Button>
        </div>
      ) : null}
    </>
  );
}
