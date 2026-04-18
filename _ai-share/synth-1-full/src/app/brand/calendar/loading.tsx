/**
 * Loading fallback для Strategic Planner.
 * Показывается пока загружаются чанки — если они не загрузятся, пользователь
 * увидит этот экран вместо пустой страницы.
 */
import { cn } from '@/lib/utils';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

export default function CalendarLoading() {
  return (
    <div className={cn(registryFeedLayout.pageShell, 'animate-pulse py-8')}>
      <div className="bg-border-subtle mb-4 h-6 w-48 rounded" />
      <div className="bg-bg-surface2 mb-6 h-10 w-full max-w-xs rounded-lg" />
      <div className="bg-bg-surface2 grid grid-cols-7 gap-2 rounded-xl p-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="bg-border-subtle/60 h-16 rounded-lg" />
        ))}
      </div>
      <p className="text-text-muted mt-6 text-center text-sm">Загрузка календаря…</p>
    </div>
  );
}
