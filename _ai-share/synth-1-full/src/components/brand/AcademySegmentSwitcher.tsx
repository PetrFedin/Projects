'use client';

import Link from 'next/link';
import { GraduationCap, BookOpen, Building2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

interface AcademySegmentSwitcherProps {
  /** Текущий сегмент: brand | platform | organization */
  active: 'brand' | 'platform' | 'organization';
  className?: string;
}

/** Сегменты: академия бренда, витрина платформы, студия партнёрской организации. */
export function AcademySegmentSwitcher({ active, className }: AcademySegmentSwitcherProps) {
  return (
    <div
      className={cn(
        'bg-bg-surface2 border-border-default inline-flex max-w-full flex-wrap rounded-lg border p-0.5',
        className
      )}
    >
      <Link
        href={ROUTES.brand.academy}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors',
          active === 'brand'
            ? 'text-text-primary border-border-default border bg-white shadow-sm'
            : 'text-text-secondary hover:text-text-primary hover:bg-white/60'
        )}
      >
        <GraduationCap className="h-3.5 w-3.5" />
        Бренд
      </Link>
      <Link
        href={ROUTES.brand.academyPlatform}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors',
          active === 'platform'
            ? 'text-text-primary border-border-default border bg-white shadow-sm'
            : 'text-text-secondary hover:text-text-primary hover:bg-white/60'
        )}
      >
        <BookOpen className="h-3.5 w-3.5" />
        Платформа
      </Link>
      <Link
        href={ROUTES.brand.academyOrganizationStudio}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors',
          active === 'organization'
            ? 'text-text-primary border-border-default border bg-white shadow-sm'
            : 'text-text-secondary hover:text-text-primary hover:bg-white/60'
        )}
      >
        <Building2 className="h-3.5 w-3.5" />
        Организация
      </Link>
    </div>
  );
}
