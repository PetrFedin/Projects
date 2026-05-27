'use client';

import { useCallback, useEffect, useState } from 'react';
import { Layers, Mouse, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  dismissAllRunwayOnboardingHints,
  dismissRunwayOnboarding,
  isRunwayOnboardingDismissed,
  isRunwayCompareHintDismissed,
  dismissRunwayCompareHint,
} from '@/hooks/useRunwaySectionPersistence';
import { RUNWAY_ONBOARDING_AUTO_DISMISS_MS } from '@/lib/scroll-switcher-constants';
import { isRunwayE2eMode } from '@/lib/runway/runway-e2e';
import { t } from '@/lib/runway/runway-i18n';

interface RunwayOnboardingHintProps {
  /** Только полноразмерный PDP runway, не compact featured. */
  enabled?: boolean;
  /** Minimal layout — только wheel hint, без compare card. */
  subtle?: boolean;
  className?: string;
}

/** Первый визит: сравнение Standard vs Runway, затем подсказка про колёсико. */
export function RunwayOnboardingHint({
  enabled = true,
  subtle = false,
  className,
}: RunwayOnboardingHintProps) {
  const [showCompare, setShowCompare] = useState(false);
  const [showWheel, setShowWheel] = useState(false);

  const dismissAll = useCallback(() => {
    dismissAllRunwayOnboardingHints();
    setShowCompare(false);
    setShowWheel(false);
  }, []);

  useEffect(() => {
    if (!enabled || isRunwayE2eMode()) {
      setShowCompare(false);
      setShowWheel(false);
      return;
    }
    if (!isRunwayCompareHintDismissed() && !subtle) {
      setShowCompare(true);
      setShowWheel(false);
      return;
    }
    setShowCompare(false);
    setShowWheel(!isRunwayOnboardingDismissed());
  }, [enabled, subtle]);

  useEffect(() => {
    if (!enabled || (!showCompare && !showWheel)) return;

    const onWheelOrScroll = () => {
      dismissAll();
    };

    window.addEventListener('wheel', onWheelOrScroll, { passive: true, once: true });
    window.addEventListener('scroll', onWheelOrScroll, {
      passive: true,
      once: true,
      capture: true,
    });

    const timer = window.setTimeout(dismissAll, RUNWAY_ONBOARDING_AUTO_DISMISS_MS);

    return () => {
      window.removeEventListener('wheel', onWheelOrScroll);
      window.removeEventListener('scroll', onWheelOrScroll, true);
      window.clearTimeout(timer);
    };
  }, [enabled, showCompare, showWheel, dismissAll]);

  if (!showCompare && !showWheel) return null;

  const handleDismissCompare = () => {
    dismissRunwayCompareHint();
    setShowCompare(false);
    setShowWheel(!isRunwayOnboardingDismissed());
  };

  const handleDismissWheel = () => {
    dismissRunwayOnboarding();
    setShowWheel(false);
  };

  if (showCompare) {
    return (
      <div
        className={cn(
          'pointer-events-none absolute bottom-28 left-1/2 z-30 max-w-md -translate-x-1/2 duration-500 animate-in fade-in slide-in-from-bottom-2 md:bottom-32',
          className
        )}
        role="status"
        data-runway-onboarding-compare
      >
        <div className="pointer-events-auto rounded-xl border border-primary/30 bg-background/95 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-start gap-3">
            <Layers className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {t('runway.onboarding.compareTitle')}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg border border-border bg-muted/40 p-2">
                  <p className="font-medium text-muted-foreground">
                    {t('runway.onboarding.standard')}
                  </p>
                  <p className="mt-0.5 text-foreground/80">{t('runway.onboarding.standardDesc')}</p>
                </div>
                <div className="rounded-lg border border-primary/40 bg-primary/5 p-2">
                  <p className="font-medium text-primary">{t('runway.runwayTab')}</p>
                  <p className="mt-0.5 text-foreground/90">{t('runway.onboarding.runwayDesc')}</p>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={handleDismissCompare}
              aria-label={t('runway.aria.closeCompare')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'pointer-events-none absolute bottom-28 left-1/2 z-30 max-w-sm -translate-x-1/2 duration-500 animate-in fade-in slide-in-from-bottom-2 md:bottom-32',
        className
      )}
      role="status"
      data-runway-onboarding-wheel
    >
      <div className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur-md">
        <Mouse className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{t('runway.onboarding.wheelTitle')}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('runway.onboarding.wheelHint')}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={handleDismissWheel}
          aria-label={t('runway.aria.closeHint')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
