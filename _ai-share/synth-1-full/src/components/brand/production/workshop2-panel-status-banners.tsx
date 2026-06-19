'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Workshop2SurfaceStatusBanner } from '@/components/brand/production/Workshop2SurfaceStatusBanner';
import type { Workshop2ReleaseRoutingPanelDisplay } from '@/lib/production/workshop2-release-routing-status';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  WORKSHOP2_SURFACE_BANNER_INLINE_EMERALD_CLASS,
  WORKSHOP2_SURFACE_BANNER_INLINE_WARN_CLASS,
} from '@/lib/production/workshop2-surface-banner-tokens';
import { cn } from '@/lib/utils';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';
import type { Workshop2SupplyBundleStatus } from '@/lib/production/workshop2-supply-bundle-status';
import type { Workshop2StockBundleStatus } from '@/lib/production/workshop2-stock-bundle-status';
import type { Workshop2TaMilestonesStatus } from '@/lib/production/workshop2-ta-milestones-status';
import type { Workshop2LabDipStatusSummary } from '@/lib/production/workshop2-lab-dip-status';
import type { Workshop2ReleaseRoutingStatus } from '@/lib/production/workshop2-release-routing-status';
import type { Workshop2PomTableStatus } from '@/lib/production/workshop2-pom-table-status';
import type { Workshop2InfoPickMatrixGapSummary } from '@/lib/production/workshop2-infopick-matrix-fill-gaps';

/** Thin wrappers → единый Workshop2SurfaceStatusBanner (Phase 1B). */

export function Workshop2SupplyBundleStatusBanner({
  status,
}: {
  status: Workshop2SupplyBundleStatus;
}) {
  if (!status.hintRu) return null;
  return (
    <Workshop2SurfaceStatusBanner
      hintRu={status.hintRu}
      detailRu={`Строк снабжения: ${status.lineCount} · с qty: ${status.linesWithQty} · BOM мат./фурн.: ${status.bomMaterialLineCount}/${status.bomTrimLineCount}${status.plannedPoQty > 0 ? ` · PO qty: ${status.plannedPoQty}` : ''}`}
    />
  );
}

export function Workshop2StockBundleStatusBanner({
  status,
}: {
  status: Workshop2StockBundleStatus;
}) {
  if (!status.hintRu) return null;
  return (
    <Workshop2SurfaceStatusBanner
      hintRu={status.hintRu}
      detailRu={`Движений: ${status.movementCount} · остаток: ${status.qtyOnHand.toLocaleString('ru-RU')} ед.`}
      tone={status.negativeBalance ? 'rose' : status.state === 'ready' ? 'emerald' : 'amber'}
    />
  );
}

export function Workshop2TaMilestonesStatusBanner({
  status,
}: {
  status: Workshop2TaMilestonesStatus;
}) {
  if (!status.hintRu) return null;
  return (
    <Workshop2SurfaceStatusBanner
      hintRu={status.hintRu}
      detailRu={
        status.milestoneCount > 0
          ? `Milestones: ${status.milestoneCount} · done ${status.completedCount}`
          : undefined
      }
      tone={status.state === 'ready' ? 'emerald' : 'amber'}
    />
  );
}

export function Workshop2LabDipStatusBanner({
  summary,
}: {
  summary: Workshop2LabDipStatusSummary | null;
}) {
  if (!summary?.hintRu) return null;
  return (
    <Workshop2SurfaceStatusBanner
      hintRu={summary.hintRu}
      detailRu={
        summary.colorwayCount > 0
          ? `Colorway: ${summary.colorwayCount} · approved ${summary.approvedCount}`
          : undefined
      }
      tone={summary.state === 'ready' ? 'emerald' : 'amber'}
    />
  );
}

export function Workshop2ReleaseRoutingStatusBanner({
  status,
}: {
  status: Workshop2ReleaseRoutingStatus;
}) {
  if (!status.hintRu) return null;
  return (
    <Workshop2SurfaceStatusBanner
      hintRu={status.hintRu}
      detailRu={`Маршрут: ${status.routingStepCount} шаг. (${status.routingSource}) · SAM: ${status.totalSashMin} мин · операций выпуска: ${status.releaseOperationCount}`}
      tone={status.state === 'ready' ? 'emerald' : 'amber'}
    />
  );
}

