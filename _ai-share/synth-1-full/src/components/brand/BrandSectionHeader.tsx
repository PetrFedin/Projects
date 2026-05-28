'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getBrandSectionMeta } from '@/lib/data/brand-navigation';
import { cn } from '@/lib/utils';

type BrandSectionHeaderProps = {
  /** Переопределить pathname (если не из usePathname) */
  pathname?: string;
  /** Дополнительные badges для SectionInfoCard */
  badges?: React.ReactNode;
  /** Дополнительный контент в карточке */
  children?: React.ReactNode;
  /** Дополнительные className для breadcrumb */
  breadcrumbClassName?: string;
};

/**
 * Единый блок: SectionInfoCard + Breadcrumb из brand-navigation.
 * Используется во всех разделах Brand Center по аналогии с Организация / Профиль бренда.
 */
export function BrandSectionHeader({
  pathname: pathOverride,
  badges,
  children,
  breadcrumbClassName,
}: BrandSectionHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const path = pathOverride ?? pathname ?? '';
  const meta = getBrandSectionMeta(path, searchParams?.toString());

  if (!meta) return null;

  const Icon = meta.icon;

  return (
    <>
      <SectionInfoCard
        title={meta.sectionLabel}
        description={meta.description}
        icon={Icon}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={badges}
      >
        {children}
      </SectionInfoCard>
      <div
        className={cn(
          'text-text-muted mb-4 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest',
          breadcrumbClassName
        )}
      >
        <Link href={meta.groupHref} className="hover:text-accent-primary transition-colors">
          {meta.groupLabel}
        </Link>
        <ChevronRight className="h-3 w-3" />
        {meta.subsectionLabel ? (
          <>
            <Link href={meta.sectionHref} className="hover:text-accent-primary transition-colors">
              {meta.sectionLabel}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-accent-primary">{meta.subsectionLabel}</span>
          </>
        ) : (
          <span className="text-accent-primary">{meta.sectionLabel}</span>
        )}
      </div>
    </>
  );
}
