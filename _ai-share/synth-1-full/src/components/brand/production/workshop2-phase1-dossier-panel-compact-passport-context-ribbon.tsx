'use client';

import { Button } from '@/components/ui/button';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_PASSPORT_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-passport-check';

const W2_TZ_SECTION_SIGNOFF_VISUALS_ANCHOR = 'w2-tz-section-signoff-visuals';

export function Workshop2DossierCompactPassportContextRibbon({
  show,
  skuDraft,
  nameDraft,
  internalArticleCodeDisplay,
  jumpToTzSectionAnchor,
}: {
  show: boolean;
  skuDraft: string;
  nameDraft: string;
  internalArticleCodeDisplay: string;
  jumpToTzSectionAnchor: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
}) {
  if (!show) return null;

  return (
    <div
      id="w2-tz-compact-passport-context"
      className="border-accent-primary/20 bg-accent-primary/10 text-text-primary rounded-lg border px-3 py-2 text-[11px] shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-accent-primary font-semibold tabular-nums">
          SKU: {skuDraft.trim() || '—'}
        </span>
        <span className="text-text-muted" aria-hidden>
          ·
        </span>
        <span className="text-text-primary font-mono text-[10px]">
          {internalArticleCodeDisplay}
        </span>
        {(nameDraft || '').trim() ? (
          <>
            <span className="text-text-muted" aria-hidden>
              ·
            </span>
            <span
              className="text-text-secondary max-w-[min(320px,48vw)] truncate"
              title={(nameDraft || '').trim()}
            >
              {(nameDraft || '').trim()}
            </span>
          </>
        ) : null}
        <span className="min-[420px]:grow sm:grow" />
        <Button
          type="button"
          variant="link"
          className="text-accent-primary h-auto min-h-0 p-0 text-[10px] font-semibold"
          onClick={() => jumpToTzSectionAnchor('general', W2_PASSPORT_SUBPAGE_ANCHORS.hub)}
        >
          Паспорт · хаб
        </Button>
        <Button
          type="button"
          variant="link"
          className="text-accent-primary h-auto min-h-0 p-0 text-[10px] font-semibold"
          onClick={() => jumpToTzSectionAnchor('general', W2_PASSPORT_SUBPAGE_ANCHORS.start)}
        >
          Карточка артикула
        </Button>
        <Button
          type="button"
          variant="link"
          className="text-accent-primary h-auto min-h-0 p-0 text-[10px] font-semibold"
          onClick={() =>
            jumpToTzSectionAnchor('construction', W2_TZ_SECTION_SIGNOFF_VISUALS_ANCHOR)
          }
        >
          Канон
        </Button>
      </div>
    </div>
  );
}
