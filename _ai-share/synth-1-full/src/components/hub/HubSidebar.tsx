'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

type NavLink = {
  href: string;
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  subsections?: { href: string; label: string; value: string }[];
};
type NavGroup = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  links: NavLink[];
};

function pathFromHref(href: string): string {
  return (href.split('?')[0] || '').replace(/\/$/, '') || '/';
}

function isLinkActive(link: NavLink, pathname: string, basePath: string): boolean {
  const href = link.href ?? '';
  const path = pathname.replace(/\/$/, '') || '/';
  const norm = pathFromHref(href);
  if (norm === basePath) return path === basePath;
  if (path === norm || path.startsWith(norm + '/')) return true;
  const subs = link.subsections;
  return !!subs?.some((s) => path === pathFromHref(s.href) || path.startsWith(pathFromHref(s.href) + '/'));
}

function hasSubsections(link: NavLink): link is NavLink & { subsections: { href: string; label: string; value: string }[] } {
  return !!(link.subsections?.length);
}

export function HubSidebar({
  groups,
  basePath,
  accentClass = 'text-slate-900',
  activeBgClass = 'bg-slate-900',
  className,
  onNavigate,
}: {
  groups: NavGroup[];
  basePath: string;
  accentClass?: string;
  activeBgClass?: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeGroupId = groups.find((g) => g.links.some((l) => isLinkActive(l, pathname || '', basePath)))?.id;
  const activeLinkValue = groups.flatMap((g) => g.links).find((l) => isLinkActive(l, pathname || '', basePath))?.value;

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
    <nav className={cn('flex flex-col h-full overflow-y-auto scrollbar-hide', className)}>
      <div className="p-2 space-y-0.5">
        {groups.map((group) => {
          const isGroupActive = activeGroupId === group.id;
          return (
            <div key={group.id} className="mb-3 last:mb-0">
              <Collapsible open={openGroups.has(group.id)} onOpenChange={(open) => setGroupOpen(group.id, open)}>
                <CollapsibleTrigger
                  className={cn(
                    'group/trigger flex w-full items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-left hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-50'
                  )}
                >
                  <group.icon className={cn('h-4 w-4 shrink-0', isGroupActive ? accentClass : 'text-slate-400')} />
                  <span className={cn('truncate flex-1', isGroupActive ? 'text-slate-900' : 'text-slate-600')}>{group.label}</span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-data-[state=open]/trigger:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pl-2 pr-1 pt-0.5 pb-2 space-y-0.5 border-l border-slate-100 ml-3">
                    {group.links.map((link) => {
                      const active = isLinkActive(link, pathname || '', basePath);
                      const subs = hasSubsections(link) ? link.subsections : [];

                      if (subs.length > 0) {
                        return (
                          <Collapsible key={link.value} open={openLinks.has(link.value)} onOpenChange={(open) => setLinkOpen(link.value, open)}>
                            <CollapsibleTrigger asChild>
                              <div
                                className={cn(
                                  'group/sub flex items-center gap-2 px-2.5 py-1.5 rounded-md cursor-pointer text-[9px] font-bold uppercase tracking-wider transition-colors',
                                  active ? `${activeBgClass} text-white` : 'text-slate-600 hover:bg-slate-50'
                                )}
                              >
                                <link.icon className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate flex-1">{link.label}</span>
                                <ChevronRight className="h-3 w-3 shrink-0 transition-transform group-data-[state=open]/sub:rotate-90" />
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="pl-4 pt-0.5 pb-1 space-y-0.5">
                                {subs.map((sub) => {
                                  const pathMatch = (pathname || '').replace(/\/$/, '') === pathFromHref(sub.href);
                                  const qs = sub.href.includes('?') ? sub.href.split('?')[1] : '';
                                  const queryMatch = !qs || Array.from(new URLSearchParams(qs)).every(([k, v]) => searchParams?.get(k) === v);
                                  const subIsActive = pathMatch && queryMatch;
                                  return (
                                    <Link
                                      key={sub.value}
                                      href={sub.href}
                                      onClick={onNavigate}
                                      className={cn(
                                        'block px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider truncate transition-colors',
                                        subIsActive ? `${activeBgClass} text-white` : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
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
                          href={link.href}
                          onClick={onNavigate}
                          className={cn(
                            'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors',
                            active ? `${activeBgClass} text-white` : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          )}
                        >
                          <link.icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate flex-1">{link.label}</span>
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
