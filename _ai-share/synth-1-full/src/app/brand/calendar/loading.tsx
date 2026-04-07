/**
 * Loading fallback для Strategic Planner.
 * Показывается пока загружаются чанки — если они не загрузятся, пользователь
 * увидит этот экран вместо пустой страницы.
 */
export default function CalendarLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-48 mb-4" />
      <div className="h-10 bg-slate-100 rounded-lg w-full max-w-xs mb-6" />
      <div className="grid grid-cols-7 gap-2 bg-slate-100 rounded-xl p-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-200/60 rounded-lg" />
        ))}
      </div>
      <p className="text-center text-sm text-slate-400 mt-6">Загрузка календаря…</p>
    </div>
  );
}
