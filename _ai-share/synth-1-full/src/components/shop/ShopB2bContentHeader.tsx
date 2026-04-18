'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Props = {
  /** По умолчанию — дашборд ритейл-центра. */
  backHref?: string;
  /** Краткий текст под строкой «Назад» (заголовок страницы уже в шапке layout). */
  lead?: ReactNode;
  className?: string;
  /** Доп. блок справа (мета, кнопки). */
  trailing?: ReactNode;
  /**
   * Если false, `lead` рендерится без обёртки `pageSubtitle` (для составных блоков, см. `ShopB2bToolHeader`).
   * @default true
   */
  wrapLead?: boolean;
};

/**
 * Единая верхняя зона B2B-страниц ритейла: назад + лид без второго H1
 * (заголовок раздела задаёт `CabinetHubSectionBar` в `app/shop/layout.tsx`).
 */
export function ShopB2bContentHeader({
  backHref = ROUTES.shop.home,
  lead,
  className,
  trailing,
  wrapLead = true,
}: Props) {
  return (
    <div className={cn(registryFeedLayout.cabinetModuleHeader, className)}>
      <div className="flex flex-wrap items-start gap-3">
        <Button variant="ghost" size="icon" className="shrink-0" asChild>
          <Link href={backHref} aria-label="Назад">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1 space-y-1">
          {lead ? (
            wrapLead ? (
              <div className={registryFeedLayout.pageSubtitle}>{lead}</div>
            ) : (
              lead
            )
          ) : null}
        </div>
        {trailing ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{trailing}</div>
        ) : null}
      </div>
    </div>
  );
}
