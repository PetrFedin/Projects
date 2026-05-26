'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Workshop2SurfaceStatusBanner } from '@/components/brand/production/Workshop2SurfaceStatusBanner';
import { Workshop2DossierPersistButton } from '@/components/brand/production/Workshop2DossierPersistButton';
import type { Workshop2AssignmentSignoffChecklistSummary } from '@/lib/production/workshop2-assignment-signoff-checklist';
import type { Workshop2FactoryHandoffBundleStatus } from '@/lib/production/workshop2-factory-handoff-bundle-status';
import type { Workshop2HandoffPdfExportReadiness } from '@/lib/production/workshop2-handoff-pdf-export-readiness';
import {
  WORKSHOP2_SURFACE_BANNER_INLINE_EMERALD_CLASS,
  WORKSHOP2_SURFACE_BANNER_INLINE_WARN_CLASS,
} from '@/lib/production/workshop2-surface-banner-tokens';

export function Workshop2AssignmentSignoffChecklistBanner({
  summary,
}: {
  summary: Workshop2AssignmentSignoffChecklistSummary | null;
}) {
  if (!summary?.hintRu) return null;
  return (
    <Workshop2SurfaceStatusBanner
      hintRu={summary.hintRu}
      detailRu={`Подписи секций: ${summary.sectionsSigned}/${summary.sectionsTotal}${summary.handoffBrandDispatched ? ' · бренд передал' : ''}${summary.handoffFactoryReceived ? ' · цех ACK' : ''}`}
    />
  );
}

export function Workshop2FactoryHandoffBundleBanner({
  status,
}: {
  status: Workshop2FactoryHandoffBundleStatus | null;
}) {
  if (!status?.hintRu) return null;
  return (
    <Workshop2SurfaceStatusBanner
      hintRu={status.hintRu}
      detailRu={status.state !== 'none' ? `Состояние: ${status.state}` : undefined}
      tone={status.state === 'acknowledged' ? 'emerald' : status.state === 'none' ? 'amber' : 'amber'}
    />
  );
}

export function Workshop2HandoffPdfExportReadinessBanner({
  readiness,
}: {
  readiness: Workshop2HandoffPdfExportReadiness | null;
}) {
  if (!readiness?.hintRu) return null;
  const tone =
    readiness.state === 'blocked' ? 'rose' : readiness.state === 'warn' ? 'amber' : 'emerald';
  return (
    <Workshop2SurfaceStatusBanner
      hintRu={readiness.hintRu}
      detailRu={
        readiness.blockers.length > 1
          ? readiness.blockers.slice(0, 3).join(' · ')
          : undefined
      }
      tone={tone}
    />
  );
}

/** Assignment: signoff + handoff bundle + persist — один collapsible блок (audit §4 #12). */
export function Workshop2AssignmentHandoffStatusCollapsible({
  assignmentSummary,
  handoffStatus,
  onPersistHandoff,
  handoffMirrorBusy,
  techPackReady,
}: {
  assignmentSummary: Workshop2AssignmentSignoffChecklistSummary | null;
  handoffStatus: Workshop2FactoryHandoffBundleStatus | null;
  onPersistHandoff: () => void;
  handoffMirrorBusy: boolean;
  /** Tech pack sections complete — компактная подсказка вместо отдельных Card-баннеров. */
  techPackReady?: boolean;
}) {
  const hasContent = Boolean(assignmentSummary?.hintRu || handoffStatus?.hintRu || techPackReady !== undefined);
  const [open, setOpen] = useState(false);

  if (!hasContent) return null;

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="rounded-lg border border-border-subtle bg-bg-surface2/40"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-text-primary [&::-webkit-details-marker]:hidden">
        <span>
          Статус задания и handoff
          {techPackReady !== undefined
            ? ` · Tech pack ${techPackReady ? 'готов' : 'не готов'}`
            : ''}
        </span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')} />
      </summary>
      <div className="space-y-2 border-t border-border-subtle px-3 py-2">
        {techPackReady !== undefined ? (
          <p
            className={cn(
              'leading-snug',
              techPackReady
                ? WORKSHOP2_SURFACE_BANNER_INLINE_EMERALD_CLASS
                : WORKSHOP2_SURFACE_BANNER_INLINE_WARN_CLASS
            )}
          >
            {techPackReady
              ? 'Паспорт, визуал, материалы и конструкция — готовы к передаче в цех.'
              : 'Завершите все разделы ТЗ (100%) перед передачей на фабрику.'}
          </p>
        ) : null}
        <Workshop2AssignmentSignoffChecklistBanner summary={assignmentSummary} />
        <Workshop2FactoryHandoffBundleBanner status={handoffStatus} />
        <Workshop2DossierPersistButton busy={handoffMirrorBusy} onClick={onPersistHandoff} title="factoryHandoffBundleMirror → PG" />
      </div>
    </details>
  );
}
