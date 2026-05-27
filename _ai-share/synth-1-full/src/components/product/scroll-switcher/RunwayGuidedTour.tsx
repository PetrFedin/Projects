'use client';

import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  RUNWAY_GUIDED_TOUR_STORAGE_KEY,
  RUNWAY_ONBOARDING_AUTO_DISMISS_MS,
} from '@/lib/scroll-switcher-constants';
import { t } from '@/lib/runway/runway-i18n';

export type RunwayGuidedTourStepId = 'scroll' | 'thumbs' | 'price' | 'completeLook';

const TOUR_STEPS: RunwayGuidedTourStepId[] = ['scroll', 'thumbs', 'price', 'completeLook'];

const STEP_COPY: Record<
  RunwayGuidedTourStepId,
  {
    title: import('@/lib/runway/runway-i18n').RunwayI18nKey;
    hint: import('@/lib/runway/runway-i18n').RunwayI18nKey;
  }
> = {
  scroll: { title: 'runway.guidedTour.scroll', hint: 'runway.guidedTour.scrollHint' },
  thumbs: { title: 'runway.guidedTour.thumbs', hint: 'runway.guidedTour.thumbsHint' },
  price: { title: 'runway.guidedTour.price', hint: 'runway.guidedTour.priceHint' },
  completeLook: {
    title: 'runway.guidedTour.completeLook',
    hint: 'runway.guidedTour.completeLookHint',
  },
};

const STEP_TARGETS: Record<RunwayGuidedTourStepId, string> = {
  scroll: '[data-runway-stage]',
  thumbs: '[data-runway-thumbs-bar]',
  price: '[data-runway-price-panel]',
  completeLook: '[data-runway-complete-look]',
};

function isGuidedTourDone(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(RUNWAY_GUIDED_TOUR_STORAGE_KEY) === '1';
  } catch {
    return true;
  }
}

export function markRunwayGuidedTourDone(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(RUNWAY_GUIDED_TOUR_STORAGE_KEY, '1');
  } catch {
    /* ignore */
  }
}

export interface RunwayGuidedTourProps {
  enabled?: boolean;
}

/**
 * 4-step spotlight tour — только первый визит runway (localStorage).
 */
export function RunwayGuidedTour({ enabled = true }: RunwayGuidedTourProps) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<DOMRect | null>(null);

  const stepId = TOUR_STEPS[stepIndex] ?? 'scroll';

  useEffect(() => {
    if (!enabled || isGuidedTourDone()) return;
    const t = window.setTimeout(() => setActive(true), 800);
    return () => window.clearTimeout(t);
  }, [enabled]);

  const updateSpotlight = useCallback(() => {
    const selector = STEP_TARGETS[stepId];
    const el = document.querySelector(selector);
    if (!el) {
      setSpotlight(null);
      return;
    }
    setSpotlight(el.getBoundingClientRect());
  }, [stepId]);

  const finish = useCallback(() => {
    markRunwayGuidedTourDone();
    setActive(false);
  }, []);

  useEffect(() => {
    if (!active) return;
    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight, true);
    return () => {
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight, true);
    };
  }, [active, stepIndex, updateSpotlight]);

  /** Scroll/wheel/8s — не блокируем thumbs и сцену дольше первого взаимодействия. */
  useEffect(() => {
    if (!active) return;

    const onWheelOrScroll = () => {
      finish();
    };

    window.addEventListener('wheel', onWheelOrScroll, { passive: true, once: true });
    window.addEventListener('scroll', onWheelOrScroll, {
      passive: true,
      once: true,
      capture: true,
    });

    const timer = window.setTimeout(finish, RUNWAY_ONBOARDING_AUTO_DISMISS_MS);

    return () => {
      window.removeEventListener('wheel', onWheelOrScroll);
      window.removeEventListener('scroll', onWheelOrScroll, true);
      window.clearTimeout(timer);
    };
  }, [active, finish]);

  const next = () => {
    if (stepIndex >= TOUR_STEPS.length - 1) {
      finish();
      return;
    }
    setStepIndex((i) => i + 1);
  };

  if (!active) return null;

  const copy = STEP_COPY[stepId];

  const tooltipStyle: React.CSSProperties = spotlight
    ? {
        top: Math.min(spotlight.bottom + 12, window.innerHeight - 160),
        left: Math.max(16, Math.min(spotlight.left, window.innerWidth - 320)),
      }
    : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

  return (
    <div className="pointer-events-none fixed inset-0 z-[95]" data-runway-guided-tour role="dialog">
      <div className="pointer-events-none absolute inset-0 bg-black/55" aria-hidden />
      {spotlight ? (
        <div
          className="pointer-events-none absolute rounded-xl ring-4 ring-primary ring-offset-2 ring-offset-transparent transition-all duration-300"
          style={{
            top: spotlight.top - 4,
            left: spotlight.left - 4,
            width: spotlight.width + 8,
            height: spotlight.height + 8,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
          }}
        />
      ) : null}
      <div
        className="pointer-events-auto absolute z-10 w-[min(300px,calc(100vw-2rem))] rounded-xl border border-border bg-background p-4 shadow-xl"
        style={tooltipStyle}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {stepIndex + 1} / {TOUR_STEPS.length}
            </p>
            <p className="mt-1 text-sm font-semibold">{t(copy.title)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t(copy.hint)}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={finish}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="button" variant="ghost" size="sm" className="min-h-[44px]" onClick={finish}>
            {t('runway.guidedTour.skip')}
          </Button>
          <Button type="button" size="sm" className="min-h-[44px] flex-1" onClick={next}>
            {stepIndex >= TOUR_STEPS.length - 1
              ? t('runway.guidedTour.done')
              : t('runway.guidedTour.next')}
          </Button>
        </div>
      </div>
    </div>
  );
}
