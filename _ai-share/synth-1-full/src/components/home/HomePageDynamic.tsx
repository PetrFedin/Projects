'use client';

import dynamic from 'next/dynamic';

const HomePageClient = dynamic(
  () => import('./HomePageClient').then((m) => ({ default: m.HomePageClient })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-[#f8fafc] px-4">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-72 w-full max-w-5xl animate-pulse rounded-xl bg-slate-100" />
        <p className="text-sm text-slate-500">Загрузка главной…</p>
      </div>
    ),
  }
);

export function HomePageDynamic() {
  return <HomePageClient />;
}
