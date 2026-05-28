'use client';

import dynamic from 'next/dynamic';

/** Тяжёлое тело вкладок подгружается без SSR (legacy production hub). */
export const ProductionPageMainLazyContent = dynamic(
  () => import('./production-page-content').then((m) => ({ default: m.ProductionPageContent })),
  {
    ssr: false,
    loading: () => <div className="text-text-muted p-8 text-center text-sm">Загрузка…</div>,
  }
);
