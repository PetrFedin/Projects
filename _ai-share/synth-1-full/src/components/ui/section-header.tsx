'use client';

import React, { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { type UiIconTone, getSectionHeaderIconToneClass } from '@/lib/ui/semantic-data-tones';

/**
 * SectionHeader — заголовок секции для B2B-интерфейса.
 * Чистый, профессиональный стиль: иконка + заголовок + описание.
 */
export function SectionHeader({
  icon: Icon,
  title,
  description,
  iconColor = 'indigo',
  badges,
  actions,
  variant = 'b2b',
  compact = false,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  iconColor?: UiIconTone;
  badges?: ReactNode;
  actions?: ReactNode;
  /** b2b: uppercase, compact. default: classic title. */
  variant?: 'b2b' | 'default';
  /** Плотная шапка раздела (brand layout): меньше иконка и отступы */
  compact?: boolean;
  className?: string;
}) {
  const isB2b = variant === 'b2b';
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-start sm:justify-between',
        compact ? 'gap-2 sm:gap-3' : 'gap-4',
        className
      )}
    >
      <div className={cn('flex min-w-0 items-start', compact ? 'gap-2.5' : 'gap-4')}>
        {Icon && (
          <div
            className={cn(
              'flex shrink-0 items-center justify-center rounded-xl',
              compact ? 'h-8 w-8 rounded-lg' : 'h-10 w-10',
              getSectionHeaderIconToneClass(iconColor)
            )}
          >
            <Icon className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
          </div>
        )}
        <div className="min-w-0">
          <h2
            className={cn(
              isB2b
                ? compact
                  ? 'text-text-primary text-sm font-black uppercase leading-tight tracking-tight sm:text-[15px]'
                  : 'text-text-primary text-base font-black uppercase tracking-tight sm:text-lg'
                : 'text-text-primary text-xl font-bold tracking-tight sm:text-2xl'
            )}
          >
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                'max-w-2xl',
                compact ? 'mt-0.5 leading-snug' : 'mt-1 leading-relaxed',
                isB2b
                  ? compact
                    ? 'text-text-secondary text-[10px] font-medium'
                    : 'text-text-secondary text-[11px] font-medium'
                  : 'text-text-secondary text-sm'
              )}
            >
              {description}
            </p>
          )}
          {badges && (
            <div className={cn('flex flex-wrap', compact ? 'mt-2 gap-1.5' : 'mt-3 gap-2')}>
              {badges}
            </div>
          )}
        </div>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
