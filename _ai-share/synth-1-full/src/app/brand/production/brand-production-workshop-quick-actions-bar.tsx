'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { BarChart3, Play, PlusCircle, ShoppingBag } from 'lucide-react';

export function BrandProductionWorkshopQuickActionsBar(props: {
  collectionLabel: string;
  collectionIdFromQuery: string;
  collectionQuery: string;
  articleCount: number;
  totalForecastQty: number;
  totalForecastRevenue: number;
}) {
  const {
    collectionLabel,
    collectionIdFromQuery,
    collectionQuery,
    articleCount,
    totalForecastQty,
    totalForecastRevenue,
  } = props;

  return (
    <div className="border-accent-primary/20 from-accent-primary/10 flex flex-wrap items-center gap-2 rounded-xl border bg-gradient-to-r to-white p-4">
      <span className="text-text-secondary mr-2 text-[10px] font-black uppercase tracking-widest">
        Быстрые действия
      </span>
      <span className="text-text-secondary hidden text-[10px] sm:inline">
        (для коллекции «{collectionLabel}»)
      </span>
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1.5 text-[10px] font-bold uppercase"
        asChild
      >
        <Link
          href={
            collectionIdFromQuery
              ? `${ROUTES.brand.products}?addToCollection=${encodeURIComponent(collectionIdFromQuery)}`
              : ROUTES.brand.products
          }
        >
          <PlusCircle className="h-4 w-4" aria-hidden /> Добавить артикулы в коллекцию
        </Link>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1.5 text-[10px] font-bold uppercase"
        asChild
      >
        <Link href={ROUTES.brand.budgetActual}>
          <BarChart3 className="h-4 w-4" aria-hidden /> Спрогнозировать коллекцию
        </Link>
      </Button>
      <Button
        size="sm"
        className="bg-text-primary hover:bg-text-primary/90 h-9 gap-1.5 text-[10px] font-bold uppercase text-white"
        asChild
      >
        <Link
          href={`${ROUTES.brand.productionGantt}${collectionIdFromQuery ? `?collectionId=${encodeURIComponent(collectionIdFromQuery)}` : ''}`}
        >
          <Play className="h-4 w-4" aria-hidden /> Запустить в производство
        </Link>
      </Button>
      <span className="text-text-secondary ml-2 text-[10px]">
        Артикулов в коллекции: <strong>{articleCount}</strong> · Прогноз:{' '}
        <strong>{totalForecastQty.toLocaleString('ru-RU')} шт</strong> · Выручка:{' '}
        <strong>{(totalForecastRevenue / 1_000_000).toFixed(1)} млн ₽</strong>
      </span>
      {collectionIdFromQuery ? (
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-9 gap-1.5 text-[10px] font-bold uppercase"
          asChild
        >
          <Link
            href={`${ROUTES.shop.b2bOrders}?${collectionQuery ? `${collectionQuery.slice(1)}&` : ''}view=collection`}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden /> B2B по коллекции
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
