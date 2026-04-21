'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { workshop2ArticlePath, workshop2CollectionListHref } from '@/lib/production/workshop2-url';
import { STAGES_SKU_PARAM } from '@/lib/production/stages-url';
import { Sparkles } from 'lucide-react';
import { COLLECTION_DEV_HUB_TITLE_RU } from '@/lib/production/collection-development-labels';

/** Напоминание: основной контур ТЗ и образца — разработка коллекции; пол — исполнение по вкладкам. */
export function ProductionWorkshop2HubBanner() {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get('collectionId')?.trim();
  const stagesSku = searchParams.get(STAGES_SKU_PARAM)?.trim();

  const workshop2Href = (() => {
    if (collectionId && stagesSku) {
      return workshop2ArticlePath(collectionId, stagesSku);
    }
    if (collectionId) {
      return workshop2CollectionListHref(collectionId);
    }
    return ROUTES.brand.productionWorkshop2;
  })();

  return (
    <div
      className="border-border-subtle bg-bg-surface2/60 flex flex-col gap-2 rounded-lg border px-3 py-2.5 text-[12px] leading-snug sm:flex-row sm:items-start sm:justify-between"
      role="note"
    >
      <div className="text-text-secondary flex min-w-0 items-start gap-2">
        <Sparkles className="text-accent-primary mt-0.5 size-4 shrink-0" aria-hidden />
        <div className="min-w-0 space-y-1">
          <p>
            Разработка и образец — в разделе{' '}
            <strong className="text-text-primary">{COLLECTION_DEV_HUB_TITLE_RU}</strong> (в списке коллекции та же логика: слева ТЗ и
            согласования, справа — от supply-path сэмплы и выпуск по каталогу этапов). На полу ниже: серия, заказы и
            массовый выпуск по отдельным вкладкам.
          </p>
          <p className="text-text-muted text-[11px]">
            Параметр <code className="text-text-secondary bg-bg-surface2 rounded px-1 py-0.5 font-mono text-[10px]">stagesSku</code> должен совпадать с id строки артикула в этой коллекции; иначе пол сбросит контекст артикула.
          </p>
        </div>
      </div>
      <Link
        href={workshop2Href}
        className="text-accent-primary shrink-0 self-start font-semibold underline-offset-2 hover:underline sm:self-center"
      >
        {collectionId && stagesSku
          ? `${COLLECTION_DEV_HUB_TITLE_RU} · артикул →`
          : `${COLLECTION_DEV_HUB_TITLE_RU} →`}
      </Link>
    </div>
  );
}
