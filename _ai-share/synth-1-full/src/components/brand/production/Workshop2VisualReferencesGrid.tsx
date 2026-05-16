'use client';

import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Workshop2Phase1VisualReference } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  effectiveVisualRefMime,
  VISUAL_REF_TAKEAWAY_LABELS,
  visualRefIsMediaPreview,
} from '@/lib/production/workshop2-visual-references-utils';

type RefViewMode = 'compact' | 'board';

export function Workshop2VisualReferencesGrid({
  items,
  refViewMode,
  maxReferences,
  canonicalMainPhotoRefId,
  onSetCanonicalMainPhoto,
  onOpenLightbox,
  onOpenRefEditorEdit,
  onSwapRefOrder,
  onRemoveOne,
  onOpenRefEditorNew,
}: {
  items: Workshop2Phase1VisualReference[];
  refViewMode: RefViewMode;
  maxReferences: number;
  canonicalMainPhotoRefId?: string;
  onSetCanonicalMainPhoto?: (refId: string | null) => void;
  onOpenLightbox: (id: string, opts?: { zoom?: number; armLoupe?: boolean }) => void;
  onOpenRefEditorEdit: (r: Workshop2Phase1VisualReference) => void;
  onSwapRefOrder: (from: number, to: number) => void;
  onRemoveOne: (id: string) => void;
  onOpenRefEditorNew: () => void;
}) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        'grid w-full min-w-0',
        refViewMode === 'board' ? 'grid-cols-2 gap-3 sm:gap-4' : 'grid-cols-5 gap-1 sm:gap-1.5'
      )}
    >
      {items.map((r, index) => {
        const hasComments = (r.comments?.length ?? 0) > 0;
        const tileAspect = refViewMode === 'board' ? 'aspect-[4/3]' : 'aspect-square';
        if (visualRefIsMediaPreview(r)) {
          const isVideo = effectiveVisualRefMime(r).startsWith('video/');
          const isMainPhoto = Boolean(canonicalMainPhotoRefId && canonicalMainPhotoRefId === r.refId);
          return (
            <div key={r.refId} className="min-w-0">
              <div className="relative min-w-0">
                <button
                  type="button"
                  className={cn(
                    'border-border-default ring-accent-primary/60 group relative w-full overflow-hidden rounded-md border bg-white shadow-sm outline-none transition hover:ring-2 focus-visible:ring-2',
                    tileAspect,
                    isMainPhoto && 'ring-2 ring-amber-400/80'
                  )}
                  onClick={() => onOpenLightbox(r.refId)}
                  aria-label={`Открыть референс: ${r.title || 'без названия'}`}
                >
                  {isVideo ? (
                    <video
                      src={r.previewDataUrl!}
                      className="h-full w-full object-cover transition group-hover:opacity-95"
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element -- data URL из локального досье */
                    <img
                      src={r.previewDataUrl!}
                      alt=""
                      className="h-full w-full object-cover transition group-hover:opacity-95"
                    />
                  )}
                  {isVideo ? (
                    <span
                      className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-md"
                      aria-hidden
                    >
                      <LucideIcons.Play className="h-4 w-4 translate-x-px" fill="currentColor" />
                    </span>
                  ) : null}
                  {hasComments ? (
                    <span
                      className="text-accent-primary ring-accent-primary/30 absolute bottom-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1"
                      title="Есть комментарии"
                      aria-hidden
                    >
                      <LucideIcons.MessageCircle className="h-3 w-3" />
                    </span>
                  ) : null}
                </button>
                {onSetCanonicalMainPhoto && !isVideo ? (
                  <button
                    type="button"
                    className="absolute left-6 top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded bg-white/95 text-amber-600 shadow-sm ring-1 ring-amber-200/90 transition hover:bg-amber-50"
                    title={isMainPhoto ? 'Снять «главное фото»' : 'Сделать главным фото модели'}
                    aria-label={isMainPhoto ? 'Снять главное фото' : 'Главное фото модели'}
                    aria-pressed={isMainPhoto}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSetCanonicalMainPhoto(isMainPhoto ? null : r.refId);
                    }}
                  >
                    <LucideIcons.Star
                      className={cn('h-3.5 w-3.5', isMainPhoto && 'fill-amber-400 text-amber-600')}
                      aria-hidden
                    />
                  </button>
                ) : null}
                {!isVideo ? (
                  <button
                    type="button"
                    className="text-accent-primary ring-accent-primary/30 hover:bg-accent-primary/10 absolute right-0.5 top-0.5 z-10 flex h-6 w-6 items-center justify-center rounded bg-white/95 shadow-sm ring-1 transition"
                    title="Открыть окно: затем клик по фото для лупы"
                    aria-label="Открыть просмотр с режимом лупы"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onOpenLightbox(r.refId, { armLoupe: true });
                    }}
                  >
                    <LucideIcons.ZoomIn className="h-3.5 w-3.5" aria-hidden />
                  </button>
                ) : null}
                <div className="absolute bottom-0.5 right-0.5 z-10 flex gap-0.5">
                  <button
                    type="button"
                    className="text-text-secondary ring-border-default/80 hover:bg-bg-surface2 flex h-6 w-6 items-center justify-center rounded bg-white/95 shadow-sm ring-1 transition disabled:opacity-30"
                    title="Сдвинуть раньше"
                    aria-label="Сдвинуть раньше в списке"
                    disabled={index <= 0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSwapRefOrder(index, index - 1);
                    }}
                  >
                    <LucideIcons.ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="text-text-secondary ring-border-default/80 hover:bg-bg-surface2 flex h-6 w-6 items-center justify-center rounded bg-white/95 shadow-sm ring-1 transition disabled:opacity-30"
                    title="Сдвинуть позже"
                    aria-label="Сдвинуть позже в списке"
                    disabled={index >= items.length - 1}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSwapRefOrder(index, index + 1);
                    }}
                  >
                    <LucideIcons.ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
                <button
                  type="button"
                  className="absolute left-0.5 top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded bg-white/95 text-red-500 shadow-sm ring-1 ring-red-200/80 transition hover:bg-red-50 hover:text-red-700"
                  title="Удалить референс"
                  aria-label="Удалить референс"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemoveOne(r.refId);
                  }}
                >
                  <LucideIcons.X className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                </button>
              </div>
              {(() => {
                const asp = (r.takeawayAspects ?? []).map((a) => VISUAL_REF_TAKEAWAY_LABELS[a]).join(' · ');
                const note = r.takeawayNote?.trim() ?? '';
                if (!asp && !note) return null;
                return (
                  <p className="text-text-secondary mt-1 line-clamp-2 text-[9px] leading-snug" title={note || asp}>
                    {[asp, note].filter(Boolean).join(' — ')}
                  </p>
                );
              })()}
            </div>
          );
        }
        return (
          <div key={r.refId} className="relative min-w-0">
            <button
              type="button"
              className={cn(
                'border-border-default bg-bg-surface2/90 ring-accent-primary/40 hover:bg-bg-surface2 flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-md border border-dashed p-1 text-center outline-none transition hover:ring-2 focus-visible:ring-2',
                tileAspect
              )}
              onClick={() => onOpenRefEditorEdit(r)}
              aria-label={`Редактировать референс: ${r.title || 'черновик'}`}
            >
              <LucideIcons.ImageOff className="text-text-muted h-6 w-6 shrink-0" aria-hidden />
              <span className="text-text-secondary line-clamp-3 w-full text-[9px] font-medium leading-tight">
                {r.title?.trim() || r.externalUrl?.trim() || 'Добавьте файл или ссылку'}
              </span>
            </button>
            <div className="absolute bottom-0.5 right-0.5 z-10 flex gap-0.5">
              <button
                type="button"
                className="text-text-secondary ring-border-default/80 hover:bg-bg-surface2 flex h-6 w-6 items-center justify-center rounded bg-white/95 shadow-sm ring-1 transition disabled:opacity-30"
                title="Сдвинуть раньше"
                disabled={index <= 0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSwapRefOrder(index, index - 1);
                }}
              >
                <LucideIcons.ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              </button>
              <button
                type="button"
                className="text-text-secondary ring-border-default/80 hover:bg-bg-surface2 flex h-6 w-6 items-center justify-center rounded bg-white/95 shadow-sm ring-1 transition disabled:opacity-30"
                title="Сдвинуть позже"
                disabled={index >= items.length - 1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSwapRefOrder(index, index + 1);
                }}
              >
                <LucideIcons.ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
            <button
              type="button"
              className="absolute left-0.5 top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded bg-white/95 text-red-500 shadow-sm ring-1 ring-red-200/80 transition hover:bg-red-50 hover:text-red-700"
              title="Удалить"
              aria-label="Удалить референс"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemoveOne(r.refId);
              }}
            >
              <LucideIcons.X className="h-3 w-3" strokeWidth={2.5} aria-hidden />
            </button>
          </div>
        );
      })}
      {items.length < maxReferences ? (
        <button
          type="button"
          className={cn(
            'border-border-default bg-bg-surface2 text-text-secondary hover:bg-bg-surface2 flex min-h-0 w-full items-center justify-center rounded-md border border-dashed text-lg font-bold leading-none transition',
            refViewMode === 'board' ? 'aspect-[4/3] max-h-[200px]' : 'aspect-square max-h-[120px]'
          )}
          onClick={onOpenRefEditorNew}
          title="Добавить референс"
          aria-label="Добавить референс"
        >
          +
        </button>
      ) : null}
    </div>
  );
}
