'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/runway/runway-i18n';

interface RunwaySectionStoryProps {
  story?: string;
  sectionLabel: string;
  activeSection: number;
  prefersReducedMotion?: boolean;
}

/**
 * Storytelling-карточка при смене секции — slides up, auto-dismiss.
 * Opt-in: показывается только если у секции есть sectionStory.
 */
export function RunwaySectionStory({
  story,
  sectionLabel,
  activeSection,
  prefersReducedMotion = false,
}: RunwaySectionStoryProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!story) {
      setVisible(false);
      return;
    }
    setDismissed(false);
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), prefersReducedMotion ? 2500 : 3000);
    return () => window.clearTimeout(timer);
  }, [story, activeSection, prefersReducedMotion]);

  if (!story || dismissed || !visible) return null;

  return (
    <div
      className={cn(
        'pointer-events-auto absolute left-1/2 top-20 z-30 w-[min(92%,340px)] -translate-x-1/2',
        !prefersReducedMotion && 'animate-runway-story-enter'
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative rounded-xl border border-white/20 bg-black/75 px-4 py-3 text-white shadow-lg backdrop-blur-md">
        <button
          type="button"
          className="absolute right-2 top-2 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
          onClick={() => {
            setDismissed(true);
            setVisible(false);
          }}
          aria-label={t('runway.aria.closeStory')}
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
          {sectionLabel}
        </p>
        <p className="mt-1 pr-6 text-sm leading-snug">{story}</p>
      </div>
    </div>
  );
}
