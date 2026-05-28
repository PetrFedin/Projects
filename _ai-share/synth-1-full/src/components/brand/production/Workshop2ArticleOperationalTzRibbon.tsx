'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Link2 } from 'lucide-react';
import {
  buildWorkshop2OperationalTzBridge,
  workshop2OperationalTabToTzW2Sec,
  type Workshop2OperationalPipelineTab,
} from '@/lib/production/workshop2-article-operational-tz-bridge';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Workshop2DossierPersistButton } from '@/components/brand/production/Workshop2DossierPersistButton';

/** ÐÐ´Ð¸Ð½Ð°Ñ Ð»ÐµÐ½ÑÐ° Â«Ð¾Ð¿ÐµÑÐ°ÑÐ¸Ð¾Ð½Ð½Ð°Ñ Ð²ÐºÐ»Ð°Ð´ÐºÐ° â Ð¢ÐÂ» Ð´Ð»Ñ Ð¼Ð°ÑÑÑÑÑÐ° Ð°ÑÑÐ¸ÐºÑÐ»Ð°. */
export function Workshop2ArticleOperationalTzRibbon({
  tab,
  dossier,
  leaf,
  articleUrlSegment,
}: {
  tab: Workshop2OperationalPipelineTab;
  dossier: Workshop2DossierPhase1 | null;
  leaf: HandbookCategoryLeaf | null | undefined;
  /** Ð¡ÐµÐ³Ð¼ÐµÐ½Ñ Ð¿ÑÑÐ¸ `.../a/:segment` â ÑÐ¼. `workshop2ArticleUrlSegment`. */
  articleUrlSegment: string;
}) {
  const { ref } = useArticleWorkspace();
  const b = useMemo(
    () => buildWorkshop2OperationalTzBridge(tab, dossier, leaf),
    [tab, dossier, leaf]
  );
  const w2sec = workshop2OperationalTabToTzW2Sec(tab);
  const href = workshop2ArticleHref(ref.collectionId, articleUrlSegment, {
    w2pane: 'tz',
    w2sec,
  });

  return (
    <div className="border-border-default mb-4 rounded-xl border border-dashed border-slate-300/80 bg-gradient-to-r from-slate-50/95 via-white to-slate-50/40 px-3 py-2.5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-text-primary flex items-center gap-1.5 text-[11px] font-semibold">
            <Link2 className="text-accent-primary h-3.5 w-3.5 shrink-0" aria-hidden />
            Ð¡Ð²ÑÐ·Ñ Ñ ÑÐµÑÐ½Ð¸ÑÐµÑÐºÐ¸Ð¼ Ð·Ð°Ð´Ð°Ð½Ð¸ÐµÐ¼
          </p>
          <p className="text-text-secondary text-[11px] leading-snug">{b.contractLine}</p>
          <p className="text-text-muted text-[10px] leading-snug">{b.overallLine}</p>
          <p className="text-text-primary text-[10px] font-semibold tabular-nums">
            {b.focusPctLabel}
          </p>
        </div>
        <Workshop2DossierPersistButton
          busy={false}
          disabled={!dossier}
          title="operationalTzBridge"
          onClick={() => {}}
        />
        <Link
          href={href}
          className="border-border-default text-accent-primary hover:border-accent-primary/40 hover:bg-accent-primary/5 shrink-0 rounded-md border bg-white px-2.5 py-1.5 text-[10px] font-semibold shadow-sm transition-colors"
        >
          ÐÑÐºÑÑÑÑ Ð¢Ð â
        </Link>
      </div>
      {b.blockerLines.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-0.5 border-t border-amber-100/90 pt-2 text-[10px] leading-snug text-amber-950">
          {b.blockerLines.map((line, idx) => (
            <li key={`${idx}-${line.slice(0, 96)}`}>{line}</li>
          ))}
        </ul>
      ) : (
        <p className="text-text-muted border-border-subtle/70 mt-2 border-t pt-2 text-[10px] leading-snug">
          ÐÐ¾ ÑÐ²ÑÐ·Ð°Ð½Ð½ÑÐ¼ ÑÐ°Ð·Ð´ÐµÐ»Ð°Ð¼ Ð¢Ð Ð½ÐµÑ Ð¾ÑÐºÑÑÑÑÑ Ð¿ÑÐµÐ´ÑÐ¿ÑÐµÐ¶Ð´ÐµÐ½Ð¸Ð¹
          Ð´Ð²Ð¸Ð¶ÐºÐ° Ð³Ð¾ÑÐ¾Ð²Ð½Ð¾ÑÑÐ¸.
        </p>
      )}
    </div>
  );
}
