'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { BrandProductionMockCollectionRow } from '@/app/brand/production/production-page-demo-data';
import { Factory } from 'lucide-react';

export function BrandProductionWorkshopTabIntro(props: {
  articleContextValid: boolean;
  stagesSkuContextLine: string | undefined;
  onGoToStagesTab: () => void;
  collectionIdFromQuery: string;
  workshopCollections: readonly BrandProductionMockCollectionRow[];
}) {
  const {
    articleContextValid,
    stagesSkuContextLine,
    onGoToStagesTab,
    collectionIdFromQuery,
    workshopCollections,
  } = props;

  return (
    <>
      <Card className="border-accent-primary/30 bg-accent-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-accent-primary text-sm uppercase tracking-tight">
            Единый производственный хаб
          </CardTitle>
          <CardDescription className="text-text-primary text-xs leading-relaxed">
            Сначала коллекция, затем артикул. Вкладки «Этапы», «Снабжение», «Эталон», «План»,
            «Выпуск», «ОТК», «Склад» и «Операции» открываются только после выбора артикула в
            таблице ниже — <strong className="text-text-primary">«В цех · процесс»</strong>.
            Вкладка «LIVE · схема» доступна без артикула (обзор по коллекции). Раздел готовых к
            продаже продуктов и B2B/B2C — отдельно позже.
          </CardDescription>
        </CardHeader>
        {articleContextValid && stagesSkuContextLine ? (
          <CardContent className="flex flex-wrap items-center gap-2 pt-0">
            <Badge variant="secondary" className="text-[10px] font-semibold">
              В работе: {stagesSkuContextLine}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-[10px]"
              onClick={onGoToStagesTab}
            >
              К этапам и модулям этого артикула
            </Button>
          </CardContent>
        ) : null}
      </Card>

      {/* —— Мои коллекции: все, по которым велась или ведётся работа; провал в одну —— */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-tight">
            <Factory className="h-4 w-4" aria-hidden /> Работа по коллекциям
          </CardTitle>
          <CardDescription className="text-xs">
            Выберите коллекцию. Дальше в таблице артикулов нажмите «В цех · процесс», чтобы вести
            полный контур производства по одному изделию за раз.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {workshopCollections.map((col) => {
              const isCurrent = (col.id || 'default') === (collectionIdFromQuery || 'default');
              const statusLabel =
                col.status === 'done'
                  ? 'Завершена'
                  : col.status === 'in_progress'
                    ? 'В работе'
                    : 'Черновик';
              const statusClass =
                col.status === 'done'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : col.status === 'in_progress'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-bg-surface2 text-text-secondary border-border-default';
              return (
                <Link
                  key={col.id || 'default'}
                  href={
                    col.id === ''
                      ? '/brand/production'
                      : `/brand/production?collectionId=${encodeURIComponent(col.id)}`
                  }
                >
                  <Card
                    className={cn(
                      'h-full border-2 transition-all hover:shadow-md',
                      isCurrent
                        ? 'border-accent-primary/40 bg-accent-primary/10'
                        : 'border-border-subtle'
                    )}
                  >
                    <CardContent className="p-4">
                      <p className="text-text-primary truncate text-[12px] font-semibold">{col.name}</p>
                      <Badge className={cn('mt-1.5 border text-[9px]', statusClass)}>{statusLabel}</Badge>
                      <p className="text-text-secondary mt-2 text-[10px]">
                        Артикулов: <strong>{col.articleCount}</strong>
                      </p>
                      <Progress
                        value={col.progressPct}
                        className="mt-1 h-1.5"
                        aria-label={`Готовность коллекции «${col.name}»: ${col.progressPct}%`}
                      />
                      <p className="text-text-muted mt-0.5 text-[9px]">{col.progressPct}%</p>
                      <p
                        className={cn(
                          'mt-3 rounded-lg py-1.5 text-center text-[10px] font-semibold',
                          isCurrent
                            ? 'bg-accent-primary/15 text-accent-primary'
                            : 'bg-bg-surface2 text-text-secondary'
                        )}
                      >
                        {isCurrent ? 'Открыта' : 'Открыть'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
