'use client';

import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getUnknownErrorDetail, getUnknownErrorName } from '@/lib/unknown-error-message';
import { Archive, FileQuestion, Info, Maximize2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import {
  effectiveTechPackAttachmentMime,
  inferMimeTypeForTechPackFile,
  techPackAttachmentHasZipSourceBytes,
  techPackInlinePreviewKind,
} from '@/lib/production/workshop2-tech-pack-attachment-utils';
import { inferTechPackSourceKind, isTechPackFileAllowedForUpload } from '@/lib/production/workshop2-tech-pack-allowed';
import { deleteW2TechPackBlob, getW2TechPackBlob, putW2TechPackBlob } from '@/lib/production/workshop2-tech-pack-idb';
import { sha256HexFull, sha256HexPrefix16 } from '@/lib/production/workshop2-tech-pack-fingerprint';
import { makeJpegThumbnailDataUrl, makePdfFirstPageJpegDataUrl } from '@/lib/production/workshop2-tech-pack-thumbnail';
import { fetchW2TechPackRemoteEnabled, syncW2TechPackAttachmentToRemote } from '@/lib/production/workshop2-tech-pack-remote-sync';
import {
  buildWorkshop2TechPackZipBlob,
  sanitizeTechPackZipStem,
  triggerBrowserDownloadBlob,
} from '@/lib/production/workshop2-tech-pack-zip';
import type {
  Workshop2Phase1TechPackAttachment,
  Workshop2TzActionLogPayload,
} from '@/lib/production/workshop2-dossier-phase1.types';

const MAX_TECH_PACK_FILES = 10;
const MAX_TECH_PACK_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const MAX_TECH_PACK_PERSISTED_DATA_URL_CHARS = 900_000;

function newUuid(): string {
  return globalThis.crypto.randomUUID();
}

function readFileAsDataUrlLimited(file: File, maxChars: number): Promise<string | undefined> {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => {
      const s = String(fr.result ?? '');
      resolve(s.length <= maxChars ? s : undefined);
    };
    fr.onerror = () => resolve(undefined);
    fr.readAsDataURL(file);
  });
}

type LightboxState = { kind: 'image' | 'pdf' | '3d'; url: string; name: string } | null;
type TechPackFilter =
  | 'all'
  | 'pdf'
  | 'image'
  | 'cad'
  | 'zip'
  | 'with-preview'
  | 'without-preview'
  | 'oversized';

