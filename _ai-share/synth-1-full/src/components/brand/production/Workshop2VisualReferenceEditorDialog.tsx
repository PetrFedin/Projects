'use client';

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
import { cn } from '@/lib/utils';
import type { Workshop2VisualRefTakeawayAspect } from '@/lib/production/workshop2-dossier-phase1.types';
import { VISUAL_REF_TAKEAWAY_LABELS } from '@/lib/production/workshop2-visual-references-utils';

export function Workshop2VisualReferenceEditorDialog({
  open,
  refEditorId,
  refEditorTitle,
  refEditorDesc,
  refEditorUrl,
  refEditorTakeawayAspects,
  refEditorTakeawayNote,
  refEditorFileInputRef,
  onOpenChange,
  onRefEditorTitleChange,
  onRefEditorDescChange,
  onRefEditorUrlChange,
  onToggleTakeawayAspect,
  onRefEditorTakeawayNoteChange,
  onCancel,
  onSave,
}: {
  open: boolean;
  refEditorId: string | null;
  refEditorTitle: string;
  refEditorDesc: string;
  refEditorUrl: string;
  refEditorTakeawayAspects: Workshop2VisualRefTakeawayAspect[];
  refEditorTakeawayNote: string;
  refEditorFileInputRef: React.RefObject<HTMLInputElement | null>;
  onOpenChange: (open: boolean) => void;
  onRefEditorTitleChange: (value: string) => void;
  onRefEditorDescChange: (value: string) => void;
  onRefEditorUrlChange: (value: string) => void;
  onToggleTakeawayAspect: (aspect: Workshop2VisualRefTakeawayAspect) => void;
  onRefEditorTakeawayNoteChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,640px)] w-[min(96vw,440px)] max-w-none gap-0 overflow-y-auto p-0 sm:rounded-xl">
        <div className="border-border-subtle border-b p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <LucideIcons.Images className="h-4 w-4 shrink-0" aria-hidden />
            </div>
            <DialogHeader className="m-0 flex-1 space-y-1 p-0 text-left">
              <DialogTitle>{refEditorId ? 'Референс' : 'Новый референс'}</DialogTitle>
              <DialogDescription className="text-sm leading-snug">
                Название, пояснение и ссылка — по желанию; фото или видео дадут превью в сетке. Окно
                поверх страницы, как раньше.
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
              onChange={(e) => onRefEditorTitleChange(e.target.value)}
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
              onChange={(e) => onRefEditorDescChange(e.target.value)}
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
              onChange={(e) => onRefEditorUrlChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Что берём с рефа</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(VISUAL_REF_TAKEAWAY_LABELS) as Workshop2VisualRefTakeawayAspect[]).map(
                (aspect) => {
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
                        onChange={() => onToggleTakeawayAspect(aspect)}
                      />
                      {VISUAL_REF_TAKEAWAY_LABELS[aspect]}
                    </label>
                  );
                }
              )}
            </div>
            <Textarea
              className="min-h-[52px] text-sm"
              placeholder="Уточнение решения (необязательно): например «только линия плеча»"
              value={refEditorTakeawayNote}
              onChange={(e) => onRefEditorTakeawayNoteChange(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="w2-vref-editor-file" className="text-xs">
              Файл фото или видео
            </Label>
            <Input
              id="w2-vref-editor-file"
              ref={refEditorFileInputRef as React.Ref<HTMLInputElement>}
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
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="button" size="sm" onClick={onSave}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
