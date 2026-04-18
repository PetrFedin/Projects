'use client';

import Link from 'next/link';
import { GraduationCap, BookOpen } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

interface AcademySegmentSwitcherProps {
  /** Текущий сегмент: brand | platform */
  active: 'brand' | 'platform';
  className?: string;
}

/** Два сегмента: Академия бренда и Академия платформы. B2B-стиль. */
export function AcademySegmentSwitcher({ active, className }: AcademySegmentSwitcherProps) {
  return (
    <div
      className={cn('inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5', className)}
    >
      <Link
        href={ROUTES.brand.academy}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors',
          active === 'brand'
            ? 'border border-slate-200 bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
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
            ? 'border border-slate-200 bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
        )}
      >
        <BookOpen className="h-3.5 w-3.5" />
        Платформа
      </Link>
    </div>
  );
}
