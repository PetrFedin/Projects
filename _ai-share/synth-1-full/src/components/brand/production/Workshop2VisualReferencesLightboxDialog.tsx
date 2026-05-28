'use client';

import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type {
  Workshop2Phase1VisualReference,
  Workshop2VisualRefComment,
  Workshop2VisualRefCommentReactionType,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  effectiveVisualRefMime,
  visualRefImageClickToFocusPx,
  visualRefIsMediaPreview,
  visualRefSameUser,
} from '@/lib/production/workshop2-visual-references-utils';

export function Workshop2VisualReferencesLightboxDialog({
  isOpen,
  lightboxRef,
  lightboxMediaIndex,
  mediaRefsLength,
  lightboxWheelAreaRef,
  lightboxLoupeArmed,
  lightboxZoom,
  lightboxZoomFocusPx,
  sortedComments,
  threadAuthorLabel,
  currentUserLabel,
  draftComment,
  onClose,
  onGoPrevMedia,
  onGoNextMedia,
  onZoomOut,
  onZoomIn,
  onToggleLoupe,
  onResetLightboxView,
  onSetLightboxZoomFocusPx,
  onRemoveOne,
  onUpdate,
  onFile,
  onToggleReaction,
  onToggleCommentResolved,
  onDraftCommentChange,
  onAddComment,
}: {
  isOpen: boolean;
  lightboxRef?: Workshop2Phase1VisualReference;
  lightboxMediaIndex: number;
  mediaRefsLength: number;
  lightboxWheelAreaRef: React.RefObject<HTMLDivElement | null>;
  lightboxLoupeArmed: boolean;
  lightboxZoom: number;
  lightboxZoomFocusPx: { x: number; y: number } | null;
  sortedComments: Workshop2VisualRefComment[];
  threadAuthorLabel: string;
  currentUserLabel: string;
  draftComment: string;
  onClose: () => void;
  onGoPrevMedia: () => void;
  onGoNextMedia: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onToggleLoupe: () => void;
  onResetLightboxView: () => void;
  onSetLightboxZoomFocusPx: (point: { x: number; y: number }) => void;
  onRemoveOne: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Workshop2Phase1VisualReference>) => void;
  onFile: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleReaction: (
    refId: string,
    commentId: string,
    type: Workshop2VisualRefCommentReactionType
  ) => void;
  onToggleCommentResolved: (refId: string, commentId: string) => void;
  onDraftCommentChange: (value: string) => void;
  onAddComment: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogContent
        className="flex max-h-[min(92vh,880px)] w-[min(96vw,720px)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:rounded-xl"
        aria-describedby={undefined}
      >
        {lightboxRef && lightboxRef.previewDataUrl && visualRefIsMediaPreview(lightboxRef) ? (
          <>
            <div
              ref={lightboxWheelAreaRef as React.Ref<HTMLDivElement>}
              className="relative flex min-h-0 flex-1 flex-col bg-black/90"
            >
              <button
                type="button"
                className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-black/70 disabled:opacity-25"
                onClick={onGoPrevMedia}
                disabled={lightboxMediaIndex <= 0}
                aria-label="Предыдущий файл"
              >
                <LucideIcons.ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-black/70 disabled:opacity-25"
                onClick={onGoNextMedia}
                disabled={lightboxMediaIndex < 0 || lightboxMediaIndex >= mediaRefsLength - 1}
                aria-label="Следующий файл"
              >
                <LucideIcons.ChevronRight className="h-6 w-6" />
              </button>
              {effectiveVisualRefMime(lightboxRef).startsWith('video/') ? (
                <div className="flex flex-1 items-center justify-center px-10 py-4">
                  <video
                    src={lightboxRef.previewDataUrl}
                    controls
                    playsInline
                    className="max-h-[min(52vh,480px)] max-w-full object-contain"
                  />
                </div>
              ) : (
                <>
                  <div className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-0.5 rounded-full border border-white/20 bg-black/70 px-1.5 py-1 shadow-lg sm:gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-white hover:bg-white/10 hover:text-white"
                      title="Уменьшить (то же, что колесо вниз)"
                      aria-label="Уменьшить масштаб"
                      onClick={onZoomOut}
                    >
                      <LucideIcons.Minus className="h-4 w-4" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-white hover:bg-white/10 hover:text-white"
                      title="Увеличить (то же, что колесо вверх)"
                      aria-label="Увеличить масштаб"
                      onClick={onZoomIn}
                    >
                      <LucideIcons.Plus className="h-4 w-4" aria-hidden />
                    </Button>
                    <span className="mx-0.5 hidden h-5 w-px bg-white/25 sm:inline" aria-hidden />
                    <Button
                      type="button"
                      variant={lightboxLoupeArmed ? 'secondary' : 'ghost'}
                      size="icon"
                      className={cn(
                        'h-8 w-8 shrink-0 text-white hover:bg-white/10 hover:text-white',
                        lightboxLoupeArmed &&
                          'bg-amber-500/90 text-amber-950 hover:bg-amber-400 hover:text-amber-950'
                      )}
                      title="Лупа: клики по фото — точка увеличения. Повторное нажатие — снять режим и вернуть масштаб 100%"
                      aria-label="Режим лупы"
                      aria-pressed={lightboxLoupeArmed}
                      onClick={onToggleLoupe}
                    >
                      <LucideIcons.ZoomIn className="h-4 w-4" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-white hover:bg-white/10 hover:text-white"
                      title="Сброс масштаба и лупы"
                      aria-label="Сбросить масштаб"
                      onClick={onResetLightboxView}
                    >
                      <LucideIcons.Maximize2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                  {lightboxLoupeArmed ? (
                    <p className="absolute left-1/2 top-[3.25rem] z-20 max-w-[min(92vw,28rem)] -translate-x-1/2 rounded-md bg-amber-500/95 px-3 py-1.5 text-center text-[11px] font-medium leading-snug text-amber-950 shadow-md">
                      Клик по фото — откуда увеличивать. Крупнее / мельче — только кнопки − / + или
                      колесо. Повторно иконка лупы — выключить режим и сбросить масштаб.
                    </p>
                  ) : (
                    <p className="absolute left-1/2 top-[3.25rem] z-20 max-w-[min(92vw,26rem)] -translate-x-1/2 rounded-md bg-black/55 px-2.5 py-1.5 text-center text-[10px] leading-snug text-white/90">
                      <span className="font-semibold text-white">Масштаб:</span> − / + или колесо по
                      тёмной области. Лупа — точка увеличения по клику; снова лупа — сброс вида.
                    </p>
                  )}
                  <div
                    className={cn(
                      'flex max-h-[min(58vh,560px)] min-h-[12rem] w-full flex-1 justify-center overflow-auto px-6 pb-4',
                      lightboxLoupeArmed ? 'pt-24' : 'pt-16',
                      lightboxLoupeArmed && 'cursor-crosshair'
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- data URL из локального досье */}
                    <img
                      src={lightboxRef.previewDataUrl}
                      alt=""
                      role="presentation"
                      className={cn(
                        'max-h-[min(52vh,500px)] max-w-full select-none object-contain transition-transform duration-200 ease-out',
                        lightboxLoupeArmed &&
                          'cursor-crosshair ring-2 ring-amber-400/80 ring-offset-2 ring-offset-black/90'
                      )}
                      style={{
                        transform: `scale(${lightboxZoom})`,
                        transformOrigin: lightboxZoomFocusPx
                          ? `${lightboxZoomFocusPx.x}px ${lightboxZoomFocusPx.y}px`
                          : 'center center',
                      }}
                      onClick={(e) => {
                        if (!lightboxLoupeArmed) return;
                        e.preventDefault();
                        const pt = visualRefImageClickToFocusPx(
                          e.currentTarget,
                          e.clientX,
                          e.clientY
                        );
                        onSetLightboxZoomFocusPx(pt);
                      }}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="border-border-default max-h-[40vh] space-y-3 overflow-y-auto border-t bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-text-secondary text-xs font-semibold">
                  {lightboxMediaIndex + 1} / {mediaRefsLength}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-red-600"
                  onClick={() => onRemoveOne(lightboxRef.refId)}
                >
                  Удалить референс
                </Button>
              </div>
              <Input
                className="h-9 text-sm"
                placeholder="Название"
                value={lightboxRef.title}
                onChange={(e) => onUpdate(lightboxRef.refId, { title: e.target.value })}
              />
              <Textarea
                className="min-h-[56px] text-sm"
                placeholder="Что смотреть на референсе…"
                value={lightboxRef.description ?? ''}
                onChange={(e) => onUpdate(lightboxRef.refId, { description: e.target.value })}
              />
              <Input
                className="h-9 text-sm"
                type="url"
                placeholder="Ссылка https://…"
                value={lightboxRef.externalUrl ?? ''}
                onChange={(e) => onUpdate(lightboxRef.refId, { externalUrl: e.target.value })}
              />
              <div className="space-y-1">
                <Label className="text-text-secondary text-[10px]">Заменить файл</Label>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  className="h-9 cursor-pointer text-xs"
                  onChange={(e) => onFile(lightboxRef.refId, e)}
                />
              </div>

              <div className="border-border-subtle space-y-2 border-t pt-3">
                <p className="text-text-muted text-[10px] font-black uppercase tracking-wider">
                  Обсуждение
                </p>
                <div className="border-border-subtle bg-bg-surface2/80 flex max-h-52 flex-col gap-2 overflow-y-auto rounded-lg border p-2">
                  {sortedComments.length === 0 ? (
                    <p className="text-text-secondary text-center text-[11px]">
                      Пока нет сообщений.
                    </p>
                  ) : (
                    sortedComments.map((c) => {
                      const isAuthorSide = visualRefSameUser(c.by, threadAuthorLabel);
                      const likes = (c.reactions ?? []).filter((x) => x.type === 'like').length;
                      const dislikes = (c.reactions ?? []).filter(
                        (x) => x.type === 'dislike'
                      ).length;
                      const mine = (c.reactions ?? []).find((x) =>
                        visualRefSameUser(x.by, currentUserLabel)
                      );
                      return (
                        <div
                          key={c.commentId}
                          className={cn(
                            'flex w-full flex-col gap-1',
                            isAuthorSide ? 'items-start' : 'items-end'
                          )}
                        >
                          <div
                            className={cn(
                              'max-w-[88%] rounded-2xl px-3 py-2 text-[13px] leading-snug shadow-sm',
                              isAuthorSide
                                ? 'text-text-primary ring-border-default rounded-tl-sm bg-white ring-1'
                                : 'bg-accent-primary rounded-tr-sm text-white'
                            )}
                          >
                            <p>{c.text}</p>
                            <p
                              className={cn(
                                'mt-1 text-[10px]',
                                isAuthorSide ? 'text-text-secondary' : 'text-accent-primary/30'
                              )}
                            >
                              {c.by} ·{' '}
                              {new Date(c.at).toLocaleString('ru-RU', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })}
                            </p>
                          </div>
                          <div
                            className={cn(
                              'flex flex-wrap items-center gap-1 px-1',
                              isAuthorSide ? 'justify-start' : 'justify-end'
                            )}
                          >
                            <button
                              type="button"
                              className={cn(
                                'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                                mine?.type === 'like'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
                              )}
                              onClick={() =>
                                onToggleReaction(lightboxRef.refId, c.commentId, 'like')
                              }
                            >
                              <LucideIcons.ThumbsUp className="h-3 w-3" />
                              {likes || ''}
                            </button>
                            <button
                              type="button"
                              className={cn(
                                'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                                mine?.type === 'dislike'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
                              )}
                              onClick={() =>
                                onToggleReaction(lightboxRef.refId, c.commentId, 'dislike')
                              }
                            >
                              <LucideIcons.ThumbsDown className="h-3 w-3" />
                              {dislikes || ''}
                            </button>
                            <button
                              type="button"
                              className={cn(
                                'inline-flex min-h-8 min-w-[4.5rem] items-center justify-center rounded-md px-2 py-1 text-[10px] font-semibold',
                                c.resolved
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
                              )}
                              aria-pressed={c.resolved === true}
                              onClick={() =>
                                onToggleCommentResolved(lightboxRef.refId, c.commentId)
                              }
                            >
                              {c.resolved ? 'Решено' : 'Открыто'}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    className="min-h-[44px] flex-1 text-sm"
                    placeholder="Сообщение…"
                    value={draftComment}
                    onChange={(e) => onDraftCommentChange(e.target.value)}
                  />
                  <Button
                    type="button"
                    className="h-9 shrink-0 self-end text-xs"
                    onClick={onAddComment}
                  >
                    Отправить
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
