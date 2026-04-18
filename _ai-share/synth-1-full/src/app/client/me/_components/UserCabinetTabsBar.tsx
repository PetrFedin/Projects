'use client';

import type { ElementType } from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export type UserCabinetTabItem = {
  value: string;
  icon: ElementType<{ className?: string }>;
  label: string;
  count?: number;
  /** `default` — акцентный бейдж (как «Capital» с баллами). */
  badgeVariant?: 'default' | 'secondary';
  iconColor?: string;
};

export type UserCabinetTabsBarProps = {
  tabs: UserCabinetTabItem[];
  /** Для e2e / автоматизации горизонтального списка вкладок. */
  scrollAreaTestId?: string;
  className?: string;
};

const triggerBase =
  'relative h-7 rounded-lg border border-transparent px-4 text-[9px] font-bold uppercase tracking-widest transition-all ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
  'data-[state=active]:border-border-subtle data-[state=active]:bg-bg-surface data-[state=active]:text-accent-primary data-[state=active]:shadow-sm';

const tabsListClass =
  'inline-flex h-9 w-auto gap-0.5 rounded-xl border border-border-subtle bg-bg-surface2 p-1 shadow-inner';

/**
 * Горизонтальный скролл основных вкладок кабинета — единые токены вместо legacy slate/indigo.
 */
export function UserCabinetTabsBar({ tabs, scrollAreaTestId, className }: UserCabinetTabsBarProps) {
  return (
    <ScrollArea
      className={cn('w-full whitespace-nowrap pb-2', className)}
      data-testid={scrollAreaTestId}
    >
      <TabsList className={tabsListClass}>
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className={triggerBase}>
            <t.icon className={cn('mr-2 h-3.5 w-3.5', t.iconColor)} aria-hidden />
            <span>{t.label}</span>
            {t.count !== undefined && t.count > 0 && (
              <Badge
                variant={t.badgeVariant === 'default' ? 'default' : 'secondary'}
                className={cn(
                  'ml-2 flex h-4 min-w-[1rem] items-center justify-center border-none px-1 text-[7px] font-bold',
                  t.badgeVariant === 'default'
                    ? 'bg-accent-primary text-text-inverse hover:bg-accent-primary/90'
                    : 'bg-bg-surface text-text-secondary hover:bg-bg-surface2'
                )}
              >
                {t.count > 999 ? '999+' : t.count}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
