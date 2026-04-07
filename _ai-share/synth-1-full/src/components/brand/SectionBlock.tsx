'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Info, History, ChevronDown, ChevronRight, Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

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
  accentColor?: 'indigo' | 'slate' | 'rose' | 'blue' | 'emerald' | 'amber';
  children: React.ReactNode;
  className?: string;
  /** История действий раздела — при наличии показывается иконка История */
  history?: HistoryEntry[];
  /** ID для сохранения состояния свернуть/гвоздик в localStorage */
  sectionId?: string;
};

const ACCENT = {
  indigo: 'bg-indigo-600',
  slate: 'bg-slate-900',
  rose: 'bg-rose-600',
  blue: 'bg-blue-600',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-600',
};

function formatHistoryTime(ts: number): string {
  const d = new Date(ts);
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60000) return 'только что';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч назад`;
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
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

  const updateState = useCallback((patch: Partial<SectionState>) => {
    setState(prev => {
      const next = { ...prev, ...patch };
      if (typeof window !== 'undefined') saveSectionState(id, next);
      return next;
    });
  }, [id]);

  const toggleOpen = useCallback(() => updateState({ open: !state.open }), [state.open, updateState]);
  const togglePin = useCallback(() => {
    const newPinned = !state.pinned;
    updateState({ pinned: newPinned, open: newPinned ? state.open : false });
  }, [state.pinned, state.open, updateState]);

  const isOpen = state.open;
  const isPinned = state.pinned;

  const header = (
    <div className="flex items-center justify-between gap-3 px-2 min-w-0">
      <CollapsibleTrigger asChild>
        <button type="button" className="flex items-center gap-2 min-w-0 overflow-hidden group hover:opacity-80 transition-opacity text-left flex-1">
          <div className={cn('h-3.5 w-1 rounded-full shrink-0', ACCENT[accentColor])} />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 truncate">
            {title}
          </h2>
          {isOpen ? <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" /> : <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />}
        </button>
      </CollapsibleTrigger>
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-7 w-7 rounded-lg', isPinned ? 'text-indigo-600 hover:text-indigo-700' : 'text-slate-300 hover:text-slate-500')}
          onClick={e => { e.preventDefault(); e.stopPropagation(); togglePin(); }}
          title={isPinned ? 'Закреплено' : 'Закрепить'}
        >
          {isPinned ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600"
          onClick={e => { e.preventDefault(); e.stopPropagation(); toggleOpen(); }}
          title={isOpen ? 'Свернуть' : 'Развернуть'}
        >
          {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </Button>
        {history.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={e => e.stopPropagation()}>
                <History className="h-3.5 w-3.5" />
                <span className="sr-only">История раздела</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96 p-4 rounded-xl border-slate-200 shadow-xl max-h-[360px] overflow-y-auto">
              <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600 mb-1">История</p>
              <p className="text-[9px] text-slate-500 mb-3">Все действия в разделе с детализацией</p>
              <div className="space-y-2">
                {history.map((e) => (
                  <div key={e.id} className="flex items-start gap-2 text-[10px]">
                    <span className={cn('shrink-0 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase',
                      e.action === 'appeared' && 'bg-slate-100 text-slate-600',
                      e.action === 'dismissed' && 'bg-emerald-100 text-emerald-700',
                      e.action === 'changed' && 'bg-amber-100 text-amber-700',
                      e.action === 'activity' && 'bg-indigo-100 text-indigo-700'
                    )}>
                      {e.action === 'appeared' && 'появилось'}
                      {e.action === 'dismissed' && 'устранено'}
                      {e.action === 'changed' && 'изменено'}
                      {e.action === 'activity' && 'активность'}
                    </span>
                    <div className="flex-1 min-w-0">
                      {e.blockLabel && <p className="text-[8px] font-bold text-slate-500 uppercase truncate">{e.blockLabel}</p>}
                      <p className="text-slate-700 break-words">{e.label}</p>
                      <p className="text-[8px] text-slate-400">{e.author} · {formatHistoryTime(e.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 shrink-0" onClick={e => e.stopPropagation()}>
              <Info className="h-3.5 w-3.5" />
              <span className="sr-only">Описание раздела</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-4 rounded-xl border-slate-200 shadow-xl">
            <div className="space-y-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600 mb-1">Описание</p>
                <p className="text-[11px] text-slate-700 leading-relaxed">{meta.description}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600 mb-1">Цель</p>
                <p className="text-[11px] text-slate-700 leading-relaxed">{meta.purpose}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600 mb-1">Функционал</p>
                <ul className="text-[11px] text-slate-700 space-y-1 list-disc list-inside">
                  {meta.functionality.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-slate-500">Важность</span>
                <span className="text-sm font-black text-indigo-600">{meta.importance}/10</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  return (
    <Collapsible open={isOpen} onOpenChange={open => updateState({ open })} className={cn('space-y-3', className)}>
      {header}
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
