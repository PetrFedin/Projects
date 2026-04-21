'use client';

import Link from 'next/link';
import { FileWarning } from 'lucide-react';
import { cn } from '@/lib/utils';
import { operationalLayoutContract as o } from '@/lib/ui/operational-layout-contract';
import { ROUTES } from '@/lib/routes';
import { COLLECTION_DEV_HUB_TITLE_RU } from '@/lib/production/collection-development-labels';

/**
 * Поведенческая политика надстройки: чат и календарь не заменяют ТЗ/PO и матрицу этапов.
 */
export function CommunicationsArtifactPolicyStrip({
  className,
  showDeepLinks = true,
}: {
  className?: string;
  /** Ссылки на матрицу и производство — якоря для «обязательных артефактов». */
  showDeepLinks?: boolean;
}) {
  return (
    <div
      className={cn(
        o.panel,
        'flex flex-wrap items-start gap-2 border-amber-200/90 bg-amber-50/70 px-3 py-2 text-[10px] leading-snug text-amber-950',
        className
      )}
      role="note"
    >
      <FileWarning className="mt-0.5 size-3.5 shrink-0 text-amber-800" aria-hidden />
      <p>
        <strong className="font-semibold">Артефакты, а не только переписка:</strong> ТЗ, PO и статусы этапов
        фиксируются в матрице коллекции и в разработке коллекции; сообщения и задачи — напоминание и согласование, не источник
        правды по данным.
        {showDeepLinks ? (
          <>
            {' '}
            <Link
              href={`${ROUTES.brand.production}?floorTab=stages`}
              className="font-semibold text-amber-900 underline-offset-2 hover:underline"
            >
              Матрица этапов
            </Link>
            {' · '}
            <Link
              href={ROUTES.brand.productionWorkshop2}
              className="font-semibold text-amber-900 underline-offset-2 hover:underline"
            >
              {COLLECTION_DEV_HUB_TITLE_RU}
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
