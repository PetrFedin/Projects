'use client';

import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function Workshop2DesignerManifestoBlock({
  brandNotes,
  onBrandNotesChange,
  onSaveDraft,
}: {
  brandNotes?: string;
  onBrandNotesChange: (value: string) => void;
  onSaveDraft: () => void;
}) {
  return (
    <div id="w2-attr-brandNotes" className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <LucideIcons.Sparkles className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-text-primary text-base font-semibold">Дизайнерский замысел</h2>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="w2-brand-manifesto" className="sr-only">
          Текст дизайнерского замысла
        </Label>
        <Textarea
          id="w2-brand-manifesto"
          rows={2}
          className="h-[52px] resize-none overflow-y-auto text-sm"
          placeholder="Какой образ нужно защитить в посадке, производстве и ОТК."
          value={brandNotes ?? ''}
          onChange={(e) => onBrandNotesChange(e.target.value)}
        />
      </div>
      <div className="border-border-subtle flex flex-wrap items-center justify-end gap-2 border-t pt-3">
        <Button
          type="button"
          className="h-9 px-3 text-xs font-semibold"
          title="Записать досье в этом браузере (то же действие, что и «Сохранить» внизу страницы)."
          onClick={onSaveDraft}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
}
