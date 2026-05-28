'use client';

import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SECTION_LABEL_BY_ID } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import { cn } from '@/lib/utils';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

export function Workshop2DossierPanelFooterActions({
  onBack,
  onPreviousStep,
  isPhase1,
  isPhase3,
  activeSection,
  saveDraft,
  runHandbookCheck,
  handbookCheckClean,
  showFooterTzSignoffShortcut,
  allSectionSignoffPairsDone,
  allTzDigitalSignoffsDone,
  jumpToTzSignoffsAreaFooter,
  handleContinue,
}: {
  onBack?: (() => void) | undefined;
  onPreviousStep?: (() => void) | undefined;
  isPhase1: boolean;
  isPhase3: boolean;
  activeSection: Workshop2TzSignoffSectionKey;
  saveDraft: () => void;
  runHandbookCheck: () => void;
  handbookCheckClean: boolean;
  showFooterTzSignoffShortcut: boolean;
  allSectionSignoffPairsDone: boolean;
  allTzDigitalSignoffsDone: boolean;
  jumpToTzSignoffsAreaFooter: () => void;
  handleContinue: () => void;
}) {
  return (
    <div className="border-border-subtle flex min-h-[2.25rem] flex-col gap-2 border-t pt-3">
      <div className="flex w-full flex-wrap items-center gap-y-2">
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {onBack ? (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="h-9 gap-1.5 px-3 text-xs"
            >
              <LucideIcons.ChevronLeft className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              Назад
            </Button>
          ) : onPreviousStep ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => onPreviousStep()}
              className="h-9 gap-1.5 px-3 text-xs"
            >
              <LucideIcons.ChevronLeft className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              {isPhase3 ? 'Шаг 2' : 'Шаг 1'}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            onClick={saveDraft}
            className="h-9 gap-1.5 px-3 text-xs"
          >
            Сохранить
          </Button>
        </div>
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2 px-2">
          <Button
            type="button"
            variant="outline"
            onClick={runHandbookCheck}
            className={cn(
              'h-9 text-xs font-semibold transition-colors',
              handbookCheckClean
                ? 'w-9 border-emerald-400 bg-emerald-50 p-0 text-emerald-700 shadow-sm hover:bg-emerald-100'
                : 'px-3'
            )}
            title={
              handbookCheckClean
                ? 'Проверено — нажмите, чтобы перепроверить раздел'
                : `Проверить только раздел «${SECTION_LABEL_BY_ID[activeSection]}»`
            }
          >
            {handbookCheckClean ? (
              <LucideIcons.CircleCheck className="h-5 w-5 shrink-0" aria-hidden />
            ) : (
              'Проверить'
            )}
          </Button>
          {showFooterTzSignoffShortcut ? (
            <Button
              type="button"
              variant="outline"
              className={cn(
                'h-9 text-xs font-semibold transition-colors',
                (isPhase1 ? allSectionSignoffPairsDone : allTzDigitalSignoffsDone)
                  ? 'w-9 border-emerald-400 bg-emerald-50 p-0 text-emerald-700 shadow-sm ring-2 ring-emerald-300/50 hover:bg-emerald-100'
                  : 'gap-1.5 px-3'
              )}
              title={
                isPhase1
                  ? allSectionSignoffPairsDone
                    ? 'Все четыре секции подписаны брендом и технологом'
                    : 'Перейти к подтверждению секций ТЗ'
                  : allTzDigitalSignoffsDone
                    ? 'Все подписи проставлены'
                    : 'Перейти к подписям ТЗ'
              }
              onClick={jumpToTzSignoffsAreaFooter}
            >
              {isPhase1 ? (
                allSectionSignoffPairsDone ? (
                  <LucideIcons.FileCheck2 className="h-5 w-5 shrink-0" aria-hidden />
                ) : (
                  <>
                    <LucideIcons.BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    Секции
                  </>
                )
              ) : allTzDigitalSignoffsDone ? (
                <LucideIcons.FileCheck2 className="h-5 w-5 shrink-0" aria-hidden />
              ) : (
                <>
                  <LucideIcons.BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Подписи
                </>
              )}
            </Button>
          ) : null}
        </div>
        <div className="ml-auto flex shrink-0 items-center">
          <Button
            type="button"
            onClick={handleContinue}
            className="h-9 gap-1.5 px-3 text-xs font-medium"
          >
            {isPhase3 ? 'Готово >' : 'Следующее >'}
          </Button>
        </div>
      </div>
    </div>
  );
}
