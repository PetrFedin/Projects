'use client';

import type { ComponentProps } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CollectionWorkshopStageChain } from '@/components/brand/production/CollectionWorkshopStageChain';
import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import type { DeliveryWindowWithMeta } from '@/app/brand/production/production-page-delivery-windows-meta';

type StageChainProps = Omit<ComponentProps<typeof CollectionWorkshopStageChain>, 'steps'>;

export function BrandProductionWorkshopStageSchemeCard(props: {
  floorHref: (floorTab: ProductionFloorTabId) => string;
  liveProcessOverviewHref: string;
  collectionLabel: string;
  completedCount: number;
  collectionIdFromQuery: string;
  collectionSelectOptions: readonly string[];
  progressPct: number;
  dropsWithMeta: readonly DeliveryWindowWithMeta[];
  dropStats: Record<string, { styles: number; qty: number }>;
  onCollectionSelectChange: (value: string) => void;
  onNewCollectionShortcut: () => void;
  stageChain: StageChainProps;
}) {
  const {
    floorHref,
    liveProcessOverviewHref,
    collectionLabel,
    completedCount,
    collectionIdFromQuery,
    collectionSelectOptions,
    progressPct,
    dropsWithMeta,
    dropStats,
    onCollectionSelectChange,
    onNewCollectionShortcut,
    stageChain,
  } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-tight">
          Поэтапная схема: от идеи до склада
        </CardTitle>
        <CardDescription className="text-xs">
          <strong>Что это:</strong> цепочка ниже — те же этапы и тот же порядок, что в матрице «Этапы
          и зависимости» (
          <code className="bg-bg-surface2 rounded px-1 text-[10px]">COLLECTION_STEPS</code>
          ). Переход артикула к следующему шагу в работе определяется графом зависимостей (
          <code className="bg-bg-surface2 rounded px-1 text-[10px]">dependsOn</code>
          ), а не только номером карточки. Выберите коллекцию выше (карточки «Работа по коллекциям»).
          По <strong>названию этапа</strong> — модуль: поля, вложения, журнал; «В модуль» — переход в
          экран этапа. В блоке <strong>«Артикулы коллекции»</strong> — таблица и текущий этап.{' '}
          <strong>«Быстрые действия»</strong> — добавление артикулов, прогноз, запуск.
        </CardDescription>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
            <Link href={floorHref('stages')}>Этапы и зависимости: матрица, статусы, ссылки →</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
            <Link href={liveProcessOverviewHref}>
              LIVE process: ответственные, даты, календарь, обсуждения →
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-text-secondary bg-bg-surface2 border-border-subtle rounded-lg border p-3 text-[11px]">
          Текущая коллекция: <strong>{collectionLabel}</strong>. Прогресс по этапам:{' '}
          <strong>{completedCount}</strong> из {COLLECTION_STEPS.length} (этап считается «готово»,
          когда все артикулы в коллекции закрыли этап). Детали по ответственным, деньгам и выходам —
          на вкладке «Этапы» в блоке «По артикулам».
        </p>

        <CollectionWorkshopStageChain steps={COLLECTION_STEPS} {...stageChain} />

        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="text-text-secondary">Текущая коллекция:</span>
          <select
            value={collectionIdFromQuery}
            onChange={(e) => onCollectionSelectChange(e.target.value)}
            className="border-border-default rounded-lg border bg-white px-2 py-1.5 text-[10px]"
          >
            <option value="">По умолчанию</option>
            {collectionSelectOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="__new__">➕ Новая коллекция…</option>
          </select>
          <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={onNewCollectionShortcut}>
            Новая коллекция
          </Button>
          <span className="text-text-muted ml-2">Прогресс: {progressPct}%</span>
          <Progress
            value={progressPct}
            className="ml-1 inline-block h-1.5 w-24 align-middle"
            aria-label={`Прогресс коллекции по этапам: ${progressPct}%`}
          />
        </div>

        <div className="border-border-subtle bg-bg-surface2/60 rounded-xl border p-3">
          <p className="text-text-secondary mb-2 text-[10px] font-bold">Таймлайн дропов по коллекции</p>
          <div className="space-y-2">
            {dropsWithMeta.map((drop) => {
              const stateLabel = drop.isPast
                ? 'Завершён'
                : drop.isActive
                  ? 'В отгрузке'
                  : 'Планируется';
              const stats = dropStats[drop.id];
              return (
                <div key={drop.id} className="flex items-center gap-3 text-[10px]">
                  <span className="w-28 shrink-0">{drop.label.replace(/^Drop \d+: /, '')}</span>
                  <span
                    className={cn(
                      'font-medium',
                      drop.isPast
                        ? 'text-text-secondary'
                        : drop.isActive
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                    )}
                  >
                    {stateLabel}
                  </span>
                  {stats && (
                    <span className="text-text-secondary">
                      Стилей: {stats.styles}, шт: {stats.qty}
                    </span>
                  )}
                  <Button asChild variant="ghost" size="sm" className="ml-auto h-6 text-[9px]">
                    <Link
                      href={`${ROUTES.brand.productionGantt}?window=${encodeURIComponent(drop.id)}${collectionIdFromQuery ? `&collectionId=${encodeURIComponent(collectionIdFromQuery)}` : ''}`}
                    >
                      PO по дропу →
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
