'use client';

import { Fragment } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Workshop2SampleEconomicsDraftPanel } from '@/components/brand/production/Workshop2SampleEconomicsDraftPanel';
import { Workshop2SustainabilityPanel } from '@/components/brand/production/Workshop2SustainabilityPanel';
import { EmptyState } from '@/components/design-system/empty-state';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  W2_ARTICLE_WORKSPACE_TAB_FIELD_CLASS as field,
  newW2ArticleTabPanelRowId as newRowId,
} from '@/components/brand/production/workshop2-article-workspace-tab-panels-shared';
import { WORKSHOP2_SURFACE_BANNER_INLINE_META_CLASS } from '@/lib/production/workshop2-surface-banner-tokens';

/** inline meta uses shared banner token */
export function Workshop2ArticleSupplyPanel({
  dossier = null,
}: {
  dossier?: Workshop2DossierPhase1 | null;
} = {}) {
  const { bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [wastageAllowance, setWastageAllowance] = useState(5);

  const handleAiReplenish = async () => {
    if (!bundle?.supply?.lines?.length) return;
    const supply = bundle.supply;
    const poQuantity =
      bundle.planPo?.purchaseOrders?.reduce((acc, po) => acc + Number(po.qty || 0), 0) || 0;

    setIsSuggesting(true);
    try {
      const res = await fetch('/api/b2b/replenishment/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bomLines: supply.lines.map((l) => ({
            id: l.id,
            label: l.label,
            qty: l.qty,
            unit: l.unit,
            costPerUnit: l.costPerUnit,
          })),
          plannedQuantity: poQuantity,
          wastageAllowance,
        }),
      });
      if (!res.ok) throw new Error('API Error');
      const data = (await res.json()) as {
        suggestions?: Array<{ lineId?: string; suggestedQty?: number }>;
      };

      const newLines = supply.lines.map((line) => {
        const suggestion = data.suggestions?.find((s: any) => s.lineId === line.id);
        if (suggestion && (suggestion.suggestedQty ?? 0) > 0) {
          return { ...line, qty: suggestion.suggestedQty };
        }
        return line;
      });

      void mergeBundle({ supply: { ...supply, lines: newLines } });
    } catch (e) {
      import('@/lib/production/workshop2-dev-log').then((m) =>
        m.workshop2DevWarn('supply', 'suggest qty failed', { cause: e })
      );
    } finally {
      setIsSuggesting(false);
    }
  };

  if (loading || !bundle) {
    return <p className="text-text-secondary text-[12px]">Загрузка…</p>;
  }

  const supply = bundle.supply!;
  const poQuantity =
    bundle.planPo?.purchaseOrders?.reduce((acc, po) => acc + Number(po.qty || 0), 0) || 0;

  const totalCost = supply.lines.reduce(
    (acc, line) => acc + (line.qty || 0) * (line.costPerUnit || 0),
    0
  );

  const blockers = [
    ...(supply.lines.length === 0 ? ['Нет строк BOM.'] : []),
    ...supply.lines
      .filter((line) => line.status === 'ordered' && (line.leadTimeDays ?? 0) > 14)
      .map((line) => `Срок поставки > 14 дней: ${line.label || 'без названия'}`),
  ];

  return (
    <Fragment>
      <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <LucideIcons.Truck className="h-4 w-4 shrink-0" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-text-primary text-base font-semibold">Снабжение и закупка</h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                  Ответственный: Отдел снабжения
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-snug">
                BOM, брони и заметки по закупке; ниже — плановая экономика образца (COGS и сроки),
                без дубля Incoterms из ТЗ.
              </p>
            </div>
          </div>
          <span
            className="border-border-default bg-bg-surface2 text-text-secondary shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px]"
            title={dataMode === 'http' ? 'Данные с API' : 'Локальные данные в браузере'}
          >
            {dataMode === 'http' ? 'API' : 'local'}
          </span>
        </div>
        <div className="border-border-subtle flex flex-col gap-1.5 border-t border-dotted pt-2.5">
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-bg-surface2/70 text-text-primary border-border-subtle max-w-full rounded border px-2 py-1 text-[10px] leading-snug">
              <span className="text-text-muted font-bold">Суть</span> · Строк BOM:{' '}
              {supply.lines.length} · {totalCost.toLocaleString()} ₽
            </span>
            <span className="text-text-primary border-border-subtle max-w-full rounded border bg-white px-2 py-1 text-[10px] font-semibold leading-snug">
              <span className="text-text-muted font-bold">Гот.</span> ·{' '}
              {supply.lines.length === 0
                ? 'Не начато'
                : supply.lines.every((line) => line.status !== 'draft')
                  ? 'BOM собран и подтвержден'
                  : 'Есть черновые позиции'}
            </span>
            <span className="text-accent-primary border-accent-primary/25 bg-accent-primary/8 max-w-full rounded border px-2 py-1 text-[10px] font-semibold leading-snug">
              <span className="font-bold opacity-80">Далее</span> ·{' '}
              {supply.lines.length === 0
                ? 'Добавить основные материалы из ТЗ.'
                : 'Подтвердить поставщика и срок поставки для критичных строк.'}
            </span>
          </div>
          {blockers.length > 0 ? (
            <div className="max-w-full rounded border border-amber-200/80 bg-amber-50/60 px-2 py-1.5">
              <p className="text-[9px] font-bold tracking-wide text-amber-700">Риски</p>
              <ul
                className={cn(
                  'mt-0.5 list-inside list-disc space-y-0.5 pl-0.5',
                  WORKSHOP2_SURFACE_BANNER_INLINE_META_CLASS
                )}
              >
                {blockers.map((blocker) => (
                  <li key={blocker}>{blocker}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="min-w-0 space-y-4">
          {/* Блок: Потребность (из ТЗ) */}
          <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <p className="text-text-primary flex items-center gap-1.5 text-sm font-semibold">
                <LucideIcons.ClipboardList className="h-4 w-4 text-slate-500" />
                Потребность (из ТЗ)
              </p>
              {dossier?.productionModel ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 border-indigo-200 text-[10px] text-indigo-600 hover:bg-indigo-50"
                  onClick={() => {
                    const mats = dossier.productionModel?.materialLines || [];
                    const trims = dossier.productionModel?.trimLines || [];
                    const newLines = [
                      ...mats.map((m: any) => ({
                        id: newRowId(),
                        label: m.materialName || 'Материал без названия',
                        qty: m.yieldPerUnit,
                        unit: m.yieldUnit || 'ед.',
                        status: 'draft' as const,
                        sourceNote: `${m.supplier || ''} ${m.article || ''}`.trim(),
                        costPerUnit: m.unitCostNet,
                        supplyType: m.supplyType,
                        substitutes: m.substitutes,
                      })),
                      ...trims.map((t: any) => ({
                        id: newRowId(),
                        label: t.name || 'Фурнитура без названия',
                        qty: t.quantity,
                        unit: 'шт',
                        status: 'draft' as const,
                        sourceNote: `${t.supplier || ''} ${t.article || ''}`.trim(),
                        costPerUnit: t.unitCostNet,
                        supplyType: t.supplyType,
                        substitutes: t.substitutes,
                      })),
                    ];

                    if (supply.lines.length > 0) {
                      setConflictDialogOpen(true);
                    } else if (newLines.length > 0) {
                      void mergeBundle({
                        supply: {
                          ...supply,
                          lines: [...supply.lines, ...newLines],
                        },
                      });
                    }
                  }}
                >
                  <LucideIcons.Download className="mr-1 h-3.5 w-3.5" />
                  Загрузить BOM из ТЗ
                </Button>
              ) : null}
            </div>

            {supply.lines.length === 0 ? (
              <EmptyState
                title="Потребность не задана"
                description="Добавьте позиции вручную или загрузите BOM из ТЗ."
                icon={<LucideIcons.ClipboardList className="h-10 w-10 stroke-[1.25]" />}
              />
            ) : (
              <ul className="space-y-2">
                {supply.lines.map((line) => (
                  <li
                    key={line.id}
                    className="border-border-subtle flex flex-col gap-2 rounded-md border bg-white p-2 shadow-sm"
                  >
                    <div className="flex w-full items-center gap-2">
                      <div className="flex flex-1 items-center gap-2">
                        <Input
                          className="h-8 flex-1 text-[11px]"
                          value={line.label}
                          onChange={(e) => {
                            const label = e.target.value;
                            void mergeBundle({
                              supply: {
                                ...supply,
                                lines: supply.lines.map((l) =>
                                  l.id === line.id ? { ...l, label } : l
                                ),
                              },
                            });
                          }}
                          placeholder="Материал / позиция"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 shrink-0 px-2 text-[10px] text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                          title="Найти в Библиотеке материалов (/brand/materials)"
                          onClick={() => {}}
                        >
                          <LucideIcons.Library className="mr-1 h-3.5 w-3.5" />
                          Каталог
                        </Button>
                      </div>
                      <Input
                        className="h-8 w-24 text-[11px]"
                        value={line.qty != null ? String(line.qty) : ''}
                        onChange={(e) => {
                          const v = e.target.value.trim();
                          const qty = v === '' ? undefined : Number(v);
                          void mergeBundle({
                            supply: {
                              ...supply,
                              lines: supply.lines.map((l) =>
                                l.id === line.id
                                  ? { ...l, qty: !Number.isNaN(qty) ? qty : undefined }
                                  : l
                              ),
                            },
                          });
                        }}
                        placeholder="Кол-во"
                      />
                      <Input
                        className="h-8 w-16 text-[11px]"
                        value={line.unit ?? ''}
                        onChange={(e) => {
                          const unit = e.target.value;
                          void mergeBundle({
                            supply: {
                              ...supply,
                              lines: supply.lines.map((l) =>
                                l.id === line.id ? { ...l, unit } : l
                              ),
                            },
                          });
                        }}
                        placeholder="Ед"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600"
                        onClick={() =>
                          void mergeBundle({
                            supply: {
                              ...supply,
                              lines: supply.lines.filter((l) => l.id !== line.id),
                            },
                          })
                        }
                        title="Удалить строку"
                      >
                        <LucideIcons.Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex w-full items-center gap-3 rounded border border-slate-100 bg-slate-50 p-1.5">
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="text-[10px] font-medium text-slate-500">Сырье:</span>
                        <select
                          className="h-6 rounded border-slate-200 bg-white px-1 text-[10px]"
                          value={line.supplyType ?? 'factory'}
                          onChange={(e) => {
                            const supplyType = e.target.value as 'brand' | 'factory';
                            void mergeBundle({
                              supply: {
                                ...supply,
                                lines: supply.lines.map((l) =>
                                  l.id === line.id ? { ...l, supplyType } : l
                                ),
                              },
                            });
                          }}
                        >
                          <option value="factory">Фабрики</option>
                          <option value="brand">Бренда (Давальческое)</option>
                        </select>
                      </div>
                      <div className="flex min-w-0 flex-1 items-center gap-1.5">
                        <span className="shrink-0 text-[10px] font-medium text-slate-500">
                          Альтернативы:
                        </span>
                        <Input
                          className="h-6 flex-1 bg-white text-[10px]"
                          value={
                            line.substitutes
                              ?.map((s) => (typeof s === 'string' ? s : s.name))
                              .join(', ') ?? ''
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            const substitutes = val
                              ? val
                                  .split(',')
                                  .map((s) => s.trim())
                                  .filter(Boolean)
                              : undefined;
                            void mergeBundle({
                              supply: {
                                ...supply,
                                lines: supply.lines.map((l) =>
                                  l.id === line.id ? { ...l, substitutes } : l
                                ),
                              },
                            });
                          }}
                          placeholder="Укажите артикулы через запятую"
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() =>
                  void mergeBundle({
                    supply: {
                      ...supply,
                      lines: [
                        ...supply.lines,
                        { id: newRowId(), label: '', status: 'draft' as const },
                      ],
                    },
                  })
                }
              >
                Добавить позицию ТЗ
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 border-indigo-200 text-xs text-indigo-600 hover:bg-indigo-50"
                disabled={isSuggesting}
                onClick={handleAiReplenish}
              >
                <LucideIcons.Sparkles className="mr-1 h-3.5 w-3.5" />
                {isSuggesting ? 'Считаем...' : 'AI Авто-пополнение'}
              </Button>
            </div>
          </div>

          {/* Блок: Фактическая закупка и выбор поставщиков */}
          <div className="mt-4 space-y-4 rounded-xl border border-blue-100 bg-blue-50/30 p-4">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <h3 className="text-text-primary flex items-center gap-1.5 text-sm font-semibold">
                <LucideIcons.ShoppingCart className="h-4 w-4 text-blue-500" />
                Фактическая закупка и выбор поставщиков
              </h3>
              <div className="text-right">
                <span className="text-text-muted text-[10px] font-bold">Итого (BOM): </span>
                <span className="text-accent-primary text-[12px] font-black">
                  {totalCost.toLocaleString()} ₽
                </span>
              </div>
            </div>

            {supply.lines.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-text-muted text-[11px] font-bold tracking-wider">
                  Закупки по BOM
                </h4>
                <ul className="space-y-2">
                  {supply.lines.map((line) => (
                    <VendorConnectSupplyLine
                      key={line.id}
                      line={line}
                      supply={supply}
                      mergeBundle={mergeBundle}
                    />
                  ))}
                </ul>
              </div>
            )}

            <label className="mt-4 block space-y-1">
              <span className="text-text-muted text-[10px] font-semibold tracking-wide">
                Заметка по снабжению
              </span>
              <Textarea
                className="min-h-[64px] resize-none bg-white text-[11px]"
                value={supply.note ?? ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  void mergeBundle({ supply: { ...supply, note: e.target.value } })
                }
                placeholder="VMI, поставщик, особые условия…"
              />
            </label>
          </div>
        </div>
      </div>
      <Workshop2SampleEconomicsDraftPanel />
      {dossier ? (
        <div className="mt-1 space-y-2">
          <Workshop2SustainabilityPanel dossier={dossier} />
        </div>
      ) : null}

      <Dialog open={conflictDialogOpen} onOpenChange={setConflictDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <LucideIcons.AlertTriangle className="h-5 w-5" />
              Конфликт версий ТЗ (Снабжение)
            </DialogTitle>
            <DialogDescription>
              В таблице закупки уже есть созданные позиции. При загрузке новых данных из ТЗ (v
              {dossier?.dossierVersion || 1}) вы можете сохранить текущие позиции снабжения или
              полностью перезаписать их.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Button
              variant="outline"
              className="h-auto w-full justify-start border-indigo-200 px-4 py-3 text-left hover:bg-indigo-50"
              onClick={() => {
                const mats = dossier?.productionModel?.materialLines || [];
                const trims = dossier?.productionModel?.trimLines || [];
                const newLines = [
                  ...mats.map((m: any) => ({
                    id: newRowId(),
                    label: m.materialName || 'Материал без названия',
                    qty: m.yieldPerUnit,
                    unit: m.yieldUnit || 'ед.',
                    status: 'draft' as const,
                    sourceNote: `${m.supplier || ''} ${m.article || ''}`.trim(),
                    costPerUnit: m.unitCostNet,
                    supplyType: m.supplyType,
                    substitutes: m.substitutes,
                  })),
                  ...trims.map((t: any) => ({
                    id: newRowId(),
                    label: t.name || 'Фурнитура без названия',
                    qty: t.quantity,
                    unit: 'шт',
                    status: 'draft' as const,
                    sourceNote: `${t.supplier || ''} ${t.article || ''}`.trim(),
                    costPerUnit: t.unitCostNet,
                    supplyType: t.supplyType,
                    substitutes: t.substitutes,
                  })),
                ];

                void mergeBundle({
                  supply: {
                    ...supply,
                    lines: [...supply.lines, ...newLines],
                  },
                });
                setConflictDialogOpen(false);
              }}
            >
              <div>
                <div className="text-sm font-semibold text-indigo-900">
                  Мягкое слияние (Smart Merge)
                </div>
                <div className="mt-1 whitespace-normal text-xs text-indigo-700/80">
                  Оставить все существующие позиции. Новые потребности из ТЗ будут добавлены в конец
                  списка.
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto w-full justify-start border-rose-200 px-4 py-3 text-left hover:bg-rose-50"
              onClick={() => {
                const mats = dossier?.productionModel?.materialLines || [];
                const trims = dossier?.productionModel?.trimLines || [];
                const newLines = [
                  ...mats.map((m: any) => ({
                    id: newRowId(),
                    label: m.materialName || 'Материал без названия',
                    qty: m.yieldPerUnit,
                    unit: m.yieldUnit || 'ед.',
                    status: 'draft' as const,
                    sourceNote: `${m.supplier || ''} ${m.article || ''}`.trim(),
                    costPerUnit: m.unitCostNet,
                    supplyType: m.supplyType,
                    substitutes: m.substitutes,
                  })),
                  ...trims.map((t: any) => ({
                    id: newRowId(),
                    label: t.name || 'Фурнитура без названия',
                    qty: t.quantity,
                    unit: 'шт',
                    status: 'draft' as const,
                    sourceNote: `${t.supplier || ''} ${t.article || ''}`.trim(),
                    costPerUnit: t.unitCostNet,
                    supplyType: t.supplyType,
                    substitutes: t.substitutes,
                  })),
                ];

                void mergeBundle({
                  supply: {
                    ...supply,
                    lines: newLines,
                  },
                });
                setConflictDialogOpen(false);
              }}
            >
              <div>
                <div className="text-sm font-semibold text-rose-900">
                  Жесткая перезапись (Overwrite)
                </div>
                <div className="mt-1 whitespace-normal text-xs text-rose-700/80">
                  Удалить все текущие позиции и загрузить полностью новый список из актуального ТЗ.
                  Внимание: могут быть утеряны данные о поставщиках!
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

function VendorConnectSupplyLine({
  line,
  supply,
  mergeBundle,
}: {
  line: NonNullable<
    NonNullable<ReturnType<typeof useArticleWorkspace>['bundle']>['supply']
  >['lines'][0];
  supply: NonNullable<NonNullable<ReturnType<typeof useArticleWorkspace>['bundle']>['supply']>;
  mergeBundle: ReturnType<typeof useArticleWorkspace>['mergeBundle'];
}) {
  const { data: stockData, isLoading } = useQuery({
    queryKey: ['vendor-stock', line.vendorItemId],
    queryFn: async () => {
      if (!line.vendorItemId) return null;
      const res = await fetch(`/api/b2b/vendor/item/${line.vendorItemId}`);
      if (!res.ok) throw new Error('Failed to fetch stock');
      return res.json() as Promise<{ inStock: boolean; stockQty: number; leadTimeDays: number }>;
    },
    enabled: !!line.vendorItemId,
    refetchInterval: 30000, // poll every 30s
  });

  return (
    <li className="grid gap-2 rounded-md border border-blue-100 bg-white p-3 shadow-sm sm:grid-cols-[1.5fr_1fr_auto]">
      <div className="min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="text-text-primary truncate text-[11px] font-semibold"
              title={line.label}
            >
              {line.label || 'Без названия'}
            </div>
            {line.supplyType === 'brand' && (
              <span className="shrink-0 rounded border border-purple-200 bg-purple-50 px-1.5 py-0.5 text-[9px] font-medium text-purple-700">
                Давальческое
              </span>
            )}
            {line.vendorItemId && (
              <div className="flex shrink-0 items-center gap-1">
                {isLoading ? (
                  <span className="flex items-center gap-1 text-[9px] text-slate-400">
                    <LucideIcons.Loader2 className="h-3 w-3 animate-spin" /> проверяем...
                  </span>
                ) : stockData ? (
                  stockData.inStock ? (
                    <span className="flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] text-emerald-700">
                      <LucideIcons.CheckCircle2 className="h-3 w-3" />В наличии:{' '}
                      {stockData.stockQty}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[9px] text-rose-700">
                      <LucideIcons.XCircle className="h-3 w-3" />
                      Нет в наличии
                    </span>
                  )
                ) : null}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-6 shrink-0 border-emerald-200 px-2 text-[9px] text-emerald-700 hover:bg-emerald-50"
            title="Связать с системой RFQ / Бронирования"
            onClick={() => {
              // Dummy linking for mock
              const dummyId = `VND-${Math.floor(Math.random() * 10000)}`;
              void mergeBundle({
                supply: {
                  ...supply,
                  lines: supply.lines.map((l) =>
                    l.id === line.id ? { ...l, vendorItemId: dummyId } : l
                  ),
                },
              });
            }}
          >
            <LucideIcons.FileText className="mr-1 h-3 w-3" /> RFQ / Бронь
          </Button>
        </div>
        <Input
          className="h-7 text-[10px]"
          value={line.sourceNote ?? ''}
          onChange={(e) => {
            const sourceNote = e.target.value;
            void mergeBundle({
              supply: {
                ...supply,
                lines: supply.lines.map((l) => (l.id === line.id ? { ...l, sourceNote } : l)),
              },
            });
          }}
          placeholder="Поставщик / артикул поставщика"
        />
        {line.substitutes && line.substitutes.length > 0 && (
          <div className="flex items-center gap-1 text-[9px] text-slate-500">
            <LucideIcons.ArrowRightLeft className="h-3 w-3" />
            Альтернативы:{' '}
            <span className="font-medium text-slate-700">
              {line.substitutes.map((s) => (typeof s === 'string' ? s : s.name)).join(', ')}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1">
          <label className="text-text-muted block text-[9px]">Цена за {line.unit || 'ед.'}</label>
          <Input
            className="h-7 text-[10px]"
            value={line.costPerUnit != null ? String(line.costPerUnit) : ''}
            onChange={(e) => {
              const v = e.target.value.trim();
              const costPerUnit = v === '' ? undefined : Number(v);
              void mergeBundle({
                supply: {
                  ...supply,
                  lines: supply.lines.map((l) =>
                    l.id === line.id
                      ? {
                          ...l,
                          costPerUnit: !Number.isNaN(costPerUnit) ? costPerUnit : undefined,
                        }
                      : l
                  ),
                },
              });
            }}
            placeholder="Цена"
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-text-muted block text-[9px]">Срок (дни)</label>
          <Input
            className="h-7 text-[10px]"
            value={
              stockData?.leadTimeDays != null
                ? String(stockData.leadTimeDays)
                : line.leadTimeDays != null
                  ? String(line.leadTimeDays)
                  : ''
            }
            readOnly={!!stockData}
            title={stockData ? 'Срок поставки синхронизирован с поставщиком' : ''}
            onChange={(e) => {
              if (stockData) return;
              const v = e.target.value.trim();
              const leadTimeDays = v === '' ? undefined : Number(v);
              void mergeBundle({
                supply: {
                  ...supply,
                  lines: supply.lines.map((l) =>
                    l.id === line.id
                      ? {
                          ...l,
                          leadTimeDays: !Number.isNaN(leadTimeDays) ? leadTimeDays : undefined,
                        }
                      : l
                  ),
                },
              });
            }}
            placeholder="Дни"
          />
        </div>
      </div>

      <div className="flex flex-col items-end justify-end gap-1">
        <select
          className={cn(field, 'h-7 w-28 text-[10px]')}
          value={line.status}
          onChange={(e) => {
            const status = e.target.value as (typeof supply.lines)[0]['status'];
            void mergeBundle({
              supply: {
                ...supply,
                lines: supply.lines.map((l) => (l.id === line.id ? { ...l, status } : l)),
              },
            });
          }}
        >
          <option value="draft">черновик</option>
          <option value="ordered">заказано</option>
          <option value="in_transit">в пути</option>
          <option value="at_factory">на фабрике</option>
          <option value="reserved">бронь</option>
          <option value="consumed">списано</option>
        </select>
        {(stockData?.leadTimeDays ?? line.leadTimeDays ?? 0) > 14 && line.status === 'ordered' && (
          <div className="mt-1 flex items-center gap-1 text-[9px] font-black tracking-tighter text-rose-500">
            <LucideIcons.AlertTriangle className="h-2.5 w-2.5" /> Риск: долгий срок
          </div>
        )}
      </div>
    </li>
  );
}
