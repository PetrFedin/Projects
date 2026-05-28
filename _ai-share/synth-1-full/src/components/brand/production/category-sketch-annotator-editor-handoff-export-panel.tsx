'use client';

import type { ReactNode } from 'react';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ClipboardList, Download, ImageDown, Printer, Send } from 'lucide-react';
import type { SketchRevisionCompareResult } from '@/lib/production/sketch-revision-diff';
import type {
  Workshop2CategorySketchCompliance,
  Workshop2SketchPropagatedDraft,
  Workshop2SketchRevisionSnapshot,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { CategorySketchAnnotatorPatch } from '@/components/brand/production/category-sketch-annotator-types';

export type CategorySketchAnnotatorEditorHandoffExportPanelProps = {
  readOnly: boolean;
  sketchTasksPanel?: ReactNode;
  categorySketchRevisionLabel?: string;
  categorySketchFreezeUntilDate?: string;
  compliance: Workshop2CategorySketchCompliance;
  onPatch: (patch: CategorySketchAnnotatorPatch) => void;
  categorySketchRevisionSnapshots: Workshop2SketchRevisionSnapshot[];
  compareSnapIdA: string;
  compareSnapIdB: string;
  setCompareSnapIdA: (id: string) => void;
  setCompareSnapIdB: (id: string) => void;
  revisionDiff: SketchRevisionCompareResult | null;
  onAppendSketchRevisionSnapshot?: () => void;
  auditActor?: string;
  exportBusy: boolean;
  onExportPng: () => void;
  onPrintA4: () => void;
  onPrintHandoffPackage: () => void;
  onAppendPropagatedDrafts: () => void;
  onCriticalCsv: () => void;
  onMesQualityCsv: () => void;
  onMesQcCsv: () => void;
  webhookBusy: boolean;
  onCriticalWebhook: () => void;
  mesTopCodesOnBoard: { code: string; count: number }[];
  lastExportSummary: string;
  sketchPropagatedDrafts: Workshop2SketchPropagatedDraft[];
};

export function CategorySketchAnnotatorEditorHandoffExportPanel({
  readOnly,
  sketchTasksPanel,
  categorySketchRevisionLabel,
  categorySketchFreezeUntilDate,
  compliance,
  onPatch,
  categorySketchRevisionSnapshots,
  compareSnapIdA,
  compareSnapIdB,
  setCompareSnapIdA,
  setCompareSnapIdB,
  revisionDiff,
  onAppendSketchRevisionSnapshot,
  auditActor,
  exportBusy,
  onExportPng,
  onPrintA4,
  onPrintHandoffPackage,
  onAppendPropagatedDrafts,
  onCriticalCsv,
  onMesQualityCsv,
  onMesQcCsv,
  webhookBusy,
  onCriticalWebhook,
  mesTopCodesOnBoard,
  lastExportSummary,
  sketchPropagatedDrafts,
}: CategorySketchAnnotatorEditorHandoffExportPanelProps) {
  return (
    <details className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50">
      <summary className="cursor-pointer list-none px-3 py-2 text-xs font-medium text-zinc-800 [&::-webkit-details-marker]:hidden">
        Печать, экспорт, MES, ревизия
      </summary>
      <div className="border-t border-zinc-200 p-2">
        <Tabs defaultValue="handoff" className="w-full">
          <TabsList className={cn(cabinetSurface.tabsList, 'mb-2 h-auto rounded-md shadow-inner')}>
            <TabsTrigger value="handoff" className="px-2 py-1.5 text-xs">
              Документы и MES
            </TabsTrigger>
            {sketchTasksPanel ? (
              <TabsTrigger value="tasks" className="px-2 py-1.5 text-xs">
                Задачи L1→L3
              </TabsTrigger>
            ) : null}
          </TabsList>
          <TabsContent
            value="handoff"
            className="mt-0 space-y-2 rounded-lg border border-zinc-200 bg-white p-2.5 text-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Ревизия · комплаенс · экспорт
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="space-y-0.5">
                <span className="text-[9px] font-semibold text-zinc-500">Ревизия скетча</span>
                <Input
                  className="h-8 text-sm"
                  value={categorySketchRevisionLabel ?? ''}
                  disabled={readOnly}
                  placeholder="Вариант A/B, №"
                  onChange={(e) =>
                    onPatch({ categorySketchRevisionLabel: e.target.value || undefined })
                  }
                />
              </label>
              <label className="space-y-0.5">
                <span className="text-[9px] font-semibold text-zinc-500">Заморозка до</span>
                <Input
                  type="date"
                  className="h-8 text-sm"
                  value={categorySketchFreezeUntilDate ?? ''}
                  disabled={readOnly}
                  onChange={(e) =>
                    onPatch({ categorySketchFreezeUntilDate: e.target.value || undefined })
                  }
                />
              </label>
              <label className="space-y-0.5 sm:col-span-2">
                <span className="text-[9px] font-semibold text-zinc-500">
                  Утверждённый референс
                </span>
                <Input
                  className="h-8 text-sm"
                  value={compliance.approvedReferenceUrl ?? ''}
                  disabled={readOnly}
                  onChange={(e) =>
                    onPatch({
                      categorySketchCompliance: {
                        ...compliance,
                        approvedReferenceUrl: e.target.value || undefined,
                      },
                    })
                  }
                />
              </label>
              <label className="space-y-0.5">
                <span className="text-[9px] font-semibold text-zinc-500">Версия лекал</span>
                <Input
                  className="h-8 text-sm"
                  value={compliance.patternPackVersion ?? ''}
                  disabled={readOnly}
                  onChange={(e) =>
                    onPatch({
                      categorySketchCompliance: {
                        ...compliance,
                        patternPackVersion: e.target.value || undefined,
                      },
                    })
                  }
                />
              </label>
              <label className="space-y-0.5">
                <span className="text-[9px] font-semibold text-zinc-500">Акт образца</span>
                <Input
                  className="h-8 text-sm"
                  value={compliance.sampleAcceptanceActRef ?? ''}
                  disabled={readOnly}
                  onChange={(e) =>
                    onPatch({
                      categorySketchCompliance: {
                        ...compliance,
                        sampleAcceptanceActRef: e.target.value || undefined,
                      },
                    })
                  }
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                disabled={readOnly || !onAppendSketchRevisionSnapshot}
                onClick={() => onAppendSketchRevisionSnapshot?.()}
              >
                Снимок ревизии в архив
              </Button>
              {categorySketchRevisionSnapshots.length > 0 ? (
                <details className="max-w-full text-xs text-zinc-600">
                  <summary className="cursor-pointer font-medium text-zinc-700">
                    Архив ({categorySketchRevisionSnapshots.length})
                  </summary>
                  <ul className="mt-1 max-h-28 space-y-0.5 overflow-y-auto font-mono text-[9px]">
                    {[...categorySketchRevisionSnapshots]
                      .reverse()
                      .slice(0, 12)
                      .map((s) => (
                        <li key={s.snapshotId}>
                          {s.revisionLabel} · {s.annotations.length} мет. · {s.by} ·{' '}
                          {(() => {
                            try {
                              return new Date(s.at).toLocaleString('ru-RU');
                            } catch {
                              return s.at;
                            }
                          })()}
                        </li>
                      ))}
                  </ul>
                  {categorySketchRevisionSnapshots.length >= 2 ? (
                    <div className="mt-2 space-y-2 rounded-md border border-zinc-200 bg-zinc-50/90 p-2 text-[9px] text-zinc-800">
                      <p className="font-semibold text-zinc-900">Сравнение снимков A ↔ B</p>
                      <div className="flex flex-wrap gap-2">
                        <label className="flex flex-col gap-0.5">
                          <span className="text-[8px] uppercase text-zinc-500">Снимок A</span>
                          <select
                            className="h-8 max-w-56 rounded border border-zinc-200 bg-white px-1 text-[9px]"
                            value={compareSnapIdA}
                            onChange={(e) => setCompareSnapIdA(e.target.value)}
                          >
                            <option value="">—</option>
                            {[...categorySketchRevisionSnapshots].reverse().map((s) => (
                              <option key={s.snapshotId} value={s.snapshotId}>
                                {s.revisionLabel} · {new Date(s.at).toLocaleDateString('ru-RU')}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="flex flex-col gap-0.5">
                          <span className="text-[8px] uppercase text-zinc-500">Снимок B</span>
                          <select
                            className="h-8 max-w-56 rounded border border-zinc-200 bg-white px-1 text-[9px]"
                            value={compareSnapIdB}
                            onChange={(e) => setCompareSnapIdB(e.target.value)}
                          >
                            <option value="">—</option>
                            {[...categorySketchRevisionSnapshots].reverse().map((s) => (
                              <option key={`b-${s.snapshotId}`} value={s.snapshotId}>
                                {s.revisionLabel} · {new Date(s.at).toLocaleDateString('ru-RU')}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      {revisionDiff ? (
                        <div className="space-y-1 border-t border-zinc-200 pt-2 font-mono text-[8px] leading-snug">
                          <p>
                            Меток: {revisionDiff.countA} → {revisionDiff.countB}
                            {revisionDiff.leafMismatch ? (
                              <span className="text-amber-700"> · разные ветки leafId</span>
                            ) : null}
                          </p>
                          <p>
                            + {revisionDiff.addedIds.length} id · − {revisionDiff.removedIds.length}{' '}
                            id
                          </p>
                          {revisionDiff.changed.length > 0 ? (
                            <table className="w-full border-collapse text-left">
                              <thead>
                                <tr className="border-b border-zinc-200">
                                  <th className="py-0.5 pr-1">annotationId</th>
                                  <th className="py-0.5">изменения</th>
                                </tr>
                              </thead>
                              <tbody>
                                {revisionDiff.changed.slice(0, 24).map((row) => (
                                  <tr key={row.annotationId} className="border-b border-zinc-100">
                                    <td className="py-0.5 pr-1 align-top">
                                      {row.annotationId.slice(0, 10)}…
                                    </td>
                                    <td className="py-0.5 align-top">
                                      {row.diffs.map((d) => (
                                        <span
                                          key={`${row.annotationId}-${d.field}`}
                                          className="mr-1 block"
                                        >
                                          {d.field}: {d.from} → {d.to}
                                        </span>
                                      ))}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-zinc-500">
                              Поля priority / stage / BOM ref совпадают.
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-zinc-500">Выберите два разных снимка.</p>
                      )}
                    </div>
                  ) : null}
                </details>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 text-xs"
                disabled={readOnly || !auditActor}
                onClick={() =>
                  onPatch({
                    categorySketchProductionApproved: {
                      by: auditActor ?? '—',
                      at: new Date().toISOString(),
                    },
                  })
                }
              >
                Утвердить для производства
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-zinc-100 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                disabled={exportBusy}
                onClick={() => void onExportPng()}
              >
                <ImageDown className="size-3.5" />
                PNG
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={onPrintA4}
              >
                <Printer className="size-3.5" />
                Печать А4
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={onPrintHandoffPackage}
              >
                <Printer className="size-3.5" />
                Лист в цех
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-zinc-100 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 gap-1 text-xs"
                disabled={readOnly}
                onClick={onAppendPropagatedDrafts}
              >
                <ClipboardList className="size-3.5" />В посадку / ОТК
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={onCriticalCsv}
              >
                <Download className="size-3.5" />
                CSV критич.
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={onMesQualityCsv}
              >
                <Download className="size-3.5" />
                MES все
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={onMesQcCsv}
              >
                <Download className="size-3.5" />
                MES ОТК+крит.
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                disabled={webhookBusy || readOnly}
                title={readOnly ? 'В режиме цеха отправка в MES отключена' : undefined}
                onClick={() => void onCriticalWebhook()}
              >
                <Send className="size-3.5" />
                {webhookBusy ? '…' : 'В MES'}
              </Button>
            </div>
            {mesTopCodesOnBoard.length > 0 ? (
              <p className="text-[9px] leading-snug text-zinc-600">
                <span className="font-semibold text-zinc-700">Топ кодов MES на доске:</span>{' '}
                {mesTopCodesOnBoard.map((x) => `${x.code} (${x.count})`).join(', ')}
              </p>
            ) : null}
            {lastExportSummary ? (
              <p className="rounded border border-emerald-200 bg-emerald-50/80 px-2 py-1 text-[9px] text-emerald-950">
                Последний экспорт / отправка: {lastExportSummary}
              </p>
            ) : null}
            {sketchPropagatedDrafts.length > 0 ? (
              <ul className="max-h-32 space-y-1 overflow-y-auto border-t border-zinc-100 pt-2 text-xs">
                {sketchPropagatedDrafts.map((d) => (
                  <li
                    key={d.draftId}
                    className="flex justify-between gap-2 border-b border-zinc-50 pb-1"
                  >
                    <span className="min-w-0 text-zinc-700">
                      <span className="font-semibold text-teal-800">
                        {d.kind === 'fit' ? 'Посадка' : 'ОТК'}:
                      </span>{' '}
                      {d.text}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 shrink-0 text-[9px]"
                      onClick={() => void navigator.clipboard.writeText(d.text)}
                    >
                      Копир.
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}
          </TabsContent>
          {sketchTasksPanel ? (
            <TabsContent
              value="tasks"
              className="mt-0 max-h-[min(85dvh,640px)] overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50/50 p-2"
            >
              {sketchTasksPanel}
            </TabsContent>
          ) : null}
        </Tabs>
      </div>
    </details>
  );
}
