'use client';

import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type {
  Workshop2Phase1VisualReference,
  Workshop2VisualRefComment,
  Workshop2VisualRefCommentReactionType,
  Workshop2VisualRefTakeawayAspect,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  effectiveVisualRefMime,
  inferMimeTypeForVisualRef,
  MAX_VISUAL_REFERENCES,
  readVisualRefFileAsDataUrl,
  visualRefIsMediaPreview,
  visualRefSameUser,
} from '@/lib/production/workshop2-visual-references-utils';
import { Workshop2VisualReferenceEditorDialog } from '@/components/brand/production/Workshop2VisualReferenceEditorDialog';
import { Workshop2VisualReferencesGrid } from '@/components/brand/production/Workshop2VisualReferencesGrid';
import { Workshop2VisualReferencesLightboxDialog } from '@/components/brand/production/Workshop2VisualReferencesLightboxDialog';
import { Workshop2VisualReferencesTopBar } from '@/components/brand/production/Workshop2VisualReferencesTopBar';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';

function newUuid(): string {
  return globalThis.crypto.randomUUID();
}

export function Workshop2VisualReferencesBlock({
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
  const [refViewMode, setRefViewMode] = useState<'compact' | 'board'>('compact');
  const [draftComment, setDraftComment] = useState('');
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
  const lightboxMediaIndex = lightboxRefId ? mediaRefs.findIndex((r) => r.refId === lightboxRefId) : -1;

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

  return (
    <div className="border-border-default space-y-4 rounded-xl border bg-white p-4 shadow-sm">
      <Workshop2VisualReferencesTopBar
        openRefDiscussionCount={openRefDiscussionCount}
        maxReferences={MAX_VISUAL_REFERENCES}
      />

      <Workshop2VisualReferencesGrid
        items={items}
        refViewMode={refViewMode}
        maxReferences={MAX_VISUAL_REFERENCES}
        canonicalMainPhotoRefId={canonicalMainPhotoRefId}
        onSetCanonicalMainPhoto={onSetCanonicalMainPhoto}
        onOpenLightbox={openLightbox}
        onOpenRefEditorEdit={openRefEditorEdit}
        onSwapRefOrder={swapRefOrder}
        onRemoveOne={removeOne}
        onOpenRefEditorNew={openRefEditorNew}
      />

      <div className="border-border-subtle flex flex-wrap items-center justify-end gap-2 border-t pt-3">
        {items.length > 0 ? (
          <>
            <Button
              type="button"
              variant={refViewMode === 'board' ? 'secondary' : 'outline'}
              className="h-9 px-3 text-xs font-semibold"
              onClick={() => setRefViewMode('board')}
            >
              <LucideIcons.Columns2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Общий реф
            </Button>
            <Button
              type="button"
              variant={refViewMode === 'compact' ? 'secondary' : 'outline'}
              className="h-9 px-3 text-xs font-semibold"
              onClick={() => setRefViewMode('compact')}
            >
              <LucideIcons.LayoutGrid className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Компактно
            </Button>
          </>
        ) : null}
        <Button type="button" className="h-9 px-3 text-xs font-semibold" onClick={openRefEditorNew}>
          Добавить
        </Button>
      </div>

      <Workshop2VisualReferencesLightboxDialog
        isOpen={Boolean(lightboxRef && visualRefIsMediaPreview(lightboxRef))}
        lightboxRef={lightboxRef}
        lightboxMediaIndex={lightboxMediaIndex}
        mediaRefsLength={mediaRefs.length}
        lightboxWheelAreaRef={lightboxWheelAreaRef}
        lightboxLoupeArmed={lightboxLoupeArmed}
        lightboxZoom={lightboxZoom}
        lightboxZoomFocusPx={lightboxZoomFocusPx}
        sortedComments={sortedComments}
        threadAuthorLabel={threadAuthorLabel}
        currentUserLabel={currentUserLabel}
        draftComment={draftComment}
        onClose={() => {
          setLightboxRefId(null);
          setLightboxZoom(1);
          setLightboxZoomFocusPx(null);
          setLightboxLoupeArmed(false);
        }}
        onGoPrevMedia={goPrevMedia}
        onGoNextMedia={goNextMedia}
        onZoomOut={() => setLightboxZoom((z) => Math.max(1, Math.round((z - 0.15) * 100) / 100))}
        onZoomIn={() => setLightboxZoom((z) => Math.min(5, Math.round((z + 0.15) * 100) / 100))}
        onToggleLoupe={() => {
          if (lightboxLoupeArmed) {
            setLightboxLoupeArmed(false);
            setLightboxZoom(1);
            setLightboxZoomFocusPx(null);
          } else {
            setLightboxLoupeArmed(true);
          }
        }}
        onResetLightboxView={resetLightboxView}
        onSetLightboxZoomFocusPx={setLightboxZoomFocusPx}
        onRemoveOne={removeOne}
        onUpdate={update}
        onFile={onFile}
        onToggleReaction={toggleReaction}
        onToggleCommentResolved={toggleCommentResolved}
        onDraftCommentChange={setDraftComment}
        onAddComment={addComment}
      />

      <Workshop2VisualReferenceEditorDialog
        open={refEditorOpen}
        refEditorId={refEditorId}
        refEditorTitle={refEditorTitle}
        refEditorDesc={refEditorDesc}
        refEditorUrl={refEditorUrl}
        refEditorTakeawayAspects={refEditorTakeawayAspects}
        refEditorTakeawayNote={refEditorTakeawayNote}
        refEditorFileInputRef={refEditorFileInputRef}
        onOpenChange={(o) => {
          setRefEditorOpen(o);
          if (!o) setRefEditorId(null);
        }}
        onRefEditorTitleChange={setRefEditorTitle}
        onRefEditorDescChange={setRefEditorDesc}
        onRefEditorUrlChange={setRefEditorUrl}
        onToggleTakeawayAspect={(aspect) =>
          setRefEditorTakeawayAspects((prev) =>
            prev.includes(aspect) ? prev.filter((x) => x !== aspect) : [...prev, aspect]
          )
        }
        onRefEditorTakeawayNoteChange={setRefEditorTakeawayNote}
        onCancel={() => setRefEditorOpen(false)}
        onSave={() => void saveRefEditor()}
      />
    </div>
  );
}
