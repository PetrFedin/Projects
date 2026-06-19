'use client';

/** Подвал над кнопками: время последнего сохранения, подсказка save, ошибка, строка локальных метрик сессии. */
export function Workshop2DossierPersistStatusFooter({
  updatedAtIso,
  savedHint,
  saveError,
  metricsFooterLine,
}: {
  updatedAtIso?: string | null | undefined;
  savedHint?: string | null | undefined;
  saveError?: string | null | undefined;
  metricsFooterLine?: string | null | undefined;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {updatedAtIso ? (
          <span className="text-text-muted text-[10px] tabular-nums">
            {new Date(updatedAtIso).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        ) : null}
        {savedHint ? (
          <span
            className="text-[11px] font-medium text-emerald-700"
            data-testid="workshop2-dossier-persist-saved-hint"
          >
            {savedHint}
          </span>
        ) : null}
        {saveError ? (
          <span className="text-[11px] font-medium text-red-600">{saveError}</span>
        ) : null}
      </div>
      {metricsFooterLine ? (
        <span
          className="text-text-muted text-[9px] leading-snug"
          title="Локально в этом браузере, для оценки сессии"
        >
          {metricsFooterLine}
        </span>
      ) : null}
    </div>
  );
}
