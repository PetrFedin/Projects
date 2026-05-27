'use client';

/** Wave W #8 — skeleton вместо blank flash при первичной загрузке досье с сервера. */
export function Workshop2ArticleWorkspaceDossierSkeleton() {
  return (
    <div
      className="mt-4 min-w-0 animate-pulse space-y-3"
      data-testid="workshop2-workspace-dossier-skeleton"
      aria-busy="true"
      aria-label="Загрузка досье артикула"
    >
      <div className="flex flex-wrap gap-2">
        <div className="h-7 w-24 rounded-md bg-slate-200/80" />
        <div className="h-7 w-32 rounded-md bg-slate-200/80" />
        <div className="h-7 w-28 rounded-md bg-slate-200/80" />
      </div>
      <div className="space-y-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-4">
        <div className="h-4 w-2/5 max-w-xs rounded bg-slate-200/90" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-11/12 rounded bg-slate-100" />
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="h-16 rounded-md bg-slate-100" />
          <div className="h-16 rounded-md bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
