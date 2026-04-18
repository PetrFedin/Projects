'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, Star, MessageSquare } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useNavPins } from '@/hooks/use-nav-pins';
import { NAV_GROUP_CLUSTERS, type brandNavGroups } from '@/lib/data/brand-navigation';

type NavGroup = (typeof brandNavGroups)[number];
type ClusterId = (typeof NAV_GROUP_CLUSTERS)[number]['id'];
type NavLink = NavGroup['links'][number];

/** Совпадение href с path + query: ссылки с ?… требуют тех же параметров в URL (напр. Цех 2 vs Цех). */
function hrefMatchScore(href: string, path: string, sp: URLSearchParams): number {
  const qIdx = href.indexOf('?');
  const pathPart = (qIdx >= 0 ? href.slice(0, qIdx) : href).replace(/\/$/, '') || '/';
  const queryPart = qIdx >= 0 ? href.slice(qIdx + 1) : '';
  if (pathPart === '/brand') {
    return path === '/brand' ? pathPart.length : -1;
  }
  if (path !== pathPart && !path.startsWith(`${pathPart}/`)) return -1;
  const base = pathPart.length;
  if (!queryPart) return base;
  const req = new URLSearchParams(queryPart);
  for (const [k, v] of req.entries()) {
    if (sp.get(k) !== v) return -1;
  }
  return base + 1000 + queryPart.length;
}

/** Длина самого длинного префикса ссылки, совпадающего с path (-1 = нет совпадения). */
function linkMatchSpecificity(link: NavLink, path: string, sp: URLSearchParams): number {
  const href = (link as { href?: string }).href ?? '';
  let max = hrefMatchScore(href, path, sp);
  const subsections = (link as { subsections?: { href: string }[] }).subsections;
  for (const s of subsections ?? []) {
    max = Math.max(max, hrefMatchScore(s.href, path, sp));
  }
  return max;
}

function isLinkActive(link: NavLink, winnerValue: string | undefined): boolean {
  if (winnerValue === undefined) return false;
  return link.value === winnerValue;
}

/** Из всех совпадений по префиксу оставляем самое узкое (длинный href), иначе /brand/analytics подсвечивается вместе с /brand/analytics/budget-actual. */
function resolveMostSpecificActiveLink(
  allLinks: NavLink[],
  pathname: string,
  sp: URLSearchParams
): NavLink | undefined {
  const path = pathname.replace(/\/$/, '') || '/';
  let best: NavLink | undefined;
  let bestScore = -1;
  for (const link of allLinks) {
    const score = linkMatchSpecificity(link, path, sp);
    if (score > bestScore) {
      bestScore = score;
      best = link;
    }
  }
  return bestScore >= 0 ? best : undefined;
}

