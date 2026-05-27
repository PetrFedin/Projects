'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  buildWorkshop2Ss27RuJourneySteps,
  resolveWorkshop2Ss27RuJourneyActiveStep,
  WORKSHOP2_SS27_COLLECTION_ID,
  type Workshop2RuJourneyStep,
} from '@/lib/production/workshop2-ru-journey-ss27';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

const STATUS_CLASS: Record<Workshop2RuJourneyStep['status'], string> = {
  done: 'border-emerald-400 bg-emerald-50 text-emerald-900',
  active: 'border-indigo-400 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-300',
  pending: 'border-slate-200 bg-white text-slate-700',
  blocked: 'border-amber-300 bg-amber-50 text-amber-950',
};

/** Компактный stepper «Путь SS27» на хабе (5 шагов, без модалки). */
export function Workshop2RuSs27JourneyStepper({
  collectionId,
  articleId,
  dossier,
}: {
  collectionId: string;
  articleId: string;
  dossier?: Workshop2DossierPhase1 | null;
}) {
  if (collectionId.trim() !== WORKSHOP2_SS27_COLLECTION_ID) return null;

  const steps = buildWorkshop2Ss27RuJourneySteps({
    collectionId,
    articleId,
    dossier,
  });
  const activeId = resolveWorkshop2Ss27RuJourneyActiveStep(steps);

  return (
    <nav
      className="rounded-lg border border-indigo-200/80 bg-indigo-50/40 px-3 py-2"
      aria-label="Путь SS27"
      data-testid="workshop2-ru-ss27-journey-stepper"
    >
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-indigo-900">
        Путь SS27 · коллекция → образец → цех
      </p>
      <ol className="flex flex-wrap gap-1.5">
        {steps.map((step) => (
          <li key={step.id}>
            <Link
              href={step.href}
              title={step.hintRu}
              data-testid={`workshop2-ru-journey-step-${step.order}`}
              className={cn(
                'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-semibold transition-colors hover:opacity-90',
                STATUS_CLASS[step.status],
                step.id === activeId && 'shadow-sm'
              )}
            >
              <span className="tabular-nums opacity-70">{step.order}</span>
              {step.labelRu}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
