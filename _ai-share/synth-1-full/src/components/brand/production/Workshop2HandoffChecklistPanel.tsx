'use client';

import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import {
  resolveWorkshop2PreflightJumpTarget,
  buildWorkshop2W2secDeepLink,
} from '@/lib/production/workshop2-preflight-anchor-map';
import type { W2ProductionPreflightIssue } from '@/lib/production/workshop2-production-preflight';
import { cn } from '@/lib/utils';
import { ChevronDown, ExternalLink } from 'lucide-react';

type Props = {
  blockers: W2ProductionPreflightIssue[];
  warnings?: W2ProductionPreflightIssue[];
  /** Переход к якорю раздела ТЗ (закрыть диалог — на стороне вызывающего). */
  onJump?: (section: DossierSection, anchorId: string) => void;
  /** Wave 29: deep link w2sec когда нет onJump. */
  collectionId?: string;
  articleId?: string;
  className?: string;
  defaultOpen?: boolean;
};

/**
 * Свернутый чеклист передачи: блокеры pre-flight как actionable-ссылки на разделы ТЗ.
 */
export function Workshop2HandoffChecklistPanel({
  blockers,
  warnings = [],
  onJump,
  collectionId,
  articleId,
  className,
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const actionable = [...blockers, ...warnings.filter((w) => w.severity === 'blocker')];
  const preview = blockers.length
    ? `${blockers.length} блокер${blockers.length === 1 ? '' : blockers.length < 5 ? 'а' : 'ов'}`
    : 'блокеров нет';

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn(
        'border-border-default bg-bg-surface2/60 rounded-lg border text-[11px]',
        className
      )}
    >
      <CollapsibleTrigger
        type="button"
        className="hover:bg-bg-surface2 flex w-full items-center gap-2 px-3 py-2 text-left transition-colors"
      >
        <ChevronDown
          className={cn(
            'text-text-muted h-3.5 w-3.5 shrink-0 transition-transform',
            open && 'rotate-180'
          )}
          aria-hidden
        />
        <span className="min-w-0 flex-1">
          <span className="text-text-primary font-semibold">Чеклист передачи</span>
          <span className="text-text-secondary mt-0.5 block">{preview}</span>
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-border-default/80 space-y-2 border-t px-3 py-2.5">
        {blockers.length === 0 ? (
          <p className="text-[10px] text-emerald-800">
            Критичных блокеров pre-flight нет — проверьте ворота handoff и подписи секций.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {blockers.map((issue) => {
              const target = resolveWorkshop2PreflightJumpTarget(issue);
              const canJump = Boolean(onJump);
              const deepHref =
                !canJump && collectionId?.trim() && articleId?.trim()
                  ? buildWorkshop2W2secDeepLink({
                      collectionId: collectionId.trim(),
                      articleId: articleId.trim(),
                      dossierSection: target.dossierSection,
                      anchorId: target.anchorId,
                    })
                  : null;
              return (
                <li key={issue.id}>
                  {canJump ? (
                    <button
                      type="button"
                      className="group flex w-full items-start gap-1.5 rounded-md border border-rose-100 bg-rose-50/80 px-2 py-1.5 text-left text-[10px] text-rose-950 transition-colors hover:border-rose-200 hover:bg-rose-50"
                      onClick={() => onJump!(target.dossierSection, target.anchorId)}
                    >
                      <ExternalLink
                        className="mt-0.5 h-3 w-3 shrink-0 opacity-60 group-hover:opacity-100"
                        aria-hidden
                      />
                      <span>
                        <span className="font-semibold">{issue.label}</span>
                        <span className="mt-0.5 block leading-snug text-rose-900/80">
                          {issue.detail}
                        </span>
                        <span className="text-text-muted mt-0.5 block font-mono text-[9px]">
                          w2sec={target.anchorId}
                        </span>
                      </span>
                    </button>
                  ) : deepHref ? (
                    <a
                      href={deepHref}
                      className="group flex w-full items-start gap-1.5 rounded-md border border-rose-100 bg-rose-50/80 px-2 py-1.5 text-left text-[10px] text-rose-950 transition-colors hover:border-rose-200 hover:bg-rose-50"
                    >
                      <ExternalLink
                        className="mt-0.5 h-3 w-3 shrink-0 opacity-60 group-hover:opacity-100"
                        aria-hidden
                      />
                      <span>
                        <span className="font-semibold">{issue.label}</span>
                        <span className="mt-0.5 block leading-snug text-rose-900/80">
                          {issue.detail}
                        </span>
                        <span className="text-text-muted mt-0.5 block font-mono text-[9px]">
                          w2sec={target.anchorId}
                        </span>
                      </span>
                    </a>
                  ) : (
                    <div className="rounded-md border border-rose-100 bg-rose-50/80 px-2 py-1.5 text-[10px] text-rose-950">
                      <span className="font-semibold">{issue.label}</span>
                      <span className="mt-0.5 block leading-snug">{issue.detail}</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {warnings.length > 0 && blockers.length > 0 ? (
          <p className="text-text-muted text-[9px]">
            + {warnings.length} предупреждений (не блокируют передачу)
          </p>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  );
}
