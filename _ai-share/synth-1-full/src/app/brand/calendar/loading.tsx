/**
 * Loading fallback для Strategic Planner.
 * Показывается пока загружаются чанки — если они не загрузятся, пользователь
 * увидит этот экран вместо пустой страницы.
 */
import { cn } from '@/lib/utils';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

export default function CalendarLoading() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl animate-pulse px-4 py-8">
      <div className="mb-4 h-6 w-48 rounded bg-slate-200" />
      <div className="mb-6 h-10 w-full max-w-xs rounded-lg bg-slate-100" />
      <div className="grid grid-cols-7 gap-2 rounded-xl bg-slate-100 p-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-slate-200/60" />
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-slate-400">Загрузка календаря…</p>
=======
    <div className={cn(registryFeedLayout.pageShell, 'animate-pulse py-8')}>
      <div className="bg-border-subtle mb-4 h-6 w-48 rounded" />
      <div className="bg-bg-surface2 mb-6 h-10 w-full max-w-xs rounded-lg" />
      <div className="bg-bg-surface2 grid grid-cols-7 gap-2 rounded-xl p-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="bg-border-subtle/60 h-16 rounded-lg" />
        ))}
      </div>
      <p className="text-text-muted mt-6 text-center text-sm">Загрузка календаря…</p>
>>>>>>> recover/cabinet-wip-from-stash
    </div>
  );
}
