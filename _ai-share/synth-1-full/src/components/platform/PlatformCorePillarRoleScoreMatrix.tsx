'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { usePlatformCoreChainOverview } from '@/components/platform/usePlatformCoreChainOverview';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import {
  PLATFORM_CORE_HUB_ROWS,
  PLATFORM_CORE_PILLARS,
  isPlatformCoreEmptyChainCollection,
} from '@/lib/platform-core-hub-matrix';
import {
  ROLE_LABELS,
  formatReadinessScore,
  getPlatformCoreReadinessMatrix,
  readinessScoreTone,
  summarizePlatformCoreReadiness,
  type ReadinessCell,
  type ReadinessSubItem,
} from '@/lib/platform-core-readiness-audit';
import { PlatformCoreReadinessMatrixSkeleton } from '@/components/platform/PlatformCoreReadinessMatrixSkeleton';
import { stackHubMatrixLabelLines } from '@/lib/platform-core-matrix-label-lines';
import { hubSectionLabelClassName, platformCoreHubLayout } from '@/lib/platform-core-hub-layout';
import { cn } from '@/lib/utils';
import {
  buildPlatformCoreReadinessImprovements,
  type ReadinessImprovementItem,
} from '@/lib/platform-core-readiness-improvements';
import type { CoreHubPillarId } from '@/lib/platform-core-hub-matrix';

type Props = {
  collectionId?: string;
};

function cellKey(roleId: string, pillarId: string) {
  return `${roleId}__${pillarId}`;
}

/** Колонка «Роль» — фиксированная ширина. */
const READINESS_ROLE_COL =
  'w-[5.35rem] min-w-[5.35rem] max-w-[5.35rem] shrink-0 bg-white align-middle';

/** Sticky только в общей таблице (desktop / широкий экран). */
const READINESS_ROLE_COL_STICKY = cn(
  READINESS_ROLE_COL,
  'sticky left-0 z-30 border-border-subtle border-r bg-white'
);

const READINESS_PILLAR_COL =
  'relative z-0 w-[4.65rem] min-w-[4.65rem] max-w-[4.65rem] px-0.5 text-center align-middle';

const READINESS_MATRIX_HEAD_H = platformCoreHubLayout.matrixHeadRow;

const READINESS_MATRIX_BODY_H = platformCoreHubLayout.matrixBodyRow;

const READINESS_MATRIX_FOOT_H = platformCoreHubLayout.matrixFootRow;

const READINESS_PILLAR_HEAD = cn(READINESS_PILLAR_COL, READINESS_MATRIX_HEAD_H);

const READINESS_SCORE_BOX =
  'inline-flex h-6 w-8 shrink-0 items-center justify-center rounded-md border font-mono text-[10px] font-bold tabular-nums transition-colors';

const READINESS_ROW_LABEL = 'flex h-full items-center py-0';

const READINESS_CELL_CORE =
  'flex h-full items-center justify-center gap-0.5 px-0.5';

const MATRIX_COL_LABEL =
  'text-text-primary block max-w-full text-[8px] font-semibold leading-[1.18] sm:text-[9px]';

/** Заголовок столбца / подпись роли — до 2 строк, служебные слова не отрываем. */
function MatrixColumnLabel({
  text,
  align = 'center',
}: {
  text: string;
  align?: 'center' | 'start';
}) {
  const lines = stackHubMatrixLabelLines(text);
  if (lines.length === 1) {
    return (
      <span className={cn(MATRIX_COL_LABEL, align === 'start' ? 'text-left' : 'text-center')}>
        {lines[0]}
      </span>
    );
  }
  return (
    <span
      className={cn(
        'flex max-w-full flex-col gap-px',
        align === 'start' ? 'items-start text-left' : 'items-center text-center'
      )}
    >
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className={MATRIX_COL_LABEL}>
          {line}
        </span>
      ))}
    </span>
  );
}

/** Сильная ячейка по ручному аудиту; 9+ не используем — нет телеметрии «идеала». */
function isReadinessStrong(score: number | null): boolean {
  return score != null && score >= 8.5;
}

function truncateReadinessSummary(text: string, maxLen = 36): string {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen);
  const space = cut.lastIndexOf(' ');
  return `${(space > 40 ? cut.slice(0, space) : cut).trim()}…`;
}