/** QW5: routing banner + PG chips → один collapsible на вкладке release. */
export function Workshop2ReleaseStatusCollapsible({
  routingStatus,
  dossier,
}: {
  routingStatus: Workshop2ReleaseRoutingPanelDisplay;
  dossier?: Workshop2DossierPhase1 | null;
}) {
  const mirror = dossier?.releaseRoutingMirror;
  const mirrorAt = mirror ? workshop2PgMirrorStr(mirror, 'mirroredAt') : '';
  const hasMirrorChip = Boolean(mirrorAt);
  const hasLocalWarning = !hasMirrorChip && routingStatus.routingStepCount > 0;
  const hasRoutingHint = Boolean(routingStatus.hintRu);
  const hasContent = hasRoutingHint || hasMirrorChip || hasLocalWarning;
  const [open, setOpen] = useState(false);

  if (!hasContent) return null;

  const toneLabel =
    routingStatus.mirrorInPg && routingStatus.state === 'ready'
      ? 'готово'
      : routingStatus.mirrorInPg
        ? 'mirror в PG'
        : 'требует внимания';

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="border-border-subtle bg-bg-surface2/40 rounded-lg border"
      data-testid="workshop2-release-status-collapsible"
    >
      <summary className="text-text-primary flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-medium [&::-webkit-details-marker]:hidden">
        <span>
          Статус выпуска · {toneLabel}
          {routingStatus.routingStepCount > 0 ? ` · ${routingStatus.routingStepCount} шаг.` : ''}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')}
        />
      </summary>
      <div className="border-border-subtle space-y-2 border-t px-3 py-2">
        <Workshop2ReleaseRoutingStatusBanner status={routingStatus} />
        {hasMirrorChip ? (
          <p
            className={WORKSHOP2_SURFACE_BANNER_INLINE_EMERALD_CLASS}
            data-testid="release-routing-pg-chip"
          >
            releaseRoutingMirror в PG · {new Date(mirrorAt).toLocaleString('ru-RU')} ·{' '}
            {workshop2PgMirrorStr(mirror!, 'routingSource')} ·{' '}
            {workshop2PgMirrorStr(mirror!, 'state')}
          </p>
        ) : hasLocalWarning ? (
          <p
            className={WORKSHOP2_SURFACE_BANNER_INLINE_WARN_CLASS}
            data-testid="release-routing-pg-chip"
          >
            Маршрут локально ({routingStatus.routingStepCount} шаг.) — сохраните mirror routingSteps
            в PG.
          </p>
        ) : null}
      </div>
    </details>
  );
}

export function Workshop2PomTableStatusBanner({ status }: { status: Workshop2PomTableStatus }) {
  if (!status.hintRu) return null;
  return (
    <Workshop2SurfaceStatusBanner
      hintRu={status.hintRu}
      detailRu={
        status.measurementRowCount > 0
          ? `Строк POM: ${status.measurementRowCount} · ячеек ${status.filledPerSizeCells}/${status.totalPerSizeCells}`
          : undefined
      }
      tone={status.state === 'ready' ? 'emerald' : 'amber'}
    />
  );
}

export function Workshop2InfoPickMatrixGapsBanner({
  summary,
}: {
  summary: Workshop2InfoPickMatrixGapSummary | null;
}) {
  if (!summary?.hintRu || summary.missingCount === 0) return null;
  const preview = summary.rows
    .filter((r) => !r.filled && r.linkedToMatrix)
    .slice(0, 4)
    .map((r) => r.labelRu)
    .join(', ');
  return (
    <Workshop2SurfaceStatusBanner
      hintRu={summary.hintRu}
      detailRu={
        preview ? `Примеры: ${preview}${summary.missingMatrixCount > 4 ? '…' : ''}` : undefined
      }
    />
  );
}