function NavLinkActions({ linkKey, onNavigate }: { linkKey: string; onNavigate?: () => void }) {
  const { pins, togglePin, setReminder } = useNavPins();
  const [reminderInput, setReminderInput] = useState('');
  const entry = pins[linkKey];
  const isPinned = entry?.pinned ?? false;
  const reminder = entry?.reminder ?? '';

  return (
    <div
      className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/sub:opacity-100 group-hover/subitem:opacity-100"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          togglePin(linkKey);
        }}
        className={cn(
          'rounded p-0.5 transition-colors hover:bg-slate-200',
          isPinned && 'text-amber-500'
        )}
        title={isPinned ? 'Открепить' : 'Закрепить (важный)'}
        aria-label={isPinned ? 'Открепить' : 'Закрепить'}
      >
        <Star className={cn('h-3 w-3', isPinned ? 'fill-current' : '')} />
      </button>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setReminderInput(reminder);
            }}
            className={cn(
              'rounded p-0.5 transition-colors hover:bg-slate-200',
              reminder && 'text-indigo-500'
            )}
            title={reminder || 'Добавить напоминание'}
            aria-label="Напоминание"
          >
            <MessageSquare className="h-3 w-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-2" onClick={(e) => e.stopPropagation()}>
          <Input
            placeholder="Напоминание..."
            value={reminderInput}
            onChange={(e) => setReminderInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              (setReminder(linkKey, reminderInput || undefined), setReminderInput(''))
            }
            className="h-7 text-[10px]"
          />
          <div className="mt-2 flex gap-1">
            <Button
              size="sm"
              className="h-6 text-[9px]"
              onClick={() => {
                setReminder(linkKey, reminderInput || undefined);
                setReminderInput('');
              }}
            >
              Сохранить
            </Button>
            {reminder && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[9px]"
                onClick={() => {
                  setReminder(linkKey, undefined);
                  setReminderInput('');
                }}
              >
                Удалить
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function BrandSidebar({
  groups,
  businessMode,
  className,
  onNavigate,
}: {
  groups: NavGroup[];
  secondaryItems?: unknown[];
  businessMode: 'b2b' | 'b2c';
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filtered = groups.filter((g) => g.scope === 'shared' || g.scope === businessMode);
  const { pins } = useNavPins();

  const groupsByCluster = NAV_GROUP_CLUSTERS.reduce<Record<ClusterId, NavGroup[]>>(
    (acc, c) => {
      acc[c.id] = filtered.filter(
        (g) => (g as NavGroup & { clusterId?: ClusterId }).clusterId === c.id
      );
      return acc;
    },
    {} as Record<ClusterId, NavGroup[]>
  );

  const flatLinks = filtered.flatMap((g) => g.links);
  const sp = useMemo(() => new URLSearchParams(searchParams?.toString() ?? ''), [searchParams]);
  const resolvedActive = resolveMostSpecificActiveLink(flatLinks, pathname || '', sp);
  const activeLinkValue = resolvedActive?.value;
  const activeGroupId = resolvedActive
    ? filtered.find((g) => g.links.some((l) => l.value === resolvedActive.value))?.id
    : undefined;

  const groupIdsKey = useMemo(() => groups.map((g) => g.id).join('|'), [groups]);

  /** По умолчанию все группы развёрнуты — иначе ссылки скрыты в Collapsible и кажется, что навигация «не работает». */
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set(groups.map((g) => g.id)));

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      let changed = false;
      for (const g of groups) {
        if (!next.has(g.id)) {
          next.add(g.id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
    // Только при смене набора групп (B2B/B2C), не при каждом re-render родителя
    // eslint-disable-next-line react-hooks/exhaustive-deps -- groups читаем при изменении groupIdsKey
  }, [groupIdsKey]);

  useEffect(() => {
    if (activeGroupId) setOpenGroups((prev) => new Set([...prev, activeGroupId]));
  }, [activeGroupId, activeLinkValue]);

  const setGroupOpen = (id: string, open: boolean) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <nav
      className={cn(
        'scrollbar-hide flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white',
        className
      )}
    >
      <div className="space-y-0.5 p-2">
        {NAV_GROUP_CLUSTERS.map((cluster) => {
          const clusterGroups = groupsByCluster[cluster.id].filter(Boolean);
          if (clusterGroups.length === 0) return null;

          return (
            <div key={cluster.id} className="mb-4 last:mb-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5">
                <div className="h-0.5 min-w-2 flex-1 rounded-full bg-slate-100" />
                <span className="shrink-0 text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">
                  {cluster.label}
                </span>
                <div className="h-0.5 min-w-2 flex-1 rounded-full bg-slate-100" />
              </div>
              <div className="mt-0.5 space-y-0.5">
                {clusterGroups.map((group) => {
                  const isGroupActive = activeGroupId === group.id;

                  return (
                    <Collapsible
                      key={group.id}
                      open={openGroups.has(group.id)}
                      onOpenChange={(open) => setGroupOpen(group.id, open)}
                      className="group/coll"
                    >
                      <CollapsibleTrigger className="group/trigger flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 data-[state=open]:bg-slate-50">
                        <group.icon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            isGroupActive ? 'text-indigo-600' : 'text-slate-400'
                          )}
                        />
                        <span
                          className={cn(
                            'flex-1 truncate',
                            isGroupActive ? 'text-slate-900' : 'text-slate-600'
                          )}
                        >
                          {group.label}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-data-[state=open]/trigger:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-3 space-y-0.5 border-l border-slate-100 pb-2 pl-2 pr-1 pt-0.5">
                          {group.links.map((link) => {
                            const active = isLinkActive(link, activeLinkValue);

                            return (
                              <div
                                key={link.value}
                                className={cn(
                                  'group/sub flex',
                                  pins[link.value]?.pinned &&
                                    'rounded-md bg-amber-50/50 ring-1 ring-amber-200'
                                )}
                              >
                                <Link
                                  href={(link as { href: string }).href}
                                  onClick={onNavigate}
                                  className={cn(
                                    'flex flex-1 items-center gap-2 rounded-md px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors',
                                    active
                                      ? 'bg-slate-900 text-white'
                                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                  )}
                                >
                                  <link.icon className="h-3.5 w-3.5 shrink-0" />
                                  <span className="flex-1 truncate">{link.label}</span>
                                </Link>
                                <NavLinkActions linkKey={link.value} onNavigate={onNavigate} />
                              </div>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
