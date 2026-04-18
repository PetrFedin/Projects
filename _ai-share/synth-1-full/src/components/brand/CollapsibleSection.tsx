'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight, Pin, PinOff } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'brand-section-state';

type SectionState = { pinned: boolean; open: boolean };

function getStoredState(sectionId: string, defaultPinned = true, defaultOpen = true): SectionState {
  if (typeof window === 'undefined') return { pinned: defaultPinned, open: defaultOpen };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: Record<string, SectionState> = raw ? JSON.parse(raw) : {};
    const stored = all[sectionId];
    if (stored) {
      // Если снят гвоздик — по умолчанию сворачиваем
      return stored.pinned ? stored : { ...stored, open: false };
    }
    return { pinned: defaultPinned, open: defaultOpen };
  } catch {
    return { pinned: defaultPinned, open: defaultOpen };
  }
}

function saveState(sectionId: string, state: SectionState) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: Record<string, SectionState> = raw ? JSON.parse(raw) : {};
    all[sectionId] = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function CollapsibleSection({
  id,
  title,
  barColor = 'bg-accent-primary',
  children,
  defaultPinned = true,
  defaultOpen = true,
  className,
  fillHeight = false,
}: {
  id: string;
  title: string;
  barColor?: string;
  children: React.ReactNode;
  defaultPinned?: boolean;
  defaultOpen?: boolean;
  className?: string;
  fillHeight?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<SectionState>(() =>
    getStoredState(id, defaultPinned, defaultOpen)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setState(getStoredState(id, defaultPinned, defaultOpen));
    }
  }, [id, mounted, defaultPinned, defaultOpen]);

  const updateState = useCallback(
    (patch: Partial<SectionState>) => {
      setState((prev) => {
        const next = { ...prev, ...patch };
        if (mounted) saveState(id, next);
        return next;
      });
    },
    [id, mounted]
  );

  const toggleOpen = useCallback(() => {
    updateState({ open: !state.open });
  }, [state.open, updateState]);

  const togglePin = useCallback(() => {
    const newPinned = !state.pinned;
    updateState({
      pinned: newPinned,
      // При снятии гвоздика — сворачиваем; при закреплении — оставляем текущее
      open: newPinned ? state.open : false,
    });
  }, [state.pinned, state.open, updateState]);

  const isOpen = state.open;
  const isPinned = state.pinned;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => updateState({ open })}
      className={cn(fillHeight ? 'flex h-full min-h-0 flex-col' : 'space-y-3', className)}
    >
      <div className="flex shrink-0 items-center justify-between gap-3">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="group flex min-w-0 items-center gap-2 text-left transition-opacity hover:opacity-80"
          >
            <div className={cn('h-3.5 w-1 shrink-0 rounded-full', barColor)} />
            <h2 className="text-text-secondary truncate text-[10px] font-black uppercase tracking-[0.2em]">
              {title}
            </h2>
            {isOpen ? (
              <ChevronDown className="text-text-muted ml-1 h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="text-text-muted ml-1 h-4 w-4 shrink-0" />
            )}
          </button>
        </CollapsibleTrigger>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-7 w-7 rounded-lg',
              isPinned
                ? 'text-accent-primary hover:text-accent-primary'
                : 'text-text-muted hover:text-text-secondary'
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              togglePin();
            }}
            title={
              isPinned
                ? 'Закреплено — состояние сохраняется'
                : 'Закрепить — показывать по умолчанию'
            }
          >
            {isPinned ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-text-muted hover:text-text-secondary h-7 w-7 rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleOpen();
            }}
            title={isOpen ? 'Свернуть' : 'Развернуть'}
          >
            {isOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
      <CollapsibleContent className={cn(fillHeight && 'flex min-h-0 flex-1 flex-col')}>
        <div className={cn('pt-1', fillHeight && 'flex min-h-0 flex-1 flex-col')}>{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
