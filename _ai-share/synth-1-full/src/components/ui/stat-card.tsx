'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type IconColor = 'indigo' | 'slate' | 'emerald' | 'amber' | 'rose' | 'blue';

const ICON_STYLES: Record<IconColor, string> = {
  indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100',
  slate: 'bg-slate-100 text-slate-600 group-hover:bg-slate-200',
  emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
  amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
  rose: 'bg-rose-50 text-rose-600 group-hover:bg-rose-100',
  blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
};

/**
 * StatCard — JOOR-style KPI-карточка.
 * STYLE_GUIDE: большое число + метка + иконка.
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  href,
  iconColor = 'indigo',
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  href?: string;
  iconColor?: IconColor;
  className?: string;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between">
        {Icon && (
          <div className={cn('rounded-xl p-2.5 transition-colors', ICON_STYLES[iconColor])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <span className="text-2xl font-bold tabular-nums text-slate-900">{value}</span>
      </div>
      <p className="mt-3 text-xs font-medium uppercase leading-tight tracking-wider text-slate-500">
        {label}
      </p>
    </>
  );

  const cardClass = cn(
    'rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm',
    'transition-all duration-200',
    href ? 'hover:border-slate-300 hover:shadow-md cursor-pointer group' : '',
    className
  );

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}
