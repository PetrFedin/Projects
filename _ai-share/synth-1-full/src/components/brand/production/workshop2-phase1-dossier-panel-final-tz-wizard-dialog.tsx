'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { WORKSHOP_HINT_TOOLTIP_CLASS } from '@/components/brand/production/workshop2-phase1-dossier-panel-ui-constants';

export function Workshop2FinalTzWizardDialog({
  open,
  onOpenChange,
  exportLanguage,
  onExportLanguageChange,
  finalTzSpecDocumentHtml,
  phase1DossierJsonUtf8Bytes,
  tzWriteDisabled,
  onDownloadHtml,
  onPrintPdf,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exportLanguage: 'ru' | 'ru_en' | 'ru_zh';
  onExportLanguageChange: (lang: 'ru' | 'ru_en' | 'ru_zh') => void;
  finalTzSpecDocumentHtml: string;
  phase1DossierJsonUtf8Bytes: number;
  tzWriteDisabled: boolean;
  onDownloadHtml: () => void;
  onPrintPdf: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) setStep(0);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(720px,92vh)] max-w-3xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-border-default shrink-0 border-b px-4 py-3 pr-12 text-left">
          <DialogTitle className="text-base">Итоговое ТЗ — один документ</DialogTitle>
          <DialogDescription className="text-xs">
            Шаг {step + 1} из 3: оглавление и порядок разделов → предпросмотр → выгрузка.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {step === 0 ? (
            <div className="space-y-3 text-sm">
              <p className="text-text-secondary text-xs leading-snug">
                Один последовательный HTML по артикулу: паспорт, визуал, материалы, конструкция,
                вложения, подписи секций, передача. Для печати в PDF используйте системный диалог —
                кириллица сохраняется.
              </p>
              <p className="text-text-muted text-[11px] leading-snug">
                Про <strong className="text-text-primary">канон tech pack на S3</strong> и отличие
                от предпросмотра HTML — одна подсказка в блоке «Фиксация пакета для фабрики» на
                вкладке «Задание» (после закрытия мастера).
              </p>
              <div>
                <p className="text-text-primary mb-1 text-xs font-semibold">Оглавление</p>
                <ol className="text-text-secondary list-decimal space-y-1 pl-5 text-xs leading-snug">
                  <li>Паспорт</li>
                  <li>Визуал</li>
                  <li>Материалы</li>
                  <li>Конструкция</li>
                  <li>Вложения tech pack</li>
                  <li>Подписи секций и передача в производство (одна таблица)</li>
                </ol>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="text-text-primary mb-2 text-xs font-semibold">
                  Язык экспорта (Bilingual Bundle)
                </p>
                <div className="flex items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                    <input
                      type="radio"
                      name="exportLang"
                      value="ru"
                      checked={exportLanguage === 'ru'}
                      onChange={() => onExportLanguageChange('ru')}
                    />
                    <span>Русский</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                    <input
                      type="radio"
                      name="exportLang"
                      value="ru_en"
                      checked={exportLanguage === 'ru_en'}
                      onChange={() => onExportLanguageChange('ru_en')}
                    />
                    <span>Русский + Английский</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                    <input
                      type="radio"
                      name="exportLang"
                      value="ru_zh"
                      checked={exportLanguage === 'ru_zh'}
                      onChange={() => onExportLanguageChange('ru_zh')}
                    />
                    <span>Русский + Китайский</span>
                  </label>
                </div>
                <p className="text-text-muted mt-2 text-[10px] leading-snug">
                  В двуязычном режиме все заголовки и ключевые термины будут продублированы
                  (переведены на выбранный язык).
                </p>
              </div>
            </div>
          ) : null}
          {step === 1 ? (
            <div className="space-y-2">
              <p className="text-text-secondary text-xs">Предпросмотр (как в скачанном файле).</p>
              <iframe
                title="Предпросмотр итогового ТЗ"
                className="border-border-default h-[min(420px,50vh)] w-full rounded-md border bg-white"
                srcDoc={finalTzSpecDocumentHtml}
              />
            </div>
          ) : null}
          {step === 2 ? (
            <div className="space-y-3 text-sm">
              <p className="text-text-secondary text-xs leading-snug">
                Скачайте HTML или откройте печать и сохраните как PDF. При праве редактирования
                производства метка последнего экспорта и запись в журнале ТЗ сохраняются в досье.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <Button type="button" size="sm" className="text-xs" onClick={onDownloadHtml}>
                        Скачать HTML
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className={WORKSHOP_HINT_TOOLTIP_CLASS}>
                    <p className="max-w-xs text-xs">
                      Файл формируется в браузере.{' '}
                      {tzWriteDisabled
                        ? 'Запись метки экспорта в досье и строка в журнале ТЗ недоступны без права «Редактировать производство» (production:edit).'
                        : 'При текущих правах после скачивания метка экспорта и запись в журнале ТЗ сохраняются в досье.'}
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={onPrintPdf}
                      >
                        Печать / PDF…
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className={WORKSHOP_HINT_TOOLTIP_CLASS}>
                    <p className="max-w-xs text-xs">
                      В диалоге печати выберите «Сохранить как PDF».{' '}
                      {tzWriteDisabled
                        ? 'Запись экспорта в досье — только с production:edit.'
                        : 'После печати метка экспорта может быть сохранена в досье (как для HTML).'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ) : null}
        </div>
        <DialogFooter className="border-border-default shrink-0 gap-2 border-t px-4 py-3 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => onOpenChange(false)}
          >
            Закрыть
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Назад
            </Button>
            <Button
              type="button"
              size="sm"
              className="text-xs"
              disabled={step >= 2}
              onClick={() => setStep((s) => Math.min(2, s + 1))}
            >
              Далее
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
