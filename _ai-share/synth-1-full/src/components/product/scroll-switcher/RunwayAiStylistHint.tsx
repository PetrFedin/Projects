'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { t } from '@/lib/runway/runway-i18n';
import type { ProductScrollSwitcherSection } from '@/lib/types';

interface RunwayAiStylistHintProps {
  section: ProductScrollSwitcherSection;
  sectionLabel: string;
  /** Открыть AI size guide / stylist dialog с PDP. */
  onOpenStylist?: () => void;
  className?: string;
}

/**
 * AI-подсказка по секции — статический sectionAiTip из JSON или size guide.
 */
export function RunwayAiStylistHint({
  section,
  sectionLabel,
  onOpenStylist,
  className,
}: RunwayAiStylistHintProps) {
  const tip = section.sectionAiTip?.trim();
  const [open, setOpen] = useState(false);

  if (!tip && !onOpenStylist) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn('h-8 gap-1.5 bg-background/90 text-xs backdrop-blur-sm', className)}
          aria-label={`${t('runway.aiTip')} · ${sectionLabel}`}
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
          {t('runway.aiTip')}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="max-w-xs text-sm">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t('runway.aiStylist', { label: sectionLabel })}
        </p>
        {tip ? <p className="leading-relaxed text-foreground">{tip}</p> : null}
        {onOpenStylist ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            className="mt-2 h-auto px-0 text-xs"
            onClick={() => {
              setOpen(false);
              onOpenStylist();
            }}
          >
            {t('runway.openSizeGuide')}
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
