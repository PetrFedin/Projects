'use client';

import { Fragment } from 'react';
import { CircleAlert, FileText, MessageSquare, Pencil, Pin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { READINESS_HELP } from '@/components/brand/production/workshop2-tab-content-constants';
import type {
  Workshop2CollectionListItem,
  Workshop2CollectionMetrics,
} from '@/components/brand/production/workshop2-tab-content-model';
import {
  collectionCoverMonogram,
  workshop2StatusBadgeClass,
  workshop2StatusLabel,
} from '@/components/brand/production/workshop2-tab-content-utils';
import type { CollectionDossierRollup } from '@/lib/production/workshop2-collection-dossier-analytics';
import type {
  UserCollectionRow,
  Workshop2Ss27MetaPatch,
  Workshop2UserCollectionUpdate,
} from '@/lib/production/local-collection-inventory';
import { cn } from '@/lib/utils';

export type Workshop2TabContentCollectionGridCardsProps = {
  tab: 'active' | 'archive';
  filteredCols: Workshop2CollectionListItem[];
  w2col: string;
  metricsByCollectionId: Record<string, Workshop2CollectionMetrics>;
  dossierRollupByCollectionId: Record<string, CollectionDossierRollup>;
  openCollDescId: string | null;
  setOpenCollDescId: (id: string | null) => void;
  collDescDraft: string;
  setCollDescDraft: (v: string) => void;
  openCollNoteId: string | null;
  setOpenCollNoteId: (id: string | null) => void;
  collNoteDraft: string;
  setCollNoteDraft: (v: string) => void;
  onUpdateSs27Meta: (patch: Workshop2Ss27MetaPatch) => boolean;
  appendWorkshop2Activity: (message: string, actor: string) => void;
  createdByLabel: string;
  getUserCollectionRow: (id: string) => UserCollectionRow | undefined;
  onUpdateUserCollection: (id: string, patch: Workshop2UserCollectionUpdate) => boolean;
  openUserCollectionEdit: (col: Workshop2CollectionListItem) => void;
  openSs27CollectionCardEdit: (col: Workshop2CollectionListItem) => void;
  onToggleCollectionPin: (collectionId: string, pinned: boolean) => void;
  selectCollection: (collectionId: string) => void;
  setArchiveConfirm: (v: { id: string; displayName: string; isSs27: boolean } | null) => void;
  restoreOne: (id: string) => void;
};

export function Workshop2TabContentCollectionGridCards({
  tab,
  filteredCols,
  w2col,
  metricsByCollectionId,
  dossierRollupByCollectionId,
  openCollDescId,
  setOpenCollDescId,
  collDescDraft,
  setCollDescDraft,
  openCollNoteId,
  setOpenCollNoteId,
  collNoteDraft,
  setCollNoteDraft,
  onUpdateSs27Meta,
  appendWorkshop2Activity,
  createdByLabel,
  getUserCollectionRow,
  onUpdateUserCollection,
  openUserCollectionEdit,
  openSs27CollectionCardEdit,
  onToggleCollectionPin,
  selectCollection,
  setArchiveConfirm,
  restoreOne,
}: Workshop2TabContentCollectionGridCardsProps) {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-4 min-[520px]:grid-cols-2 lg:grid-cols-4">
      {filteredCols.map((col) => {
        const metrics = metricsByCollectionId[col.id] ?? {
          status: 'draft' as const,
          progressPct: 0,
          articleCount: 0,
        };
        const listOpen = w2col === col.id;
        const fullCardTitle = `${col.displayName} · ${col.id}`;
        return (
          <div key={col.id} className="flex h-full min-h-0 w-full min-w-0 flex-col">
            <Card
              className={cn(
                'relative mx-auto flex h-full min-h-[19.5rem] w-full max-w-[21rem] flex-col overflow-hidden border-2 transition-all min-[520px]:mx-0 min-[520px]:max-w-full',
                'focus-within:ring-accent-primary/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
                listOpen
                  ? 'border-accent-primary/40 bg-accent-primary/10 ring-accent-primary/30 shadow-md ring-2 ring-offset-1'
                  : 'border-border-subtle'
              )}
            >
              {col.kind === 'user' || col.kind === 'ss27' || tab === 'active' ? (
                <div
                  className="absolute left-1 top-1 z-[4] flex max-w-[calc(100%-0.75rem)] flex-wrap items-center gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {col.kind === 'user' || col.kind === 'ss27' ? (
                    <Popover
                      modal={false}
                      open={openCollDescId === col.id}
                      onOpenChange={(o) => {
                        if (o) {
                          setOpenCollDescId(col.id);
                          if (col.kind === 'ss27') setCollDescDraft(col.description ?? '');
                        } else {
                          setOpenCollDescId(null);
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="border-border-default/80 h-6 w-6 shrink-0 rounded-md border bg-white/95 shadow-sm hover:bg-white"
                          aria-label="Описание коллекции"
                          title="Описание коллекции"
                        >
                          <FileText className="text-text-secondary h-3 w-3" aria-hidden />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[min(100vw-2rem,18rem)] p-3 text-[11px]"
                        align="start"
                        side="bottom"
                        sideOffset={6}
                        onCloseAutoFocus={(e) => e.preventDefault()}
                      >
                        <p className="text-text-primary mb-1.5 font-semibold">Описание</p>
                        {col.kind === 'user' ? (
                          <>
                            <p className="text-text-secondary whitespace-pre-wrap break-words text-[12px] leading-relaxed">
                              {col.description?.trim() ? col.description.trim() : 'Не заполнено.'}
                            </p>
                            <Button
                              type="button"
                              variant="link"
                              className="mt-2 h-auto p-0 text-[11px]"
                              onClick={() => {
                                setOpenCollDescId(null);
                                openUserCollectionEdit(col);
                              }}
                            >
                              Изменить в форме
                            </Button>
                          </>
                        ) : (
                          <>
                            <Label htmlFor={`w2-ss27-desc-${col.id}`} className="sr-only">
                              Текст описания
                            </Label>
                            <Textarea
                              id={`w2-ss27-desc-${col.id}`}
                              value={collDescDraft}
                              onChange={(e) => setCollDescDraft(e.target.value)}
                              rows={4}
                              placeholder="Кратко о подборке…"
                              className="mt-1 resize-none text-xs"
                              aria-label="Описание подборки SS27"
                            />
                            <div className="mt-2 flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 text-[11px]"
                                onClick={() => setOpenCollDescId(null)}
                              >
                                Отмена
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                className="h-8 text-[11px]"
                                onClick={() => {
                                  if (
                                    onUpdateSs27Meta({
                                      description: collDescDraft.trim(),
                                    })
                                  ) {
                                    appendWorkshop2Activity(
                                      `Описание подборки «${col.displayName}» (${col.id})`,
                                      createdByLabel
                                    );
                                    setOpenCollDescId(null);
                                  }
                                }}
                              >
                                Сохранить
                              </Button>
                            </div>
                          </>
                        )}
                      </PopoverContent>
                    </Popover>
                  ) : null}
                  {col.kind === 'user' || col.kind === 'ss27' ? (
                    <Popover
                      open={openCollNoteId === col.id}
                      onOpenChange={(o) => {
                        if (o) {
                          setCollNoteDraft(col.teamNote ?? '');
                          setOpenCollNoteId(col.id);
                        } else {
                          setOpenCollNoteId(null);
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="border-border-default/80 h-6 w-6 shrink-0 rounded-md border bg-white/95 shadow-sm hover:bg-white"
                          aria-label="Заметка для команды"
                          title="Заметка для команды"
                        >
                          <MessageSquare className="text-text-secondary h-3 w-3" aria-hidden />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[min(100vw-2rem,20rem)] p-3"
                        align="start"
                        side="bottom"
                        sideOffset={6}
                      >
                        <p className="text-text-primary mb-1.5 text-[11px] font-semibold">
                          Заметка для команды
                        </p>
                        <Textarea
                          value={collNoteDraft}
                          onChange={(e) => setCollNoteDraft(e.target.value)}
                          rows={4}
                          placeholder="Контекст, ссылки, кто отвечает…"
                          className="resize-none text-xs"
                          aria-label="Текст заметки"
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-[11px]"
                            onClick={() => setOpenCollNoteId(null)}
                          >
                            Отмена
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="h-8 text-[11px]"
                            onClick={() => {
                              if (col.kind === 'user') {
                                const row = getUserCollectionRow(col.id);
                                if (!row) return;
                                if (
                                  onUpdateUserCollection(col.id, {
                                    name: row.name,
                                    teamNote: collNoteDraft.trim(),
                                  })
                                ) {
                                  appendWorkshop2Activity(
                                    `Заметка коллекции «${col.displayName}» (${col.id})`,
                                    createdByLabel
                                  );
                                  setOpenCollNoteId(null);
                                }
                              } else if (col.kind === 'ss27') {
                                if (
                                  onUpdateSs27Meta({
                                    teamNote: collNoteDraft.trim(),
                                  })
                                ) {
                                  appendWorkshop2Activity(
                                    `Заметка подборки «${col.displayName}» (${col.id})`,
                                    createdByLabel
                                  );
                                  setOpenCollNoteId(null);
                                }
                              }
                            }}
                          >
                            Сохранить
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : null}
                  {col.kind === 'user' || col.kind === 'ss27' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="border-border-default/80 h-6 w-6 shrink-0 rounded-md border bg-white/95 shadow-sm hover:bg-white"
                          aria-label="Редактировать коллекцию"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (col.kind === 'user') {
                              openUserCollectionEdit(col);
                            } else {
                              openSs27CollectionCardEdit(col);
                            }
                          }}
                        >
                          <Pencil className="text-text-secondary h-3 w-3" aria-hidden />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-[220px] text-[11px]">
                        Редактировать название, обложку и поля коллекции
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                  {tab === 'active' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant={col.pinned ? 'secondary' : 'ghost'}
                          size="icon"
                          className={cn(
                            'h-6 w-6 shrink-0 rounded-md border bg-white/95 shadow-sm hover:bg-white',
                            col.pinned
                              ? 'border-accent-primary/30 bg-accent-primary/10'
                              : 'border-border-default/80'
                          )}
                          aria-pressed={col.pinned}
                          aria-label={
                            col.pinned ? 'Снять закрепление' : 'Закрепить первой в списке'
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleCollectionPin(col.id, !col.pinned);
                          }}
                        >
                          <Pin
                            className={cn(
                              'h-3 w-3 motion-safe:transition-opacity',
                              col.pinned
                                ? 'text-accent-primary fill-accent-primary/40 motion-safe:animate-pulse'
                                : 'text-text-muted'
                            )}
                            aria-hidden
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="max-w-[260px] text-[11px] leading-snug"
                      >
                        {col.pinned
                          ? 'Снять гвоздик: карточка остаётся здесь. Новая коллекция или другой гвоздик окажутся выше.'
                          : 'Закрепить: перенести на первое место. Кто нажат последним — тот сверху.'}
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
              ) : null}
              {col.coverDataUrl ? (
                <div className="border-border-subtle bg-bg-surface2 relative aspect-[16/10] w-full shrink-0 border-b">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={col.coverDataUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="border-border-subtle from-bg-surface2 via-accent-primary/10 to-border-subtle relative flex aspect-[16/10] w-full shrink-0 items-center justify-center border-b bg-gradient-to-br"
                  aria-hidden
                >
                  <span className="text-accent-primary/25 font-mono text-2xl font-black tracking-tight">
                    {collectionCoverMonogram(col.id)}
                  </span>
                </div>
              )}
              <Badge
                variant="outline"
                className={cn(
                  'absolute right-2 top-2 z-[1] max-w-[min(10rem,calc(100%-4rem))] truncate text-[9px] font-bold',
                  workshop2StatusBadgeClass(metrics.status)
                )}
              >
                {metrics.articleCount === 0
                  ? workshop2StatusLabel('draft')
                  : workshop2StatusLabel(metrics.status)}
              </Badge>
              <CardHeader
                className={cn(
                  'flex min-h-0 flex-1 flex-col gap-2 px-1.5 pb-2 pt-9 text-left sm:gap-2.5',
                  (col.kind === 'user' || col.kind === 'ss27') && 'pr-[1.375rem] sm:pr-6',
                  (col.kind === 'user' || col.kind === 'ss27') &&
                    tab === 'active' &&
                    'pl-[3.25rem]',
                  (col.kind === 'user' || col.kind === 'ss27') && tab === 'archive' && 'pl-9',
                  col.kind !== 'user' && col.kind !== 'ss27' && 'pr-6 sm:pr-8'
                )}
              >
                <div className="flex min-h-[5.5rem] min-w-0 flex-1 flex-col justify-center gap-1">
                  <div className="flex min-w-0 items-start gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle
                          className="text-text-primary line-clamp-2 min-w-0 cursor-default text-left text-sm font-bold leading-snug"
                          title={fullCardTitle}
                        >
                          {col.displayName}
                        </CardTitle>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="max-w-[280px] text-[11px] leading-snug"
                      >
                        <p className="font-semibold">{col.displayName}</p>
                        <p className="text-text-secondary mt-1 font-mono text-[10px]">{col.id}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-text-secondary flex w-full min-w-0 flex-col gap-0.5 text-[10px] leading-tight">
                        <span className="text-text-muted shrink-0">Код коллекции</span>
                        <span
                          className="text-text-secondary min-w-0 truncate font-mono"
                          title={col.id}
                        >
                          {col.id}
                        </span>
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[320px]">
                      <span className="break-all font-mono text-[11px]">{col.id}</span>
                    </TooltipContent>
                  </Tooltip>
                  <div className="w-full min-w-0 max-w-full space-y-0.5 pt-0.5">
                    {col.cardTimestamps ? (
                      <>
                        <p
                          className="text-text-primary break-words text-[10px] leading-snug"
                          title={`${col.cardTimestamps.createdCaption} ${col.cardTimestamps.createdValue}`}
                        >
                          <span className="text-text-muted">
                            {col.cardTimestamps.createdCaption}
                          </span>{' '}
                          <span className="font-medium tabular-nums">
                            {col.cardTimestamps.createdValue}
                          </span>
                        </p>
                        {col.cardTimestamps.updatedCaption && col.cardTimestamps.updatedValue ? (
                          <p
                            className="text-text-primary break-words text-[10px] leading-snug"
                            title={`${col.cardTimestamps.updatedCaption} ${col.cardTimestamps.updatedValue}`}
                          >
                            <span className="text-text-muted">
                              {col.cardTimestamps.updatedCaption}
                            </span>{' '}
                            <span className="font-medium tabular-nums">
                              {col.cardTimestamps.updatedValue}
                            </span>
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <span
                        className="block select-none text-[10px] leading-snug text-transparent"
                        aria-hidden
                      >
                        —
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-text-secondary flex w-full min-w-0 shrink-0 flex-col gap-2 text-[11px]">
                  {metrics.articleCount > 0 ? (
                    <p className="shrink-0 leading-snug">Артикулов: {metrics.articleCount}</p>
                  ) : null}
                  <div className="flex min-h-[2.875rem] flex-col justify-end">
                    {metrics.articleCount === 0 ? (
                      <p className="text-text-secondary text-[10px] leading-snug">Нет артикулов.</p>
                    ) : listOpen ? (
                      <span className="block min-h-[2rem]" aria-hidden />
                    ) : (
                      <Fragment>
                        <div className="text-text-secondary flex w-full min-w-0 flex-row flex-nowrap items-center gap-2 text-[10px]">
                          <span className="text-text-primary shrink-0 whitespace-nowrap font-semibold">
                            Общая готовность
                          </span>
                          <Progress
                            value={metrics.progressPct}
                            className="h-2.5 min-w-0 flex-1 basis-0"
                            aria-label={`Общая готовность подборки по всем артикулам и этапам: ${metrics.progressPct}%`}
                          />
                          <div className="flex shrink-0 items-center gap-0.5">
                            <span className="text-accent-primary whitespace-nowrap text-base font-black tabular-nums">
                              {metrics.progressPct}%
                            </span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="text-text-muted hover:text-accent-primary focus-visible:ring-accent-primary rounded-full p-0.5 focus:outline-none focus-visible:ring-2"
                                  aria-label="Как считается готовность"
                                >
                                  <CircleAlert className="h-3.5 w-3.5" aria-hidden />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="left"
                                className="max-w-[260px] text-[11px] leading-snug"
                              >
                                {READINESS_HELP}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                        {(() => {
                          const rollup = dossierRollupByCollectionId[col.id];
                          if (!rollup || rollup.withDossierCount === 0) return null;
                          return (
                            <p className="text-text-secondary mt-1 text-[9px] leading-snug">
                              <span className="text-text-secondary font-semibold">ТЗ (local):</span>{' '}
                              ~{rollup.avgTzPct}% · образец {rollup.readyForSampleCount}/
                              {rollup.withDossierCount}
                              {rollup.bomPinCount > 0 ? (
                                <span className="text-teal-700">
                                  {' '}
                                  · BOM ref: {rollup.bomPinCount}
                                </span>
                              ) : null}
                              {rollup.overdueSlaCount > 0 ? (
                                <span className="font-semibold text-rose-600">
                                  {' '}
                                  · SLA просрочено: {rollup.overdueSlaCount}
                                </span>
                              ) : null}
                              {rollup.weakApprovalsCount > 0 ? (
                                <span className="text-amber-800">
                                  {' '}
                                  · без подписей: {rollup.weakApprovalsCount} арт.
                                </span>
                              ) : null}
                            </p>
                          );
                        })()}
                      </Fragment>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-auto flex min-h-[4.75rem] shrink-0 flex-col items-center justify-end gap-1.5 px-1.5 pb-2.5 pt-0 sm:pb-3">
                <Button
                  type="button"
                  variant={listOpen ? 'secondary' : 'default'}
                  size="sm"
                  className="h-7 min-w-[9rem] max-w-[85%] px-4 text-[9px] font-black uppercase tracking-wide"
                  onClick={() => selectCollection(col.id)}
                >
                  {listOpen ? 'Свернуть список' : 'Выбрать коллекцию'}
                </Button>
                <div className="flex min-h-[1.375rem] w-full flex-col items-center justify-center">
                  {tab === 'active' ? (
                    <Button
                      type="button"
                      variant="link"
                      className="text-text-muted hover:text-text-secondary h-auto px-2 py-0 text-[9px] font-normal no-underline"
                      onClick={() =>
                        setArchiveConfirm({
                          id: col.id,
                          displayName: col.displayName,
                          isSs27: col.kind === 'ss27',
                        })
                      }
                    >
                      Убрать в архив
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-accent-primary hover:text-accent-primary h-6 px-2 text-[9px]"
                      onClick={() => restoreOne(col.id)}
                    >
                      Восстановить
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
