'use client';

import { Button } from '@/components/ui/button';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';
import { W2_PASSPORT_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-passport-check';
import { W2_VISUAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-visual-section-warnings';
import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-anchors';
import { W2_CONSTRUCTION_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-construction-dossier-anchors';

type Props = {
  passportPct: number;
  passportGatesOpen: number;
  visualGatesOpen: number;
  materialPct: number;
  materialGatesOpen: number;
  /** Готовность секции «Конструкция» по каталогу. */
  constructionPct: number;
  altDrafts: number;
  deltaDrafts: number;
  costingRows: number;
  onJump: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
};

/**
 * Единая ролевая сводка «контур ~9/10»: агрегирует уже посчитанные гейты и персистентные черновики.
 */
export function Workshop2DossierNineClosureSummary({
  passportPct,
  passportGatesOpen,
  visualGatesOpen,
  materialPct,
  materialGatesOpen,
  constructionPct,
  altDrafts,
  deltaDrafts,
  costingRows,
  onJump,
}: Props) {
  return (
    <div
      id="w2-dossier-nine-closure-summary"
      className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50/90 to-white px-3 py-2.5 shadow-sm"
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        Сводка контура (локально)
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-100 bg-white/90 px-2.5 py-2 text-[11px]">
          <p className="font-semibold text-slate-800">Паспорт</p>
          <p className="mt-0.5 tabular-nums text-slate-600">
            {passportPct}% · открытых гейтов: {passportGatesOpen}
          </p>
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0">
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-indigo-700"
              onClick={() => onJump('general', W2_PASSPORT_SUBPAGE_ANCHORS.hub)}
            >
              К хабу паспорта
            </Button>
            {passportGatesOpen > 0 ? (
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-[10px] font-semibold text-amber-800"
                onClick={() => onJump('general', W2_PASSPORT_SUBPAGE_ANCHORS.audit)}
              >
                Аудит
              </Button>
            ) : null}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-slate-700"
              onClick={() => onJump('general', W2_PASSPORT_SUBPAGE_ANCHORS.denseView)}
            >
              w2view
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-slate-700"
              onClick={() => onJump('general', W2_PASSPORT_SUBPAGE_ANCHORS.readOnly)}
            >
              Read-only
            </Button>
          </div>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white/90 px-2.5 py-2 text-[11px]">
          <p className="font-semibold text-slate-800">Визуал / эскиз</p>
          <p className="mt-0.5 tabular-nums text-slate-600">Открытых пунктов: {visualGatesOpen}</p>
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0">
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-indigo-700"
              onClick={() => onJump('visuals', 'w2-visuals-hub')}
            >
              К визуалу
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-violet-800"
              onClick={() => onJump('construction', W2_VISUALS_SKETCH_ANCHOR_ID)}
            >
              Скетч
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-slate-700"
              onClick={() => onJump('visuals', W2_VISUAL_SUBPAGE_ANCHORS.sketchLinkFields)}
            >
              Связи
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-slate-700"
              onClick={() => onJump('construction', W2_VISUAL_SUBPAGE_ANCHORS.sketchTemplates)}
            >
              Шаблоны
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-slate-700"
              onClick={() => onJump('visuals', W2_VISUAL_SUBPAGE_ANCHORS.canonVersion)}
            >
              Канон
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-slate-700"
              onClick={() => onJump('visuals', W2_VISUAL_SUBPAGE_ANCHORS.handoff)}
            >
              Handoff
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-slate-700"
              onClick={() => onJump('visuals', W2_VISUAL_SUBPAGE_ANCHORS.sketchExportSurfaces)}
            >
              Печать / мерч
            </Button>
          </div>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white/90 px-2.5 py-2 text-[11px]">
          <p className="font-semibold text-slate-800">Материалы / BOM</p>
          <p className="mt-0.5 tabular-nums text-slate-600">
            {materialPct}% · открытых гейтов: {materialGatesOpen}
          </p>
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0">
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-indigo-700"
              onClick={() => onJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.hub)}
            >
              К материалам
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-amber-900"
              onClick={() => onJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.supplyDrafts)}
            >
              Снабжение
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-slate-700"
              onClick={() => onJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsDelta)}
            >
              Дельта
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-slate-700"
              onClick={() => onJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.factoryExport)}
            >
              Фабрика CSV
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-slate-700"
              onClick={() => onJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsAlts)}
            >
              Альтернативы
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-slate-700"
              onClick={() => onJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.compliance)}
            >
              Комплаенс
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-slate-700"
              onClick={() => onJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.supplyDraftsCosting)}
            >
              Costing
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-slate-700"
              onClick={() => onJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.bomNorms)}
            >
              Нормы
            </Button>
          </div>
        </div>
        <div className="rounded-lg border border-purple-100 bg-purple-50/40 px-2.5 py-2 text-[11px]">
          <p className="font-semibold text-slate-800">Конструкция</p>
          <p className="mt-0.5 tabular-nums text-slate-600">{constructionPct}% по каталогу</p>
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0">
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-purple-800"
              onClick={() => onJump('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.hub)}
            >
              Хаб ТЗ
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-purple-800"
              onClick={() => onJump('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.contour)}
            >
              Контур
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-purple-800"
              onClick={() => onJump('construction', 'w2-measurements-fields')}
            >
              Мерки
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-purple-800"
              onClick={() => onJump('construction', W2_VISUALS_SKETCH_ANCHOR_ID)}
            >
              Скетч
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-purple-800"
              onClick={() => onJump('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.export)}
            >
              ТК / выгрузка
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[10px] font-semibold text-purple-800"
              onClick={() => onJump('construction', W2_CONSTRUCTION_SUBPAGE_ANCHORS.signoff)}
            >
              Подпись
            </Button>
          </div>
        </div>
        <div className="rounded-lg border border-violet-100 bg-violet-50/50 px-2.5 py-2 text-[11px] sm:col-span-2 lg:col-span-4">
          <p className="font-semibold text-violet-950">Черновики в досье</p>
          <p className="mt-0.5 text-violet-900/90">
            Альтернативы: {altDrafts} · дельта BOM: {deltaDrafts} · costing-строк: {costingRows}
          </p>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-[10px] font-semibold text-violet-800"
            onClick={() => onJump('material', W2_MATERIAL_SUBPAGE_ANCHORS.supplyDrafts)}
          >
            К таблицам снабжения / дельты / costing
          </Button>
        </div>
      </div>
    </div>
  );
}
