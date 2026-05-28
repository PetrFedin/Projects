'use client';

import { useCallback, useEffect, useState } from 'react';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type {
  Workshop2SampleEconomicsDraft,
  Workshop2SampleEconomicsLineCategory,
  Workshop2SampleEconomicsLineItem,
} from '@/lib/production/workshop2-sample-economics.types';
import { WORKSHOP2_SAMPLE_ECONOMICS_LINE_CATEGORY_LABELS } from '@/lib/production/workshop2-sample-economics.types';
import {
  computeSampleEconomicsDraftTotal,
  computeSampleEconomicsLaborHoursTotal,
  emptyWorkshop2SampleEconomicsDraft,
} from '@/lib/production/workshop2-sample-economics';
import {
  emptyWorkshop2DossierPhase1,
  getWorkshop2Phase1Dossier,
  setWorkshop2Phase1Dossier,
} from '@/lib/production/workshop2-phase1-dossier-storage';

function newLineId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `eco_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const field =
  'flex h-8 w-full rounded-md border border-border-default bg-white px-2 text-[12px] text-text-primary shadow-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary';

function withEconomicsPatch(
  dossier: Workshop2DossierPhase1,
  patch: Partial<Workshop2SampleEconomicsDraft>
): Workshop2DossierPhase1 {
  const prev = dossier.sampleEconomicsDraft ?? emptyWorkshop2SampleEconomicsDraft();
  return {
    ...dossier,
    sampleEconomicsDraft: { ...prev, ...patch },
    updatedAt: new Date().toISOString(),
    updatedBy: 'article-supply-sample-economics',
  };
}

const CATEGORIES = Object.keys(
  WORKSHOP2_SAMPLE_ECONOMICS_LINE_CATEGORY_LABELS
) as Workshop2SampleEconomicsLineCategory[];

export function Workshop2SampleEconomicsDraftPanel() {
  const { ref, dataMode, loading } = useArticleWorkspace();
  const [dossier, setDossier] = useState<Workshop2DossierPhase1 | null>(null);

  const reloadDossier = useCallback(() => {
    setDossier(getWorkshop2Phase1Dossier(ref.collectionId, ref.articleId) ?? null);
  }, [ref.articleId, ref.collectionId]);

  useEffect(() => {
    if (loading) return;
    reloadDossier();
  }, [loading, reloadDossier]);

  const persist = useCallback(
    (next: Workshop2DossierPhase1) => {
      setDossier(next);
      setWorkshop2Phase1Dossier(ref.collectionId, ref.articleId, next);
    },
    [ref.articleId, ref.collectionId]
  );

  const patchEconomics = useCallback(
    (patch: Partial<Workshop2SampleEconomicsDraft>) => {
      const base =
        getWorkshop2Phase1Dossier(ref.collectionId, ref.articleId) ?? emptyWorkshop2DossierPhase1();
      persist(withEconomicsPatch(base, patch));
    },
    [persist, ref.articleId, ref.collectionId]
  );

  if (!dossier) {
    return (
      <div className="border-border-default rounded-xl border border-dashed bg-white p-4 shadow-sm">
        <div className="space-y-3">
          <p className="text-text-primary text-sm font-semibold">Экономика образца (план)</p>
          <p className="text-text-secondary text-[11px] leading-snug">
            Досье ТЗ для артикула ещё не найдено в этом браузере. Откройте вкладку «ТЗ» и сохраните
            досье — затем нажмите «Проверить снова».
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 h-8 text-xs"
            onClick={reloadDossier}
          >
            Проверить снова
          </Button>
        </div>
      </div>
    );
  }

  const draft = dossier.sampleEconomicsDraft ?? emptyWorkshop2SampleEconomicsDraft();
  const tl = draft.timeline ?? {};
  const total = computeSampleEconomicsDraftTotal(draft);
  const laborH = computeSampleEconomicsLaborHoursTotal(draft);
  const cur = draft.currencyCode ?? 'RUB';

  const setLine = (id: string, part: Partial<Workshop2SampleEconomicsLineItem>) => {
    patchEconomics({
      lines: draft.lines.map((l) => (l.id === id ? { ...l, ...part } : l)),
    });
  };

  return (
    <div className="border-border-default mt-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm">
            <LucideIcons.CircleDollarSign className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-text-primary text-base font-semibold">Экономика образца (план)</h2>
            <p className="text-text-secondary text-[11px] leading-snug">
              Плановые расходы, труд и сроки по сэмплу. Таможенная стоимость и Incoterms — в
              паспорте, в «Карточке артикула».
            </p>
          </div>
        </div>
        <span className="border-border-default bg-bg-surface2 text-text-secondary shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px]">
          {dataMode === 'http' ? 'API' : 'local'}
        </span>
      </div>

      <div className="border-border-subtle mt-4 flex flex-col gap-1.5 border-t border-dotted pt-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="bg-bg-surface2/70 text-text-primary border-border-subtle rounded border px-2 py-1 text-[10px] font-semibold">
            <span className="text-text-muted font-bold">Итого оценка:</span>{' '}
            {total.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} {cur}
          </span>
          {laborH > 0 ? (
            <span className="text-text-primary border-border-subtle rounded border bg-white px-2 py-1 text-[10px] font-semibold">
              <span className="text-text-muted font-bold">Σ труд, ч:</span>{' '}
              {laborH.toLocaleString('ru-RU', { maximumFractionDigits: 1 })}
            </span>
          ) : null}
          <div className="ml-auto flex items-center gap-1">
            <span className="text-text-muted text-[10px] font-semibold tracking-wide">Валюта:</span>
            <Input
              className="h-6 w-16 bg-white px-1 text-[10px]"
              value={draft.currencyCode ?? 'RUB'}
              onChange={(e) =>
                patchEconomics({ currencyCode: e.target.value.slice(0, 8) || 'RUB' })
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b pb-2">
            <p className="text-text-primary flex items-center gap-1.5 text-sm font-semibold">
              <LucideIcons.Calculator className="h-4 w-4 text-slate-400" />
              Дополнительные расходы и маржа
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            <label className="space-y-0.5 text-[10px]">
              <span className="text-text-muted font-semibold">Логистика</span>
              <Input
                type="number"
                className={cn(field, 'h-8')}
                value={draft.logisticsCost != null ? String(draft.logisticsCost) : ''}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  patchEconomics({ logisticsCost: v === '' ? undefined : Number(v) });
                }}
                placeholder="0"
              />
            </label>
            <label className="space-y-0.5 text-[10px]">
              <span className="text-text-muted font-semibold">Таможня</span>
              <Input
                type="number"
                className={cn(field, 'h-8')}
                value={draft.customsCost != null ? String(draft.customsCost) : ''}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  patchEconomics({ customsCost: v === '' ? undefined : Number(v) });
                }}
                placeholder="0"
              />
            </label>
            <label className="space-y-0.5 text-[10px]">
              <span className="text-text-muted font-semibold">Переделки</span>
              <Input
                type="number"
                className={cn(field, 'h-8')}
                value={draft.reworkCost != null ? String(draft.reworkCost) : ''}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  patchEconomics({ reworkCost: v === '' ? undefined : Number(v) });
                }}
                placeholder="0"
              />
            </label>
            <label className="space-y-0.5 text-[10px]">
              <span className="text-text-muted font-semibold">Целевая маржа (%)</span>
              <Input
                type="number"
                className={cn(field, 'h-8')}
                value={draft.marginTracking != null ? String(draft.marginTracking) : ''}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  patchEconomics({ marginTracking: v === '' ? undefined : Number(v) });
                }}
                placeholder="0"
              />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-text-muted text-[10px] font-bold tracking-widest">Сроки (черновик)</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <label className="space-y-0.5 text-[10px]">
              <span className="text-text-muted font-semibold">Образец / пилот</span>
              <Input
                type="date"
                className={cn(field, 'h-8')}
                value={(tl.targetSampleOrPilotIso ?? '').slice(0, 10)}
                onChange={(e) =>
                  patchEconomics({
                    timeline: { ...tl, targetSampleOrPilotIso: e.target.value || undefined },
                  })
                }
              />
            </label>
            <label className="space-y-0.5 text-[10px]">
              <span className="text-text-muted font-semibold">Дедлайн КП</span>
              <Input
                type="date"
                className={cn(field, 'h-8')}
                value={(tl.quoteDeadlineIso ?? '').slice(0, 10)}
                onChange={(e) =>
                  patchEconomics({
                    timeline: { ...tl, quoteDeadlineIso: e.target.value || undefined },
                  })
                }
              />
            </label>
            <label className="space-y-0.5 text-[10px]">
              <span className="text-text-muted font-semibold">Сырьё на площадке</span>
              <Input
                type="date"
                className={cn(field, 'h-8')}
                value={(tl.materialsOnSiteIso ?? '').slice(0, 10)}
                onChange={(e) =>
                  patchEconomics({
                    timeline: { ...tl, materialsOnSiteIso: e.target.value || undefined },
                  })
                }
              />
            </label>
          </div>
          <Textarea
            className={cn(field, 'min-h-[48px] py-2 text-[11px]')}
            value={tl.timelineNotes ?? ''}
            onChange={(e) =>
              patchEconomics({
                timeline: { ...tl, timelineNotes: e.target.value || undefined },
              })
            }
            placeholder="Связка с договором, КП, параллельными закупками…"
          />
        </div>

        <div className="space-y-2">
          <div className="border-border-subtle flex flex-wrap items-center justify-between gap-2 border-b pb-2">
            <p className="text-text-primary flex items-center gap-1.5 text-sm font-semibold">
              <LucideIcons.ListChecks className="h-4 w-4 text-slate-400" />
              Строки затрат
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 border-indigo-200 text-[11px] text-indigo-600 hover:bg-indigo-50"
                onClick={() => {
                  const model = dossier.productionModel;
                  if (!model) return;

                  const matLines = model.materialLines.map((m) => ({
                    id: newLineId(),
                    label: m.materialName || 'Материал без названия',
                    category: 'material' as const,
                    qty: m.yieldPerUnit || 1,
                    unitLabel: m.yieldUnit || 'м',
                    unitCost: m.landedCost || m.unitCostNet || 0,
                    sourceHint: 'tz_bom_reference' as const,
                  }));

                  const trimLines = model.trimLines.map((t) => ({
                    id: newLineId(),
                    label: t.name || 'Фурнитура',
                    category: 'other' as const,
                    qty: t.quantity || 1,
                    unitLabel: 'шт',
                    unitCost: t.unitCostNet || 0,
                    sourceHint: 'tz_bom_reference' as const,
                  }));

                  const opsLines = model.operations.map((o) => ({
                    id: newLineId(),
                    label: o.name || 'Операция пошива',
                    category: 'labor' as const,
                    qty: 1,
                    unitLabel: 'сэмпл',
                    unitCost: o.costPerUnit || 0,
                    laborHours: o.sash ? Number((o.sash / 60).toFixed(2)) : undefined,
                    sourceHint: 'tz_bom_reference' as const,
                  }));

                  const newLines = [...matLines, ...trimLines, ...opsLines];
                  if (newLines.length > 0) {
                    patchEconomics({
                      lines: [...draft.lines, ...newLines],
                    });
                  }
                }}
              >
                <LucideIcons.Download className="mr-1 h-3.5 w-3.5" />
                Синхронизировать с BOM
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() =>
                  patchEconomics({
                    lines: [
                      ...draft.lines,
                      {
                        id: newLineId(),
                        label: '',
                        category: 'material',
                        qty: 0,
                        unitLabel: 'шт',
                      },
                    ],
                  })
                }
              >
                <LucideIcons.Plus className="mr-1 h-3.5 w-3.5" />
                Добавить строку
              </Button>
            </div>
          </div>
          {draft.lines.length === 0 ? (
            <p className="text-text-secondary text-[11px] italic">
              Добавьте позиции вручную или синхронизируйте из BOM (материалы, фурнитура,
              техпроцесс).
            </p>
          ) : (
            <ul className="space-y-2">
              {draft.lines.map((line) => (
                <li
                  key={line.id}
                  className="border-border-subtle bg-bg-surface2/60 grid gap-2 rounded-md border p-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_repeat(4,minmax(0,5rem))_auto]"
                >
                  <Input
                    className="h-8 text-[11px] lg:col-span-1"
                    value={line.label}
                    onChange={(e) => setLine(line.id, { label: e.target.value })}
                    placeholder="Наименование"
                  />
                  <select
                    className={cn(field, 'h-8 text-[11px]')}
                    value={line.category}
                    onChange={(e) =>
                      setLine(line.id, {
                        category: e.target.value as Workshop2SampleEconomicsLineCategory,
                      })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {WORKSHOP2_SAMPLE_ECONOMICS_LINE_CATEGORY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                  <Input
                    className="h-8 text-[11px]"
                    value={Number.isFinite(line.qty) ? String(line.qty) : ''}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      const qty = v === '' ? 0 : Number(v);
                      setLine(line.id, { qty: Number.isFinite(qty) ? qty : 0 });
                    }}
                    placeholder="Кол-во"
                  />
                  <Input
                    className="h-8 text-[11px]"
                    value={line.unitLabel}
                    onChange={(e) => setLine(line.id, { unitLabel: e.target.value.slice(0, 32) })}
                    placeholder="Ед."
                  />
                  <Input
                    className="h-8 text-[11px]"
                    value={
                      line.unitCost != null && Number.isFinite(line.unitCost)
                        ? String(line.unitCost)
                        : ''
                    }
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      const unitCost = v === '' ? undefined : Number(v);
                      setLine(line.id, {
                        unitCost: Number.isFinite(unitCost) ? unitCost : undefined,
                      });
                    }}
                    placeholder="Цена ед."
                  />
                  <Input
                    className="h-8 text-[11px]"
                    value={
                      line.laborHours != null && Number.isFinite(line.laborHours)
                        ? String(line.laborHours)
                        : ''
                    }
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      const laborHours = v === '' ? undefined : Number(v);
                      setLine(line.id, {
                        laborHours: Number.isFinite(laborHours) ? laborHours : undefined,
                      });
                    }}
                    placeholder="Часы"
                  />
                  <div className="flex items-center gap-1 lg:col-span-6">
                    <select
                      className={cn(field, 'h-8 max-w-[200px] flex-1 text-[10px]')}
                      value={line.sourceHint ?? 'manual'}
                      onChange={(e) =>
                        setLine(line.id, {
                          sourceHint: e.target
                            .value as Workshop2SampleEconomicsLineItem['sourceHint'],
                        })
                      }
                    >
                      <option value="manual">Источник: вручную</option>
                      <option value="tz_bom_reference">Источник: ориентир по BOM ТЗ</option>
                    </select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 shrink-0 text-red-600"
                      onClick={() =>
                        patchEconomics({ lines: draft.lines.filter((l) => l.id !== line.id) })
                      }
                    >
                      Удалить
                    </Button>
                  </div>
                  <Input
                    className="h-8 text-[11px] lg:col-span-6"
                    value={
                      line.leadTimeDays != null && Number.isFinite(line.leadTimeDays)
                        ? String(line.leadTimeDays)
                        : ''
                    }
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      const leadTimeDays = v === '' ? undefined : Number(v);
                      setLine(line.id, {
                        leadTimeDays: Number.isFinite(leadTimeDays) ? leadTimeDays : undefined,
                      });
                    }}
                    placeholder="Срок позиции, дн."
                  />
                  <Textarea
                    className={cn(field, 'min-h-[40px] py-1.5 text-[11px] lg:col-span-6')}
                    value={line.notes ?? ''}
                    onChange={(e) => setLine(line.id, { notes: e.target.value || undefined })}
                    placeholder="Примечания к строке"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className="block space-y-1">
          <span className="text-text-muted text-[10px] font-semibold tracking-wide">
            Связь с коммерцией ТЗ (без дубля Incoterms)
          </span>
          <Textarea
            className={cn(field, 'min-h-[56px] py-2 text-[11px]')}
            value={draft.tzCommerceLinkNote ?? ''}
            onChange={(e) => patchEconomics({ tzCommerceLinkNote: e.target.value || undefined })}
            placeholder="Например: условия поставки см. паспорт → карточка артикула; здесь только суммы по КП №…"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-text-muted text-[10px] font-semibold tracking-wide">
            Внутренние заметки снабжения
          </span>
          <Textarea
            className={cn(field, 'min-h-[64px] py-2 text-[11px]')}
            value={draft.internalNotes ?? ''}
            onChange={(e) => patchEconomics({ internalNotes: e.target.value || undefined })}
            placeholder="Договорённости, риски по цене, альтернативы…"
          />
        </label>
      </div>
    </div>
  );
}
