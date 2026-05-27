'use client';

import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Экран загрузки brand hub — отдельный chunk, только при USE_FASTAPI + authLoading. */
export function BrandLayoutLoadingScreen({
  showEscapeBtn,
  onForceShow,
}: {
  showEscapeBtn: boolean;
  onForceShow: () => void;
}) {
  return (
    <div className="bg-bg-surface flex min-h-screen items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-accent-primary text-text-inverse flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl shadow-xl">
          <Store className="h-7 w-7" />
        </div>
        <p className="text-text-secondary text-[11px] font-black uppercase tracking-widest">
          Загрузка бренд-центра...
        </p>
        <div className="bg-bg-surface2 h-1 w-32 overflow-hidden rounded-full">
          <div className="bg-accent-primary h-full w-1/2 animate-pulse rounded-full" />
        </div>
        {showEscapeBtn ? (
          <Button variant="outline" size="sm" className="mt-2 text-[10px]" onClick={onForceShow}>
            Показать интерфейс
          </Button>
        ) : null}
      </div>
    </div>
  );
}
