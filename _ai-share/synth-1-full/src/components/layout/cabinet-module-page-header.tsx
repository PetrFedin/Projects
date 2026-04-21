'use client';

import type { LucideIcon } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

export type CabinetModulePageHeaderProps = {
  title: string;
  /** Подзаголовок под заголовком (как `pageSubtitle`); может содержать ссылки. */
  description?: ReactNode;
  meta?: ReactNode;
  icon?: LucideIcon;
  /** Например `text-rose-500` для избранного */
  iconClassName?: string;
  onBack?: () => void;
  showBack?: boolean;
  backLabel?: string;
  className?: string;
};

/**
 * Заголовок страницы внутри кабинета: строка (назад + иконка + заголовок + мета) и описание под ней,
 * как `pageSubtitle` в реестрах.
 */
export function CabinetModulePageHeader({
  title,
  description,
  meta,
  icon: Icon,
  iconClassName,
  onBack,
  showBack = Boolean(onBack),
  backLabel = 'Вернуться в предыдущий раздел',
  className,
}: CabinetModulePageHeaderProps) {
  return (
    <header className={cn(registryFeedLayout.cabinetModuleHeader, className)}>
      <div className="flex min-h-11 flex-wrap items-center gap-2 sm:gap-3">
        {showBack && onBack ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={onBack}
            aria-label={backLabel}
            title={backLabel}
          >
            <ArrowLeft className="size-4" />
          </Button>
        ) : null}
        {Icon ? (
          <Icon
            className={cn('size-6 shrink-0', iconClassName ?? 'text-accent-primary')}
            aria-hidden
          />
        ) : null}
        <h2 className="text-text-primary shrink-0 text-lg font-black uppercase leading-none tracking-tight sm:text-xl">
          {title}
        </h2>
        {meta != null && meta !== false ? (
          <span className="text-text-secondary ml-1 text-sm font-medium leading-none tabular-nums sm:ml-2">
            {meta}
          </span>
        ) : null}
      </div>
      {description != null && description !== false ? (
        <div className={registryFeedLayout.pageSubtitle}>{description}</div>
      ) : null}
    </header>
  );
}
