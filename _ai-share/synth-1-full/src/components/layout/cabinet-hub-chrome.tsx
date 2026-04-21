'use client';

import type { LucideIcon } from 'lucide-react';
import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import {
  CabinetBreadcrumbs,
  type BreadcrumbItem,
} from '@/components/layout/cabinet-breadcrumbs';
import { SynthaDemoMark } from '@/components/ui/syntha-demo-mark';

export type { BreadcrumbItem };

export function CabinetHubMain({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn(cabinetSurface.hubMainColumn, className)}>{children}</div>;
}

type CabinetHubTitleRowProps = {
  /** Доп. классы на корень строки (напр. `border-b` у бренд-центра). */
  className?: string;
  onOpenMobileNav?: () => void;
  /** Если false — не показывать кнопку меню (редко). */
  showMobileNav?: boolean;
  hubIcon: LucideIcon;
  /** Цвет плитки иконки, тень и т.д. */
  iconTileClassName: string;
  title: string;
  /** Бейджи справа от H1 (роль, метка узла и т.п.) */
  badges?: ReactNode;
  /** Правая часть строки: поиск, переключение хабов и т.д. */
  trailing?: ReactNode;
};

export function CabinetHubTitleRow({
  className,
  onOpenMobileNav,
  showMobileNav = true,
  hubIcon: HubIcon,
  iconTileClassName,
  title,
  badges,
  trailing,
}: CabinetHubTitleRowProps) {
  return (
    <div className={cn(cabinetSurface.hubTitleRow, className)}>
      <div className={cabinetSurface.hubTitleLeading}>
        {showMobileNav && onOpenMobileNav ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cabinetSurface.hubMenuButton}
            onClick={onOpenMobileNav}
          >
            <Menu className="text-text-primary size-5" aria-hidden />
            <span className="sr-only">Открыть меню</span>
          </Button>
        ) : null}
        <div className={cn(cabinetSurface.hubIconTile, iconTileClassName)}>
          <HubIcon className="h-5.5 w-5.5" aria-hidden />
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          <h1 className={cabinetSurface.hubH1}>{title}</h1>
          {badges}
          <SynthaDemoMark compact className="ml-0.5" />
        </div>
      </div>
      {trailing ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{trailing}</div>
      ) : null}
    </div>
  );
}

type CabinetHubSectionBarProps = {
  accentClassName: string;
  breadcrumbItems: BreadcrumbItem[];
  /**
   * Подзаголовок под крошками. Не передавайте, если последний пункт крошек уже совпадает с названием
   * страницы — иначе дублирование (актуально для ЛК клиента: путь «… › Избранное» без второго «Избранное»).
   */
  sectionTitle?: string;
  trailing?: ReactNode;
};

export function CabinetHubSectionBar({
  accentClassName,
  breadcrumbItems,
  sectionTitle,
  trailing,
}: CabinetHubSectionBarProps) {
  return (
    <div className={cabinetSurface.hubSectionRow}>
      <div className={cabinetSurface.hubSectionLeading}>
        <div className={cn(cabinetSurface.hubAccentRail, accentClassName)} aria-hidden />
        <div className={cabinetSurface.hubSectionTitleStack}>
          <CabinetBreadcrumbs items={breadcrumbItems} />
          {sectionTitle ? <h2 className={cabinetSurface.hubH2}>{sectionTitle}</h2> : null}
        </div>
      </div>
      {trailing ? <div className="flex shrink-0 items-center gap-2">{trailing}</div> : null}
    </div>
  );
}
