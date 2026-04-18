import React, { Suspense } from 'react';

/** Общий сегмент завода: дочерние ветки — `/factory/production`, `/factory/supplier`. */
export default function FactoryRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="bg-bg-surface text-text-muted flex min-h-screen flex-col items-center justify-center gap-3 text-xs font-medium uppercase tracking-widest">
          Загрузка…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
