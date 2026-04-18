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
<<<<<<< HEAD
      className={cn('inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5', className)}
=======
      className={cn(
        'bg-bg-surface2 border-border-default inline-flex rounded-lg border p-0.5',
        className
      )}
>>>>>>> recover/cabinet-wip-from-stash
    >
      <Link
        href={ROUTES.brand.academy}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors',
          active === 'brand'
<<<<<<< HEAD
            ? 'border border-slate-200 bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
=======
            ? 'text-text-primary border-border-default border bg-white shadow-sm'
            : 'text-text-secondary hover:text-text-primary hover:bg-white/60'
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            ? 'border border-slate-200 bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
=======
            ? 'text-text-primary border-border-default border bg-white shadow-sm'
            : 'text-text-secondary hover:text-text-primary hover:bg-white/60'
>>>>>>> recover/cabinet-wip-from-stash
        )}
      >
        <BookOpen className="h-3.5 w-3.5" />
        Платформа
      </Link>
    </div>
  );
}
