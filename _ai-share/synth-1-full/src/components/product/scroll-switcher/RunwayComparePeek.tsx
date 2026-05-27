'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { RunwaySectionViewModel } from '@/lib/product-scroll-switcher';
import { t } from '@/lib/runway/runway-i18n';

interface RunwayComparePeekProps {
  sections: RunwaySectionViewModel[];
  activeSection: number;
  compareTargetIndex: number | null;
  prefersReducedMotion?: boolean;
}

/** Split-screen peek при Shift+1/2/3 — 1.5s сравнение двух секций. */
export function RunwayComparePeek({
  sections,
  activeSection,
  compareTargetIndex,
  prefersReducedMotion = false,
}: RunwayComparePeekProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (compareTargetIndex == null) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), prefersReducedMotion ? 2000 : 1500);
    return () => window.clearTimeout(timer);
  }, [compareTargetIndex, activeSection, prefersReducedMotion]);

  if (!visible || compareTargetIndex == null) return null;

  const left = sections[activeSection];
  const right = sections[compareTargetIndex];
  if (!left || !right || activeSection === compareTargetIndex) return null;

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]',
        !prefersReducedMotion && 'animate-runway-compare-fade'
      )}
      role="status"
      aria-live="polite"
    >
      <div className="grid w-full max-w-2xl grid-cols-2 gap-2 rounded-xl border border-white/20 bg-black/60 p-2 shadow-2xl">
        {[left, right].map((section, i) => (
          <div key={section.id} className="relative aspect-[4/5] overflow-hidden rounded-lg">
            {section.heroUrl ? (
              <Image
                src={section.heroUrl}
                alt={section.label}
                fill
                className="object-cover"
                sizes="50vw"
              />
            ) : (
              <div className="h-full w-full" style={{ backgroundColor: section.color }} />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
                {i === 0 ? t('runway.compareCurrent') : t('runway.compareOther')}
              </p>
              <p className="text-xs font-medium text-white">{section.label}</p>
              <p className="text-[10px] tabular-nums text-white/80">
                {section.price.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
