'use client';

import Link from 'next/link';
import { Workshop2DossierPersistButton } from '@/components/brand/production/Workshop2DossierPersistButton';
import {
  buildWorkshop2RelatedSectionsBundle,
  type Workshop2RelatedSectionLink,
} from '@/lib/production/workshop2-related-sections';
import type { Workshop2RelatedNextStep } from '@/lib/production/workshop2-related-next-step';
import type { Workshop2ArticleMainTab } from '@/lib/production/workshop2-collection-metrics';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

type Props = {
  collectionId: string;
  articleUrlSegment: string;
  activeTab: Workshop2ArticleMainTab | 'overview';
  focusDossierSection?: DossierSection | null;
  sampleOrderStatus?: string;
  nextStep?: Workshop2RelatedNextStep | null;
  /** Досье для счётчика Vault в полосе (wave 19 #23). */
  dossier?: Workshop2DossierPhase1 | null;
  onPersistRelatedMirror?: () => void;
  relatedMirrorBusy?: boolean;
  className?: string;
};

/** Компактная полоса перекрёстных ссылок по маршруту образца. */
export function Workshop2ArticleRelatedSectionsStrip({
  collectionId,
  articleUrlSegment,
  activeTab,
  focusDossierSection,
  sampleOrderStatus,
  nextStep,
  dossier,
  onPersistRelatedMirror,
  relatedMirrorBusy = false,
  className,
}: Props) {
  const { links, nextStep: resolvedNext } = buildWorkshop2RelatedSectionsBundle({
    collectionId,
    articleUrlSegment,
    activeTab,
    focusDossierSection,
    sampleOrderStatus,
    nextStep,
    dossier,
  });
  const step = resolvedNext ?? nextStep ?? null;
  if (links.length === 0 && !step) return null;

  return (
    <nav
      className={cn(
        'border-border-subtle flex flex-col gap-1.5 rounded-lg border bg-slate-50/80 px-2 py-1.5',
        className
      )}
      aria-label="Связанные разделы"
    >
      {step ? (
        <p className="text-[10px] leading-snug text-amber-900">
          <span className="font-semibold">Следующий шаг: </span>
          <Link href={step.href} className="underline">
            {step.labelRu}
          </Link>
          <span className="text-text-muted"> — {step.reasonRu}</span>
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-text-muted shrink-0 text-[10px] font-semibold uppercase tracking-wide">
          Связанные разделы
        </span>
        {links.map((l) => (
          <RelatedLink key={l.id} link={l} />
        ))}
        {onPersistRelatedMirror ? (
          <Workshop2DossierPersistButton
            busy={relatedMirrorBusy}
            className="h-6 text-[10px]"
            title="relatedSectionsMirror "
            onClick={onPersistRelatedMirror}
          />
        ) : null}
      </div>
    </nav>
  );
}

function RelatedLink({ link }: { link: Workshop2RelatedSectionLink }) {
  return (
    <Link
      href={link.href}
      title={link.title}
      className={cn(
        'rounded-md border px-2 py-0.5 text-[10px] font-medium transition-colors',
        link.highlight
          ? 'border-amber-300 bg-amber-50 text-amber-950'
          : 'border-border-default hover:bg-bg-surface text-text-primary bg-white'
      )}
    >
      {link.labelRu}
    </Link>
  );
}
