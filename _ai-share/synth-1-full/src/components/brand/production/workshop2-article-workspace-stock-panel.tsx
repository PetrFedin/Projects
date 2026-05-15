'use client';

import * as LucideIcons from 'lucide-react';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getWorkshop2Phase1Dossier } from '@/lib/production/workshop2-phase1-dossier-storage';
import { Workshop2ArticleSampleIntakeStockSection } from '@/components/brand/production/workshop2-article-workspace-sample-intake-stock-section';
import { EmptyState } from '@/components/design-system/empty-state';
import { useRfidScanner } from '@/components/brand/production/intake/use-rfid-scanner';
import { useState } from 'react';

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

import {
  computeSampleEconomicsDraftTotal,
  emptyWorkshop2SampleEconomicsDraft,
} from '@/lib/production/workshop2-sample-economics';
import { newW2ArticleTabPanelRowId as newRowId } from '@/components/brand/production/workshop2-article-workspace-tab-panels-shared';
import { DataTableContainer } from '@/components/design-system/data-table-container';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function Workshop2ArticleStockPanel({
  dossier = null,
}: {
  dossier?: Workshop2DossierPhase1 | null;
} = {}) {
  const { ref, bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();
  const [reconcileStatus, setReconcileStatus] = useState<string>('');

  const { session, simulateScan } = useRfidScanner(async (epcs) => {
    try {
      const res = await fetch('/api/b2b/intake/reconcile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseOrderId: 'PO-123', epcs })
      });
      if (res.ok) {
        const data = await res.json();
        setReconcileStatus(data.status);
      }
    } catch (e) {
      setReconcileStatus('ERROR');
    }
  }, 500);

  if (loading || !bundle) return <p className="text-text-secondary text-[12px]">Загрузка…</p>;
  const stock = bundle.stock!;
  const dossierForEco = getWorkshop2Phase1Dossier(ref.collectionId, ref.articleId);
  const ecoDraft = dossierForEco?.sampleEconomicsDraft ?? emptyWorkshop2SampleEconomicsDraft();
  const ecoPlanTotal = computeSampleEconomicsDraftTotal(ecoDraft);
  const ecoCurrency = ecoDraft.currencyCode ?? 'RUB';

  const totalQtyOnHand = stock.movements.reduce((acc, m) => {
    if (m.kind === 'in') return acc + m.qty;
    if (m.kind === 'out') return acc - m.qty;
    return acc;
  }, 0);

  const avgUnitCost =
    stock.movements.length > 0
      ? stock.movements.reduce((acc, m) => acc + m.unitCostRub, 0) / stock.movements.length
      : 0;

  return (
    <div className="border-border-default scroll-mt-24 space-y-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LucideIcons.Boxes className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-text-primary text-base font-semibold">Склад и приёмка</h2>
              <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                Ответственный: Заведующий складом
              </span>
            </div>
            <p className="text-text-secondary text-xs leading-snug">
              Приемка образцов, фиксация складских движений и инвентаризация остатков. Поддерживает RFID.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] text-indigo-600 border-indigo-200 hover:bg-indigo-50" asChild>
            <a href="/brand/inventory">
              <LucideIcons.ExternalLink className="h-3.5 w-3.5 mr-1" />
              Основной склад (/brand/inventory)
            </a>
          </Button>
          <span
            className="border-border-default bg-bg-surface2 text-text-secondary shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px]"
          >
            {dataMode === 'http' ? 'API' : 'local'}
          </span>
        </div>
      </div>

      <div className="bg-indigo-50/50 rounded-lg border border-indigo-100 p-3 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LucideIcons.ScanLine className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-[11px] font-semibold text-indigo-900">RFID Scanner Status</p>
              <p className="text-[10px] text-indigo-700">Scanned EPCs: {session.totalScanned}</p>
              {reconcileStatus && <p className="text-[10px] text-indigo-700 font-bold">PO Match: {reconcileStatus}</p>}
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => simulateScan(['A1M001', 'A1M002'])}>
            Simulate Scan Batch
          </Button>
        </div>
      </div>

      <div className="border-border-subtle flex flex-col gap-1.5 border-t border-dotted pt-2.5 mt-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="bg-bg-surface2/70 text-text-primary max-w-full rounded border border-border-subtle px-2 py-1 text-[10px] leading-snug">
            <span className="text-text-muted font-bold">Суть</span> · Движений: {stock.movements.length}
          </span>
          <span className="text-text-primary max-w-full rounded border border-border-subtle bg-white px-2 py-1 text-[10px] font-semibold leading-snug">
            <span className="text-text-muted font-bold">Гот.</span> · Остаток: {totalQtyOnHand.toLocaleString()} ед.
          </span>
        </div>
      </div>

      <div className="min-w-0 space-y-4 mt-4">
        <Workshop2ArticleSampleIntakeStockSection mergeBundle={mergeBundle} dataMode={dataMode} />
          
        <div className="bg-slate-50/50 rounded-lg border border-border-subtle p-3 flex flex-wrap items-center justify-between gap-2 mt-4">
          <div className="min-w-0">
            <p className="text-text-primary text-[11px] font-semibold">
              План образца (из досье)
            </p>
            <p className="text-text-secondary mt-0.5 text-[11px] leading-snug">
              {ecoDraft.lines.length > 0
                ? `Оценка по черновику: ${ecoPlanTotal.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ${ecoCurrency}. Полный ввод — вкладка «Снабжение».`
                : 'Черновик экономики образца не заполнен — ведётся на вкладке «Снабжение» (COGS, труд, сроки).'}
            </p>
          </div>
          <LucideIcons.CircleDollarSign className="text-text-muted h-5 w-5 shrink-0" aria-hidden />
        </div>
      
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="bg-white rounded-lg border border-border-subtle p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-bg-surface2 flex h-8 w-8 items-center justify-center rounded-lg">
                <LucideIcons.Boxes className="text-text-secondary h-4 w-4" />
              </div>
              <div>
                <p className="text-text-muted text-[10px] font-semibold">
                  Текущий остаток
                </p>
                <p className="text-text-primary text-lg font-bold leading-none mt-0.5">
                  {totalQtyOnHand.toLocaleString()} ед.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-border-subtle p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-accent-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <LucideIcons.CircleDollarSign className="text-accent-primary h-4 w-4" />
              </div>
              <div>
                <p className="text-text-muted text-[10px] font-semibold">
                  Средняя себестоимость
                </p>
                <p className="text-text-primary text-lg font-bold leading-none mt-0.5">
                  {avgUnitCost.toLocaleString()} ₽/ед
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border-subtle">
          <div className="flex items-center justify-between border-b pb-2">
            <p className="text-text-primary text-sm font-semibold flex items-center gap-1.5">
              <LucideIcons.ArrowRightLeft className="w-4 h-4 text-slate-400" />
              Движение товара
            </p>
          </div>

        {stock.movements.length === 0 ? (
          <EmptyState
            title="Движений по приёмке на склад не зафиксировано"
            description="Добавьте первую операцию, чтобы отразить поступление товара на склад."
            icon={<LucideIcons.PackageOpen className="h-10 w-10 stroke-[1.25]" />}
          />
        ) : (
          <DataTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Операция</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead className="text-right">Кол-во</TableHead>
                  <TableHead className="text-right">Себестоимость</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stock.movements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="py-2">
                      <Input
                        className="h-8 border-none bg-transparent text-[12px] font-medium focus:bg-white shadow-none px-1 -ml-1"
                        value={m.label}
                        onChange={(e) =>
                          void mergeBundle({
                            stock: {
                              ...stock,
                              movements: stock.movements.map((x) =>
                                x.id === m.id ? { ...x, label: e.target.value } : x
                              ),
                            },
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <select
                        className="h-8 bg-transparent text-[12px] font-medium outline-none rounded-md px-2 hover:bg-bg-surface2 focus:bg-white"
                        value={m.kind}
                        onChange={(e) => {
                          const kind = e.target.value as (typeof stock.movements)[0]['kind'];
                          void mergeBundle({
                            stock: {
                              ...stock,
                              movements: stock.movements.map((x) =>
                                x.id === m.id ? { ...x, kind } : x
                              ),
                            },
                          });
                        }}
                      >
                        <option value="in">Приход</option>
                        <option value="out">Расход</option>
                        <option value="transfer">Перемещение</option>
                      </select>
                    </TableCell>
                    <TableCell className="py-2">
                      <Input
                        className="h-8 w-20 border-none bg-transparent text-right text-[12px] focus:bg-white shadow-none ml-auto px-1 -mr-1"
                        type="number"
                        value={m.qty}
                        onChange={(e) => {
                          const qty = Number(e.target.value);
                          void mergeBundle({
                            stock: {
                              ...stock,
                              movements: stock.movements.map((x) =>
                                x.id === m.id ? { ...x, qty } : x
                              ),
                            },
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <Input
                        className="text-accent-primary h-8 w-24 border-none bg-transparent text-right text-[12px] font-semibold focus:bg-white shadow-none ml-auto px-1 -mr-1"
                        type="number"
                        value={m.unitCostRub}
                        onChange={(e) => {
                          const unitCostRub = Number(e.target.value);
                          void mergeBundle({
                            stock: {
                              ...stock,
                              movements: stock.movements.map((x) =>
                                x.id === m.id ? { ...x, unitCostRub } : x
                              ),
                            },
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-text-muted py-2 font-mono text-[11px]">
                      {m.at.split('T')[0]}
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      {m.kind === 'transfer' ? null : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-text-muted h-8 w-8 hover:text-red-500 hover:bg-red-50"
                          onClick={() => {
                            void mergeBundle({
                              stock: {
                                ...stock,
                                movements: stock.movements.filter((x) => x.id !== m.id),
                              },
                            });
                          }}
                        >
                          <LucideIcons.Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTableContainer>
        )}
        <div className="mt-4 flex">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-medium"
            onClick={() =>
              void mergeBundle({
                stock: {
                  ...stock,
                  movements: [
                    ...stock.movements,
                    {
                      id: newRowId(),
                      label: 'Новая приёмка на склад',
                      at: new Date().toISOString(),
                      kind: 'in' as const,
                      qty: 0,
                      unitCostRub: 0,
                    },
                  ],
                },
              })
            }
          >
            <LucideIcons.Plus className="h-4 w-4" /> Добавить операцию
          </Button>
        </div>
      </div>
    </div>
  );
}