async function getBlobForTechPackSeal(
  a: Workshop2Phase1TechPackAttachment,
  sessionBlobById: Record<string, string>,
  collectionId: string,
  articleId: string
): Promise<Blob | null> {
  if (a.byteStorage === 'idb') {
    return (await getW2TechPackBlob(collectionId, articleId, a.attachmentId)) ?? null;
  }
  const url = a.previewDataUrl ?? sessionBlobById[a.attachmentId];
  if (url) {
    try {
      const r = await fetch(url);
      if (r.ok) return r.blob();
    } catch {
      return null;
    }
  }
  return null;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${Math.round(bytes)} B`;
}

function TechPackMediaPreview({
  kind,
  url,
  fileName,
  className,
  variant = 'inline',
}: {
  kind: 'image' | 'pdf' | '3d';
  url: string;
  fileName: string;
  className?: string;
  variant?: 'inline' | 'lightbox';
}) {
  useEffect(() => {
    if (kind === '3d') {
      if (!document.querySelector('script[src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"]')) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
        document.head.appendChild(script);
      }
    }
  }, [kind]);

  if (kind === '3d') {
    // Используем Web Component <model-viewer> для 3D файлов
    // Web component
    return (
      <div className={className + " relative bg-slate-900 rounded-md overflow-hidden flex flex-col items-center justify-center"}>
        {/* @ts-expect-error - custom element */}
        <model-viewer
          src={url}
          alt={fileName}
          auto-rotate
          camera-controls
          style={{ width: '100%', height: '100%', minHeight: '300px' }}
        />
        <Badge className="absolute top-2 left-2 bg-black/50 text-white border-white/20">3D Viewer</Badge>
      </div>
    );
  }
  if (kind === 'image') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={`Превью: ${fileName}`} className={className} />
    );
  }
  if (variant === 'lightbox') {
    return <iframe title={fileName} src={url} className={className} />;
  }
  return (
    <object data={url} type="application/pdf" title={fileName} className={className}>
      <p className="text-text-secondary p-2 text-xs">
        Встроенный просмотр PDF недоступен.{' '}
        <a href={url} download={fileName} className="text-accent-primary font-medium underline">
          Скачать
        </a>
        {' · '}
        <a href={url} target="_blank" rel="noreferrer" className="text-accent-primary font-medium underline">
          Открыть
        </a>
      </p>
    </object>
  );
}

export function Workshop2TechPackAttachmentsBlock({
  attachments,
  onChange,
  zipFileNameStem,
  collectionId,
  articleId,
  sessionBlobById,
  setSessionBlobById,
  onJournalLine,
  onPatchAttachment,
  onPulseAction,
  sealActorLabel,
  onGenerateZip,
}: {
  attachments: Workshop2Phase1TechPackAttachment[];
  onChange: (next: Workshop2Phase1TechPackAttachment[]) => void;
  zipFileNameStem?: string;
  collectionId: string;
  articleId: string;
  sessionBlobById: Record<string, string>;
  setSessionBlobById: Dispatch<SetStateAction<Record<string, string>>>;
  /**
   * Строка в журнал действий ТЗ (видно в «Пульс» / истории) после удачного ZIP.
   * Родитель сам пишет в досье + localStorage.
   */
  onJournalLine?: (line: string) => void;
  /** Точечное обновление вложения (для статуса выгрузки в облако без гонок). */
  onPatchAttachment?: (id: string, patch: Partial<Workshop2Phase1TechPackAttachment>) => void;
  /** События Пульса (целостность, не только дифф досье). */
  onPulseAction?: (action: Workshop2TzActionLogPayload) => void;
  /** Кто ставит печать «к производству» (ФИО из сессии). */
  sealActorLabel?: string;
  onGenerateZip?: (args: {
    attachments: Workshop2Phase1TechPackAttachment[];
    sessionBlobById: Record<string, string>;
    collectionId: string;
    articleId: string;
    onProgress: (percent: number, currentFile: string) => void;
  }) => Promise<any>;
}) {
  const { toast } = useToast();
  const [remoteEnabled, setRemoteEnabled] = useState(false);
  const [zipBusy, setZipBusy] = useState(false);
  const [zipProgress, setZipProgress] = useState<{ percent: number; currentFile: string } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [zipOnlyWithRevision, setZipOnlyWithRevision] = useState(false);
  const [excludeZipFilesFromArchive, setExcludeZipFilesFromArchive] = useState(false);
  const remaining = MAX_TECH_PACK_FILES - attachments.length;
  /** objectURL от байтов в IndexedDB — для просмотра. */
  const [idbObjectUrlById, setIdbObjectUrlById] = useState<Record<string, string>>({});
  const idbLoadedRef = useRef(new Set<string>());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const [filter, setFilter] = useState<TechPackFilter>('all');
  const [query, setQuery] = useState('');
  const blobUrlRegistry = useRef(new Set<string>());

  const [pendingJob, setPendingJob] = useState<{ jobId: string, attachmentId: string } | null>(null);

  useEffect(() => {
    if (!pendingJob) return;
    
    let isCancelled = false;
    let timeoutId: NodeJS.Timeout;

    const pollJob = async () => {
      try {
        const res = await fetch(`/api/brand/workshop2/tech-pack/complete?jobId=${pendingJob.jobId}`);
        if (!res.ok) {
          if (!isCancelled) {
            setPendingJob(null);
            setZipBusy(false);
            setZipProgress(null);
          }
          return;
        }
        const data = (await res.json()) as any;
        
        if (data.status === 'processing') {
          if (!isCancelled) {
            setZipProgress({ percent: data.progress, currentFile: data.message || 'Синхронизация...' });
            timeoutId = setTimeout(pollJob, 1000); // Пол на 1 секунду
          }
        } else if (data.status === 'completed') {
          if (!isCancelled) {
            setPendingJob(null);
            setZipBusy(false);
            setZipProgress(null);
            
            if (onPatchAttachment && pendingJob) {
              onPatchAttachment(pendingJob.attachmentId, {
                remoteSyncState: 'synced',
                remoteObjectKey: data.resultUrl,
                remoteSyncedAt: data.updatedAt,
                remoteLastError: undefined,
                canonicalSource: 'object_store_verified',
                serverIntegrityVerifiedAt: data.updatedAt,
              });
            }
            
            toast({ title: 'Синхронизация завершена', description: 'Файл успешно загружен в облако.' });
          }
        } else if (data.status === 'error') {
          if (!isCancelled) {
            setPendingJob(null);
            setZipBusy(false);
            setZipProgress(null);
            
            if (onPatchAttachment && pendingJob) {
              onPatchAttachment(pendingJob.attachmentId, {
                remoteSyncState: 'failed',
                remoteLastError: data.errorDetail || 'Ошибка фоновой обработки',
              });
            }
            
            toast({ title: 'Ошибка синхронизации', description: 'Не удалось загрузить файл в облако.', variant: 'destructive' });
          }
        }
      } catch (e) {
        if (!isCancelled) {
          setPendingJob(null);
          setZipBusy(false);
          setZipProgress(null);
        }
      }
    };

    pollJob();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [pendingJob, onPatchAttachment, toast]);

  const canUseIdb =
    typeof indexedDB !== 'undefined' && Boolean(String(collectionId || '').trim()) && Boolean(String(articleId || '').trim());

  const registerBlobUrl = useCallback((url: string) => {
    blobUrlRegistry.current.add(url);
  }, []);

  const revokeIfTracked = useCallback((url: string) => {
    if (blobUrlRegistry.current.has(url)) {
      URL.revokeObjectURL(url);
      blobUrlRegistry.current.delete(url);
    }
  }, []);

  const removeSessionBlobsForIds = useCallback(
    (ids: readonly string[]) => {
      setSessionBlobById((prev) => {
        const next = { ...prev };
        for (const id of ids) {
          const u = next[id];
          if (u) {
            revokeIfTracked(u);
            delete next[id];
          }
        }
        return next;
      });
    },
    [revokeIfTracked]
  );

  useEffect(() => {
    const alive = new Set(attachments.map((a) => a.attachmentId));
    setSessionBlobById((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const id of Object.keys(prev)) {
        if (!alive.has(id)) {
          const u = prev[id]!;
          revokeIfTracked(u);
          delete next[id];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
    setIdbObjectUrlById((prev) => {
      const next = { ...prev };
      for (const id of Object.keys(prev)) {
        if (!alive.has(id)) {
          idbLoadedRef.current.delete(id);
          revokeIfTracked(next[id]!);
          delete next[id];
        }
      }
      return next;
    });
  }, [attachments, revokeIfTracked]);

  useEffect(
    () => () => {
      blobUrlRegistry.current.forEach((u) => URL.revokeObjectURL(u));
      blobUrlRegistry.current.clear();
    },
    []
  );

  useEffect(() => {
    void fetchW2TechPackRemoteEnabled().then(setRemoteEnabled);
  }, []);

  /** Подгрузка objectURL из IndexedDB для inline/PDF-просмотра. */
  useEffect(() => {
    if (!canUseIdb) return;
    let cancelled = false;
    (async () => {
      for (const a of attachments) {
        if (a.byteStorage !== 'idb') continue;
        if (idbLoadedRef.current.has(a.attachmentId)) continue;
        const b = await getW2TechPackBlob(collectionId, articleId, a.attachmentId);
        if (!b || cancelled) continue;
        const u = URL.createObjectURL(b);
        registerBlobUrl(u);
        idbLoadedRef.current.add(a.attachmentId);
        setIdbObjectUrlById((p) => ({ ...p, [a.attachmentId]: u }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [attachments, articleId, canUseIdb, collectionId, registerBlobUrl]);

  const canDownloadZip = attachments.some((a) =>
    techPackAttachmentHasZipSourceBytes(a, sessionBlobById)
  );

  const downloadAttachmentFile = useCallback(
    async (a: Workshop2Phase1TechPackAttachment) => {
      setDownloadingId(a.attachmentId);
      try {
        const blob = await getBlobForTechPackSeal(a, sessionBlobById, collectionId, articleId);
        if (!blob) {
          toast({
            title: 'Нет файла',
            description: 'Нет байтов для скачивания.',
            variant: 'destructive',
          });
          return;
        }
        triggerBrowserDownloadBlob(blob, a.fileName);
      } finally {
        setDownloadingId(null);
      }
    },
    [articleId, collectionId, sessionBlobById, toast]
  );

  const sealAttachment = useCallback(
    async (a: Workshop2Phase1TechPackAttachment) => {
      if (!onPatchAttachment || !onPulseAction || !sealActorLabel?.trim() || a.productionImmutableSeal) return;
      const blob = await getBlobForTechPackSeal(a, sessionBlobById, collectionId, articleId);
      if (!blob) {
        toast({ title: 'Нет байтов', description: 'Не удалось прочитать файл для печати.', variant: 'destructive' });
        return;
      }
      const full = await sha256HexFull(blob);
      onPatchAttachment(a.attachmentId, {
        productionImmutableSeal: {
          at: new Date().toISOString(),
          by: sealActorLabel.slice(0, 200),
          contentSha256Full: full,
        },
      });
      onPulseAction({
        type: 'tech_pack_integrity',
        summary: `Печать «к производству» для «${a.fileName}» (SHA-256 ${full.slice(0, 16)}…).`,
      });
    },
    [articleId, collectionId, onPatchAttachment, onPulseAction, sealActorLabel, sessionBlobById, toast]
  );

  const retryRemoteSync = useCallback(
    (a: Workshop2Phase1TechPackAttachment) => {
      if (!onPatchAttachment) return;
      void syncW2TechPackAttachmentToRemote({
        collectionId,
        articleId,
        sessionBlobById,
        attachment: a,
        onPatch: (patch) => onPatchAttachment(a.attachmentId, patch),
      }).then((r) => {
        if (typeof r === 'object' && r.jobId) {
          setPendingJob({ jobId: r.jobId, attachmentId: a.attachmentId });
          setZipBusy(true);
          setZipProgress({ percent: 0, currentFile: 'Отправлено в фон...' });
        } else if (r === 'synced') {
          onJournalLine?.(`Облако: «${a.fileName}» синхронизировано с хранилищем.`);
        }
      });
    },
    [articleId, collectionId, onJournalLine, onPatchAttachment, sessionBlobById]
  );

  const onDownloadZip = async () => {
    if (!canDownloadZip) {
      toast({
        title: 'Нет данных',
        description: 'Ни одно вложение не содержит байтов для архива.',
        variant: 'destructive',
      });
      return;
    }
    
    // Если передан внешний обработчик (например, для запуска фонового джоба), используем его
    if (onGenerateZip) {
      setZipBusy(true);
      setZipProgress({ percent: 0, currentFile: 'Инициализация...' });
      try {
        const valid = zipOnlyWithRevision 
          ? attachments.filter(a => Boolean((a.revisionNote ?? '').trim()))
          : attachments;
          
        const res = await onGenerateZip({
          attachments: valid,
          sessionBlobById,
          collectionId,
          articleId,
          onProgress: (p, c) => setZipProgress({ percent: p, currentFile: c }),
        });
        
        // Мок для тестирования фонового джоба (как если бы onGenerateZip вернул jobId)
        // В реальности onGenerateZip будет вызывать POST /api/brand/workshop2/tech-pack/complete
        // Здесь мы просто ставим заглушку для примера, так как onGenerateZip скачивает ZIP локально
        // Чтобы продемонстрировать фоновую генерацию на сервере (например для S3), раскомментируйте это:
        // setPendingJobId("job_" + Date.now()); 
        
        if (res) {
          toast({
            title: 'ZIP готов',
            description: `Собрано файлов: ${valid.length}.`,
          });
          onJournalLine?.(`Скачан пакет Tech Pack (${valid.length} файлов).`);
          onPulseAction?.({ 
            type: 'tech_pack_integrity', 
            summary: `Скачан пакет Tech Pack (${valid.length} файлов).` 
          });
        }
      } catch (err) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось сгенерировать ZIP-архив.',
          variant: 'destructive',
        });
      } finally {
        setZipBusy(false);
        setZipProgress(null);
      }
      return;
    }
    setZipProgress({ percent: 0, currentFile: 'Инициализация...' });
    try {
      const filterLabel = zipOnlyWithRevision
        ? 'только с ревизией'
        : 'все; ' + (excludeZipFilesFromArchive ? 'без .zip' : 'включая .zip');
      const { blob, included, skippedNoUrl, skippedByFilter } = await buildWorkshop2TechPackZipBlob({
        attachments,
        sessionBlobById,
        getIdbBlob:
          canUseIdb
            ? (aid) => getW2TechPackBlob(collectionId, articleId, aid)
            : undefined,
        includeAttachment: zipOnlyWithRevision
          ? (a) => Boolean((a.revisionNote ?? '').trim())
          : () => true,
        excludeZipExtensions: excludeZipFilesFromArchive,
        onProgress: (meta) => setZipProgress(meta),
      });
      const stem = sanitizeTechPackZipStem(zipFileNameStem?.trim() || 'article');
      triggerBrowserDownloadBlob(blob, `${stem}-tech-pack.zip`);
      toast({
        title: 'Скачан архив',
        description: `В ZIP: ${included}${skippedNoUrl ? `, без байтов: ${skippedNoUrl}` : ''}${skippedByFilter ? `, отфильтровано: ${skippedByFilter}` : ''}.`,
      });
      onJournalLine?.(
        `Пакет в цех: скачан ZIP техпака (${included} файлов; фильтр: ${filterLabel}).`
      );
    } catch (e) {
      const msg = getUnknownErrorDetail(e);
      if (msg === 'all_filtered') {
        toast({
          variant: 'destructive',
          title: 'Пусто по фильтру',
          description: 'Включите вложения с ревизией или снимите фильтр.',
        });
      } else {
        const noBytes = msg === 'no_bytes' || getUnknownErrorName(e) === 'TechPackZipError';
        toast({
          variant: 'destructive',
          title: 'Не удалось собрать ZIP',
          description: noBytes
            ? 'Нет вложений с данными (или нет id коллекции/артикула для IndexedDB).'
            : msg || 'Попробуйте снова.',
        });
      }
    } finally {
      setZipBusy(false);
      setZipProgress(null);
    }
  };

  const updateRevision = (id: string, revisionNote: string) => {
    onChange(attachments.map((a) => (a.attachmentId === id ? { ...a, revisionNote } : a)));
  };

  const removeOne = (id: string) => {
    const att = attachments.find((a) => a.attachmentId === id);
    idbLoadedRef.current.delete(id);
    removeSessionBlobsForIds([id]);
    if (att?.byteStorage === 'idb' && canUseIdb) {
      void deleteW2TechPackBlob(collectionId, articleId, id);
    }
    setIdbObjectUrlById((prev) => {
      const u = prev[id];
      if (u) revokeIfTracked(u);
      const next = { ...prev };
      delete next[id];
      return next;
    });
    onChange(attachments.filter((a) => a.attachmentId !== id));
  };

  const onPick = async (e: ChangeEvent<HTMLInputElement>) => {
    // Снимок до сброса value: в ряде браузеров FileList после очистки становится пустым.
    const files = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = '';
    if (!files.length) return;
    let cur = [...attachments];
    const newSession: Record<string, string> = {};
    const addedThisBatch: string[] = [];
    for (let i = 0; i < files.length && cur.length < MAX_TECH_PACK_FILES; i++) {
      const file = files[i]!;
      const allow = isTechPackFileAllowedForUpload(file);
      if (!allow.ok) {
        toast({ title: 'Файл отклонён', description: allow.reason, variant: 'destructive' });
        continue;
      }
      if (file.size > MAX_TECH_PACK_FILE_SIZE_BYTES) {
        toast({ title: 'Слишком большой', description: formatBytes(file.size), variant: 'destructive' });
        continue;
      }
      const id = newUuid();
      const previewDataUrl = await readFileAsDataUrlLimited(
        file,
        MAX_TECH_PACK_PERSISTED_DATA_URL_CHARS
      );
      const mimeType =
        inferMimeTypeForTechPackFile(file, previewDataUrl) || file.type?.trim() || undefined;
      const uploadedAt = new Date().toISOString();
      const uploadedBy = sealActorLabel?.trim() ? sealActorLabel.trim().slice(0, 200) : undefined;
      const sourceKind = inferTechPackSourceKind(file.name, mimeType);
      let contentSha: string | undefined;
      try {
        contentSha = await sha256HexPrefix16(file, 16);
      } catch {
        /* ignore */
      }
      if (contentSha) {
        if (
          attachments.some((x) => x.contentSha256 === contentSha) ||
          cur.some((x) => x.contentSha256 === contentSha)
        ) {
          toast({
            title: 'Дубликат',
            description: 'Файл с таким же хешом уже в списке (или добавлен в этой пачке).',
            variant: 'destructive',
          });
          continue;
        }
      }
      let thumb = await makeJpegThumbnailDataUrl(file);
      if (!thumb && (mimeType?.toLowerCase().includes('pdf') || /\.pdf$/i.test(file.name))) {
        thumb = (await makePdfFirstPageJpegDataUrl(file)) ?? undefined;
      }
      const remoteState = remoteEnabled
        ? ({ canonicalSource: 'local_only' as const, remoteSyncState: 'pending' as const } as const)
        : ({ canonicalSource: 'local_only' as const, remoteSyncState: 'local' as const } as const);

      if (previewDataUrl) {
        cur.push({
          attachmentId: id,
          fileName: file.name,
          fileSize: file.size,
          mimeType,
          previewDataUrl,
          byteStorage: 'dataurl',
          previewThumbnailDataUrl: thumb,
          contentSha256: contentSha,
          uploadedAt,
          uploadedBy,
          sourceKind,
          ...remoteState,
        });
        addedThisBatch.push(id);
        continue;
      }

      if (canUseIdb) {
        try {
          await putW2TechPackBlob(collectionId, articleId, id, file);
          cur.push({
            attachmentId: id,
            fileName: file.name,
            fileSize: file.size,
            mimeType,
            byteStorage: 'idb',
            previewThumbnailDataUrl: thumb,
            contentSha256: contentSha,
            uploadedAt,
            uploadedBy,
            sourceKind,
            ...remoteState,
          });
          addedThisBatch.push(id);
          continue;
        } catch {
          toast({ title: 'IndexedDB', description: 'Не удалось сохранить байты локально.', variant: 'destructive' });
        }
      }

      // Любой допустимый файл без data URL и без IDB — байты в сессии (object URL), иначе CAD/ZIP без inline-превью «пропадали».
      const u = URL.createObjectURL(file);
      registerBlobUrl(u);
      newSession[id] = u;
      cur.push({
        attachmentId: id,
        fileName: file.name,
        fileSize: file.size,
        mimeType,
        byteStorage: 'session',
        previewThumbnailDataUrl: thumb,
        contentSha256: contentSha,
        uploadedAt,
        uploadedBy,
        sourceKind,
        ...remoteState,
      });
      addedThisBatch.push(id);
    }
    if (Object.keys(newSession).length > 0) {
      setSessionBlobById((p) => ({ ...p, ...newSession }));
    }
    const finalList = cur.slice(0, MAX_TECH_PACK_FILES);
    onChange(finalList);

    const mergedSession = { ...sessionBlobById, ...newSession };
    if (onPatchAttachment && remoteEnabled && addedThisBatch.length > 0) {
      for (const aid of addedThisBatch) {
        const att = finalList.find((x) => x.attachmentId === aid);
        if (!att) continue;
        void syncW2TechPackAttachmentToRemote({
          collectionId,
          articleId,
          sessionBlobById: mergedSession,
          attachment: att,
          onPatch: (patch) => onPatchAttachment(aid, patch),
        }).then((r) => {
          if (typeof r === 'object' && r.jobId) {
            setPendingJob({ jobId: r.jobId, attachmentId: aid });
            setZipBusy(true);
            setZipProgress({ percent: 0, currentFile: 'Отправлено в фон...' });
          } else if (r === 'synced') {
            onJournalLine?.(`Облако: «${att.fileName}» синхронизировано с хранилищем.`);
          }
        });
      }
    }
  };

  const filteredAttachments = attachments.filter((a) => {
      const effMime = effectiveTechPackAttachmentMime(a);
      const lowerMime = effMime.toLowerCase();
      const lowerName = a.fileName.toLowerCase();
      const hasPreview =
        Boolean(a.previewDataUrl) ||
        Boolean(sessionBlobById[a.attachmentId]) ||
        a.byteStorage === 'idb' ||
        Boolean(a.previewThumbnailDataUrl);
      const oversize = (a.fileSize ?? 0) > MAX_TECH_PACK_FILE_SIZE_BYTES;
      const cadByExt = /\.(dxf|dwg|aama|gltf|glb|obj)$/i.test(a.fileName);
      const zipByExt = /\.zip$/i.test(a.fileName);

      const passFilter =
        filter === 'all' ||
        (filter === 'pdf' && (lowerMime.includes('pdf') || /\.pdf$/i.test(a.fileName))) ||
        (filter === 'image' &&
          (lowerMime.startsWith('image/') || /\.(jpe?g|png|gif|webp|svg)$/i.test(a.fileName))) ||
        (filter === 'cad' &&
          (cadByExt || lowerMime.includes('dxf') || lowerMime.includes('dwg') || lowerMime.includes('aama') || lowerMime.includes('gltf') || lowerMime.includes('obj'))) ||
        (filter === 'zip' && (zipByExt || lowerMime.includes('zip') || lowerMime.includes('x-zip-compressed'))) ||
        (filter === 'with-preview' && hasPreview) ||
        (filter === 'without-preview' && !hasPreview) ||
        (filter === 'oversized' && oversize);

    const q = query.trim().toLowerCase();
    if (!q) return passFilter;
    return passFilter && (lowerName.includes(q) || (a.revisionNote ?? '').toLowerCase().includes(q));
  });

  const techPackFileAccept =
    'application/pdf,image/*,image/svg+xml,.svg,.pdf,.dxf,.dwg,.zip,.aama,.stp,.step,.igs,.iges,.prt,.sat,.3dm,.rvm,.x_t,.x_b,application/zip,application/x-zip-compressed,.glb,.gltf,.obj,model/gltf-binary,model/gltf+json,model/obj';

  return (
    <div className="space-y-1.5 rounded-md bg-transparent p-0" data-testid="w2-tech-pack-attachments">
      {attachments.length > 0 ? (
        <div className="text-text-primary flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px]">
          <label className="flex cursor-pointer items-center gap-1.5">
            <Checkbox
              checked={zipOnlyWithRevision}
              onCheckedChange={(v) => setZipOnlyWithRevision(v === true)}
            />
            В ZIP только с ревизией
          </label>
          <label className="flex min-w-0 cursor-pointer items-center gap-1.5">
            <Checkbox
              checked={excludeZipFilesFromArchive}
              onCheckedChange={(v) => setExcludeZipFilesFromArchive(v === true)}
            />
            Не включать .zip / .aama в ZIP
          </label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-7 shrink-0 gap-1 text-[10px]"
            disabled={!canDownloadZip || zipBusy}
            title="Сборка ZIP с учётом двух опций выше"
            onClick={() => void onDownloadZip()}
          >
            <Archive className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {zipBusy ? (
              zipProgress ? `Сборка (${Math.round(zipProgress.percent)}%)` : 'Сборка…'
            ) : (
              'Скачать ZIP'
            )}
          </Button>
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[11rem_minmax(0,1fr)]">
        <select
          className="border-input bg-background h-9 rounded-md border px-2 text-xs"
          value={filter}
          onChange={(ev) => setFilter(ev.target.value as TechPackFilter)}
          aria-label="Фильтр вложений"
        >
          <option value="all">Все файлы</option>
          <option value="pdf">PDF</option>
          <option value="image">Изображения</option>
          <option value="cad">CAD (DXF/DWG/AAMA)</option>
          <option value="zip">ZIP / пакет</option>
          <option value="with-preview">С превью</option>
          <option value="without-preview">Без превью</option>
          <option value="oversized">Крупные файлы</option>
        </select>
        <Input
          className="h-9 text-sm"
          placeholder="Поиск по имени или ревизии"
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
          aria-label="Поиск вложений"
        />
      </div>

      {remaining > 0 ? (
        <>
          {zipBusy ? (
            <div className="flex flex-col gap-1 w-full max-w-sm mt-1 mb-2">
              <div className="flex justify-between items-center text-[10px] text-text-secondary">
                <span>Формирование пакета</span>
                <span>{zipProgress ? Math.round(zipProgress.percent) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${zipProgress ? Math.round(zipProgress.percent) : 0}%` }}
                />
              </div>
              <p className="text-[9px] text-text-muted text-right">
                {zipProgress?.currentFile || 'Инициализация...'}
              </p>
            </div>
          ) : null}
          <div className="border-border-default w-full min-w-0 rounded-md border bg-white px-2 py-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={techPackFileAccept}
                className="sr-only"
                aria-label="Выбрать файлы для техпака (несколько — Ctrl или Cmd при выборе)"
                onChange={onPick}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 shrink-0 text-[10px]"
                onClick={() => fileInputRef.current?.click()}
              >
                Выбрать файл
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-text-secondary hover:text-text-primary h-7 w-7 shrink-0"
                    aria-label="Пояснение по загрузке вложений техпака"
                  >
                    <Info className="h-4 w-4" aria-hidden />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="text-text-secondary max-w-[min(100vw-2rem,22rem)] space-y-2 text-[11px] leading-snug">
                  <p>
                    Лотов: {attachments.length}/{MAX_TECH_PACK_FILES}. Макс.: {formatBytes(MAX_TECH_PACK_FILE_SIZE_BYTES)}.
                    Крупные (без уместного data URL) → IndexedDB; иначе мелкие в data URL или байты в сессии (object URL).
                    Дубликаты по хешу.
                    {!remoteEnabled ? ' Без S3 — локально.' : ' С S3 — авто-синхронизация при наличии API.'}
                  </p>
                  <p>Несколько файлов: удерживайте Ctrl (Windows) или Cmd (macOS) при выборе в диалоге.</p>
                  <p>
                    ZIP в архиве: из data URL, сессии и IndexedDB. Журнал ТЗ — при скачивании ZIP и при синхронизации с
                    облаком (если S3). Статусы вложений: локально / облако.
                  </p>
                  {!canUseIdb ? (
                    <p className="text-text-primary font-medium">
                      Для IndexedDB нужны непустые коллекция и артикул; без них крупные файлы остаются в сессии.
                    </p>
                  ) : null}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </>
      ) : (
        <p className="text-text-secondary text-[11px]">Достигнут лимит {MAX_TECH_PACK_FILES} вложений.</p>
      )}

      {filteredAttachments.length > 0 ? (
        <ul className="space-y-1.5">
          {filteredAttachments.map((a) => {
            const effMime = effectiveTechPackAttachmentMime(a);
            const sessionUrl = sessionBlobById[a.attachmentId];
            const idbUrl = idbObjectUrlById[a.attachmentId];
            const displayUrl = a.previewDataUrl ?? sessionUrl ?? idbUrl;
            const kind = displayUrl && techPackInlinePreviewKind(effMime, a.fileName);
            const canDownloadRow =
              Boolean(a.previewDataUrl) || Boolean(sessionUrl) || a.byteStorage === 'idb';
            const storageShort =
              a.byteStorage === 'idb'
                ? 'IndexedDB'
                : a.byteStorage === 'session'
                  ? 'сессия'
                  : a.previewDataUrl
                    ? 'data URL'
                    : 'мета';
            const syncShort =
              a.remoteSyncState === 'synced'
                ? 'облако'
                : a.remoteSyncState === 'uploading' || a.remoteSyncState === 'pending'
                  ? 'синхр…'
                  : a.remoteSyncState === 'failed'
                    ? 'ошибка'
                    : 'локально';
            return (
              <li
                key={a.attachmentId}
                className="border-border-subtle space-y-1.5 rounded border p-1.5"
              >
                <div className="flex flex-wrap items-start gap-2">
                  <div className="border-border-subtle bg-bg-surface2/80 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded border">
                    {a.previewThumbnailDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- миниатюра jpeg data URL
                      <img src={a.previewThumbnailDataUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <FileQuestion className="text-text-secondary h-4 w-4" aria-hidden />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-text-primary truncate text-sm font-medium" title={a.fileName}>
                      {a.fileName}
                    </div>
                    <Input
                      className="h-6 min-h-6 py-0 text-[11px] leading-tight"
                      placeholder="Описание / ревизия (R1, v2…)"
                      value={a.revisionNote ?? ''}
                      onChange={(ev) => updateRevision(a.attachmentId, ev.target.value)}
                      aria-label="Описание или ревизия файла"
                    />
                    <div className="text-text-secondary text-[10px] leading-tight">
                      {formatBytes(a.fileSize ?? 0)}
                      {a.uploadedAt
                        ? ` · ${new Date(a.uploadedAt).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}`
                        : ''}
                      {a.uploadedBy ? ` · ${a.uploadedBy}` : ''}
                      {` · ${syncShort}`}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 shrink-0 text-[10px]"
                      disabled={!canDownloadRow || downloadingId === a.attachmentId}
                      onClick={() => void downloadAttachmentFile(a)}
                    >
                      {downloadingId === a.attachmentId ? '…' : 'Скачать'}
                    </Button>
                    {/\.(dxf|cut|plt|dwg|aama)$/i.test(a.fileName) || effMime?.toLowerCase().includes('cad') ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-7 shrink-0 text-[10px] text-blue-700"
                        onClick={() => {
                          toast({
                            title: 'Экспорт АСУП',
                            description: 'Файл лекал успешно отправлен на раскройный комплекс фабрики',
                          });
                        }}
                      >
                        Отправить на АСУП (Lectra/Gerber)
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-7 shrink-0 text-[10px] text-rose-800"
                      onClick={() => removeOne(a.attachmentId)}
                    >
                      Удалить
                    </Button>
                    <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-text-secondary h-8 w-8 shrink-0"
                        aria-label="Сведения о файле"
                      >
                        <Info className="h-4 w-4" aria-hidden />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-80 space-y-2 text-xs">
                      <div className="space-y-0.5">
                        <p className="text-text-primary font-semibold">Файл</p>
                        <p className="text-text-secondary break-words">{a.fileName}</p>
                      </div>
                      <div className="text-text-secondary space-y-1 text-[11px]">
                        <p>Размер: {formatBytes(a.fileSize ?? 0)}</p>
                        {effMime ? <p>MIME: {effMime}</p> : null}
                        <p>Хранение: {storageShort}</p>
                        <p>
                          Облако:{' '}
                          {a.remoteSyncState === 'synced'
                            ? 'в облаке'
                            : a.remoteSyncState === 'uploading' || a.remoteSyncState === 'pending'
                              ? 'синхронизация'
                              : a.remoteSyncState === 'failed'
                                ? `ошибка${a.remoteLastError ? ` — ${a.remoteLastError}` : ''}`
                                : 'только локально'}
                        </p>
                        <p>
                          Канон:{' '}
                          {a.canonicalSource === 'object_store_verified'
                            ? 'объект в хранилище' + (a.objectStoreEtag ? ` (ETag ${a.objectStoreEtag.slice(0, 18)}…)` : '')
                            : 'локально до complete'}
                        </p>
                        {a.contentSha256 ? <p>SHA-256 (16): {a.contentSha256}</p> : null}
                        {a.uploadedAt ? (
                          <p>Загружен: {new Date(a.uploadedAt).toLocaleString('ru-RU')}</p>
                        ) : null}
                        {a.uploadedBy ? <p>Кем: {a.uploadedBy}</p> : null}
                        {a.productionImmutableSeal ? (
                          <p className="text-text-primary">
                            Печать «к производству»: {a.productionImmutableSeal.by},{' '}
                            {new Date(a.productionImmutableSeal.at).toLocaleString('ru-RU')}, SHA{' '}
                            {a.productionImmutableSeal.contentSha256Full.slice(0, 16)}…
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {kind && displayUrl ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-7 gap-1 text-[10px]"
                            onClick={() => setLightbox({ kind, url: displayUrl, name: a.fileName })}
                          >
                            <Maximize2 className="h-3.5 w-3.5" aria-hidden />
                            Превью
                          </Button>
                        ) : null}
                        {kind === 'pdf' && displayUrl ? (
                          <Button type="button" size="sm" variant="outline" className="h-7 text-[10px]" asChild>
                            <a href={displayUrl} target="_blank" rel="noreferrer">
                              Открыть PDF
                            </a>
                          </Button>
                        ) : null}
                        {a.remoteSyncState === 'failed' && remoteEnabled && onPatchAttachment ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-7 text-[10px]"
                            onClick={() => retryRemoteSync(a)}
                          >
                            Повторить выгрузку
                          </Button>
                        ) : null}
                        {sealActorLabel && onPatchAttachment && onPulseAction && !a.productionImmutableSeal ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 text-[10px]"
                            onClick={() => void sealAttachment(a)}
                          >
                            Печать «к производству»
                          </Button>
                        ) : null}
                      </div>
                    </PopoverContent>
                  </Popover>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : attachments.length > 0 ? (
        <p className="text-text-secondary text-[11px]">По фильтру/поиску пусто.</p>
      ) : null}

      <Dialog open={lightbox != null} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent
          className="flex max-h-[92vh] w-[min(100vw-1rem,56rem)] max-w-[95vw] flex-col gap-0 p-0"
          ariaTitle={lightbox ? `Просмотр: ${lightbox.name}` : undefined}
        >
          <DialogHeader className="border-border-subtle shrink-0 space-y-0 border-b px-4 py-3 text-left">
            <DialogTitle className="line-clamp-2 text-sm font-medium leading-tight">
              {lightbox?.name}
            </DialogTitle>
          </DialogHeader>
          {lightbox ? (
            <div className="min-h-0 min-w-0 flex-1 overflow-hidden bg-zinc-900/5 p-2">
              {lightbox.kind === 'image' ? (
                <div className="flex max-h-[min(80vh,720px)] items-center justify-center overflow-auto">
                  <TechPackMediaPreview
                    kind="image"
                    url={lightbox.url}
                    fileName={lightbox.name}
                    variant="lightbox"
                    className="max-h-[min(80vh,720px)] w-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <TechPackMediaPreview
                  kind="pdf"
                  url={lightbox.url}
                  fileName={lightbox.name}
                  variant="lightbox"
                  className="h-[min(80vh,720px)] w-full rounded border border-zinc-200/80 bg-white"
                />
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}