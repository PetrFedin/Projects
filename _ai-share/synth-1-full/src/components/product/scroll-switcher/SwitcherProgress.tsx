'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/runway/runway-i18n';

interface SwitcherProgressProps {
  progress: number;
  sectionCount: number;
  activeSection: number;
  /** Подписи секций — отображаются под маркерами прогресса. */
  sectionLabels?: string[];
  onSectionClick?: (index: number) => void;
  /** Слот справа от timeline (favorite star). */
  trailingSlot?: ReactNode;
  className?: string;
  /** thin — полоска; dots — только точки без bar/labels (quiet luxury). */
  variant?: 'full' | 'thin' | 'dots';
}

/** Mini-map timeline — clickable chapter markers + section names. */
export function SwitcherProgress({
  progress,
  sectionCount,
  activeSection,
  sectionLabels,
  onSectionClick,
  trailingSlot,
  className,
  variant = 'full',
}: SwitcherProgressProps) {
  if (sectionCount < 1) return null;

  if (variant === 'thin') {
    return (
      <div
        className={cn(
          'pointer-events-none absolute left-3 right-3 top-3 z-20 md:left-4 md:right-4',
          className
        )}
        aria-hidden={false}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        data-runway-progress
      >
        <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-border/80">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary/90 transition-[width] duration-150 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2 md:top-4',
          className
        )}
        role="navigation"
        aria-label={t('runway.aria.chapters')}
        data-runway-progress
      >
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/40 px-2.5 py-1.5 backdrop-blur-md">
          {Array.from({ length: sectionCount }).map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              data-runway-progress-dot={index}
              className={cn(
                'h-2 rounded-full transition-all duration-200',
                index === activeSection
                  ? 'w-5 bg-white shadow-sm'
                  : 'w-2 bg-white/35 hover:bg-white/60'
              )}
              onClick={() => onSectionClick?.(index)}
              aria-label={
                sectionLabels?.[index]
                  ? t('runway.aria.progressDot', {
                      label: sectionLabels[index]!,
                      current: index + 1,
                      total: sectionCount,
                    })
                  : t('runway.aria.sectionNofMShort', {
                      current: index + 1,
                      total: sectionCount,
                    })
              }
              aria-current={index === activeSection ? 'step' : undefined}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'pointer-events-none absolute left-4 right-4 z-20 md:left-6 md:right-6',
        className ?? 'bottom-[4.5rem] md:bottom-[4.5rem]'
      )}
      aria-hidden={false}
      role="navigation"
      aria-label={t('runway.aria.chapters')}
      data-runway-progress
    >
      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-border">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-150 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
            />
            <div className="absolute inset-0 flex justify-between px-0.5">
              {Array.from({ length: sectionCount }).map((_, index) => (
                <button
                  key={`marker-${index}`}
                  type="button"
                  data-runway-progress-marker={index}
                  className={cn(
                    'pointer-events-auto relative top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 transition-all',
                    index === activeSection
                      ? 'scale-125 border-primary bg-primary shadow-sm'
                      : 'border-background bg-muted-foreground/50 hover:bg-primary/60'
                  )}
                  onClick={() => onSectionClick?.(index)}
                  aria-label={
                    sectionLabels?.[index]
                      ? t('runway.aria.chapter', { label: sectionLabels[index]! })
                      : t('runway.aria.sectionN', { n: index + 1 })
                  }
                  aria-current={index === activeSection ? 'step' : undefined}
                />
              ))}
            </div>
          </div>
          <div className="pointer-events-auto mt-2 flex justify-between gap-1">
            {Array.from({ length: sectionCount }).map((_, index) => {
              const isActive = index === activeSection;
              const label = sectionLabels?.[index];
              return (
                <button
                  key={index}
                  type="button"
                  data-runway-progress-label={index}
                  className="group flex flex-1 flex-col items-center gap-1 py-1"
                  onClick={() => onSectionClick?.(index)}
                  aria-label={
                    label
                      ? t('runway.aria.sectionNofM', {
                          label,
                          current: index + 1,
                          total: sectionCount,
                        })
                      : t('runway.aria.sectionNofMShort', {
                          current: index + 1,
                          total: sectionCount,
                        })
                  }
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span
                    className={cn(
                      'block h-1.5 w-full max-w-[56px] rounded-full transition-all duration-300',
                      isActive
                        ? 'bg-primary shadow-sm'
                        : 'bg-border group-hover:bg-muted-foreground/40'
                    )}
                  />
                  {label ? (
                    <span
                      className={cn(
                        'max-w-[72px] truncate text-[9px] font-medium uppercase tracking-wide transition-colors',
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground/70 group-hover:text-muted-foreground'
                      )}
                    >
                      {label}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
        {trailingSlot ? (
          <div className="pointer-events-auto relative z-30 shrink-0 pb-1">{trailingSlot}</div>
        ) : null}
      </div>
    </div>
  );
}
