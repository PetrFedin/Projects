'use client';

import { CircleCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  Workshop2DossierPhase1,
  Workshop2DossierSectionSignoffs,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  W2_SECTION_SIGNOFF_PCT_THRESHOLD,
  W2_TZ_FOUR_TABS_AVG_FILL_PCT_MIN_FOR_DIGITAL_SIGNOFF,
} from '@/lib/production/workshop2-tz-section-signoff-thresholds';
import {
  isWorkshop2TzSectionFullySigned,
  isWorkshop2TzSectionFullySignedWithPassport,
} from '@/lib/production/workshop2-tz-signoff-complete';
import { workshop2TzSectionSignoffDoneTitle } from '@/lib/production/workshop2-tz-section-signoff-sides';

export { isWorkshop2TzSectionFullySigned, isWorkshop2TzSectionFullySignedWithPassport };
export { W2_SECTION_SIGNOFF_PCT_THRESHOLD, W2_TZ_FOUR_TABS_AVG_FILL_PCT_MIN_FOR_DIGITAL_SIGNOFF };

export function workshopTzSectionsMeetDigitalSignoffThresholds(
  sectionReadiness: Record<Workshop2TzSignoffSectionKey, { pct: number }>
): boolean {
  return (Object.keys(W2_SECTION_SIGNOFF_PCT_THRESHOLD) as Workshop2TzSignoffSectionKey[]).every(
    (k) => (sectionReadiness[k]?.pct ?? 0) >= W2_SECTION_SIGNOFF_PCT_THRESHOLD[k]
  );
}

const R = 8;
const C = 2 * Math.PI * R;

export function Workshop2TzSectionTabIndicator({
  section,
  pct,
  fullySigned,
  className,
  /** Активная вкладка на заливке `bg-accent-primary` — светлые линии и цифры. */
  tone = 'default',
}: {
  section: Workshop2TzSignoffSectionKey;
  pct: number;
  /** Требуемые для секции подписи в `sectionSignoffs` выполнены. */
  fullySigned: boolean;
  className?: string;
  tone?: 'default' | 'inverted';
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  const threshold = W2_SECTION_SIGNOFF_PCT_THRESHOLD[section];
  const sufficient = clamped >= threshold;
  const inverted = tone === 'inverted';
  /** Порог достигнут, но секция ещё не подписана обеими сторонами — не «успех», только прогресс. */
  const progressRingClass = inverted
    ? sufficient
      ? 'text-sky-200'
      : 'text-amber-200'
    : sufficient
      ? 'text-sky-600'
      : 'text-amber-600';

  if (fullySigned) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0',
          inverted ? 'text-white' : 'text-emerald-600',
          className
        )}
        title={workshop2TzSectionSignoffDoneTitle(section)}
        aria-hidden
      >
        <CircleCheck className="h-[22px] w-[22px]" strokeWidth={2.25} />
      </span>
    );
  }

  const dashOffset = C * (1 - clamped / 100);
  const ringClass = progressRingClass;
  const trackClass = inverted ? 'text-white/35' : 'text-zinc-200';
  const digitClass = inverted ? 'text-white' : 'text-text-primary';

  return (
    <span
      className={cn('relative inline-flex h-[22px] w-[22px] shrink-0', className)}
      title={`Заполнено ${clamped}% · для подписи рекомендуется ≥ ${threshold}%`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        className="block -rotate-90"
        aria-hidden
      >
        <circle
          cx="11"
          cy="11"
          r={R}
          fill="none"
          strokeWidth="2"
          className={trackClass}
          stroke="currentColor"
        />
        <circle
          cx="11"
          cy="11"
          r={R}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          className={ringClass}
          stroke="currentColor"
          strokeDasharray={C}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center text-[8px] font-bold tabular-nums leading-none',
          digitClass
        )}
        aria-hidden
      >
        {clamped}
      </span>
    </span>
  );
}

/**
 * Галочка на вкладке ТЗ: подписи по правилам секции **и** текущая заполненность не ниже порога
 * (иначе в JSON могли остаться старые подписи при пустой секции — не показываем «сдано»).
 */
export function isWorkshop2TzSectionTabDoneForUi(
  section: Workshop2TzSignoffSectionKey,
  signoffs: Workshop2DossierSectionSignoffs | undefined,
  sectionPct: number,
  dossier?: Workshop2DossierPhase1
): boolean {
  const signed = dossier
    ? isWorkshop2TzSectionFullySignedWithPassport(section, signoffs, dossier)
    : isWorkshop2TzSectionFullySigned(section, signoffs);
  if (!signed) return false;
  return sectionPct >= W2_SECTION_SIGNOFF_PCT_THRESHOLD[section];
}
