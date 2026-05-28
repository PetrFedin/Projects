'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { newUuid } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-mutations';
import {
  effectiveVisualRefMime,
  inferMimeTypeForVisualRef,
  MAX_VISUAL_REFERENCES,
  readVisualRefFileAsDataUrl,
  VISUAL_REF_TAKEAWAY_LABELS,
  visualRefImageClickToFocusPx,
  visualRefIsMediaPreview,
  visualRefSameUser,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-visual-ref-helpers';
import { cn } from '@/lib/utils';
import type {
  Workshop2Phase1VisualReference,
  Workshop2VisualRefComment,
  Workshop2VisualRefCommentReactionType,
  Workshop2VisualRefTakeawayAspect,
} from '@/lib/production/workshop2-dossier-phase1.types';

export function VisualReferencesBlock({
  items,
  onChange,
  currentUserLabel,
  threadAuthorLabel,
  canonicalMainPhotoRefId,
  onSetCanonicalMainPhoto,
}: {
  items: Workshop2Phase1VisualReference[];
  onChange: (next: Workshop2Phase1VisualReference[]) => void;
  currentUserLabel: string;
  /** Сообщения этого участника — слева; остальные — справа (как в мессенджере). */
  threadAuthorLabel: string;
  canonicalMainPhotoRefId?: string;
  onSetCanonicalMainPhoto?: (refId: string | null) => void;
}) {
  const { toast } = useToast();
  const [lightboxRefId, setLightboxRefId] = useState<string | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  /** Точка масштаба в координатах элемента img (px); null = центр. */
  const [lightboxZoomFocusPx, setLightboxZoomFocusPx] = useState<{ x: number; y: number } | null>(
    null
  );
  /** После включения лупы следующий клик по фото задаёт фокус увеличения. */
  const [lightboxLoupeArmed, setLightboxLoupeArmed] = useState(false);
  const [draftComment, setDraftComment] = useState('');
  const [refViewMode, setRefViewMode] = useState<'compact' | 'board'>('compact');
  const [refEditorOpen, setRefEditorOpen] = useState(false);
  const [refEditorId, setRefEditorId] = useState<string | null>(null);
  const [refEditorTitle, setRefEditorTitle] = useState('');
  const [refEditorDesc, setRefEditorDesc] = useState('');
  const [refEditorUrl, setRefEditorUrl] = useState('');
  const [refEditorTakeawayAspects, setRefEditorTakeawayAspects] = useState<
    Workshop2VisualRefTakeawayAspect[]
  >([]);
  const [refEditorTakeawayNote, setRefEditorTakeawayNote] = useState('');
  const refEditorFileInputRef = useRef<HTMLInputElement>(null);
  /** Вся тёмная зона просмотра — колесо зума (ref после открытия диалога). */
  const lightboxWheelAreaRef = useRef<HTMLDivElement>(null);

  const [aiMoodboardOpen, setAiMoodboardOpen] = useState(false);
  const [aiMoodboardLoading, setAiMoodboardLoading] = useState(false);
  const [aiMoodboardPrompt, setAiMoodboardPrompt] = useState('');

  const mediaRefs = useMemo(() => items.filter(visualRefIsMediaPreview), [items]);
  const openRefDiscussionCount = useMemo(() => {
    let n = 0;
    for (const r of items) {
      const cs = r.comments ?? [];
      if (cs.length > 0 && cs.some((c) => !c.resolved)) n++;
    }
    return n;
  }, [items]);

  const lightboxRef = lightboxRefId ? items.find((r) => r.refId === lightboxRefId) : undefined;
  const lightboxMediaIndex = lightboxRefId
    ? mediaRefs.findIndex((r) => r.refId === lightboxRefId)
    : -1;

  const openLightbox = useCallback((id: string, opts?: { zoom?: number; armLoupe?: boolean }) => {
    setLightboxRefId(id);
    setLightboxZoom(typeof opts?.zoom === 'number' ? opts.zoom : 1);
    setLightboxZoomFocusPx(null);
    setLightboxLoupeArmed(Boolean(opts?.armLoupe));
  }, []);

  const resetLightboxView = useCallback(() => {
    setLightboxZoom(1);
    setLightboxZoomFocusPx(null);
    setLightboxLoupeArmed(false);
  }, []);

  useEffect(() => {
    if (lightboxZoom <= 1) setLightboxZoomFocusPx(null);
  }, [lightboxZoom]);

  const lightboxIsImage = useMemo(() => {
    if (!lightboxRef) return false;
    if (!visualRefIsMediaPreview(lightboxRef)) return false;
    return !effectiveVisualRefMime(lightboxRef).startsWith('video/');
  }, [lightboxRef]);

  useEffect(() => {
    if (!lightboxIsImage || !lightboxRefId) return;
    let cancelled = false;
    let removeWheel: (() => void) | undefined;
    let innerRaf = 0;
    const outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(() => {
        if (cancelled) return;
        const el = lightboxWheelAreaRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
          e.preventDefault();
          e.stopPropagation();
          const zoomIn = e.deltaY < 0;
          const step = 0.1 * (e.ctrlKey || e.metaKey ? 1.35 : 1);
          setLightboxZoom((prev) => {
            const next = zoomIn ? prev + step : prev - step;
            return Math.min(5, Math.max(1, Math.round(next * 100) / 100));
          });
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        removeWheel = () => el.removeEventListener('wheel', onWheel);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(outerRaf);
      if (innerRaf) cancelAnimationFrame(innerRaf);
      removeWheel?.();
    };
  }, [lightboxIsImage, lightboxRefId]);

  const update = (id: string, patch: Partial<Workshop2Phase1VisualReference>) => {
    onChange(items.map((x) => (x.refId === id ? { ...x, ...patch } : x)));
  };
  const removeOne = (id: string) => {
    onChange(items.filter((x) => x.refId !== id));
    if (lightboxRefId === id) setLightboxRefId(null);
  };

  const swapRefOrder = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= items.length || from === to) return;
      const next = [...items];
      const [row] = next.splice(from, 1);
      next.splice(to, 0, row);
      onChange(next);
    },
    [items, onChange]
  );

  const openRefEditorNew = () => {
    if (items.length >= MAX_VISUAL_REFERENCES) {
      toast({
        title: 'Лимит референсов',
        description: `Не больше ${MAX_VISUAL_REFERENCES} файлов на модель. Удалите лишнее или замените в карточке.`,
        variant: 'destructive',
      });
      return;
    }
    setRefEditorId(null);
    setRefEditorTitle('');
    setRefEditorDesc('');
    setRefEditorUrl('');
    setRefEditorTakeawayAspects([]);
    setRefEditorTakeawayNote('');
    if (refEditorFileInputRef.current) refEditorFileInputRef.current.value = '';
    setRefEditorOpen(true);
  };

  const openRefEditorEdit = (r: Workshop2Phase1VisualReference) => {
    setRefEditorId(r.refId);
    setRefEditorTitle(r.title ?? '');
    setRefEditorDesc(r.description ?? '');
    setRefEditorUrl(r.externalUrl ?? '');
    setRefEditorTakeawayAspects([...(r.takeawayAspects ?? [])]);
    setRefEditorTakeawayNote(r.takeawayNote ?? '');
    if (refEditorFileInputRef.current) refEditorFileInputRef.current.value = '';
    setRefEditorOpen(true);
  };

  const saveRefEditor = useCallback(async () => {
    const file = refEditorFileInputRef.current?.files?.[0];
    const id = refEditorId ?? newUuid();
    const existing = refEditorId ? items.find((x) => x.refId === refEditorId) : undefined;

    let previewDataUrl = existing?.previewDataUrl;
    let mimeType = existing?.mimeType;
    let fileName = existing?.fileName;

    if (file) {
      const ft = file.type?.trim() ?? '';
      const looksImage =
        ft.startsWith('image/') ||
        (!ft && /\.(jpe?g|png|gif|webp|bmp|heic|avif)$/i.test(file.name));
      const looksVideo =
        ft.startsWith('video/') || (!ft && /\.(mp4|m4v|webm|mov|mkv|ogv)$/i.test(file.name));
      if (!looksImage && !looksVideo) {
        toast({
          title: 'Неподдерживаемый тип',
          description: 'Выберите файл изображения или видео.',
          variant: 'destructive',
        });
        return;
      }
      const u = await readVisualRefFileAsDataUrl(file);
      if (!u) {
        toast({
          title: 'Файл не сохранён',
          description:
            'Слишком большой объём для локального досье. Сожмите файл или выберите другой.',
          variant: 'destructive',
        });
        return;
      }
      previewDataUrl = u;
      mimeType = inferMimeTypeForVisualRef(file, u);
      fileName = file.name;
    }

    const title = refEditorTitle.trim();
    const description = refEditorDesc.trim() || undefined;
    const externalUrl = refEditorUrl.trim() || undefined;

    if (!previewDataUrl && !externalUrl && !title) {
      toast({
        title: 'Заполните референс',
        description: 'Укажите название, ссылку или прикрепите фото/видео.',
        variant: 'destructive',
      });
      return;
    }

    if (!refEditorId && items.length >= MAX_VISUAL_REFERENCES) {
      toast({
        title: 'Лимит референсов',
        description: `Не больше ${MAX_VISUAL_REFERENCES} файлов на модель.`,
        variant: 'destructive',
      });
      return;
    }

    const takeawayAspects = refEditorTakeawayAspects.length
      ? [...new Set(refEditorTakeawayAspects)]
      : undefined;
    const takeawayNote = refEditorTakeawayNote.trim() || undefined;

    const nextRow: Workshop2Phase1VisualReference = {
      refId: id,
      title,
      description,
      externalUrl,
      fileName,
      mimeType,
      previewDataUrl,
      comments: existing?.comments,
      takeawayAspects,
      takeawayNote,
    };

    if (refEditorId) {
      onChange(items.map((x) => (x.refId === id ? { ...x, ...nextRow } : x)));
    } else {
      onChange([...items, nextRow]);
    }
    setRefEditorOpen(false);
  }, [
    items,
    onChange,
    refEditorDesc,
    refEditorId,
    refEditorTakeawayAspects,
    refEditorTakeawayNote,
    refEditorTitle,
    refEditorUrl,
    toast,
  ]);

  const onFile = async (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const ft = f.type?.trim() ?? '';
    const ok =
      ft.startsWith('image/') ||
      ft.startsWith('video/') ||
      (!ft && /\.(jpe?g|png|gif|webp|mp4|webm|mov|m4v|mkv)$/i.test(f.name));
    if (!ok) return;
    const previewDataUrl = await readVisualRefFileAsDataUrl(f);
    if (!previewDataUrl) {
      toast({
        title: 'Файл не сохранён',
        description: 'Слишком большой объём для локального досье.',
        variant: 'destructive',
      });
      return;
    }
    update(id, {
      fileName: f.name,
      mimeType: inferMimeTypeForVisualRef(f, previewDataUrl),
      previewDataUrl,
    });
  };

  const addComment = () => {
    const t = draftComment.trim();
    if (!lightboxRefId || !t) return;
    const comment: Workshop2VisualRefComment = {
      commentId: newUuid(),
      by: currentUserLabel.slice(0, 256),
      at: new Date().toISOString(),
      text: t.slice(0, 4000),
    };
    onChange(
      items.map((r) =>
        r.refId === lightboxRefId ? { ...r, comments: [...(r.comments ?? []), comment] } : r
      )
    );
    setDraftComment('');
  };

  const toggleReaction = (
    refId: string,
    commentId: string,
    type: Workshop2VisualRefCommentReactionType
  ) => {
    const by = currentUserLabel.slice(0, 256);
    onChange(
      items.map((r) => {
        if (r.refId !== refId) return r;
        return {
          ...r,
          comments: (r.comments ?? []).map((c) => {
            if (c.commentId !== commentId) return c;
            const rel = [...(c.reactions ?? [])];
            const idx = rel.findIndex((x) => visualRefSameUser(x.by, by));
            if (idx >= 0 && rel[idx]!.type === type) {
              rel.splice(idx, 1);
              return { ...c, reactions: rel };
            }
            const next = rel.filter((x) => !visualRefSameUser(x.by, by));
            next.push({ by, type });
            return { ...c, reactions: next };
          }),
        };
      })
    );
  };

  const toggleCommentResolved = (refId: string, commentId: string) => {
    onChange(
      items.map((r) => {
        if (r.refId !== refId) return r;
        return {
          ...r,
          comments: (r.comments ?? []).map((c) =>
            c.commentId === commentId ? { ...c, resolved: !c.resolved } : c
          ),
        };
      })
    );
  };

  const goPrevMedia = () => {
    if (lightboxMediaIndex <= 0) return;
    setLightboxRefId(mediaRefs[lightboxMediaIndex - 1]!.refId);
    resetLightboxView();
  };
  const goNextMedia = () => {
    if (lightboxMediaIndex < 0 || lightboxMediaIndex >= mediaRefs.length - 1) return;
    setLightboxRefId(mediaRefs[lightboxMediaIndex + 1]!.refId);
    resetLightboxView();
  };

  const sortedComments = useMemo(() => {
    const list = [...(lightboxRef?.comments ?? [])];
    list.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
    return list;
  }, [lightboxRef?.comments]);

  const canAddMore = items.length < MAX_VISUAL_REFERENCES;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <LucideIcons.Images className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h2 className="text-text-primary text-base font-semibold">Референсы</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-text-muted hover:text-text-primary hover:bg-bg-surface2/80 -m-0.5 inline-flex shrink-0 rounded p-1 transition"
                  aria-label="Зачем нужны референсы"
                >
                  <LucideIcons.Info className="h-4 w-4" aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm text-xs leading-snug">
                Без референсов не закрывается обязательный контур визуала и проверка «готово к
                образцу» по этому блоку. Добавьте хотя бы одно превью или ссылку с пояснением, что
                берёте с рефа.
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-text-secondary text-sm leading-snug">
            До {MAX_VISUAL_REFERENCES} файлов; звезда — канон для витрины, обсуждения — в
            полноэкране.
          </p>
          {openRefDiscussionCount > 0 ? (
            <p className="text-[11px] font-medium text-rose-700">
              Открытых тредов по рефам: {openRefDiscussionCount} — закройте в просмотре или отметьте
              resolved.
            </p>
          ) : null}
        </div>
      </div>

      {items.length > 0 ? (
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
              const isMainPhoto = Boolean(
                canonicalMainPhotoRefId && canonicalMainPhotoRefId === r.refId
              );
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
                      onClick={() => openLightbox(r.refId)}
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
                          <LucideIcons.Play
                            className="h-4 w-4 translate-x-px"
                            fill="currentColor"
                          />
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
                          className={cn(
                            'h-3.5 w-3.5',
                            isMainPhoto && 'fill-amber-400 text-amber-600'
                          )}
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
                          openLightbox(r.refId, { armLoupe: true });
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
                          swapRefOrder(index, index - 1);
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
                          swapRefOrder(index, index + 1);
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
                        removeOne(r.refId);
                      }}
                    >
                      <LucideIcons.X className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                    </button>
                  </div>
                  {(() => {
                    const asp = (r.takeawayAspects ?? [])
                      .map((a) => VISUAL_REF_TAKEAWAY_LABELS[a])
                      .join(' · ');
                    const note = r.takeawayNote?.trim() ?? '';
                    if (!asp && !note) return null;
                    return (
                      <p
                        className="text-text-secondary mt-1 line-clamp-2 text-[9px] leading-snug"
                        title={note || asp}
                      >
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
                  onClick={() => openRefEditorEdit(r)}
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
                      swapRefOrder(index, index - 1);
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
                      swapRefOrder(index, index + 1);
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
                    removeOne(r.refId);
                  }}
                >
                  <LucideIcons.X className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="border-border-subtle flex flex-wrap items-center justify-end gap-2 border-t pt-3">
        {items.length > 0 ? (
          <>
            <Button
              type="button"
              variant={refViewMode === 'board' ? 'secondary' : 'outline'}
              size="sm"
              className="h-9 px-3 text-xs font-semibold"
              onClick={() => setRefViewMode('board')}
            >
              <LucideIcons.Columns2 className="mr-1 h-3.5 w-3.5 shrink-0" aria-hidden />
              Общий реф
            </Button>
            <Button
              type="button"
              variant={refViewMode === 'compact' ? 'secondary' : 'outline'}
              size="sm"
              className="h-9 px-3 text-xs font-semibold"
              onClick={() => setRefViewMode('compact')}
            >
              <LucideIcons.LayoutGrid className="mr-1 h-3.5 w-3.5 shrink-0" aria-hidden />
              Компактно
            </Button>
          </>
        ) : null}
        {canAddMore ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 border-slate-200 px-4 text-sm font-semibold text-slate-500"
              disabled={true}
              title="В разработке"
            >
              <LucideIcons.Sparkles className="mr-1 h-4 w-4 shrink-0" aria-hidden />
              Сгенерировать мудборд (скоро)
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="h-9 px-4 text-sm font-semibold shadow-sm"
              onClick={openRefEditorNew}
            >
              Добавить
            </Button>
          </>
        ) : null}
      </div>

      <Dialog
        open={Boolean(lightboxRef && visualRefIsMediaPreview(lightboxRef))}
        onOpenChange={(o) => {
          if (!o) {
            setLightboxRefId(null);
            setLightboxZoom(1);
            setLightboxZoomFocusPx(null);
            setLightboxLoupeArmed(false);
          }
        }}
      >
        <DialogContent
          className="flex max-h-[min(92vh,880px)] w-[min(96vw,720px)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:rounded-xl"
          aria-describedby={undefined}
        >
          {lightboxRef && lightboxRef.previewDataUrl && visualRefIsMediaPreview(lightboxRef) ? (
            <>
              <div
                ref={lightboxWheelAreaRef}
                className="relative flex min-h-0 flex-1 flex-col bg-black/90"
              >
                <button
                  type="button"
                  className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-black/70 disabled:opacity-25"
                  onClick={goPrevMedia}
                  disabled={lightboxMediaIndex <= 0}
                  aria-label="Предыдущий файл"
                >
                  <LucideIcons.ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-black/70 disabled:opacity-25"
                  onClick={goNextMedia}
                  disabled={lightboxMediaIndex < 0 || lightboxMediaIndex >= mediaRefs.length - 1}
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
                        onClick={() =>
                          setLightboxZoom((z) => Math.max(1, Math.round((z - 0.15) * 100) / 100))
                        }
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
                        onClick={() =>
                          setLightboxZoom((z) => Math.min(5, Math.round((z + 0.15) * 100) / 100))
                        }
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
                        onClick={() => {
                          if (lightboxLoupeArmed) {
                            setLightboxLoupeArmed(false);
                            setLightboxZoom(1);
                            setLightboxZoomFocusPx(null);
                          } else {
                            setLightboxLoupeArmed(true);
                          }
                        }}
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
                        onClick={resetLightboxView}
                      >
                        <LucideIcons.Maximize2 className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                    {lightboxLoupeArmed ? (
                      <p className="absolute left-1/2 top-[3.25rem] z-20 max-w-[min(92vw,28rem)] -translate-x-1/2 rounded-md bg-amber-500/95 px-3 py-1.5 text-center text-[11px] font-medium leading-snug text-amber-950 shadow-md">
                        Клик по фото — откуда увеличивать. Крупнее / мельче — только кнопки − / +
                        или колесо. Повторно иконка лупы — выключить режим и сбросить масштаб.
                      </p>
                    ) : (
                      <p className="absolute left-1/2 top-[3.25rem] z-20 max-w-[min(92vw,26rem)] -translate-x-1/2 rounded-md bg-black/55 px-2.5 py-1.5 text-center text-[10px] leading-snug text-white/90">
                        <span className="font-semibold text-white">Масштаб:</span> − / + или колесо
                        по тёмной области. Лупа — точка увеличения по клику; снова лупа — сброс
                        вида.
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
                          setLightboxZoomFocusPx(pt);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="border-border-default max-h-[40vh] space-y-3 overflow-y-auto border-t bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-text-secondary text-xs font-semibold">
                    {lightboxMediaIndex + 1} / {mediaRefs.length}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-red-600"
                    onClick={() => removeOne(lightboxRef.refId)}
                  >
                    Удалить референс
                  </Button>
                </div>
                <Input
                  className="h-9 text-sm"
                  placeholder="Название"
                  value={lightboxRef.title}
                  onChange={(e) => update(lightboxRef.refId, { title: e.target.value })}
                />
                <Textarea
                  className="min-h-[56px] text-sm"
                  placeholder="Что смотреть на референсе…"
                  value={lightboxRef.description ?? ''}
                  onChange={(e) => update(lightboxRef.refId, { description: e.target.value })}
                />
                <Input
                  className="h-9 text-sm"
                  type="url"
                  placeholder="Ссылка https://…"
                  value={lightboxRef.externalUrl ?? ''}
                  onChange={(e) => update(lightboxRef.refId, { externalUrl: e.target.value })}
                />
                <div className="space-y-1">
                  <Label className="text-text-secondary text-[10px]">Заменить файл</Label>
                  <Input
                    type="file"
                    accept="image/*,video/*"
                    className="h-9 cursor-pointer text-xs"
                    onChange={(e) => void onFile(lightboxRef.refId, e)}
                  />
                </div>

                <div className="border-border-subtle space-y-2 border-t pt-3">
                  <p className="text-text-muted text-[10px] font-semibold">Обсуждение</p>
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
                                  toggleReaction(lightboxRef.refId, c.commentId, 'like')
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
                                  toggleReaction(lightboxRef.refId, c.commentId, 'dislike')
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
                                  toggleCommentResolved(lightboxRef.refId, c.commentId)
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
                      onChange={(e) => setDraftComment(e.target.value)}
                    />
                    <Button
                      type="button"
                      className="h-9 shrink-0 self-end text-xs"
                      onClick={addComment}
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

      <Dialog
        open={refEditorOpen}
        onOpenChange={(o) => {
          setRefEditorOpen(o);
          if (!o) setRefEditorId(null);
        }}
      >
        <DialogContent className="max-h-[min(90vh,640px)] w-[min(96vw,440px)] max-w-none gap-0 overflow-y-auto p-0 sm:rounded-xl">
          <div className="border-border-subtle border-b p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <LucideIcons.Images className="h-4 w-4 shrink-0" aria-hidden />
              </div>
              <DialogHeader className="m-0 flex-1 space-y-1 p-0 text-left">
                <DialogTitle>{refEditorId ? 'Референс' : 'Новый референс'}</DialogTitle>
                <DialogDescription className="text-sm leading-snug">
                  Название, пояснение и ссылка — по желанию; фото или видео дадут превью в сетке.
                  Компактная сетка или два крупных превью в ряд — переключатели под сеткой
                  референсов (после закрытия этого окна).
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
          <div className="space-y-3 p-4 sm:p-5">
            <div className="space-y-1">
              <Label htmlFor="w2-vref-editor-title" className="text-xs">
                Краткое название
              </Label>
              <Input
                id="w2-vref-editor-title"
                className="h-9 text-sm"
                placeholder="Например: референс посадки"
                value={refEditorTitle}
                onChange={(e) => setRefEditorTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="w2-vref-editor-desc" className="text-xs">
                Что смотреть на референсе
              </Label>
              <Textarea
                id="w2-vref-editor-desc"
                className="min-h-[72px] text-sm"
                placeholder="Акценты силуэта, фактура, детали…"
                value={refEditorDesc}
                onChange={(e) => setRefEditorDesc(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="w2-vref-editor-url" className="text-xs">
                Ссылка (необязательно)
              </Label>
              <Input
                id="w2-vref-editor-url"
                className="h-9 text-sm"
                type="url"
                inputMode="url"
                placeholder="https://…"
                value={refEditorUrl}
                onChange={(e) => setRefEditorUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Что берём с рефа</Label>
              <div className="flex flex-wrap gap-2">
                {(
                  Object.keys(VISUAL_REF_TAKEAWAY_LABELS) as Workshop2VisualRefTakeawayAspect[]
                ).map((aspect) => {
                  const on = refEditorTakeawayAspects.includes(aspect);
                  return (
                    <label
                      key={aspect}
                      className={cn(
                        'flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] transition',
                        on
                          ? 'border-accent-primary/30 bg-accent-primary/10 text-accent-primary'
                          : 'border-border-default text-text-primary bg-white'
                      )}
                    >
                      <input
                        type="checkbox"
                        className="border-border-default h-3.5 w-3.5 rounded"
                        checked={on}
                        onChange={() => {
                          setRefEditorTakeawayAspects((prev) =>
                            prev.includes(aspect)
                              ? prev.filter((x) => x !== aspect)
                              : [...prev, aspect]
                          );
                        }}
                      />
                      {VISUAL_REF_TAKEAWAY_LABELS[aspect]}
                    </label>
                  );
                })}
              </div>
              <Textarea
                className="min-h-[52px] text-sm"
                placeholder="Уточнение решения (необязательно): например «только линия плеча»"
                value={refEditorTakeawayNote}
                onChange={(e) => setRefEditorTakeawayNote(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="w2-vref-editor-file" className="text-xs">
                Файл фото или видео
              </Label>
              <Input
                id="w2-vref-editor-file"
                ref={refEditorFileInputRef}
                type="file"
                accept="image/*,video/*"
                className="h-9 cursor-pointer text-xs"
              />
              {refEditorId ? (
                <p className="text-text-secondary text-[10px]">
                  Оставьте поле пустым, чтобы сохранить текущий файл.
                </p>
              ) : null}
            </div>
          </div>
          <DialogFooter className="border-border-subtle border-t px-4 py-3 sm:px-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRefEditorOpen(false)}
            >
              Отмена
            </Button>
            <Button type="button" size="sm" onClick={() => void saveRefEditor()}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={aiMoodboardOpen}
        onOpenChange={(o) => {
          setAiMoodboardOpen(o);
        }}
      >
        <DialogContent className="max-h-[min(90vh,640px)] w-[min(96vw,540px)] max-w-none gap-0 overflow-y-auto p-0 sm:rounded-xl">
          <DialogHeader className="border-border-subtle border-b p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100/50 text-teal-600">
                <LucideIcons.Sparkles className="h-5 w-5" aria-hidden />
              </div>
              <div className="flex-1 text-left">
                <DialogTitle className="text-base text-teal-900">AI-Генерация мудборда</DialogTitle>
                <DialogDescription className="text-xs text-teal-700/80">
                  Анализируем ваши текстовые заметки и существующие референсы для создания единого
                  стилевого коллажа.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4 bg-slate-50/50 p-4 sm:p-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700">
                Текстовое направление (Prompt)
              </Label>
              <Textarea
                className="min-h-[80px] bg-white text-sm"
                placeholder="Опишите желаемое настроение, цветовую гамму, текстуры... Например: 'Минималистичный скандинавский стиль, пастельные тона, лен и хлопок'"
                value={aiMoodboardPrompt}
                onChange={(e) => setAiMoodboardPrompt(e.target.value)}
              />
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Настройки генерации
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] text-slate-500">Стиль отрисовки</Label>
                  <select className="h-8 w-full rounded border-slate-200 bg-slate-50 px-2 text-xs outline-none focus:ring-1 focus:ring-teal-500">
                    <option>Фотореализм</option>
                    <option>Скетч маркерами</option>
                    <option>Акварель</option>
                    <option>Студийная съемка</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-slate-500">Основа (Source)</Label>
                  <select className="h-8 w-full rounded border-slate-200 bg-slate-50 px-2 text-xs outline-none focus:ring-1 focus:ring-teal-500">
                    <option>Все референсы</option>
                    <option>Только главное фото</option>
                    <option>Только текст (с нуля)</option>
                  </select>
                </div>
              </div>
            </div>

            {aiMoodboardLoading && (
              <div className="flex flex-col items-center justify-center space-y-3 py-6">
                <LucideIcons.Loader2 className="h-6 w-6 animate-spin text-teal-500" />
                <p className="animate-pulse text-xs font-medium text-teal-800">
                  Собираем коллаж, анализируем паттерны...
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="border-border-subtle border-t bg-white px-4 py-3 sm:px-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAiMoodboardOpen(false)}
              disabled={aiMoodboardLoading}
            >
              Отмена
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-teal-600 text-white hover:bg-teal-700"
              disabled={aiMoodboardLoading}
              onClick={async () => {
                setAiMoodboardLoading(true);
                try {
                  const res = await fetch('/api/brand/workshop2/ai/moodboard', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: aiMoodboardPrompt }),
                  });
                  const data = (await res.json()) as { images?: { url: string; title: string }[] };
                  if (data.images && Array.isArray(data.images)) {
                    const newItems = data.images.map((img: { url: string; title: string }) => ({
                      refId: newUuid(),
                      title: img.title,
                      previewDataUrl: img.url,
                      mimeType: 'image/jpeg',
                      fileName: 'ai-moodboard.jpg',
                    }));
                    onChange([...items, ...newItems]);
                  }
                  toast({
                    title: 'Мудборд готов',
                    description: 'Новые референсы добавлены в галерею.',
                  });
                } catch (error) {
                  toast({
                    title: 'Ошибка',
                    description: 'Не удалось сгенерировать мудборд.',
                    variant: 'destructive',
                  });
                } finally {
                  setAiMoodboardLoading(false);
                  setAiMoodboardOpen(false);
                }
              }}
            >
              Сгенерировать 4 варианта
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
