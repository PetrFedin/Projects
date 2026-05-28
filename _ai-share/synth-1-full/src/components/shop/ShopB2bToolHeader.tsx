'use client';

import type { ElementType, ReactNode } from 'react';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';

export type ShopB2bToolTitleVisual = 'md' | 'sm' | 'semibold' | 'headline';

const TITLE_CLASS: Record<ShopB2bToolTitleVisual, string> = {
  md: registryFeedLayout.shopB2bToolTitle,
  sm: registryFeedLayout.shopB2bToolTitleSm,
  semibold: registryFeedLayout.shopB2bToolTitleSemibold,
  headline: registryFeedLayout.shopB2bToolTitleHeadline,
};

type ToolHeaderProps = {
  backHref?: string;
  className?: string;
  trailing?: ReactNode;
  /** Полная замена средней колонки (игнорирует title, description, meta, titleVisual). */
  leading?: ReactNode;
  title?: ReactNode;
  titleVisual?: ShopB2bToolTitleVisual;
  description?: ReactNode;
  meta?: ReactNode;
};

/**
 * Шапка B2B-инструмента: `ShopB2bContentHeader` + компактный заголовок без второго `<h1>`
 * (заголовок раздела — в `CabinetHubSectionBar` у `app/shop/layout.tsx`).
 */
export function ShopB2bToolHeader({
  backHref = ROUTES.shop.home,
  className,
  trailing,
  leading,
  title,
  titleVisual = 'md',
  description,
  meta,
}: ToolHeaderProps) {
  const lead =
    leading != null ? (
      leading
    ) : title != null ? (
      <>
        <p className={TITLE_CLASS[titleVisual]}>{title}</p>
        {description ? <div className={registryFeedLayout.pageSubtitle}>{description}</div> : null}
        {meta ? <div className="mt-1 flex flex-wrap items-center gap-2">{meta}</div> : null}
      </>
    ) : null;

  return (
    <ShopB2bContentHeader
      backHref={backHref}
      className={className}
      wrapLead={false}
      lead={lead}
      trailing={trailing}
    />
  );
}

type ToolTitleProps = {
  children: ReactNode;
  visual?: ShopB2bToolTitleVisual;
  className?: string;
  as?: ElementType;
};

/** Одиночная строка заголовка инструмента (внутри split-layout, карточки и т.д.). */
export function ShopB2bToolTitle({
  children,
  visual = 'md',
  className,
  as: Comp = 'p',
}: ToolTitleProps) {
  return <Comp className={cn(TITLE_CLASS[visual], className)}>{children}</Comp>;
}
