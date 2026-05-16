'use client';

import * as LucideIcons from 'lucide-react';

export function Workshop2VisualReferencesTopBar({
  openRefDiscussionCount,
  maxReferences,
}: {
  openRefDiscussionCount: number;
  maxReferences: number;
}) {
  return (
    <>
      <div className="flex items-start gap-3">
        <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <LucideIcons.Images className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-text-primary text-base font-semibold">Референсы</h2>
            <span
              className="text-amber-600"
              title="Без референсов не закрывается обязательный контур визуала и проверка «готово к образцу» по этому блоку. Добавьте хотя бы одно превью или ссылку с пояснением, что берёте с рефа."
              aria-label="Требование к референсам"
            >
              <LucideIcons.CircleAlert className="h-4 w-4 animate-pulse" aria-hidden />
            </span>
          </div>
          <p className="text-text-secondary text-sm leading-snug">
            До {maxReferences} референсов: что берем в работу. Главное фото отметьте звездой;
            обсуждение ведите в просмотре.
          </p>
          {openRefDiscussionCount > 0 ? (
            <p className="text-[11px] font-medium text-rose-700">
              Открытых тредов по рефам: {openRefDiscussionCount} — закройте в просмотре или отметьте
              resolved.
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}
