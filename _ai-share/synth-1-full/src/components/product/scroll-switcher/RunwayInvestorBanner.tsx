'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { t } from '@/lib/runway/runway-i18n';

const STORAGE_KEY = 'runway-investor-banner-dismissed';

interface RunwayInvestorBannerProps {
  enabled?: boolean;
  message?: string;
  className?: string;
}

/**
 * Опциональная полоска для investor demo — «Демо · прокрутите для вариантов».
 * Отключается в scroll-experience.json; учитывает prefers-reduced-motion.
 */
export function RunwayInvestorBanner({
  enabled = false,
  message = t('runway.investorBanner'),
  className,
}: RunwayInvestorBannerProps) {
  const [dismissed, setDismissed] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      setDismissed(false);
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (!enabled || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={cn(
        'pointer-events-auto absolute left-0 right-0 top-0 z-30 flex items-center justify-center gap-2 border-b border-primary/20 bg-primary/10 px-3 py-2 text-center text-xs text-foreground backdrop-blur-sm',
        !reducedMotion && 'duration-500 animate-in fade-in slide-in-from-top-1',
        className
      )}
      role="status"
    >
      <span className="font-medium">{message}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={dismiss}
        aria-label={t('runway.aria.closeInvestorHint')}
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </Button>
    </div>
  );
}
