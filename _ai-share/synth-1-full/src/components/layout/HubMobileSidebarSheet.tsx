'use client';

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import type { ReactNode } from 'react';

type HubMobileSidebarSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** a11y label for screen readers */
  srTitle?: string;
  header: ReactNode;
  children: ReactNode;
};

/** Общая оболочка mobile Sheet для cabinet hubs — переиспользуется lazy-обёртками хабов. */
export function HubMobileSidebarSheet({
  open,
  onOpenChange,
  srTitle,
  header,
  children,
}: HubMobileSidebarSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
        {srTitle ? <SheetTitle className="sr-only">{srTitle}</SheetTitle> : null}
        <div className="shrink-0 pb-0 pt-12">{header}</div>
        <div className="border-border-subtle shrink-0 border-b px-3 pb-2">
          <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
            Навигация
          </p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
