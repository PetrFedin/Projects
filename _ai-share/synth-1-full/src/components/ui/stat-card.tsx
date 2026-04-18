'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { type UiIconTone, getStatCardIconToneClass } from '@/lib/ui/semantic-data-tones';

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
  iconColor?: UiIconTone;
  className?: string;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between">
        {Icon && (
          <div
            className={cn(
              'rounded-xl p-2.5 transition-colors',
              getStatCardIconToneClass(iconColor)
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
        <span className="text-text-primary text-2xl font-bold tabular-nums">{value}</span>
      </div>
      <p className="text-text-secondary mt-3 text-xs font-medium uppercase leading-tight tracking-wider">
        {label}
      </p>
    </>
  );

  const cardClass = cn(
    'rounded-xl border border-border-default/80 bg-white p-5 shadow-sm',
    'transition-all duration-200',
    href ? 'hover:border-border-default hover:shadow-md cursor-pointer group' : '',
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
