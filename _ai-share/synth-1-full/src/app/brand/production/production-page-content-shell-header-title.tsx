'use client';

import { Search, Settings2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ProductionPageContentShellHeaderTitle({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const {
    perms,
    prodRole,
    getContextTitle,
    selectedContext,
    resetToBrand,
    setIsGlobalSearchOpen,
  } = px;

  return (
    <div className="space-y-0.5">
      <div className="text-text-muted flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
        <Settings2 className="text-accent-primary h-3 w-3" />
        Fashion OS <span className="text-text-muted">/</span> Production
        {perms && (
          <Badge
            variant="outline"
            className="border-accent-primary/30 text-accent-primary ml-2 text-[8px]"
          >
            {prodRole}
          </Badge>
        )}
      </div>
      <h2 className="text-text-primary text-2xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
        Управление производством
      </h2>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <p className="text-text-muted text-[11px] font-bold uppercase tracking-wider">
          Контекст:{' '}
          <span className="text-accent-primary tracking-widest">
            {getContextTitle?.() || 'Весь бренд'}
          </span>
        </p>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 px-2.5 text-[9px]"
          onClick={() => setIsGlobalSearchOpen?.(true)}
        >
          <Search className="h-3.5 w-3.5" /> Поиск{' '}
          <kbd className="bg-bg-surface2 ml-0.5 rounded px-1 py-0.5 font-mono text-[8px]">
            ⌘K
          </kbd>
        </Button>
        {selectedContext !== 'brand' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => resetToBrand?.()}
            className="h-4.5 bg-bg-surface2 rounded-md px-1.5 text-[8px] font-bold uppercase transition-all hover:bg-black hover:text-white"
          >
            Сбросить
          </Button>
        )}
      </div>
    </div>
  );
}
