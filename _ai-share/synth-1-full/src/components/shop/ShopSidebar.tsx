'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { shopNavGroups } from '@/lib/data/shop-navigation-normalized';

type NavGroup = (typeof shopNavGroups)[number];
type NavLink = NavGroup['links'][number];

function pathFromHref(href: string): string {
  return (href.split('?')[0] || '').replace(/\/$/, '') || '/';
}

function isLinkActive(link: NavLink, pathname: string): boolean {
  const href = (link as { href?: string }).href ?? '';
  const path = pathname.replace(/\/$/, '') || '/';
  const norm = pathFromHref(href);
  if (norm === '/shop') return path === '/shop';
  if (path === norm || path.startsWith(norm + '/')) return true;
  const subs = (link as { subsections?: { href: string }[] }).subsections;
  return !!subs?.some(
    (s) => path === pathFromHref(s.href) || path.startsWith(pathFromHref(s.href) + '/')
  );
}

function hasSubsections(
  link: NavLink
): link is NavLink & { subsections: { href: string; label: string; value: string }[] } {
  return !!(link as { subsections?: unknown[] }).subsections?.length;
}

function hasHref(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

export function ShopSidebar({
  groups,
  className,
  onNavigate,
}: {
  groups: NavGroup[];
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeGroupId = groups.find((g) =>
    g.links.some((l) => isLinkActive(l, pathname || ''))
  )?.id;
  const activeLinkValue = groups
    .flatMap((g) => g.links)
    .find((l) => isLinkActive(l, pathname || ''))?.value;

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set());
  const [openLinks, setOpenLinks] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (activeGroupId) setOpenGroups((prev) => new Set([...prev, activeGroupId]));
    if (activeLinkValue) setOpenLinks((prev) => new Set([...prev, activeLinkValue]));
  }, [activeGroupId, activeLinkValue]);

  const setGroupOpen = (id: string, open: boolean) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const setLinkOpen = (value: string, open: boolean) => {
    setOpenLinks((prev) => {
      const next = new Set(prev);
      if (open) next.add(value);
      else next.delete(value);
      return next;
    });
  };

  return (
    <nav
      className={cn(
<<<<<<< HEAD
        'scrollbar-hide flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white',
=======
        'border-border-default scrollbar-hide flex h-full flex-col overflow-y-auto border-r bg-white',
>>>>>>> recover/cabinet-wip-from-stash
        className
      )}
    >
      <div className="space-y-0.5 p-2">
        {groups.map((group) => {
          const isGroupActive = activeGroupId === group.id;
          return (
            <div key={group.id} className="mb-3 last:mb-0">
              <Collapsible
                key={group.id}
                open={openGroups.has(group.id)}
                onOpenChange={(open) => setGroupOpen(group.id, open)}
                className="group/coll"
              >
                <CollapsibleTrigger
                  className={cn(
<<<<<<< HEAD
                    'group/trigger flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 data-[state=open]:bg-slate-50'
=======
                    'group/trigger hover:bg-bg-surface2 data-[state=open]:bg-bg-surface2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest transition-colors'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  <group.icon
                    className={cn(
                      'h-4 w-4 shrink-0',
<<<<<<< HEAD
                      isGroupActive ? 'text-rose-600' : 'text-slate-400'
=======
                      isGroupActive ? 'text-rose-600' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  />
                  <span
                    className={cn(
                      'flex-1 truncate',
<<<<<<< HEAD
                      isGroupActive ? 'text-slate-900' : 'text-slate-600'
=======
                      isGroupActive ? 'text-text-primary' : 'text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    {group.label}
                  </span>
                  <ChevronDown className="text-text-muted h-3.5 w-3.5 shrink-0 transition-transform group-data-[state=open]/trigger:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
<<<<<<< HEAD
                  <div className="ml-3 space-y-0.5 border-l border-slate-100 pb-2 pl-2 pr-1 pt-0.5">
=======
                  <div className="border-border-subtle ml-3 space-y-0.5 border-l pb-2 pl-2 pr-1 pt-0.5">
>>>>>>> recover/cabinet-wip-from-stash
                    {group.links.map((link) => {
                      const linkHref = (link as { href?: string }).href;
                      if (!hasHref(linkHref)) return null;
                      const active = isLinkActive(link, pathname || '');
                      const subs = hasSubsections(link)
                        ? link.subsections.filter((sub) => hasHref(sub.href))
                        : [];

                      if (subs.length > 0) {
                        return (
                          <Collapsible
                            key={link.value}
                            open={openLinks.has(link.value)}
                            onOpenChange={(open) => setLinkOpen(link.value, open)}
                          >
                            <CollapsibleTrigger asChild>
                              <div
                                className={cn(
                                  'group/sub flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors',
                                  active
                                    ? 'bg-rose-50 text-rose-700'
<<<<<<< HEAD
                                    : 'text-slate-600 hover:bg-slate-50'
=======
                                    : 'text-text-secondary hover:bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
                                )}
                              >
                                <link.icon className="h-3.5 w-3.5 shrink-0" />
                                <span className="flex-1 truncate">{link.label}</span>
                                <ChevronRight className="h-3 w-3 shrink-0 transition-transform group-data-[state=open]/sub:rotate-90" />
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="space-y-0.5 pb-1 pl-4 pt-0.5">
                                {subs.map((sub) => {
                                  const pathMatch =
                                    (pathname || '').replace(/\/$/, '') === pathFromHref(sub.href);
                                  const qs = sub.href.includes('?') ? sub.href.split('?')[1] : '';
                                  const queryMatch =
                                    !qs ||
                                    Array.from(new URLSearchParams(qs)).every(
                                      ([k, v]) => searchParams?.get(k) === v
                                    );
                                  const subIsActive = pathMatch && queryMatch;
                                  return (
                                    <Link
                                      key={sub.value}
                                      href={sub.href}
                                      onClick={onNavigate}
                                      className={cn(
                                        'block truncate rounded px-2 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors',
                                        subIsActive
<<<<<<< HEAD
                                          ? 'bg-slate-900 text-white'
                                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
=======
                                          ? 'bg-text-primary text-white'
                                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
                                      )}
                                    >
                                      {sub.label}
                                    </Link>
                                  );
                                })}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      }

                      return (
                        <Link
                          key={link.value}
                          href={linkHref}
                          onClick={onNavigate}
                          className={cn(
                            'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors',
                            active
<<<<<<< HEAD
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
=======
                              ? 'bg-text-primary text-white'
                              : 'text-text-secondary hover:bg-bg-surface2 hover:text-text-primary'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        >
                          <link.icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="flex-1 truncate">{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
