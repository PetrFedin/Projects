'use client';

import Link from 'next/link';
import {
  partitionWorkshop2GateChecksForUi,
  type Workshop2ApiGateCheck,
} from '@/lib/production/workshop2-api-gate-messages';
import { localizeWorkshop2GateChecks } from '@/lib/production/workshop2-gate-messages-ru';
import { resolveWorkshop2GateCheckAction } from '@/lib/production/workshop2-gate-check-actions';
import { cn } from '@/lib/utils';

type Props = {
  checks?: Workshop2ApiGateCheck[];
  title?: string;
  className?: string;
  testId?: string;
  /** Контекст для actionable deep links. */
  collectionId?: string;
  articleUrlSegment?: string;
  /** Wave 29: scroll к fixing pane вместо только Link. */
  onGateAction?: (action: { href: string; checkId?: string }) => void;
};

/** Inline-список gate checks (409 sample-order, handoff PDF и др.) — полный перечень без обрезки toast. */
export function Workshop2GateChecksBlock({
  checks,
  title = 'Блокеры и предупреждения',
  className,
  testId = 'workshop2-gate-checks-block',
  collectionId,
  articleUrlSegment,
  onGateAction,
}: Props) {
  const localized = localizeWorkshop2GateChecks(checks);
  const { blockers, warnings, ordered } = partitionWorkshop2GateChecksForUi(localized);
  if (ordered.length === 0) return null;

  const canLink = Boolean(collectionId?.trim() && articleUrlSegment?.trim());

  return (
    <div
      className={cn(
        'rounded-md border border-rose-200/80 bg-rose-50/60 px-3 py-2 text-[10px] leading-snug text-rose-950',
        className
      )}
      data-testid={testId}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-900/90">
        {title}
        {blockers.length > 0 ? ` · блокеров ${blockers.length}` : ''}
        {warnings.length > 0 ? ` · предупр. ${warnings.length}` : ''}
      </p>
      <ul className="mt-1.5 space-y-1">
        {ordered.map((check, index) => {
          const action =
            canLink && collectionId && articleUrlSegment
              ? resolveWorkshop2GateCheckAction(check, {
                  collectionId,
                  articleSegment: articleUrlSegment,
                })
              : null;
          return (
            <li
              key={check.id ?? `${check.severity ?? 'check'}-${index}`}
              className={cn(
                'flex flex-wrap items-start gap-1.5',
                check.severity === 'warning' ? 'text-amber-900' : 'text-rose-900'
              )}
            >
              <span aria-hidden className="shrink-0 font-mono text-[9px] uppercase opacity-70">
                {check.severity === 'warning' ? 'предупр.' : 'блок.'}
              </span>
              <span className="min-w-0 flex-1">{check.messageRu}</span>
              {action ? (
                onGateAction ? (
                  <button
                    type="button"
                    className="shrink-0 font-semibold text-indigo-700 underline-offset-2 hover:underline"
                    data-testid={`workshop2-gate-check-action-${check.id ?? index}`}
                    onClick={() =>
                      onGateAction({ href: action.href, checkId: check.id ?? String(index) })
                    }
                  >
                    {action.labelRu} →
                  </button>
                ) : (
                  <Link
                    href={action.href}
                    className="shrink-0 font-semibold text-indigo-700 underline-offset-2 hover:underline"
                    data-testid={`workshop2-gate-check-action-${check.id ?? index}`}
                  >
                    {action.labelRu} →
                  </Link>
                )
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
