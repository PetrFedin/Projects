'use client';

/** Баннер «только просмотр», если у роли нет права редактировать производство. */
export function Workshop2DossierTzReadonlyBanner() {
  return (
    <div
      className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
      role="status"
    >
      <span className="font-semibold">Только просмотр.</span> У этой роли нет права «Редактировать
      производство» — изменения ТЗ и скетча не сохраняются; экспорт и печать по-прежнему доступны.
    </div>
  );
}
