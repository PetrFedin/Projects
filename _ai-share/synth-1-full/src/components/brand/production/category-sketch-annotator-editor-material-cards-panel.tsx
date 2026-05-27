'use client';

import type { MutableRefObject, RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { MAX_SKETCH_MATERIAL_CARDS_PER_BOARD } from '@/lib/production/workshop2-sketch-sheets';
import type { Workshop2SketchMaterialCard } from '@/lib/production/workshop2-dossier-phase1.types';

export type CategorySketchAnnotatorEditorMaterialCardsPanelProps = {
  readOnly: boolean;
  dataMaterialCards: Workshop2SketchMaterialCard[];
  activeMaterialCardId: string | null;
  setActiveMaterialCardId: (id: string | null) => void;
  setActiveId: (id: string | null) => void;
  pendingMaterialCardImageId: MutableRefObject<string | null>;
  materialCardFileInputRef: RefObject<HTMLInputElement | null>;
  bomLinePickOptions: readonly { value: string; label: string }[];
  updateMaterialCard: (
    id: string,
    patch:
      | Partial<Workshop2SketchMaterialCard>
      | ((c: Workshop2SketchMaterialCard) => Partial<Workshop2SketchMaterialCard>)
  ) => void;
  removeMaterialCard: (id: string) => void;
};

export function CategorySketchAnnotatorEditorMaterialCardsPanel({
  readOnly,
  dataMaterialCards,
  activeMaterialCardId,
  setActiveMaterialCardId,
  setActiveId,
  pendingMaterialCardImageId,
  materialCardFileInputRef,
  bomLinePickOptions,
  updateMaterialCard,
  removeMaterialCard,
}: CategorySketchAnnotatorEditorMaterialCardsPanelProps) {
  return (
    <details className="rounded-xl border border-teal-100 bg-teal-50/25 shadow-sm">
      <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-medium text-teal-950 [&::-webkit-details-marker]:hidden">
        Карточки материала на доске ({dataMaterialCards.length}/
        {MAX_SKETCH_MATERIAL_CARDS_PER_BOARD})
      </summary>
      <div className="space-y-3 border-t border-teal-100/80 bg-white p-3">
        <p className="text-[11px] leading-snug text-slate-600">
          Смотки ткани, подклада, фурнитуры на подложке — видно, какой материал к изделию подобран.
          Кнопка «+ материал», затем клик по картинке. Выделите карточку на доске — стрелки сдвигают
          позицию.
        </p>
        {dataMaterialCards.length === 0 ? (
          <p className="text-xs text-slate-500">
            Пока нет карточек. Включите «+ материал» и кликните по эскизу.
          </p>
        ) : (
          <ul className="space-y-3">
            {dataMaterialCards.map((card) => (
              <li
                key={card.cardId}
                className={cn(
                  'rounded-lg border p-2',
                  activeMaterialCardId === card.cardId
                    ? 'border-teal-400 bg-teal-50/40'
                    : 'border-slate-200 bg-slate-50/80'
                )}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Карточка
                  </span>
                  {!readOnly ? (
                    <div className="flex flex-wrap gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={() => {
                          setActiveMaterialCardId(card.cardId);
                          setActiveId(null);
                        }}
                      >
                        На доске
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-[10px]"
                        onClick={() => {
                          pendingMaterialCardImageId.current = card.cardId;
                          materialCardFileInputRef.current?.click();
                        }}
                      >
                        <Upload className="size-3" aria-hidden />
                        Фото
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[10px] text-rose-700"
                        onClick={() => removeMaterialCard(card.cardId)}
                      >
                        Удалить
                      </Button>
                    </div>
                  ) : null}
                </div>
                <label className="mb-2 block space-y-1">
                  <span className="text-[10px] font-medium text-slate-600">Подпись</span>
                  <Input
                    className="h-8 text-xs"
                    value={card.caption ?? ''}
                    disabled={readOnly}
                    placeholder="Напр. основная ткань R439"
                    onChange={(ev) => updateMaterialCard(card.cardId, { caption: ev.target.value })}
                  />
                </label>
                {bomLinePickOptions.length > 0 ? (
                  <label className="mb-2 block space-y-1">
                    <span className="text-[10px] font-medium text-slate-600">
                      Строка BOM / материал
                    </span>
                    <select
                      className="border-border-default h-8 w-full rounded-md border bg-white px-2 text-xs disabled:opacity-60"
                      disabled={readOnly}
                      value={card.linkedBomLineRef ?? ''}
                      onChange={(ev) =>
                        updateMaterialCard(card.cardId, {
                          linkedBomLineRef: ev.target.value || undefined,
                        })
                      }
                    >
                      <option value="">— не привязано —</option>
                      {bomLinePickOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                <label className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-medium text-slate-600">Ширина, % поля</span>
                  <Input
                    type="number"
                    min={6}
                    max={44}
                    className="h-8 w-20 text-xs"
                    disabled={readOnly}
                    value={Math.round(card.widthPct ?? 12)}
                    onChange={(ev) => {
                      const n = Number(ev.target.value);
                      if (Number.isNaN(n)) return;
                      updateMaterialCard(card.cardId, { widthPct: n });
                    }}
                  />
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}
