'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

export type RegistryPageHeaderProps = {
  title: ReactNode;
  /** Обычный подзаголовок (без кавычек и курсива). Если задан `leadQuote`, он имеет приоритет. */
  leadPlain?: ReactNode;
  /** Короткий подзаголовок в кавычках (курсив + бордер слева), без обрамляющих кавычек в строке */
  leadQuote?: string;
  actions?: ReactNode;
  /** Опционально: крошки или метка раздела над заголовком */
  eyebrow?: ReactNode;
  className?: string;
};

/**
 * Шапка страницы в стиле «Глобальная лента событий»: uppercase H1, italic lead с accent-border (`registryFeedLayout`).
 */
export function RegistryPageHeader({
  title,
  leadPlain,
  leadQuote,
  actions,
  eyebrow,
  className,
}: RegistryPageHeaderProps) {
  return (
    <div className={cn(registryFeedLayout.headerRow, className)}>
      <div className="min-w-0">
        {eyebrow ? <div className="mb-3">{eyebrow}</div> : null}
        <h1 className={registryFeedLayout.pageTitle}>{title}</h1>
        {leadQuote ? (
          <p className={registryFeedLayout.pageLead}>&ldquo;{leadQuote}&rdquo;</p>
        ) : leadPlain ? (
          <p className={registryFeedLayout.pageSubtitle}>{leadPlain}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
