'use client';

import dynamic from 'next/dynamic';

const HomePageClient = dynamic(
  () => import('./HomePageClient').then((m) => ({ default: m.HomePageClient })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-background px-4"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex w-full max-w-5xl flex-col gap-3">
          <div className="bg-bg-surface2 h-9 w-48 animate-pulse rounded-lg" />
          <div className="border-border-subtle bg-bg-surface2/80 h-72 w-full animate-pulse rounded-xl border" />
        </div>
        <p className="text-text-muted text-sm">Загрузка главной…</p>
      </div>
    ),
  }
);

/**
 * Тяжёлая главная подгружается на клиенте после гидратации (как в `synth-1`),
 * чтобы не блокировать первый paint. Скелетон — на дизайн-токенах, без «сырого» slate.
 */
export function HomePageDynamic() {
  return <HomePageClient />;
}
