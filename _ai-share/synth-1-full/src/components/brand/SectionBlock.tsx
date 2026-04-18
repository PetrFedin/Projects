'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Info, History, ChevronDown, ChevronRight, Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  type SectionBlockAccentTone,
  getSectionBlockAccentBarClass,
} from '@/lib/ui/semantic-data-tones';

const SECTION_STORAGE_KEY = 'brand-section-state'; // shared with CollapsibleSection

type SectionState = { pinned: boolean; open: boolean };

function getStoredState(sectionId: string, defaultPinned = true, defaultOpen = true): SectionState {
  if (typeof window === 'undefined') return { pinned: defaultPinned, open: defaultOpen };
  try {
    const raw = localStorage.getItem(SECTION_STORAGE_KEY);
    const all: Record<string, SectionState> = raw ? JSON.parse(raw) : {};
    const stored = all[sectionId];
    if (stored) return stored.pinned ? stored : { ...stored, open: false };
    return { pinned: defaultPinned, open: defaultOpen };
  } catch {
    return { pinned: defaultPinned, open: defaultOpen };
  }
}

function saveSectionState(sectionId: string, state: SectionState) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(SECTION_STORAGE_KEY);
    const all: Record<string, SectionState> = raw ? JSON.parse(raw) : {};
    all[sectionId] = state;
    localStorage.setItem(SECTION_STORAGE_KEY, JSON.stringify(all));
  } catch {}
}

export type HistoryEntry = {
  id: string;
  action: 'appeared' | 'dismissed' | 'changed' | 'activity';
  label: string;
  author: string;
  timestamp: number;
  /** Блок/подраздел, к которому относится запись */
  blockLabel?: string;
};

export type SectionMeta = {
  /** Краткое описание раздела */
  description: string;
  /** Цель раздела — зачем он нужен */
  purpose: string;
  /** Функционал — что предлагает */
  functionality: string[];
  /** Важность от 1 до 10 */
  importance: number;
};

type SectionBlockProps = {
  title: string;
  meta: SectionMeta;
  accentColor?: SectionBlockAccentTone;
  children: React.ReactNode;
  className?: string;
  /** История действий раздела — при наличии показывается иконка История */
  history?: HistoryEntry[];
  /** ID для сохранения состояния свернуть/гвоздик в localStorage */
  sectionId?: string;
};

function formatHistoryTime(ts: number): string {
  const d = new Date(ts);
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60000) return 'только что';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч назад`;
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function slugify(s: string): string {
  return s.replace(/\s+/g, '-').replace(/[/\\?*"<>|]/g, '');
}

export function SectionBlock({
  title,
  meta,
  accentColor = 'indigo',
  children,
  className,
  history = [],
  sectionId,
}: SectionBlockProps) {
  const id = sectionId ?? `section-${slugify(title)}`;
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<SectionState>(() => getStoredState(id, true, true));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) setState(getStoredState(id, true, true));
  }, [id, mounted]);

  const updateState = useCallback(
    (patch: Partial<SectionState>) => {
      setState((prev) => {
        const next = { ...prev, ...patch };
        if (typeof window !== 'undefined') saveSectionState(id, next);
        return next;
      });
    },
    [id]
  );

  const toggleOpen = useCallback(
    () => updateState({ open: !state.open }),
    [state.open, updateState]
  );
  const togglePin = useCallback(() => {
    const newPinned = !state.pinned;
    updateState({ pinned: newPinned, open: newPinned ? state.open : false });
  }, [state.pinned, state.open, updateState]);

  const isOpen = state.open;
  const isPinned = state.pinned;

  const header = (
    <div className="flex min-w-0 items-center justify-between gap-3 px-2">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="group flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-left transition-opacity hover:opacity-80"
        >
          <div
            className={cn(
              'h-3.5 w-1 shrink-0 rounded-full',
              getSectionBlockAccentBarClass(accentColor)
            )}
          />
          <h2 className="text-text-secondary truncate text-[10px] font-black uppercase tracking-[0.2em]">
            {title}
          </h2>
          {isOpen ? (
            <ChevronDown className="text-text-muted h-4 w-4 shrink-0" />
          ) : (
            <ChevronRight className="text-text-muted h-4 w-4 shrink-0" />
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
          title={isPinned ? 'Закреплено' : 'Закрепить'}
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
        {history.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 h-7 w-7 rounded-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <History className="h-3.5 w-3.5" />
                <span className="sr-only">История раздела</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="border-border-default max-h-[360px] w-96 overflow-y-auto rounded-xl p-4 shadow-xl"
            >
              <p className="text-accent-primary mb-1 text-[9px] font-black uppercase tracking-widest">
                История
              </p>
              <p className="text-text-secondary mb-3 text-[9px]">
                Все действия в разделе с детализацией
              </p>
              <div className="space-y-2">
                {history.map((e) => (
                  <div key={e.id} className="flex items-start gap-2 text-[10px]">
                    <span
                      className={cn(
                        'shrink-0 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase',
                        e.action === 'appeared' && 'bg-bg-surface2 text-text-secondary',
                        e.action === 'dismissed' && 'bg-emerald-100 text-emerald-700',
                        e.action === 'changed' && 'bg-amber-100 text-amber-700',
                        e.action === 'activity' && 'bg-accent-primary/15 text-accent-primary'
                      )}
                    >
                      {e.action === 'appeared' && 'появилось'}
                      {e.action === 'dismissed' && 'устранено'}
                      {e.action === 'changed' && 'изменено'}
                      {e.action === 'activity' && 'активность'}
                    </span>
                    <div className="min-w-0 flex-1">
                      {e.blockLabel && (
                        <p className="text-text-secondary truncate text-[8px] font-bold uppercase">
                          {e.blockLabel}
                        </p>
                      )}
                      <p className="text-text-primary break-words">{e.label}</p>
                      <p className="text-text-muted text-[8px]">
                        {e.author} · {formatHistoryTime(e.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 h-7 w-7 shrink-0 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Info className="h-3.5 w-3.5" />
              <span className="sr-only">Описание раздела</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="border-border-default w-80 rounded-xl p-4 shadow-xl"
          >
            <div className="space-y-3">
              <div>
                <p className="text-accent-primary mb-1 text-[9px] font-black uppercase tracking-widest">
                  Описание
                </p>
                <p className="text-text-primary text-[11px] leading-relaxed">{meta.description}</p>
              </div>
              <div>
                <p className="text-accent-primary mb-1 text-[9px] font-black uppercase tracking-widest">
                  Цель
                </p>
                <p className="text-text-primary text-[11px] leading-relaxed">{meta.purpose}</p>
              </div>
              <div>
                <p className="text-accent-primary mb-1 text-[9px] font-black uppercase tracking-widest">
                  Функционал
                </p>
                <ul className="text-text-primary list-inside list-disc space-y-1 text-[11px]">
                  {meta.functionality.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="border-border-subtle flex items-center justify-between border-t pt-2">
                <span className="text-text-secondary text-[9px] font-black uppercase">
                  Важность
                </span>
                <span className="text-accent-primary text-sm font-black">{meta.importance}/10</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => updateState({ open })}
      className={cn('space-y-3', className)}
    >
      {header}
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
