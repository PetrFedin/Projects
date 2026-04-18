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
  return !!subs?.some(
    (s) => path === pathFromHref(s.href) || path.startsWith(pathFromHref(s.href) + '/')
  );
}

function hasSubsections(
  link: NavLink
): link is NavLink & { subsections: { href: string; label: string; value: string }[] } {
  return !!link.subsections?.length;
}

export function HubSidebar({
  groups,
  basePath,
  accentClass = 'text-text-primary',
  activeBgClass = 'bg-text-primary',
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

  const activeGroupId = groups.find((g) =>
    g.links.some((l) => isLinkActive(l, pathname || '', basePath))
  )?.id;
  const activeLinkValue = groups
    .flatMap((g) => g.links)
    .find((l) => isLinkActive(l, pathname || '', basePath))?.value;

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
    <nav className={cn('scrollbar-hide flex h-full flex-col overflow-y-auto', className)}>
      <div className="space-y-0.5 p-2">
        {groups.map((group, groupIndex) => {
          const isGroupActive = activeGroupId === group.id;
          const GroupIcon = group.icon;
          return (
            <div key={`${group.id}-${groupIndex}`} className="mb-3 last:mb-0">
              <Collapsible
                open={openGroups.has(group.id)}
                onOpenChange={(open) => setGroupOpen(group.id, open)}
              >
                <CollapsibleTrigger
                  className={cn(
                    'group/trigger hover:bg-bg-surface2 data-[state=open]:bg-bg-surface2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest transition-colors'
                  )}
                >
                  {GroupIcon ? (
                    <GroupIcon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isGroupActive ? accentClass : 'text-text-muted'
                      )}
                    />
                  ) : (
                    <span className="bg-bg-surface2 h-4 w-4 shrink-0 rounded" aria-hidden />
                  )}
                  <span
                    className={cn(
                      'flex-1 truncate',
                      isGroupActive ? 'text-text-primary' : 'text-text-secondary'
                    )}
                  >
                    {group.label}
                  </span>
                  <ChevronDown className="text-text-muted h-3.5 w-3.5 shrink-0 transition-transform group-data-[state=open]/trigger:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-border-subtle ml-3 space-y-0.5 border-l pb-2 pl-2 pr-1 pt-0.5">
                    {group.links.map((link) => {
                      const active = isLinkActive(link, pathname || '', basePath);
                      const subs = hasSubsections(link) ? link.subsections : [];
                      const LinkIcon = link.icon;

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
                                    ? `${activeBgClass} text-white`
                                    : 'text-text-secondary hover:bg-bg-surface2'
                                )}
                              >
                                {LinkIcon ? (
                                  <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                                ) : (
                                  <span
                                    className="bg-bg-surface2 h-3.5 w-3.5 shrink-0 rounded"
                                    aria-hidden
                                  />
                                )}
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
                                          ? `${activeBgClass} text-white`
                                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface2'
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
                            'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors',
                            active
                              ? `${activeBgClass} text-white`
                              : 'text-text-secondary hover:bg-bg-surface2 hover:text-text-primary'
                          )}
                        >
                          {LinkIcon ? (
                            <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <span
                              className="bg-bg-surface2 h-3.5 w-3.5 shrink-0 rounded"
                              aria-hidden
                            />
                          )}
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
