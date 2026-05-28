'use client';

import type { Dispatch, SetStateAction } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Workshop2DossierPersistButton } from '@/components/brand/production/Workshop2DossierPersistButton';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { WORKSHOP_HINT_TOOLTIP_CLASS } from '@/components/brand/production/workshop2-phase1-dossier-panel-ui-constants';
import { useToast } from '@/hooks/use-toast';
import type { Workshop2AttrComment } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';
import { W2_CONSTRUCTION_CAD_DEFER_ID } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import { W2_CONSTRUCTION_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-construction-dossier-anchors';
import { Workshop2ConstructionCadZipReadinessStrip } from '@/components/brand/production/Workshop2ConstructionCadZipReadinessStrip';
import { Workshop2TechPackAttachmentsBlock } from '@/components/brand/production/Workshop2TechPackAttachmentsBlock';
import type {
  Workshop2Phase1TechPackAttachment,
  Workshop2TzActionLogPayload,
} from '@/lib/production/workshop2-dossier-phase1.types';

export function Workshop2DossierConstructionCadBlock({
  collectionId,
  articleId,
  skuDraft,
  techPackSessionBlobById,
  setTechPackSessionBlobById,
  techPackAttachments,
  onTechPackAttachmentsChange,
  onPatchTechPackAttachment,
  onJournalLine,
  onPulseAction,
  sealActorLabel,
  cadZipReadiness,
  showDeferCommentUi,
  deferredAttrIds,
  toggleDeferAttribute,
  openAttrComments,
  attrCommentsById,
  categoryLeafId,
  currentLeaf,
  onGenerateMeasurements,
}: {
  collectionId: string;
  articleId: string;
  skuDraft: string;
  techPackSessionBlobById: Record<string, string>;
  setTechPackSessionBlobById: Dispatch<SetStateAction<Record<string, string>>>;
  techPackAttachments: Workshop2Phase1TechPackAttachment[];
  onTechPackAttachmentsChange: (next: Workshop2Phase1TechPackAttachment[]) => void;
  onPatchTechPackAttachment: (
    id: string,
    patch: Partial<Workshop2Phase1TechPackAttachment>
  ) => void;
  onJournalLine: (line: string) => void;
  onPulseAction: (action: Workshop2TzActionLogPayload) => void;
  sealActorLabel: string;
  cadZipReadiness: {
    techPackCount: number;
    techPackWithBytes: number;
    nextZipBytesStepLabel: string | null;
  };
  showDeferCommentUi: boolean;
  deferredAttrIds: ReadonlySet<string>;
  toggleDeferAttribute: (attributeId: string) => void;
  openAttrComments: (attributeId: string) => void;
  attrCommentsById: Record<string, Workshop2AttrComment[] | undefined>;
  categoryLeafId?: string;
  currentLeaf?: any;
  onGenerateMeasurements?: () => void;
}) {
  const cadCommentCount = attrCommentsById[W2_CONSTRUCTION_CAD_DEFER_ID]?.length ?? 0;
  const { toast } = useToast();

  const handleCadValidation = () => {
    toast({
      title: 'Интеграция с САПР',
      description:
        'Автоматическая валидация лекал отключена. Требуется API интеграция с системой САПР (Gerber/Lectra/CLO3D).',
      variant: 'destructive',
    });
  };

  const handleGenerateMeasurements = () => {
    toast({
      title: 'Интеграция с САПР',
      description:
        'Извлечение мерок из лекал недоступно. Требуется API интеграция с системой САПР.',
      variant: 'destructive',
    });
  };

  return (
    <div
      id={W2_CONSTRUCTION_SUBPAGE_ANCHORS.patternFiles}
      className="border-border-default order-30 scroll-mt-24 space-y-3 rounded-xl border bg-white p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <LucideIcons.FileStack className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <h2 className="text-text-primary text-base font-semibold">
                  Лекала и фабричный CAD
                </h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-text-secondary hover:text-text-primary inline-flex h-4 w-4 items-center justify-center rounded-full"
                      aria-label="Пояснение по блоку лекал и CAD"
                    >
                      <LucideIcons.Info className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className={WORKSHOP_HINT_TOOLTIP_CLASS}>
                    <p>
                      Редактора лекал внутри нет: работаем через файлы. Для просмотра удобнее PDF,
                      CAD-исходники (DXF/AAMA и др.) идут как вложения.
                    </p>
                    <p>
                      До 10 файлов, до 25&nbsp;MB каждый. Дубликаты режутся по хешу; крупные файлы
                      хранятся локально (IndexedDB/сессия), с S3 включается синхронизация.
                    </p>
                    <p>
                      ZIP собирается из всех локальных источников, экспорт пишется в журнал. Для
                      цеха — один пакет по артикулу; фото/сканы лекал храните как отдельные
                      визуальные вложения, не как CAD-файлы.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-text-secondary text-[11px] leading-snug">
                PDF/CAD, ZIP для цеха, контроль готовности к отправке. Связь со скетчем и
                материалами — через якоря «Конструкция»; крупные файлы — локально или S3 по
                настройке окружения.
              </p>
            </div>
            {showDeferCommentUi ? (
              <div className="flex shrink-0 items-center gap-1 pl-1">
                <label
                  className="text-text-muted hover:text-text-primary flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold"
                  title="Отложенное заполнение сохраняется только в браузере (для команды бренда)"
                >
                  <Checkbox
                    checked={deferredAttrIds.has(W2_CONSTRUCTION_CAD_DEFER_ID)}
                    onCheckedChange={() => toggleDeferAttribute(W2_CONSTRUCTION_CAD_DEFER_ID)}
                    className="border-border-default h-3.5 w-3.5 shrink-0"
                    aria-label={
                      deferredAttrIds.has(W2_CONSTRUCTION_CAD_DEFER_ID)
                        ? 'Снять отложенное заполнение'
                        : 'Заполнить позже (только для бренда)'
                    }
                  />
                  <span className="hidden sm:inline">Позже (лок.)</span>
                </label>
                <button
                  type="button"
                  className="text-text-muted hover:text-text-primary flex h-8 items-center px-1.5 text-[10px] font-semibold"
                  onClick={() => openAttrComments(W2_CONSTRUCTION_CAD_DEFER_ID)}
                >
                  Комментарий
                  {cadCommentCount > 0 ? (
                    <span className="ml-1 inline-flex min-w-4 items-center justify-center rounded-full bg-amber-100 px-1 text-[9px] font-bold text-amber-700">
                      {cadCommentCount}
                    </span>
                  ) : null}
                </button>
              </div>
            ) : null}
          </div>
          <Workshop2ConstructionCadZipReadinessStrip
            techPackCount={cadZipReadiness.techPackCount}
            techPackWithBytes={cadZipReadiness.techPackWithBytes}
            nextZipBytesStepLabel={cadZipReadiness.nextZipBytesStepLabel}
          />
        </div>
      </div>
      <Workshop2TechPackAttachmentsBlock
        collectionId={collectionId}
        articleId={articleId}
        sessionBlobById={techPackSessionBlobById}
        setSessionBlobById={setTechPackSessionBlobById}
        attachments={techPackAttachments}
        onChange={onTechPackAttachmentsChange}
        onPatchAttachment={onPatchTechPackAttachment}
        onJournalLine={onJournalLine}
        onPulseAction={onPulseAction}
        sealActorLabel={sealActorLabel}
        zipFileNameStem={skuDraft}
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-slate-200 text-[11px] text-slate-600 hover:bg-slate-50 hover:text-slate-800"
          onClick={handleCadValidation}
        >
          <LucideIcons.ScanSearch className="mr-1.5 h-3.5 w-3.5" />
          Валидация лекал (САПР)
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-slate-200 text-[11px] text-slate-600 hover:bg-slate-50 hover:text-slate-800"
          onClick={handleGenerateMeasurements}
        >
          <LucideIcons.Ruler className="mr-1.5 h-3.5 w-3.5" />
          Извлечь табель мер
        </Button>
      </div>
    </div>
  );
}
