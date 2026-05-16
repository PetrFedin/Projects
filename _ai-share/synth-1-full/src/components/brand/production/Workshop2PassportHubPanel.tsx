'use client';

import { useCallback, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  passportHubHeaderTitleClass,
  type Workshop2PassportHubModel,
  type WorkshopPassportTzPhase,
} from '@/lib/production/workshop2-passport-check';
import {
  workshop2DossierViewUiCaps,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';

type Props = {
  model: Workshop2PassportHubModel;
  skuDraft: string;
  nameDraft: string;
  internalArticleCodeDisplay: string;
  categoryPathLabel?: string;
  onNavigate: (anchorId: string) => void;
  showPostSignoffDrift: boolean;
  onLogPostSignoffReminder: () => void;
  pulseLoggedReminder: boolean;
  onPulseLoggedReminder: () => void;
  tzWriteDisabled?: boolean;
  tzPhase?: WorkshopPassportTzPhase;
  onJumpToVisualSection?: () => void;
  onJumpToMaterialSection?: () => void;
  onJumpToMaterialMatTable?: () => void;
  onJumpToSketchLineRefs?: () => void;
  onJumpToConstructionContour?: () => void;
  onJumpToQcRoute?: () => void;
  dossierViewProfile?: Workshop2DossierViewProfile;
  passportCriticalAuditSummaries?: readonly { id: string; messages: readonly string[] }[];
  readOnlyShareUrl?: string | null;
  sketchLinkedBomRefs?: readonly string[];
  matSketchBomGapRefs?: readonly string[];
};

export function Workshop2PassportHubPanel({
  model,
  skuDraft,
  nameDraft,
  internalArticleCodeDisplay,
  categoryPathLabel,
  onNavigate,
  showPostSignoffDrift,
  onLogPostSignoffReminder,
  pulseLoggedReminder,
  onPulseLoggedReminder,
  tzWriteDisabled = false,
  tzPhase = '1',
  onJumpToVisualSection,
  onJumpToMaterialSection,
  onJumpToMaterialMatTable,
  onJumpToSketchLineRefs,
  onJumpToConstructionContour,
  onJumpToQcRoute,
  dossierViewProfile = 'full',
  passportCriticalAuditSummaries: _passportCriticalAuditSummaries = [],
  readOnlyShareUrl = null,
  sketchLinkedBomRefs = [],
  matSketchBomGapRefs = [],
}: Props) {
  const { toast } = useToast();

  const copySkuName = useCallback(async () => {
    const sku = skuDraft.trim() || '—';
    const name = nameDraft.trim() || '—';
    const text = `SKU: ${sku}\nНазвание: ${name}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Скопировано', description: 'SKU и рабочее название в буфере.' });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  }, [nameDraft, skuDraft, toast]);

  const copyReadOnlyLink = useCallback(async () => {
    const raw = readOnlyShareUrl?.trim();
    if (!raw) return;
    const url =
      raw.startsWith('http://') || raw.startsWith('https://')
        ? raw
        : typeof window !== 'undefined'
          ? `${window.location.origin}${raw.startsWith('/') ? raw : `/${raw}`}`
          : raw;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Ссылка скопирована', description: 'Режим только просмотра.' });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  }, [readOnlyShareUrl, toast]);

  const copyCard = useCallback(async () => {
    const lines = [
      'Карточка артикула (кратко)',
      `Внутр. №: ${internalArticleCodeDisplay}`,
      `SKU: ${skuDraft.trim() || '—'}`,
      `Название: ${nameDraft.trim() || '—'}`,
      categoryPathLabel ? `Категория: ${categoryPathLabel}` : null,
      '',
      `Паспорт: ≈ ${model.combinedPct}% (старт ${model.startPct}%, рынок/коды ${model.preSamplePct}%)`,
    ].filter(Boolean) as string[];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast({ title: 'Карточка в буфере' });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  }, [
    categoryPathLabel,
    internalArticleCodeDisplay,
    model.combinedPct,
    model.preSamplePct,
    model.startPct,
    nameDraft,
    skuDraft,
    toast,
  ]);

  const doneCp = model.checkpoints.filter((c) => c.done).length;
  const totalCp = model.checkpoints.length;

  const passCaps = useMemo(
    () => workshop2DossierViewUiCaps(dossierViewProfile),
    [dossierViewProfile]
  );

  const showMatSketchRibbon = useMemo(() => {
    return passCaps.passportSketchBomRefsRibbon && sketchLinkedBomRefs.length > 0;
  }, [passCaps.passportSketchBomRefsRibbon, sketchLinkedBomRefs.length]);

  const showMatSketchGapRibbon = useMemo(() => {
    return passCaps.passportMatSketchGapRibbon && matSketchBomGapRefs.length > 0;
  }, [passCaps.passportMatSketchGapRibbon, matSketchBomGapRefs.length]);

  return (
    <div
      id="w2-passport-hub"
      className="scroll-mt-24 space-y-2 rounded-lg bg-white/90 p-3 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-2 text-sm font-semibold leading-tight">
            <span className={passportHubHeaderTitleClass(model)}>Паспорт</span>
            {tzPhase !== '1' ? (
              <span className="text-text-muted text-[9px] font-semibold">Шаг {tzPhase}</span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="h-8 gap-1 text-[10px]">
                <LucideIcons.Copy className="h-3 w-3" aria-hidden />
                Копировать
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 text-xs">
              <DropdownMenuItem className="text-xs" onClick={() => void copySkuName()}>
                SKU и название
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs" onClick={() => void copyCard()}>
                Карточка в буфер
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showPostSignoffDrift ? (
        <div className="rounded-md border border-amber-200 bg-amber-50/90 px-2.5 py-2 text-[10px] text-amber-950">
          <p className="font-semibold">Досье менялось после подписи ТЗ</p>
          <p className="mt-0.5 leading-snug">Согласуйте повторное подтверждение или зафиксируйте версию.</p>
          {!pulseLoggedReminder ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-1.5 h-8 text-[10px]"
              disabled={tzWriteDisabled}
              onClick={() => {
                onLogPostSignoffReminder();
                onPulseLoggedReminder();
              }}
            >
              Записать в журнал
            </Button>
          ) : (
            <p className="mt-1 text-[9px] text-amber-800/90">Напоминание уже в сессии.</p>
          )}
        </div>
      ) : null}

      {showMatSketchGapRibbon ? (
        <div
          id="w2-passport-mat-sketch-gap"
          className="scroll-mt-24 rounded-md border border-amber-200 bg-amber-50/90 px-2.5 py-2 text-[10px] text-amber-950"
        >
          <p className="font-semibold">Скетч ↔ mat: ref не в строках</p>
          <p className="mt-0.5 font-mono text-[9px] leading-relaxed">
            {matSketchBomGapRefs.slice(0, 6).join(' · ')}
            {matSketchBomGapRefs.length > 6 ? ` · +${matSketchBomGapRefs.length - 6}` : ''}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {onJumpToMaterialSection ? (
              <Button type="button" variant="outline" size="sm" className="h-8 text-[10px]" onClick={onJumpToMaterialSection}>
                Mat
              </Button>
            ) : null}
            {onJumpToMaterialMatTable ? (
              <Button type="button" variant="secondary" size="sm" className="h-8 text-[10px]" onClick={onJumpToMaterialMatTable}>
                Таблица
              </Button>
            ) : null}
            {(onJumpToSketchLineRefs ?? onJumpToVisualSection) ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 text-[10px]"
                onClick={onJumpToSketchLineRefs ?? onJumpToVisualSection}
              >
                Скетч
              </Button>
            ) : null}
            {onJumpToConstructionContour ? (
              <Button type="button" variant="outline" size="sm" className="h-8 text-[10px]" onClick={onJumpToConstructionContour}>
                Контур
              </Button>
            ) : null}
            {onJumpToQcRoute ? (
              <Button type="button" variant="outline" size="sm" className="h-8 text-[10px]" onClick={onJumpToQcRoute}>
                ОТК
              </Button>
            ) : null}
          </div>
        </div>
      ) : showMatSketchRibbon ? (
        <div
          id="w2-passport-sketch-bom-refs"
          className="scroll-mt-24 rounded-md border border-blue-200/80 bg-blue-50/60 px-2.5 py-2 text-[10px] text-blue-950"
        >
          <p className="font-semibold">Bom-ref на скетче</p>
          <p className="mt-0.5 font-mono text-[9px]">
            {sketchLinkedBomRefs.length} · {sketchLinkedBomRefs.slice(0, 6).join(' · ')}
            {sketchLinkedBomRefs.length > 6 ? '…' : ''}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {onJumpToVisualSection ? (
              <Button type="button" variant="outline" size="sm" className="h-8 text-[10px]" onClick={onJumpToVisualSection}>
                Скетч
              </Button>
            ) : null}
            {onJumpToMaterialSection ? (
              <Button type="button" variant="secondary" size="sm" className="h-8 text-[10px]" onClick={onJumpToMaterialSection}>
                Mat
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <p className="text-text-secondary text-[10px] leading-snug">
        Чек-лист: {doneCp}/{totalCp}
        {model.gateItems.length > 0 ? ` · гейтов: ${model.gateItems.length}` : ''}.
        {readOnlyShareUrl ? (
          <>
            {' '}
            <button
              type="button"
              className="text-accent-primary font-semibold underline-offset-2 hover:underline"
              onClick={() => void copyReadOnlyLink()}
            >
              Ссылка для цеха
            </button>
            .
          </>
        ) : null}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {onJumpToVisualSection ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-[10px]"
            onClick={onJumpToVisualSection}
          >
            Визуал
          </Button>
        ) : null}
        {onJumpToMaterialSection ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-[10px]"
            onClick={onJumpToMaterialSection}
          >
            Bom
          </Button>
        ) : null}
      </div>
    </div>
  );
}
