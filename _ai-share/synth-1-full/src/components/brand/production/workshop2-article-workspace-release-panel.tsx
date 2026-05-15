'use client';

import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  W2_ARTICLE_WORKSPACE_TAB_FIELD_CLASS as field,
  newW2ArticleTabPanelRowId as newRowId,
} from '@/components/brand/production/workshop2-article-workspace-tab-panels-shared';
import { Workshop2RoutingSheetPrint } from './workshop2-routing-sheet-print';

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

import { EmptyState } from '@/components/design-system/empty-state';

export function Workshop2ArticleReleasePanel({
  dossier = null,
}: {
  dossier?: Workshop2DossierPhase1 | null;
} = {}) {
  const { bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();
  
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [syncMode, setSyncMode] = useState<'merge' | 'overwrite'>('merge');
  
  if (loading || !bundle) return <p className="text-text-secondary text-sm">Загрузка…</p>;
  
  const rel = bundle.release ?? { note: '', shiftNote: '', subcontractNote: '', operations: [] };
  const operations = rel.operations ?? [];
  const totalSewingCostPerUnit = operations.reduce((acc, op) => acc + (op.costPerUnit || 0), 0);
  const totalSASH = operations.reduce((acc, op) => acc + (op.sash || 0), 0);

  const bundleId = bundle?.id || bundle?.articleId || '';

  const handleSyncFromTz = () => {
    const modelOps = dossier?.productionModel?.operations || [];
    let newOps = [];
    
    if (modelOps.length > 0) {
      newOps = modelOps.map(op => ({
        id: newRowId(),
        name: op.name || 'Операция',
        sash: op.sash || 0,
        machineSetupTime: 0,
        costPerUnit: op.costPerUnit || 0,
        status: 'pending' as const
      }));
    } else {
      setSyncDialogOpen(false);
      return;
    }
    
    let finalOps = operations;
    if (syncMode === 'overwrite') {
      finalOps = newOps;
    } else {
      // Merge strategy: keep completed/in-progress, append new
      const activeOps = operations.filter(o => o.status !== 'pending');
      finalOps = [...activeOps, ...newOps];
    }
    
    void mergeBundle({
      release: {
        ...rel,
        operations: finalOps,
      },
    });
    setSyncDialogOpen(false);
  };

  return (
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LucideIcons.Settings className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-text-primary text-base font-semibold">Выпуск · Техпроцесс</h2>
              <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                Ответственный: Логист / Производство
              </span>
            </div>
            <p className="text-text-secondary text-xs leading-snug">
              Операции техпроцесса, нормирование времени (SASH) и расценки на пошив.
            </p>
          </div>
        </div>
        <span
          className="border-border-default bg-bg-surface2 text-text-secondary shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px]"
        >
          {dataMode === 'http' ? 'API' : 'local'}
        </span>
      </div>
      
      <div className="border-border-subtle flex flex-col gap-1.5 border-t border-dotted pt-2.5 mt-4">
        <div className="flex flex-wrap gap-1.5">
          <span className="bg-bg-surface2/70 text-text-primary max-w-full rounded border border-border-subtle px-2 py-1 text-[10px] leading-snug">
            <span className="text-text-muted font-bold">Суть</span> · Операции: {operations.length}
          </span>
          <span className="text-text-primary max-w-full rounded border border-border-subtle bg-white px-2 py-1 text-[10px] font-semibold leading-snug">
            <span className="text-text-muted font-bold">Гот.</span> ·{' '}
            {operations.length === 0
              ? 'Техпроцесс не задан'
              : 'Техпроцесс в работе'}
          </span>
          <span className="bg-bg-surface2/70 text-text-primary max-w-full rounded border border-border-subtle px-2 py-1 text-[10px] leading-snug">
            <span className="text-text-muted font-bold">SASH</span> · {totalSASH.toFixed(2)} мин
          </span>
        </div>
      </div>

      <div className="min-w-0 space-y-4 mt-4">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-text-primary text-sm font-semibold flex items-center gap-1.5">
                <LucideIcons.ListChecks className="w-4 h-4 text-slate-400" />
                Технологические операции
              </p>
              <div className="flex gap-4 text-right">
                <div className="flex flex-col">
                  <span className="text-text-muted text-[10px] font-medium">Общее время</span>
                  <span className="text-text-primary text-sm font-semibold">{totalSASH.toFixed(2)} мин</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-text-muted text-[10px] font-medium">Итого (пошив)</span>
                  <span className="text-text-primary text-sm font-semibold">{totalSewingCostPerUnit.toLocaleString()} ₽/ед</span>
                </div>
                <div className="border-l pl-4 border-border-subtle flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-[11px] text-slate-700 border-slate-200 hover:bg-slate-50"
                    onClick={() => setPrintDialogOpen(true)}
                    disabled={!bundleId}
                  >
                    <LucideIcons.Printer className="w-3.5 h-3.5 mr-1" />
                    Print Route Sheet
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-[11px] text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    onClick={() => {
                      if (operations.length > 0) {
                        setSyncDialogOpen(true);
                      } else {
                        handleSyncFromTz();
                      }
                    }}
                  >
                    <LucideIcons.Wand2 className="w-3.5 h-3.5 mr-1" />
                    Загрузить из умной маршрутизации (ТЗ)
                  </Button>
                </div>
              </div>
            </div>
            
            <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <LucideIcons.AlertCircle className="w-5 h-5 text-indigo-500" />
                    Конфликт версий ТЗ
                  </DialogTitle>
                  <DialogDescription>
                    В текущей партии уже есть запущенные операции. Выберите стратегию слияния с актуальным ТЗ (Досье).
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div 
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors",
                      syncMode === 'merge' ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:bg-slate-50"
                    )}
                    onClick={() => setSyncMode('merge')}
                  >
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <LucideIcons.GitMerge className="w-4 h-4 text-indigo-500" />
                      Мягкое слияние (Smart Merge)
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Оставить текущие операции со статусом "В работе" и "Готово". Добавить новые из ТЗ только со статусом "Ожидает".
                    </p>
                  </div>
                  <div 
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors",
                      syncMode === 'overwrite' ? "border-red-500 bg-red-50" : "border-slate-200 hover:bg-slate-50"
                    )}
                    onClick={() => setSyncMode('overwrite')}
                  >
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <LucideIcons.AlertTriangle className="w-4 h-4 text-red-500" />
                      Жесткая перезапись (Overwrite)
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Удалить все текущие операции партии и загрузить чистый техпроцесс из ТЗ.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" size="sm" onClick={() => setSyncDialogOpen(false)}>Отмена</Button>
                  <Button 
                    size="sm" 
                    className={syncMode === 'overwrite' ? "bg-red-600 hover:bg-red-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}
                    onClick={handleSyncFromTz}
                  >
                    Применить
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

        {operations.length === 0 ? (
          <EmptyState
            title="Операции не заданы"
            description="Заполните модель в ТЗ перед загрузкой или добавьте операции вручную."
            icon={<LucideIcons.Scissors className="h-10 w-10 stroke-[1.25]" />}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-[11px] text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              onClick={() => {
                if (operations.length > 0) {
                  setSyncDialogOpen(true);
                } else {
                  handleSyncFromTz();
                }
              }}
            >
              <LucideIcons.Wand2 className="w-3.5 h-3.5 mr-1" />
              Загрузить из умной маршрутизации (ТЗ)
            </Button>
          </EmptyState>
        ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border-subtle text-text-secondary border-b text-left">
                      <th className="pb-2 font-medium">Название</th>
                      <th className="pb-2 font-medium">SASH (мин)</th>
                      <th className="pb-2 font-medium">Переналадка (мин)</th>
                      <th className="pb-2 font-medium">Цена (₽)</th>
                      <th className="pb-2 font-medium">Статус</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-border-subtle divide-y">
                    {operations.map((op) => (
                      <tr key={op.id}>
                        <td className="py-2 pr-2">
                          <Input
                            className="h-8 text-[11px] focus:bg-white"
                            value={op.name}
                            onChange={(e) => {
                              const name = e.target.value;
                              void mergeBundle({
                                release: {
                                  ...rel,
                                  operations: operations.map((o) =>
                                    o.id === op.id ? { ...o, name } : o
                                  ),
                                },
                              });
                            }}
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <Input
                            className="h-8 w-20 text-[11px] focus:bg-white"
                            value={op.sash}
                            type="number"
                            onChange={(e) => {
                              const sash = Number(e.target.value);
                              void mergeBundle({
                                release: {
                                  ...rel,
                                  operations: operations.map((o) =>
                                    o.id === op.id ? { ...o, sash } : o
                                  ),
                                },
                              });
                            }}
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <Input
                            className="h-8 w-24 text-[11px] focus:bg-white"
                            value={op.machineSetupTime || ''}
                            type="number"
                            onChange={(e) => {
                              const machineSetupTime = Number(e.target.value);
                              void mergeBundle({
                                release: {
                                  ...rel,
                                  operations: operations.map((o) =>
                                    o.id === op.id ? { ...o, machineSetupTime } : o
                                  ),
                                },
                              });
                            }}
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <Input
                            className="h-8 w-24 text-[11px] focus:bg-white"
                            value={op.costPerUnit}
                            type="number"
                            onChange={(e) => {
                              const costPerUnit = Number(e.target.value);
                              void mergeBundle({
                                release: {
                                  ...rel,
                                  operations: operations.map((o) =>
                                    o.id === op.id ? { ...o, costPerUnit } : o
                                  ),
                                },
                              });
                            }}
                          />
                        </td>
                    <td className="py-2 pr-2">
                          <select
                            className={cn(field, "h-8 text-[11px] font-medium focus:bg-white")}
                            value={op.status}
                            onChange={(e) => {
                              const status = e.target.value as (typeof operations)[0]['status'];
                              void mergeBundle({
                                release: {
                                  ...rel,
                                  operations: operations.map((o) =>
                                    o.id === op.id ? { ...o, status } : o
                                  ),
                                },
                              });
                            }}
                          >
                            <option value="pending">Ожидает</option>
                            <option value="in_progress">В работе</option>
                            <option value="completed">Готово</option>
                          </select>
                        </td>
                    <td className="py-2 text-right">
                      {op.status !== 'completed' ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-text-muted h-8 w-8 hover:bg-red-50 hover:text-red-500"
                          onClick={() => {
                            void mergeBundle({
                              release: {
                                ...rel,
                                operations: operations.filter((o) => o.id !== op.id),
                              },
                            });
                          }}
                        >
                          <LucideIcons.Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                void mergeBundle({
                  release: {
                    ...rel,
                    operations: [
                      ...operations,
                      {
                        id: newRowId(),
                        name: 'Новая операция',
                        sash: 0,
                        costPerUnit: 0,
                        status: 'pending',
                      },
                    ],
                  },
                });
              }}
            >
              Добавить операцию
            </Button>
          </div>

        <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-text-secondary text-[11px] font-medium tracking-wide">
                Смены
              </label>
              <Textarea
                className="min-h-[60px] py-2 text-[11px] bg-white resize-none"
                value={rel.shiftNote ?? ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => void mergeBundle({ release: { ...rel, shiftNote: e.target.value } })}
                placeholder="График работы, мастера..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-text-secondary text-[11px] font-medium tracking-wide">
                Субподряд
              </label>
              <Textarea
                className="min-h-[60px] py-2 text-[11px] bg-white resize-none"
                value={rel.subcontractNote ?? ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  void mergeBundle({ release: { ...rel, subcontractNote: e.target.value } })
                }
                placeholder="Внешние цеха, спец. операции..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-text-secondary text-[11px] font-medium tracking-wide">
                Материалы для образца
              </label>
              <Textarea
                className="min-h-[60px] py-2 text-[11px] bg-white resize-none"
                value={rel.sampleMaterialsNote ?? ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  void mergeBundle({ release: { ...rel, sampleMaterialsNote: e.target.value } })
                }
                placeholder="Ткань, фурнитура для отшива..."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-text-secondary text-[11px] font-medium tracking-wide">
              Общая заметка
            </label>
            <Textarea
              className="min-h-[80px] py-2 text-[11px] bg-white resize-none"
              value={rel.note ?? ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => void mergeBundle({ release: { ...rel, note: e.target.value } })}
              placeholder="Особые инструкции по выпуску..."
            />
          </div>
        </div>
      </div>

      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Print Routing Sheet</DialogTitle>
            <DialogDescription>
              Preview the routing sheet below before printing for the factory floor.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-gray-100 p-4 rounded overflow-auto flex justify-center">
            <div id="routing-sheet-print-area" className="w-[794px] bg-white shadow-sm print:shadow-none">
              <Workshop2RoutingSheetPrint 
                bundleId={bundleId} 
                operations={operations} 
                articleId={bundle?.articleId} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrintDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => {
                const printContent = document.getElementById('routing-sheet-print-area');
                if (!printContent) return;
                
                const printWindow = window.open('', '_blank');
                if (!printWindow) return;
                
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Routing Sheet - ${bundleId}</title>
                      <script src="https://cdn.tailwindcss.com"></script>
                      <style>
                        @media print {
                          @page { margin: 1cm; size: A4; }
                          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        }
                      </style>
                    </head>
                    <body>
                      ${printContent.innerHTML}
                      <script>
                        setTimeout(() => {
                          window.print();
                          window.close();
                        }, 500);
                      </script>
                    </body>
                  </html>
                `);
                printWindow.document.close();
              }}
            >
              <LucideIcons.Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