function ScoreTooltipBody({ cell, live }: { cell: ReadinessCell; live: boolean }) {
  const score = live ? cell.liveScore : cell.staticScore;
  const pillarTitle =
    PLATFORM_CORE_PILLARS.find((p) => p.id === cell.pillarId)?.title ?? cell.pillarId;

  if (!cell.active) {
    return (
      <div className="max-w-sm space-y-1.5 text-left text-[11px] leading-snug">
        <p className="font-semibold">
          {ROLE_LABELS[cell.roleId]} · {pillarTitle}
        </p>
        <p className="text-text-muted italic">
          {cell.emptyReason ?? 'Роль не участвует в этом столпе'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm space-y-2 text-left text-[11px] leading-snug">
      <p className="font-semibold">
        {ROLE_LABELS[cell.roleId]} · {pillarTitle}
        {' — '}
        {formatReadinessScore(score)}/10
      </p>
      <p className="text-text-secondary">{truncateReadinessSummary(cell.summary)}</p>
      {cell.subItems.length > 0 ? (
        <p className="text-text-muted text-[10px]">Нажмите на оценку — развернуть разделы ниже.</p>
      ) : null}
      {cell.workspaceHref ? (
        <p className="text-text-muted border-border-subtle border-t pt-2 text-[10px]">
          <Link
            href={cell.workspaceHref}
            className="text-accent-primary font-semibold hover:underline"
          >
            Открыть рабочий экран →
          </Link>
        </p>
      ) : null}
    </div>
  );
}

function ReadinessScoreTrigger({
  cell,
  live,
  isOpen,
  onToggleSections,
}: {
  cell: ReadinessCell;
  live: boolean;
  isOpen?: boolean;
  onToggleSections?: () => void;
}) {
  const score = live ? cell.liveScore : cell.staticScore;
  const href = cell.active ? cell.workspaceHref : cell.cabinetHref;
  const tone = readinessScoreTone(score, live);
  const done = isReadinessStrong(score);
  const hasSections = cell.active && cell.subItems.length > 0;
  const boxClassName = cn(
    READINESS_SCORE_BOX,
    'hover:border-accent-primary/50 hover:bg-accent-primary/5',
    tone,
    done && 'border-emerald-200/80 bg-emerald-50/40',
    hasSections && isOpen && 'border-accent-primary/60 bg-accent-primary/5'
  );
  const label = `${ROLE_LABELS[cell.roleId]} ${cell.pillarId}: ${formatReadinessScore(score)}`;
  const scoreContent = (
    <>
      {done ? (
        <CheckCircle2
          className={cn(
            'h-3 w-3 shrink-0 text-emerald-600',
            live && 'motion-safe:duration-300 motion-safe:animate-in motion-safe:zoom-in-50'
          )}
          aria-hidden
        />
      ) : null}
      {formatReadinessScore(score)}
    </>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {hasSections ? (
          <button
            type="button"
            data-testid={`readiness-score-${cell.roleId}-${cell.pillarId}`}
            onClick={onToggleSections}
            className={boxClassName}
            aria-expanded={isOpen}
            aria-label={label}
          >
            {scoreContent}
          </button>
        ) : (
          <Link
            href={href}
            data-testid={`readiness-score-${cell.roleId}-${cell.pillarId}`}
            className={boxClassName}
            aria-label={label}
          >
            {scoreContent}
          </Link>
        )}
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-sm p-3">
        <ScoreTooltipBody cell={cell} live={live} />
      </TooltipContent>
    </Tooltip>
  );
}

function SectionSubItemTooltipBody({ sub, live }: { sub: ReadinessSubItem; live: boolean }) {
  const score = live ? sub.liveScore : sub.staticScore;
  return (
    <div className="max-w-sm space-y-2 text-left text-[11px] leading-snug">
      <p className="font-semibold">
        {sub.label} — {formatReadinessScore(score)}/10
      </p>
      <p className="text-text-secondary">{truncateReadinessSummary(sub.summary)}</p>
    </div>
  );
}

function ReadinessSectionLink({
  sub,
  live,
  testId,
  summaryLines = 1,
}: {
  sub: ReadinessSubItem;
  live: boolean;
  testId: string;
  summaryLines?: 1 | 'full';
}) {
  const score = live ? sub.liveScore : sub.staticScore;
  const body = (
    <Link
      href={sub.href}
      data-testid={testId}
      className="hover:text-accent-primary group flex items-start justify-between gap-2"
    >
      <span className="text-text-secondary group-hover:text-accent-primary min-w-0 flex-1">
        <span className="text-text-muted font-mono">{sub.order}.</span> {sub.label}
        {summaryLines === 'full' ? (
          <span className="text-text-muted mt-1 block text-[11px] font-normal leading-snug">
            {sub.summary}
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          'shrink-0 font-mono text-[10px] font-semibold',
          readinessScoreTone(score, live)
        )}
      >
        {formatReadinessScore(score)}
      </span>
    </Link>
  );

  if (summaryLines === 'full') return body;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{body}</TooltipTrigger>
      <TooltipContent side="left" className="max-w-sm p-3">
        <SectionSubItemTooltipBody sub={sub} live={live} />
      </TooltipContent>
    </Tooltip>
  );
}

function ReadinessCellSectionsPanel({
  cell,
  live,
  testIdPrefix,
  variant,
}: {
  cell: ReadinessCell;
  live: boolean;
  testIdPrefix: string;
  variant: 'inline' | 'sheet';
}) {
  const score = live ? cell.liveScore : cell.staticScore;

  if (variant === 'sheet') {
    return (
      <div data-testid="readiness-sections-sheet" className="space-y-5 pb-2">
        <div className="border-border-subtle bg-bg-surface2/40 rounded-xl border p-4">
          <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
            Общая оценка
          </p>
          <p
            className={cn(
              'mt-1 font-mono text-3xl font-bold tabular-nums',
              readinessScoreTone(score, live)
            )}
          >
            {formatReadinessScore(score)}
            <span className="text-text-muted text-base font-semibold">/10</span>
          </p>
          <p className="text-text-secondary mt-2 text-xs leading-relaxed">{cell.summary}</p>
        </div>

        {cell.subItems.length > 0 ? (
          <div>
            <p className="text-text-muted mb-2 text-[10px] font-black uppercase tracking-widest">
              Разделы
            </p>
            <ol className="space-y-2">
              {cell.subItems.map((sub) => (
                <li
                  key={sub.id}
                  className="border-border-subtle rounded-xl border bg-white p-3 shadow-sm"
                >
                  <ReadinessSectionLink
                    sub={sub}
                    live={live}
                    testId={`${testIdPrefix}-${sub.order - 1}`}
                    summaryLines="full"
                  />
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {cell.workspaceHref ? (
          <Link
            href={cell.workspaceHref}
            className="text-accent-primary inline-flex items-center gap-1 text-sm font-semibold hover:underline"
          >
            Открыть рабочий экран
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        ) : null}
      </div>
    );
  }

  if (cell.subItems.length > 0) {
    return (
      <>
        <ol className="border-border-subtle mt-2 space-y-1 border-t pt-2 text-left">
          {cell.subItems.map((sub) => (
            <li key={sub.id}>
              <ReadinessSectionLink
                sub={sub}
                live={live}
                testId={`${testIdPrefix}-${sub.order - 1}`}
              />
            </li>
          ))}
        </ol>
        {cell.workspaceHref ? (
          <p className="text-text-muted mt-2 text-[10px]">
            <Link
              href={cell.workspaceHref}
              data-testid={`readiness-workspace-${cell.roleId}-${cell.pillarId}`}
              className="text-accent-primary inline-flex items-center gap-0.5 hover:underline"
            >
              Открыть столп
              <ExternalLink className="h-3 w-3" />
            </Link>
          </p>
        ) : null}
      </>
    );
  }

  if (cell.workspaceHref) {
    return (
      <p className="text-text-muted mt-2 text-[10px]">
        <Link
          href={cell.workspaceHref}
          data-testid={`readiness-workspace-${cell.roleId}-${cell.pillarId}`}
          className="text-accent-primary inline-flex items-center gap-0.5 hover:underline"
        >
          Открыть столп
          <ExternalLink className="h-3 w-3" />
        </Link>
      </p>
    );
  }

  return null;
}

function ReadinessImprovementLink({ item }: { item: ReadinessImprovementItem }) {
  return (
    <Link
      href={item.href}
      data-testid={`readiness-improvement-${item.id}`}
      className="hover:border-accent-primary/40 group block rounded-xl border bg-white p-3 shadow-sm transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-text-primary text-xs font-semibold leading-snug">
            <span className="text-text-muted font-mono text-[10px]">
              {item.priority.toFixed(0)}
            </span>{' '}
            {item.kind === 'fix' ? '→' : '·'} {item.title}
          </p>
          <p className="text-text-muted mt-1 text-[10px] leading-snug">
            {ROLE_LABELS[item.roleId]} · {PLATFORM_CORE_PILLARS.find((p) => p.id === item.pillarId)?.title}
            {item.sectionLabel ? ` · ${item.sectionLabel}` : ''}
          </p>
          <p className="text-text-secondary mt-2 text-[11px] leading-relaxed">{item.linkageRu}</p>
        </div>
        <ExternalLink className="text-text-muted group-hover:text-accent-primary mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60" />
      </div>
    </Link>
  );
}

function ReadinessImprovementsPanel({
  items,
  filterPillarId,
  variant,
}: {
  items: ReadinessImprovementItem[];
  filterPillarId?: CoreHubPillarId;
  variant: 'inline' | 'sheet';
}) {
  const pillarTitle = filterPillarId
    ? PLATFORM_CORE_PILLARS.find((p) => p.id === filterPillarId)?.title
    : null;

  if (items.length === 0) {
    return (
      <p className="text-text-muted py-2 text-xs italic">
        {filterPillarId
          ? `По столпу «${pillarTitle}» открытых доработок в аудите нет.`
          : 'Открытых доработок в аудите нет.'}
      </p>
    );
  }

  return (
    <div
      data-testid="readiness-improvements-panel"
      className={cn('space-y-2', variant === 'sheet' ? 'pb-2' : 'pt-2')}
    >
      <p className="text-text-muted text-[10px] leading-snug">
        {filterPillarId
          ? `Доработки столпа «${pillarTitle}» и сквозные связи · ${items.length} · по убыванию важности.`
          : `Все доработки матрицы · ${items.length} · упорядочены от наиболее важных.`}
      </p>
      <ol className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <ReadinessImprovementLink item={item} />
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Интерактивная матрица 5×4: оценка, разворот разделов, переход по клику. */
export function PlatformCorePillarRoleScoreMatrix({ collectionId = 'SS27' }: Props) {
  const isMobile = useIsMobile();
  const { overview, overviewStatus } = usePlatformCoreChainOverview(collectionId);
  const emptyChain = isPlatformCoreEmptyChainCollection(collectionId);
  const [pgReachable, setPgReachable] = useState<boolean | null>(null);
  const [demoSeeded, setDemoSeeded] = useState<boolean | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [sheetCell, setSheetCell] = useState<ReadinessCell | null>(null);
  const [improvementsScope, setImprovementsScope] = useState<CoreHubPillarId | 'all' | null>(
    null
  );
  const [improvementsSheetOpen, setImprovementsSheetOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/workshop2/platform-core/health', {
          headers: buildWorkshop2ApiRequestHeaders(),
          cache: 'no-store',
        });
        const json = (await res.json()) as { pgReachable?: boolean; demoSeeded?: boolean };
        if (!cancelled) {
          setPgReachable(json.pgReachable === true);
          setDemoSeeded(json.demoSeeded === true);
        }
      } catch {
        if (!cancelled) {
          setPgReachable(false);
          setDemoSeeded(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const liveChain =
    !emptyChain && pgReachable === true && demoSeeded === true && overviewStatus === 'ready';

  const cells = useMemo(
    () => getPlatformCoreReadinessMatrix(collectionId, { liveChain }),
    [collectionId, liveChain]
  );

  const summaryStatic = useMemo(() => summarizePlatformCoreReadiness(cells, 'static'), [cells]);
  const summaryLive = useMemo(() => summarizePlatformCoreReadiness(cells, 'live'), [cells]);
  const allImprovements = useMemo(
    () => buildPlatformCoreReadinessImprovements(cells),
    [cells]
  );
  const improvementsByPillar = useMemo(() => {
    const map = {} as Record<CoreHubPillarId, ReadinessImprovementItem[]>;
    for (const pillar of PLATFORM_CORE_PILLARS) {
      map[pillar.id] = buildPlatformCoreReadinessImprovements(cells, { pillarId: pillar.id });
    }
    return map;
  }, [cells]);
  const overallActiveStatic = summaryStatic.activeCellsAvg;
  const overallActiveLive = summaryLive.activeCellsAvg;

  const readinessMode = liveChain ? 'pg-live' : pgReachable === false ? 'pg-unreachable' : 'static';

  const toggleExpand = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const openSections = (cell: ReadinessCell, key: string) => {
    if (isMobile) {
      setSheetCell(cell);
      return;
    }
    toggleExpand(key);
  };

  const openImprovements = (scope: CoreHubPillarId | 'all') => {
    if (isMobile) {
      setImprovementsScope(scope);
      setImprovementsSheetOpen(true);
      return;
    }
    setImprovementsScope((prev) => (prev === scope ? null : scope));
  };

  const displayedImprovements =
    improvementsScope === 'all'
      ? allImprovements
      : improvementsScope
        ? improvementsByPillar[improvementsScope] ?? []
        : [];

  const sheetPillarTitle = sheetCell
    ? (PLATFORM_CORE_PILLARS.find((p) => p.id === sheetCell.pillarId)?.title ?? sheetCell.pillarId)
    : '';

  const roleHeadClass = cn(
    READINESS_ROLE_COL_STICKY,
    READINESS_MATRIX_HEAD_H,
    'text-text-muted pl-1.5 pr-1 text-left text-[10px] font-semibold uppercase tracking-wide'
  );
  const roleHeadFixedClass = cn(
    READINESS_ROLE_COL,
    READINESS_MATRIX_HEAD_H,
    'text-text-muted border-border-subtle border-r bg-white pl-1.5 pr-1 text-left text-[10px] font-semibold uppercase tracking-wide'
  );
  const roleRowClass = cn(
    READINESS_ROLE_COL_STICKY,
    READINESS_MATRIX_BODY_H,
    'text-text-primary border-border-subtle/60 border-t pl-1.5 pr-1 text-left'
  );
  const roleRowFixedClass = cn(
    READINESS_ROLE_COL,
    READINESS_MATRIX_BODY_H,
    'text-text-primary border-border-subtle/60 border-r border-t bg-white pl-1.5 pr-1 text-left'
  );
  const roleFootClass = cn(
    READINESS_ROLE_COL_STICKY,
    READINESS_MATRIX_FOOT_H,
    'text-text-primary border-border-subtle border-t pl-1.5 pr-1 text-left'
  );
  const roleFootFixedClass = cn(
    READINESS_ROLE_COL,
    READINESS_MATRIX_FOOT_H,
    'text-text-primary border-border-subtle border-r border-t bg-white pl-1.5 pr-1 text-left'
  );

  const renderPillarCell = (
    row: (typeof PLATFORM_CORE_HUB_ROWS)[number],
    pillar: (typeof PLATFORM_CORE_PILLARS)[number]
  ) => {
    const cell = cells.find((c) => c.roleId === row.id && c.pillarId === pillar.id);
    if (!cell) {
      return (
        <td
          key={pillar.id}
          className={cn(
            READINESS_PILLAR_COL,
            READINESS_MATRIX_BODY_H,
            'border-border-subtle/60 border-t'
          )}
        />
      );
    }
    const key = cellKey(row.id, pillar.id);
    const isOpen = expanded.has(key);
    const hubCell = row.pillars[pillar.id];
    const participates = hubCell.kind === 'active';

    return (
      <td
        key={pillar.id}
        data-testid={`readiness-cell-${row.id}-${pillar.id}`}
        className={cn(
          READINESS_PILLAR_COL,
          isOpen ? 'min-h-[2.5rem] align-middle' : READINESS_MATRIX_BODY_H,
          'border-border-subtle/60 border-t'
        )}
      >
        <div className={READINESS_CELL_CORE}>
          {participates ? (
            <ReadinessScoreTrigger
              cell={cell}
              live={liveChain}
              isOpen={isOpen}
              onToggleSections={
                cell.subItems.length > 0 ? () => openSections(cell, key) : undefined
              }
            />
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  data-testid={`readiness-score-${row.id}-${pillar.id}`}
                  className={cn(
                    READINESS_SCORE_BOX,
                    'text-text-muted border-border-subtle bg-bg-surface2/50'
                  )}
                >
                  —
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-sm p-3">
                <ScoreTooltipBody cell={cell} live={liveChain} />
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {!isMobile && isOpen && participates ? (
          <ReadinessCellSectionsPanel
            cell={cell}
            live={liveChain}
            testIdPrefix={`readiness-sub-${row.id}-${pillar.id}`}
            variant="inline"
          />
        ) : null}
      </td>
    );
  };

  const pillarFooterCells = PLATFORM_CORE_PILLARS.map((pillar) => {
    const pillarCells = cells.filter((c) => c.pillarId === pillar.id && c.active);
    if (pillarCells.length === 0) {
      return (
        <td
          key={pillar.id}
          className={cn(
            READINESS_PILLAR_COL,
            READINESS_MATRIX_FOOT_H,
            'text-text-muted border-border-subtle border-t font-mono tabular-nums'
          )}
        >
          <span className="inline-flex w-full justify-center">—</span>
        </td>
      );
    }
    const avg = liveChain
      ? pillarCells.reduce((s, c) => s + (c.liveScore ?? 0), 0) / pillarCells.length
      : pillarCells.reduce((s, c) => s + (c.staticScore ?? 0), 0) / pillarCells.length;
    return (
      <td
        key={pillar.id}
        className={cn(
          READINESS_PILLAR_COL,
          READINESS_MATRIX_FOOT_H,
          'border-border-subtle border-t font-mono text-sm font-bold tabular-nums',
          readinessScoreTone(avg, liveChain)
        )}
      >
        <div className={READINESS_CELL_CORE}>
          <span className="font-mono text-[11px] font-bold tabular-nums md:text-xs">
            {formatReadinessScore(avg)}
          </span>
        </div>
      </td>
    );
  });

  const improvementsPanelRow =
    !isMobile && improvementsScope ? (
      <tr data-testid="readiness-improvements-row">
        <td colSpan={PLATFORM_CORE_PILLARS.length + 1} className="border-border-subtle border-t px-3 pb-4 pt-2">
          <ReadinessImprovementsPanel
            items={displayedImprovements}
            filterPillarId={improvementsScope === 'all' ? undefined : improvementsScope}
            variant="inline"
          />
        </td>
      </tr>
    ) : null;

  return (
    <TooltipProvider delayDuration={200}>
      <Sheet
        open={improvementsSheetOpen}
        onOpenChange={(open) => {
          setImprovementsSheetOpen(open);
          if (!open) setImprovementsScope(null);
        }}
      >
        <SheetContent
          side="bottom"
          className="max-h-[min(88vh,720px)] overflow-y-auto rounded-t-2xl px-4 pb-6 pt-2"
          accessibilityTitle="Доработки готовности Platform Core"
        >
          <SheetHeader className="space-y-1 pb-2 text-left">
            <SheetTitle className="text-base">
              {improvementsScope === 'all'
                ? 'Все доработки'
                : `Доработки · ${PLATFORM_CORE_PILLARS.find((p) => p.id === improvementsScope)?.title ?? ''}`}
            </SheetTitle>
            <SheetDescription className="text-xs">
              Связи внутри роли, между ролями и между столпами — по убыванию важности
            </SheetDescription>
          </SheetHeader>
          <ReadinessImprovementsPanel
            items={
              improvementsScope === 'all'
                ? allImprovements
                : improvementsScope
                  ? improvementsByPillar[improvementsScope] ?? []
                  : []
            }
            filterPillarId={improvementsScope === 'all' ? undefined : improvementsScope ?? undefined}
            variant="sheet"
          />
        </SheetContent>
      </Sheet>
      <Sheet open={sheetCell != null} onOpenChange={(open) => !open && setSheetCell(null)}>
        <SheetContent
          side="bottom"
          className="max-h-[min(88vh,720px)] overflow-y-auto rounded-t-2xl px-4 pb-6 pt-2"
          accessibilityTitle="Разделы оценки готовности"
        >
          {sheetCell ? (
            <>
              <SheetHeader className="space-y-1 pb-2 text-left">
                <SheetTitle className="text-base">
                  {ROLE_LABELS[sheetCell.roleId]} · {sheetPillarTitle}
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Разделы столпа и оценки готовности
                </SheetDescription>
              </SheetHeader>
              <ReadinessCellSectionsPanel
                cell={sheetCell}
                live={liveChain}
                testIdPrefix={`readiness-sub-${sheetCell.roleId}-${sheetCell.pillarId}`}
                variant="sheet"
              />
            </>
          ) : null}
        </SheetContent>
      </Sheet>
      <div data-testid="platform-core-readiness-matrix" className={platformCoreHubLayout.sectionStack}>
        <p className={hubSectionLabelClassName()}>Оценка готовности</p>
        <p
          data-testid="platform-core-readiness-mode"
          data-mode={readinessMode}
          className={cn(platformCoreHubLayout.readinessModeLead, 'text-text-secondary')}
        >
          {liveChain
            ? `Цепочка активна · средняя готовность ${formatReadinessScore(overallActiveLive)}/10.`
            : pgReachable === false
              ? `База недоступна · оценки ориентировочные · среднее ${formatReadinessScore(overallActiveStatic)}/10.`
              : `Загрузите данные коллекции · оценки ориентировочные · среднее ${formatReadinessScore(overallActiveStatic)}/10.`}
        </p>
        {overviewStatus === 'loading' && pgReachable === null ? (
          <PlatformCoreReadinessMatrixSkeleton />
        ) : (
        <div className="border-border-subtle max-h-[min(72vh,780px)] overflow-auto rounded-xl border bg-white shadow-sm">
          {isMobile ? (
            <div className="grid w-full grid-cols-[5.35rem_minmax(0,1fr)] overflow-hidden p-3">
              <table className="w-full border-separate border-spacing-0 bg-white text-[11px]">
                <thead>
                  <tr>
                    <th scope="col" className={roleHeadFixedClass}>
                      Роль
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PLATFORM_CORE_HUB_ROWS.map((row) => (
                    <tr key={row.id}>
                      <th scope="row" className={roleRowFixedClass}>
                        <div className={READINESS_ROW_LABEL}>
                          <MatrixColumnLabel text={row.label} align="start" />
                        </div>
                      </th>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className={roleFootFixedClass}>
                      <div className={READINESS_ROW_LABEL}>
                        <MatrixColumnLabel text="Средняя по столпу" align="start" />
                      </div>
                    </th>
                  </tr>
                </tbody>
              </table>
              <div className="min-w-0 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <table className="min-w-max border-separate border-spacing-0 text-[11px]">
                  <thead>
                    <tr>
                      {PLATFORM_CORE_PILLARS.map((pillar) => (
                        <th
                          key={pillar.id}
                          scope="col"
                          className={cn(READINESS_PILLAR_HEAD, 'text-text-muted font-semibold')}
                        >
                          <MatrixColumnLabel text={pillar.title} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PLATFORM_CORE_HUB_ROWS.map((row) => (
                      <tr key={row.id}>
                        {PLATFORM_CORE_PILLARS.map((pillar) => renderPillarCell(row, pillar))}
                      </tr>
                    ))}
                    <tr>{pillarFooterCells}</tr>
                    {improvementsPanelRow}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto overscroll-x-contain p-3 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:p-5 [&::-webkit-scrollbar]:hidden">
              <table className="w-full min-w-max border-separate border-spacing-0 text-[11px]">
                <thead className="sticky top-0 z-20 bg-white shadow-[0_1px_0_0_rgb(226_232_240)]">
                  <tr>
                    <th scope="col" className={roleHeadClass}>
                      Роль
                    </th>
                    {PLATFORM_CORE_PILLARS.map((pillar) => (
                      <th
                        key={pillar.id}
                        scope="col"
                        className={cn(READINESS_PILLAR_HEAD, 'text-text-muted font-semibold')}
                      >
                        <MatrixColumnLabel text={pillar.title} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLATFORM_CORE_HUB_ROWS.map((row) => (
                    <tr key={row.id}>
                      <th scope="row" className={roleRowClass}>
                        <div className={READINESS_ROW_LABEL}>
                          <MatrixColumnLabel text={row.label} align="start" />
                        </div>
                      </th>
                      {PLATFORM_CORE_PILLARS.map((pillar) => renderPillarCell(row, pillar))}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className={roleFootClass}>
                      <div className={READINESS_ROW_LABEL}>
                        <MatrixColumnLabel text="Средняя по столпу" align="start" />
                      </div>
                    </th>
                    {pillarFooterCells}
                  </tr>
                  {improvementsPanelRow}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}
      </div>
    </TooltipProvider>
  );
}
